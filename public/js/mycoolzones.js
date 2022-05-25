'use strict'

const coolzoneItem = document.getElementsByClassName("coolzone-container");
const coolzoneDescription = document.getElementsByClassName("container")

async function showMyCoolzones() {
  let response = await fetch("/getMyCoolzones", {
    method: 'GET',
  }).then(
    function (res) {
      const coolzoneInfo = res.json().then(
        data => {
          for (let i = 0; i < data.length; i++) {
            console.log(data[i].czname);
            let myCoolzoneContainer = document.createElement("button");
            myCoolzoneContainer.innerHTML =
              `<h2 class="coolzone"> Coolzone </h2>
                <h3 class="czLocation"> Location <h3/>`;
            myCoolzoneContainer.classList.add("coolzone-container");
            myCoolzoneContainer.querySelector(".coolzone").innerHTML = data[i].czname;
            myCoolzoneContainer.querySelector(".czLocation").innerHTML = data[i].location;
            document.body.append(myCoolzoneContainer);

            let CoolzoneContainer = document.createElement("div");
            CoolzoneContainer.innerHTML =
              `<div class="topContainer" >
                <div class="containerName">
                  <span>Coolzone Information</span>
                </div>
                <div class="coolzoneInfo">
                  <div class="labelContainer">
                    <label id="czName">Coolzone Name: </label>
                    <label id="loc">Location: </label>
                    <label id="date">Start Date: </label>
                    <label id="enddate">End Date: </label>
                  </div>
                  <div class="inputContainer">
                    <input type="text" id="coolzoneName" name="coolzoneName">
                    <input type="text" id="location" name="location">
                    <input type="datetime-local" id="dateTag" name="dateTag">
                    <input type="datetime-local" id="enddateTag" name="enddateTag">
                  </div>
                </div>
              </div>
               <div class="descriptionContainer">
              <div class="containerName">
                <span>Description</span>
              </div>
              <div class="descInputContainer">
                <textarea id="description" name="description" rows="10" cols="50"
                  placeholder="Enter a small description about the CoolZone!"></textarea>
              </div>
            </div>
            <div class="amenitiesContainer">
              <div class="containerName">
                <span>Amenities</span>
              </div>
              <div id="amenities">
                <input type="checkbox" id="aircon" />
                <label for="aircon">Air Conditioning
                  <span class="material-symbols-outlined">
                    ac_unit
                  </span>
                </label>
                <input type="checkbox" id="freeWater" />
                <label for="freeWater">Free Water
                  <span class="material-symbols-outlined">
                    water_drop
                  </span>
                </label>
                <input type="checkbox" id="swimmingPool" />
                <label for="swimmingPool">Swimming Pool
                  <span class="material-symbols-outlined">
                    pool

                  </span>
                </label>
                <input type="checkbox" id="waterParks" />
                <label for="waterParks">Water Park
                  <span class="material-symbols-outlined">
                    sprinkler
                  </span>
                </label>
                <input type="checkbox" id="outdoor" />
                <label for="outdoor">Outdoor
                  <span class="material-symbols-outlined">
                    location_away
                  </span></label>
                <input type="checkbox" id="indoor" />
                <label for="indoor">Indoor
                  <span class="material-symbols-outlined">
                    location_home
                  </span></label>
                <input type="checkbox" id="freeWifi" />
                <label for="freeWifi">Free Wi-Fi
                  <span class="material-symbols-outlined">
                    wifi
                  </span>
                </label>
              </div>
            </div>
            <div class="picContainer">
              <div class="containerName">
                <span>Upload An Image</span>
              </div>
              <form id="upload-images-form">
                <input id="coolzone-upload" type="file" value="Upload Image" accept="image/png, image/gif, image/jpeg" />
                <input id="submit" type="submit" value="Submit" />
              </form>
            </div>
            <div class="botContainer">
              <span id="errorMsg" class="errors"></span>
              <input type="button" id="createCoolzone" name="createCoolzone" value="Create Coolzone" />
            </div>`;


            CoolzoneContainer.querySelector("#coolzoneName").value = data[i].czname;
            CoolzoneContainer.querySelector("#location").value = data[i].location;
            CoolzoneContainer.querySelector("#dateTag").value = data[i].startdate;
            CoolzoneContainer.querySelector("#enddateTag").value = data[i].enddate;
            CoolzoneContainer.querySelector("#description").value = data[i].description;
            CoolzoneContainer.querySelector("#aircon").checked = data[i].aircon;
            CoolzoneContainer.querySelector("#freeWater").checked = data[i].freedrinks;
            CoolzoneContainer.querySelector("#swimmingPool").checked = data[i].pool;
            CoolzoneContainer.querySelector("#waterParks").checked = data[i].waterparks;
            CoolzoneContainer.querySelector("#outdoor").checked = data[i].outdoors;
            CoolzoneContainer.querySelector("#indoor").checked = data[i].indoors;
            CoolzoneContainer.querySelector("#freeWifi").checked = data[i].wifi;
            document.body.append(CoolzoneContainer);
            // myCoolzoneContainer.addEventListener("click", (e) => {
            //   myCoolzoneContainer.style.backgroundColor = "red";
            // });
          }
        }
      )
    }
  )
}

function checkBoxes(data) {
  if (data.value == 1) {
    data.checked = true;
  } else if (data.value == 0) {
    data.checked = false;
  }
}

//will call the showMyCoolzones function upon successful load up
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', showMyCoolzones);
}
else if (document.readyState === 'interactive' || document.readyState === 'complete') {
  showMyCoolzones();
}

