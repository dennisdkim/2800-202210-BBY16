'use strict';
// Fields //
var oldFirstName;
var oldLastName;
var oldDisplayName;
var oldEmail;

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
    document.getElementById("fnameDisplay").innerHTML = infoParsed.fname;
    document.getElementById("fname").value = infoParsed.fname;
    document.getElementById("lnameDisplay").innerHTML = infoParsed.lname;
    document.getElementById("lname").value = infoParsed.lname;
    document.getElementById("displayNameDisplay").innerHTML = infoParsed.displayName;
    document.getElementById("displayName").value = infoParsed.displayName;
    document.getElementById("email").value = infoParsed.email;
    //Saving initial values in case changes need to be reverted 
    oldFirstName = infoParsed.fname;
    oldLastName = infoParsed.lname;
    oldDisplayName = infoParsed.displayName;
    oldEmail = infoParsed.email;
    //DOM calls to insert display pic into div #avatar if it exists
    if (infoParsed.avatarExists) {
      var avatar = document.createElement("img");
      avatar.src = "/img/userAvatars/avatar-user" + infoParsed.userID + ".png";
      avatar.setAttribute("alt", "user " + infoParsed.userID +"'s avatar");
      document.getElementById("profile-info").replaceChild(avatar, document.getElementById("avatar"));
    }
  } catch (error) {
    alert(error);
  }
}

// Verifies the two passwords at the bottom of the page before committing any changes
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
    if (parsedResponse.status == "fail") {
      document.getElementById("pwMessage").innerHTML = parsedResponse.msg;
    } else {
      verified = true;
      document.getElementById("pwMessage").innerHTML = "Password Authentication successful";
    }
    return verified;
  } catch (error) {
    alert(error);
  }
}

// Submits the new values in the inputs to the database given the display name is unique
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
    document.getElementById("errorMessage").innerHTML = parsedResponse.msg;
  } catch (error) {
    alert(error);
  }
}

//Uploads display picture into app's file system and will be named according to current user id
function uploadAvatar(e) {
  e.preventDefault();
  const avatarUpload = document.querySelector("#avatar-upload");
  const formData = new FormData();
  formData.append("avatar", avatarUpload.files[0]);

  fetch("/upload-avatar", {
    method: 'POST',
    body: formData
  }).catch((err) => { ("Error:", err); });
}

// Calling loadProfileData
loadProfileData();

// Saves new data onto the database when the "save button" is clicked and passwords match 
saveButton.addEventListener("click", function (e) {
  verifyPassword({
    password1: document.getElementById("password").value,
    password2: document.getElementById("passwordVerify").value
  }).then((verified) => {
    if (verified) {
      let changes = {
        fname: document.getElementById("fname").value,
        lname: document.getElementById("lname").value,
        displayName: document.getElementById("displayName").value,
        email: document.getElementById("email").value,
        newPw: document.getElementById("newPassword").value
      };
      submitChanges(changes);
      if (document.getElementById("avatar-upload").files.length == 1) {
        uploadAvatar(e);
      }
      document.getElementById("newPassword").value = "";
      document.getElementById("password").value = "";
      document.getElementById("passwordVerify").value = "";
      loadProfileData;
    }
  });
});

// Cancels changes made to input fields by re-inserting old values taken at page load 
cancelButton.addEventListener("click", function (e) {
  document.getElementById("fname").value = oldFirstName;
  document.getElementById("lname").value = oldLastName;
  document.getElementById("displayName").value = oldDisplayName;
  document.getElementById("email").value = oldEmail;
  document.getElementById("newPassword").value = "";
  document.getElementById("password").value = "";
  document.getElementById("passwordVerify").value = "";
});