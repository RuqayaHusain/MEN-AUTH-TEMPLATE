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


router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs");
});

router.post('/sign-in', async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username });
  if(!userInDatabase) { //check if user exist in the database
    return res.send('Username or password is invalid.');
  }

  const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password);
  if (!validPassword) {
    return res.send("Username or password is invalid.");
  }

  req.session.user = {//create a cookie, and save it in the session
    username: userInDatabase.username,
    _id: userInDatabase._id
  };

  res.redirect('/');
});

module.exports = router;