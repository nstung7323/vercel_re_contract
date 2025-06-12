const adminRouter = require("./admin");
const roomCategoryRouter = require("./roomCategory");
const roomOverviewRouter = require("./roomOverview");
const roomDetailRouter = require("./roomDetail");
const typeImageRouter = require("./typeImage");
const imageRouter = require("./image");
const dataRouter = require("./data");
const cuisineRouter = require("./cuisine");
const packageOverviewRouter = require("./packageOverview");
const packageRouter = require("./package");

const router = (app) => {
  app.use("/admin", adminRouter);
  app.use("/roomCategories", roomCategoryRouter);
  app.use("/roomOverviews", roomOverviewRouter);
  app.use("/roomDetails", roomDetailRouter);
  app.use("/typeImage", typeImageRouter);
  app.use("/image", imageRouter);
  app.use("/data", dataRouter);
  app.use("/cuisines", cuisineRouter);
  app.use("/packageOverview", packageOverviewRouter);
  app.use("/packages", packageRouter);
  app.get("/", (req, res) => {
    res.send("Deploy successfully!");
  });
};

module.exports = router;
