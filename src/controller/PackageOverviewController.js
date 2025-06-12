const PackageOverview = require("../models/PackageOverview");
const BaseResponse = require("../config/response");
const Utils = require("../config/utils");
const Constance = require("../config/constance");
const imgbbUploader = require("imgbb-uploader");

require("dotenv").config();
const API_KEY_IMGBB = process.env.API_KEY_IMGBB;

class PackageController {
  // [POST] /roomOverviews
  async addOverview(req, res) {
    const requestBody = req.body;
    const requestFile = req.file;
    if (!Utils.isEmpty(requestBody) && !Utils.isEmpty(requestFile)) {
      const { title, content } = requestBody;
      const buffer = requestFile.buffer;

      if (Utils.isEmpty(title)) {
        return res.json(BaseResponse.success(1, "Title cannot empty"));
      } else if (Utils.isEmpty(content)) {
        return res.json(BaseResponse.success(1, "Content cannot empty"));
      } else if (Utils.isEmpty(buffer)) {
        return res.json(BaseResponse.success(1, "Image not found"));
      }

      const overview = new PackageOverview({
        title,
        content,
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

module.exports = new PackageController();
