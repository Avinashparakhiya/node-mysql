const express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/registration", (req, res) => {
    res.render("registration");
});

router.get("/login", (req, res) => {
    res.render("loginPage");
});

router.get("/editProfile", (req, res) => {
    res.render("editProfile");
});

router.get("/deleteProfile", (req, res) => {
    res.render("deleteProfile");
});

router.get("/dashboard", (req, res) => {
    if (req.session.loggedinUser) {
        res.render('dashboard', { email: req.session.emailAddress })
    } else {
        res.redirect('/login');
    }
});

module.exports = router;