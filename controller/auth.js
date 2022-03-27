const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var session = require("express-session");
var bodyParser = require("body-parser");
const { response } = require("express");
const router = require("../routes/pages");
const { name } = require("ejs");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});
db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Mysql DB Connected.....");
    }
});

exports.registration = (req, res) => {
    console.log(req.body);
    const { name, email, password, gender } = req.body;

    db.query(
        "SELECT email from users WHERE email= ?", [email],
        async(error, results) => {
            if (error) {
                console.log(error);
            }
            if (results.length > 0) {
                return res.render("registration", {
                    message: "That Email Is already Use",
                });
            }

            db.query(
                "INSERT INTO users SET ?", { name: name, email: email, gender: gender, password: password },
                (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        return res.render("registration", {
                            message: "User Registered",
                        });
                    }
                }
            );
        }
    );
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    var sql = "SELECT * FROM users WHERE email =? AND password =?";
    db.query(sql, [email, password], function(err, data, fields) {
        {
            if (err) throw err;
            if (data.length > 0) {
                req.session.loggedinUser = true;
                req.session.emailAddress = email;
                req.session.password = password;
                res.redirect("/dashboard");
                var sql1 = "UPDATE users set status=? WHERE email = ?"
                db.query(sql1, ['active', email], (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(results);
                    }
                });
            } else {
                res.render("loginPage", {
                    message: "Your Email Address or password is wrong",
                });
            }
        }
    });
};

exports.profile = async(req, res) => {
    var email = req.session.emailAddress;
    var sql = "SELECT * FROM users WHERE email=?";
    db.query(sql, [email], function(err, data, fields) {
        let jsonData = JSON.parse(JSON.stringify(data));
        let details = {
            name: jsonData[0].name,
            email: jsonData[0].email,
            password: jsonData[0].password,
        };
        if (err) throw err;
        if (data.length > 0) {
            res.render("profile", { details });
        } else {
            res.render("loginPage", {
                message: "Your Email Address or password is wrong",
            });
        }
    });
};

exports.update = (req, res) => {
    const { name, email, password } = req.body;
    var sql = "UPDATE users set name=?, password=? WHERE email=?";
    db.query(sql, [name, password, email],
        (error, results) => {
            if (error) {
                console.log(error);
            } else {
                res.render("profile", {
                    message: "User Updated",
                });
            }
        }
    );

}

exports.deleteProfile = (req, res) => {
    var email = req.session.emailAddress;
    var sql = "DELETE FROM users WHERE email=?";
    db.query(sql, [email],
        (error, results) => {
            if (error) {
                console.log(error);
            } else {
                res.render("index", {
                    message: "User Deleted",
                });
            }
        }
    );
}

exports.logout = (req, res) => {
    var email = req.session.emailAddress;
    req.session.destroy();
    res.redirect('/')
    var sql1 = "UPDATE users set status=? WHERE email = ?"
    db.query(sql1, ['deactive', email], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            console.log(results);
        }
    });
}