
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

//event listener to call submitCoolzone method upon button click.
document.getElementById("createCoolzone").addEventListener("click", function (e) {
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
    wifiTag: document.getElementById("wifiTag").value
  });
});
