const express = require('express');
const {
  getTasks,
  getTask,
  addTask,
  updateTask,
  deleteTask,
  //   getCoursesInRadius,
} = require('../controllers/tasks');

//Bring in Course model
//Bring in Advanced Results middleware
const Course = require('../models/Task');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
const Task = require('../models/Task');

router
  .route('/')
  .get(
    advancedResults(Task, {
      path: 'task',
      select: 'name description',
    }),
    getTasks
  )
  .post(protect, authorize('publisher', 'admin'), addTask);

router
  .route('/:id')
  .get(getTask)
  .put(protect, authorize('publisher', 'admin'), updateTask)
  .delete(protect, authorize('publisher', 'admin'), deleteTask);

module.exports = router;
