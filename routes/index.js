const express = require('express');
const router = express.Router();
const { membersOnly } = require('../config/auth');

// PUBLIC ROUTES

// @desc    Landing page
// @access  Public
router.get('/', (req, res) => {
  res.render('welcome');
});

// @desc    Dashboard
// @access  Public
router.get('/dashboard', membersOnly, (req, res) => {
  res.render('dashboard', {
    name: req.user.name
  });
});

module.exports = router;
