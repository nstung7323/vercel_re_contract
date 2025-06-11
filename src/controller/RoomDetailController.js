const RoomOverview = require("../models/RoomOverview");
const RoomDetail = require("../models/RoomDetail");
const TypeImage = require("../models/TypeImage");
const Image = require("../models/Image");
const BaseResponse = require("../config/response");
const Utils = require("../config/utils");
const Constance = require("../config/constance");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const imgbbUploader = require("imgbb-uploader");

require("dotenv").config();
const API_KEY_IMGBB = process.env.API_KEY_IMGBB;

class RoomDetailController {
  // [POST] /roomOverviews
  async addRoomDetail(req, res) {
    const requestBody = req.body;
    const requestFile = req.files;
    if (!Utils.isEmpty(requestBody) || !Utils.isEmpty(requestFile)) {
      const { overviewId, description } = requestBody;

      if (Utils.isEmpty(overviewId)) {
        return res.json(BaseResponse.success(1, "Room overview cannot empty"));
      } else if (!Utils.checkTypeId(overviewId)) {
        return res.json(
          BaseResponse.success(1, "Room overview incorrect format")
        );
      }
      const exitsRoomOverview = await RoomOverview.findOne({
        _id: overviewId,
      });
      if (!exitsRoomOverview) {
        return res.json(BaseResponse.success(1, "Room overview not found"));
      } else if (Utils.isEmpty(description)) {
        return res.json(
          BaseResponse.success(1, "Room description cannot empty")
        );
      }

      const detail = new RoomDetail({
        room_overview: overviewId,
        description,
      });

      try {
        if (!Utils.isEmpty(requestFile)) {
          const uploadPromises = requestFile.map((file) =>
            imgbbUploader({
              apiKey: API_KEY_IMGBB,
              base64string: file.buffer.toString("base64"),
            })
          );
          const results = await Promise.all(uploadPromises);
          console.log(results);
          const urls = results.map((r) => r.display_url);
          console.log(urls);
          const typeImage = await TypeImage.findOne({
            room_category: exitsRoomOverview.room_category,
          });
          if (Utils.isEmpty(typeImage)) {
            return res.json(
              BaseResponse.success(1, "Not found category image")
            );
          }
          console.log(exitsRoomOverview.room_category);
          console.log(typeImage);
          const room = await detail.save();
          const docs = await Promise.all(
            urls.map((url) =>
              Image.create({
                type: typeImage._id,
                room_detail: room._id,
                link: url,
              })
            )
          );
        }

        return res.json(BaseResponse.success(0, detail));
      } catch (err) {
        return res.json(
          BaseResponse.fail("S500", `Process have error: ${err}`)
        );
      }
    }
    return res.json(BaseResponse.fail("S099", "Request is missing!"));
  }
}

module.exports = new RoomDetailController();
