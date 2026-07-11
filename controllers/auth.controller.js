const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// @POST /api/auth/register/student
const registerStudent = async (req, res) => {
  try {
    const { name, email, university, skills, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({
      name,
      email,
      university,
      skills: skills ? skills.split(',').map((s) => s.trim()) : [],
      password,
      role: 'student',
    });

    const token = generateToken(user._id, user.role);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/auth/register/company
const registerCompany = async (req, res) => {
  try {
    const { companyName, email, industry, website, contactPerson, password } = req.body;
    const existing = await Company.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const company = await Company.create({
      companyName,
      email,
      industry,
      website,
      contactPerson,
      password,
    });

    const token = generateToken(company._id, company.role);
    res.status(201).json({
      token,
      user: {
        id: company._id,
        name: company.companyName,
        email: company.email,
        role: company.role,
        isVerified: company.isVerified,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    // Check all models
    let account = await User.findOne({ email });
    let role = account?.role;

    if (!account) {
      account = await Company.findOne({ email });
      role = account?.role;
    }

    if (!account) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await account.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = generateToken(account._id, role);

    res.json({
      token,
      user: {
        id: account._id,
        name: account.name || account.companyName,
        email: account.email,
        role,
        isVerified: account.isVerified || null,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ user: req.user, role: req.userRole });
};

module.exports = { registerStudent, registerCompany, login, getMe };
