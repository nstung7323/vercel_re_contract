const mongoose = require("mongoose");

async function connect(username, password) {
  try {
    mongoose.connect(
      `mongodb+srv://${username}:${password}@coretract.xyt3ocg.mongodb.net/database`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connection to database successful");
  } catch (err) {
    console.log(`Connection to database failed: ${err.message}`);
  }
}

module.exports = { connect };
