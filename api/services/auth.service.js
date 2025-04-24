const { User } = require("../models/User");
const { fn } = require("../lib/utils");
const { AppError } = require("../middleware/errorHandler");
const jwt = require("jsonwebtoken");

// @route   POST api/v1/auth/sign-up
// @desc    Register a user
// @access  Public
exports.register = fn(async (req, res, next) => {
  const { username, email, password } = req.body;
});

// @route   POST api/v1/auth/sign-in
// @desc    Authenticate user & get token
// @access  Public
exports.login = fn(async (req, res, next) => {
  const { email, password } = req.body;
  // Check if user exists
  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new AppError("Invalid credentials", 400));
  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return next(new AppError("Invalid credentials", 400));
  // Create JWT token
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  // Create refresh token
  //   const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
  //     expiresIn: "24h",
  //   });
  // user.refreshToken = refreshToken;
  jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "24h" },
    (err, refreshToken) => {
      if (err) throw err;
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }
  );
  user.active = true;
  user.isOnline = "online";
  user.last_login = new Date();
  await user.save();
  res.json({
    status: "success",
    message: "Logged in successfully",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});
