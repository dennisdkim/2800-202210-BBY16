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

app.use(session({
    secret: "abc123bby16project",
    name: "weCoolSessionID",
    resave: false,
    saveUninitialized: true
}));

//heroku db configuration. Use only for hosting. //
/*
const dbConfigHeroku = {
    host: "us-cdbr-east-05.cleardb.net",
    user: "b3823a53995411",
    password: "762e1d0a",
    database:"heroku_c99a07a4f72e738"
}

//let connection = mysql.createPool(dbConfigHeroku);
*/

//local connection configuration object. //
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "COMP2800"
});

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
app.post("/tryInsert", function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    // Checking for email or display name in existing accounts
    connection.query('SELECT * FROM BBY_16_user WHERE email = ? OR displayName = ?', [req.body.email, req.body.displayName],
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            // If account with email or display name exists, then do not create account and send message
            if (results.length > 0) {
                if (results[0].email == req.body.email) {
                    res.send({
                        status: "emailExists",
                        msg: "Email is in use"
                    });
                } else {
                    res.send({
                        status: "displayExists",
                        msg: "Display name is in use"
                    });
                }
            }
            // If account with email does not exist, create new account with email
            else {
                connection.query('INSERT INTO BBY_16_user(fname, lname, email, displayName, password) VALUES (?, ?, ?, ?, ?)',
                    [req.body.fname, req.body.lname, req.body.email, req.body.displayName, req.body.password],
                    function (error, results, fields) {
                        if (error) {
                            console.log(error);
                        }
                        res.send({
                            status: "success",
                            msg: "Account created."
                        });
                    });
            }
        });
});

//inputs into the coolzone database table//
app.post("/tryCoolzone", function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    // Checking for coolzone exists
    connection.query('INSERT INTO BBY_16_coolzones(hostid, czname, location, startdate, enddate, description, aircon, freedrinks, waterpark, pool, outdoors, wifi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [req.session.userID, req.body.coolzoneName, req.body.location, req.body.dateTag, req.body.enddateTag, req.body.description, req.body.acTag, req.body.fdTag, req.body.wpTag, req.body.poolTag, req.body.outdoorTag, req.body.wifiTag],
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
        "displayName": req.session.displayName,
        "email": req.session.email,
        "name": req.session.fname + " " + req.session.lname
    };
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(components));
});

//returns the first and last name, email, and display name to the page//
app.get("/getGreetingName", function (req, res) {
    const greetingName = {
        "displayName": req.session.displayName,
        "email": req.session.email,
        "name": req.session.fname + " " + req.session.lname
    };
    res.send(JSON.stringify(greetingName));
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
    for(let i=0; i < req.files.length; i++) {
        pictures.push("/img/timelinePhotos/" + req.files[i].filename);
    }
    connection.query('INSERT INTO BBY_16_timeline (userID, postTime, title, description, coolzoneID, pictures) VALUES (?, ?, ?, ?, ?, ?);',
        [req.session.userID, curDateTime, req.body.title, req.body.description, coolzoneID, JSON.stringify(pictures)],
        function (error, result, fields) {
            if (error) {                
                console.log(error);
            }
            res.send({status: "success", msg: "Post submitted"});
        });
});




app.post("/getTimelinePosts", function (req, res) {
    let timelineData = [];
    connection.query('SELECT BBY_16_user.displayName, BBY_16_timeline.userID, BBY_16_timeline.postTime, BBY_16_timeline.title, BBY_16_timeline.coolzoneID FROM BBY_16_timeline INNER JOIN BBY_16_timeline.userID = BBY_16_user.userID',
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
            };
            console.log(timelineData[i]);
        }
        console.log(timelineData);
        res.send(JSON.stringify(timelineData));
    });

});


app.post("/getCoolzoneSuggestions", (req, res) => {
    console.log("route is activated");
    console.log(req.body.query);
    connection.query(`SELECT EVENTID, CZNAME, LOCATION FROM BBY_16_COOLZONES WHERE CZNAME LIKE "%${req.body.query}%" OR LOCATION LIKE "%${req.body.query}%";`, (error, results, fields) => {
        console.log(results);
        if(error) {
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












