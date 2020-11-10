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
    router.get('/explore', isLoggedIn, async (req, res) => {

        try {
            let postData = await knex('posts').select({
            postTitle: 'posts.postTitle',
            postContent: 'posts.postContent',
            postAddress: 'posts.postAddress',
            received_fav: 'posts.received_fav',
            received_comments: 'posts.received_comments',
            users_id: 'posts.users_id',
            users_username: 'posts.users_username',
            users_userPhoto: 'posts.users_userPhoto',
            postLat: 'posts.postLat',
            postLng: 'posts.postLng',
            postPhoto: 'posts.postPhoto',
            postDate: 'posts.postDate'
            }).limit(10).orderBy('id', 'desc')

            res.render("explore", { postData: postData }) 
        } catch (err) {
            console.trace(err)
            res.redirect('error')
        }
        
    })
    
    //dashboard (logged in)
    router.get('/dashboard', isNotLoggedIn, async (req, res) => {

        try {
            let postData = await knex('posts').select({
            postId: 'posts.id',
            postTitle: 'posts.postTitle',
            postContent: 'posts.postContent',
            postAddress: 'posts.postAddress',
            received_fav: 'posts.received_fav',
            received_comments: 'posts.received_comments',
            users_id: 'posts.users_id',
            users_username: 'posts.users_username',
            users_userPhoto: 'posts.users_userPhoto',
            postLat: 'posts.postLat',
            postLng: 'posts.postLng',
            postPhoto: 'posts.postPhoto',
            postDate: 'posts.postDate'
            }).orderBy('id', 'desc')

            let userData = await knex("users").select({
                username: 'users.username',
                userPhoto: 'users.userPhoto',
                points_received: 'users.points_received'
            }).where({id:req.user.id})
            // console.trace(userData)

            res.render('dashboard',{postData: postData, userData:userData[0]}); 
        } catch(err) {
            console.trace(err)
            res.redirect('error')
        }


        
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
    router.get('/posts/:postId', isNotLoggedIn, (req, res) => { //!create individual page template
        const requestedPost = req.params.postId

    })

    //error page
    router.get('/error', (req, res) => {
        res.render("error"); 
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
                        password: hashedPassword,
                        email: email,
                        userPhoto: "../assets/png/049-worldwide.png", 
                        number_of_posts: 0,
                        points_received: 0,
                        points_redeemed: 0,
                        admin: false
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
        failureRedirect: '/error',
        failureFlash: true
    }));

    //write post
    router.post('/writePost', isNotLoggedIn, async (req, res) => {
        // console.log(req.body);
        //writing a new post into the database

        //get date
        let d = new Date();
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let postDate = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;

        try {
            let posterData = await knex("users").select({
                username: 'users.username',
                userPhoto: 'users.userPhoto',
            }).where({ id: req.user.id }).returning(['username', 'userPhoto'])
            console.trace(posterData)
            
            const post = {
            postTitle: req.body.postTitle,
            postContent: req.body.postContent,
            postAddress: req.body.postAddress,
            postDo:req.body.postDo,
            postGo: req.body.postGo,
            received_fav: 0,
            received_comments: 0,
            users_id: req.user.id,
            users_username: posterData[0].username,
            users_userPhoto: posterData[0].userPhoto,
            postLat: req.body.postLat,
            postLng: req.body.postLng,
            postPhoto: req.body.postPhoto,
            postDate: postDate
            }
            
            let newPostId = await knex("posts").insert(post).returning("id");
            await knex("users").where('id','=',post.users_id).increment('points_received',10)
            res.redirect('/dashboard')            
        } catch (err) {
            console.trace(err);
            res.redirect('/error')
        }       
    })

    //tap favourite
    router.post('/posts/fav/:postId', isNotLoggedIn,async(req, res)=> {
        //console.trace(req.params);
    
        try {
            //write into favposts table
            let favPost = {
                users_id: req.user.id,
                posts_id: req.params.postId 
            }
            let addFav = await knex("favposts").insert(favPost).returning('posts_id');
            console.trace(addFav)

            //write into posts table (+rcvd fav)
            let posterRcvdFav = await knex("posts").where('id', '=', addFav[0]).increment('received_fav', 1).returning('users_id');
            
            //from posts table, get post id (poster), write into users table, add 2 pts for receiving a like
            await knex("users").where('id', '=', posterRcvdFav[0]).increment('points_received', 2);
            res.end();

        } catch (err) {
            console.trace(err);
            res.redirect('/error')
        }
    })

    router.post('/posts/unfav/:postId', isNotLoggedIn, async (req, res) => {
        //console.trace(req.params);

        try {
            //write into favposts table
            let unFavPost = {
                users_id: req.user.id,
                posts_id: req.params.postId 
            }
            let removeFav = await knex("favposts").where('users_id', unFavPost.users_id).andWhere('posts_id', unFavPost.posts_id).returning('posts_id').del();

            //write into posts table
            let posterRmFav = await knex("posts").where('id', '=', removeFav[0]).decrement('received_fav', 1).returning('users_id');

            //from posts table, get post id (poster), write into users table, deduct 2 pts 
            await knex("users").where('id', '=', posterRmFav[0]).decrement('points_received', 2);
            res.end();

            
        } catch (err) {
            console.trace(err);
            res.redirect('/error')
        }

    })

    //third party OAuth 
    //Google
    router.get('/auth/google', passport.authenticate('google',
        { scope: ['profile'] }
    ));
    
    router.get('/auth/google/dashboard', 
    passport.authenticate('google', { failureRedirect: '/error' }),(req, res)=> {
    // Successful authentication, redirect dashboard
    res.redirect('/dashboard');
    });
    
    //Facebook 
    router.get('/auth/fb', passport.authenticate('facebook'));
    
    router.get('/auth/fb/dashboard', 
    passport.authenticate('facebook', { failureRedirect: '/error' }),(req, res)=> {
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