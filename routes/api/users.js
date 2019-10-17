const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// User Model
const User = require('../../models/User');

// @route   GET api/auth/users
// @desc    Fetch all users
// @access  Public
router.get('/users', (req, res) => {
  User.find()
    .sort({ date: -1 })
    .then(users => res.json({ users }));
});

// @route   GET api/auth/users/:id
// @desc    Find one user
// @access  Public
router.get('/users/:id', (req, res) => {
  User.findById(req.params.id)
    .then(user => res.json({ user }))
    .catch(err => res.status(404).json({ success: false }));
});

// @route   POST api/auth/signup
// @desc    Register new user
// @access  Public
router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  // simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: '!Please enter all required fields' });
  }

  // check for existing user
  User.findOne({ email }).then(user => {
    if (user)
      return res.status(400).json({ msg: '!Oops, user already exists' });

    // Ok to save [api]
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
            res.json({ user });
          })
          .catch(err => console.log(err));
      })
    );
  });
});

// @route   DELETE api/auth/users/:id
// @desc    Chuck a user
// @access  Public
router.delete('/users/:id', (req, res) => {
  User.findById(req.params.id)
    .then(user =>
      user.remove().then(() => {
        res.status(204).json({ success: true, msg: 'User deleted' });
      })
    )
    .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;
