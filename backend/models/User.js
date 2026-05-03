

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'counsellor', 'admin'], default: 'student' },
  phone: { type: String, default: '' },
  bio: { type: String, default: '' },
  college: { type: String, default: '' },
  department: { type: String, default: '' },
  year: { type: String, default: '' },
  studentId: { type: String, default: '' },
  preferences: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);