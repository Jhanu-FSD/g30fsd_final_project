


const express = require('express');
const router = express.Router();
const { getCounsellors } = require('../controllers/appointmentController');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/counsellors', authMiddleware, getCounsellors);

router.get('/students', authMiddleware, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }, 'name email createdAt');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, bio } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, email, phone, bio }, { new: true });
    res.status(200).json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/academic', authMiddleware, async (req, res) => {
  try {
    const { college, department, year, studentId } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { college, department, year, studentId }, { new: true });
    res.status(200).json({ message: 'Academic info updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/preferences', authMiddleware, async (req, res) => {
  try {
    const { preferences } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { preferences }, { new: true });
    res.status(200).json({ message: 'Preferences updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;