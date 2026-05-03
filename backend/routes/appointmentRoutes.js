const express = require('express');
const router = express.Router();
const { bookAppointment, getStudentAppointments, getCounsellorAppointments } = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, bookAppointment);
router.get('/student', authMiddleware, getStudentAppointments);
router.get('/counsellor', authMiddleware, getCounsellorAppointments);
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const Appointment = require('../models/Appointment');
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json({ message: 'Status updated', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;