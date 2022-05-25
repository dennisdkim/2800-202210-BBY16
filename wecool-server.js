'use strict';

//Requires
const express = require("express");
const session = require("express-session");
const app = express();
app.use(express.json());
const fs = require("fs");
const mysql = require("mysql2");
const multer = require("multer");
const { connect } = require("tls");

//Mapping system paths to app's virtual paths
app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/img", express.static("./public/img"));
app.use("/sounds", express.static("./public/sounds"));
app.use("/html", express.static("./app/html"));

//Storage for user uploaded files (avatars/display pictures)
const avatarStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/img/userAvatars/");
    },
    filename: function (req, file, callback) {
        callback(null, "avatar-user" + req.session.userID + ".png");
    }
});
const avatarUpload = multer({
    storage: avatarStorage
});

//Storage for user uploaded timeline photos
const timelineStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/img/timelinePhotos/");
    },
    filename: function (req, file, callback) {
        const photoCode = Date.now() + "-" + Math.round(Math.random() * Math.pow(10, 10));
        callback(null, photoCode + "." + file.originalname.split('.').pop().trim());
    }
});

const timelineUpload = multer({
    storage: timelineStorage
});

//Storage for user uploaded files of coolzones.
const coolzoneStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/img/coolzones/")
    },
    filename: function (req, file, callback) {
        callback(null, "coolzone-user" + req.session.userID + ".png");
    }
});
const coolzoneUpload = multer({
    storage: coolzoneStorage
});

app.use(session({
    secret: "abc123bby16project",
    name: "weCoolSessionID",
    resave: false,
    saveUninitialized: true
}));

//heroku db configuration. Use only for hosting. //

const dbConfigHeroku = {
    host: "us-cdbr-east-05.cleardb.net",
    user: "b3823a53995411",
    password: "762e1d0a",
    database: "heroku_c99a07a4f72e738"
}

let connection = mysql.createPool(dbConfigHeroku);


//local connection configuration object. //
// const connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "COMP2800"
// });

//Root route//
app.get("/", function (req, res) {
    if (req.session.loggedIn) {
        res.redirect("/home");
    } else {
        let doc = fs.readFileSync("./app/html/login.html", "utf8");
        res.set("Server", "Wazubi Engine");
        res.set("X-Powered-By", "Wazubi");
        res.send(doc);
    }
});

//inputs into the user database table//
app.post("/newSignUp", function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    // Checking for email or display name in existing accounts
    connection.query('SELECT * FROM BBY_16_user WHERE displayName = ? OR email = ?;', [req.body.displayName, req.body.email],
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            let users = results;
            if (users.length > 0) {
                let displayNameTaken = false;
                let emailTaken = false;
                for (let i = 0; i < users.length; i++) {
                    if (users[i].displayName == req.body.displayName) {
                        displayNameTaken = true;
                    }
                    if (users[i].email == req.body.email) {
                        emailTaken = true;
                    }
                }
                if (displayNameTaken && emailTaken) {
                    res.send({ status: "fail", msg: "The display name and email is taken" });
                } else {
                    if (displayNameTaken) {
                        res.send({ status: "fail", msg: "The display name is taken" });
                    }
                    if (emailTaken) {
                        res.send({ status: "fail", msg: "The email is taken" });
                    }
                }
                // If email and display name is not taken, then create account
            } else {
                connection.query('INSERT INTO BBY_16_user(fname, lname, displayName, email, password) VALUES (?, ?, ?, ?, ?);', [req.body.fname, req.body.lname, req.body.displayName, req.body.email, req.body.password],
                    function (error, results, fields) {
                        if (error) {
                            console.log(error);
                        }
                        res.send({ status: "success", msg: "Account created" });
                    });
            }
        });
});

