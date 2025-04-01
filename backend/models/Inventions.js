const mongoose = require("mongoose");

const inventionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  userProfilePic: { type: String, default: "" },
  likes: { type: [String], default: [] },
}, { 
  timestamps: true,
  validateModifiedOnly: true // Only validate fields that are being modified
});

const Invention = mongoose.model("Invention", inventionSchema);

module.exports = Invention;
