const User = require('../models/User');
const Company = require('../models/Company');
const Internship = require('../models/Internship');
const Application = require('../models/Application');

// @GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [totalStudents, totalCompanies, totalInternships, totalApplications, pendingVerification] =
      await Promise.all([
        User.countDocuments({ role: 'student' }),
        Company.countDocuments(),
        Internship.countDocuments(),
        Application.countDocuments(),
        Company.countDocuments({ isVerified: false }),
      ]);

    res.json({
      totalStudents,
      totalCompanies,
      totalInternships,
      totalApplications,
      pendingVerification,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/admin/students
const getAllStudents = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = { role: 'student' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { university: { $regex: search, $options: 'i' } },
      ];
    }
    const students = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/admin/companies
const getAllCompanies = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } },
      ];
    }
    const companies = await Company.find(filter).select('-password').sort({ createdAt: -1 });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/admin/companies/:id/verify
const toggleVerification = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    company.isVerified = !company.isVerified;
    await company.save();
    res.json({ message: `Company ${company.isVerified ? 'verified' : 'unverified'}`, company });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      const company = await Company.findByIdAndDelete(req.params.id);
      if (!company) return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/admin/companies/:id
const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json({ message: 'Company deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getStats,
  getAllStudents,
  getAllCompanies,
  toggleVerification,
  deleteUser,
  deleteCompany,
};
