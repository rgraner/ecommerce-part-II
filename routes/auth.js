const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {  return next(err); }
    if (!user) { return res.status(401).json({ message: 'invalid credentials' }); }

    req.login(user, (err) => {
      if (err) { return next(err); }
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY);
      console.log('token: ', token)
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


router.get('/check', authMiddleware, (req, res) => {
  const token = req.cookies.token; // Get the token from the 'token' cookie

  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const userId = decodedToken.userId;
      res.json({ id: userId });
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});


module.exports = router;
