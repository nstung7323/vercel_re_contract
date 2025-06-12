const express = require("express");
const router = express.Router();
const packageController = require("../controller/PackageController");
const Utils = require("../config/utils");
const upload = Utils.uploadImageV2();

router.post("/", upload.array("images", 2), packageController.addPackage);

module.exports = router;
