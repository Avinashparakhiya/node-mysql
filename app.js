const express = require("express")
const path = require('path')
var session = require('express-session')
var bodyParser = require('body-parser')
const dotenv = require('dotenv')

dotenv.config({ path: './.env' })
const app = express();
const publicDirectory = path.join(__dirname, './public')

app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(express.static(publicDirectory))
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(session({ secret: 'mySecret', resave: false, saveUninitialized: false }));
app.use('/', require('./routes/pages'))
app.use('/auth', require('./routes/auth'))

app.listen(3000, () => {
    console.log("Server is started in Port 3000");
})