const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const slugify = require("slugify");

const GENDER_TYPES = Object.freeze({
  MALE: "male",
  FEMALE: "female",
});
const USER_ROLES = Object.freeze({
  USER: "user",
  ADMIN: "admin",
  MANAGER: "manager",
  MODERATOR: "moderator",
});
const USER_STATUS = Object.freeze({
  ACTIVE: "active",
  INACTIVE: "inactive",
  BANNED: "banned",
  SUSPENDED: "suspended",
});
const ONLINE_STATUS = Object.freeze({
  ONLINE: "online",
  OFFLINE: "offline",
});

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    name: {
      type: Object, // or String, depending on your necessities
      trim: true,
      first_name: { type: String },
      last_name: { type: String },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    age: {
      type: Number,
      sparse: true,
    },
    gender: {
      type: String,
      enum: Object.values(GENDER_TYPES),
      sparse: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
    isOnline: {
      type: String,
      enum: Object.values(ONLINE_STATUS),
      default: ONLINE_STATUS.OFFLINE,
    },
    last_login: {
      type: Date,
      select: false,
      sparse: true,
    },

    refreshToken: String,
    slug: { type: String, lowercase: true, trim: true },
    active: { type: Boolean, default: false },
    phone: { type: Number, default: undefined, sparse: true },
    remember_me: { type: Boolean, default: false, sparse: true },
    verified: { type: Boolean, default: false },
    photo: {
      type: Object,
      url: {
        type: String,
        default:
          "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png",
        // sparse: true,
      },
      public_id: {
        type: String,
        default: undefined,
        sparse: true,
      },
    },
    tags: [{ type: mongoose.Types.ObjectId, ref: "tag", sparse: true }],
    cart: [{ type: mongoose.Types.ObjectId, ref: "cart", sparse: true }],
    orders: [{ type: mongoose.Types.ObjectId, ref: "order", sparse: true }],

    // wishlist: [{ type: Types.ObjectId, ref: "wishlist" }],
    // likes: [{ type: Types.ObjectId, ref: "likes" }],
    // favorite: [{ type: Types.ObjectId, ref: "favorite" }],
    // permission: [{ type: Types.ObjectId, ref: "Permission" }],
  },
  { timestamps: { createdAt: "joinedAt" }, collection: "users" }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
UserSchema.pre("save", function (next) {
  this.slug = slugify(this.username, { lower: true });
  next();
});
const User = mongoose.model("User", UserSchema);

// Export the model for use in other file
module.exports = { User };
// deletedAt: { type: Date, default: null },
// resetPasswordToken: String,
// resetPasswordExpireAt: Date,
// forgotPassword: String,
// forgotPasswordExpiry: Date,
// verificationToken: String,
// verificationTokenExpireAt: Date,
// verifyOtp: { type: String, default: "" },
// verifyOtpExpireAt: { type: Number, default: 0 },
// resetOtp: { type: String, default: "" },
// resetOtpExpireAt: { type: Number, default: 0 },
