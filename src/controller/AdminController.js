const Admin = require("../models/Admin");
const BaseResponse = require("../config/response");
const Utils = require("../config/utils");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
const nodemailer = require("nodemailer");

require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;
const MAIL_USERNAME = process.env.MAIL_USERNAME;
const MAIL_PASSWORD = process.env.MAIL_PASSWORD;

class AdminController {
  // [POST] /users/register
  //   async register(req, res) {
  //     const requestBody = req.body;
  //     if (!Utils.isEmpty(requestBody)) {
  //       const username = requestBody.username;
  //       const password = requestBody.password;
  //       const name = requestBody.name;

  //       if (Utils.isEmpty(username)) {
  //         return res.json(BaseResponse.success(1, "Username can not empty"));
  //       } else if (Utils.isEmpty(password)) {
  //         return res.json(BaseResponse.success(1, "Password can not empty"));
  //       } else if (Utils.isEmpty(name)) {
  //         return res.json(BaseResponse.success(1, "Name can not empty"));
  //       }

  //       const existUser = await User.findOne({ username: username });
  //       if (existUser) {
  //         return res.json(
  //           BaseResponse.success(1, `Username ${username} is exits`)
  //         );
  //       }

  //       const hashedPassword = await bcrypt.hash(password, 10);
  //       const user = new User({
  //         name,
  //         username,
  //         password: hashedPassword,
  //       });
  //       await user.save();

  //       return res.json(BaseResponse.success(0, "Register successfully!"));
  //     }
  //     return res.json(BaseResponse.fail("S099", "Request not found!"));
  //   }

  // [POST] /admins/login
  async login(req, res) {
    const requestBody = req.body;
    if (!Utils.isEmpty(requestBody)) {
      const { email, password } = requestBody;

      if (Utils.isEmpty(email)) {
        return res.json(BaseResponse.success(1, "Email cannot empty"));
      } else if (Utils.isEmpty(email)) {
        return res.json(BaseResponse.success(1, "Email incorrect format"));
      } else if (Utils.isEmpty(password)) {
        return res.json(BaseResponse.success(1, "Password cannot empty"));
      }

      const admin = await Admin.findOne({ email });
      if (admin) {
        const isPasswordCorrect = await bcrypt.compare(
          password,
          admin.password
        );
        if (isPasswordCorrect) {
          const accessToken = jwt.sign(
            { id: admin._id, email: admin.email },
            SECRET_KEY,
            { expiresIn: "7d" }
          );
          return res.json(BaseResponse.success(0, { accessToken, admin }));
        }

        return res.json(BaseResponse.success(1, "Password incorrect"));
      }

      return res.json(BaseResponse.success(1, "Email wrong!"));
    }
    return res.json(BaseResponse.success("S099", "Request not found!"));
  }

  // [PATCH] /users/update
  //   async updateInfo(req, res) {
  //     const requestBody = req.body;
  //     const requestFile = req.file;
  //     if (!Utils.isEmpty(requestBody) || !Utils.isEmpty(requestFile)) {
  //       const userId = req.user.id;
  //       const name = requestBody.name;
  //       const email = requestBody.email;

  //       const link = "/upload/" + requestFile?.filename;
  //       const url = API_URL + link;

  //       const data = {};
  //       if (!Utils.isEmpty(name)) {
  //         data.name = name;
  //       }
  //       if (!Utils.isEmpty(email)) {
  //         if (!Utils.isValidEmail(email)) {
  //           return res.json(BaseResponse.success(1, "Email incorrect format"));
  //         }
  //         data.email = email;
  //       }
  //       if (!Utils.isEmpty(requestFile?.filename)) {
  //         data.avatar = url;
  //       }

  //       await User.updateOne(
  //         { _id: new mongoose.Types.ObjectId(userId) },
  //         { $set: data }
  //       );
  //       return res.json(BaseResponse.success(0, "Update successfully!"));
  //     }

  //     return res.json(BaseResponse.fail("S099", "Request not found!"));
  //   }

