exports.handler = (app) => {
  app.use("/api/v1/categories", require("./categoryRoutes"));
};
