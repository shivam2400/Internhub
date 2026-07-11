const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: { type: String, trim: true, default: 'Remote' },
    duration: { type: String, trim: true },
    role: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
    stipend: { type: String, default: 'Unpaid' },
    openings: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Internship', internshipSchema);
