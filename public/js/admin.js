
'use strict';
window.addEventListener("load", loadUserList);

// loads a list of all users//
function loadUserList () {
    const option = {
        method: 'GET',
    }

    fetch("/getUserList", option).then(
        function (res) {
          const result = res.json().then(
            users => {
                
                let userList = document.getElementById("user-list-container");

                for( let i=0; i < users.length; i++) {
                    let newUser = document.createElement("div");
                    newUser.classList.add("user");
                    newUser.innerHTML = `<div class="user-uid"></div> <div class="user-name"></div> <div class="user-displayname"></div>`;
                    newUser.querySelector(".user-uid").innerHTML = users[i].userID;
                    newUser.querySelector(".user-name").innerHTML = users[i].fname + " " + users[i].lname;
                    newUser.querySelector(".user-displayname").innerHTML = users[i].displayName;
                    userList.appendChild(newUser);
                }

                let user = document.querySelectorAll(".user");

                for( let i=0; i < user.length; i++ ) {
                    user[i].addEventListener("click", (e) => {
                        console.log(e.currentTarget);
                    });
                }
            });
        }
    )
}

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

