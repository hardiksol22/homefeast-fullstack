const express = require('express');
const router = express.Router();
const { getPendingCooks, approveCook } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// Admin Security Middleware (Guard)
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

// Admin Routes
router.get('/cooks/pending', protect, isAdmin, getPendingCooks);
router.put('/cooks/:id/approve', protect, isAdmin, approveCook);

module.exports = router;