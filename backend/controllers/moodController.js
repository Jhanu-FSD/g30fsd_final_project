const Mood = require('../models/Mood');

exports.logMood = async (req, res) => {
  try {
    const { mood, note } = req.body;
    const newMood = new Mood({
      user: req.user.id,
      mood,
      note
    });
    await newMood.save();
    res.status(201).json({ message: 'Mood logged successfully', newMood });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getMoods = async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(moods);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};