'use strict';

// Buttons // 
let cancelButton = document.getElementById("cancelButton");
let saveButton = document.getElementById("saveButton");

// Load Current Profile Data Function Definition
async function loadProfileData() {
  try {
    let profileInfo = await fetch("/getUserInfo", {
      method: 'GET',
    });
    let infoParsed = await profileInfo.json();
    document.getElementById("fname").value = infoParsed.fname;
    document.getElementById("lname").value = infoParsed.lname;
    document.getElementById("displayName").value = infoParsed.displayName;
  } catch (error) {
    console.log(error);
  }
}

async function verifyPassword(passwords) {
  let verified = false;
  try {
    let pwStatus = await fetch("/verifyPw", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(passwords)
    });
    let parsedResponse = await pwStatus.json();
    console.log("From server: ", parsedResponse);
    if (parsedResponse.status == "fail") {
      document.getElementById("errorMessage").innerHTML = parsedResponse.msg;
    } else {
      verified = true;
    }
    return verified;
  } catch (error) {
    console.log(error);
  }
}

async function submitChanges(newInfo) {
  try {
    let submitStatus = await fetch("/submit-changes", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(newInfo)
    });
    let parsedResponse = await submitStatus.json();
    if (parsedResponse.status == "success") {
      document.getElementById("errorMessage").innerHTML = parsedResponse.msg;
    }
  } catch (error) {
    console.log(error);
  }
}

// Calling loadProfileData
loadProfileData();

saveButton.addEventListener("click", function (e) {
  verifyPassword({
    password1: document.getElementById("password").value,
    password2: document.getElementById("passwordVerify").value
  }).then((verified) => {
    console.log(verified);
    if (verified) {
      let changes = {
        fname: document.getElementById("fname").value,
        lname: document.getElementById("lname").value,
        displayName: document.getElementById("displayName").value,
        newPw: document.getElementById("newPassword").value
      };
      submitChanges(changes);
      document.getElementById("newPassword").value = "";
      document.getElementById("password").value = "";
      document.getElementById("passwordVerify").value = "";
    }
  });
});