const express = require('express');
const router = express.Router();
const { logMood, getMoods } = require('../controllers/moodController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, logMood);
router.get('/', authMiddleware, getMoods);

module.exports = router;