var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var passport = require('passport');

var session = require('express-session');
app.use(session({secret: 'googletesting123'}));  // session secret

app.use(passport.initialize());
app.use(passport.session());  // persistent login sessions

require('./config/passport')(passport);   // pass passport for configuration

app.set('view engine', 'ejs');  // set up ejs for templating

// route for home page
app.get('/', function(request, response) {
   response.render('index.ejs');
});

// route for showing the profile page
app.get('/profile', function(request, response) {

    // get the user out of session and pass to template
    var id = request.session.id;
    var token = request.session.token;
    var displayName = request.session.displayName;
    var gender = request.session.gender;
    var familyName = request.session.familyName;
    var givenName = request.session.givenName;

    response.render('profile.ejs', {
        id: id,
        displayName: displayName,
        gender: gender,
        familyName: familyName,
        givenName: givenName,
        token: token
    });
});

// send to google to do the authentication
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));


// handle the callback after google has authenticated the user
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
        // Successful authentication, redirect profile.
        res.redirect('/profile');
    });

// launch
app.listen(port, function(){
    console.log("Listening to port " + port);
});