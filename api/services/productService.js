import { Product } from "../schema/product.model.js";
import slugify from "slugify";
import { fn, getPagination } from "../lib/utils.js";

export const createProduct = fn(async (req, res) => {
  const {
    name,
    description,
    price,
    quantity,
    image,
    category,
    brand,
    subcategory,
  } = req.body;

  const product = await Product.create({
    name,
    description,
    price,
    quantity,
    image,
    slug: slugify(name),
    category,
    brand,
    subcategory,
  });
  if (product) return res.status(201).json({ status: "success", product });
});

export const getProducts = fn(async (req, res) => {
  const total = await Product.countDocuments();
  const { page, limit, skip } = getPagination(total, req.query);
  const pages = Math.ceil(total / limit);
  const products = await Product.find().skip(skip).limit(limit).exec();
  if (!products) return res.status(404).json({ message: "products not found" });
  const results = total;
  return res
    .status(200)
    .json({ status: "success", results, page, pages, products });
});

export const getSingleProduct = fn(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById({ _id: id }).exec();
  if (!product) return res.status(404).json({ message: "product not found" });
  return res.status(200).json({ status: "success", product });
});

export const updateProduct = fn(async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity, image, category } = req.body;
  const updates = {};
  if (name) updates.name = name;
  if (description) updates.description = description;
  if (price) updates.price = price;
  if (quantity) updates.quantity = quantity;
  if (image) updates.image = image;
  if (category) updates.category = category;
  if (slug) updates.slug = slugify(name);
  const product = await Product.findByIdAndUpdate(
    { _id: id },
    { $set: updates },
    { new: true }
  );
  if (!product) return res.status(404).json({ message: "product not found" });
  return res.status(200).json({
    status: "success",
    product,
    message: "product updated successfully",
  });
});

export const deleteProduct = fn(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete({ _id: id });
  if (!product) return res.status(404).json({ message: "product not found" });
  return res
    .status(200)
    .json({ status: "success", message: "product deleted successfully" });
});
