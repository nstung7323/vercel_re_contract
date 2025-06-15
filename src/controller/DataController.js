const RoomCategory = require("../models/RoomCategory");
const RoomOverview = require("../models/RoomOverview");
const RoomDetail = require("../models/RoomDetail");
const TypeImage = require("../models/TypeImage");
const Image = require("../models/Image");
const Cuisine = require("../models/Cuisine");
const PackageOverview = require("../models/PackageOverview");
const Package = require("../models/Package");
const BaseResponse = require("../config/response");
const Utils = require("../config/utils");

require("dotenv").config();
const TYPE_IMAGE = process.env.TYPE_IMAGE;
const TYPE_IMAGE_ROOM = process.env.TYPE_IMAGE_ROOM;
const TYPE_VISIBLE = process.env.TYPE_VISIBLE;

class DataController {
  // [POST] /data/getAllRoom
  async getAllRoomDetail(req, res) {
    try {
      const categories = await RoomCategory.find();

      const data = await Promise.all(
        categories.map(async (category) => {
          const overviews = await RoomOverview.find({
            room_category: category._id,
            visible: TYPE_VISIBLE,
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
      const types = await TypeImage.find({
        type: { $in: [TYPE_IMAGE, TYPE_IMAGE_ROOM] },
      }).lean();
      console.log(types);

      const all = [];
      const data = await Promise.all(
        types.map(async (type) => {
          const images = await Image.find({
            type: type._id,
            visible: Number(TYPE_VISIBLE),
          }).lean();
          const urls = images.map((img) => img.link);
          urls.forEach((url) => {
            all.push(url);
          });
          return {
            [type.name || type._id]: urls,
          };
        })
      );
      data.unshift({
        "Tất cả": all,
      });

      const response = data.map((item) => {
        const name = Object.keys(item)[0];
        return {
          type: name,
          images: item[name],
        };
      });

      return res.json(BaseResponse.success(0, response));
    } catch (err) {
      return res.json(BaseResponse.fail("S500", `Error: ${err.message}`));
    }
  }

  // [POST] /data/getAllCuisine
  async getAllCuisine(req, res) {
    try {
      const cuisines = await Cuisine.find().lean();
      const imageBanner = cuisines.map((item) => item.image);

      return res.json(
        BaseResponse.success(0, {
          cuisines: cuisines,
          banner: imageBanner,
        })
      );
    } catch (err) {
      return res.json(BaseResponse.fail("S500", `Error: ${err.message}`));
    }
  }

  // [POST] /data/getAllPackage
  async getAllPackage(req, res) {
    try {
      const overviews = await PackageOverview.find().lean();

      const data = await Promise.all(
        overviews.map(async (overview) => {
          const pkg = await Package.findOne({
            package_overview: overview._id,
          }).lean();
          const images = await Image.find({ package_detail: pkg?._id }).lean();

          return {
            // title: overview.title,
            // overviewContent: overview.content,
            // overviewImage: overview.image,
            // detail: pkg?.content || "",
            overview,
            detail: {
              content: pkg.content,
              images: images.map((img) => img.link),
            },
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
