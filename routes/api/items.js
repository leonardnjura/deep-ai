const express = require('express');
const router = express.Router();

// API Routes

// @route   GET /
// @desc    Fetch all items
// @access  Public
router.get('/', (req, res) => {
  res.json({ msg: 'welcome to items api' });
});

module.exports = router;
