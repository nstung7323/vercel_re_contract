const PackageOverview = require("../models/PackageOverview");
const Package = require("../models/Package");
const Image = require("../models/Image");
const BaseResponse = require("../config/response");
const Utils = require("../config/utils");
const Constance = require("../config/constance");
const imgbbUploader = require("imgbb-uploader");

require("dotenv").config();
const API_KEY_IMGBB = process.env.API_KEY_IMGBB;

class PackageController {
  // [POST] /packages
  async addPackage(req, res) {
    const requestBody = req.body;
    const requestFile = req.files;
    if (!Utils.isEmpty(requestBody) && !Utils.isEmpty(requestFile)) {
      const { overviewId, content } = requestBody;

      if (Utils.isEmpty(overviewId)) {
        return res.json(
          BaseResponse.success(1, "Package overview cannot empty")
        );
      } else if (!Utils.checkTypeId(overviewId)) {
        return res.json(
          BaseResponse.success(1, "Package overview incorrect format")
        );
      }
      const exitsPackageOverview = await PackageOverview.findOne({
        _id: overviewId,
      });
      if (!exitsPackageOverview) {
        return res.json(BaseResponse.success(1, "Package overview not found"));
      } else if (Utils.isEmpty(content)) {
        return res.json(
          BaseResponse.success(1, "Content package cannot empty")
        );
      }

      const pack = new Package({
        package_overview: overviewId,
        content,
      });

      try {
        const response = await pack.save();

        if (!Utils.isEmpty(requestFile)) {
          const uploadPromises = requestFile.map((file) =>
            imgbbUploader({
              apiKey: API_KEY_IMGBB,
              base64string: file.buffer.toString("base64"),
            })
          );
          const results = await Promise.all(uploadPromises);
          const urls = results.map((r) => r.display_url);

          await Promise.all(
            urls.map((url) =>
              Image.create({
                package_detail: response._id,
                link: url,
              })
            )
          );
        }

        return res.json(BaseResponse.success(0, response));
      } catch (err) {
        return res.json(
          BaseResponse.fail("S500", `Process have error: ${err}`)
        );
      }
    }
    return res.json(BaseResponse.fail("S099", "Request is missing!"));
  }
}

module.exports = new PackageController();
