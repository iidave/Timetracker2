const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  task: {
    // Array of strings
    type: [String],
    required: true,
    enum: [
      'Design',
      'Production',
      '3D',
      'Meeting',
      'ProjMgmt',
      'Illustration',
      'Photography',
      'Other',
    ],
  },
  rate: {
    type: Number,
    default: 125,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Task-type', TaskSchema);
