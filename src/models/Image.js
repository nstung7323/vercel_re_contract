const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  link: { type: String, require: true },
  room_category: { type: mongoose.Schema.Types.ObjectId,
    ref: "RoomCategory",
    required: true,},
  phone: { type: String, require: false },
  address: { type: String, require: false },
  name: { type: String, require: false },
  logo: { type: String, require: false },
  zalo: { type: String, require: false},
  facebook: { type: String, require: false },
  instagram: { type: String, require: false },
});

module.exports = mongoose.model("Image", ImageSchema);
