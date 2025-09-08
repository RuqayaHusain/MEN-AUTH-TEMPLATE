const express = require("express");
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');

router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});

router.post('/sign-up', async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username });
  if(userInDatabase) { //check if user exist in the database
    return res.send('Username or password is invalid.');
  }

  if(req.body.password !== req.body.confirmPassword) { //checks if both passwords entered by user match
    return res.send('Password and Confirm Password must match');
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10); //encrypt password 10 times (SALTING)
  req.body.password = hashedPassword;

  const user = await User.create(req.body);
  res.send(`Thanks for signing up ${user.username}`);
});

module.exports = router;