const express = require('express');
const router = express.Router();

// Bed Model
const Bed = require('../../models/Bed');

// @route   GET api/beds
// @desc    Fetch all beds
// @access  Public
router.get('/', (req, res) => {
  Bed.find()
    .sort({ date: -1 })
    .then(beds => res.json({ beds }));
});

// @route   GET api/beds
// @desc    Fetch one bed
// @access  Public
router.get('/:id', (req, res) => {
  Bed.findById(req.params.id)
    .then(bed => res.json({ bed }))
    .catch(err => res.status(404).json({ success: false }));
});

// @route   POST api/beds
// @desc    Create a bed
// @access  Public?
router.post('/', (req, res) => {
  const { agent, agent_id, input } = req.body;

  // simple validation
  if (!agent || !agent_id || !input) {
    return res.status(400).json({ msg: '!Please enter all bedtest fields' });
  }

  const newBed = new Bed({
    agent: req.body.agent,
    agent_id: req.body.agent_id,
    input: req.body.input
  });

  newBed.save().then(bed => res.json(bed));
  res.status(201);
});

module.exports = router;
