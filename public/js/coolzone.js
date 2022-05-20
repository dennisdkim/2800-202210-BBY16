
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

//Sends input field data to server to be inserted into db.
async function submitCoolzone(data) {
  try {
    let response = await fetch("/tryCoolzone", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
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
    acTag: document.getElementById("acTag").value,
    fdTag: document.getElementById("fdTag").value,
    wpTag: document.getElementById("wpTag").value,
    poolTag: document.getElementById("poolTag").value,
    outdoorTag: document.getElementById("outdoorTag").value,
    indoorTag: document.getElementById("indoor").value,
    wifiTag: document.getElementById("wifiTag").value,
    longitude: myLong,
    latitude: myLat
  });
});

const uploadCoolzone = document.getElementById("upload-images-form");
uploadCoolzone.addEventListener("submit", uploadImages);
function uploadImages(e) {
  e.preventDefault();

  const coolzoneUpload = document.querySelector('#coolzone-upload');
  const formData = new FormData();

  for (let i = 0; i < coolzoneUpload.files.length; i++) {
    // put the images from the input into the form data
    formData.append("files", coolzoneUpload.files[i]);
  }

  const options = {
    method: 'POST',
    body: formData,
  };

  fetch("/upload-coolzone", options
  ).then(function (res) {
    console.log(res);
  }).catch(function (err) { ("Error:", err) }
  );
}