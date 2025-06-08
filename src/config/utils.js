const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Constance = require("./constance");
const BaseResponse = require("./response");

require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

class Utils {
  isEmpty(data) {
    if (data === undefined || data === null) return true;
    if (typeof data === "string") return data.trim() === "";
    if (Array.isArray(data)) return data.length === 0;
    if (typeof data === "object") return Object.keys(data).length === 0;
    return false;
  }

  checkToken(req, res, next) {
    if (Constance.PUBLIC_ROUTERS.includes(req.path)) {
      return next();
    }

    const token = req.headers.authorization;
    if (!token) {
      return res.json(
        BaseResponse.fail("S401", "Access denied. No token provided!")
      );
    }

    try {
      const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
      req.user = decoded;
      next();
    } catch (err) {
      return res.json(BaseResponse.fail("S401", "Invalid or expired token."));
    }
  }

  checkTypeId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }

  isValidDateFormat(dateStr) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) {
      return false;
    }

    const date = new Date(dateStr);
    const [year, month, day] = dateStr.split("-").map(Number);

    return (
      date.getFullYear() === year &&
      date.getMonth() + 1 === month &&
      date.getDate() === day
    );
  }

  isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  uploadImage() {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../public/upload");

        try {
          fs.mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        } catch (err) {
          console.error("Could not create upload directory", err);
          cb(err);
        }
      },
      filename: (_, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        cb(null, `${timestamp}_${file.originalname}`);
      },
    });

    return multer({ storage });
  }

  uploadImageV2() {
    return multer({ storage: multer.memoryStorage() });
  }
}

module.exports = new Utils();
