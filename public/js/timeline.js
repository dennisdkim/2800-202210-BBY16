let postContent = document.getElementById("post-content-container");
let postForm = document.getElementById("timeline-post-form-container");
let searchCoolzoneInput = document.getElementById("post-form-coolzone-id");

// shows/hides post-content-container. Input parameter 1 for showing, 0 for hiding. //
function togglePostContent(input) {
    if (input == 1) {
        postContent.hidden = false;
    } else if (input == 0) {
        postContent.hidden = true;
    }
};

// shows/hides post-form-container. Input parameter 1 for showing, 0 for hiding. //
function togglePostForm(input) {

    if (input == 1) {
        postForm.hidden = false;
    } else if (input == 0) {
        postForm.hidden = true;
    }
};

// retrieves timeline posts and puts them onto the timeline list. //
function loadPostList() {

    fetch("/getTimelinePosts", {
        method: 'POST',
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json'
        },
    }).then(
        function (res) {
            const userData = res.json().then(
                data => {
                    console.log(data.msg);

                    data.forEach(post => {
                        let newPostContainer = document.createElement("div");

                        newPostContainer.innerHTML =
                            `<div class="poster-display-pic-container">
                            <img class="poster-display-pic" src="/img/userAvatars/avatar-user3.png" alt="">
                            </div>
                            <div class="post-info-container">
                            <h3 class="poster-name"></h3>
                            <p class="post-description"></p>
                            <button class="find-on-map-button">Find on Map</button>
                            <p class="post-timestamp">Posted <span class="post-date"></span> - <span class="post-time">2:34pm</span></p>
                            </div>
                            </div>`;
                        newPostContainer.classList.add("post-container");
                        newPostContainer.querySelector(".poster-display-pic-container");
                        //continue filling in list text //

                    })
                }
            )
        }
    )
}

function loadCoolzoneSuggestions () {

    fetch("/getCoolzones", {
        method: 'POST',
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            query: document.getElementById("search-user-bar").value,
        })
    }).then(
        function (res) {
            const userData = res.json().then(
                data => {
                    console.log(data.msg);

                    data.forEach(post => {
                        let newPostContainer = document.createElement("div");

                        newPostContainer.innerHTML =
                            `<div class="poster-display-pic-container">
                            <img class="poster-display-pic" src="/img/userAvatars/avatar-user3.png" alt="">
                            </div>
                            <div class="post-info-container">
                            <h3 class="poster-name"></h3>
                            <p class="post-description"></p>
                            <button class="find-on-map-button">Find on Map</button>
                            <p class="post-timestamp">Posted <span class="post-date"></span> - <span class="post-time">2:34pm</span></p>
                            </div>
                            </div>`;
                        newPostContainer.classList.add("post-container");
                        newPostContainer.querySelector(".poster-display-pic-container");


                    })
                }
            )
        }
    )
}
