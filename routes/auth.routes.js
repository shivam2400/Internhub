const express = require('express');
const router = express.Router();
const { registerStudent, registerCompany, login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

router.post('/register/student', registerStudent);
router.post('/register/company', registerCompany);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
