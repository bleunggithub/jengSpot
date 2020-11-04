require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const knex = require("./data/db");
const bcrypt = require("bcrypt");
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");

//initialise passport
const initializePassport = require("./passportConfig");
initializePassport(passport);

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

//Middleware - set up flash
app.use(flash());

//Middleware - set up session, passport
app.use(session({
    secret: 'secret.',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize())
app.use(passport.session())

//render pages
//landing page
app.get('/', (req, res) => {
    res.render("index")
})

//explore page
app.get('/explore', (req, res) => {
    res.render("explore")  //! create explore page
})

//dashboard page
app.get('/users/dashboard',checkNotAuthenticated, (req, res) => {
    res.render("dashboard"//,{users: req.user.username} //! think about what items we need to pull from the database
    )
})

//setting page
app.get('/users/settings', checkNotAuthenticated, (req, res) => {
    res.render("settings") //! 1)create settings page, 2) think about what items we need to pull from the database
})

//rewards page
app.get('/users/rewards', checkNotAuthenticated, (req, res) => {
    res.render("rewards") //! 1)create rewards page, 2) think about what items we need to pull from the database
})

//favourite/saved post page
app.get('/users/saved', checkNotAuthenticated, (req, res) => {
    res.render("saved") //! 1)create saved page, 2) think about what items we need to pull from the database
})


//register route
app.post("/users/register", async (req, res) => {
    let { username, email, password, confirmPassword } = req.body;

    console.log({ username, email, password, confirmPassword });

    let errors = [];
    //* form validation
    if (!username || !email || !password || !confirmPassword) {
        errors.push({ message: "Please enter all fields." })
    }

    if (password.length < 6) {
        errors.push({ message: "Password should be at least 6 characters." })
    }

    if (password != confirmPassword) {
        errors.push({ message: "Passwords do not match." })
    }
    
    if (errors.length > 0) {
        res.render('index', { errors })
        console.log(errors)
    } else {
        //* form validation passed
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log("hashed password " + hashedPassword);

        knex('users').where({
            email: `${email}`
        }).orWhere({
            username: `${username}`
        }), (err, results) => {
            if (err) {
                throw err
            }
            console.log(results.rows)

            if (results.rows.length > 0) {
                errors.push({ message: "Username/Email already registered." })
                res.render("index", { errors })
            } else {
                knex.raw(`INSERT INTO users (username,email,password) 
                    VALUES ($1,$2,$3)
                    RETURNING id, password`, [username, email, hashedPassword], (err, results) => {
                    if (err) {
                        throw err
                    }
                    console.log(results.rows);
                    req.flash('success_msg', "You are now registered. Please log in.");
                    res.redirect('/index')
                })
            }
        }
        )
    }
}); 

//log in route
app.post("/users/login", passport.authenticate('local', {
    successRedirect: "/users/dashboard",
    failureRedirect: "/",
    failureFlash: true,
}));

//log out route
app.get("/users/logout", (req, res) => {
    req.logOut();
    // req.flash('success_msg', "You have logged out"); //! think about where we should display this message
    res.redirect("/")
})


//sessions - helper functions
//for index page, explore page (if logged in, redirect to dashboard)
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/dashboard')
    } next();
}
//for dashboard, rewards, settings, favourite (if not logged in, redirect to explore)
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/explore'); 
}

//port
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}.`)
})
