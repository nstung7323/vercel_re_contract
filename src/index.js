const express = require("express");
const cors = require("cors");
const path = require("path");
const Utils = require("./config/utils");
const db = require("./config/db");
const router = require("./routes/index");
const app = express();
const port = 3000;

app.use((req, res, next) => {
  req.setTimeout(2 * 60 * 1000);
  next();
});
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  express.json({
    limit: "1000mb",
  })
);
app.use(express.urlencoded({ limit: "1000mb", extended: true }));
app.use(Utils.checkToken);

require("dotenv").config();
db.connect(
  process.env.USERNAME_ACCESS_DATABASE,
  process.env.PASSWORD_ACCESS_DATABASE
);

router(app);

app.listen(port, () => {
  console.log("Server listening on port", port);
});

module.exports = app;
