const RoomOverview = require("../models/RoomOverview");
const RoomCategory = require("../models/RoomCategory");
const RoomDetail = require("../models/RoomDetail");
const Image = require("../models/Image");
const BaseResponse = require("../config/response");
const Utils = require("../config/utils");
const Constance = require("../config/constance");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const imgbbUploader = require("imgbb-uploader");
const mongoose = require("mongoose");

require("dotenv").config();
const API_KEY_IMGBB = process.env.API_KEY_IMGBB;
const TYPE_GONE = process.env.TYPE_GONE;

class RoomOverviewController {
  // [POST] /roomOverviews
  async addOverview(req, res) {
    const requestBody = req.body;
    const requestFile = req.file;
    if (!Utils.isEmpty(requestBody) && !Utils.isEmpty(requestFile)) {
      const { categoryId, name, price, time, description } = requestBody;
      const buffer = requestFile.buffer;

      if (Utils.isEmpty(categoryId)) {
        return res.json(BaseResponse.success(1, "Room type cannot empty"));
      } else if (!Utils.checkTypeId(categoryId)) {
        return res.json(BaseResponse.success(1, "Room type incorrect format"));
      }
      const exitsRoomType = await RoomCategory.findOne({
        _id: categoryId,
      });
      if (!exitsRoomType) {
        return res.json(BaseResponse.success(1, "Room type not found"));
      } else if (Utils.isEmpty(name)) {
        return res.json(BaseResponse.success(1, "Name room cannot empty"));
      } else if (Utils.isEmpty(price)) {
        return res.json(BaseResponse.success(1, "Room price cannot empty"));
      } else if (isNaN(price)) {
        return res.json(BaseResponse.success(1, "Room price cannot empty"));
      } else if (price < 0) {
        return res.json(
          BaseResponse.success(1, "Room price cannot be lessthan zero")
        );
      } else if (Utils.isEmpty(time)) {
        return res.json(BaseResponse.success(1, "Room time cannot empty"));
      } else if (Utils.isEmpty(description)) {
        return res.json(
          BaseResponse.success(1, "Room description cannot empty")
        );
      } else if (Utils.isEmpty(buffer)) {
        return res.json(BaseResponse.success(1, "Image not found"));
      }

      const overview = new RoomOverview({
        room_category: categoryId,
        name,
        price,
        time,
        description,
      });

      try {
        const response = await imgbbUploader({
          apiKey: API_KEY_IMGBB,
          base64string: buffer.toString("base64"),
        });
        overview.image = response.display_url;
      } catch (err) {
        return res.json(
          BaseResponse.fail("S500", `IMGBB upload image error ${err}`)
        );
      }

      try {
        await overview.save();
        return res.json(BaseResponse.success(0, overview));
      } catch (err) {
        return res.json(BaseResponse.success(1, `Save fail: ${err}`));
      }
    }
    return res.json(BaseResponse.fail("S099", "Request is missing!"));
  }

  // [POST] /roomOverviews/udpate
  async updateOverview(req, res) {
    const requestBody = req.body;
    const requestFile = req.file;
    if (!Utils.isEmpty(requestBody) || !Utils.isEmpty(requestFile)) {
      const { roomId, name, price, time, description } = requestBody;
      const buffer = requestFile?.buffer;

      if (Utils.isEmpty(roomId)) {
        return res.json(BaseResponse.success(1, "Room id cannot empty"));
      } else if (!Utils.checkTypeId(roomId)) {
        return res.json(BaseResponse.success(1, "Room id incorrect format"));
      }
      const exitsRoomOverview = await RoomOverview.findOne({
        _id: roomId,
      });
      if (!exitsRoomOverview) {
        return res.json(BaseResponse.success(1, "Room cannot not found"));
      }
      const data = {};
      if (!Utils.isEmpty(name)) {
        data.name = name;
      }
      if (!Utils.isEmpty(price)) {
        if (isNaN(price)) {
          return res.json(BaseResponse.success(1, "Room price cannot empty"));
        } else if (price < 0) {
          return res.json(
            BaseResponse.success(1, "Room price cannot be lessthan zero")
          );
        }
        data.price = price;
      }
      if (!Utils.isEmpty(time)) {
        data.time = time;
      }
      if (!Utils.isEmpty(description)) {
        data.description = description;
      }
      if (!Utils.isEmpty(buffer)) {
        try {
          const response = await imgbbUploader({
            apiKey: API_KEY_IMGBB,
            base64string: buffer.toString("base64"),
          });
          data.image = response.display_url;
        } catch (err) {
          return res.json(
            BaseResponse.fail("S500", `IMGBB upload image error ${err}`)
          );
        }
      }

      try {
        await RoomOverview.updateOne(
          { _id: new mongoose.Types.ObjectId(roomId) },
          { $set: data }
        );
        return res.json(BaseResponse.success(0, data));
      } catch (err) {
        return res.json(BaseResponse.fail("S500", `Update error: ${err}`));
      }
    }
    return res.json(BaseResponse.fail("S099", "Request is missing!"));
  }

  // [POST] /roomOverviews/delete
  async deleteOverview(req, res) {
    const requestBody = req.body;
    if (!Utils.isEmpty(requestBody)) {
      const { roomId } = requestBody;

      if (Utils.isEmpty(roomId)) {
        return res.json(BaseResponse.success(1, "Room id cannot empty"));
      } else if (!Utils.checkTypeId(roomId)) {
        return res.json(BaseResponse.success(1, "Room id incorrect format"));
      }
      const exitsRoomOverview = await RoomOverview.findOne({
        _id: roomId,
      });
      if (!exitsRoomOverview) {
        return res.json(BaseResponse.success(1, "Room cannot not found"));
      }

      try {
        await RoomOverview.findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(roomId) },
          {
            $set: {
              visible: TYPE_GONE,
            },
          }
        );

        const roomDetails = await RoomDetail.find({
          room_overview: roomId,
        }).lean();
        const roomDetailIds = roomDetails.map((detail) => detail._id);

        await Image.updateMany(
          {
            room_detail: { $in: roomDetailIds },
          },
          {
            $set: {
              visible: TYPE_GONE,
            },
          }
        );

        return res.json(BaseResponse.success(0, "Delete successfully"));
      } catch (err) {
        return res.json(BaseResponse.fail("S500", `Delete error: ${err}`));
      }
    }
    return res.json(BaseResponse.fail("S099", "Request is missing!"));
  }
}

module.exports = new RoomOverviewController();
