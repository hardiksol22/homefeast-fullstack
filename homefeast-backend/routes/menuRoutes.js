const express = require('express');
const router = express.Router();
const { addMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { protect, isCook } = require('../middleware/authMiddleware');

// Sabhi routes par security guards (protect aur isCook) lagaye gaye hain
router.post('/', protect, isCook, addMenuItem);          // ADD
router.put('/:id', protect, isCook, updateMenuItem);     // UPDATE
router.delete('/:id', protect, isCook, deleteMenuItem);  // DELETE

module.exports = router;