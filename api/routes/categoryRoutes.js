const express = require("express");
const router = express.Router();

const { isAdmin, JWTauth } = require("../middleware/auth");
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

router
  .route("/")
  .post([JWTauth, isAdmin], validateCategory, createCategory)
  .get(getAllCategories);

router
  .route("/:id")
  .delete([JWTauth, isAdmin], validateCategoryId, deleteCategory)
  .get(getCategoryById)
  .patch([JWTauth, isAdmin], validateCategoryId, updateCategory);

module.exports = router;
