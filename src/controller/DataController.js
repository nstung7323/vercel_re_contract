const RoomCategory = require("../models/RoomCategory");
const RoomOverview = require("../models/RoomOverview");
const RoomDetail = require("../models/RoomDetail");
const TypeImage = require("../models/TypeImage");
const Image = require("../models/Image");
const BaseResponse = require("../config/response");
const Utils = require("../config/utils");

require("dotenv").config();
const TYPE_IMAGE = process.env.TYPE_IMAGE;
const TYPE_IMAGE_ROOM = process.env.TYPE_IMAGE_ROOM;

class DataController {
  // [POST] /data/getAllRoom
  async getAllRoomDetail(req, res) {
    try {
      const categories = await RoomCategory.find();

      const data = await Promise.all(
        categories.map(async (category) => {
          const overviews = await RoomOverview.find({
            room_category: category._id,
          }).lean();

          const overviewsWithDetail = await Promise.all(
            overviews.map(async (overview) => {
              const detail = await RoomDetail.findOne({
                room_overview: overview._id,
              }).lean();

              const images = await Image.find({
                room_detail: detail._id,
              }).lean();
              console.log(detail._id);
              console.log(images);

              detail.images = [...images.map((i) => i.link), overview.image];

              return { ...overview, detail };
            })
          );

          return {
            category,
            overviews: overviewsWithDetail,
          };
        })
      );

      return res.json(BaseResponse.success(0, data));
    } catch (err) {
      return res.json(BaseResponse.fail("S500", `Error: ${err.message}`));
    }
  }

  // [POST] /data/getAllImage
  async getAllImage(req, res) {
    try {
      console.log(TYPE_IMAGE_ROOM);
      const types = await TypeImage.find({
        type: { $in: [TYPE_IMAGE, TYPE_IMAGE_ROOM] },
      }).lean();
      console.log(types);

      const data = await Promise.all(
        types.map(async (type) => {
          const images = await Image.find({ type: type._id }).lean();
          const urls = images.map((img) => img.link);
          return {
            [type.name || type._id]: urls,
          };
        })
      );

      return res.json(BaseResponse.success(0, data));
    } catch (err) {
      return res.json(BaseResponse.fail("S500", `Error: ${err.message}`));
    }
  }
}

module.exports = new DataController();
