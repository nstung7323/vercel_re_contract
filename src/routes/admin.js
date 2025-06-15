const express = require("express");
const router = express.Router();
const adminController = require("../controller/AdminController");

router.post("/login", adminController.login);
router.post("/resetPassword", adminController.resetPassword);
router.post("/updatePassword", adminController.updatePassword);
router.post("/update", adminController.update);

module.exports = router;
