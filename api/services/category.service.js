const { Category } = require("../models/Category");
const { fn, paginate } = require("../lib/utils");

// @route   POST api/v1/categories
// @desc    Create a category
// @access  Private/Admin
exports.createCategory = fn(async (req, res) => {
  const { name } = req.body;
  // Check if category already exists
  let category = await Category.findOne({ name });
  if (category) {
    return res.status(400).json({ msg: "Category already exists" });
  }
  category = await Category.create({ name });

  await category.save();
  res.status(201).json({
    message: "category created successfully",
    status: "success",
    category,
  });
});
// @route   GET api/v1/categories
// @desc    Get all categories
// @access  Public
exports.getAllCategories = fn(async (req, res) => {
  // const categories = await Category.find({});
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const result = await paginate(Category, req.query, page, limit, {
      isActive: true,
  });
  result.categories = result.data;
  delete result.data;
  res.status(200).json(result);
});

// @route   PUT api/v1/categories/:id
// @desc    Update a category
// @access  Private/Admin
exports.updateCategory = fn(async (req, res, next) => {
  const { name, description, image, isActive } = req.body;
  // Build category object
  const categoryFields = {};
  if (name) categoryFields.name = name;
  if (description) categoryFields.description = description;
  if (image) categoryFields.image = image;
  if (isActive !== undefined) categoryFields.isActive = isActive;

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { $set: categoryFields },
    { new: true, runValidators: true }
  );
  if (!category) {
    return res.status(404).json({ msg: "Category not found" });
  }
  // const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
  //   new: true,
  //   runValidators: true,
  // });
  // if (!category) {
  //   return next(new AppError("Category not found", 404));
  // }
  res.status(200).json({
    status: "success",
    data: category,
  });
});

// @route   GET api/v1/categories/:id
// @desc    Get category by ID
// @access  Public
exports.getCategoryById = fn(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    //   return next(new AppError("Category not found", 404));
    return res.status(404).json({ msg: "Category not found" });
  }
  res.status(200).json({
    status: "success",
    category,
  });
});

// @route   DELETE api/v1/categories/:id
// @desc    Delete a category
// @access  Private/Admin
exports.deleteCategory = fn(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return res.status(404).json({ msg: "Category not found" });
    //   return next(new AppError("Category not found", 404));
  }
  //   if (err.kind === "ObjectId") {
  //     return res.status(404).json({ msg: "Category not found" });
  //   }
  await category.remove();
  res.status(200).json({
    status: "success",
    msg: "Category removed",
  });
});
