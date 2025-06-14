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
      req.admin = decoded;
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

  configMail(username, recipientEmail, otp) {
    return {
      from: username,
      to: recipientEmail,
      subject: "Cọ retreat - Bộ phận IT",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Thay đổi mật khẩu</title>
</head>
<body style="margin:0;padding:0;font-family:Helvetica,Arial,sans-serif;line-height:1.6;background:#f4f4f4">
  <table width="100%" bgcolor="#f4f4f4" cellpadding="0" cellspacing="0">
    <tr>
      <td>
        <table align="center" width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="margin:40px auto;padding:20px;border-radius:8px;border:1px solid #ddd">
          <tr>
            <td style="text-align:center;padding-bottom:20px">
              <h1 style="margin:0;color:#00466a">Thay đổi mật khẩu</h1>
            </td>
          </tr>
          <tr>
            <td>
              <p>Xin chào <strong>${recipientEmail}</strong>,</p>
              <p>Bộ phận IT của Cọ Retreat gửi bạn mã OTP để khôi phục mật khẩu. Mã có hiệu lực trong vòng <strong>5 phút</strong>:</p>
              <p style="text-align:center">
                <span style="display:inline-block;background:#00466a;color:#fff;padding:10px 20px;font-size:1.5em;border-radius:6px;letter-spacing:2px;">${otp}</span>
              </p>
              <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p style="font-size:0.9em;color:#555">Trân trọng,<br/>Team IT – Cọ Retreat</p>
            </td>
          </tr>
          <tr>
            <td style="padding-top:20px;border-top:1px solid #eee;font-size:0.8em;color:#888;text-align:center">
              © TungNS Deverloper – Hanoi, Vietnam
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
    };
  }
}

module.exports = new Utils();
