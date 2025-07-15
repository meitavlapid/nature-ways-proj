const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Video", videoSchema);
