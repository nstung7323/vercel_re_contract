const mongoose = require("mongoose");

const RoomDetailiewSchema = new mongoose.Schema({
  description: { type: String, require: false },
  images: [String],
});

module.exports = mongoose.model("RoomDetailiew", RoomDetailiewSchema);
