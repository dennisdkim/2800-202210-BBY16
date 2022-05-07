
'use strict';

let testButton = document.getElementById("test-button");
testButton.addEventListener("click", loadUserTable);

// loads all user data and displays a table onto the admin page//
function loadUserTable () {
    const option = {
        method: 'GET',
    }

    fetch("/getUserTable", option).then(
        function (res) {
          const result = res.json().then(
            users => {
                let newTable = document.createElement("table");
                let headerRow = document.createElement("tr");
                headerRow.innerHTML = "<th>User ID</th><th>First name</th><th>Last Name</th><th>Email</th><th>Username</th><th>Password</th><th>Admin</th>";
                newTable.appendChild(headerRow);

                for( let i=0; i < users.length; i++) {
                    let newRow = document.createElement("tr");
                    newRow.innerHTML += `<td>${users[i].userID}</td>`;
                    newRow.innerHTML += `<td>${users[i].fname}</td>`;
                    newRow.innerHTML += `<td>${users[i].lname}</td>`;
                    newRow.innerHTML += `<td>${users[i].email}</td>`;
                    newRow.innerHTML += `<td>${users[i].displayName}</td>`;
                    newRow.innerHTML += `<td>${users[i].password}</td>`;
                    newRow.innerHTML += `<td>${users[i].admin}</td>`;
                    newTable.appendChild(newRow);
                }

                document.getElementById("content").appendChild(newTable);
            });
        }
    )
}

