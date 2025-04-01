const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const inventionsRoutes = require("./routes/inventions");
const authRoutes = require("./routes/authRoutes");
const forumRoutes = require("./routes/forum");

const app = express();

// ✅ Apply Middleware First
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Correct Route Usage
app.use("/api/inventions", inventionsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/forum", forumRoutes);

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
