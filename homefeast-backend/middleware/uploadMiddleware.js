const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// 1. Configure Cloudinary with your .env keys
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Setup Storage Engine for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'homefeast_images', // Cloudinary mein is naam ka ek folder ban jayega
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Sirf images allowed hain
    transformation: [{ width: 800, height: 800, crop: 'limit' }] // Image size optimize karne ke liye
  }
});

// 3. Initialize Multer
const upload = multer({ storage: storage });

module.exports = upload;