const mongoose = require("mongoose");

const RoomCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, require: false}
});

module.exports = mongoose.model("RoomCategory", RoomCategorySchema);