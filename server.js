var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var passport = require('passport');

var bodyParser = require('body-parser');
var session = require('express-session');
app.use(session({secret: 'googletesting123'}));

app.use(bodyParser.urlencoded({ extended:false }));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

require('./config/passport')(passport);

app.get('/', function(request, response) {
   response.render('index.ejs');
});

app.get('/profile', function(request, response) {
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
        // Successful authentication, redirect home.
        res.redirect('/profile');
    });

app.listen(port, function(){
    console.log("Listening to port " + port);
});