const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    key: String,
    url: String,
    public_id: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", imageSchema);
