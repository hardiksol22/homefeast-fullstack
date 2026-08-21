const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Routes with explicit check
if (typeof registerUser !== 'function') {
  console.error("❌ ERROR: registerUser is not a function. Check authController.js exports!");
}

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;