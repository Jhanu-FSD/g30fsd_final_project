const Appointment = require('../models/Appointment');
const User = require('../models/User');

exports.bookAppointment = async (req, res) => {
  try {
    const { counsellorId, date, time, reason } = req.body;
    const appointment = new Appointment({
      student: req.user.id,
      counsellor: counsellorId,
      date,
      time,
      reason
    });
    await appointment.save();
    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getStudentAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ student: req.user.id })
      .populate('counsellor', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getCounsellorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ counsellor: req.user.id })
      .populate('student', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getCounsellors = async (req, res) => {
  try {
    const counsellors = await User.find({ role: 'counsellor' }, 'name email');
    res.status(200).json(counsellors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};