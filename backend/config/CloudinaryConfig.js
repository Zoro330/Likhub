const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Endpoint to handle signed uploads
app.post("/api/upload", async (req, res) => {
    try {
        const file = req.files.image; // Assuming you're using `express-fileupload`
        const result = await cloudinary.uploader.upload(file.tempFilePath);
        res.json({ imageUrl: result.secure_url });
    } catch (error) {
        res.status(500).json({ error: "Image upload failed" });
    }
});