//inputs into the coolzone database table//
app.post("/tryCoolzone", function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    // Checking for coolzone exists
    connection.query('INSERT INTO BBY_16_coolzones(hostid, czname, location, startdate, enddate, description, longitude, latitude, aircon, freedrinks, waterpark, pool, outdoors, indoors, wifi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [req.session.userID, req.body.coolzoneName, req.body.location, req.body.dateTag, req.body.enddateTag, req.body.description, req.body.longitude, req.body.latitude, req.body.acTag, req.body.fdTag, req.body.wpTag, req.body.poolTag, req.body.outdoorTag, req.body.indoorTag, req.body.wifiTag],
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            res.send({ status: "success", msg: "Coolzone created." });
        });
});

//loads the profile page//
app.get("/profile", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/profile.html", "utf8");
        res.send(profile);
    } else {
        res.redirect("/");
    }
});

//loads the coolzone page//
app.get("/coolzone", function (req, res) {
    if (req.session.loggedIn) {
        let coolzone = fs.readFileSync("./app/html/coolzone.html", "utf8");
        res.send(coolzone);
    } else {
        res.redirect("/");
    }
});

//loads the admin page//
app.get("/admin", function (req, res) {
    if (req.session.loggedIn) {
        let admin = fs.readFileSync("./app/html/admin_dashboard.html", "utf8");
        res.send(admin);
    } else {
        res.redirect("/");
    }
});

//loads the settings page//
app.get("/settings", function (req, res) {
    if (req.session.loggedIn) {
        let settings = fs.readFileSync("./app/html/settings.html", "utf8");
        res.send(settings);
    } else {
        res.redirect("/");
    }
});

//loads the timeline page//
app.get("/timeline", function (req, res) {
    if (req.session.loggedIn) {
        let timeline = fs.readFileSync("./app/html/timeline.html", "utf8");
        res.send(timeline);
    } else {
        res.redirect("/");
    }
});

//loads the map page//
app.get("/map", function (req, res) {
    if (req.session.loggedIn) {
        let map = fs.readFileSync("./app/html/map.html", "utf8");
        res.send(map);
    } else {
        res.redirect("/");
    }
});

//loads the signup page//
app.get("/signUp", function (req, res) {
    let doc = fs.readFileSync("./app/html/signup.html", "utf8");
    res.send(doc);
});

//loads the home page//
app.get("/home", function (req, res) {
    if (req.session.loggedIn && req.session.admin == 0) {
        res.send(fs.readFileSync("./app/html/home.html", "utf8"));
    } else if (req.session.loggedIn && req.session.admin > 0) {
        res.send(fs.readFileSync("./app/html/admin.html", "utf8"))
    } else {
        res.redirect("/");
    }
});

//user login verification//
app.use(express.urlencoded({
    extended: true
}));

//Verifies user credentials exist within db. 
//If credentials are correct, user is logged in.
app.post("/login", function (req, res) {
    //select statement for all tuples matching both provided email AND password. Should return 0-1 results.
    connection.query(`SELECT * FROM BBY_16_user WHERE email = "${req.body.email}" AND password = "${req.body.password}";`, function (error, results, fields) {
        if (results.length == 1) {
            req.session.loggedIn = true;
            req.session.userID = results[0].userID;
            req.session.displayName = results[0].displayName;
            req.session.email = results[0].email;
            req.session.password = results[0].password;
            req.session.fname = results[0].fname;
            req.session.lname = results[0].lname;
            req.session.admin = results[0].admin;
            req.session.userID = results[0].userID;
            res.send({
                status: "success",
                msg: "Logged in.",
                admin: req.session.admin
            });
        } else {
            res.send({
                status: "fail",
                msg: "User account not found."
            });
        }
    })
})

//user logout code//
app.get("/logout", function (req, res) {
    if (req.session) {
        req.session.destroy(function (error) {
            if (error) {
                res.status(400).send("Unable to log out.");
            } else {
                res.redirect("/");
            }
        });
    }
});

