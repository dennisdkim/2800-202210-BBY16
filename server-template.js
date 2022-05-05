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

    const createDBAndTables = `CREATE DATABASE IF NOT EXISTS db;
        use db;
        CREATE TABLE IF NOT EXISTS user (
        userID int NOT NULL AUTO_INCREMENT,
        fname VARCHAR(30) NOT NULL,
        lname VARCHAR(30) NOT NULL,
        email VARCHAR(30) NOT NULL,
        displayName VARCHAR(30) NOT NULL,
        password VARCHAR(30) NOT NULL,
        admin BIT NOT NULL DEFAULT 0,
        PRIMARY KEY (userID));`;
    connection.connect();
    connection.query(createDBAndTables, function (error, results, fields) {
        if (error) {
            console.log(error);
        }
        console.log(results);

    });
    connection.end();
    console.log("try login passed");
});

//inputs into the user database table//
app.post("/tryInsert", function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'db'
    });
    connection.connect();
    // Checking for email or display name in existing accounts
    connection.query('SELECT * FROM user WHERE email = ? OR displayName = ?', [req.body.email, req.body.displayName],
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            // If account with email or display name exists, then do not create account and send message
            if (results.length > 0) {
                console.log("Account exists already.");
                if (results[0].email == req.body.email) {
                    res.send({status: "exists", msg: "Email is in use"});
                } else {
                    res.send({status: "exists", msg: "Display name is in use"});
                }
                connection.end();
            }
            // If account with email does not exist, create new account with email
            else {
                connection.query('INSERT INTO user(fname, lname, email, displayName, password) VALUES (?, ?, ?, ?, ?)',
                [req.body.fname, req.body.lname, req.body.email, req.body.displayName, req.body.password],
                function (error, results, fields) {
                    if (error) {
                        console.log(error);
                    }
                    console.log('Rows returned are: ', results);
                    res.send({ status: "success", msg: "Record added."});
                });
                connection.end();
            }
        });
});

//loads the profile page//
app.get("/profile", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/profile.html", "utf8");
        console.log("Logged in by: " + req.session.email);
        res.send(profile);
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
    if (req.session.loggedIn) {
        res.send(fs.readFileSync("./app/html/home.html", "utf8"));
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

    console.log("What was sent: ", req.body.email, req.body.password);
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "db"
    });

    //select statement for all tuples matching both provided email AND password. Should return 0-1 results.
    connection.query(`SELECT * FROM user WHERE email = "${req.body.email}" AND password = "${req.body.password}";`, function (error, results, fields) {
        if (results.length == 1) {
            console.log(results);
            // console.log(fields);
            req.session.loggedIn = true;
            req.session.isAdmin = results.admin;
            req.session.username = results.displayName;
            console.log("hello " + req.session.username);
            res.send({
                status: "success",
                msg: "Logged in."
            });
            console.log("login success");

        } else {
            res.send({
                status: "fail",
                msg: "Account not found"
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
                console.log("logged out of session.");
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
    };
    res.send(JSON.stringify(components));
});


let port = 8000;
app.listen(port, console.log("Server is running!"));