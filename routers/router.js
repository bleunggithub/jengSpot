const passport = require('passport');
const bcrypt = require("bcrypt");
const flash = require("express-flash")
const { development } = require('../knexfile');
const knex = require("knex")(development);

const {isLoggedIn, isNotLoggedIn} = require('./checkLogIn')

module.exports = (express) => {
    const router = express.Router();

    //landing page
    router.get('/', (req, res) => {
        res.render("index")
    });
    
    //explore page
    router.get('/explore', isLoggedIn, async (req, res) => {
        
        try {
            let postData = await knex('posts').select(
                'postTitle','postContent','postAddress',
                'received_fav','received_comments','users_id',
                'users_username','users_userPhoto','postLat',
                'postLng','postPhoto','postDate'
            ).limit(5).orderBy('id', 'desc')

            res.render("explore", { postData }) 
        } catch (err) {
            console.trace(err)
            res.redirect('/error')
        }
        
    })
    



    //rewards page 
    router.get('/rewards', isNotLoggedIn, (req, res) => {
        res.render("rewards") //! 1)create rewards page, 2) think about what items we need to pull from the database
    })




    
    //create individual post page for details
    router.get('/post/:postId', isNotLoggedIn, async(req, res) => { 
        const id = req.params.postId

        try {
            let postToShowData = await knex('posts').where({id}).select(
                'id','postTitle','postContent','postAddress','received_fav',
                'received_comments','users_id','users_username','users_userPhoto',
                'postLat','postLng','postPhoto','postDate'
            )

            let userToCommentData = await knex("users").where({id:req.user.id}).select(
                'username','userPhoto'
            )

            let commentsData = await knex('comments').where({ posts_id: postToShowData[0].id }).select(
                'id','users_id','users_userPhoto','users_username','commentContent','posts_id'
            )

            res.render('post',{postData: postToShowData[0], userData:userToCommentData[0], commentsData}); 
            
        } catch (err) {
            console.trace(err);
            res.redirect('/error')
        }
    })

    //writing a comment
    router.post("/postComment/:postId", isNotLoggedIn, async (req, res)=>{
        const postId = req.params.postId;
        // console.trace(postId)
        try {
            let posterData = await knex("users").select('username', 'userPhoto')
                .where({ id: req.user.id })
                .returning(['username', 'userPhoto'])
            
            console.trace(posterData)
           
            let newComment = {
                users_id: req.user.id,
                users_userPhoto: posterData[0].userPhoto,
                users_username: posterData[0].username,
                commentContent: req.body.commentContent,
                posts_id: postId
            }

            let commentData = await knex('comments').insert(newComment).returning("posts_id");
            
            await knex("posts").where('id',commentData[0]).increment('received_comments',1)

            res.redirect(`/post/${commentData}`)

        } catch (err) {
            console.trace(err);
            res.redirect('/error')
        }
    })

    //error page
    router.get('/error', (req, res) => {
        res.render("error"); 
    });


    //* post reqs
    //register
    router.post('/register', async (req, res) => {
        let { username, email, password, confirmPassword } = req.body;

        // console.log({ username, email, password, confirmPassword });

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
                let users = await knex("users").where({ email }).orWhere({ username });
                if (users.length > 0) {
                    errors.push({ message: "Email already registered." })
                    res.render("index", { errors })
                } else {
                    let hashedPassword = await bcrypt.hash(password, 10);
                    console.log(hashedPassword);
                    const newUser = {
                        username,
                        password: hashedPassword,
                        email,
                        userPhoto: "../assets/png/049-worldwide.png", 
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

        const { postTitle, postContent, postAddress, postDo, postGo, postLat, postLng, postPhoto } = req.body;

        //get date
        let d = new Date();
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let postDate = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;

        try {
            let posterData = await knex("users").select('username', 'userPhoto')
                .where({ id: req.user.id }).returning(['username', 'userPhoto'])
            
            console.trace(posterData)
            
            const post = {
                postTitle,
                postContent,
                postAddress,
                postDo,
                postGo,
                received_fav: 0,
                received_comments: 0,
                users_id: req.user.id,
                users_username: posterData[0].username,
                users_userPhoto: posterData[0].userPhoto,
                postLat,
                postLng,
                postPhoto,
                postDate
            }
            
            await knex("posts").insert(post);
            await knex("users").where('id', post.users_id).increment('points_received', 10)
            
            res.redirect('/dashboard')
        } catch (err) {
            console.trace(err);
            res.redirect('/error')
        }       
    })

    //log out
    //log out route
    router.get("/logout", (req, res) => {
        req.logOut();
        req.flash('success_msg', "You have successfully logged out."); 
        res.redirect("/")
    })
   

    return router;
};