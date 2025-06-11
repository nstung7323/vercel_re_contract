const mongoose = require("mongoose");

const TypeImageSchema = new mongoose.Schema({
  name: { type: String, require: false },
  type: { type: String, require: false },
  room_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomCategory",
      required: false,
    },
});

module.exports = mongoose.model("TypeImage", TypeImageSchema);
