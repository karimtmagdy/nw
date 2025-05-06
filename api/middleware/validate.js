const { isValidObjectId } = require("mongoose");
const { AppError } = require("./errorHandler");
const { z } = require("zod");
exports.validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
};

exports.validID = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(new AppError("invalid id", 400));
  }
  next();
};
