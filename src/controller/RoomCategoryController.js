const RoomCategory = require("../models/RoomCategory");
const BaseResponse = require("../config/response");
const Utils = require("../config/utils");

class RoomCategoryController {
  // [POST] /catogories
  async addCategory(req, res) {
    const requestBody = req.body;
    if (!Utils.isEmpty(requestBody)) {
      const userId = req.user.id;
      const { name, description } = requestBody;

      if (Utils.isEmpty(name)) {
        return res.json(
          BaseResponse.success(1, "Name category of room cannot empty")
        );
      }

      const category = new RoomCategory({
        name,
        description,
      });
      await category.save();

      return res.json(BaseResponse.success(0, category));
    }
    return res.json(BaseResponse.fail("S099", "Request not found!"));
  }
}

module.exports = new RoomCategoryController();
