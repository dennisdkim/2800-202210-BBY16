
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

app.get("/tryLogin", function (req, res){
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


app.post("/tryInsert", function (req, res){
    res.setHeader('Content-Type', 'application/json');

    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'db'
      });
      connection.connect();
      connection.query('INSERT INTO user(fname, lname, email, displayName, password) VALUES (?, ?, ?, ?, ?)',
            [req.body.fname, req.body.lname, req.body.email, req.body.displayName, req.body.password],
            function (error, results, fields) {
        if (error) {
            console.log(error);
        }
        console.log('Rows returned are: ', results);
        res.send({ status: "success", msg: "Record added." });
      });
    //   console.log("finished tryLogin");
      connection.end();
});

app.get("/profile", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/profile.html", "utf8");
        console.log("Logged in by: " + req.session.email);
        res.send(profile);
    } else {
        res.redirect("/");
    }
});

app.get("/signUp", function (req, res) {
        let doc = fs.readFileSync("./app/html/signup.html", "utf8");
        res.send(doc);
});

app.get("/home", function (req, res) {
    if (req.session.loggedIn) {
        res.send(fs.readFileSync("./app/html/home.html", "utf8"));
    } else {
        res.redirect("/");
    }
});

app.use(express.urlencoded({ extended: true }));

app.post("/login", function (req, res) {

    console.log("What was sent: ", req.body.email, req.body.password);

    let sampleEmail = "lester@test.ca";
    let samplePw = "12345";

    if(req.body.email == sampleEmail && req.body.password == samplePw) {
        req.session.loggedIn = true;
        req.session.email = req.body.email;
        res.send({ status: "success", msg: "Logged in. "});
    } else {
        res.send({ status: "fail", msg: "Account not found. "})
    }
    /*
    const mysql = require('mysql2');
    const connection = mysql.createConnection(
        {
            host: "localhost",
            user: "root",
            password: "",
            database: "assignment6"
        }
    );
    connection.query(`SELECT * FROM a00805677_user WHERE email = "${req.body.email}" AND password = "${req.body.password}";`, function (error, results, fields) {
        if (results.length == 1) {
            console.log(results);
            req.session.loggedIn = true;
            req.session.email = req.body.email;
            req.session.userid = results[0].userid;
            req.session.name = results[0].username;
            res.send({ status: "success", msg: "Logged in." });

        } else {
            res.send({ status: "fail", msg: "User account not found." });
        }
    })
    */
})


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


let port = 8000;
app.listen(port, console.log("Server is running!"));
