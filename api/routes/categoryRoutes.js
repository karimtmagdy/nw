const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
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
  .post([auth, admin], validateCategory, createCategory)
  .get(getAllCategories);

router
  .route("/:id")
  .delete([auth, admin], validateCategoryId, deleteCategory)
  .get(getCategoryById)
  .patch([auth, admin], validateCategoryId, updateCategory);

module.exports = router;
