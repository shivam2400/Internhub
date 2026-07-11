const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/company.controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('company'));
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;
