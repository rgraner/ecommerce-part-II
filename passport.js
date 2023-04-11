const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./queries');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
async (email, password, done) => {
    try {
        const user = await db.getUserByEmail(email);
        if (!user) {
            return done(null, false, {message: 'Incorrect email or password.'});
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.getUserById(id);
        done(null, user)
    } catch(error) {
        done(error);
    }
});

module.exports = passport;