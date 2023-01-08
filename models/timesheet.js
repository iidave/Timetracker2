const mongoose = require('mongoose');

const TimesheetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  //Add grandtotal, etc
});

//Prevent user from submitting more that one timesheet per project
// TimesheetSchema.index({ project: 1, user: 1 }, { unique: true });

//Static Method to get average ratiing and save
//@DW use this to get Grandtotal time for projects on timesheet
TimesheetSchema.statics.getAverageRating = async function (projectId) {
  const obj = await this.aggregate([
    {
      $match: { project: projectId },
    },
    {
      $group: {
        _id: '$project',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    await this.model('Project').findByIdAndUpdate(projectId, {
      averageRating: obj[0].averageRating,
    });
  } catch (error) {
    console.error(err);
  }
};

// Call get average cost after save
TimesheetSchema.post('save', function () {
  this.constructor.getAverageRating(this.project);
});

// Call get average cost before remove
TimesheetSchema.pre('remove', function () {
  this.constructor.getAverageRating(this.project);
});

module.exports = mongoose.model('Timesheet', TimesheetSchema);
