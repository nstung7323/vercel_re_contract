const mongoose = require("mongoose");

const RoomDetailSchema = new mongoose.Schema({
  room_overview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoomOverview",
    required: true,
  },
  description: { type: String, require: false },
});

module.exports = mongoose.model("RoomDetail", RoomDetailSchema);
