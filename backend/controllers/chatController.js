const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;

const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `You are MindCare, a compassionate mental health support assistant for college students. 
    Respond with empathy, care and helpful advice. Keep responses concise and supportive.
    If the user seems to be in crisis, always recommend professional help.
    User message: ${message}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.status(200).json({ reply: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};