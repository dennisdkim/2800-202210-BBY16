
'use strict';

//Requires
const express = require("express");
const session = require("express-session");
const app = express();
app.use(express.json());
const fs = require("fs");
const mysql = require("mysql2");

//Mapping system paths to app's virtual paths
app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/img", express.static("./public/img"));
app.use("/html", express.static("./app/html"));

app.use(session(
    {
        secret: "abc123bby16project",
        name: "weCoolSessionID",
        resave: false,
        saveUninitialized: true
    })
);

// used for importing database into HEROKU deployment
module.exports = {
  HOST: "us-cdbr-east-05.cleardb.net",
  USER: "b224612bae8615",
  PASSWORD: "09995ada",
  DB: "heroku_0195399e74303c0"
};

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
app.get("/tryLogin", function (req, res){
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

    // let connection = mysql.createConnection({
    //     host: 'localhost',
    //     user: 'root',
    //     password: '',
    //     database: 'COMP2800'
    // });
    let connection = mysql.createConnection({
        host: 'us-cdbr-east-05.cleardb.net',
        user: 'b224612bae8615',
        password: '09995ada',
        database: 'heroku_0195399e74303c0'
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
                    res.send({status: "emailExists", msg: "Email is in use"});
                } else {
                    res.send({status: "displayExists", msg: "Display name is in use"});
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
                    res.send({ status: "success", msg: "Account created."});
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
    } else if (req.session.loggedIn && req.session.admin > 0){
        res.send(fs.readFileSync("./app/html/admin.html", "utf8"))
    } else {
        res.redirect("/");
    }
});

//user login verification//
app.use(express.urlencoded({ extended: true }));

//Verifies user credentials exist within db. 
//If credentials are correct, user is logged in.
app.post("/login", function (req, res) {
    const connection = mysql.createConnection(
        {
            host: "localhost",
            user: "root",
            password: "",
            database: "COMP2800"
        }
    );

    //select statement for all tuples matching both provided email AND password. Should return 0-1 results.
    connection.query(`SELECT * FROM BBY_16_user WHERE email = "${req.body.email}" AND password = "${req.body.password}";`, function (error, results, fields) {
        if (results.length == 1) {
            req.session.loggedIn = true;
            req.session.displayName = results[0].displayName;
            req.session.email = results[0].email;
            req.session.name = results[0].fname + " " + results[0].lname;
            req.session.admin = results[0].admin;
            res.send({
                status: "success",
                msg: "Logged in.",
                admin: req.session.admin
            });
        } else {
            res.send({ status: "fail", msg: "User account not found." });
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
        "name": req.session.name
    };
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(components));
});

//returns the first and last name, email, and display name to the page//
app.get("/getGreetingName", function (req, res) {
    const greetingName = {
        "displayName": req.session.displayName,
        "email": req.session.email,
        "name": req.session.name
    };
    res.send(JSON.stringify(greetingName));
});

//returns the info for all users to be sent to admin//
app.get("/getUserTable", function (req, res) {

    //should have a check to make sure user is admin before executing the next code//

    const connection = mysql.createConnection(
        {
            host: "localhost",
            user: "root",
            password: "",
            database: "COMP2800"
        }
    );
    

    connection.query(`SELECT * FROM BBY_16_user;`, function (error, results, fields) {

        if (results.length > 0) {
            res.send(JSON.stringify(results));
        } else {
            res.send({ status: "fail", msg: "User account not found." });
        }
    })

});

let port = 8000;
app.listen(port, console.log("Server is running!"));
