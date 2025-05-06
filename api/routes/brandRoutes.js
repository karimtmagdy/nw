const express = require("express");
const router = express.Router();

const { isAdmin, authorize } = require("../middleware/auth");

const {
  getAllBrands,
  createBrand,
  deleteBrand,
  updateBrand,
  getSingleBrand,
} = require("../services/brand.service");
const { validID } = require("../middleware/validate");
const {
  validateBrandId,
  validateBrand,
} = require("../validator/brand.validate");

router
  .route("/")
  .post([authorize, isAdmin], validateBrand, createBrand)
  .get(getAllBrands);

router
  .route("/:id")
  .delete([authorize, isAdmin], validateBrandId, deleteBrand)
  .get(validID, getSingleBrand)
  .patch([authorize, isAdmin], validateBrandId, updateBrand);

module.exports = router;
