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

router.route("/").post([auth, admin], createCategory).get(getAllCategories);

router
  .route("/:id")
  .delete([auth, admin], deleteCategory)
  .get(getCategoryById)
  .patch([auth, admin], updateCategory);

module.exports = router;
