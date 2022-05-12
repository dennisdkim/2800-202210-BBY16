
'use strict';
window.addEventListener("load", loadUserList);

let userEditMenu = document.getElementById("userEditMenu");
let newUserMenu = document.getElementById("newUserMenu");
userEditMenu.hidden = true;
newUserMenu.hidden = true;
let newUserButton = document.getElementById("new-user-button");
newUserButton.addEventListener('click', () => {
    toggleNewUserMenu(1);
} );


function toggleEditUserMenu(input) {
    if (input == 1) {
        userEditMenu.hidden = false;
        newUserMenu.hidden = true;
    } else if (input == 0) {
        userEditMenu.hidden = true;
    }
};

function toggleNewUserMenu(input) {
    if (input == 1) {
        newUserMenu.hidden = false;
        userEditMenu.hidden = true;
    } else if (input == 0) {
        newUserMenu.hidden = true;
    }
};

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

                for( let i=0; i < user.length; i++ ) {
                    user[i].addEventListener("click", (e) => {
                        console.log(e.currentTarget.value);
                        toggleEditUserMenu(1);
                        
                        /*
                        fetch("/loadUserData", {
                            method: 'POST',
                            headers: {
                                "Accept": 'application/json',
                                "Content-Type": 'application/json'
                              },
                            body: JSON.stringify(e.currentTarget.value) 
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
                    });
                }
            });
        }
    )
}



