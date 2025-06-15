const express = require("express");
const router = express.Router();
const roomOverViewController = require("../controller/RoomOverviewController");
const Utils = require("../config/utils");
const upload = Utils.uploadImageV2();

router.post("/", upload.single("image"), roomOverViewController.addOverview);
router.post("/update", upload.single("image"), roomOverViewController.updateOverview);
router.post("/delete", roomOverViewController.deleteOverview);

module.exports = router;
