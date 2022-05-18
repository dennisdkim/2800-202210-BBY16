let postContent = document.getElementById("post-content-container");
let postForm = document.getElementById("timeline-post-form-container");

// shows/hides post-content-container. Input parameter 1 for showing, 0 for hiding. //
function togglePostContent(input) {
    if (input == 1) {
        postContent.hidden = false;
    } else if (input == 0) {
        postContent.hidden = true;
    }
};

function togglePostForm(input) {
    
    if (input == 1) {
        postForm.hidden = false;
    } else if (input == 0) {
        postForm.hidden = true;
    }
};