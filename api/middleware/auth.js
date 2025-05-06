const jwt = require("jsonwebtoken");
const { AppError } = require("./errorHandler");
const { User } = require("../models/User");
const { fn, auth } = require("../lib/utils");
// authorize
module.exports.authorize = fn(async (req, res, next) => {
  // Get token from header
  const token = auth(req);
  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) return next(new AppError("Invalid token", 401));

  const user = await User.findById(decoded._id).select("-password").exec();
  // console.log("decoded", decoded);
  if (!user) return next(new AppError("User not found", 404));
  // Add user from payload
  req.user = decoded;
  next();
});

// Middleware to check if user is an admin
module.exports.isAdmin = fn(async (req, res, next) => {
  // Check user role
  const allowedRoles = ["admin", "manager", "moderator"];
  if (req.user && allowedRoles.includes(req.user.role)) {
    next();
  } else {
    return next(new AppError("Access denied. Admin privileges required", 403));
  }
});
