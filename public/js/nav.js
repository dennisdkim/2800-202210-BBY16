// Function definition of logout process, fetches /logout from the server which destroys the current session
async function logout() {
  try {
    let response = await fetch("/logout", {
      method: 'GET'
    });
    if (response.status == 200) {
      console.log("Logout successful.")
      window.location.reload();
    } else {
      console.log(response.status);
      console.log("Unable to log out.");
    }
  } catch (error) {
    console.log(error);
  }
}


// Event listener on the "Logout" button in the navbar to log out 
document.getElementById("logout").addEventListener("click", function (k) {
  logout();
});