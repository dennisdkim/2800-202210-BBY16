'use strict';
// Fields //
var oldFirstName;
var oldLastName;
var oldDisplayName;

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
    oldFirstName = infoParsed.fname;
    oldLastName = infoParsed.lname;
    oldDisplayName = infoParsed.displayName;
  } catch (error) {
    console.log(error);
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
      document.getElementById("pwMessage").innerHTML = parsedResponse.msg;
    }
    return verified;
  } catch (error) {
    console.log(error);
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
    if (parsedResponse.status == "fail") {
      document.getElementById("displayName").value = oldDisplayName;
    }
  } catch (error) {
    console.log(error);
  }
}

function uploadAvatar(e) {
  e.preventDefault();
  const avatarUpload = document.querySelector("#avatar-upload");
  const formData = new FormData();
  formData.append("avatar", avatarUpload.files[0]);

  fetch("/upload-avatar", {
    method: 'POST',
    body: formData
  })
  // .then(function(res) {
  //   let parsedResponse = res.json();
  //   if (parsedResponse.status == "success") {
  //     document.getElementById("errorMessage").innerHTML += " and " + parsedResponse.msg;
  //   } else {
  //     document.getElementById("errorMessage").innerHTML += " and display picture could not be updated";
  //   }
  // })
  .catch(function(err) {("Error:", err)});
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
        newPw: document.getElementById("newPassword").value
      };
      submitChanges(changes);
      uploadAvatar(e);
      document.getElementById("newPassword").value = "";
      document.getElementById("password").value = "";
      document.getElementById("passwordVerify").value = "";
    }
  });
});

// Cancels changes made to input fields by re-inserting old values taken at page load 
cancelButton.addEventListener("click", function (e) {
  document.getElementById("fname").value = oldFirstName;
  document.getElementById("lname").value = oldLastName;
  document.getElementById("displayName").value = oldDisplayName;
});