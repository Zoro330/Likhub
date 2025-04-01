const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware"); // ✅ Import authentication middleware
const Invention = require("../models/Inventions"); // Fixed import path for Invention model

const router = express.Router();

// 🔹 Signup Route
router.post("/signup", async (req, res) => {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ userName, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "5h" });

        res.status(201).json({ 
            user: { 
                _id: newUser._id,  
                userName: newUser.userName,  
                email: newUser.email 
            }, 
            token 
        });
    } catch (error) {
        console.error("❌ Signup Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 🔹 Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "5h" });

        res.status(200).json({ 
            user: { 
                _id: user._id,
                userName: user.userName,  
                email: user.email,
                profilePic: user.profilePic 
            }, 
            token 
        });
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// 🔹 Update User Name Route (✅ FIXED)
router.put("/update", authMiddleware, async (req, res) => {
    try {
        const { userName, profilePic } = req.body;
        const userId = req.user.id; // Extracted from authMiddleware

        if (!userName) {
            return res.status(400).json({ message: "User name is required" });
        }

        // First update the user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { userName, profilePic },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update all inventions by this user with the new profile picture
        await Invention.updateMany(
            { userId: userId },
            { 
                $set: { 
                    userName: userName,
                    userProfilePic: profilePic || "" // Always update userProfilePic
                }
            }
        );

        // Return the updated user data
        res.json({ 
            message: "User updated successfully", 
            user: {
                _id: updatedUser._id,
                userName: updatedUser.userName,
                email: updatedUser.email,
                profilePic: updatedUser.profilePic
            }
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// 🔹 Get User Data by ID Route
router.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Check if userId is valid
        if (!userId || userId === 'undefined') {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await User.findById(userId).select('userName email profilePic');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
