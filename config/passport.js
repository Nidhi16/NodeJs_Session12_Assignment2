// load all the things we need
var express  = require('express');
var app      = express();

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function(passport) {
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, JSON.stringify(user));
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        done(null, {
            id: id
        });
    });
    passport.use(new GoogleStrategy({
            'clientID': "292532955650-offqgh88i4cm8s4jq25r3pudrt0d3bg2.apps.googleusercontent.com",
            'clientSecret': "0c9ZmyZNmSod2cMR-7pYwftN",
            'callbackURL': "http://127.0.0.1:8080/auth/google/callback",
            'passReqToCallback' : true
        },
        function (request, token, tokenSecret, profile, done) {
            console.log(profile);
            // set all of the relevant information
            var sessionData = request.session;
            sessionData.id = profile.id;
            sessionData.token = token;
            sessionData.displayName = profile.displayName;
            sessionData.gender = profile.gender;
            sessionData.familyName = profile.name.familyName;
            sessionData.givenName = profile.name.givenName;
            done(null, {
                id: profile.id,
                token: token,
                displayName : profile.displayName,
                gender : profile.gender,
                familyName : profile.name.familyName,
                givenName : profile.name.givenName,
            });
        }
    ));
};