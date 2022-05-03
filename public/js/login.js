async function submitLogin(data) {
  try {
    let response = await fetch("/login", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
    });
    console.log("Response object", response);
    let parsedJSON = await response.json();
    console.log("From the server", parsedJSON);
    if (parsedJSON.status == "success") {
      window.location.replace("/home");
    } else {
      console.log("Login failed.");
    }
  } catch (error) {
    console.log(error);
  }
}

document.getElementById("loginButton").addEventListener("click", function (e) {
  submitLogin({
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  });
});