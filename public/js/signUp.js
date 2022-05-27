/*
Notes about signUp.js
This file contains all the javascript for signUp.html. 
Functions below sends sign-up input fields to the server
for verification. Creates a new user account if verified.
*/

'use strict';

//Sends input field data to server to be inserted into db.
async function submitSignUp(data) {
  try {
    let response = await fetch("/newSignUp", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
    });
    let parsedJSON = await response.json();
    document.getElementById("errorMsg").innerHTML = "";
    document.getElementById("errorMsg").innerHTML = parsedJSON.msg + "<br/>";
  } catch (error) {
    console.log(error);
  }
};

//event listener to call submitSignUp method upon button click.
document.getElementById("signUpButton").addEventListener("click", function (e) {
  submitSignUp({
    fname: document.getElementById("fname").value.replace(/\s+/g, ''),
    lname: document.getElementById("lname").value.replace(/\s+/g, ''),
    email: document.getElementById("email").value.replace(/\s+/g, ''),
    displayName: document.getElementById("displayName").value.replace(/\s+/g, ''),
    password: document.getElementById("password").value.replace(/\s+/g, '')
  });
});

// Easter Egg on Signup Page 
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