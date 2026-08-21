const express = require('express');
const router = express.Router();
const { getAllCooks, addDish, getMenu } = require('../controllers/cookController');
// Dhyan rahe: Aapke paas token verify karne ke liye ek middleware hona chahiye (jaise protect)
const { protect } = require('../middleware/authMiddleware'); 

// 1. Explore page ke liye saare kitchens lana (Bina login ke bhi koi dekh sakta hai)
router.get('/', getAllCooks);

// 2. Cook jab dish add karega (Sirf logged in Cook kar sakta hai, isliye 'protect' lagaya hai)
router.post('/menu', protect, addDish);

// 3. Kisi specific kitchen ka pura Menu (Dishes ki List) lana
router.get('/:cookId/menu', getMenu);

module.exports = router;