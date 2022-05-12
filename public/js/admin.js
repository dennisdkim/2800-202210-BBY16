
'use strict';
window.addEventListener("load", loadUserList);

let userMenu = document.getElementById("userEditMenu");

function toggleEditUserMenu() {
    if (userMenu.hidden) {
        userMenu.hidden = false;
    } else {userMenu.hidden = true;}
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
                        userMenu.hidden = false;

                        fetch(/loadUserData, {
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

                    });
                }
            });
        }
    )
}



