require("dotenv/config");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./api/config/db");

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

connectDB();
// API Routes
app.use("/api/categories", require("./api/routes/categoryRoutes"));
app.use("/api/services", require("./api/routes/serviceRoutes"));
app.use("/api/users", require("./api/routes/userRoutes"));
app.get("/", (req, res) => {
  res.send("Hello from API Express on Vercel");
});
app.get("/api", (req, res) => {
  res.send("API is running");
});
// Create folder structure
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