//returns a navbar and footer to the page//
app.get("/getNavbarFooter", function (req, res) {
    let navbar;
    if (req.session.admin > 0) {
        navbar = fs.readFileSync("./app/html/components/navbar_admin.html", "utf8");
    } else {
        navbar = fs.readFileSync("./app/html/components/navbar.html", "utf8");
    }
    const footer = fs.readFileSync("./app/html/components/footer.html", "utf8");
    const components = {
        "navbar": navbar,
        "footer": footer,
    };
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(components));
});

//returns the info of the currently active user in the session
app.get("/getUserInfo", function (req, res) {
    let displayPic;
    const avatarPath = "/img/userAvatars/avatar-user" + req.session.userID + ".png";
    if (fs.existsSync("./public/" + avatarPath)) {
        displayPic = avatarPath;
    } else {
        displayPic = "/img/userAvatars/default.png";
    }
    const userData = {
        "userID": req.session.userID,
        "fname": req.session.fname,
        "lname": req.session.lname,
        "displayName": req.session.displayName,
        "email": req.session.email,
        "password": req.session.password,
        "admin": req.session.admin,
        "avatar": displayPic
    };
    res.send(JSON.stringify(userData));
});


//returns the selected user data in the admin console
app.post("/loadUserData", function (req, res) {
    let displayPic;
    const avatarPath = "/img/userAvatars/avatar-user" + req.body.userID + ".png";
    if (fs.existsSync("./public" + avatarPath)) {
        displayPic = avatarPath;
    } else {
        displayPic = "/img/userAvatars/default.png"
    }
    connection.query('SELECT * FROM BBY_16_user WHERE userID = ?;', req.body.userID, function (error, results, fields) {
        if (error) {
            console.log(error);
        }
        let user = results[0];
        const userData = {
            "userID": user.userID,
            "fname": user.fname,
            "lname": user.lname,
            "displayName": user.displayName,
            "email": user.email,
            "password": user.password,
            "admin": user.admin,
            "avatar": displayPic
        };
        res.send(JSON.stringify(userData));
    });
});

//returns the info for all users to be sent to admin//
app.get("/getUserTable", function (req, res) {
    connection.query('SELECT * FROM BBY_16_user WHERE userID = ?;', req.body.userID, function (error, results, fields) {
        if (error) {
            console.log(error);
        }
        let user = results[0];
        const userData = {
            "userID": user.userID,
            "fname": user.fname,
            "lname": user.lname,
            "displayName": user.displayName,
            "email": user.email,
            "password": user.password,
            "admin": user.admin,
            "avatar": displayPic
        };
        res.send(JSON.stringify(userData));
    });
});


// Delete user from database on admin dashboard - the user must enter the correct display name to confirm the deletion,
// they also cannot delete themselves which will also protect against deleting the last admin as well (as they can't delete
// themselves anyway if they're the last admin in the database)
app.post("/deleteUser", function (req, res) {
    connection.query('SELECT * FROM BBY_16_user WHERE userID = ? AND displayName = ?;', [req.body.userID, req.body.displayName],
        function (error, results, fields) {

            if (error) {
                console.log(error);
            }
            if (results.length == 0) {
                res.send({ status: "fail", msg: "Incorrect display name" });
            } else {
                if (req.session.userID == req.body.userID) {
                    res.send({ status: "fail", msg: "Cannot delete yourself" });
                } else {
                    connection.query('DELETE FROM BBY_16_user WHERE userID = ?;', req.body.userID, function (error, results, fields) {
                        res.send({ status: "success", msg: "User deleted" });
                    });
                }
            }
        });
});

