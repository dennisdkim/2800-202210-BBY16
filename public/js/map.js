'use strict';

// google.maps.Map object
let map;

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
          map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        }
      );
      map.setZoom(14);
    });

    const radiusInput = document.createElement("input");
    radiusInput.defaultValue = "2";
    radiusInput.id = "radiusInput";
    radiusInput.min = "1";
    radiusInput.min = "10";
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(radiusInput);
    const currentRadius = new google.maps.Circle({
      strokeColor: "#94bbdc",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#94bbdc",
      fillOpacity: 0.3,
      map,
      center: { lat: location.lat, lng: location.long},
      radius: Number(radiusInput.defaultValue) * 1000
    });

    //creates a marker showing current location on map
    var marker = new google.maps.Marker({
      position: {lat: location.lat, lng: location.long},
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
    // getCoolzones(pos);
  }, error, options);
}

window.onload = initMap;


function getCoolzones(location){
  var distanceFromCurrent = document.getElementById("radius").value;
  var thousand = 1000;
  var currentLocation = new google.maps.LatLng(location.lat, location.long);
} 