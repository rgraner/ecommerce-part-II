const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.status(200).json({ message: 'Login successful', user: req.user });
});

// router.post('/login', async (req, res, next) => {
//   const { username, password } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);
//   passport.authenticate('local', async (err, user, info) => {
//     // remaining code
//     res.status(200).json({ message: 'Login successful', user: req.user });
//   })(req, res, next);
// });


module.exports = router;
