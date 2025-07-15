const mongoose = require("mongoose");

const TeamMemberSchema = new mongoose.Schema({
  name: String,
  role: String,
  bio: String,
  img: String,
});

const AboutPageSchema = new mongoose.Schema({
  paragraphs: [String],
  imageUrl: String,
  teamMembers: [TeamMemberSchema],
  highlights: [String],
  footer: String,
});

module.exports = mongoose.model("About", AboutPageSchema);
