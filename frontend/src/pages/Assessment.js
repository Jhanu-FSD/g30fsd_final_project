

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import FloatingRobot from './FloatingRobot';

const questions = [
  { id: 1, text: "Little interest or pleasure in doing things?", icon: "😔" },
  { id: 2, text: "Feeling down, depressed, or hopeless?", icon: "💭" },
  { id: 3, text: "Trouble falling or staying asleep, or sleeping too much?", icon: "😴" },
  { id: 4, text: "Feeling tired or having little energy?", icon: "🔋" },
  { id: 5, text: "Poor appetite or overeating?", icon: "🍽️" },
  { id: 6, text: "Feeling bad about yourself — or feeling like a failure?", icon: "💔" },
  { id: 7, text: "Trouble concentrating on things, such as reading or watching TV?", icon: "🧠" },
  { id: 8, text: "Moving or speaking so slowly that others could have noticed?", icon: "🐢" },
  { id: 9, text: "Thoughts that you would be better off dead or hurting yourself?", icon: "🆘" },
];

const options = [
  { label: "Not at all", value: 0, color: "#F0FDF4", border: "#86EFAC", text: "#16A34A" },
  { label: "Several days", value: 1, color: "#FFF9C4", border: "#FDE047", text: "#CA8A04" },
  { label: "More than half the days", value: 2, color: "#FFF3E0", border: "#FCA5A5", text: "#EA580C" },
  { label: "Nearly every day", value: 3, color: "#FEF2F2", border: "#FCA5A5", text: "#DC2626" },
];

const severityLevels = [
  { min: 0, max: 4, label: "Minimal", color: "#16A34A", bg: "#F0FDF4", desc: "You're doing well! Keep maintaining your healthy habits and self-care routines.", icon: "🌟", action: "Keep it up!" },
  { min: 5, max: 9, label: "Mild", color: "#CA8A04", bg: "#FEFCE8", desc: "You may benefit from some self-care strategies. Consider talking to a trusted friend or trying relaxation techniques.", icon: "🌤️", action: "Self-care helps" },
  { min: 10, max: 14, label: "Moderate", color: "#EA580C", bg: "#FFF7ED", desc: "We recommend speaking with a mental health professional. Please consider booking a counsellor session.", icon: "⚠️", action: "Book a session" },
  { min: 15, max: 19, label: "Moderately Severe", color: "#DC2626", bg: "#FEF2F2", desc: "Please reach out to a counsellor as soon as possible. You deserve support and care.", icon: "🆘", action: "Seek help now" },
  { min: 20, max: 27, label: "Severe", color: "#7F1D1D", bg: "#FEF2F2", desc: "Please seek professional help immediately. Call a helpline or book an urgent counsellor session.", icon: "🚨", action: "Urgent support needed" },
];

