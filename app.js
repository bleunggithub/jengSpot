require("dotenv").config();
const express = require("express");
const app = express();

const path = require("path");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const session = require("express-session");
const setupPassport = require('./passport/passport')

const router = require('./routers/router')(express);
const routerDashboard = require("./routers/routerDashboard")(express);
const routerSettings = require("./routers/routerSettings")(express);
const routerPosts = require("./routers/routerPosts")(express);
const routerAuth = require("./routers/routerAuth")(express);


//session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))


//set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//initialise passport
setupPassport(app);

//define port
const PORT = process.env.PORT || 3000;

//db
const { development } = require('./knexfile');
const knex = require("knex")(development);

//serve view folders
app.use(express.static("assets"));
app.use(express.static(__dirname));

//Middleware - set up views
app.set("view engine", "ejs");

//Middleware - set up flash
app.use(flash());

//router
app.use('/', router);
app.use('/dashboard', routerDashboard)
app.use('/settings', routerSettings)
app.use('/posts', routerPosts)
app.use('/auth', routerAuth)

//port
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}.`)
})
