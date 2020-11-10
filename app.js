require("dotenv").config();
const express = require("express");
const app = express();
// const morgan = require('morgan');
const path = require("path");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const session = require("express-session");
const setupPassport = require('./passport/passport')
const router = require('./router')(express);


//session
app.use(session({
    secret: 'superDifficultAndSecret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))


//set up middleware
// app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//initialise passport
setupPassport(app);

//define port
const PORT = process.env.PORT || 3000;

//serve view folders
app.use(express.static("assets"));
app.use(express.static(__dirname));

//Middleware - set up views
app.set("view engine", "ejs");

//Middleware - set up flash
app.use(flash());

//router
app.use('/', router);

//port
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}.`)
})
