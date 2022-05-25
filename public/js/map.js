'use strict';

// google.maps.Map object
let map;

// array for coolzone markers in given area
let markers = [];

// globally defined radius for center of map
let globalRadius;

//globally defined center position
let centerPosMarker;

// navigator.geolocation parameter to enable high accuracy tracking
var options = {
  enableHighAccuracy: true,
  timeout: 10000
};

// displays error if navigator.geolocation catches an error
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

// adds event listeners to all filter buttons to display coolzones based on filter requirements
document.getElementById("aircon").addEventListener("click", () => {
  displayCenterPos(centerPosMarker.position);
});
document.getElementById("freeWater").addEventListener("click", () => {
  displayCenterPos(centerPosMarker.position);
});
document.getElementById("swimmingPool").addEventListener("click", () => {
  displayCenterPos(centerPosMarker.position);
});
document.getElementById("waterParks").addEventListener("click", () => {
  displayCenterPos(centerPosMarker.position);
});
document.getElementById("outdoor").addEventListener("click", () => {
  displayCenterPos(centerPosMarker.position);
});
document.getElementById("indoor").addEventListener("click", () => {
  displayCenterPos(centerPosMarker.position);
});
document.getElementById("freeWifi").addEventListener("click", () => {
  displayCenterPos(centerPosMarker.position);
});

// displays map based on current location
function initMap() {
  navigator.geolocation.getCurrentPosition(function (pos) {
    location.lat = pos.coords.latitude;
    location.long = pos.coords.longitude;
    map = new google.maps.Map(document.getElementById("map"), {
      mapTypeControl: false,
      fullscreenControl: false,
      center: { lat: location.lat, lng: location.long },
      zoom: 12
    });

    // style options to display or hide points of interest
    const styles = {
      default: [],
      hide: [
        {
          featureType: "poi",
          stylers: [{ visibility: "off" }],
        },
      ],
    };
    map.setOptions({ styles: styles["hide"] });

    // creates a button re-center map to current location
    const locationButton = document.createElement("button");
    locationButton.textContent = "Current location";
    locationButton.classList.add("custom-map-control-button");
    locationButton.setAttribute("id", "center-my-location-button");
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(locationButton);
    locationButton.addEventListener("click", () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          let curPos = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
          displayCenterPos(curPos);
          displayRadius(curPos, document.getElementById("radiusInput").options[document.getElementById("radiusInput").selectedIndex].value);
        }
      );
      map.setZoom(14);
    });

    const locationInput = document.createElement("input");
    locationInput.placeholder = "Search a location";
    locationInput.setAttribute('id', "location-input-field");
    const searchBox = new google.maps.places.SearchBox(locationInput);
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(locationInput);

    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds());
    });
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (places.length == 0) {
        return;
      }

      const bounds = new google.maps.LatLngBounds();
      const geocoder = new google.maps.Geocoder();

      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          return;
        }
        if (places.length == 1) {
          displayCenterPos(places[0].geometry.location);
          displayRadius(places[0].geometry.location, document.getElementById("radiusInput").options[document.getElementById("radiusInput").selectedIndex].value);
        }
      });

    });

    const radiusOptions = [{ number: 300, multiplier: 0.001, unit: "m", zoom: 17 }, { number: 1, multiplier: 1, unit: "km", zoom: 15 }, { number: 2, multiplier: 1, unit: "km", zoom: 14 }, { number: 3, multiplier: 1, unit: "km", zoom: 13 }, { number: 4, multiplier: 1, unit: "km", zoom: 13 }, { number: 5, multiplier: 1, unit: "km", zoom: 12 }, { number: 10, multiplier: 1, unit: "km", zoom: 12 }];
    const radiusInput = document.createElement("select");
    radiusInput.id = "radiusInput";
    radiusInput.addEventListener("change", () => {
      displayRadius(centerPosMarker.position, radiusInput.options[radiusInput.selectedIndex].value);
      displayCenterPos(centerPosMarker.position);
    });
    for (const val of radiusOptions) {
      var option = document.createElement("option");
      option.value = val.number * val.multiplier;
      option.text = val.number + val.unit;
      radiusInput.appendChild(option);
    }
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(radiusInput);

  }, error, options);
}

