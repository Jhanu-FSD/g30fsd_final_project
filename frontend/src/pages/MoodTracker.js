import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Send, Sparkles, Flame, Wind } from 'lucide-react';
import axios from 'axios';
import FloatingRobot from './FloatingRobot';

const cutePalette = {
  primary: '#818CF8',
  pink: '#F472B6',
  bgDefault: '#FDFDFD',
  text: '#1F2937',
};



const moods = [
  { emoji: '😄', label: 'Happy!', value: 'happy', color: '#f899da', border: '#FDE047', bgGradient: 'linear-gradient(to bottom right, #f1aae7, #FEF3C7)' },
  { emoji: '😌', label: 'Calm~', value: 'calm', color: '#DCFCE7', border: '#86EFAC', bgGradient: 'linear-gradient(to bottom right, #96cfe9, #DCFCE7)' },
  { emoji: '😔', label: 'Sad...', value: 'sad', color: '#3386f2', border: '#93C5FD', bgGradient: 'linear-gradient(to bottom right, #f1a2a5, #DBEAFE)' },
  { emoji: '😰', label: 'Anxious', value: 'anxious', color: '#48f791', border: '#D8B4FE', bgGradient: 'linear-gradient(to bottom right, #4af390, #F3E8FF)' },
  { emoji: '😠', label: 'Angry >:<', value: 'angry', color: '#e93d3d', border: '#FCA5A5', bgGradient: 'linear-gradient(to bottom right, #da4848, #FEE2E2)' },
  { emoji: '😩', label: 'Stressed', value: 'stressed', color: '#f0f76c', border: '#FDBA74', bgGradient: 'linear-gradient(to bottom right, #d5e17a, #FFEDD5)' },
];

