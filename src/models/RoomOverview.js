const mongoose = require("mongoose");

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
});

module.exports = mongoose.model("RoomOverview", RoomOverviewSchema);
