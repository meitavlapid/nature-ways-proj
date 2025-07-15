const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  subtitle: String,
  paragraph: String,
});

const articleSchema = new mongoose.Schema(
  {
    title: String,
    summary: String,
    image: String,
    sections: [{ subtitle: String, paragraph: String }],
    conclusion: String,
    bibliography: String,
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
