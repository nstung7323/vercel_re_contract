const express = require("express");
const router = express.Router();
const roomOverViewController = require("../controller/RoomOverviewController");
const Utils = require("../config/utils");
const upload = Utils.uploadImage();

router.post("/", upload.single("image"), roomOverViewController.addOverview);

module.exports = router;
