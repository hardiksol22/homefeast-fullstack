const express = require('express');
const router = express.Router();

// Yahan curly brackets {} me exactly wahi naam hone chahiye jo controller se export hue hain!
const { getAllCooks /*, addDish, getMenu */ } = require('../controllers/cookController'); 

// Explore page ke liye API route
router.get('/', getAllCooks);

// Purane routes (Agar hain toh unhe rehne dein)
// router.post('/menu', addDish);
// router.get('/menu', getMenu);

module.exports = router;