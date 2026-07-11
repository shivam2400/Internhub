const Company = require('../models/Company');

// @GET /api/company/profile
const getProfile = async (req, res) => {
  try {
    const company = await Company.findById(req.userId).select('-password');
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/company/profile
const updateProfile = async (req, res) => {
  try {
    const { companyName, industry, website, contactPerson, bio } = req.body;
    const company = await Company.findByIdAndUpdate(
      req.userId,
      { companyName, industry, website, contactPerson, bio },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProfile, updateProfile };
