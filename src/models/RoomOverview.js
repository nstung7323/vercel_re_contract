const mongoose = require("mongoose");

const RoomOverviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, require: true },
  time: { type: String, require: true },
  description: { type: String, require: false },
  image: { type: String, require: false },
});

module.exports = mongoose.model("RoomOverview", RoomOverviewSchema);
