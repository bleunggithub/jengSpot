require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

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

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}.`)
})