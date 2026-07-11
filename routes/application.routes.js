const express = require('express');
const router = express.Router();
const {
  applyToInternship,
  getMyApplications,
  getApplicantsForInternship,
  updateApplicationStatus,
} = require('../controllers/application.controller');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Student routes
router.post('/', protect, authorize('student'), upload.single('resume'), applyToInternship);
router.get('/my', protect, authorize('student'), getMyApplications);

// Company routes
router.get('/internship/:id', protect, authorize('company'), getApplicantsForInternship);
router.put('/:id/status', protect, authorize('company'), updateApplicationStatus);

module.exports = router;
