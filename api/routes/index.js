exports.handler = (app) => {
  app.use("/api/v1/auth", require("./authRoutes"));
  app.use("/api/v1/categories", require("./categoryRoutes"));
};
