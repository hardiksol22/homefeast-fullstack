const express = require('express');
const router = express.Router();
const { addMenuItem, getMyMenu, getProviderMenu } = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // <--- 1. UPLOAD MIDDLEWARE IMPORT KIYA

// 2. Route mein 'upload.single("image")' add kiya
router.post('/', protect, upload.single('image'), addMenuItem); 

router.get('/my-menu', protect, getMyMenu);
router.get('/:cookId', getProviderMenu);

module.exports = router;