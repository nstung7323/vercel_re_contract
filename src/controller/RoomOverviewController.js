const RoomOverview = require("../models/RoomOverview");
const RoomCategory = require("../models/RoomCategory");
const BaseResponse = require("../config/response");
const Utils = require("../config/utils");
const Constance = require("../config/constance");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const imgbbUploader = require("imgbb-uploader");

require("dotenv").config();
const API_KEY_IMGBB = process.env.API_KEY_IMGBB;

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
}

module.exports = new RoomOverviewController();
