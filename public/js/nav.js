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

document.getElementById("logout").addEventListener("click", function (k) {
  logout();
});