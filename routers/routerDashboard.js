const { development } = require('../knexfile');
const knex = require("knex")(development);

const {isNotLoggedIn} = require('./checkLogIn')

module.exports = (express) => {
    const router = express.Router();

    //dashboard (logged in)
    router.get('/', isNotLoggedIn, async (req, res) => {

        try {
            let postData = await knex('posts').select(
                'id','postTitle','postContent','postAddress',
                'received_fav','received_comments','users_id',
                'users_username','users_userPhoto','postLat',
                'postLng','postPhoto','postDate'
            ).orderBy('id', 'desc')

            let userData = await knex("users").select(
                'username','userPhoto','points_received'
            ).where({id: req.user.id})

            res.render('dashboard',{ postData, userData: userData[0] }); 
        } catch(err) {
            console.trace(err)
            res.redirect('/error')
        }
    });

    //dashboard filter
    router.get('/:select', isNotLoggedIn, async(req, res) => {
        const requestedPostCat = req.params.select;

        try {
            let userData = await knex("users").select(
                'username','userPhoto','points_received'
            ).where({ id: req.user.id })

            let postData = await knex('posts')
                .where({ postDo: requestedPostCat })
                .orWhere({ postGo: requestedPostCat })
                .select('id', 'postTitle', 'postContent', 'postDo', 'postGo', 'postAddress',
                    'received_fav', 'received_comments', 'users_id', 'users_username',
                    'users_userPhoto', 'postLat', 'postLng','postPhoto','postDate'
                ).orderBy('id', 'desc')
                
            res.render('dashboard',{ postData, userData:userData[0]}); 
        } catch(err) {
            console.trace(err)
            res.redirect('/error')
        }
        
    })
    
    return router; 
}