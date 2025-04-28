require("dotenv/config");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// const path = require("path");
const { connectDB } = require("./api/config/db");
const { handler } = require("./api/routes");
const { errorHandler, AppError } = require("./api/middleware/errorHandler");
// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

connectDB();
// API Routes
handler(app);
// app.use("/api/services", require("./api/routes/serviceRoutes"));
// app.use("/api/users", require("./api/routes/userRoutes"));
app.get("/", (req, res) => {
  res.send("Hello from API Express on Vercel");
});
app.get("/api", (req, res) => {
  res.send("API is running");
});
// Handle unhandled routes
app.use((req, res, next) => {
  const error = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404
  );
  next(error);
});
// Global error handling middleware (add this after all routes)
app.use(errorHandler);
// Create folder structure
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
