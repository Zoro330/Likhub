const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Invention = require("../models/Inventions"); 
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "inventions",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

// ✅ Route: Upload Invention
router.post('/create', authMiddleware, async (req, res) => {
  try {
      console.log("📥 Incoming Data:", req.body);

      const { title, description, image, userId, userName, userProfilePic } = req.body;
      if (!title || !description || !image || !userId || !userName) {
          return res.status(400).json({ error: "All fields are required" });
      }

      const newInvention = new Invention({
          title,
          description,
          image,
          userId,
          userName,
          userProfilePic
      });

      await newInvention.save();
      res.status(201).json(newInvention);

  } catch (error) {
      console.error("🔥 Error in /create route:", error);
      res.status(500).json({ error: "Server error" });
  }
});

// Get all inventions
router.get('/', async (req, res) => {
  try {
    const inventions = await Invention.find().sort({ createdAt: -1 });
    res.json(inventions);
  } catch (error) {
    console.error("Error fetching inventions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an invention
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const invention = await Invention.findById(req.params.id);
    
    if (!invention) {
      return res.status(404).json({ message: "Invention not found" });
    }

    if (invention.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this invention" });
    }

    await Invention.findByIdAndDelete(req.params.id);
    res.json({ message: "Invention deleted successfully" });
  } catch (error) {
    console.error("Error deleting invention:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Like an invention
router.patch('/:id/like', authMiddleware, async (req, res) => {
  try {
    const invention = await Invention.findById(req.params.id);
    
    if (!invention) {
      return res.status(404).json({ message: "Invention not found" });
    }

    const updatedInvention = await Invention.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user.id } },
      { new: true }
    );

    res.json(updatedInvention);
  } catch (error) {
    console.error("Error liking invention:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;