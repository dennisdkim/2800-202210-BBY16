
'use strict';

//global searched location longitude
let myLong;
//global searched location latitude
let myLat;

function initGoogle(){
  const autocomplete = new google.maps.places.Autocomplete(document.getElementById("location"));
  autocomplete.addListener("place_changed", ()=>{
    const place = autocomplete.getPlace();
    myLat = place.geometry.location.lat();
    myLong = place.geometry.location.lng();
  });
}

window.onload = initGoogle;

//Sends input field data and picture to server to be inserted into db and file system (for picture).
async function submitCoolzone(data) {
  let coolzoneBody = new FormData();
  const imageUpload = document.getElementById("coolzone-upload");

  coolzoneBody.append("coolzoneName", data.coolzoneName);
  coolzoneBody.append("location", data.location);
  coolzoneBody.append("dateTag", data.dateTag);
  coolzoneBody.append("enddateTag", data.enddateTag);
  coolzoneBody.append("description", data.description);
  coolzoneBody.append("longitude", data.longitude);
  coolzoneBody.append("latitude", data.latitude);
  coolzoneBody.append("acTag", data.acTag);
  coolzoneBody.append("fdTag", data.fdTag);
  coolzoneBody.append("wpTag", data.wpTag);
  coolzoneBody.append("poolTag", data.poolTag);
  coolzoneBody.append("outdoorTag", data.outdoorTag);
  coolzoneBody.append("indoorTag", data.indoorTag);
  coolzoneBody.append("wifiTag", data.wifiTag);

  coolzoneBody.append("files", imageUpload.files[0]);

  try {
    let response = await fetch("/tryCoolzone", {
      method: 'POST',
      body: coolzoneBody
    });
    let parsedJSON = await response.json();
    document.getElementById("errorMsg").innerHTML = "";
    if (parsedJSON.status == "success") {
      document.getElementById("errorMsg").innerHTML = parsedJSON.msg;
    }
  } catch (error) {
    console.log(error);
  }
};

let acTag = document.getElementById("aircon");
let fdTag = document.getElementById("freeWater");
let wpTag = document.getElementById("waterParks");
let poolTag = document.getElementById("swimmingPool");
let outdoorTag = document.getElementById("outdoor");
let indoorTag = document.getElementById("indoor");
let wifiTag = document.getElementById("freeWifi");

function checkBoxes(data) {
  if (data.checked == true) {
    data.value = 1;
  } else if (data.checked == false) {
    data.value = 0;
  }
}

//event listener to call submitCoolzone method upon button click.
document.getElementById("createCoolzone").addEventListener("click", function (e) {
  checkBoxes(acTag);
  checkBoxes(fdTag);
  checkBoxes(wpTag);
  checkBoxes(poolTag);
  checkBoxes(outdoorTag);
  checkBoxes(indoorTag);
  checkBoxes(wifiTag);
  submitCoolzone({
    coolzoneName: document.getElementById("coolzoneName").value,
    location: document.getElementById("location").value,
    dateTag: document.getElementById("dateTag").value,
    enddateTag: document.getElementById("enddateTag").value,
    description: document.getElementById("description").value,
    acTag: acTag.value,
    fdTag: fdTag.value,
    wpTag: wpTag.value,
    poolTag: poolTag.value,
    outdoorTag: outdoorTag.value,
    indoorTag: indoorTag.value,
    wifiTag: wifiTag.value,
    longitude: myLong,
    latitude: myLat
  });
});