// Adds new user from admin dashboard and checks if display name and email is already in use, before inserting values
app.post("/addNewUser", function (req, res) {
    connection.query('SELECT * FROM BBY_16_user WHERE displayName = ? OR email = ?;', [req.body.displayName, req.body.email],
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            let users = results;
            if (users.length > 0) {
                let displayNameTaken = false;
                let emailTaken = false;
                for (let i = 0; i < users.length; i++) {
                    if (users[i].displayName == req.body.displayName) {
                        displayNameTaken = true;
                    }
                    if (users[i].email == req.body.email) {
                        emailTaken = true;
                    }
                }
                if (displayNameTaken && emailTaken) {
                    res.send({ status: "fail", msg: "The display name and email is taken" });
                } else {
                    if (displayNameTaken) {
                        res.send({ status: "fail", msg: "The display name is taken" });
                    }
                    if (emailTaken) {
                        res.send({ status: "fail", msg: "The email is taken" });
                    }
                }
            } else {
                addUser(req, res, connection);
            }
        });
});

//Adds new user into user table with inputs after checks have been done
function addUser(req, res, connection) {
    connection.query('INSERT INTO BBY_16_user(fname, lname, displayName, email, password, admin) VALUES (?, ?, ?, ?, ?, ?);', [req.body.fname, req.body.lname, req.body.displayName, req.body.email, req.body.password, req.body.admin],
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            res.send({ status: "success", msg: "New user added." });
        });
}

//retruns the admin dashboard page//
app.get("/admin_dashboard", function (req, res) {
    if (req.session.loggedIn && req.session.admin > 0) {
        res.send(fs.readFileSync("./app/html/admin_dashboard.html", "utf8"));
    } else {
        res.redirect("/");
    }
});

//returns a list of users to the admin dashboard//
app.post("/getUserList", function (req, res) {
    if (req.session.loggedIn && req.session.admin > 0) {
        let queryFilter = "";
        if (req.body.query.length > 0) {
            queryFilter = `WHERE (fname LIKE "%${req.body.query}%" OR lname LIKE "%${req.body.query}%" OR displayName LIKE "%${req.body.query}%")`;
        }
        connection.query(`SELECT userID, fname, lname, displayName FROM BBY_16_user ${queryFilter};`, function (error, results, fields) {
            if (results.length > 0) {
                let resultsWithDisplayImages = results.map(user => {
                    let displayPic;
                    const avatarPath = "/img/userAvatars/avatar-user" + user.userID + ".png";
                    if (fs.existsSync("./public" + avatarPath)) {
                        displayPic = avatarPath;
                    } else {
                        displayPic = "/img/userAvatars/default.png"
                    }
                    user.avatar = displayPic;
                    return user;
                })
                res.send(JSON.stringify(resultsWithDisplayImages));
            } else {
                res.send({ status: "fail", msg: "No user accounts found." });
            }
        });

    } else {
        res.send("Admin status required for access.");
    }
});

// Checks the database for the current user's password to verify identity before making changes
app.post("/verifyPw", function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    if (req.body.password1 != req.body.password2) {
        res.send({
            status: "fail",
            msg: "Passwords do not match"
        });
    } else {
        connection.query('SELECT * FROM BBY_16_user WHERE password = ? AND userID = ?;', [req.body.password1, req.session.userID],
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                }
                if (results.length == 1) {
                    res.send({
                        status: "success",
                        msg: "Success!"
                    });
                } else {
                    res.send({
                        status: "fail",
                        msg: "Wrong password"
                    });
                }
            });
    }
});

// Updates the user info and checks if display name and email is already in use, before setting values 
app.post("/editUserData", function (req, res) {
    if (req.body.fname == "" || req.body.lname == "" || req.body.displayName == "" || req.body.email == "" || req.body.password == "") {
        res.send({ status: "fail", msg: "Fields must not be empty!" });
    } else {
        connection.query('SELECT * FROM BBY_16_user WHERE userID <> ? AND (displayName = ? OR email = ?);', [req.body.userID, req.body.displayName, req.body.email],
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                }
                let users = results;
                if (users.length > 0) {
                    let displayNameTaken = false;
                    let emailTaken = false;
                    for (let i = 0; i < users.length; i++) {
                        if (users[i].displayName == req.body.displayName) {
                            displayNameTaken = true;
                        }
                        if (users[i].email == req.body.email) {
                            emailTaken = true;
                        }
                    }
                    if (displayNameTaken && emailTaken) {
                        res.send({ status: "fail", msg: "The display name and email is taken" });
                    } else {
                        if (displayNameTaken) {
                            res.send({ status: "fail", msg: "The display name is taken" });
                        }
                        if (emailTaken) {
                            res.send({ status: "fail", msg: "The email is taken" });
                        }
                    }
                } else {
                    updateChanges(req, res, connection);
                }
            });
    }
});

