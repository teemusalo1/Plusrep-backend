const express = require('express')
const app = express()

const GoogleUser = require('../models/googleUser')
const router = express.Router()
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

app.use(passport.initialize())
app.use(passport.authenticate('session'))

passport.use(GoogleUser.createStrategy())
passport.serializeUser(function (user, done) {
    done(null, user.id);
})
passport.deserializeUser(function (id, done) {
    GoogleUser.findById(id, function (err, user) {
        done(err, user);
    })
})

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3001/auth/google/callback',
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
},
    function (accessToken, refreshToken, profile, cb) {
        GoogleUser.findOrCreate({ googleId: profile.id, username: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] })
)

router.get("/auth/google/callback",
    passport.authenticate('google', { failureRedirect: 'http://localhost:3000' }),
    function (req, res) {
        // Successful authentication, redirect secrets.
        console.log('Google auth success')
        res.redirect('http://localhost:3001')
    })

router.get('/logout', function (req, res) {
    console.log('logout')
    req.logout()
    res.redirect('http://localhost:3000/')
})

module.exports = router;