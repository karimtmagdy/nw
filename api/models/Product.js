const { Types, Schema, model } = require("mongoose");
const slugify = require("slugify");

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      required: false,
      trim: true,
      minlength: 20,
      maxlength: 1000,
    },
    status: {
      type: String,
      trim: true,
      enum: ["active", "inactive"],
      default: "active",
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      min: 0,
      max: 1000000,
    },
    currency: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 3,
      enum: {
        values: ["USD", "EUR", "GBP", "INR", "EGP", "SAR"],
        message: "Invalid currency format",
      },
      default: "USD",
    },
    quantity: { type: Number, default: 0, required: true },
    slug: { type: String, unique: true, index: true },
    tags: [String],
    colors: [String],
    // sizes: [String],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    Internal: { type: Boolean, default: true },
    publish: { type: Boolean, default: false },
    ratings_count: { type: Number, default: 0 },
    ratings_average: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    cover: { type: String },
    sold: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    images: [{ type: Array, default: [String] }],
    more_details: { type: Object, default: {} },
    unit: { type: String, default: "", sparse: false },
    // favorite: {},
    // wishlist: {},
    // cart: {},
    // views: { type: Number, default: 0 },
    // likes: { type: Number, default: 0 },
    // comments: { type: Number, default: 0 },
    // shares: { type: Number, default: 0 },
    category: [{ type: Types.ObjectId, ref: "Category", required: true }],
    // created_by: [{ type: Types.ObjectId, ref: "User", required: true }],
    subcategory: [{ type: Types.ObjectId, ref: "SubCategory", required: true }],
    brand: [{ type: Types.ObjectId, ref: "Brand", required: true }],
    reviews: [{ type: Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true, collection: "products" }
);
ProductSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
ProductSchema.virtual("stock").get(function () {
  return this.quantity > 0 ? "in stock" : "out of stock";
});
const Product = model("Product", ProductSchema);

// Export the model for use in other file
module.exports = { Product };
// productSchema.virtual("averageRating").get(function () {
//   return this.ratings_average;
// });

// productSchema.virtual("totalRatings").get(function () {
//   return this.ratings_count;
// });

// productSchema.set("toJSON", {
//   versionKey: false,
//   transform: function (doc, ret) {
//     delete ret._id;
//   },
// });
// productSchema.set("toObject", {
//   versionKey: false,
//   transform: function (doc, ret) {
//     delete ret._id;
//     return ret;
//   },
// });
