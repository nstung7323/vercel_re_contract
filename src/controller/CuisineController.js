const Cuisine = require("../models/Cuisine");
const TypeImage = require("../models/TypeImage");
const Image = require("../models/Image");
const BaseResponse = require("../config/response");
const Utils = require("../config/utils");
const imgbbUploader = require("imgbb-uploader");

require("dotenv").config();
const API_KEY_IMGBB = process.env.API_KEY_IMGBB;

class CuisineController {
  // [POST] /cuisines
  async addCuisine(req, res) {
    const requestBody = req.body;
    const requestFile = req.file;
    if (!Utils.isEmpty(requestBody) && !Utils.isEmpty(requestFile)) {
      const { name, price } = requestBody;
      const buffer = requestFile.buffer;

      if (Utils.isEmpty(name)) {
        return res.json(
          BaseResponse.success(1, "Name category of room cannot empty")
        );
      } else if (Utils.isEmpty(price)) {
        return res.json(BaseResponse.success(1, "Price cannot empty"));
      } else if (isNaN(price)) {
        return res.json(BaseResponse.success(1, "Price is not a number"));
      } else if (price < 0) {
        return res.json(
          BaseResponse.success(1, "Price cannot be lessthan zero")
        );
      } else if (Utils.isEmpty(buffer)) {
        return res.json(BaseResponse.success(1, "Image is missing"));
      }

      const cuisine = new Cuisine({
        name,
        price,
      });
      //   let typeImage = await TypeImage.findOne({ type: TYPE_IMAGE_CUISINE });
      //   try {
      //     if (!typeImage) {
      //       typeImage = new TypeImage({
      //         name: "Cuisine",
      //         type: TYPE_IMAGE_CUISINE,
      //       });
      //       typeImage = await typeImage.save();
      //     } else {
      //     }
      //   } catch (err) {
      //     return res.json(
      //       BaseResponse.fail("S500", `Create type image error: ${err}`)
      //     );
      //   }

      //   const image = new Image({
      //     type: typeImage._id
      //   })
      try {
        const response = await imgbbUploader({
          apiKey: API_KEY_IMGBB,
          base64string: buffer.toString("base64"),
        });
        cuisine.image = response.display_url;
      } catch (err) {
        return res.json(
          BaseResponse.fail("S500", `IMGBB upload image error ${err}`)
        );
      }

      try {
        await cuisine.save();

        return res.json(BaseResponse.success(0, cuisine));
      } catch (err) {
        return res.json(BaseResponse.fail("S500", `Add fail: ${err}`));
      }
    }
    return res.json(BaseResponse.fail("S099", "Request is missing!"));
  }
}

module.exports = new CuisineController();
