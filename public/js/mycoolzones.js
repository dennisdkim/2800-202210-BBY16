window.onload = function () {
  showMyCoolzones(data);
};

async function showMyCoolzones(data) {
  try {
    let response = await fetch("/mycoolzones", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
    });
    let parsedJSON = await response.json();
    if (parsedJSON.status == "success") {
      let newItem = document.createElement("div");
      newItem.innerHTML = "?", [req.body.czname];
      document.body.appendChild(newItem);
    }
  } catch (error) {
    console.log(error);
  }
};