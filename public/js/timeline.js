let postContent = document.getElementById("post-content-container");
let postListContainer = document.getElementById("post-list-container");
let postForm = document.getElementById("timeline-post-form-container");
let searchCoolzoneInput = document.getElementById("post-form-coolzone-id");
let submitPostButton = document.getElementById("submit-post-button");
let suggestionBox = document.getElementById("coolzone-suggestion-box");


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
            console.log(res);
            const userData = res.json().then(
                data => {
                    console.log(data);

                    for (let i = 0; i < data.length; i++) {
                        let newPostContainer = document.createElement("li");
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
                        newPostContainer.querySelector(".poster-display-pic").src = data[i].avatar;
                        newPostContainer.querySelector(".poster-name").innerHTML = data[i].displayName;
                        newPostContainer.querySelector(".post-description").innerHTML = data[i].title;
                        
                        console.log("postTime is a : " + typeof(data[i].postTime));
                        newPostContainer.querySelector(".post-date").innerHTML = data[i].postTime.substring(0,10);
                        newPostContainer.querySelector(".post-time").innerHTML = data[i].postTime.substring(11,16);

                        postListContainer.appendChild(newPostContainer);

                        //continue filling in the data, then append into post list container //
                    }
                }
            )
        }
    )
}

loadPostList();

function loadPostContent(num) {
    post = {postID: num};
    fetch("/loadPostContent", {
        method: 'POST',
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(post)
    }).then(
        function (res) {
            const userData = res.json().then(
                data => {
                    console.log(data);
                }
            );
        }
    );
}

// submits the creation of timeline posts into the server //
submitPostButton.addEventListener("click", createPost);

function createPost() {

    console.log("create a post");
    let newBody = new FormData();
    let imageUpload = document.getElementById("image-upload-input");

    newBody.append("title", document.getElementById("post-form-title").value);
    newBody.append("description", document.getElementById("post-form-description").value);
    newBody.append("coolzone", document.getElementById("selected-cz-id").value);
    for( let i =0; i < imageUpload.files.length; i++) {
        newBody.append("photos", imageUpload.files[i]);
        console.log(imageUpload.files[i]);
    }

    fetch("/submitTimelinePost", {
        method: 'POST',
        body: newBody
    }).then(
        function (res) {
            const data = res.json().then(
                data => {
                    console.log(data.msg);

                })
        }
    )
}

// clears the selected coolzones queue. //
document.getElementById("remove-selected-cz-button").addEventListener("click", (e)=> {
    document.getElementById("selected-coolzone").innerHTML = "None Selected";
    document.getElementById("selected-cz-id").innerHTML = "";
})

// generates suggestions for coolzones in the coolzone search bar. //
searchCoolzoneInput.addEventListener("keyup", generateSuggestions);

function generateSuggestions () {
    console.log(searchCoolzoneInput.value);
    while (suggestionBox.firstChild) {
        suggestionBox.removeChild(suggestionBox.firstChild);
    };

    if(searchCoolzoneInput.value.length>0) {
        fetch("/getCoolzoneSuggestions", {
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({query: searchCoolzoneInput.value,})
        }).then(
            res => {
                res.json().then(
                    data => {
                        console.log(data);
                        let numOfSuggestions = 5;
    
                        if(data.length < 5) {
                            numOfSuggestions = data.length;
                        }
    
                        for(let i = 0; i < numOfSuggestions; i++) {
                            data[i]
                            let newSuggestion = document.createElement("li");
                            newSuggestion.classList.add("coolzone-suggestion");
                            newSuggestion.innerHTML = data[i].CZNAME + " - " + data[i].LOCATION;
                            newSuggestion.value = data[i].EVENTID;
                            suggestionBox.appendChild(newSuggestion);
                            newSuggestion.value = data[i].EVENTID;

                            newSuggestion.addEventListener("click", (e)=> {
                                document.getElementById("selected-coolzone").innerHTML = e.currentTarget.innerText;
                                document.getElementById("selected-cz-id").innerHTML = e.currentTarget.value;
                            })
                        }
    
                    }
                )
            }
        )
    }       
}

