const express = require('express');
const passport = require('passport');
const router = express.Router();

// router.post('/login', passport.authenticate('local'), (req, res) => {
//   res.status(200).json({ message: 'Login successful', user: req.user });
// });

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {  return next(err); }
    if (!user) { return res.status(401).json({ message: 'invalid credentials' }); }

    req.login(user, (err) => {
      if (err) { return next(err); }
      return res.status(200).json({ message: 'Login succesfull', user: req.user });
    });
  })(req, res, next);
});


module.exports = router;
