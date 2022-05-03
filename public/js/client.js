function ready(callback) {
  if (document.readyState != "loading") {
    callback();
    console.log("Ready state complete!");
  } else {
    document.addEventListener("DOMContentLoaded", callback);
    console.log("Listener is invoked");
  }
}

ready(function () {
  console.log("Client.js loaded");

  function ajaxPOST(url, callback, data) {
    let params = typeof data == "string" ? data : Object.keys(data).map(
      function (i) {
        return encodeURIComponent(i) + "=" + encodeURIComponent(data[i])
      }
    ).join("&");
    console.log("params in ajaxPOST", params);
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        callback(this.responseText);
      } else {
        console.log(this.status);
      }
    }
    xhr.open("POST", url);
    // xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(params);
  }

  function ajaxGET(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        callback(this.responseText);
      } else {
        console.log(this.status);
      }
    }
    xhr.open("GET", url);
    xhr.send();
  }

  // Logout Button
  if (document.getElementById("logout")) {
    document.getElementById("logout").addEventListener("click", function (k) {
      ajaxGET("/logout", function (data) {
        console.log("logged out");
        window.location.reload();
      });
    })
  }

  // Login Button
  if (document.getElementById("loginButton")) {
    document.getElementById("loginButton").addEventListener("click", function (k) {
      let email = document.getElementById("email").value;
      let password = document.getElementById("password").value;
      let queryString = "email=" + email + "&password=" + password;

      ajaxPOST("/login", function (data) {
        if (data) {
          let parsedData = JSON.parse(data);
          console.log(parsedData);
          if (parsedData.status == "fail") {
            console.log("Login failed");
          } else {
            window.location.replace("/home");
          }
        }
      }, queryString)
    });
  }
});