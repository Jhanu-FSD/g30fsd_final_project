import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FloatingRobot from './FloatingRobot';


const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am MindCare AI. How are you feeling today? I am here to help you. 😊' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/chat',
        { message: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const botMessage = { sender: 'bot', text: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Sorry, something went wrong. Please try again.' }]);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/*<nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">MindCare</h1>
        <button onClick={() => navigate('/dashboard')} className="text-indigo-600 hover:underline">
          ← Back to Dashboard
        </button>
      </nav>
      */}

      <div className="min-h-screen bg-[#F8FAFC] w-full">
      {/* 1. TOP NAVBAR (Sticky) */}
     <nav className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50 w-full shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">M</div>
        <span className="font-bold text-xl text-slate-800">MindCare</span>
      </div>
      <button 
        onClick={() => navigate('/dashboard')} 
        className="px-5 py-2 bg-[#EFF6FF] text-[#1D4ED8] rounded-xl text-sm font-semibold hover:bg-blue-100 transition-all"
      >
        ← Back to Dashboard
      </button>
     </nav>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">🤖 AI Mental Health Assistant</h2>

        <div className="bg-white rounded-2xl shadow-md p-4 h-96 overflow-y-auto mb-4 flex flex-col gap-3">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-4 py-2 rounded-2xl max-w-xs text-sm ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-2xl bg-gray-100 text-gray-500 text-sm">
                Typing...
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={handleSend}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-semibold"
          >
            Send
          </button>
        </div>
      </div>
      <FloatingRobot 
  message="I'm here to listen! Feel free to share anything — this is a safe space 💙" 
  position="bottom-left"
/>
    </div>
    </div>
  );
};

export default Chatbot;