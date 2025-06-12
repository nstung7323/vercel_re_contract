const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TypeImage", 
    required: false,
  },
  room_detail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoomDetail",
    required: false,
  },
  package_detail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
    required: false,
  },
  link: { type: String, require: true },
});

module.exports = mongoose.model("Image", ImageSchema);
