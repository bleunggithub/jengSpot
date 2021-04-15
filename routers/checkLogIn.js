//for index page, explore page (if logged in, redirect to dashboard)
module.exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    next();
}

// for dashboard, rewards, settings, saved (if not logged in, redirect to explore)
module.exports.isNotLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/explore');
}