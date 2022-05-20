let postContent = document.getElementById("post-content-container");
let postListContainer = document.getElementById("post-list-container");
let postForm = document.getElementById("timeline-post-form-container");
let searchCoolzoneInput = document.getElementById("post-form-coolzone-id");
let submitPostButton = document.getElementById("submit-post-button");
let suggestionBox = document.getElementById("coolzone-suggestion-box");
let imageSlider = document.getElementById("image-slider");
let postEditForm = document.getElementById("timeline-post-edit-form-container");
let submitPostEditButton = document.getElementById("submit-post-edit-button");

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

// shows/hides post-edit-form. Input parameter 1 for showing, 0 for hiding. //
function togglePostEdit(input) {

    if (input == 1) {
        postEditForm.hidden = false;
    } else if (input == 0) {
        postEditForm.hidden = true;
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
                        newPostContainer.value = data[i].postID;

                        postListContainer.appendChild(newPostContainer);

                        newPostContainer.addEventListener("click", (e) => {
                            loadPostContent(data[i].postID, data[i].coolzoneID);
                        });
                    }
                }
            )
        }
    )
}

loadPostList();

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

// loads post content //
function loadPostContent (pID, czID) {
    console.log(pID);
    console.log(czID);
    togglePostContent(1);
    fetch("/loadPostContent", {
        method: 'POST',
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({postID: pID, coolzoneID: czID,})
    }).then(
        res => {
            res.json().then(
                async data => {
                    console.log(data);
                    document.getElementById("post-content-poster-display-picture").src = data.avatar;
                    document.getElementById("post-content-poster-name").innerHTML = data.displayName;
                    document.getElementById("post-content-post-title").innerHTML = data.title;
                    document.getElementById("post-content-post-date-time").innerHTML = "Posted " + data.postTime.substring(0,10) + " - " + data.postTime.substring(11,16);
                    //console.log(data.pictures);
                    //adds images//
                    let editImageContainer = document.getElementById("current-image-container");
                    if(data.pictures) {
                        let pictureArray = await JSON.parse(data.pictures);
                        console.log(pictureArray);
                        for (let i = 0; i < pictureArray.length; i++) {
                            let newImage = document.createElement("img");
                            newImage.src = pictureArray[i];
                            newImage.alt = "post pic";
                            imageSlider.appendChild(newImage);
                            let newImageDuplicate = newImage.cloneNode(true);
                            newImageDuplicate.addEventListener("click", () => {
                                document.getElementById("delete-post-photo-button").value = {postID: pID, path:pictureArray[i]};
                            })
                            editImageContainer.appendChild(newImageDuplicate);
                        }
                    }
                    document.getElementById("post-content-post-description").innerHTML = data.description;
                    console.log(data.editPermissions);
                    submitPostEditButton.value = pID;
                    
                    document.getElementById("post-edit-form-title").value = data.title;
                    document.getElementById("post-edit-form-description").value = data.description;


                }
            )
        }
    )
}

// deletes a post photo //
document.getElementById("delete-post-photo-button").addEventListener("click", async (e)=> {
    let result = await JSON.stringify(e.currentTarget.value);
    console.log(result);
    fetch("/deleteTimelinePhoto", {
        method: 'POST',
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(e.currentTarget.value),
    }).then(
        res.json().then(
            data => {
                console.log(data.msg);
            }
        )
    )
    

} );