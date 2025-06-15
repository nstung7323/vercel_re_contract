const mongoose = require("mongoose");
require("dotenv").config();
const TYPE_VISIBLE = process.env.TYPE_VISIBLE;

const RoomOverviewSchema = new mongoose.Schema({
  room_category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoomCategory",
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, require: true },
  time: { type: String, require: true },
  description: { type: String, require: false },
  image: { type: String, require: true },
  visible: { type: Number, require: false, default: Number(TYPE_VISIBLE) },
});

module.exports = mongoose.model("RoomOverview", RoomOverviewSchema);
