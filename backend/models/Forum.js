const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    userProfilePic: { type: String, default: "" },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const forumSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    userProfilePic: { type: String, default: "" },
    likes: { type: [String], default: [] },
    comments: [commentSchema]
}, { 
    timestamps: true 
});

module.exports = mongoose.model("Forum", forumSchema); 