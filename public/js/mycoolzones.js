'use strict';

//global searched location longitude
let myLong;
//global searched location latitude
let myLat;

function initGoogle() {
  const autocomplete = new google.maps.places.Autocomplete(document.getElementById("location"));
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    myLat = place.geometry.location.lat();
    myLong = place.geometry.location.lng();
  });
}
window.onload = initGoogle;

///////////////////////////////////////////////////////////////////////////////////////////////////



// Page Initialization //
window.addEventListener("load", loadcoolzones);

let userEditMenu = document.getElementById("userEditMenu");
let newUserMenu = document.getElementById("newUserMenu");
userEditMenu.hidden = true;
// newUserMenu.hidden = true;
let saveUserInfoButton = document.getElementById("saveButton");
let deleteUserButton = document.getElementById("deleteButton");
let deleteUserCode = document.getElementById("confirm-delete-code");
let editUserResponseMsg = document.getElementById("errorMessage");
let clearFieldButton = document.getElementById("clearButton");
let revertChangesButton = document.getElementById("revertButton");
let deleteAviButton = document.getElementById("deleteAviButton");

// shows/hides edit user menu. Input parameter 1 for showing, 0 for hiding. //
function toggleEditUserMenu(input) {
  if (input == 1) {
    userEditMenu.hidden = false;
    // newUserMenu.hidden = true;
    editUserResponseMsg.innerHTML = "";
    document.getElementById("avatarMsg").innerHTML = "";

  } else if (input == 0) {
    userEditMenu.hidden = true;
  }
};

// clears the fields in the new user menu. //
// clearFieldButton.addEventListener("click", () => {
//   document.querySelectorAll(".newUser-input").forEach(input => {
//     input.value = "";
//     document.getElementById("newUser-adminStatus").checked = false;
//   });
// })

function loadcoolzones() {

  let userList = document.getElementById("user-list-container");
  // while (userList.firstChild) {
  //   userList.removeChild(userList.firstChild);
  // };

  const option = {
    method: 'GET',
  }

  fetch("/getMyCoolzones", option).then(
    function (res) {
      const result = res.json().then(
        coolzones => {
          console.log(coolzones);

          let czContainer = document.getElementById("coolzone-list-container");
          for (let index = 0; index < coolzones.length; index++) {
            let czDiv = document.createElement("div");
            czDiv.classList.add("cz");
            czDiv.innerHTML = `
              <h2 class="czName" > ${coolzones[index].czname} </h2>
              <h2 class="czLocation"> ${coolzones[index].location} </h2>`;
            czDiv.addEventListener("click", () => {
              document.getElementById("coolzoneName").value = coolzones[index].czname;
              document.getElementById("location").value = coolzones[index].location;
              document.getElementById("dateTag").value = coolzones[index].startdate.substring(0, 21).replace(/ /gm, "");
              document.getElementById("enddateTag").value = coolzones[index].enddate.substring(0, 21).replace(/ /gm, "");
              document.getElementById("description").value = coolzones[index].description;
              document.getElementById("aircon").checked = coolzones[index].aircon;
              document.getElementById("freeWater").checked = coolzones[index].freedrinks;
              document.getElementById("waterParks").checked = coolzones[index].waterpark;
              document.getElementById("swimmingPool").checked = coolzones[index].pool;
              document.getElementById("outdoor").checked = coolzones[index].outdoors;
              document.getElementById("indoor").checked = coolzones[index].indoors;
              document.getElementById("freeWifi").checked = coolzones[index].wifi;
              saveUserInfoButton.value = coolzones[index].eventid;
              toggleEditUserMenu(1);
            })
            czContainer.append(czDiv);
          }

        });
    }
  )
}



//function to edit user data //
saveUserInfoButton.addEventListener("click", (e) => {
  console.log("are we in here");
  fetch("/editCoolzonesData", {
    method: 'POST',
    headers: {
      "Accept": 'application/json',
      "Content-Type": 'application/json'
    },
    body: JSON.stringify({
      eventid: e.currentTarget.value,
      czname: document.getElementById("coolzoneName").value.trim(),
      location: document.getElementById("location").value.trim(),
      startdate: document.getElementById("dateTag").value.trim(),
      enddate: document.getElementById("enddateTag").value.trim(),
      description: document.getElementById("description").value.trim(),
      aircon: document.getElementById("aircon").checked,
      freedrinks: document.getElementById("freeWater").checked,
      waterpark: document.getElementById("waterParks").checked,
      pool: document.getElementById("swimmingPool").checked,
      outdoors: document.getElementById("outdoor").checked,
      indoors: document.getElementById("indoor").checked,
      wifi: document.getElementById("freeWifi").checked,
      longitude: myLong,
      latitude: myLat
    })
  }).then(
    function (res) {
      const userData = res.json().then(
        data => {
          editUserResponseMsg.innerHTML = data.msg;
        }
      )
    }
  )
});