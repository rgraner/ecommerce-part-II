// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const db = require('../controllers/users');

// passport.use(new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password'
// },
// async (email, password, done) => {
//     try {
//         const user = await db.getUserByEmail(email);
//         if (!user) {
//             return done(null, false, {message: 'Incorrect email or password.'});
//         }
//         return done(null, user);
//     } catch (error) {
//         return done(error);
//     }
// }));

// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//     try {
//         const user = await db.getUserById(id);
//         done(null, user)
//     } catch(error) {
//         done(error);
//     }
// });

// module.exports = passport;

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../models/pool');

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  (username, password, done) => {
    pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username],
      (error, results) => {
        if (error) {
          return done(error);
        }
        if (!results.rows.length) {
          return done(null, false, { message: 'Incorrect email.' });
        }
        const user = results.rows[0];
        if (password !== user.password) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      }
    );
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  pool.query(
    'SELECT * FROM users WHERE id = $1',
    [id],
    (error, results) => {
      if (error) {
        return done(error);
      }
      const user = results.rows[0];
      done(null, user);
    }
  );
});

module.exports = passport;

// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const pool = require('../models/pool');
// const bcrypt = require('bcrypt');

// passport.use(new LocalStrategy(
//   {
//     usernameField: 'username',
//     passwordField: 'password'
//   },
//   async (username, password, done) => {
//     try {
//       const { rows } = await pool.query(
//         'SELECT * FROM users WHERE username = $1',
//         [username]
//       );
//       if (!rows.length) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       const user = rows[0];
//       console.log('hashed: ', user.password);
//       console.log('not hashed: ', password);
//       const match = await bcrypt.compare(password, user.password);
//       if (!match) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     } catch (error) {
//       return done(error);
//     }
//   }
// ));

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const { rows } = await pool.query(
//       'SELECT * FROM users WHERE id = $1',
//       [id]
//     );
//     const user = rows[0];
//     done(null, user);
//   } catch (error) {
//     done(error);
//   }
// });

// module.exports = passport;
