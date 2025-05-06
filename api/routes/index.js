exports.handler = (app) => {
  app.use("/api/v1/auth", require("./authRoutes"));
  app.use("/api/v1/categories", require("./categoryRoutes"));
  app.use("/api/v1/users", require("./userRoutes"));
  app.use("/api/v1/brands", require("./brandRoutes"));
  // app.use("/api/v1/products", require("./productRoutes"));
  // app.use("/api/v1/s", require("./"));
  // app.use("/api/v1/s", require("./"));
  // app.use("/api/v1/s", require("./"));
  // app.use("/api/v1/s", require("./"));
  // app.use("/api/v1/s", require("./"));
};
