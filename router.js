const passport = require('passport');

module.exports = (express) => {
    const router = express.Router();

    //for index page, explore page (if logged in, redirect to dashboard)
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/'); 
    }

    // for dashboard, rewards, settings, favourite (if not logged in, redirect to explore)
    // function isNotLoggedIn(req, res, next) {
    //     if (req.isAuthenticated()) {
    //         return next();
    //     }
    //     res.redirect('/explore'); 
    // }

    //landing page
    router.get('/', (req, res) => {
            res.render("index")
    });
    
    // //explore page
    // router.get('/explore', isLoggedIn, (req, res) => {
    //     res.render("explore")  //! create explore page
    // })
    
    // //dashboard (logged in)
    // router.get('/dashboard',  isNotLoggedIn, (req, res) => {
    //     res.render('dashboard');
    // });

    // //setting page
    // router.get('/settings', isNotLoggedIn, (req, res) => {
    //     res.render("settings") //! 1)create settings page, 2) think about what items we need to pull from the database
    // })

    // //rewards page
    // router.get('/rewards', isNotLoggedIn, (req, res) => {
    //     res.render("rewards") //! 1)create rewards page, 2) think about what items we need to pull from the database
    // })

    // //favourite/saved post page
    // router.get('/saved', isNotLoggedIn, (req, res) => {
    //     res.render("saved") //! 1)create saved page, 2) think about what items we need to pull from the database
    // })

    // //error page
    // router.get('/error', (req, res) => {
    //     res.render("error"); //! create error page
    // });


    //dashboard (logged in) //!temp set up for testing
    router.get('/dashboard', (req, res) => {
        res.render('dashboard');
    });


    //* post reqs
    //register
    router.post('/register',passport.authenticate('local-signup', {
    successRedirect: '/dashboard',
    failureRedirect: '/error' //!temp
}));

    //login 
    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/dashboard',
        failureRedirect: '/',
    }));


    //log out
    //log out route
    router.get("/logout", (req, res) => {
        req.logOut();
        // req.flash('success_msg', "You have logged out"); //! think about where we should display this message
        res.redirect("/")
    })
   

    return router;
};