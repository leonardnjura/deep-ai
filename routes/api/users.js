const express = require('express');
const router = express.Router();

// API Routes

// @route   GET api/auth/users
// @desc    Users page
// @access  Public
router.get('/users', (req, res) => {
  res.json({ msg: 'welcome to users api' });
});

module.exports = router;
