const express = require('express');
const router = express.Router();
const { getAllCooks, getCookDetails } = require('../controllers/cookController');

// Routes ko controller functions se connect kiya gaya hai
router.get('/', getAllCooks);          // GET request to /api/cooks
router.get('/:id', getCookDetails);    // GET request to /api/cooks/12345 (User ID)

module.exports = router;