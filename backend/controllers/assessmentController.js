const Assessment = require('../models/Assessment');

exports.saveAssessment = async (req, res) => {
  try {
    const { score, severity, answers } = req.body;
    const assessment = new Assessment({
      user: req.user.id,
      score,
      severity,
      answers
    });
    await assessment.save();
    res.status(201).json({ message: 'Assessment saved successfully', assessment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(assessments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};