// function to elements before completing another function
function waitForElm(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

//initializes the map. Once map elements are generated, displays the radius and center position
async function loadMap() {
  initMap;

  const elm = await waitForElm("#radiusInput");

  navigator.geolocation.getCurrentPosition(function (pos) {
    let currentLatLong = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    displayRadius(currentLatLong, document.getElementById("radiusInput").options[document.getElementById("radiusInput").selectedIndex].value);
    displayCenterPos(currentLatLong);
  });

}

window.onload = loadMap;


//takes a longitude and latitude value and displays an icon 
function displayCenterPos(myLatLong) {
  console.log("displayCenterPos - myLatLong: " + myLatLong);

  centerPosMarker = new google.maps.Marker({
    position: myLatLong,
    map: map,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10,
      fillOpacity: 1,
      strokeWeight: 2,
      fillColor: '#5384ED',
      strokeColor: '#ffffff',
    },
  });
  markers.forEach((marker) => {
    marker.setMap(null);
  });
  markers = [];
  markers.push(centerPosMarker);
  map.setCenter(myLatLong);

  const myLng = myLatLong.lng();
  const myLat = myLatLong.lat();
  const myRad = document.getElementById("radiusInput").options[document.getElementById("radiusInput").selectedIndex].value * 0.621371192;

  const lng_min = myLng - myRad / Math.abs(Math.cos(myLat * (Math.PI / 180)) * 69);
  const lng_max = myLng + myRad / Math.abs(Math.cos(myLat * (Math.PI / 180)) * 69);
  const lat_min = myLat - (myRad / 69);
  const lat_max = myLat + (myRad / 69);



  displayCoolzones({
    radius: myRad,
    latitude: myLat,
    longitude: myLng,
    minLng: lng_min,
    maxLng: lng_max,
    minLat: lat_min,
    maxLat: lat_max,
    aircon: document.getElementById("aircon").checked,
    freeWater: document.getElementById("freeWater").checked,
    swimmingPool: document.getElementById("swimmingPool").checked,
    waterPark: document.getElementById("waterParks").checked,
    outdoor: document.getElementById("outdoor").checked,
    indoor: document.getElementById("indoor").checked,
    freeWifi: document.getElementById("freeWifi").checked
  });
}

// takes in a longitude, latitude, and radius to create a circle representing search radius
function displayRadius(myLatLong, myRad) {
  if (globalRadius) {
    globalRadius.setOptions({ fillOpacity: 0, strokeOpacity: 0 });
  }
  globalRadius = new google.maps.Circle({
    strokeColor: "#94bbdc",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#94bbdc",
    fillOpacity: 0.3,
    map,
    center: myLatLong,
    radius: myRad * 1300
  });
  if (myRad == 0.3) {
    map.setZoom(17);
  } else if (myRad == 1) {
    map.setZoom(15);
  } else if (myRad == 2) {
    map.setZoom(14);
  } else if (myRad == 3) {
    map.setZoom(13);
  } else if (myRad == 4) {
    map.setZoom(13);
  } else if (myRad == 5) {
    map.setZoom(12);
  } else {
    map.setZoom(12);
  }
}



