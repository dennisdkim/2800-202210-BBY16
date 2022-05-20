'use strict';

let postContent = document.getElementById("post-content-container");
let postListContainer = document.getElementById("post-list-container");
let postForm = document.getElementById("timeline-post-form-container");
let searchCoolzoneInput = document.getElementById("post-form-coolzone-id");
let submitPostButton = document.getElementById("submit-post-button");
let suggestionBox = document.getElementById("coolzone-suggestion-box");
let imageSlider = document.getElementById("image-slider");
let postEditForm = document.getElementById("timeline-post-edit-form-container");
let submitPostEditButton = document.getElementById("submit-post-edit-button");
let currentImageContainer = document.getElementById("current-image-container");
let deletePhotoButton = document.getElementById("delete-post-photo-button");
let addPhotoButton = document.getElementById("add-post-photo-button");
let deletePostButton = document.getElementById("delete-post-edit-button");

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

    while (postListContainer.firstChild) {
        postListContainer.removeChild(postListContainer.firstChild);
    };


    fetch("/getTimelinePosts", {
        method: 'GET',
        // headers: {
        //     "Accept": 'application/json',
        //     "Content-Type": 'application/json'
        // },
    }).then(
        function (res) {
            const userData = res.json().then(
                data => {

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
                        
                        newPostContainer.querySelector(".post-date").innerHTML = data[i].postTime.substring(0,10);
                        newPostContainer.querySelector(".post-time").innerHTML = data[i].postTime.substring(11,16);
                        newPostContainer.value = data[i].postID;

                        postListContainer.appendChild(newPostContainer);

                        newPostContainer.addEventListener("click", (e) => {
                            //loadPostContent(data[i].postID, data[i].coolzoneID);
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

    let newBody = new FormData();
    let imageUpload = document.getElementById("image-upload-input");

    newBody.append("title", document.getElementById("post-form-title").value);
    newBody.append("description", document.getElementById("post-form-description").value);
    newBody.append("coolzone", document.getElementById("selected-cz-id").value);
    for( let i =0; i < imageUpload.files.length; i++) {
        newBody.append("photos", imageUpload.files[i]);
    }

    fetch("/submitTimelinePost", {
        method: 'POST',
        body: newBody
    }).then(
        function (res) {
            const data = res.json().then(
                data => {
                    console.log(data.msg);

                    //resets post form//
                    document.getElementById("post-form-title").value = "";
                    document.getElementById("post-form-description").value = "";
                    document.getElementById("selected-coolzone").innerHTML = "";
                    document.getElementById("selected-cz-id").innerHTML = "None Selected";
                    searchCoolzoneInput.value = "";
                    togglePostForm(0);

                    //reload post list//
                    loadPostList();
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

    togglePostContent(1);
    while (currentImageContainer.firstChild) {
        currentImageContainer.removeChild(currentImageContainer.firstChild);
    };
    while (imageSlider.firstChild) {
        imageSlider.removeChild(imageSlider.firstChild);
    };
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
                    document.getElementById("post-content-poster-display-picture").src = data.avatar;
                    document.getElementById("post-content-poster-name").innerHTML = data.displayName;
                    document.getElementById("post-content-post-title").innerHTML = data.title;
                    document.getElementById("post-content-post-date-time").innerHTML = "Posted " + data.postTime.substring(0,10) + " - " + data.postTime.substring(11,16);
                    //adds images//
                    let editImageContainer = document.getElementById("current-image-container");
                    if(data.pictures) {
                        let pictureArray = await JSON.parse(data.pictures);
                        for (let i = 0; i < pictureArray.length; i++) {
                            let newImage = document.createElement("img");
                            newImage.src = pictureArray[i];
                            newImage.alt = "post pic";
                            imageSlider.appendChild(newImage);
                            let newImageDuplicate = newImage.cloneNode(true);
                            newImageDuplicate.addEventListener("click", (e) => {selectThumbnail(e)});
                            editImageContainer.appendChild(newImageDuplicate);
                        }
                    }
                    document.getElementById("post-content-post-description").innerHTML = data.description;
                    if(data.editPermissions) {
                        document.getElementById("edit-post-button").hidden = false;
                    } else {
                        document.getElementById("edit-post-button").hidden = true;
                    }
                    submitPostEditButton.value = czID;
                    deletePhotoButton.value = pID;
                    document.getElementById("post-edit-form-title").value = data.title;
                    document.getElementById("post-edit-form-description").value = data.description;

                }
            )
        }
    )
}

// controls the selection-state of the thumbnail images for deletion //
function selectThumbnail (e) {
    for(let i =0; i < currentImageContainer.childNodes.length; i++) {
        currentImageContainer.childNodes[i].classList.remove("image-selected");
    }
    e.currentTarget.classList.add("image-selected");
}

// deletes a post photo //
document.getElementById("delete-post-photo-button").addEventListener("click", (e)=> {

    let parcel = {postID: e.currentTarget.value, path: '',};
    //identifies the selected photo and extracts the path of the file to be sent back to the server for deletion.//
    for(let i =0; i < currentImageContainer.childNodes.length; i++) {
        if(currentImageContainer.childNodes[i].classList.contains("image-selected")) {
            parcel.path = currentImageContainer.childNodes[i].src.match(/\/img\/[a-zA-Z0-9.\/-]+/gm)[0];
        }
    }
    console.log(parcel);

    if(parcel.path.length > 0) {
        fetch("/deleteTimelinePhoto", {
        method: 'POST',
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(parcel),
    }).then( res => {
        res.json().then(
            data => {
                console.log(data.msg);
                loadPostContent(deletePhotoButton.value, submitPostEditButton.value);
            }
        )
    }   
    )}
} );

// adds a post photo //
addPhotoButton.addEventListener("click", uploadPostPhoto);

function uploadPostPhoto() {

    let newBody = new FormData();
    let imageUpload = document.getElementById("image-edit-upload-input");
    newBody.append("postID", deletePhotoButton.value);

    for( let i =0; i < imageUpload.files.length; i++) {
        newBody.append("photos", imageUpload.files[i]);
    }

    fetch("/addTimelinePhoto", {
        method: 'POST',
        body: newBody
    }).then(
        function (res) {
            const data = res.json().then(
                data => {
                    console.log(data.msg);
                    loadPostContent(deletePhotoButton.value, submitPostEditButton.value);
                })
        }
    )
}

// submits the changes to the timeline post //

submitPostEditButton.addEventListener("click", (e) => {

    fetch("/editTimelinePost", {
        method: 'POST',
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            title: document.getElementById("post-edit-form-title").value,
            description: document.getElementById("post-edit-form-description").value,
            postID: deletePhotoButton.value})
    }).then(
        res => {
            res.json().then(
                data => {
                    console.log(data.msg);

                    //resets post form//
                    document.getElementById("post-edit-form-title").value = "";
                    document.getElementById("post-edit-form-description").value = "";
                    togglePostEdit(0);

                    //reloads post list and content//
                    loadPostContent(deletePhotoButton.value, submitPostEditButton.value);
                    loadPostList();
                }
            )
        }
    )
})


// deletes the timeline post //

deletePostButton.addEventListener("click", () => {
    fetch("/deleteTimelinePost", {
        method: 'POST',
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({postID: deletePhotoButton.value})
    }).then(
        res => {
            res.json().then(
                data => {
                    console.log(data.msg);

                    //resets post form//
                    document.getElementById("post-edit-form-title").value = "";
                    document.getElementById("post-edit-form-description").value = "";
                    togglePostEdit(0);
                    togglePostContent(0);
                    //reloads post list and content//
                    loadPostList();
                }
            )
        }
    )
})

