const express = require('express');
const router = express.Router();
const { saveAssessment, getAssessments } = require('../controllers/assessmentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, saveAssessment);
router.get('/', authMiddleware, getAssessments);

module.exports = router;