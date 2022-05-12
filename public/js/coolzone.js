
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
      document.getElementById("errorMsg").innerHTML = parsedJSON.msg + "<br/>";
    }
  } catch (error) {
    console.log(error);
  }
};

//event listener to call submitCoolzone method upon button click.
document.getElementById("createCoolzone").addEventListener("click", function (e) {
  submitCoolzone({
    coolzoneName: document.getElementById("CoolzoneName").value,
    location: document.getElementById("location").value,
    startTime: document.getElementById("timeTag").value,
    endTime: document.getElementById("endtimeTag").value,
    startDate: document.getElementById("dateTag").value,
    endDate: document.getElementById("enddateTag").value,
    streetNumber: document.getElementById("streetNumberTag").value,
    streetName: document.getElementById("streetNameTag").value,
    city: document.getElementById("cityTag").value,
    description: document.getElementById("description").value,
    aircon: document.getElementById("acTag").value,
    drinks: document.getElementById("fdTag").value,
    waterPark: document.getElementById("wpTag").value,
    pool: document.getElementById("poolTag").value,
    outdoor: document.getElementById("outdoorTag").value,
    wifi: document.getElementById("wifiTag").value
  });
});