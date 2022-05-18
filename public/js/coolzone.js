
'use strict';

//Sends input field data to server to be inserted into db.
async function submitCoolzone(data){
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
    acTag: document.getElementById("aircon").value,
    fdTag: document.getElementById("freeWater").value,
    wpTag: document.getElementById("waterParks").value,
    poolTag: document.getElementById("swimmingPool").value,
    outdoorTag: document.getElementById("outdoor").value,
    indoorTag: document.getElementById("indoor").value,
    wifiTag: document.getElementById("freeWifi").value
  });
});
