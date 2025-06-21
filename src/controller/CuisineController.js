const Cuisine = require("../models/Cuisine");
const TypeImage = require("../models/TypeImage");
const Image = require("../models/Image");
const BaseResponse = require("../config/response");
const Utils = require("../config/utils");
const imgbbUploader = require("imgbb-uploader");
const mongoose = require("mongoose");

require("dotenv").config();
const API_KEY_IMGBB = process.env.API_KEY_IMGBB;
const TYPE_GONE = process.env.TYPE_GONE;

class CuisineController {
  // [POST] /cuisines
  async addCuisine(req, res) {
    const requestBody = req.body;
    const requestFile = req.file;
    if (!Utils.isEmpty(requestBody) && !Utils.isEmpty(requestFile)) {
      const { name, price } = requestBody;
      const buffer = requestFile.buffer;

      if (Utils.isEmpty(name)) {
        return res.json(BaseResponse.success(1, "Name cannot empty"));
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

  // [POST] /cuisines/udpate
  async updateCuisine(req, res) {
    const requestBody = req.body;
    const requestFile = req.file;
    if (!Utils.isEmpty(requestBody) || !Utils.isEmpty(requestFile)) {
      const { id, name, price } = requestBody;
      const buffer = requestFile?.buffer;

      if (Utils.isEmpty(id)) {
        return res.json(BaseResponse.success(1, "Cuisine cannot empty"));
      } else if (!Utils.checkTypeId(id)) {
        return res.json(BaseResponse.success(1, "Cuisine incorrect format"));
      }
      const exitsCuisine = await Cuisine.findOne({
        _id: id,
      });
      if (!exitsCuisine) {
        return res.json(BaseResponse.success(1, "Cuisine not found"));
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
        await Cuisine.updateOne(
          { _id: new mongoose.Types.ObjectId(id) },
          { $set: data }
        );
        return res.json(BaseResponse.success(0, `Update successfully`));
      } catch (err) {
        return res.json(BaseResponse.fail("S500", `Update error: ${err}`));
      }
    }
    return res.json(BaseResponse.fail("S099", "Request is missing!"));
  }

  // [POST] /cuisines/delete
  async deleteCuisine(req, res) {
    const requestBody = req.body;
    if (!Utils.isEmpty(requestBody)) {
      const { id } = requestBody;

      if (Utils.isEmpty(id)) {
        return res.json(BaseResponse.success(1, "Cuisine cannot empty"));
      } else if (!Utils.checkTypeId(id)) {
        return res.json(BaseResponse.success(1, "Cuisine incorrect format"));
      }
      const exitsCuisine = await Cuisine.findOne({
        _id: id,
      });
      if (!exitsCuisine) {
        return res.json(BaseResponse.success(1, "Cuisine not found"));
      }

      try {
        await Cuisine.findOneAndUpdate(
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
    return res.json(BaseResponse.fail("S099", "Request not found!"));
  }
}

module.exports = new CuisineController();
