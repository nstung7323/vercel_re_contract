const TypeImage = require("../models/TypeImage");
const BaseResponse = require("../config/response");
const Utils = require("../config/utils");

require("dotenv").config();
const TYPE_IMAGE = process.env.TYPE_IMAGE;

class TypeImageController {
  // [POST] /typeImage/
  async addType(req, res) {
    const requestBody = req.body;
    if (!Utils.isEmpty(requestBody)) {
      const { name } = requestBody;

      if (Utils.isEmpty(name)) {
        return res.json(
          BaseResponse.success(1, "Name type image cannot empty")
        );
      }

      try {
        const type = new TypeImage({
          name,
          type: TYPE_IMAGE,
        });
        await type.save();

        return res.json(BaseResponse.success(0, type));
      } catch (err) {
        return res.json(BaseResponse.fail("S500", `Add fail: ${err}`));
      }
    }
    return res.json(BaseResponse.fail("S099", "Request not found!"));
  }

  //   async addType(req, res) {
  //     const requestBody = req.body;
  //     const requestFile = req.files;
  //     if (!Utils.isEmpty(requestBody) && !Utils.isEmpty(requestFile)) {
  //       const { name } = requestBody;

  //       if (Utils.isEmpty(name)) {
  //         return res.json(
  //           BaseResponse.success(1, "Name type image cannot empty")
  //         );
  //       }

  //       try {
  //         const results = requestFile.map((file) =>
  //           imgbbUploader({
  //             apiKey: API_KEY_IMGBB,
  //             base64string: file.buffer.toString("base64"),
  //           })
  //         );
  //         const urls = results.map((r) => r.display_url);

  //         const category = new TypeImage({
  //           name,
  //           description,
  //         });

  //         return res.json(BaseResponse.success(0, category));
  //       } catch (err) {
  //         return res.json(BaseResponse.fail("S500", `Add fail: ${err}`));
  //       }
  //     }
  //     return res.json(BaseResponse.fail("S099", "Request not found!"));
  //   }
}

module.exports = new TypeImageController();
