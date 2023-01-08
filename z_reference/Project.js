const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    require: true,
  },
  jobNo: {
    type: String,
    require: true,
  },
  acctExec: {
    type: String,
    required: true,
  },
  pm: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Project = mongoose.model('project', ProjectSchema);