const Assessment = () => {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState(1);

  const questionMessages = [
  "Lets start gently. Answer honestly — this helps us support you better! 🧠",
  "You're doing well 👍",
  "Take your time 😌",
  "Almost there 💪",
  "Keep going 🔥",
  "You're strong 💙",
  "Stay focused 🧠",
  "Just a few more 👀",
  "Last one! 🎯"
];

const robotMessage = result
  ? `Your score is ${result.score}. You're doing ${result.severity.label.toLowerCase()} 💙`
  : questionMessages[currentQ];

  const progress = (Object.keys(answers).length / questions.length) * 100;

  const handleAnswer = async (value) => {
    const newAnswers = { ...answers, [questions[currentQ].id]: value };
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setDirection(1);
      setTimeout(() => setCurrentQ(currentQ + 1), 300);
    } else {
      // Submit
      setSubmitting(true);
      const score = Object.values(newAnswers).reduce((a, b) => a + b, 0);
      const severity = severityLevels.find(s => score >= s.min && score <= s.max);

      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/assessment',
          { score, severity: severity.label + ' Depression', answers: newAnswers },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error(err);
      }

      setResult({ score, severity });
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentQ > 0) {
      setDirection(-1);
      setCurrentQ(currentQ - 1);
    }
  };

  const q = questions[currentQ];
  const selectedValue = answers[q?.id];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFF', fontFamily: 'system-ui, sans-serif' }}>

      
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

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px' }}>

        {!result ? (
          <>
            
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ display: 'inline-block', background: '#EFF6FF', padding: '4px 14px', borderRadius: 20, color: '#1D4ED8', fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
                📋 PHQ-9 Depression Screening
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>Mental Health Assessment</h1>
              <p style={{ color: '#64748B', fontSize: 14, margin: 0 }}>Over the last 2 weeks, how often have you been bothered by the following?</p>
            </div>

            
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#64748B' }}>Question {currentQ + 1} of {questions.length}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1D4ED8' }}>{Math.round(progress)}% Complete</span>
              </div>
              <div style={{ height: 6, backgroundColor: '#E2E8F0', borderRadius: 20, overflow: 'hidden' }}>
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, #1D4ED8, #6366F1)', borderRadius: 20 }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: 4, marginTop: 10, justifyContent: 'center' }}>
                {questions.map((_, i) => (
                  <div key={i} style={{
                    width: i === currentQ ? 20 : 8, height: 8, borderRadius: 20,
                    backgroundColor: i < currentQ ? '#1D4ED8' : i === currentQ ? '#6366F1' : '#E2E8F0',
                    transition: 'all 0.3s'
                  }} />
                ))}
              </div>
            </div>

           
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 60 }}
                transition={{ duration: 0.3 }}
              >
                <div style={{ background: '#fff', borderRadius: 20, padding: '32px', border: '1px solid #E2E8F0', marginBottom: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
                      {q.icon}
                    </div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: 0, lineHeight: 1.4 }}>
                      {q.text}
                    </h2>
                  </div>

                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {options.map((opt) => (
                      <motion.button
                        key={opt.value}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleAnswer(opt.value)}
                        style={{
                          padding: '14px 20px',
                          borderRadius: 12,
                          border: `2px solid ${selectedValue === opt.value ? opt.border : '#E2E8F0'}`,
                          backgroundColor: selectedValue === opt.value ? opt.color : '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s',
                          textAlign: 'left',
                        }}
                      >
                        <span style={{ fontSize: 15, fontWeight: selectedValue === opt.value ? 700 : 500, color: selectedValue === opt.value ? opt.text : '#374151' }}>
                          {opt.label}
                        </span>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%',
                          border: `2px solid ${selectedValue === opt.value ? opt.text : '#CBD5E1'}`,
                          backgroundColor: selectedValue === opt.value ? opt.text : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                          {selectedValue === opt.value && <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#fff' }} />}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

               
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button onClick={handleBack} disabled={currentQ === 0}
                    style={{ padding: '10px 20px', background: currentQ === 0 ? '#F1F5F9' : '#EFF6FF', border: 'none', borderRadius: 10, color: currentQ === 0 ? '#94A3B8' : '#1D4ED8', fontSize: 13, fontWeight: 600, cursor: currentQ === 0 ? 'not-allowed' : 'pointer' }}>
                    ← Previous
                  </button>
                  <span style={{ fontSize: 12, color: '#94A3B8' }}>
                    {submitting ? 'Submitting...' : 'Select an option to continue →'}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            
            <div style={{ background: '#F8FAFF', borderRadius: 12, padding: '14px 18px', border: '1px solid #E2E8F0', marginTop: 16, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{ fontSize: 18 }}>🔒</span>
              <p style={{ fontSize: 12, color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                Your responses are completely confidential and encrypted. This assessment is based on the clinically validated PHQ-9 questionnaire used by mental health professionals worldwide.
              </p>
            </div>
          </>
        ) : (
         
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>

            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ fontSize: 64, marginBottom: 12 }}>{result.severity.icon}</div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>Assessment Complete</h1>
              <p style={{ color: '#64748B', fontSize: 14 }}>Here are your results based on your responses</p>
            </div>

           
            <div style={{ background: result.severity.bg, borderRadius: 20, padding: 28, border: `2px solid ${result.severity.color}20`, marginBottom: 20, textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 56, fontWeight: 900, color: result.severity.color, margin: 0, lineHeight: 1 }}>{result.score}</p>
                  <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>out of 27</p>
                </div>
                <div style={{ width: 1, height: 60, backgroundColor: '#E2E8F0' }} />
                <div>
                  <p style={{ fontSize: 22, fontWeight: 800, color: result.severity.color, margin: 0 }}>{result.severity.label}</p>
                  <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>Depression Level</p>
                </div>
              </div>

             
              <div style={{ background: '#E2E8F0', borderRadius: 10, height: 10, overflow: 'hidden', marginBottom: 8 }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(result.score / 27) * 100}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  style={{ height: '100%', backgroundColor: result.severity.color, borderRadius: 10 }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94A3B8' }}>
                <span>Minimal (0-4)</span>
                <span>Mild (5-9)</span>
                <span>Moderate (10-14)</span>
                <span>Severe (20+)</span>
              </div>
            </div>

           
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #E2E8F0', marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 10px' }}>💡 Recommendation</h3>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: 0 }}>{result.severity.desc}</p>
            </div>

            
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #E2E8F0', marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>📊 PHQ-9 Severity Scale</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {severityLevels.map((s, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10,
                    backgroundColor: result.severity.label === s.label ? s.bg : '#F8FAFC',
                    border: result.severity.label === s.label ? `1.5px solid ${s.color}` : '1px solid #E2E8F0'
                  }}>
                    <span style={{ fontSize: 16 }}>{s.icon}</span>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.label}</span>
                      <span style={{ fontSize: 12, color: '#94A3B8', marginLeft: 8 }}>({s.min}–{s.max} points)</span>
                    </div>
                    {result.severity.label === s.label && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: s.color, background: s.bg, padding: '2px 10px', borderRadius: 20, border: `1px solid ${s.color}40` }}>Your Result</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => navigate('/dashboard')}
                style={{ flex: 1, padding: '14px', background: '#1D4ED8', border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                Back to Dashboard
              </button>
              <button onClick={() => navigate('/book-appointment')}
                style={{ flex: 1, padding: '14px', background: '#EFF6FF', border: 'none', borderRadius: 12, color: '#1D4ED8', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                Book a Session 📅
              </button>
              <button onClick={() => { setAnswers({}); setResult(null); setCurrentQ(0); }}
                style={{ padding: '14px 20px', background: '#F1F5F9', border: 'none', borderRadius: 12, color: '#64748B', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Retake
              </button>
            </div>

            
            {result.score >= 15 && (
              <div style={{ marginTop: 16, background: '#FEF2F2', borderRadius: 12, padding: '14px 18px', border: '1px solid #FECACA', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 18 }}>📞</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#DC2626', margin: '0 0 4px' }}>Need immediate support?</p>
                  <p style={{ fontSize: 12, color: '#374151', margin: 0 }}>Call iCall Helpline: <strong>9152987821</strong> | Vandrevala Foundation: <strong>1860-2662-345</strong></p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
      <FloatingRobot 
  //message={result ? "Assessment complete! Remember, seeking help is a sign of strength 💪" : "Take your time. Answer honestly — this helps us support you better! 🧠"} 

  message={robotMessage}
  
/>
    </div>
    </div>
  );
};

export default Assessment;




