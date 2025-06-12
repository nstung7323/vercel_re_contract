const express = require("express");
const router = express.Router();
const packageOverviewController = require("../controller/PackageOverviewController");
const Utils = require("../config/utils");
const upload = Utils.uploadImageV2();

router.post("/", upload.single("image"), packageOverviewController.addOverview);

module.exports = router;
