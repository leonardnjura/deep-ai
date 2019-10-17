const mongoose = require('mongoose');

const BedSchema = new mongoose.Schema({
  agent: {
    type: String,
    required: true
  },
  agent_id: {
    type: String,
    required: true
  },
  input: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Bed = mongoose.model('bed', BedSchema);
