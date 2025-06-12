const express = require("express");
const router = express.Router();
const dataController = require("../controller/DataController");
const Utils = require("../config/utils");
const upload = Utils.uploadImageV2();

router.post("/getAllRoom", dataController.getAllRoomDetail);
router.post("/getAllImage", dataController.getAllImage);
router.post("/getAllCuisine", dataController.getAllCuisine);
router.post("/getAllPackage", dataController.getAllPackage);

module.exports = router;
