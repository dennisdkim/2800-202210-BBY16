
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
              document.getElementById("current-page").innerHTML = document.title;
              document.getElementById("logoHomeButton").addEventListener("click", function(){
                window.location = "/home";           
              });
              document.querySelectorAll(".navlink").forEach( link => {
                if(link.innerText == document.title) {
                  link.classList.add("selected");
                  console.log(link);
                }
              })
              

              //for( let i = 0; i< links.length; i++) {
                //if(links[i].innerText)
              //  console.log(links[i].innerHTML);
              //}
            }
          )
        }
      )
    }