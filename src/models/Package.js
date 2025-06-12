const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema({
  package_overview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PackageOverview",
    required: true,
  },
  content: { type: String, require: true },
});

module.exports = mongoose.model("Package", PackageSchema);
