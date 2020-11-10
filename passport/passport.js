const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("./bcrypt");
const knex = require("knex")({
  client: "postgresql",
  connection: {
    database: "travelapp",
    user: "postgres",
    password: "postgres",
  },
});
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;




module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  //Local strategy - Log in
  passport.use(
    "local-login",
    new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    }, async (email, password, done) => {
      try {
        let users = await knex("users").where({ email: email });
        if (users.length == 0) {
          return done(null, false, { message: "Incorrect Credentials. Please try again." });
        }
        let user = users[0];
        console.log(users[0])
        let result = await bcrypt.checkPassword(password, user.password);
        if (result) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect Credentials. Please try again." });
        }
      } catch (err) {
        console.trace(err)
        return done(err);
      }
    })
  );

// Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/dashboard",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
}, async (accessToken, refreshToken, profile, done) => {
    try {
      // console.log("profile:" + profile)
      let usersGoogle = await knex("users").where({ googleId: profile.id });

      if (usersGoogle.length === 0) {
        const newUserGoogle = {
          username: profile.displayName,
          googleId: profile.id,
          userPhoto: profile.photos[0].value,
          points_received: 0,
          points_redeemed: 0,
          admin: false
        }
        let userGId = await knex("users").insert(newUserGoogle).returning("id");
        newUserGoogle.id = userGId[0];
        return done(null, newUserGoogle);
      } else if (usersGoogle.length > 0){
        let userGoogle = usersGoogle[0];
        return done(null,userGoogle)
      }
    } catch (err) {
      console.trace(err)
        return done(err);
      }
  }
));
  
  
//Facebook OAuth
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/fb/dashboard"
}, async (accessToken, refreshToken, profile, done) => {
      try {
    console.log("profile: " + JSON.stringify(profile))
    let usersFB = await knex("users").where({ fbId: profile.id });

      if (usersFB.length === 0) {
        const newUserFB = {
          username: profile.displayName,
          fbId: profile.id,
          number_of_posts: 0,
          userPhoto: "../assets/png/049-worldwide.png", 
          number_of_posts: 0,
          points_received: 0,
          points_redeemed: 0,
          admin: false
        }
        let userFBId = await knex("users").insert(newUserFB).returning("id");
        newUserFB.id = userFBId[0];
        return done(null, userFBId);
      } else if (usersFB.length > 0){
        let userFB = usersFB[0];
        return done(null,userFB)
      }
    } catch (err) {
      console.trace(err)
        return done(err);
      }
    

  }
));

//Serialise user
  passport.serializeUser((user, done) => {
    console.trace(user)
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    let users = await knex("users").where({ id: id });
    if (users.length == 0) {
      return done(new Error(`Wrong User id ${id}`));
    }
    let user = users[0];
    return done(null, user);
  });
};
