const express = require("express");
const router = express.Router();
const roomDetailController = require("../controller/RoomDetailController");
const Utils = require("../config/utils");
const upload = Utils.uploadImageV2();

router.post("/", upload.array("images", 4), roomDetailController.addRoomDetail);

module.exports = router;
