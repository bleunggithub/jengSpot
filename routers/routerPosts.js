const { development } = require('../knexfile');
const knex = require("knex")(development);

const {isNotLoggedIn} = require('./checkLogIn')

module.exports = (express) => {
    const router = express.Router();

    //favourite/saved post page
    router.get('/', isNotLoggedIn, async(req, res) => {
        const users_id = req.user.id;

        try {
            // own posts
            let ownPost = await knex('posts').where({ users_id }).select(
                'id','postTitle','postContent','postAddress','received_comments',
                'users_username','users_userPhoto','postPhoto','postDate'
            ).orderBy('id', 'desc')
            // console.trace(ownPostData)

            //favourited posts
            let favPostId = await knex('favposts').where({ users_id })
                .select('posts_id')
                .returning(["posts_id"])
            // console.trace(favPostId)

            var favPost =[]
                
            for (i = 0; i < favPostId.length; i++) {
                let temp = await knex('posts').where({ id: favPostId[i].posts_id }).select(
                    'id', 'postTitle', 'postContent', 'postAddress', 'received_comments',
                    'users_username', 'users_userPhoto','postPhoto','postDate'
                ).orderBy('id', 'desc');
                favPost.push(temp)
            }

                // console.trace(favPost); 
 
                res.render("fav", { ownPost, favPost }) //favData is an array
            
    } catch (err) {
            console.trace(err)
            res.redirect('/error')
        }
        
    })


    router.get('/:select', isNotLoggedIn, async(req, res) => {
        const users_id = req.user.id;
        const requestedPostCat = req.params.select;
        // console.trace(requestedPostCat)

        try {
            // own posts
            let ownPost = await knex('posts').where({ users_id }).select(
                'id','postTitle','postContent','postAddress','received_comments',
                'users_username','users_userPhoto','postPhoto','postDate'
            ).orderBy('id', 'desc')
            // console.trace(ownPost)

            //favourited posts
            let favPostId = await knex('favposts').where({ users_id })
                .select('posts_id')
                .returning(["posts_id"])
                // console.trace(favPostId); // [ {postId: 2}, {postId: 1} ]

            var favPost =[]
                
            for (i = 0; i < favPostId.length; i++) {
                let temp = await knex('posts').where({ id: favPostId[i].posts_id }).select(
                    'id','postTitle','postContent','postAddress','received_comments',
                    'users_username','users_userPhoto','postPhoto','postDate'
                ).orderBy('id', 'desc');
                favPost.push(temp)
            }
                // console.trace(favPost); 
 
                res.render("fav", { param: requestedPostCat, ownPost, favPost }) //favData is an array
            
    } catch (err) {
            console.trace(err)
            res.redirect('/error')
        }
        
        })
    
    
    //tap favourite
    router.post('/fav/:postId', isNotLoggedIn,async(req, res)=> {
        //console.trace(req.params);
        try {
            //write into favposts table
            let favPost = {
                users_id: req.user.id,
                posts_id: req.params.postId 
            }
            let addFav = await knex("favposts").insert(favPost).returning('posts_id');
            // console.trace(addFav)

            //write into posts table (+rcvd fav)
            let posterRcvdFav = await knex("posts").where('id', addFav[0])
                .increment('received_fav', 1).returning('users_id');
            
            //from posts table, get post id (poster), write into users table, add 2 pts for receiving a like
            await knex("users").where('id', posterRcvdFav[0])
                .increment('points_received', 2);
            
            console.trace("fav added")
            res.end();

        } catch (err) {
            console.trace(err);
            res.redirect('/error')
        }
    })
    

    router.post('/unfav/:postId', isNotLoggedIn, async (req, res) => {
        //console.trace(req.params);
        try {
            //write into favposts table
            let unFavPost = {
                users_id: req.user.id,
                posts_id: req.params.postId 
            }
            let removeFav = await knex("favposts").where('users_id', unFavPost.users_id)
                .andWhere('posts_id', unFavPost.posts_id)
                .returning('posts_id').del();

            //write into posts table
            let posterRmFav = await knex("posts")
                .where('id', removeFav[0])
                .decrement('received_fav', 1)
                .returning('users_id');

            //from posts table, get post id (poster), write into users table, deduct 2 pts 
            await knex("users").where('id', posterRmFav[0]).decrement('points_received', 2);
            console.trace("fav removed")
            res.end();

            
        } catch (err) {
            console.trace(err);
            res.redirect('/error')
        }

    })

    
    return router; 
}