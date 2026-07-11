const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllStudents,
  getAllCompanies,
  toggleVerification,
  deleteUser,
  deleteCompany,
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));
router.get('/stats', getStats);
router.get('/students', getAllStudents);
router.get('/companies', getAllCompanies);
router.put('/companies/:id/verify', toggleVerification);
router.delete('/users/:id', deleteUser);
router.delete('/companies/:id', deleteCompany);

module.exports = router;
