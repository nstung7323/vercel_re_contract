const express = require("express");
const router = express.Router();
const cuisineController = require("../controller/CuisineController");
const Utils = require("../config/utils");
const upload = Utils.uploadImageV2();

router.post("/", upload.single("image"), cuisineController.addCuisine);

module.exports = router;
