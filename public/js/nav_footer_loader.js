loadNavbarFooter();

    function loadNavbarFooter() {
      const option = {
        method: 'GET',
      }
      fetch("/getNavbarFooter", option).then(
        function (res) {
          const result = res.json().then(
            components => {
              console.log(components);
              document.getElementById("navbar").innerHTML = components.navbar;
              document.getElementById("footer").innerHTML = components.footer;
              let profileMenu = document.getElementById("profile-menu");
              profileMenu.classList.add("hidden");

              

              document.getElementById("user-avatar").addEventListener("click", function (k) {
                console.log("this is a test");
                profileMenu.classList.toggle("hidden");
              });
            }
          )
        }
      )
    }