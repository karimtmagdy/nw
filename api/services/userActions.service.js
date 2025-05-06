const { User } = require("../models/User");
const { fn, paginate, auth } = require("../lib/utils");
const { AppError } = require("../middleware/errorHandler");
const jwt = require("jsonwebtoken");

// @route   GET api/v1/users/me
// @desc    Get current user
// @access  Private
exports.getMe = fn(async (req, res, next) => {
  const token = auth(req);
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded._id).select("-password");
  // console.log("user from user action", user);
  console.log("decoded from user action", decoded);
  // console.log("token from user action", token);
  res.status(200).json({ status: "success", user });
});

// @route   DELETE api/v1/users/me
// @desc    Delete current user himself
// @access  Private
exports.deleteMe = fn(async (req, res, next) => {
  const token = auth(req);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findByIdAndDelete(decoded._id);
  if (!user) return next(new AppError("User not found", 404));
  res
    .status(202)
    .json({ status: "success", message: "User deleted successfully" });
});

// @route   PATCH api/v1/users/me
// @desc    Update user himself
// @access  Private
exports.updateMe = fn(async (req, res, next) => {
  const { id } = req.params;
  const { username, password, age, gender, photo } = req.body;
  const updatesFields = {};
  if (username) updatesFields.username = username;
  if (password) updatesFields.password = password;
  if (age) updatesFields.age = age;
  if (gender) updatesFields.gender = gender;
  if (photo) updatesFields.photo = photo;
  const user = await User.findByIdAndUpdate(
    { _id: id },
    { $set: updatesFields },
    { new: true }
  );
  if (!user) return next(new AppError("User not found", 404));
  res
    .status(200)
    .json({ status: "success", message: "User updated successfully", user });
});

// @route   PATCH api/v1/users/:id/password
// @desc    Update user password by id
// @access  Private
exports.updateUserPassword = fn(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");
  if (!user) return next(new AppError("User not found", 404));

  // check if current password is correct
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) return next(new AppError("Current password is incorrect", 400));

  // update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
  });
});
