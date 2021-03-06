/*
Notes about login.js
This file contains all the javascript for login.html
Functions below sends user and password input to the 
server for verification. 
Functions also contain our animation of our logo.
*/

'use strict';

// Function definition to submit login credential info. The user input params are sent to server for authentication
async function submitLogin(data) {
  try {
    let response = await fetch("/login", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
    });
    let parsedJSON = await response.json();
    if (parsedJSON.status == "success") {
      window.location.replace("/home");
    } else {
      document.getElementById("errorMsg").innerHTML = parsedJSON.msg;
    }
  } catch (error) {
    console.log(error);
  }
}

// Event listener for "Login" button. Upon clicking it, it will take the params in html fields and passes it to submitLogin()
document.getElementById("loginButton").addEventListener("click", function (e) {
  submitLogin({
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  });
});

// Event listener for password input field. Allows users to press enter to log in.
document.getElementById("password").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    submitLogin({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    });
  }
});

// Easter Egg on Login Page 
var animationToggle = false;
var windSound = new Audio('/sounds/wind.mp3');
windSound.loop = true;

// When the fan is clicked, animation will play where it will spin
function spinFan() {
  if (animationToggle) {
    windSound.pause();
    document.getElementById("fanImg").className = "";
    animationToggle = false;
  } else {
    windSound.play();
    document.getElementById("fanImg").className = "spinnable";
    animationToggle = true;
  }
}

// login input replaces spaces
let loginInputs = document.getElementsByClassName("login-input");
[].forEach.call(loginInputs, function (input) {
  input.value.replace(/\s/g, "");
});