const express = require("express");
const router = express.Router();
const typeImageController = require("../controller/TypeImageController");

router.post("/getAll", typeImageController.getAllType);
router.post("/", typeImageController.addType);

module.exports = router;
