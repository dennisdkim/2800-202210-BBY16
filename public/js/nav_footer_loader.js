'use strict';

loadNavbarFooter();

function loadNavbarFooter() {
  const option = {
    method: 'GET',
  }
  fetch("/getNavbarFooter", option).then(
    function (res) {
      const result = res.json().then(
        components => {
          document.getElementById("navbar").innerHTML = components.navbar;
          document.getElementById("footer").innerHTML = components.footer;
          let profileMenu = document.getElementById("profile-menu");
          profileMenu.classList.add("hidden");
          document.getElementById("avatar-icon").addEventListener("click", function (k) {
            profileMenu.classList.toggle("hidden");
          });
          document.getElementById("logoHomeButton").addEventListener("click", function () {
            window.location = "/home";
          });

          //changes the mobile page title into the current page title. //
          document.getElementById("current-page").innerHTML = document.title;

          //underlines the current page link in the desktop navbar. //
          document.querySelectorAll(".navlink").forEach(link => { 
            if(link.innerText == document.title) {
            link.classList.add("selected");
          }});

          loadEmailAndIcon();
        }
      )
    }
  )
}

function loadEmailAndIcon(){
  const options = {
    method: 'GET'
  }
  fetch("/getUserInfo", options).then(
    function (res) {
      const info = res.json().then(
        userInfo => {
          let icon = document.getElementById("avatar-icon");
          icon.src = userInfo.avatar;
          document.getElementById("user-email").innerHTML = userInfo.email;
          document.getElementById("user-displayName").innerHTML = userInfo.displayName;
          

          
        }
      );
    }
  ); 
}