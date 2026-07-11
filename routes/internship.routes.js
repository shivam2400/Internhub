const express = require('express');
const router = express.Router();
const {
  getInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
  getMyInternships,
} = require('../controllers/internship.controller');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getInternships);
router.get('/:id', getInternshipById);

// Company-only routes
router.post('/', protect, authorize('company'), createInternship);
router.get('/company/mine', protect, authorize('company'), getMyInternships);
router.put('/:id', protect, authorize('company'), updateInternship);
router.delete('/:id', protect, authorize('company'), deleteInternship);

module.exports = router;
