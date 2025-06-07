const adminRouter = require("./admin");
const roomCategoryRouter = require("./roomCategory");
const roomOverviewRouter = require("./roomOverview");

const router = (app) => {
  app.use("/admin", adminRouter);
  app.use("/roomCategories", roomCategoryRouter);
  app.use("/roomOverviews", roomOverviewRouter);
  app.get("/", (req, res) => {
    res.send("Deploy successfully!");
  });
};

module.exports = router;
