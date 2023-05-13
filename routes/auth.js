const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');


router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {  return next(err); }
    if (!user) { return res.status(401).json({ message: 'invalid credentials' }); }

    req.login(user, (err) => {
      if (err) { return next(err); }
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY);
      res.cookie('token', token);
      return res.status(200).json({ message: 'Login succesfull', user: req.user });
    });
  })(req, res, next);
});


router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) {
      console.error(err);
      return next(err);
    }
    res.redirect('/');
  });
});


module.exports = router;
