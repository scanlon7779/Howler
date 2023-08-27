import api from './APIClient.js';

const loginButton = document.querySelector('#loginButton');
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const errorPopup = document.getElementById("error-popup");
const okButton2 = document.getElementById("ok-button2");

//const errorBox = document.querySelector('#errorbox');


loginButton.addEventListener('click', e => {

  //errorBox.classList.add("hidden");
  

  api.logIn(username.value, password.value).then(userData => {
    localStorage.setItem('user', JSON.stringify(userData));
    document.location = "/feed";
  }).catch((err) => {

    errorPopup.style.display = "block";
    //errorBox.innerHTML = err;
  });
});

okButton2.addEventListener('click', e => {
  errorPopup.style.display = "none"; // hide popup
  location.reload();
});