const express = require("express");
const router = express.Router();
const imageController = require("../controller/ImageController");
const Utils = require("../config/utils");
const upload = Utils.uploadImageV2();

router.post("/", upload.array("images", 6), imageController.addImage);

module.exports = router;