//Update all fields with the valid inputs after checks have been done
function updateChanges(req, res, connection) {
    connection.query('UPDATE BBY_16_user SET fname = ?, lname = ?, displayName = ?, email = ?, password = ? WHERE userID = ?;', [req.body.fname, req.body.lname, req.body.displayName, req.body.email, req.body.password, req.body.userID],
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            // If the user is editing their own info -> need to update current session info as well
            if (req.session.userID == req.body.userID) {
                req.session.fname = req.body.fname;
                req.session.lname = req.body.lname;
                req.session.displayName = req.body.displayName;
                req.session.email = req.body.email;
                req.session.password = req.body.password;
            }
            // This edit can only be done through admin dashboard, and when they submit a change through that the request body will have an additional "admin" key
            if (("admin" in req.body) == true) {
                connection.query('UPDATE BBY_16_user SET admin = ? WHERE userID = ?;', [req.body.admin, req.body.userID],
                    function (error, results, fields) {
                        if (error) {
                            console.log(error);
                        }
                        res.send({ status: "success", msg: "Changes saved" });
                    });
            }
            else {
                res.send({ status: "success", msg: "Changes saved" });
            }
        });
}

// Uploads avatar image to file system
app.post("/upload-avatar", avatarUpload.single("avatar"), function (req, res) {
    req.file.filename = req.file.originalname;
    res.send({ "status": "success", "path": "/img/userAvatars/avatar-user" + req.session.userID + ".png" });
});

// Submits timeline post information into the database BBY_16_timeline, and also uploads any photos into the file system in img/timelinePhotos
app.post("/submitTimelinePost", timelineUpload.array("photos"), function (req, res) {
    console.log(req.body.title);
    let coolzoneID;
    if (req.body.coolzoneID == "") {
        coolzoneID = null;
    } else {
        coolzoneID = req.body.coolzoneID;
    }
    let currentDate = new Date();
    let curDateTime = currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate() + " " + currentDate.getHours()
        + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
    let pictures = [];
    for (let i = 0; i < req.files.length; i++) {
        pictures.push("/img/timelinePhotos/" + req.files[i].filename);
    }
    connection.query('INSERT INTO BBY_16_timeline (userID, postTime, title, description, coolzoneID, pictures) VALUES (?, ?, ?, ?, ?, ?);',
        [req.session.userID, curDateTime, req.body.title, req.body.description, coolzoneID, JSON.stringify(pictures)],
        function (error, result, fields) {
            if (error) {
                console.log(error);
            }
            res.send({ status: "success", msg: "Post submitted" });
        });
});



// Sends the information necessary to display the timeline "preview" cards on the timeline page
app.get("/getTimelinePosts", function (req, res) {
    let timelineData = [];
    connection.query(`SELECT BBY_16_user.displayName, BBY_16_timeline.userID, BBY_16_timeline.postTime, BBY_16_timeline.title, BBY_16_timeline.coolzoneID, BBY_16_timeline.postID `
        + `FROM BBY_16_timeline INNER JOIN BBY_16_user ON BBY_16_timeline.userID = BBY_16_user.userID ORDER BY postTime DESC;`,
        function (error, results, fields) {
            console.log(results);
            for (let i = 0; i < results.length; i++) {
                let displayPic;
                const avatarPath = "/img/userAvatars/avatar-user" + results[i].userID + ".png";
                if (fs.existsSync("./public" + avatarPath)) {
                    displayPic = avatarPath;
                } else {
                    displayPic = "/img/userAvatars/default.png"
                }
                timelineData[i] = {
                    displayName: results[i].displayName,
                    avatar: displayPic,
                    postTime: results[i].postTime,
                    title: results[i].title,
                    coolzoneID: results[i].coolzoneID,
                    postID: results[i].postID
                };
                console.log(timelineData[i]);
            }
            console.log(timelineData);
            res.send(JSON.stringify(timelineData));
        });

});

