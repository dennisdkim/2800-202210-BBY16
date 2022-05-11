
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

              

              document.getElementById("user-avatar").addEventListener("click", function (k) {
                profileMenu.classList.toggle("hidden");
              });

              document.getElementById("logoHomeButton").addEventListener("click", function(){
                window.location = "/home";
              });
            }
          )
        }
      )
    }