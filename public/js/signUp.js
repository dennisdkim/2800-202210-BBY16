//Sends input field data to server to be inserted into db.
async function submitSignUp(data){
  try {
    let response = await fetch("/tryInsert", {
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
      window.location.replace("/");
    } else {
      if (parsedJSON.status == "exists") {
        document.getElementById("errorMsg").innerHTML = parsedJSON.msg;
      } else {
        document.getElementById("errorMsg").innerHTML = "Sign up failed";
      }
    }
  } catch (error) {
    console.log(error);
  }
};

//event listener to call submitSignUp method upon button click.
document.getElementById("signUpButton").addEventListener("click", function (e) {
  console.log("I'm in");
  submitSignUp({
    fname: document.getElementById("fname").value,
    lname: document.getElementById("lname").value,
    email: document.getElementById("email").value,
    displayName: document.getElementById("displayName").value,
    password: document.getElementById("password").value
  });
});