// Loads the content page for each timeline post. It will load slightly different information, depending on if the post is associated with a
// coolzone vs. a regular post (not associated with coolzone)
app.post("/loadPostContent", function (req, res) {
    // A timeline post that links to a coolzone, it will load the coolzone traits as well as coolzone ID
    if (req.body.coolzoneID == !false) {
        connection.query('SELECT BBY_16_timeline.*, BBY_16_user.displayName, BBY_16_coolzones.aircon, BBY_16_coolzones.freedrinks, BBY_16_coolzones.waterpark, BBY_16_coolzones.pool, BBY_16_coolzones.outdoors, BBY_16_coolzones.wifi' +
            ' FROM ((BBY_16_timeline INNER JOIN BBY_16_user ON BBY_16_timeline.userID = BBY_16_user.userID) ' +
            'INNER JOIN BBY_16_coolzones ON BBY_16_timeline.coolzoneID = BBY_16_coolzones.eventID) WHERE BBY_16_timeline.postID = ?;', req.body.postID,
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                }
                let displayPic;
                const avatarPath = "/img/userAvatars/avatar-user" + results[0].userID + ".png";
                if (fs.existsSync("./public" + avatarPath)) {
                    displayPic = avatarPath;
                } else {
                    displayPic = "/img/userAvatars/default.png"
                }
                let postData = {
                    postID: results[0].postID,
                    displayName: results[0].displayName,
                    avatar: displayPic,
                    postTime: results[0].postTime,
                    title: results[0].title,
                    description: results[0].description,
                    pictures: results[0].pictures,
                    coolzoneID: results[0].coolzoneID,
                    aircon: results[0].aircon,
                    freedrinks: results[0].freedrinks,
                    waterpark: results[0].waterpark,
                    pool: results[0].pool,
                    outdoors: results[0].outdoors,
                    wifi: results[0].wifi,
                    editPermissions: (results[0].userID == req.session.userID) ? true : false
                };
                console.log(postData);
                res.send(JSON.stringify(postData));
            });
        // A regular timeline post not associated to any coolzone, it will only load post info
    } else {
        connection.query('SELECT BBY_16_timeline.*, BBY_16_user.displayName FROM BBY_16_timeline ' +
            'INNER JOIN BBY_16_user ON BBY_16_timeline.userID = BBY_16_user.userID WHERE BBY_16_timeline.postID = ?;', req.body.postID,
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                }
                let displayPic;
                const avatarPath = "/img/userAvatars/avatar-user" + results[0].userID + ".png";
                if (fs.existsSync("./public" + avatarPath)) {
                    displayPic = avatarPath;
                } else {
                    displayPic = "/img/userAvatars/default.png"
                }
                let postData = {
                    postID: results[0].postID,
                    displayName: results[0].displayName,
                    avatar: displayPic,
                    postTime: results[0].postTime,
                    title: results[0].title,
                    description: results[0].description,
                    pictures: results[0].pictures,
                    editPermissions: (results[0].userID == req.session.userID) ? true : false
                };
                res.send(JSON.stringify(postData));
            });
    }
});

// Uploads coolzone image to file system
app.post('/upload-coolzone', coolzoneUpload.single("files"), function (req, res) {
    req.file.filename = req.file.originalname;
    res.send({ "status": "success", "path": "/img/coolzones/coolzone-user" + req.session.userID + ".png" });
});

