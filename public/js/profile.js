'use strict';

// Buttons // 
let cancelButton = document.getElementById("cancelButton");
let saveButton = document.getElementById("saveButton");

// Load Current Profile Data
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

loadProfileData();