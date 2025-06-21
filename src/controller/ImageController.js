const Image = require("../models/Image");
const TypeImage = require("../models/TypeImage");
const RoomDetail = require("../models/RoomDetail");
const BaseResponse = require("../config/response");
const Utils = require("../config/utils");
const imgbbUploader = require("imgbb-uploader");
const mongoose = require("mongoose");

require("dotenv").config();
const API_KEY_IMGBB = process.env.API_KEY_IMGBB;
const TYPE_GONE = process.env.TYPE_GONE;

class ImageController {
  // [POST] /image/
  async addImage(req, res) {
    const requestBody = req.body;
    const requestFile = req.files;
    if (!Utils.isEmpty(requestBody) && !Utils.isEmpty(requestFile)) {
      const { type, imageId, room_detail } = requestBody;

      if (Utils.isEmpty(type)) {
        return res.json(BaseResponse.success(1, "Type image cannot empty"));
      } else if (!Utils.checkTypeId(type)) {
        return res.json(BaseResponse.success(1, "Type iamge incorrect format"));
      }
      const exitsTypeImage = await TypeImage.findOne({
        _id: type,
      });
      if (!exitsTypeImage) {
        return res.json(BaseResponse.success(1, "Type iamge not found"));
      }

      if (!Utils.isEmpty(imageId) && !Utils.isEmpty(room_detail)) {
        if (!Utils.checkTypeId(imageId)) {
          return res.json(BaseResponse.success(1, "Image incorrect format"));
        }
        try {
          const exitsImage = await Image.findOneAndUpdate(
            {
              _id: imageId,
            },
            {
              $set: { visible: Number(TYPE_GONE) },
            }
          );
          if (!exitsImage) {
            return res.json(BaseResponse.success(1, "Image not found"));
          }
        } catch (err) {
          return res.json(BaseResponse.fail("S500", `Update fail: ${err}`));
        }

        if (!Utils.checkTypeId(room_detail)) {
          return res.json(BaseResponse.success(1, "Room incorrect format"));
        }
        const exitsRoom = await RoomDetail.findOne({
          _id: room_detail,
        });
        if (!exitsRoom) {
          return res.json(BaseResponse.success(1, "Room not found"));
        }
      }

      try {
        const uploadPromises = requestFile.map((file) =>
          imgbbUploader({
            apiKey: API_KEY_IMGBB,
            base64string: file.buffer.toString("base64"),
          })
        );
        const results = await Promise.all(uploadPromises);
        const urls = results.map((res) => res.display_url);
        const docs = await Promise.all(
          urls.map((url) => {
            const imageData = {
              type: exitsTypeImage._id,
              link: url,
            };
            console.log(imageId);
            if (!Utils.isEmpty(imageId) && !Utils.isEmpty(room_detail)) {
              console.log(imageId);
              imageData.room_detail = new mongoose.Types.ObjectId(room_detail);
            }
            Image.create(imageData);
          })
        );

        return res.json(BaseResponse.success(0, "Add successfully"));
      } catch (err) {
        return res.json(BaseResponse.fail("S500", `Add fail: ${err}`));
      }
    }
    return res.json(BaseResponse.fail("S099", "Request is missing!"));
  }

  // [POST] /image/delete
  async deleteImage(req, res) {
    const requestBody = req.body;
    if (!Utils.isEmpty(requestBody)) {
      const { id } = requestBody;

      if (Utils.isEmpty(id)) {
        return res.json(BaseResponse.success(1, "Image cannot empty"));
      } else if (!Utils.checkTypeId(id)) {
        return res.json(BaseResponse.success(1, "Iamge incorrect format"));
      }
      const exitsImage = await Image.findOne({
        _id: id,
      });
      if (!exitsImage) {
        return res.json(BaseResponse.success(1, "Iamge not found"));
      }

      try {
        await Image.findOneAndUpdate(
          { _id: id },
          {
            $set: {
              visible: Number(TYPE_GONE),
            },
          }
        );
        return res.json(BaseResponse.success(0, "Delete successfully"));
      } catch (err) {
        return res.json(BaseResponse.fail("S500", `Delete fail: ${err}`));
      }
    }
    return res.json(BaseResponse.fail("S099", "Request is missing!"));
  }
}

module.exports = new ImageController();
