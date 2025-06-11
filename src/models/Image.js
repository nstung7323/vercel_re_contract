const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TypeImage",
    required: true,
  },
  room_detail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoomDetail",
    required: false,
  },
  link: { type: String, require: true },
});

module.exports = mongoose.model("Image", ImageSchema);