// //loads all coolzones within search radius
// app.post("/loadCoolzones", function (req, res) {

//     connection.query('SELECT * FROM bby_16_coolzones WHERE longitude BETWEEN ? AND ? AND latitude BETWEEN ? AND ?',
//         [req.body.minLng, req.body.maxLng, req.body.minLat, req.body.maxLat],
//         function (error, results) {
//             if (error) {
//                 console.log(error);
//             }
//             else if (results.length == 0) {
//                 res.send({ status: "success", msg: "no coolzones" });
//             } else {
//                 res.send({
//                     status: "success",
//                     msg: "yes coolzones",
//                     coolzones: results
//                 });
//             }
//         });
// });

// Allows admin user to delete avatar from file system 
app.post("/deleteUserAvatar", function (req, res) {
    const path = "./public/img/userAvatars/avatar-user" + req.body.userID + ".png";
    if (fs.existsSync(path)) {
        fs.unlink(path, (error) => {
            if (error) {
                console.log(error);
            }
            res.send({ status: "success", msg: "Display picture deleted" });
        });
    } else {
        res.send({ status: "fail", msg: "This user does not have a display picture" });
    }
});

//loads all coolzones within search radius
app.post("/loadCoolzones", function (req, res) {

    // BBY_16_user.displayName, BBY_16_coolzones.aircon, BBY_16_coolzones.freedrinks, BBY_16_coolzones.waterpark, BBY_16_coolzones.pool, BBY_16_coolzones.outdoors, BBY_16_coolzones.wifi
    let selectStatement = 'SELECT * FROM bby_16_coolzones WHERE longitude BETWEEN ? AND ? AND latitude BETWEEN ? AND ?';
    if (req.body.aircon.checked){
        selectStatement = selectStatement + " AND aircon = 1";
    }
    if (req.body.freeWater.checked){
        selectStatement = selectStatement + " AND freedrinks = 1";
    }
    if (req.body.swimmingPool.checked){
        selectStatement = selectStatement + " AND waterpark = 1";
    }
    if (req.body.waterPark.checked){
        selectStatement = selectStatement + " AND pool = 1";
    }
    if (req.body.outdoor.checked){
        selectStatement = selectStatement + " AND outdoors = 1";
    }
    if (req.body.indoor.checked){
        selectStatement = selectStatement + " AND indoors = 1";
    }
    if (req.body.freeWifi.checked){
        selectStatement = selectStatement + " AND wifi = 1";
    }

    console.log("req.body.aircon.checked: " + req.body.aircon.checked);
    console.log("req.body.freewater.checked: " + req.body.freeWater.checked);
    console.log("req.body.swimmingPool.checked: " + req.body.swimmingPool.checked);
    console.log("req.body.waterPark.checked: " + req.body.waterPark.checked);
    console.log("req.body.outdoor.checked: " + req.body.outdoor.checked);

    console.log(selectStatement);

    connection.query(selectStatement,
        [req.body.minLng, req.body.maxLng, req.body.minLat, req.body.maxLat],
        function (error, results) {
            if (error) {
                console.log(error);
            }
            else if (results.length == 0) {
                res.send({ status: "success", msg: "no coolzones" });
            } else {
                console.log(results);
                res.send({
                    status: "success",
                    msg: "yes coolzones",
                    coolzones: results
                });
            }
        });
});

// Updates the timeline table with the edited values in the post title and post description
app.post("/editTimelinePost", function (req, res) {
    if (req.body.title == "" || req.body.description == "") {
        res.send({ status: "fail", msg: "Title and description must not be empty" });
    } else {
        connection.query("UPDATE BBY_16_timeline SET title = ?, description = ? WHERE postID = ?", [req.body.title, req.body.description, req.body.postID],
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                }
                res.send({ status: "success", msg: "Post updated" });
            });
    }
});

