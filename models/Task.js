const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  taskType: {
    type: mongoose.Schema.Types.String,
    ref: 'task-type',
    required: true,
  },
  note: {
    type: String,
  },
  jobNo: {
    type: mongoose.Schema.Types.String,
    ref: 'project',
  },
  punchIn: {
    type: Date,
    required: true,
  },
  punchOut: {
    type: Date,
    required: false,
  },
  punchSub: {
    type: Number,
  },
  punchAdj: {
    type: Number,
    default: 0,
  },
  rate: {
    type: mongoose.Schema.Types.String,
    ref: 'task-type',
  },
  punchTotal: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Labor = mongoose.model('task', TaskSchema);
