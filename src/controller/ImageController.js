const Image = require("../models/Image");
const TypeImage = require("../models/TypeImage");
const BaseResponse = require("../config/response");
const Utils = require("../config/utils");
const imgbbUploader = require("imgbb-uploader");

require("dotenv").config();
const API_KEY_IMGBB = process.env.API_KEY_IMGBB;

class ImageController {
  // [POST] /image/
  async addImage(req, res) {
    const requestBody = req.body;
    const requestFile = req.files;
    if (!Utils.isEmpty(requestBody) && !Utils.isEmpty(requestFile)) {
      const { type } = requestBody;

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
            Image.create({
              type: exitsTypeImage._id,
              link: url,
            });
          })
        );

        return res.json(BaseResponse.success(0, "Add successfully"));
      } catch (err) {
        return res.json(BaseResponse.fail("S500", `Add fail: ${err}`));
      }
    }
    return res.json(BaseResponse.fail("S099", "Request is missing!"));
  }
}

module.exports = new ImageController();