  // [POST] admins/resetPassword
  async resetPassword(req, res) {
    const requestBody = req.body;
    if (!Utils.isEmpty(requestBody)) {
      const email = requestBody.email;
      const otp = requestBody.otp;

      if (Utils.isEmpty(email)) {
        return res.json(BaseResponse.success(1, "Email cannot be empty"));
      } else if (!Utils.isValidEmail(email)) {
        return res.json(BaseResponse.success(1, "Email incorrect format"));
      } else if (Utils.isEmpty(otp)) {
        return res.json(BaseResponse.success(1, "OTP cannot be empty"));
      }

      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: MAIL_USERNAME,
            pass: MAIL_PASSWORD,
          },
        });

        await transporter.sendMail(
          Utils.configMail(process.env.MAIL_USERNAME, email, otp)
        );

        return res.json(BaseResponse.success(0, "Email sent successfully!"));
      } catch (err) {
        return res.json(BaseResponse.fail("S500", `Send email fail: ${err}`));
      }
    }

    return res.json(BaseResponse.fail("S099", "Request not found!"));
  }

  // [POST] /users/updatePassword
  async updatePassword(req, res) {
    const requestBody = req.body;
    if (!Utils.isEmpty(requestBody)) {
      const password = requestBody.password;

      if (Utils.isEmpty(password)) {
        return res.json(BaseResponse.success(1, "Password cannot be empty"));
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      try {
        await Admin.findOneAndUpdate(
          {},
          { $set: { password: hashedPassword } }
        );
        return res.json(
          BaseResponse.success(0, "Update password successfully!")
        );
      } catch (err) {
        return res.json(BaseResponse.success(1, "Update password fail!"));
      }
    }

    return res.json(BaseResponse.fail("S099", "Request not found!"));
  }

  // [POST] /admins/update
  async update(req, res) {
    const requestBody = req.body;
    const id = req.admin.id;
    if (!Utils.isEmpty(requestBody)) {
      console.log;
      const {
        email,
        passwordOld,
        passwordNew,
        phone,
        address,
        name,
        zalo,
        facebook,
        instagram,
      } = requestBody;

      if (Utils.isEmpty(passwordOld)) {
        return res.json(
          BaseResponse.success(1, "Old password cannot be empty")
        );
      }

      const admin = await Admin.findOne({ _id: id });
      if (admin) {
        const isPasswordCorrect = await bcrypt.compare(
          passwordOld,
          admin.password
        );
        if (isPasswordCorrect) {
          const data = {};
          if (!Utils.isEmpty(email)) {
            if (!Utils.isValidEmail(email)) {
              return res.json(
                BaseResponse.success(1, "Email incorrect format")
              );
            }
            data.email = email;
          }
          if (!Utils.isEmpty(passwordNew)) {
            const hashedPassword = await bcrypt.hash(passwordNew, 10);
            data.password = hashedPassword;
          }
          if (!Utils.isEmpty(phone)) {
            data.phone = phone;
          }
          if (!Utils.isEmpty(address)) {
            data.address = address;
          }
          if (!Utils.isEmpty(name)) {
            data.name = name;
          }
          if (!Utils.isEmpty(zalo)) {
            data.zalo = zalo;
          }
          if (!Utils.isEmpty(facebook)) {
            data.facebook = facebook;
          }
          if (!Utils.isEmpty(instagram)) {
            data.instagram = instagram;
          }

          try {
            await Admin.updateOne(
              { _id: new mongoose.Types.ObjectId(id) },
              { $set: data }
            );
            return res.json(BaseResponse.success(0, "Update successfully!"));
          } catch (err) {
            return res.json(BaseResponse.fail("S500", `Update error: ${err}`));
          }
        }

        return res.json(BaseResponse.success(1, "Password incorrect"));
      }
      return res.json(BaseResponse.success(1, "Cannot find admin infor!"));
    }

    return res.json(BaseResponse.fail("S099", "Request not found!"));
  }
}

module.exports = new AdminController();
