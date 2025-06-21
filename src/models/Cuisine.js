const mongoose = require("mongoose");
require("dotenv").config();
const TYPE_VISIBLE = process.env.TYPE_VISIBLE;

const CuisineSchema = new mongoose.Schema({
  name: { type: String, require: true },
  price: { type: Number, require: true },
  image: { type: String, require: true },
  visible: { type: Number, require: false, default: Number(TYPE_VISIBLE) },
});

module.exports = mongoose.model("Cuisine", CuisineSchema);
