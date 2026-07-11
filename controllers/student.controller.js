const User = require('../models/User');

// @GET /api/student/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/student/profile
const updateProfile = async (req, res) => {
  try {
    const { name, university, bio, skills } = req.body;
    const updateData = { name, university, bio };

    if (skills) {
      updateData.skills = Array.isArray(skills)
        ? skills
        : skills.split(',').map((s) => s.trim());
    }

    const user = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProfile, updateProfile };
