const passport = require('passport');
const bcrypt = require("bcrypt");
const flash = require("express-flash")
const knex = require("knex")({
  client: "postgresql",
  connection: {
    database: "travelapp",
    user: "postgres",
    password: "postgres",
  },
});



module.exports = (express) => {
    const router = express.Router();

    //for index page, explore page (if logged in, redirect to dashboard)
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect('/dashboard');
        }
        next();
    }

    // for dashboard, rewards, settings, saved (if not logged in, redirect to explore)
    function isNotLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/explore');
    }


    //landing page
    router.get('/', (req, res) => {
        res.render("index")
    });
    
    //explore page
    router.get('/explore', isLoggedIn, (req, res) => {
        res.render("explore")  //! create explore page
    })
    
    //dashboard (logged in)
    router.get('/dashboard', isNotLoggedIn, (req, res) => {
        res.render('dashboard'); //! think about what to pull from the database
    });

    //setting page
    router.get('/settings', isNotLoggedIn, (req, res) => {
        res.render("settings") //! 1)create settings page, 2) think about what items we need to pull from the database
    })

    //rewards page 
    router.get('/rewards', isNotLoggedIn, (req, res) => {
        res.render("rewards") //! 1)create rewards page, 2) think about what items we need to pull from the database
    })

    //favourite/saved post page
    router.get('/posts', isNotLoggedIn, (req, res) => {
        res.render("posts") //! 1)create saved page, 2) think about what items we need to pull from the database, 3)this also includes user's own posts
    })
    
    //create individual post page for details
    router.get('/posts/:postId', isNotLoggedIn, (req, res) => {
        const requestedPost = req.params.postId

    })

    //error page
    router.get('/error', (req, res) => {
        res.render("error"); //! create error page
    });


    //* post reqs
    //register
    router.post('/register', async (req, res) => {
        let { username, email, password, confirmPassword } = req.body;

        console.log({ username, email, password, confirmPassword });

        let errors = [];

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
            try {
                let users = await knex("users").where({ email: email }).orWhere({ username: username });
                if (users.length > 0) {
                    errors.push({ message: "Email already registered." })
                    res.render("index", { errors })
                } else {
                    let hashedPassword = await bcrypt.hash(password, 10);
                    console.log(hashedPassword);
                    const newUser = {
                        username: username,
                        email: email,
                        password: hashedPassword,
                        number_of_posts: 0
                    }
                    let userId = await knex("users").insert(newUser).returning("id");
                    newUser.id = userId[0];
                    res.redirect('/dashboard')
                }
            } catch (err) {
                console.log(err)
            }
        }
    });

    //login 
    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/dashboard',
        failureRedirect: '/',
        failureFlash: true
    }));

    //write post
    router.post('/writePost', isNotLoggedIn, async (req, res) => {
        const post = {
            user_id: req.user.id,
            postTitle: req.body.postTitle,
            postContent: req.body.postContent,
            postAddress: req.body.postAddress,
            postDo:req.body.postDo,
            postGo:req.body.postGo,
            postLat: req.body.postLat,
            postLng: req.body.postLng,
            postPhoto: req.body.postPhoto
        }
        console.log(req.body)

    })


    //third party OAuth 
    //Google
    router.get('/auth/google', passport.authenticate('google',
        { scope: ['profile'] }
    ));
    
    router.get('/auth/google/dashboard', 
    passport.authenticate('google', { failureRedirect: '/' }),(req, res)=> {
    // Successful authentication, redirect dashboard
    res.redirect('/dashboard');
    });
    
    //Facebook 
    router.get('/auth/fb', passport.authenticate('facebook'));
    
    router.get('/auth/fb/dashboard', 
    passport.authenticate('facebook', { failureRedirect: '/' }),(req, res)=> {
    // Successful authentication, redirect dashboard
    res.redirect('/dashboard');
    });


    //log out
    //log out route
    router.get("/logout", (req, res) => {
        req.logOut();
        req.flash('success_msg', "You have successfully logged out."); 
        res.redirect("/")
    })
   

    return router;
};