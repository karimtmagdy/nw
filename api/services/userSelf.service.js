const { User } = require("../models/User");
const { fn, paginate } = require("../lib/utils");
const { AppError } = require("../middleware/errorHandler");
const jwt = require("jsonwebtoken");

// @route   PATCH api/v1/users/:id/password
// @desc    Update user password by id
// @access  Private
exports.updateUserPassword = fn(async (req, res, next) => {});

// @route   GET api/v1/users/me
// @desc    Get current user
// @access  Private
exports.getMe = fn(async (req, res, next) => {
  // Get user details
  const { id } = req.user;
  const auth = req.headers.authorization;
  const token = auth && auth.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded._id || req.user.id).select("-password").exec();
  // console.log("req", req);
  console.log("id", id);
  console.log("decoded", decoded);
  console.log("user", user);
  console.log("user", req.user);
  if (!user) return next(new AppError("User not found", 404));
  res.json(user);
});

// @route   DELETE api/v1/users/me
// @desc    Delete current user himself
// @access  Private
exports.deleteMe = fn(async (req, res, next) => {});

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
