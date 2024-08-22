const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const asyncHandler = require("express-async-handler");

exports.getUserById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return next(new AppError(403, "no user found"));
  return res.status(200).json({
    status: "success",
    user,
  });
});
