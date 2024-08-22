const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");
const sendEmail = require("../utils/email");

exports.createUser = asyncHandler(async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  console.log(req.body);

  if (!email || !password || !confirmPassword)
    return next(new AppError(403, "missing details"));
  const newUser = await User.create({
    email,
    password,
    confirmPassword,
  });
  res.status(201).json({
    status: "success",
    newUser,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError(403, "missing login details"));
  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new AppError(404, "user not exist"));
  if (!(await user.checkPassword(password, user.password)))
    return next(new AppError(403, "email or password incorrect"));

  // generate token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  //Cookie assign
  res.cookie("jwt", token, {
    secure: true,
    sameSite: "none",
    expires: new Date(Date.now() + 86_400_400 * 14),
  });
  //server Response
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = asyncHandler(async (req, res, next) => {
  if (!req.cookies) {
    return next(new AppError(403, "log in "));
  }
  const token = req.cookies.jwt;

  // verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  if (!decoded || !decoded.exp > Date.now() / 1000) {
    return next(new AppError(403, "please log in"));
  }
  // find user by id
  const user = await User.findById(decoded.id);
  if (!user) return next(new AppError(403, "log in"));

  req.user = user;
  next();
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError(401, "bad request email is missing"));
  const user = await User.findOne({ email });
  if (!user)
    return next(
      new AppError(404, "no account associated with the given email")
    );
  // change password token
  const resetToken = user.createPasswordResetToken();
  await user.save({
    validateBeforeSave: false,
  });
  const resetUrl = `http://localhost:3000/ForgetPassword?${resetToken}`;

  // send this reset url to user email
  // send this reset url to user email
  const mailOptions = {
    from: "Shoppi <noreplay@shoppi.com>",
    to: user.email,
    subject: "Password reset",
    text: `<h3>Please follow this link to reset your password </h3> <a href="${resetUrl}">Click here to reset your password</a> `,
  };
  try {
    await sendEmail(mailOptions);
    res.status(200).json({
      status: "success",
      message: "the email sent",
      resetToken,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError(500, "there was a problem sending email"));
  }
});
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const { plainResetToken } = req.params;
  console.log(plainResetToken);

  if (!password || !confirmPassword || !plainResetToken)
    return next(new AppError(401, "missing Details"));
  //encrypt plain token to match the reset token
  const hashedToken = crypto
    .createHash("sha256")
    .update(plainResetToken)
    .digest("hex");
  //find user based on the reset toekn

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gte: Date.now() },
  }).select("+password");
  if (!user) return next(new AppError(400, "Do Forgot Password again"));
  // Check same password:
  if (await user.checkPassword(password, user.password))
    throw new AppError(
      400,
      "This password has already been use, try a diffrent one."
    );
  //change password
  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // save user
  await user.save();
  res.status(200).json({
    status: "success",
    message: "The Password has been changed",
  });
  // delete token
});
exports.logOut = function (req, res, next) {
  res.cookie("jwt", "", {
    secure: true,
    httpOnly: true,
    sameSite: "None",
    expires: new Date(Date.now() - 1000),
  });

  // Server response:
  res.status(200).json({
    status: "success",
    user: null,
  });
};
console.log("hello");
