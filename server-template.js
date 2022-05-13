'use strict';

//Requires
const express = require("express");
const session = require("express-session");
const app = express();
app.use(express.json());
const fs = require("fs");
const mysql = require("mysql2");
const mysqlprom = require("mysql2/promise");
const multer = require("multer");

//Mapping system paths to app's virtual paths
app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/img", express.static("./public/img"));
app.use("/html", express.static("./app/html"));

//Storage for user uploaded files
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

app.use(session({
    secret: "abc123bby16project",
    name: "weCoolSessionID",
    resave: false,
    saveUninitialized: true
}));

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

//creates a user table for database//
app.get("/tryLogin", function (req, res) {
    // Let's build the DB if it doesn't exist
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        multipleStatements: true
    });

    const createDBAndTables = `CREATE DATABASE IF NOT EXISTS COMP2800;
        use COMP2800;
        CREATE TABLE IF NOT EXISTS BBY_16_user (
        userID int NOT NULL AUTO_INCREMENT,
        fname VARCHAR(30) NOT NULL,
        lname VARCHAR(30) NOT NULL,
        email VARCHAR(30) NOT NULL UNIQUE,
        displayName VARCHAR(30) NOT NULL UNIQUE,
        password VARCHAR(30) NOT NULL,
        admin TINYINT NOT NULL DEFAULT 0,
        PRIMARY KEY (userID));`;
    connection.connect();
    connection.query(createDBAndTables, function (error, results, fields) {
        if (error) {
            console.log(error);
        }
    });
    connection.end();
});

//inputs into the user database table//
app.post("/tryInsert", function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'COMP2800'
    });
    connection.connect();
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
                connection.end();
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
                connection.end();
            }
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

//loads the admin page//
app.get("/admin", function (req, res) {
    if (req.session.loggedIn) {
        let admin = fs.readFileSync("./app/html/admin.html", "utf8");
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
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "COMP2800"
    });

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
    const navbar = fs.readFileSync("./app/html/components/navbar.html", "utf8");
    const footer = fs.readFileSync("./app/html/components/footer.html", "utf8");
    const components = {
        "navbar": navbar,
        "footer": footer,
        "displayName": req.session.displayName,
        "email": req.session.email,
        "name": req.session.fname + " " + req.session.lname
    };
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
        displayPic = "/img/userAvatars/default.png"
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

//returns the info for all users to be sent to admin//
app.get("/getUserTable", function (req, res) {

    //should have a check to make sure user is admin before executing the next code//

    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "COMP2800"
    });


    connection.query(`SELECT * FROM BBY_16_user;`, function (error, results, fields) {

        if (results.length > 0) {
            res.send(JSON.stringify(results));
        } else {
            res.send({
                status: "fail",
                msg: "User account not found."
            });
        }
    })

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
        let connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'COMP2800'
        });
        connection.connect();
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
        connection.end();
    }
});

// Updates the user info and checks if display name and email is already in use, before setting values 
app.post("/editUserData", function(req, res) {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "COMP2800"
    });
    if (req.body.fname == "" || req.body.lname == "" || req.body.displayName == "" || req.body.email == "" || req.body.password == "") {
        res.send({status: "fail", msg: "Fields must not be empty!"});
    } else {
        connection.query('SELECT * FROM BBY_16_user WHERE userID <> ? AND (displayName = ? OR email = ?);', [req.body.userID, req.body.displayName, req.body.email],
        function(error, results, fields) {
            if (error) {
                console.log(error); 
            }
            let users = results;
            if(users.length > 0) {
                let displayNameTaken = false;
                let emailTaken = false;
                for(let i=0; i < users.length; i++) {
                    if(users[i].displayName == req.body.displayName) {
                        displayNameTaken = true;
                    }
                    if(users[i].email == req.body.email) {
                        emailTaken = true;
                    }
                }
                if (displayNameTaken && emailTaken) {
                    connection.end();
                    res.send({status:"fail", msg: "The display name and email is taken"});
                } else {
                    if (displayNameTaken) {
                        connection.end();
                        res.send({status:"fail", msg: "The display name is taken"});
                    }
                    if (emailTaken) {
                        connection.end();
                        res.send({status:"fail", msg: "The email is taken"});
                    }
                }
            } else {
                updateChanges(req,res,connection);
            }
        });
    }
});

//Update all fields with the valid inputs after checks have been done
function updateChanges(req, res, connection) {

    connection.query('UPDATE BBY_16_user SET fname = ?, lname = ?, displayName = ?, email = ?, password = ? WHERE userID = ?;', [req.body.fname, req.body.lname, req.body.displayName, req.body.email, req.body.password ,req.body.userID],
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
                        connection.end();
                        res.send({status: "success", msg: "Changes saved"});
                    });
            } 
            else {
                connection.end();
                res.send({status: "success", msg: "Changes saved"});
            }
        });
}

// Uploads avatar image to file system
app.post("/upload-avatar", avatarUpload.single("avatar"), function (req, res) {
    req.file.filename = req.file.originalname;
});

//Run server on port 8000
let port = 8000;
app.listen(port, console.log("Server is running!"));