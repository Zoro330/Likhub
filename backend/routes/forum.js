const express = require("express");
const Forum = require("../models/Forum");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Create a forum post
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, description, image, userId, userName, userProfilePic } = req.body;
        
        if (!title || !description || !userId || !userName) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newPost = new Forum({
            title,
            description,
            image,
            userId,
            userName,
            userProfilePic
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error creating forum post:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all forum posts
router.get("/", async (req, res) => {
    try {
        const posts = await Forum.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        console.error("Error fetching forum posts:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Add a comment to a post
router.post("/:id/comments", authMiddleware, async (req, res) => {
    try {
        const { content, userId, userName, userProfilePic } = req.body;
        
        if (!content || !userId || !userName) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const post = await Forum.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.comments.push({
            content,
            userId,
            userName,
            userProfilePic
        });

        await post.save();
        res.status(201).json(post);
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Delete a forum post
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const post = await Forum.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this post" });
        }

        await Forum.findByIdAndDelete(req.params.id);
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting forum post:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Like a forum post
router.patch("/:id/like", authMiddleware, async (req, res) => {
    try {
        const post = await Forum.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const updatedPost = await Forum.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { likes: req.user.id } },
            { new: true }
        );

        res.json(updatedPost);
    } catch (error) {
        console.error("Error liking forum post:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Delete a comment from a post
router.delete("/:postId/comments/:commentId", authMiddleware, async (req, res) => {
    try {
        const post = await Forum.findById(req.params.postId);
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = post.comments.id(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check if user is either the comment author or post author
        if (comment.userId.toString() !== req.user.id && post.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this comment" });
        }

        // Remove the comment using pull
        post.comments = post.comments.filter(comment => comment._id.toString() !== req.params.commentId);
        await post.save();

        res.json(post);
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router; 