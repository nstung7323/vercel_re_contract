const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  email: { type: String, require: true },
  password: { type: String, require: true},
  phone: { type: String, require: false },
  address: { type: String, require: false },
  name: { type: String, require: false },
  logo: { type: String, require: false },
  zalo: { type: String, require: false},
  facebook: { type: String, require: false },
  instagram: { type: String, require: false },
});

module.exports = mongoose.model("Admin", AdminSchema);
