const express = require("express");
const router = express.Router();
const roomCategoryController = require("../controller/RoomCategoryController");

router.post("/", roomCategoryController.addCategory);

module.exports = router;
