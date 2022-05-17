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

// displays map based on current location
function initMap() {
  navigator.geolocation.getCurrentPosition(function(pos){
    location.lat = pos.coords.latitude;
    location.long = pos.coords.longitude;
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: location.lat, lng: location.long},
      zoom: 14
    });

    // creates a button re-center map to current location
    const locationButton = document.createElement("button");
    locationButton.textContent = "Return to current location";
    locationButton.classList.add("custom-map-control-button");
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(locationButton);
    locationButton.addEventListener("click", () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          let curPos = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
          displayCenterPos(curPos);
          displayRadius(curPos, 2);
        }
      );
      map.setZoom(14);
    });

    const locationInput = document.createElement("input");
    locationInput.placeholder = "Enter a location";
    const searchBox = new google.maps.places.SearchBox(locationInput);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationInput);

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
          // displayRadius(places[0].geometry.location, document.getElementById("radiusInput").value);
          displayRadius(places[0].geometry.location, 2);
        }
      });

    });

    const radiusInput = document.createElement("input");
    radiusInput.defaultValue = "2";
    radiusInput.id = "radiusInput";
    radiusInput.min = "1";
    radiusInput.min = "10";
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(radiusInput);

    let currentLatLong = new google.maps.LatLng(location.lat, location.long);
    
    displayRadius(currentLatLong, radiusInput.defaultValue);
    displayCenterPos(currentLatLong);

  }, error, options);
}

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
  displayCoolzones({
    // radius: document.getElementById("radiusInput").value,
    radius: 2,
    latitude: myLatLong.lat(),
    longitude: myLatLong.lng()
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
    radius: myRad * 1000
  });
}


async function displayCoolzones(data){
  console.log(data);
  // post request for all coolzones 
  try {
    let responseArray = await fetch("/loadCoolzones", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
    });
  } catch (e){
    console.log(e);
  }
  // loop through returned coolzones and select those that are within our search radius

  //

} 
