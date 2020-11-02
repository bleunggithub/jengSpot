require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

const knex = require('./data/db');

//Middleware - set up bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//define port
const PORT = process.env.PORT || 3000;

//serve view folders
app.use(express.static("assets"));
app.use(express.static(__dirname));

//Middleware - set up handlebars views
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//render pages
app.get('/', (req, res) => {
    res.render("index")
})

app.get('/dashboard', (req, res) => {
    res.render("dashboard")
})

// set up knex router
app.get('/user', function(req, res){
    knex.raw('select * from user').then(function(user){
        res.send(user);
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}.`)
})