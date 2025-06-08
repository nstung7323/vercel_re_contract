const express = require("express");
const router = express.Router();
const adminController = require("../controller/AdminController");

router.post("/login", adminController.login);

module.exports = router;
