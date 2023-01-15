const express = require('express');
const {
  getTimesheets,
  getTimesheet,
  addTimesheet,
  updateTimesheet,
  deleteTimesheet,
  //   getReviewsInRadius,
} = require('../controllers/timesheets');

//Bring in Review model

const Review = require('../models/Timesheet');

const router = express.Router({ mergeParams: true });

//Bring in Advanced Results middleware
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Timesheet, {
      path: 'timesheet',
      select: 'date',
    }),
    getTimesheets
  )
  .post(protect, authorize('user', 'admin'), addTimesheet);

router
  .route('/:id')
  .get(getTimesheet)
  .put(protect, authorize('user', 'admin'), updateTimesheet)
  .delete(protect, authorize('user', 'admin'), deleteTimesheet);

module.exports = router;
