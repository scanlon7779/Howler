import api from './APIClient.js';
const user = JSON.parse(localStorage.getItem('user'));
const postButton = document.querySelector('#postButton');
const howlsContainer = document.querySelector('.howls');
const howlTextArea = document.getElementById("howlTextArea");
const currentDate = new Date();
const isoDate = currentDate.toISOString();
const errorBox = document.querySelector('#errorbox');
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

const formatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true
});

postButton.addEventListener('click', e => {
  e.preventDefault();

  api.howl(user.id, isoDate, howlTextArea.value).then(userData => {
      successPopup.style.display = "block";
  }).catch((err) => {

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

async function fetchUserHowls() {
    api.getHowlsFollowedByUserId(user.id).then(howls => {
        howls.forEach(howl => {
            api.getUserById(howl.userId).then(user => {
              const date = new Date(howl.datetime);
              const formattedDate = formatter.format(date);
              const div = document.createElement('div');
              div.classList.add('howl');
              div.innerHTML = `
                <div class="box">
                  <div class="header">
                    <h2><a href="./feed" class="usernameLink" data-username="${user.username}">${user.first_name} ${user.last_name}  @${user.username}</a> - ${formattedDate}</h2>
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
        }).catch(err => {
          console.error(err);
        });
};

fetchUserHowls();