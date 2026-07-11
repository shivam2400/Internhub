const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/student.controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('student'));
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;