const MoodTracker = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Janu' };

  const [selectedMood, setSelectedMood] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isBurning, setIsBurning] = useState(false);

  const moodMessages = {
  happy: "Yay! You're glowing today 😄✨",
  calm: "Peaceful vibes... keep it up 😌🌿",
  sad: "It's okay to feel sad 💙 I'm here...",
  anxious: "Take a deep breath... you got this 🌬️💜",
  angry: "Let's cool down together 🔥➡️❄️",
  stressed: "Relax... one step at a time 😩🌈",
};
const robotMessage = selectedMood 
  ? moodMessages[selectedMood] 
  : "How are you feeling today? 😊";

  const currentMoodObj = moods.find(m => m.value === selectedMood);
  const dynamicBg = currentMoodObj ? currentMoodObj.bgGradient : cutePalette.bgDefault;

  // --- NEW LOGIC START ---
  
  // 2. Sentiment Score Logic (Simple Proof of Concept)
  const calculateSentiment = (text, mood) => {
    const positiveWords = ['happy', 'great', 'awesome', 'good', 'love', 'excited', 'calm'];
    const negativeWords = ['sad', 'bad', 'angry', 'hate', 'stress', 'fail', 'lonely', 'anxious'];
    
    let score = 0.5; // Neutral default
    const words = text.toLowerCase().split(/\s+/);
    
    words.forEach(word => {
      if (positiveWords.includes(word)) score += 0.1;
      if (negativeWords.includes(word)) score -= 0.1;
    });

    // Mood base cheskoni kuda adjust chestunnam
    if (['happy', 'calm'].includes(mood)) score += 0.2;
    if (['sad', 'angry', 'anxious', 'stressed'].includes(mood)) score -= 0.2;

    return Math.max(0, Math.min(1, score)).toFixed(2); // Keep between 0 and 1
  };

  const handleSubmit = async () => {
    if (!selectedMood) return alert('Please select a mood first! (UwU)');
    
    if (['sad', 'anxious', 'angry', 'stressed'].includes(selectedMood) && note.trim() !== "") {
        setIsBurning(true);
        setTimeout(async () => {
            await performSubmit();
            setIsBurning(false);
            setNote('');
        }, 2500); 
    } else {
        await performSubmit();
    }
  };

  const performSubmit = async () => {
    try {
        const token = localStorage.getItem('token');
        
        // 1. Timestamps (Time & Date)
        // 2. Sentiment Score (AI Idea)
        // 3. Word Count / Length
        const moodEntry = {
            mood: selectedMood,
            note: note,
            timestamp: new Date().toLocaleString(), // Detailed local time
            isoDate: new Date().toISOString(),      // For backend sorting
            sentimentScore: calculateSentiment(note, selectedMood),
            wordCount: note.trim() === "" ? 0 : note.trim().split(/\s+/).length,
            noteLength: note.length,
            isBurned: ['sad', 'anxious', 'angry', 'stressed'].includes(selectedMood)
        };

        console.log("Submitting Metadata:", moodEntry);

        await axios.post('http://localhost:5000/api/mood', 
          moodEntry,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSubmitted(true);
      } catch (err) {
        console.error("Error logging mood:", err);
        setSubmitted(true); 
      }
  };

  // --- NEW LOGIC END ---

  const burnAnimation = {
    initial: { opacity: 1, scale: 1, y: 0 },
    animate: { 
        opacity: [1, 0.8, 0.5, 0], 
        scale: [1, 1.05, 0.9, 0], 
        y: [0, -20, -50, -100],
        filter: ["blur(0px)", "blur(2px)", "blur(5px)", "blur(10px)"],
        transition: { duration: 2, ease: "easeInOut" }
    }
  };


 
  

  

  return (
    <div className="min-h-screen transition-all duration-1000 "
     style={{ background: dynamicBg }}> 
      
      <div className="min-h-screen  w-full">
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
    
    
   
      <main className="max-w-5xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h2 className="text-5xl font-black mb-10">Hello, <br/><span className="text-pink-500">{user.name}!</span></h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {moods.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => setSelectedMood(mood.value)}
                      className={`aspect-square rounded-[2rem] p-4 flex flex-col items-center justify-center border-4 transition-all ${
                        selectedMood === mood.value ? 'bg-white border-pink-200 shadow-xl' : 'bg-white/50 border-transparent opacity-80'
                      }`}
                    >
                      <span className="text-5xl mb-2">{mood.emoji}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:mt-24">
                <AnimatePresence mode="wait">
                  {isBurning ? (
                    <motion.div key="burn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-[3rem] p-10 shadow-xl text-center min-h-[300px] flex flex-col justify-center items-center">
                      <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
                        <Flame size={60} className="text-orange-400 mb-4" />
                      </motion.div>
                      <h3 className="text-xl font-black">Letting it go...</h3>
                      <p className="text-sm text-gray-400">Burning your worries away ✨</p>
                    </motion.div>
                  ) : (
                    <motion.div key="note-input" className="bg-white rounded-[3rem] p-8 shadow-xl">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <Heart size={18} className="text-pink-400" />
                          <span className="font-black text-xs uppercase tracking-widest">Journal</span>
                        </div>
                        {/* Word count badge for live update */}
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                          {note.trim() === "" ? 0 : note.trim().split(/\s+/).length} Words
                        </span>
                      </div>
                      <motion.div animate={isBurning ? burnAnimation.animate : burnAnimation.initial}>
                        <textarea
                          className="w-full bg-gray-50 rounded-2xl p-4 min-h-[150px] mb-6 outline-none focus:ring-2 focus:ring-pink-100 transition-all resize-none"
                          placeholder={['sad', 'anxious', 'angry', 'stressed'].includes(selectedMood) ? "Tell me your worry, let's burn it..." : "Anything on your mind?"}
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                        />
                      </motion.div>
                      <button
                        onClick={handleSubmit}
                        disabled={!selectedMood}
                        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${selectedMood ? 'bg-gray-900 text-white shadow-lg shadow-pink-100' : 'bg-gray-100 text-gray-300'}`}
                      >
                        {['sad', 'anxious', 'angry', 'stressed'].includes(selectedMood) && note.trim() !== "" ? "Burn & Release" : "Save Reflection"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[4rem] p-16 text-center shadow-2xl max-w-xl mx-auto border-4 border-pink-50">
              <span className="text-7xl block mb-6">💖</span>
              <h3 className="text-3xl font-black mb-4">You're Awesome, {user.name}!</h3>
              <p className="text-gray-500 mb-8 font-medium">Data logged with sentiment analysis. (≧◡≦)</p>
              <button onClick={() => navigate('/dashboard')} className="bg-gray-900 text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-pink-500 transition-all">
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      {/*<FloatingRobot message="How are you feeling today? Logging your mood daily helps track your wellbeing! 😊" />*/}
      <FloatingRobot message={robotMessage} />
    </div>
    </div>
  );
};

export default MoodTracker;