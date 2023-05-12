const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../models/pool');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  async (username, password, done) => {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      );
      if (!rows.length) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      const user = rows[0];
      console.log('hashed: ', user.password);
      console.log('not hashed: ', password);
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    const user = rows[0];
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
