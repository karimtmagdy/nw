import slugify from "slugify";
import { SubCategory } from "../schema/subcategory.model.js";
import { fn, getPagination } from "../lib/utils.js";

export const createSubCategory = fn(async (req, res) => {
  const { name, image, category } = req.body;
  if (!name)
    return res
      .status(400)
      .json({ message: "sub category name field is required" });
  const subcategory = await SubCategory.create({
    name,
    slug: slugify(name),
    image,
    category,
  });
  if (subcategory)
    return res.status(201).json({
      status: "success",
      subcategory,
      message: "sub category created successfully",
    });
});

export const getSubCategories = fn(async (req, res) => {
  const total = await SubCategory.countDocuments();
  const { page, limit, skip } = getPagination(total, req.query);
  const pages = Math.ceil(total / limit);
  const subcategories = await SubCategory.find().skip(skip).limit(limit).exec();
  if (!subcategories)
    return res.status(404).json({ message: "sub categories not found" });
  const results = total;
  res
    .status(200)
    .json({ status: "success", results, page, pages, subcategories });
});

export const getSingleSubCategory = fn(async (req, res) => {
  const { id } = req.params;
  const subcategory = await SubCategory.findById({ _id: id }).exec();
  if (!subcategory)
    return res.status(404).json({ message: "sub category not found" });
  res.status(200).json({ status: "success", subcategory });
});

export const updateSubCategory = fn(async (req, res) => {
  const { id } = req.params;
  const { name, image, category } = req.body;
  if (!name)
    return res
      .status(400)
      .json({ message: "sub category name field is required" });
  const subcategory = await SubCategory.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name), image, category },
    { new: true }
  );
  if (!subcategory)
    return res.status(404).json({ message: "sub category not found" });
  res.status(200).json({
    status: "success",
    subcategory,
    message: "sub category updated successfully",
  });
});

export const deleteSubCategory = fn(async (req, res) => {
  const { id } = req.params;
  const subcategory = await SubCategory.findByIdAndDelete({ _id: id });
  if (!subcategory)
    return res.status(404).json({ message: "sub category not found" });
  res
    .status(200)
    .json({ status: "success", message: "sub category deleted successfully" });
});
