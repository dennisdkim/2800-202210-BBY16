
//Requires
const express = require("express");
const session = require("express-session");
const app = express();
app.use(express.json());
const fs = require("fs");

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

app.get("/profile", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/profile.html", "utf8");
        console.log("Logged in by: " + req.session.name);
        res.send(profile);
    } else {
        res.redirect("/");
    }
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
