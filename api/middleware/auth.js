const jwt = require("jsonwebtoken");
const { AppError } = require("./errorHandler");
const { User } = require("../models/User");
const { fn } = require("../lib/utils");

module.exports.JWTauth = fn(async (req, res, next) => {
  // Get token from header
  const auth = req.headers.authorization;
  const token = auth && auth.split(" ")[1];
  // Check if no token
  if (!token) return next(new AppError("No token, authorization denied", 401));
  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) return next(new AppError("Invalid token", 401));
  const user = await User.findById(decoded.id).select("+active");
  if (!user) return next(new AppError("User not found", 404));
  // Add user from payload
  req.user = decoded;
  next();
});

// Middleware to check if user is an admin
module.exports.isAdmin = fn(async (req, res, next) => {
  // Check user role
  const allowedRoles = ["admin", "manager", "moderator"];
  console.log(req.user);
  if (req.user && allowedRoles.includes(req.user.role)) {
    next();
  } else {
    return next(new AppError("Access denied. Admin privileges required", 403));
  }
});