// Allows user to delete timeline photo when editing post by removing the image in the file system and remove its reference in the database
app.post("/deleteTimelinePhoto", function (req, res) {
    if (fs.existsSync("./public" + req.body.path)) {
        fs.unlink("./public" + req.body.path, err => {
            if (err) { console.log(err) }
            else {
                connection.query('SELECT pictures FROM BBY_16_timeline WHERE postID = ?', req.body.postID,
                    function (error, results, fields) {
                        let pictureArray = JSON.parse(results[0].pictures);
                        let index = pictureArray.indexOf(req.body.path);
                        if (index != -1) {
                            pictureArray.splice(index, 1);
                        }
                        connection.query('UPDATE BBY_16_timeline SET pictures = ? WHERE postID = ?', [JSON.stringify(pictureArray), req.body.postID],
                            function (error, results, fields) {
                                if (error) {
                                    console.log(error);
                                }
                                res.send({ status: "success", msg: "Photo deleted" });
                            });
                    });
            }

        });

    } else {
        res.send({ status: "fail", msg: "Photo could not be deleted" });
    }
});

// Allows user to add more timeline photos when editing post by adding the image in the file system and adding its reference in the database
app.post("/addTimelinePhoto", timelineUpload.array("photos"), function (req, res) {
    let pictures = [];
    for (let i = 0; i < req.files.length; i++) {
        pictures.push("/img/timelinePhotos/" + req.files[i].filename);
    }
    connection.query('SELECT pictures FROM BBY_16_timeline WHERE postID = ?', req.body.postID,
        function (error, results, fields) {

            // following breaks the server when results is null
            //let pictureArray = JSON.parse(results[0].pictures);
            //pictureArray.push(...pictures);
            let pictureArray;
            if (results.length > 0) {
                let oldpics = JSON.parse(results[0].pictures);
                pictureArray = oldpics.concat(pictures);
            } else {
                pictureArray = pictures;
            }

            connection.query('UPDATE BBY_16_timeline SET pictures = ? WHERE postID = ?', [JSON.stringify(pictureArray), req.body.postID],
                function (error, results, fields) {
                    if (error) {
                        console.log(error);
                    }
                    res.send({ status: "success", msg: "Photo(s) added" });
                });
        });
});

// Allows user to delete their timeline post, it should also delete the associated photos as well. 
app.post("/deleteTimelinePost", function (req, res) {
    connection.query('SELECT pictures FROM BBY_16_timeline where postID = ?', req.body.postID,
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            // else {
            //     res.send({ status: "success", msg: "Post Deleted"});
            // }
            let pictureArray = JSON.parse(results[0].pictures);
            for (let i = 0; i < pictureArray.length; i++) {
                let path = "./public" + pictureArray[i];
                if (fs.existsSync(path)) {
                    fs.unlink(path, err => {
                        if (err) { console.log(err); }
                        else {
                            console.log("photo deleted");
                        }
                    });
                }
            }
            connection.query('DELETE FROM BBY_16_timeline WHERE postID = ?', req.body.postID,
                function (error, results, fields) {
                    if (error) {
                        console.log(error);
                    }
                    res.send({ status: "success", msg: "Post delete successful" });
                });
        });
});

app.post("/getCoolzoneSuggestions", (req, res) => {

    connection.query(`SELECT EVENTID, CZNAME, LOCATION FROM BBY_16_COOLZONES WHERE CZNAME LIKE "%${req.body.query}%" OR LOCATION LIKE "%${req.body.query}%";`, (error, results, fields) => {
        if (error) {
            console.log(error);
        } else {
            res.send(JSON.stringify(results));
        }
    })
})


//Run server on port 8000
let port = 8000;
app.listen(process.env.PORT || port, function (err) {
    console.log("Server is running on port " + port);
    if (err)
        console.log(err);
})












