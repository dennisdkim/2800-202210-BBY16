'use strict';

// loads users first and last name in a greeting on home page
// temporary function placement.
loadGreetingName();

function loadGreetingName() {
  const option = {
    method: 'GET',
  }
  fetch("/getUserInfo", option).then(
    function (res) {
      const result = res.json().then(
        greetingName => {
          document.getElementById("greeting-message-username").innerHTML = greetingName.fname + " " + greetingName.lname;
        }
      )
    }
  )
}