const User = require("../models/userModel");
const Task = require("../models/taskModel");
const AppError = require("../utils/AppError");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

exports.createTask = asyncHandler(async (req, res, next) => {
  const newTask = await Task.create({
    author: req.user._id,
    ...req.body,
  });
  if (!newTask) return next(new AppError(403, "new task didnt work"));
  return res.status(200).json({
    status: "success",
    task: newTask,
    user: await User.findById(req.user._id),
  });
});

exports.getTasksByUser = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({ _id: verified.id });
  if (!user) return next(new AppError(403, "user not found"));
  return res.status(200).json({
    tasks: await Task.find({
      author: verified.id,
    }),
  });
});

exports.deleteTask = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({ _id: verified.id });
  if (!user) return next(new AppError(403, "User not found"));
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  user.tasks = user.tasks.filter((id) => id.toString() !== id);
  await user.save();
  return res.status(200).json({ status: "success" });
});

exports.clearAllTasks = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({ _id: verified.id });
  if (!user) return next(new AppError(403, "User not found"));
  await Task.deleteMany({ _id: { $in: user.tasks } });
  user.tasks = [];
  await user.save();
  return res.status(200).json({ status: "success" });
});

exports.editTaskById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  if (req.body.taskIsCompleted) task.taskIsCompleted = !task.taskIsCompleted;
  await task.save();
  return res.status(200).json({ status: "success", tasks: await Task.find() });
});

exports.patchTask = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, body } = req.body;
  const task = await Task.findByIdAndUpdate(id, {
    taskTitle: title,
    taskDescription: body,
  });

  await task.save();
  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  });
});
