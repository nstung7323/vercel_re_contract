const mongoose = require("mongoose");

const RoomDetailSchema = new mongoose.Schema({
  room_overview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoomOverview",
    required: true,
  },
  description: { type: String, require: false },
  images: [String],
});

module.exports = mongoose.model("RoomDetail", RoomDetailSchema);
