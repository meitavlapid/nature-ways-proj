const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: "" },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    position: { type: String }, 
    phone: String,
    interests: [String],
    source: { type: String, default: "registration" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
