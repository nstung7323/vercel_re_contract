const adminRouter = require("./admin");
const roomCategoryRouter = require("./roomCategory");
const roomOverviewRouter = require("./roomOverview");
const roomDetailRouter = require("./roomDetail");
const typeImageRouter = require("./typeImage");
const imageRouter = require("./image");
const dataRouter = require("./data");

const router = (app) => {
  app.use("/admin", adminRouter);
  app.use("/roomCategories", roomCategoryRouter);
  app.use("/roomOverviews", roomOverviewRouter);
  app.use("/roomDetails", roomDetailRouter);
  app.use("/typeImage", typeImageRouter);
  app.use("/image", imageRouter);
  app.use("/data", dataRouter);
  app.get("/", (req, res) => {
    res.send("Deploy successfully!");
  });
};

module.exports = router;
