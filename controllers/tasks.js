const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc     Get tasks
// @route    GET /api/v1/tasks
// @route    GET /api/v1/projects/:projectId/tasks
// @access   Public

exports.getTasks = asyncHandler(async (req, res, next) => {
  if (req.params.projectId) {
    const tasks = await Task.find({ project: req.params.projectId });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc     Get single task
// @route    GET /api/v1/tasks/:id
// @access   Public

exports.getTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id).populate({
    path: 'project',
    select: 'name description',
  });

  if (!task) {
    return next(
      new ErrorResponse(`No task with the id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc     Add task
// @route    POST /api/v1/projects/:projectId/tasks
// @access   Private

exports.addTask = asyncHandler(async (req, res, next) => {
  req.body.project = req.params.projectId;
  req.body.user = req.user.id;

  const project = await Project.findById(req.params.projectId);

  if (!project) {
    return next(
      new ErrorResponse(`No project with the id of ${req.params.projectId}`),
      404
    );
  }

  // Make sure user is Project owner --- Do not need this function !!!!!
  // if (project.user.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.user.id} is not authorized to add a task to ${project._id}`,
  //       401
  //     )
  //   );
  // }

  const course = await Task.create(req.body);

  res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc     Update task
// @route    PUT /api/v1/projects/tasks/:id
// @access   Private

exports.updateTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(
      new ErrorResponse(`No task with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is Project owner
  if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update task to ${task._id}`,
        401
      )
    );
  }

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc     Delete task
// @route    DELETE /api/v1/projects/tasks/:id
// @access   Private

exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(
      new ErrorResponse(`No task with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is Task owner
  if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete task ${task._id}`,
        401
      )
    );
  }

  await task.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
