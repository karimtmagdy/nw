const { User } = require("../models/User");
const { fn, paginate } = require("../lib/utils");
const { AppError } = require("../middleware/errorHandler");

// @route   CREATE api/v1/users
// @desc    Create new user
// @access  Private
exports.createUser = fn(async (req, res, next) => {
  const { username, email, password, role, gender } = req.body;
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) return next(new AppError("User already exists", 400));
  const user = await User.create({
    username,
    email,
    password,
    role,
    gender,
  });
  await user.save();
  res.status(201).json({
    status: "success",
    message: "User created successfully",
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});

// @route   GET api/v1/users
// @desc    Get all users (admin only)
// @access  Private
exports.getAllUsers = fn(async (req, res, next) => {
  const users = await User.find()
    .select("-password -refreshToken -cart -orders -tags -remember_me -slug")
    .exec();
  res.json(users);
});

// @route   GET api/v1/users/:id
// @desc    Get user by id
// @access  Private
exports.getSingleUser = fn(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById({ _id: id }).exec();
  if (!user) return next(new AppError("User not found", 404));
  res.status(200).json({
    status: "success",
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      gender: user.gender,
      active: user.active,
      verified: user.verified,
      joinedAt: user.joinedAt,
      updatedAt: user.updatedAt,
    },
  });
});

// @route   PATCH api/v1/users/:id
// @desc    Update user by id
// @access  Private
exports.updateUser = fn(async (req, res, next) => {
  const { id } = req.params;
  const { username, email, role } = req.body;
  const updates = {};
  if (username) updates.username = username;
  if (email) updates.email = email;
  if (role) updates.role = role;
  const user = await User.findByIdAndUpdate(
    { _id: id },
    { $set: updates },
    { new: true }
  );
  if (!user) return next(new AppError("User not found", 404));
  res
    .status(200)
    .json({ status: "success", message: "User updated successfully", user });
});

// @route   DELETE api/v1/users/:id
// @desc    Delete user by id
// @access  Private
exports.deleteUser = fn(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete({ _id: id });
  if (!user) return next(new AppError("User not found", 404));
  res
    .status(200)
    .json({ status: "success", message: "User deleted successfully" });
});
