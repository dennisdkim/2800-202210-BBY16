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

    document.getElementById("aircon").addEventListener("click", ()=>{
      displayCenterPos(centerPosMarker.position);
    });
    document.getElementById("freeWater").addEventListener("click", ()=>{
      displayCenterPos(centerPosMarker.position);
    });
    document.getElementById("swimmingPool").addEventListener("click", ()=>{
      displayCenterPos(centerPosMarker.position);
    });
    document.getElementById("waterParks").addEventListener("click", ()=>{
      displayCenterPos(centerPosMarker.position);
    });
    document.getElementById("outdoor").addEventListener("click", ()=>{
      displayCenterPos(centerPosMarker.position);
    });
    document.getElementById("indoor").addEventListener("click", ()=>{
      displayCenterPos(centerPosMarker.position);
    });
    document.getElementById("freeWifi").addEventListener("click", ()=>{
      displayCenterPos(centerPosMarker.position);
    });

// displays map based on current location
function initMap() {
  navigator.geolocation.getCurrentPosition(function(pos){
    location.lat = pos.coords.latitude;
    location.long = pos.coords.longitude;
    map = new google.maps.Map(document.getElementById("map"), {
      mapTypeControl: false,
      fullscreenControl: false,
      center: { lat: location.lat, lng: location.long},
      zoom: 14
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
    map.setOptions({styles: styles["hide"]});

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
    searchBox.addListener("places_changed", ()=>{
      const places = searchBox.getPlaces();
      if (places.length == 0) {
        return;
      }

      const bounds = new google.maps.LatLngBounds();
      const geocoder = new google.maps.Geocoder();

      places.forEach((place)=>{
        if (!place.geometry || !place.geometry.location){
          return;
        }
        if (places.length == 1){
          displayCenterPos(places[0].geometry.location);
          displayRadius(places[0].geometry.location, document.getElementById("radiusInput").options[document.getElementById("radiusInput").selectedIndex].value);
        }
      });
      
    });

    const radiusOptions = [{number: 300, multiplier: 0.001, unit: "m"}, {number: 1, multiplier: 1, unit: "km"}, {number: 2, multiplier: 1, unit: "km"}, {number: 3, multiplier: 1, unit: "km"}, {number: 4, multiplier: 1, unit: "km"},{number: 5, multiplier: 1, unit: "km"}, {number: 10, multiplier: 1, unit: "km"}];
    const radiusInput = document.createElement("select");
    radiusInput.id = "radiusInput";
    radiusInput.addEventListener("change", ()=>{
      displayRadius(currentLatLong, radiusInput.options[radiusInput.selectedIndex].value);
      displayCenterPos(currentLatLong);
    });
    for (const val of radiusOptions)
    {
        var option = document.createElement("option");
        option.value = val.number * val.multiplier;
        option.text = val.number + val.unit;
        radiusInput.appendChild(option);
    }
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(radiusInput);

    let currentLatLong = new google.maps.LatLng(location.lat, location.long);

    displayRadius(currentLatLong, radiusInput.options[radiusInput.selectedIndex].value);
    displayCenterPos(currentLatLong);

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

// async function loadMap(){
//   initMap;
  
//   const elm = await waitForElm("#radiusInput");
  
  // displayRadius(currentLatLong, document.getElementById("radiusInput").options[document.getElementById("radiusInput").selectedIndex].value);
  // displayCenterPos(currentLatLong);
// }

// window.onload = loadMap;

window.onload = initMap;

//takes a longitude and latitude value and displays an icon 
function displayCenterPos(myLatLong){
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

  const lng_min = myLng - myRad / Math.abs(Math.cos(myLat * (Math.PI/180)) * 69);
  const lng_max = myLng + myRad / Math.abs(Math.cos(myLat* (Math.PI/180)) * 69);
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
function displayRadius(myLatLong, myRad){
  if (globalRadius){
    globalRadius.setOptions({fillOpacity:0, strokeOpacity:0});
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
}

// takes the results array of /loadCoolzones and creates a marker 
// for each result which is displayed on our map
function createMarker(resultsArray){
  if(resultsArray){
    resultsArray.forEach((coolzone)=>{
      markers.push(new google.maps.Marker({
        position: new google.maps.LatLng(Number(coolzone.latitude), Number(coolzone.longitude)),
        title: coolzone.czname,
        map: map
      }));
    });
    // markers.forEach((marker)=>{
    //   marker.addEventListener("click", ()=>{
    //     displayAside();
    //   })
    // })
  }
}

async function displayCoolzones(data){
  // post request for all coolzones 
  try {
    let response = await fetch("/loadCoolzones", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
    });
    let parsedJSON = await response.json();
      createMarker(parsedJSON.coolzones);
  } catch (e){
    console.log(e);
  }
} 

// document.getElementById("go-to-coolzone-button").addEventListener("click", ()=>{
//   goToMap();
// });


function goToMap(latLong){
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

// Retrieves specific coolzone information. Passes in a coolzone id.//
function getCoolzoneData (czID) {
  
}
