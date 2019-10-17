const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/User');

// PUBLIC ROUTES

// @desc    Login
// @access  Public
router.get('/signin', (req, res) => {
  res.render('signin');
});

// @desc    Registration
// @access  Public
router.get('/signup', (req, res) => {
  res.render('signup');
});

// @desc    Registration handler
// @access  Public
router.post('/signup', (req, res) => {
  const { name, email, password, password2 } = req.body;

  let errors = [];

  // Validate..
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill out all required fields' });
  }
  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }
  if (password.length < 4) {
    errors.push({ msg: 'Password should be at least 4 characters' });
  }

  if (errors.length > 0) {
    res.render('signup', {
      // Re-render form but don't lose what was typed in, :)
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // Everything ok!
    User.findOne({ email }).then(user => {
      if (user) {
        // Decline: user exists
        errors.push({ msg: 'Email is already registered' });
        res.render('signup', {
          // Re-render form but don't lose what was typed in, :)
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        // Ok to save [ui]
        const newUser = new User({
          name,
          email,
          password
        });

        // Hash for passport
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash('success_msg', 'Signup success. You may sign in');
                res.redirect('signin');
              })
              .catch(err => console.log(err));
          })
        );
      }
    });
  }
});

// @desc    Login Handler
// @access  Public
router.post('/signin', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: 'signin',
    failureFlash: true
  })(req, res, next);
});

// @desc    Logout
// @access  Public
router.get('/signout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are signed out');
  res.redirect('signin');
});

module.exports = router;
