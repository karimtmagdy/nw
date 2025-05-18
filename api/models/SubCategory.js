const { Types, Schema, model } = require("mongoose");

const SubCategorySchema = new Schema(
  {
    name: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
      minlength: 2,
      maxlength: 32,
    },
    image: { type: String },
    description: { type: String },
    slug: { type: String, lowercase: true },
    category: [{ type: Types.ObjectId, ref: "Category", required: true }],
  },
  { timestamps: true, collection: "subcategories" }
);

const SubCategory = model("SubCategory", SubCategorySchema);
module.exports = { SubCategory };
