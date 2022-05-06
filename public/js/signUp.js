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
    let parsedJSON = await response.json();
    document.getElementById("errorMsgEmail").innerHTML = "";
    document.getElementById("errorMsgDisplay").innerHTML = "";
    document.getElementById("errorMsg").innerHTML = "";
    if (parsedJSON.status == "success") {
      document.getElementById("errorMsg").innerHTML = parsedJSON.msg + "<br/>";
    } else {
      if (parsedJSON.status == "emailExists") {
        document.getElementById("errorMsgEmail").innerHTML = parsedJSON.msg + "<br/>";
      } else if (parsedJSON.status == "displayExists"){
        document.getElementById("errorMsgDisplay").innerHTML = parsedJSON.msg + "<br/>";
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
  submitSignUp({
    fname: document.getElementById("fname").value,
    lname: document.getElementById("lname").value,
    email: document.getElementById("email").value,
    displayName: document.getElementById("displayName").value,
    password: document.getElementById("password").value
  });
});