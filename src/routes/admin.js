const express = require("express");
const router = express.Router();
const adminController = require("../controller/AdminController");

router.post("/login", adminController.login);
router.post("/resetPassword", adminController.resetPassword);
router.post("/updatePassword", adminController.updatePassword);

module.exports = router;
