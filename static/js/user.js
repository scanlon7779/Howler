import api from './APIClient.js';
const user = JSON.parse(localStorage.getItem('user'));
const userPage = JSON.parse(localStorage.getItem('userPage'));
const howlsContainer = document.querySelector('.howls');
const currentDate = new Date();
const profilePic = document.getElementById('profile-pic');
const username = document.getElementById('username');
const name = document.getElementById('name');
const followButton = document.querySelector('.follow-button');
const unfollowButton = document.querySelector('.unfollow-button');
const successPopup = document.getElementById("success-popup");
const errorPopup = document.getElementById("error-popup");
const okButton1 = document.getElementById("ok-button1");
const okButton2 = document.getElementById("ok-button2");
const logoutButton = document.getElementById('logout');

logoutButton.addEventListener('click', e => {
  localStorage.removeItem('user');
  localStorage.removeItem('userPage');
  document.location = "/";
});


profilePic.src = userPage.avatar;
username.textContent = userPage.username;
name.textContent = `${userPage.first_name} ${userPage.last_name}`;


document.getElementById("username").textContent = user.username;
const userLink = document.getElementById("username");
userLink.addEventListener('click', e => {
  e.preventDefault();
  api.getUserByUsername(user.username).then(userData => {
    localStorage.setItem('userPage', JSON.stringify(userData));
    document.location = "/user";
  }).catch((err) => {
    console.error(err);
  });
});

async function followButtons() {
  api.getFollowing(user.id).then(userIds => {

    if (userIds.includes(userPage.id)) {
      document.querySelector('.unfollow-button').hidden = false;
      document.querySelector('.follow-button').hidden = true;
    } else if(user.id == userPage.id) {
      document.querySelector('.unfollow-button').hidden = true;
      document.querySelector('.follow-button').hidden = true;
    } else {
      document.querySelector('.follow-button').hidden = false;
      document.querySelector('.unfollow-button').hidden = true;
    }
  }).catch((err) => {
    console.error(err);
  })
}

followButton.addEventListener('click', e => {
  e.preventDefault();
  api.follow(user.id, userPage.id).then(data => {
    document.querySelector('.unfollow-button').hidden = false;
    document.querySelector('.follow-button').hidden = true;
    const successMessage = successPopup.querySelector("p");
    successMessage.textContent = `You are now following ${userPage.first_name} ${userPage.last_name} @${userPage.username}`;
    successPopup.style.display = "block";
  }).catch((err) => {
    console.error(err);
    errorPopup.style.display = "block";
  });
});

unfollowButton.addEventListener('click', e => {
  e.preventDefault();
  api.unfollow(user.id, userPage.id).then(data => {
    document.querySelector('.unfollow-button').hidden = false;
    document.querySelector('.follow-button').hidden = true;
    const successMessage = successPopup.querySelector("p");
    successMessage.textContent = `You are no longer following ${userPage.first_name} ${userPage.last_name} @${userPage.username}`;
    successPopup.style.display = "block";
  }).catch((err) => {
    console.error(err);
    errorPopup.style.display = "block";
  });
});

okButton1.addEventListener('click', e => {
  successPopup.style.display = "none"; 
  location.reload();
});

okButton2.addEventListener('click', e => {
  errorPopup.style.display = "none"; 
  location.reload();
});


async function getUserFollows() {
  api.getFollowing(userPage.id).then(userIds => {
    const userList = document.createElement('ul');
    userList.classList.add('follow-list');
    userIds.forEach(userId => {
      api.getUserById(userId).then(user => {
        const userAvatar = document.createElement('img');
        userAvatar.src = user.avatar;
        const userLink = document.createElement('a');
        userLink.href = `./feed`;
        userLink.innerText = `${user.first_name} ${user.last_name} @${user.username}`;
        userLink.setAttribute('data-username', user.username);
        userLink.classList.add('followLink');

        const listItem = document.createElement('li');
        listItem.appendChild(userAvatar);
        listItem.appendChild(userLink);
        userList.appendChild(listItem);

        const followLink = listItem.querySelector('.followLink');
        followLink.addEventListener('click', e => {
          e.preventDefault();
          const username = e.target.getAttribute('data-username');
          api.getUserByUsername(username).then(userData => {
            localStorage.setItem('userPage', JSON.stringify(userData));
            document.location = "/user";
          }).catch((err) => {
            console.error(err);
          });
        });

      }).catch((err) => {
        console.error(err);
      });
    });

    const container = document.querySelector('.container');
    container.appendChild(userList);
  }).catch((err) => {
    console.error(err);
  });
}



const formatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true
});

async function fetchUserHowls() {
  try {
    const howls = await api.getHowlsByUserId(userPage.id);
    howls.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
    howls.forEach(howl => {
      api.getUserById(howl.userId).then(user => {
        const date = new Date(howl.datetime);
        const formattedDate = formatter.format(date);
        const div = document.createElement('div');
        div.classList.add('howl');
        div.innerHTML = `
          <div class="box">
            <div class="header">
              <h2><a href="./user" class="usernameLink" data-username="${user.username}">${user.first_name} ${user.last_name}  @${user.username}</a> - ${formattedDate}</h2>
            </div>
            <div class="text">
              <p>${howl.text}</p>
            </div>
          </div>
        `;
        howlsContainer.appendChild(div);
        const usernameLink = div.querySelector('.usernameLink');
        usernameLink.addEventListener('click', e => {
          e.preventDefault();
          const username = e.target.getAttribute('data-username');
          api.getUserByUsername(username).then(userData => {
            localStorage.setItem('userPage', JSON.stringify(userData));
            document.location = "/user";
          }).catch((err) => {
            console.error(err);
          });
        });
      }).catch(err => {
        console.error(err);
      });
    });
  } catch (err) {
    console.error(err);
  }
};



fetchUserHowls();
getUserFollows();
followButtons();