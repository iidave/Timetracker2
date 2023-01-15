const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Timesheet = require('../models/Timesheet');
const Project = require('../models/Project');

//Timesheet collects tasks for one User and display info for projects and time punches

// @desc     Get timesheets
// @route    GET /api/v1/timesheets
// @route    GET /api/v1/projects/:projectId/timesheets
// @access   Public

exports.getTimesheets = asyncHandler(async (req, res, next) => {
  if (req.params.projectId) {
    const timesheets = await Timesheet.find({ project: req.params.projectId });

    return res.status(200).json({
      success: true,
      count: timesheets.length,
      data: timesheets,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc     Get single timesheet
// @route    GET /api/v1/timesheets/:id
// @access   Public

exports.getTimesheet = asyncHandler(async (req, res, next) => {
  const timesheet = await Timesheet.findById(req.params.id).populate({
    path: 'project',
    select: 'name description',
  });

  if (!timesheet) {
    return next(
      new ErrorResponse(
        `No timesheet found with the ID of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: timesheet,
  });
});

// @desc     Add timesheet
// @route    POST /api/v1/projects/:projectId/timesheets
// @access   Private

exports.addTimesheet = asyncHandler(async (req, res, next) => {
  req.body.project = req.params.projectId;
  req.body.user = req.user.id;

  const project = await Project.findById(req.params.projectId);

  if (!project) {
    return next(
      new ErrorResponse(
        `No project with the id of ${$req.params.projectId}`,
        404
      )
    );
  }

  const timesheet = await Timesheet.create(req.body);

  res.status(201).json({
    success: true,
    data: timesheet,
  });
});

// @desc     Update timesheet
// @route    PUT /api/v1/timesheets/:id
// @access   Private

exports.updateTimesheet = asyncHandler(async (req, res, next) => {
  let timesheet = await Timesheet.findById(req.params.id);

  if (!timesheet) {
    return next(
      new ErrorResponse(`No timesheet with the id of ${$req.params.id}`, 404)
    );
  }
  //Make sure timesheet belongs to user or user is an admin
  if (timesheet.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update timesheet`, 401));
  }

  timesheet = await Timesheet.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: timesheet,
  });
});

// @desc     Delete timesheet
// @route    DELETE /api/v1/timesheets/:id
// @access   Private

exports.deleteTimesheet = asyncHandler(async (req, res, next) => {
  const timesheet = await Timesheet.findById(req.params.id);

  if (!timesheet) {
    return next(
      new ErrorResponse(`No timesheet with the id of ${$req.params.id}`, 404)
    );
  }
  //Make sure timesheet belongs to user or user is an admin
  if (timesheet.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update timesheet`, 401));
  }

  await timesheet.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
