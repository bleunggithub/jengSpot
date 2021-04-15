const { development } = require('../knexfile');
const knex = require("knex")(development);

const bcrypt = require("bcrypt");

const {isNotLoggedIn} = require('./checkLogIn')

module.exports = (express) => {
    const router = express.Router();

    //setting page
    router.get('/', isNotLoggedIn, async (req, res) => {
        try {
            let userData = await knex("users").select(
                'username','email','points_received','points_redeemed','userPhoto'
            ).where({ id: req.user.id })

            res.render("settings", { userData: userData[0] })

        } catch (err){
            console.trace(err)
            res.redirect('/error')
        }
    })

    router.post('/:change', isNotLoggedIn, async (req, res) => {
        let requestChange = req.params.change;
        let id = req.user.id;
        // console.trace(requestChange)

        try {//password
            if (requestChange == 'password') {
                let passwordToChange = req.body.password;
                let password = await bcrypt.hash(passwordToChange, 10);
                // console.log(hashedPassword);

                await knex('users').where({id}).update({password})
                res.redirect('/settings')

            } else if (requestChange == 'username') {
                let username = req.body.username;

                await knex('users').where({id}).update({username})
                res.redirect('/settings')

            } else if (requestChange == 'email') {
                let email = req.body.email;
                
                await knex('users').where({id}).update({email})
                res.redirect('/settings')

            } else if (requestChange == 'userPhoto') {
                let userPhoto = req.body.userPhoto;
                
                await knex('users').where({id}).update({userPhoto})
                res.redirect('/settings')
            } else {
                res.redirect("/error")
            }
        } catch (err) {
            console.trace(err)
            res.redirect('/error')
        }
    })

    
    return router; 
}