// takes the results array of /loadCoolzones and creates a marker 
// for each result which is displayed on our map
async function createMarker(resultsArray) {
  if (resultsArray) {
    // sets the appearance of map markers. //
    const image = { url: "/img/icons/coolzoneMarker.png", scaledSize: new google.maps.Size(50, 50) };
    await resultsArray.forEach((coolzone) => {
      //console.log("coolzone element in resultsArray: " + JSON.stringify(coolzone));
      markers.push(new google.maps.Marker({
        position: new google.maps.LatLng(Number(coolzone.latitude), Number(coolzone.longitude)),
        icon: image,
        czname: coolzone.czname,
        location: coolzone.location,
        startdate: coolzone.startdate,
        enddate: coolzone.enddate,
        latitude: coolzone.latitude,
        longitude: coolzone.longitude,
        map: map,
        eventid: coolzone.eventid,
        description: coolzone.description,
        amenities: {
          aircon: coolzone.aircon,
          freedrinks: coolzone.freedrinks,
          waterpark: coolzone.waterpark,
          pool: coolzone.pool,
          outdoors: coolzone.outdoors,
          indoors: coolzone.indoors,
          wifi: coolzone.wifi
        }
      }))
    });

    // creates event listeners for each marker displayed on map
    markers.forEach((marker) => {
      marker.addListener("click", () => {
        toggleCoolzoneInfo(1);
        document.getElementById("coolzone-name").innerHTML = marker.czname;
        document.getElementById("coolzone-address").innerHTML = marker.location;
        document.getElementById("coolzone-description").innerHTML = marker.description;

        let amenityIndicator = document.getElementById("coolzone-amenities");
        amenityIndicator.innerHTML = "";

        if (marker.amenities.aircon == 1) {
          amenityIndicator.innerHTML +=
            `<div class="coolzone-amenity">
          <span class="material-symbols-outlined">ac_unit</span>
          <p>A/C</p>
        </div>`;
        }
        if (marker.amenities.freedrinks == 1) {
          amenityIndicator.innerHTML += `<div class="coolzone-amenity">
          <span class="material-symbols-outlined">water_drop</span>
          <p>Free Drinks</p>
        </div>`;
        }
        if (marker.amenities.waterpark == 1) {
          amenityIndicator.innerHTML += `<div class="coolzone-amenity">
          <span class="material-symbols-outlined">sprinkler</span>
          <p>Waterpark</p>
        </div>`;
        }
        if (marker.amenities.pool == 1) {
          amenityIndicator.innerHTML += `<div class="coolzone-amenity">
          <span class="material-symbols-outlined">pool</span>
          <p>Pool</p>
        </div>`;
        }
        if (marker.amenities.outdoors == 1) {
          amenityIndicator.innerHTML += `<div class="coolzone-amenity">
          <span class="material-symbols-outlined">location_away</span>
          <p>Outdoor</p>
        </div>`;
        }
        if (marker.amenities.indoors == 1) {
          amenityIndicator.innerHTML += `<div class="coolzone-amenity">
          <span class="material-symbols-outlined">location_home</span>
          <p>Indoor</p>
        </div>`;
        }
        if (marker.amenities.wifi == 1) {
          amenityIndicator.innerHTML += `<div class="coolzone-amenity">
          <span class="material-symbols-outlined">wifi</span>
          <p>Wifi</p>
        </div>`;
        }

        document.getElementById("go-to-coolzone-button").value = marker.latitude + "," + marker.longitude;
        document.getElementById("go-to-coolzone-button").addEventListener("click", (e) => { console.log(e.currentTarget.value) })
      })
    })
  }
}

// displays all coolzones within provided arguments
async function displayCoolzones(data) {
  // post request for all coolzones 
  try {
    //test//
    console.log("displayCoolzones - data: " + data);
    console.log("displayCoolzones - JSON.stringify(data): " + JSON.stringify(data));

    console.log
    let response = await fetch("/loadCoolzones", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
    });
    let parsedJSON = await response.json();

    //test//
    console.log("displayCoolzones - parsedJSON.coolzones: " + parsedJSON.coolzones);

    createMarker(parsedJSON.coolzones);
  } catch (e) {
    console.log(e);
  }
}

// redirects users to google maps with driving instructions to their chosen location
function goToMap(latLong) {
  let destination = "&destination=" + latLong;
  let url = "https://www.google.com/maps/dir/?api=1" + destination;
  window.open(url, "_blank").focus;
}

// shows/hides the maps aside window. Input parameter 1 for showing, 0 for hiding. //
let coolzoneWindow = document.getElementById("coolzone-details-window");
function toggleCoolzoneInfo(input) {
  if (input == 1) {
    coolzoneWindow.hidden = false;
  } else if (input == 0) {
    coolzoneWindow.hidden = true;
  }
};

// shows/hides the maps aside window. Input parameter 1 for showing, 0 for hiding. //
let filterWindow = document.getElementById("closed");
let filterContent = document.getElementById("filterOptions");
function toggleFilter(input) {
  if (input == 1) {
    filterWindow.setAttribute("id", "filters");
  } else if (input == 0) {
    filterWindow.setAttribute("id", "closed");
  }
};

