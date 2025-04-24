const mongoose = require("mongoose");

exports.connectDB = () => {
  // Connect to MongoDB
  const MONGODB_URI = process.env.MONGO_URI;
  const db = process.env.DB_PASSWORD;
  mongoose
    .connect(MONGODB_URI.replace("<PASSWORD>", String(db)), {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error("MongoDB connection error:", err));
};
