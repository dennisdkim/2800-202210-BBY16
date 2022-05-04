// Function definition to submit login credential info. The user input params are sent to server for authentication
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

//initializes db.
async function tryUserDB(){
  try{
   let response = await fetch("/tryLogin", {
     method: 'GET'
   });
   if (response == 200){
     console.log("db initialized");
   } else {
     console.log("db initialization failed");
   }
  } catch (error){
    console.log(error)
  }
}

tryUserDB();

// Event listener for "Login" button. Upon clicking it, it will take the params in html fields and passes it to submitLogin()
document.getElementById("loginButton").addEventListener("click", function (e) {
  submitLogin({
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  });
});