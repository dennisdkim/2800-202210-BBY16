
'use strict';

// Page Initialization //
window.addEventListener("load", loadUserList);

let userEditMenu = document.getElementById("userEditMenu");
let newUserMenu = document.getElementById("newUserMenu");
userEditMenu.hidden = true;
newUserMenu.hidden = true;
let newUserButton = document.getElementById("new-user-button");
newUserButton.addEventListener('click', () => {
    toggleNewUserMenu(1);
});
let saveUserInfoButton = document.getElementById("saveButton");
let deleteUserButton = document.getElementById("deleteButton");


// shows/hides edit user menu. Input parameter 1 for showing, 0 for hiding. //
function toggleEditUserMenu(input) {
    if (input == 1) {
        userEditMenu.hidden = false;
        newUserMenu.hidden = true;
    } else if (input == 0) {
        userEditMenu.hidden = true;
    }
};

// shows/hides add new user menu. Input parameter 1 for showing, 0 for hiding. //
function toggleNewUserMenu(input) {
    if (input == 1) {
        newUserMenu.hidden = false;
        userEditMenu.hidden = true;
    } else if (input == 0) {
        newUserMenu.hidden = true;
    }
};

// loads a list of all users//
function loadUserList() {
    const option = {
        method: 'GET',
    }

    fetch("/getUserList", option).then(
        function (res) {
            const result = res.json().then(
                users => {

                    let userList = document.getElementById("user-list-container");

                    for (let i = 0; i < users.length; i++) {

                        //const imagePath = `./public/img/userAvatars/avatar-user${users[i].userID}`; 
                        let newUser = document.createElement("button");
                        newUser.classList.add("user");
                        newUser.value = users[i].userID;
                        const defaultProfilePic = `<img src="/img/userAvatars/default.png" alt="profile">`;
                        const userInfo = `<div class="user-names"><div class="user-uid"></div> <div class="user-name"></div> <div class="user-displayname"></div></div>`;
                        newUser.innerHTML = defaultProfilePic + userInfo;
                        newUser.querySelector(".user-uid").innerHTML = "ID: " + users[i].userID;
                        newUser.querySelector(".user-name").innerHTML = "Name: " + users[i].fname + " " + users[i].lname;
                        newUser.querySelector(".user-displayname").innerHTML = "User: " + users[i].displayName;
                        userList.appendChild(newUser);

                    }

                    let user = document.querySelectorAll(".user");

                    for (let i = 0; i < user.length; i++) {
                        user[i].addEventListener("click", (e) => {
                            console.log(e.currentTarget.value);
                            toggleEditUserMenu(1);

                            
                            fetch("/loadUserData", {
                                method: 'POST',
                                headers: {
                                    "Accept": 'application/json',
                                    "Content-Type": 'application/json'
                                  },
                                body: JSON.stringify({userID: e.currentTarget.value}) 
                            }).then(
                                function (res) {
                                    const userData = res.json().then(
                                        data => {
                                            console.log(data);
                                            document.getElementById("profile-id").innerHTML = data.userID;
                                            document.getElementById("profile-name").innerHTML = data.fname + " " + data.lname;
                                            document.getElementById("displayName").value = data.displayName;
                                            document.getElementById("fname").value = data.fname;
                                            document.getElementById("lname").value = data.lname;
                                            document.getElementById("email").value = data.email;
                                            //document.getElementById("newPassword").value = data.password;
                                            if(data.admin) {
                                                document.getElementById("adminStatus").checked = true;
                                            } else {
                                                document.getElementById("adminStatus").checked = false;
                                            }
                                            saveUserInfoButton.value = data.userID;
                                            deleteUserButton.value = data.userID;
                                        }
                                    )
                                }
                            )
                            
                        });
                    }
                });
        }
    )
}


//function to edit user data //
saveUserInfoButton.addEventListener("click", (e) => {
    console.log(e.currentTarget.value);

    fetch("/editUserData", {
        method: 'POST',
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json'
          },
        body: JSON.stringify({
            userID: e.currentTarget.value,
            displayName: document.getElementById("displayName").value.trim(),
            fname: document.getElementById("fname").value.trim(),
            lname: document.getElementById("lname").value.trim(),
            email: document.getElementById("email").value.trim(),
            password: document.getElementById("newPassword").value.trim(),
            admin: document.getElementById("adminStatus").checked ? 1 : 0,
            
        }) 
    }).then(
        function (res) {
            const userData = res.json().then(
                data => {
                    console.log(data.msg);
                }
            )
        }
    )

});

//function for deleting a user//
deleteUserButton.addEventListener("click", (e)=> {
    console.log(e.currentTarget.value);
    /*
    fetch("/deleteUser", {
        method: 'POST',
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({userID: e.currentTarget.value})
    }).then(
        function (res) {
            const userData = res.json().then(
                data => {
                    console.log(data);
                }
            )
        }
    )
    */
})


/*
//function for adding a new user//
function addUser() {
    
    fetch("/loadUserData", {
        method: 'POST',
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json'
          },
        body: JSON.stringify({
            displayName: document.getElementById("newUser-DisplayName").value.trim(),
            fname: document.getElementById("newUser-fname").value.trim(),
            lName: document.getElementById("newUser-lname").value.trim(),
            email: document.getElementById("newUser-Email").value.trim(),
            password: document.getElementById("newUser-Password").value.trim(),
            admin: document.getElementById("").value,
        }) 
    }).then(
        function (res) {
            const userData = res.json().then(
                data => {
                    console.log(data);
                }
            )
        }
    )
    
}
*/