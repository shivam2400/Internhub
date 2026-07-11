const Application = require('../models/Application');
const Internship = require('../models/Internship');
const path = require('path');

// @POST /api/applications — student applies
const applyToInternship = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Resume PDF is required' });

    const { internshipId, coverLetter } = req.body;
    const internship = await Internship.findById(internshipId);
    if (!internship || !internship.isActive)
      return res.status(404).json({ message: 'Internship not found or closed' });

    const existing = await Application.findOne({
      internship: internshipId,
      student: req.userId,
    });
    if (existing)
      return res.status(400).json({ message: 'You have already applied to this internship' });

    const resumeUrl = `/uploads/${req.file.filename}`;
    const application = await Application.create({
      internship: internshipId,
      student: req.userId,
      resumeUrl,
      coverLetter,
    });

    res.status(201).json(application);
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: 'You have already applied to this internship' });
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/applications/my — student's applications
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.userId })
      .populate({
        path: 'internship',
        select: 'title role location duration stipend',
        populate: { path: 'company', select: 'companyName industry logoUrl' },
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/applications/internship/:id — company views applicants
const getApplicantsForInternship = async (req, res) => {
  try {
    const internship = await Internship.findOne({
      _id: req.params.id,
      company: req.userId,
    });
    if (!internship) return res.status(403).json({ message: 'Unauthorized' });

    const applications = await Application.find({ internship: req.params.id })
      .populate('student', 'name email university skills resumeUrl')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/applications/:id/status — company updates application status
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Accepted', 'Rejected'].includes(status))
      return res.status(400).json({ message: 'Invalid status value' });

    const application = await Application.findById(req.params.id).populate('internship');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (application.internship.company.toString() !== req.userId.toString())
      return res.status(403).json({ message: 'Unauthorized' });

    application.status = status;
    await application.save();
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  applyToInternship,
  getMyApplications,
  getApplicantsForInternship,
  updateApplicationStatus,
};
