const passport = require('passport');

module.exports = (express) => {
    const router = express.Router();

    //third party OAuth 
    //Google
    router.get('/google', passport.authenticate('google',
        { scope: ['profile'] }
    ));
    
    router.get('/google/dashboard', 
    passport.authenticate('google', { failureRedirect: '/error' }),(req, res)=> {
    // Successful authentication, redirect dashboard
    res.redirect('/dashboard');
    });
    
    //Facebook 
    router.get('/fb', passport.authenticate('facebook'));
    
    router.get('/fb/dashboard', 
    passport.authenticate('facebook', { failureRedirect: '/error' }),(req, res)=> {
    // Successful authentication, redirect dashboard
    res.redirect('/dashboard');
    });

    
    return router; 
}