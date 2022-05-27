/*
Notes about nav_footer_loader.js
This file contains all the javascript for all HTML pages that
use a navbar and footer. 
Functions below retrieves the navbar and footer code from the 
server and loads it into the HTML document.
*/

'use strict';

loadNavbarFooter();

// retrieves HTML code for navbar and footer from the server, then loads it into the page.//
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
            if (link.innerText == document.title) {
              link.classList.add("selected");
            }
          });

          loadEmailAndIcon();
        }
      )
    }
  )
}

// retrieves the user's avatar image path and other info from the server, then loads it into the navbar.//
function loadEmailAndIcon() {
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