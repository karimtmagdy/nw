const asyncHandler = require("express-async-handler");
const { AppError } = require("../middleware/errorHandler");

exports.fn = (callback) => asyncHandler(callback);
exports.auth = (req, res, next) => {
  const token =
    req.headers.authorization.startsWith("Bearer") &&
    req.headers.authorization.split(" ")[1];
  // Check if no token
  if (!token) return next(new AppError("No token, authorization denied", 401));
  return token;
};
//  new AppError("You are not authorized to perform this action", 403)

exports.paginate = async (
  model,
  query = {},
  page = 1,
  limit = 10,
  filter = {}
) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    model.find(filter).skip(skip).limit(limit),
    model.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    status: "success",
    results: total,
    currentPage: page,
    totalPages,
    itemsPerPage: limit,
    data,
  };
};
