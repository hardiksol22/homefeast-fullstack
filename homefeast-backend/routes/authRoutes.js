const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Routes ko controller functions se connect kiya gaya hai
router.post('/register', register);
router.post('/login', login);

module.exports = router;