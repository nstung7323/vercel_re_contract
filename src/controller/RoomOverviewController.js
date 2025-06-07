const RoomOverview = require("../models/RoomOverview");
const BaseResponse = require("../config/response");
const Utils = require("../config/utils");
const Constance = require("../config/constance");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

require("dotenv").config();
const API_URL_LOCAL = process.env.API_URL_LOCAL;
const API_URL_PRODUCT = process.env.API_URL_PRODUCT;

class RoomOverviewController {
  // [POST] /roomOverviews
  async addOverview(req, res) {
    const requestBody = req.body;
    const requestFile = req.file;
    if (!Utils.isEmpty(requestBody) || !Utils.isEmpty(requestFile)) {
      const userId = req.user.id;
      const { name, price, time, description } = requestBody;

      if (Utils.isEmpty(name)) {
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
      }

      const link = "/upload/" + requestFile?.filename;
      const url =
        (Constance.ENVIROMENT == "DEV" ? API_URL_LOCAL : API_URL_PRODUCT) +
        link;

      const overview = new RoomOverview({
        name,
        price,
        time,
        description,
      });
      if (!Utils.isEmpty(requestFile?.filename)) {
        overview.image = url;
      }
      await overview.save();

      return res.json(BaseResponse.success(0, overview));
    }
    return res.json(BaseResponse.fail("S099", "Request not found!"));
  }
}

module.exports = new RoomOverviewController();
