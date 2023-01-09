//Router - Routes that link to Server.js
//Route methods are located in controllers.js

const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  projectPhotoUpload,
  // getProjectsInRadius,
} = require('../controllers/projects');

//Bring in Bootcamp model
const Project = require('../models/Project');

//Include other resource routers
const taskRouter = require('./timesheets');
const timesheetRouter = require('./timesheets');

const router = express.Router();

//Bring in Advanced Results middleware
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

//Re-route into other resourse routers
router.use('/:projectId/courses', taskRouter);
router.use('/:projectId/reviews', timesheetRouter);

// Geocode Function not needed
// router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), projectPhotoUpload);

router
  .route('/')
  .get(advancedResults(Project, 'tasks'), getProjects)
  .post(protect, authorize('publisher', 'admin'), createProject);

router
  .route('/:id')
  .get(getProject)
  .put(protect, authorize('publisher', 'admin'), updateProject)
  .delete(protect, authorize('publisher', 'admin'), deleteProject);

module.exports = router;
