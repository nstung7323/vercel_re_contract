const mongoose = require("mongoose");
require("dotenv").config();
const TYPE_VISIBLE = process.env.TYPE_VISIBLE;

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
  visible: { type: Number, require: false, default: Number(TYPE_VISIBLE) },
});

module.exports = mongoose.model("Image", ImageSchema);
