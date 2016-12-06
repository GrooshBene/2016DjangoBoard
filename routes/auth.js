/**
 * Created by GrooshBene on 2016. 11. 21..
 */
module.exports = init;
function init(app, User, randomString, path) {
    var passport = require('passport');

    app.use(passport.initialize());
    app.use(passport.session());

    var FacebookStrategy = require('passport-facebook').Strategy;

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    passport.use(new FacebookStrategy({
        clientID: "1132996196786425",
        clientSecret: "6d689678c191d56a3f8dfcae932a9fac",
        callbackURL: "http://localhost:7070/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
    }, function (accessToken, refreshToken, profile, done) {
        console.log(profile);
        User.findOne({
            _id: profile.id
        }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                user = new User({
                    _id: profile.id,
                    name: profile.displayName,
                    email: profile.email
                });
                user.save(function (err) {
                    if (err) console.log(err);
                    else {
                        done(null, profile.id);
                    }
                });
            }
            else if (user) {
                done(null, profile.id);
            }
        });
    }));

    app.get('/auth/facebook', passport.authenticate('facebook'), function (req, res) {

    });
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/onFailure'
    }));
    app.get('/auth/logout', function(req, res){
        req.logout();
        res.redirect('/auth/facebook');
    })

    app.get('/', function (req, res) {
        if(req.user == null){
            res.redirect("http://localhost:7070/auth/facebook");
        }
        else if(req.user!= null){
            res.sendFile(path.resolve('views/main.html'));
        }
    })

    app.get('/auth/setting', function (req, res) {
        if(req.user == null){
            res.redirect("http://localhost:7070/auth/facebook");
        }
        else if(req.user != null){
            res.sendFile(path.resolve('views/setting.html'));
        }
    })
}