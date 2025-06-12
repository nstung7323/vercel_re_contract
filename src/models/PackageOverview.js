const mongoose = require("mongoose");

const PackageOverviewSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, require: true },
  image: { type: String, require: true },
});

module.exports = mongoose.model("PackageOveriew", PackageOverviewSchema);
