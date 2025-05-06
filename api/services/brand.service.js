const { Brand } = require("../models/Brand");
const { fn, paginate } = require("../lib/utils");
const { AppError } = require("../middleware/errorHandler");

// @route   POST api/v1/brands
// @desc    Create a brand
// @access  Private/Admin
exports.createBrand = fn(async (req, res, next) => {
  const { name } = req.body;
  // Check if brand already exists
  let brand = await Brand.findOne({ name });
  if (brand) return next(new AppError("brand already exists", 400));
  brand = await Brand.create({ name });
  await brand.save();
  res.status(201).json({
    status: "success",
    message: "brand created successfully",
    brand,
  });
});
// @route   GET api/v1/brands
// @desc    Get all brands
// @access  Public
exports.getAllBrands = fn(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const result = await paginate(Brand, req.query, page, limit, {
    //     isActive: true,
  });
  result.brands = result.data;
  delete result.data;
  if (!result) return next(new AppError("No brands found", 404));
  res.status(200).json(result);
});

// @route   PUT api/v1/brands/:id
// @desc    Update a brand
// @access  Private/Admin
exports.updateBrand = fn(async (req, res, next) => {
  const { name, description, image, isActive } = req.body;
  // Build brand object
  const brandFields = {};
  if (name) brandFields.name = name;
  if (description) brandFields.description = description;
  if (image) brandFields.image = image;
  if (isActive !== undefined) brandFields.isActive = isActive;

  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    { $set: brandFields },
    { new: true, runValidators: true }
  );
  if (!brand) return next(new AppError("brand not found", 404));
  await brand.save();
  res.status(200).json({
    status: "success",
    message: "brand updated successfully",
    brand,
  });
});

// @route   GET api/v1/brands/:id
// @desc    Get brand by ID
// @access  Public
exports.getSingleBrand = fn(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById({ _id: id });
  if (!brand) return next(new AppError("brand not found", 404));
  res.status(200).json({
    status: "success",
    brand,
  });
});

// @route   DELETE api/v1/brands/:id
// @desc    Delete a brand
// @access  Private/Admin
exports.deleteBrand = fn(async (req, res, next) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  if (!brand) return next(new AppError("brand not found", 404));
  res.status(200).json({
    status: "success",
    message: "brand removed",
  });
});
