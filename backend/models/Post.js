const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // Store Cloudinary image URL
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);
