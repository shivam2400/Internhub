const Internship = require('../models/Internship');

// @GET /api/internships — public, with filters
const getInternships = async (req, res) => {
  try {
    const { location, role, duration, search } = req.query;
    const filter = { isActive: true };

    if (location) filter.location = { $regex: location, $options: 'i' };
    if (role) filter.role = { $regex: role, $options: 'i' };
    if (duration) filter.duration = { $regex: duration, $options: 'i' };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const internships = await Internship.find(filter)
      .populate('company', 'companyName industry logoUrl isVerified')
      .sort({ createdAt: -1 });

    res.json(internships);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/internships/:id
const getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id).populate(
      'company',
      'companyName industry website logoUrl isVerified'
    );
    if (!internship) return res.status(404).json({ message: 'Internship not found' });
    res.json(internship);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/internships — company only
const createInternship = async (req, res) => {
  try {
    const { title, description, location, duration, role, skills, stipend, openings } =
      req.body;

    const internship = await Internship.create({
      company: req.userId,
      title,
      description,
      location,
      duration,
      role,
      skills: skills ? (Array.isArray(skills) ? skills : skills.split(',').map((s) => s.trim())) : [],
      stipend,
      openings,
    });

    res.status(201).json(internship);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/internships/:id — company owner
const updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findOne({
      _id: req.params.id,
      company: req.userId,
    });
    if (!internship) return res.status(404).json({ message: 'Internship not found or unauthorized' });

    Object.assign(internship, req.body);
    if (req.body.skills && !Array.isArray(req.body.skills)) {
      internship.skills = req.body.skills.split(',').map((s) => s.trim());
    }
    await internship.save();
    res.json(internship);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/internships/:id — company owner
const deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findOneAndDelete({
      _id: req.params.id,
      company: req.userId,
    });
    if (!internship) return res.status(404).json({ message: 'Internship not found or unauthorized' });
    res.json({ message: 'Internship deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/internships/my — company's own postings
const getMyInternships = async (req, res) => {
  try {
    const internships = await Internship.find({ company: req.userId }).sort({ createdAt: -1 });
    res.json(internships);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
  getMyInternships,
};
