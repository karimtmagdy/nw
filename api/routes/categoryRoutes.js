const express = require("express");
const router = express.Router();

const { isAdmin, authorize } = require("../middleware/auth");
const {
  createCategory,
  deleteCategory,
  getCategoryById,
  getAllCategories,
  updateCategory,
} = require("../services/category.service");
const {
  validateCategory,
  validateCategoryId,
} = require("../validator/category.validate");
const { validID } = require("../middleware/validate");

router
  .route("/")
  .post([authorize, isAdmin], validateCategory, createCategory)
  .get(getAllCategories);

router
  .route("/:id")
  .delete([authorize, isAdmin], validateCategoryId, deleteCategory)
  .get(validID, getCategoryById)
  .patch([authorize, isAdmin], validateCategoryId, updateCategory);

module.exports = router;
