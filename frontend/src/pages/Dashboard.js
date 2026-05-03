

import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { motion } from 'framer-motion';

import axios from 'axios';

import {

  Home, MessageSquare, ClipboardCheck, Calendar, BarChart3,

  Settings, LogOut, Heart, Bell, Zap, Sparkles,

  ChevronLeft, ChevronRight, Phone, CheckCircle, Circle, Wind

} from 'lucide-react';
import FloatingRobot from './FloatingRobot';




const quotes = [

  "Self-care is how you take your power back. 💪",

  "You don't have to be positive all the time. 🌸",

  "Mental health is not a destination, but a journey. 🌱",

  "It's okay to not be okay. You are not alone. 💙",

  "Small steps every day lead to big changes. 🌟",

];



const tips = [

  { icon: "🧘", title: "Practice Mindfulness", desc: "Spend 5 minutes focusing on your breath every morning." },

  { icon: "🚶", title: "Take a Walk", desc: "A 10-minute walk outside can boost your mood significantly." },

  { icon: "📔", title: "Journal Your Thoughts", desc: "Writing helps process emotions and reduce anxiety." },

  { icon: "💧", title: "Stay Hydrated", desc: "Drinking water regularly improves focus and reduces stress." },

  { icon: "😴", title: "Prioritize Sleep", desc: "7-8 hours of quality sleep is essential for mental health." },

];



const defaultGoals = [

  { id: 1, text: "Log my mood today", done: false },

  { id: 2, text: "Take 10 deep breaths", done: false },

  { id: 3, text: "Drink 8 glasses of water", done: false },

  { id: 4, text: "Take a 10 min walk", done: false },

  { id: 5, text: "Write 3 things I'm grateful for", done: false },

];



const moodEmoji = {

  happy: '😄', calm: '😌', sad: '😔',

  anxious: '😰', angry: '😠', stressed: '😩'

};



const moodMap = { happy: 5, calm: 4, sad: 2, anxious: 2, angry: 1, stressed: 1 };



const severityColor = {

  'Minimal Depression': '#16A34A',

  'Mild Depression': '#CA8A04',

  'Moderate Depression': '#EA580C',

  'Moderately Severe Depression': '#DC2626',

  'Severe Depression': '#7F1D1D',

};



const Dashboard = () => {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User' };

  const [currentTime, setCurrentTime] = useState(new Date());

  const [activeNav, setActiveNav] = useState('home');

  const [quickMood, setQuickMood] = useState('');

  const [moodLogged, setMoodLogged] = useState(false);

  const [tipIndex, setTipIndex] = useState(0);

  const [darkMode, setDarkMode] = useState(false);

  const [showEmergency, setShowEmergency] = useState(false);

  const [goals, setGoals] = useState(defaultGoals);

  const [breathPhase, setBreathPhase] = useState('idle');

  const [breathCount, setBreathCount] = useState(0);

  const [breathScale, setBreathScale] = useState(1);

  const [moods, setMoods] = useState([]);

  const [assessments, setAssessments] = useState([]);

  const [appointments, setAppointments] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);



  const todayQuote = quotes[new Date().getDay() % quotes.length];



  useEffect(() => {

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => clearInterval(timer);

  }, []);



  useEffect(() => {

    const tipTimer = setInterval(() => setTipIndex((prev) => (prev + 1) % tips.length), 4000);

    return () => clearInterval(tipTimer);

  }, []);



  useEffect(() => {

    const fetchData = async () => {

      try {

        const token = localStorage.getItem('token');

        const headers = { Authorization: `Bearer ${token}` };

        const [moodRes, assessRes, apptRes] = await Promise.all([

          axios.get('http://localhost:5000/api/mood', { headers }),

          axios.get('http://localhost:5000/api/assessment', { headers }),

          axios.get('http://localhost:5000/api/appointments/student', { headers }),

        ]);

        setMoods(moodRes.data);

        setAssessments(assessRes.data);

        setAppointments(apptRes.data);

      } catch (err) {

        console.error(err);

      }

    };

    fetchData();

  }, []);



  const getGreeting = () => {

    const hour = currentTime.getHours();

    if (hour < 12) return 'Good Morning,';

    if (hour < 17) return 'Good Afternoon,';

    return 'Good Evening,';

  };



  const handleLogout = () => {

    localStorage.removeItem('token');

    localStorage.removeItem('user');

    navigate('/login');

  };



  const toggleGoal = (id) => {

    setGoals(goals.map(g => g.id === id ? { ...g, done: !g.done } : g));

  };



  const startBreathing = () => {

    if (breathPhase !== 'idle' && breathPhase !== 'done') return;

    setBreathCount(0);

    let count = 0;

    const cycle = async () => {

      setBreathPhase('inhale'); setBreathScale(1.5);

      await new Promise(r => setTimeout(r, 4000));

      setBreathPhase('hold');

      await new Promise(r => setTimeout(r, 4000));

      setBreathPhase('exhale'); setBreathScale(1);

      await new Promise(r => setTimeout(r, 4000));

      count++; setBreathCount(count);

      if (count < 3) cycle(); else setBreathPhase('done');

    };

    cycle();

  };



  // Last 7 days mood history — real data

  const last7Days = Array.from({ length: 7 }, (_, i) => {

    const d = new Date();

    d.setDate(d.getDate() - (6 - i));

    return { day: d.toLocaleDateString('en-IN', { weekday: 'short' }), date: d.toDateString() };

  });



  const moodHistory = last7Days.map(day => {

    const found = moods.find(m => new Date(m.createdAt).toDateString() === day.date);

    return { day: day.day, mood: found ? (moodMap[found.mood] || 3) : 0, emoji: found ? moodEmoji[found.mood] : null };

  });



  const maxMood = Math.max(...moodHistory.map(m => m.mood), 1);

  const upcomingAppointments = appointments.filter(a => a.status !== 'cancelled');

  const latestAssessment = assessments[0];



  const sidebarItems = [

    { icon: <Home size={20} />, label: 'Dashboard', key: 'home' },

    { icon: <Heart size={20} />, label: 'Mood Tracker', key: 'mood', path: '/mood-tracker' },

    { icon: <MessageSquare size={20} />, label: 'AI Chatbot', key: 'chatbot', path: '/chatbot' },

    { icon: <ClipboardCheck size={20} />, label: 'Assessment', key: 'assessment', path: '/assessment' },

    { icon: <Calendar size={20} />, label: 'Appointments', key: 'appointments', path: '/book-appointment' },

    { icon: <BarChart3 size={20} />, label: 'My Reports', key: 'reports', path: '/my-reports' },

    { icon: <Settings size={20} />, label: 'Settings', key: 'settings', path: '/profile' },

  ];



  const features = [

    { title: 'Mood Tracker', icon: <Heart size={28} />, desc: 'Log your feelings daily', path: '/mood-tracker', color: '#F0FDF4', text: '#22C55E' },

    { title: 'AI Chatbot', icon: <MessageSquare size={28} />, desc: 'Instant friendly chat', path: '/chatbot', color: '#EEF2FF', text: '#6366F1' },

    { title: 'PHQ-9 Assessment', icon: <ClipboardCheck size={28} />, desc: 'Clinically validated checks', path: '/assessment', color: '#FFF7ED', text: '#F97316' },

    { title: 'Book Appointment', icon: <Calendar size={28} />, desc: 'Talk to human experts', path: '/book-appointment', color: '#FDF4FF', text: '#A855F7' },

    { title: 'My Reports', icon: <BarChart3 size={28} />, desc: 'Explore your wellness story', path: '/my-reports', color: '#F0F9FF', text: '#0EA5E9' },

    { title: 'Profile', icon: <Settings size={28} />, desc: 'Manage your account', path: '/profile', color: '#FFF1F2', text: '#F43F5E' },

  ];



  const quickMoods = ['😄', '😌', '😔', '😰', '😠', '😩'];



  const bg = darkMode ? '#343b4b' : '#FDFDFA';

  const cardBg = darkMode ? '#1E293B' : '#FFFFFF';

  const textPrimary = darkMode ? '#F1F5F9' : '#1E293B';

  const textSecondary = darkMode ? '#94A3B8' : '#64748B';

  const borderColor = darkMode ? '#334155' : '#F1F5F9';

  const navSections = [
    {
      label: 'MAIN',
      items: [
        { icon: <Home size={17} />, label: 'Dashboard', key: 'home' },
        { icon: <Heart size={17} />, label: 'Mood Tracker', key: 'mood', path: '/mood-tracker' },
        { icon: <MessageSquare size={17} />, label: 'AI Chatbot', key: 'chatbot', path: '/chatbot' },
      ]
    },
    {
      label: 'HEALTH',
      items: [
        { icon: <ClipboardCheck size={17} />, label: 'Assessment', key: 'assessment', path: '/assessment' },
        { icon: <Calendar size={17} />, label: 'Appointments', key: 'appointments', path: '/book-appointment' },
        { icon: <BarChart3 size={17} />, label: 'My Reports', key: 'reports', path: '/my-reports' },
      ]
    },
    {
      label: 'TOOLS',
      items: [
        { icon: <Settings size={17} />, label: 'Settings', key: 'settings', path: '/profile' },
        { icon: <Phone size={17} />, label: 'Emergency', key: 'emergency' },
      ]
    },
  ];



  return (

    <div className="flex min-h-screen font-sans" style={{ backgroundColor: bg, transition: 'all 0.3s' }}>




      {showEmergency && (

        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>

          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}

            className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">

            <div className="text-center mb-6">

              <span className="text-5xl">🆘</span>

              <h3 className="text-2xl font-black text-slate-800 mt-3">Emergency Support</h3>

              <p className="text-slate-500 text-sm mt-2">You are not alone. Help is available 24/7.</p>

            </div>

            <div className="space-y-3">

              {[

                { name: 'iCall Helpline', number: '9152987821', color: '#EEF2FF', text: '#6366F1' },

                { name: 'Vandrevala Foundation', number: '1860-2662-345', color: '#F0FDF4', text: '#22C55E' },

                { name: 'NIMHANS Helpline', number: '080-46110007', color: '#FFF7ED', text: '#F97316' },

              ].map((h) => (

                <div key={h.name} className="flex items-center justify-between p-4 rounded-2xl" style={{ backgroundColor: h.color }}>

                  <div>

                    <p className="font-bold text-sm" style={{ color: h.text }}>{h.name}</p>

                    <p className="text-slate-500 text-xs">{h.number}</p>

                  </div>

                  <a href={`tel:${h.number}`} className="px-4 py-2 rounded-xl text-white text-xs font-bold" style={{ backgroundColor: h.text }}>Call Now</a>

                </div>

              ))}

            </div>

            <button onClick={() => setShowEmergency(false)} className="w-full mt-4 py-3 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition">Close</button>

          </motion.div>

        </div>

      )}





     <aside style={{ width: 230, backgroundColor: '#242734', borderRight: '1px solid #1E293B', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: '22px 20px 16px', borderBottom: '1px solid #1E293B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1D4ED8, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🧠</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>MindCare</div>
              <div style={{ fontSize: 10, color: '#19a6fd' }}>Student Portal</div>
            </div>
          </div>
        </div>

        {/* User */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #1E293B', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #1D4ED8, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 15 }}>
            {user?.name?.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#c0cfdd' }}>{user?.name}</div>
            <div style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, color: '#22C55E' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E' }}></div>
              Active
            </div>
          </div>
        </div>

        {/* Nav Sections */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {navSections.map((section, si) => (
            <div key={si} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#598ccb', letterSpacing: '0.1em', padding: '0 8px 8px', borderBottom: '1px solid #2f3c50', marginBottom: 6 }}>
                {section.label}
              </div>
              {section.items.map(item => (
                <button key={item.key}
                  onClick={() => {
                    if (item.key === 'emergency') { setShowEmergency(true); return; }
                    setActiveNav(item.key);
                    if (item.path) navigate(item.path);
                  }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 10px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                    border: 'none', cursor: 'pointer', marginBottom: 2, transition: 'all 0.15s',
                    backgroundColor: activeNav === item.key ?'rgba(217, 223, 237, 0.25)' : 'transparent', //rgba(217, 223, 237, 0.25)
                    color: activeNav === item.key ? '#60A5FA' : '#cbd4e1',
                    borderLeft: activeNav === item.key ? '2px solid #1D4ED8' : '2px solid transparent',
                  }}>
                  <span style={{ opacity: activeNav === item.key ? 1 : 0.7 }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px', borderTop: '1px solid #1E293B' }}>
          <button onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', backgroundColor: 'rgba(239,68,68,0.1)', color: '#FCA5A5', fontSize: 13, fontWeight: 600 }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>



      <main className="flex-1 overflow-y-auto px-8 py-8">




        <header className="flex justify-between items-center mb-8">

          <div>

            <h2 className="text-2xl font-black" style={{ color: textPrimary }}>{getGreeting()} {user?.name} 👋</h2>

            <p className="text-sm mt-1" style={{ color: textSecondary }}>{currentTime.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>

          </div>

          <div className="flex items-center gap-3">

            <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-2xl shadow-sm transition" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>

              {darkMode ? <span className="text-yellow-400 text-lg">☀️</span> : <span className="text-slate-400 text-lg">🌙</span>}

            </button>

            
           <div style={{ position: 'relative' }}>
  <button onClick={() => setShowNotifications(!showNotifications)}
    className="p-3 rounded-2xl shadow-sm relative cursor-pointer"
    style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
    <Bell size={18} className="text-slate-400" />
    <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#6366F1] rounded-full border-2 border-white"></div>
  </button>
  {showNotifications && (
    <div style={{ position: 'absolute', right: 0, top: 48, width: 300, backgroundColor: cardBg, border: `1px solid ${borderColor}`, borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 50, padding: 16 }}>
      <p style={{ fontSize: 14, fontWeight: 700, color: textPrimary, margin: '0 0 12px' }}>🔔 Notifications</p>
      {[
        { icon: '😊', text: 'Don\'t forget to log your mood today!', time: 'Just now', color: '#22C55E' },
        { icon: '📋', text: 'Take your weekly PHQ-9 assessment', time: '2 hours ago', color: '#6366F1' },
        { icon: '📅', text: 'Appointment reminder: Tomorrow 10 AM', time: 'Yesterday', color: '#F97316' },
      ].map((n, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: i < 2 ? `1px solid ${borderColor}` : 'none' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: n.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{n.icon}</div>
          <div>
            <p style={{ fontSize: 12, color: textPrimary, margin: '0 0 2px', fontWeight: 500 }}>{n.text}</p>
            <p style={{ fontSize: 11, color: textSecondary, margin: 0 }}>{n.time}</p>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow"

              style={{ background: 'linear-gradient(135deg, #FF9B9B 0%, #A855F7 100%)' }}>

              {user?.name?.charAt(0)}

            </div>

          </div>

        </header>




        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}

          className="rounded-[2.5rem] p-10 mb-8 relative overflow-hidden shadow-lg"

          style={{ background: 'linear-gradient(135deg, #FFF9EB 0%, #E0F2FE 50%, #FFE4E6 100%)' }}>

          <div className="relative z-10 max-w-lg">

            <div className="bg-white/50 backdrop-blur px-4 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest inline-block mb-4 text-[#075985]">

              Your Mental Wellness Journey! 👋

            </div>

            <h4 className="text-4xl font-black leading-tight text-slate-800">

              {getGreeting()} <span className="text-[#075985]">{user?.name}</span>

            </h4>

            <p className="text-slate-500 mt-3 text-sm italic">"{todayQuote}"</p>

            <div className="flex gap-4 mt-6">

              <button onClick={() => navigate('/mood-tracker')} className="bg-white text-rose-500 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow hover:bg-rose-50 transition">Log Today's Mood</button>

              <button onClick={() => navigate('/assessment')} className="border-2 border-slate-300 text-slate-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition">Take Assessment</button>

            </div>

          </div>

          <div className="absolute right-10 top-6 text-9xl opacity-10 select-none">🧘</div>

        </motion.div>




        <div className="grid grid-cols-2 gap-6 mb-8">

          <div className="rounded-3xl p-6 shadow-sm" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>

            <div className="flex items-center gap-2 mb-4">

              <Zap size={18} className="text-yellow-500" />

              <h3 className="font-bold" style={{ color: textPrimary }}>Quick Mood Check</h3>

            </div>

            {!moodLogged ? (

              <div className="flex gap-3 flex-wrap">

                {quickMoods.map((mood) => (

                  <button key={mood} onClick={() => { setQuickMood(mood); setMoodLogged(true); }}

                    className="text-3xl p-3 rounded-2xl transition hover:scale-110 bg-slate-50 hover:bg-slate-100">{mood}</button>

                ))}

              </div>

            ) : (

              <div className="flex items-center gap-3">

                <span className="text-3xl">{quickMood}</span>

                <div>

                  <p className="font-bold text-sm" style={{ color: textPrimary }}>Mood logged! ✅</p>

                  <p className="text-xs" style={{ color: textSecondary }}>Keep tracking daily!</p>

                </div>

                <button onClick={() => { setQuickMood(''); setMoodLogged(false); }} className="ml-auto text-xs text-indigo-500 hover:underline">Reset</button>

              </div>

            )}

          </div>



          <div className="rounded-3xl p-6 shadow-sm" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>

            <div className="flex items-center justify-between mb-4">

              <div className="flex items-center gap-2">

                <Sparkles size={18} className="text-purple-500" />

                <h3 className="font-bold" style={{ color: textPrimary }}>Wellness Tip</h3>

              </div>

              <div className="flex gap-2">

                <button onClick={() => setTipIndex((prev) => (prev - 1 + tips.length) % tips.length)} className="p-1 rounded-lg hover:bg-slate-100 transition"><ChevronLeft size={16} className="text-slate-400" /></button>

                <button onClick={() => setTipIndex((prev) => (prev + 1) % tips.length)} className="p-1 rounded-lg hover:bg-slate-100 transition"><ChevronRight size={16} className="text-slate-400" /></button>

              </div>

            </div>

            <motion.div key={tipIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>

              <div className="flex items-start gap-3">

                <span className="text-3xl">{tips[tipIndex].icon}</span>

                <div>

                  <p className="font-bold text-sm" style={{ color: textPrimary }}>{tips[tipIndex].title}</p>

                  <p className="text-xs mt-1" style={{ color: textSecondary }}>{tips[tipIndex].desc}</p>

                </div>

              </div>

            </motion.div>

            <div className="flex gap-1 mt-4">

              {tips.map((_, i) => (

                <div key={i} className="h-1 rounded-full transition-all" style={{ width: i === tipIndex ? '24px' : '8px', backgroundColor: i === tipIndex ? '#A855F7' : '#E2E8F0' }}></div>

              ))}

            </div>

          </div>

        </div>




        <div className="grid grid-cols-2 gap-6 mb-8">


          <div className="rounded-3xl p-6 shadow-sm" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>

            <h3 className="font-bold mb-4" style={{ color: textPrimary }}>📈 Mood History (Last 7 Days)</h3>

            {moods.length === 0 ? (

              <div className="text-center py-6">

                <p className="text-4xl mb-2">📊</p>

                <p className="text-sm" style={{ color: textSecondary }}>No mood data yet</p>

                <button onClick={() => navigate('/mood-tracker')} className="mt-3 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition">Log First Mood</button>

              </div>

            ) : (

              <div className="flex items-end gap-3 h-28">

                {moodHistory.map((m, i) => (

                  <div key={i} className="flex-1 flex flex-col items-center gap-2">

                    {m.emoji && <span className="text-sm">{m.emoji}</span>}

                    <div className="w-full rounded-xl transition-all duration-500"

                      style={{ height: m.mood > 0 ? `${(m.mood / maxMood) * 80}px` : '4px', backgroundColor: m.mood > 0 ? '#6366F1' : '#EEF2FF', minHeight: '4px' }}></div>

                    <span className="text-xs font-medium" style={{ color: textSecondary }}>{m.day}</span>

                  </div>

                ))}

              </div>

            )}

          </div>




          <div className="rounded-3xl p-6 shadow-sm text-center" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>

            <div className="flex items-center gap-2 mb-4 justify-center">

              <Wind size={18} className="text-blue-500" />

              <h3 className="font-bold" style={{ color: textPrimary }}>Breathing Exercise</h3>

            </div>

            <motion.div

              animate={{ scale: breathScale }}

              transition={{ duration: 4, ease: 'easeInOut' }}

              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold shadow-lg cursor-pointer"

              style={{ background: 'linear-gradient(135deg, #6366F1, #A855F7)' }}

              onClick={startBreathing}>

              <span className="text-xs">

                {breathPhase === 'idle' ? 'Start' : breathPhase === 'inhale' ? 'Inhale' : breathPhase === 'hold' ? 'Hold' : breathPhase === 'exhale' ? 'Exhale' : 'Done ✅'}

              </span>

            </motion.div>

            <p className="text-xs" style={{ color: textSecondary }}>

              {breathPhase === 'idle' && 'Click the circle to start 4-4-4 breathing'}

              {breathPhase === 'inhale' && 'Breathe in slowly... 4 seconds'}

              {breathPhase === 'hold' && 'Hold your breath... 4 seconds'}

              {breathPhase === 'exhale' && 'Breathe out slowly... 4 seconds'}

              {breathPhase === 'done' && `Great job! Completed ${breathCount} cycles 🎉`}

            </p>

          </div>

        </div>




        <div className="mb-8">

          <div className="rounded-3xl p-6 shadow-sm" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>

            <div className="flex items-center justify-between mb-4">

              <div className="flex items-center gap-2">

                <CheckCircle size={18} className="text-green-500" />

                <h3 className="font-bold" style={{ color: textPrimary }}>Daily Goals</h3>

              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-600">

                {goals.filter(g => g.done).length}/{goals.length} Done

              </span>

            </div>

            <div className="grid grid-cols-2 gap-3">

              {goals.map((goal) => (

                <button key={goal.id} onClick={() => toggleGoal(goal.id)}

                  className="flex items-center gap-3 p-3 rounded-2xl transition hover:bg-slate-50 text-left"

                  style={{ backgroundColor: goal.done ? '#F0FDF4' : 'transparent' }}>

                  {goal.done ? <CheckCircle size={18} className="text-green-500 flex-shrink-0" /> : <Circle size={18} className="text-slate-300 flex-shrink-0" />}

                  <span className="text-sm font-medium" style={{ color: goal.done ? '#22C55E' : textPrimary, textDecoration: goal.done ? 'line-through' : 'none' }}>

                    {goal.text}

                  </span>

                </button>

              ))}

            </div>

          </div>

        </div>




        <div className="mb-8">

          <div className="rounded-3xl p-6 shadow-sm" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>

            <div className="flex items-center justify-between mb-4">

              <h3 className="font-bold" style={{ color: textPrimary }}>📅 Upcoming Appointments</h3>

              <button onClick={() => navigate('/book-appointment')} className="text-xs font-bold text-indigo-500 hover:underline">+ Book New</button>

            </div>

            {upcomingAppointments.length === 0 ? (

              <div className="text-center py-6">

                <p className="text-4xl mb-2">📅</p>

                <p className="text-sm mb-3" style={{ color: textSecondary }}>No upcoming appointments</p>

                <button onClick={() => navigate('/book-appointment')} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition">Book a Session</button>

              </div>

            ) : (

              <div className="space-y-3">

                {upcomingAppointments.slice(0, 3).map((appt, i) => (

                  <div key={i} className="p-4 rounded-2xl" style={{ backgroundColor: '#EEF2FF' }}>

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="font-bold text-sm text-indigo-700">{appt.counsellor?.name || 'Counsellor'}</p>

                        <p className="text-xs text-indigo-400">Mental Health Counsellor</p>

                      </div>

                      <div className="text-right">

                        <p className="font-bold text-sm text-indigo-700">{appt.date}</p>

                        <p className="text-xs text-indigo-400">{appt.time}</p>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>




        <div className="mb-8">

          <div className="rounded-3xl p-6 shadow-sm" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>

            <div className="flex items-center justify-between mb-4">

              <h3 className="font-bold" style={{ color: textPrimary }}>📋 Latest Assessment</h3>

              <button onClick={() => navigate('/assessment')} className="text-xs font-bold text-orange-500 hover:underline">Take New</button>

            </div>

            {!latestAssessment ? (

              <div className="text-center py-6">

                <p className="text-4xl mb-2">🩺</p>

                <p className="text-sm mb-3" style={{ color: textSecondary }}>No assessment taken yet</p>

                <button onClick={() => navigate('/assessment')} className="px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-xs font-bold hover:bg-orange-100 transition">Take PHQ-9 Test</button>

              </div>

            ) : (

              <div className="flex items-center gap-6">

                <div className="text-center">

                  <p className="text-4xl font-black text-indigo-600">{latestAssessment.score}</p>

                  <p className="text-xs" style={{ color: textSecondary }}>out of 27</p>

                </div>

                <div className="flex-1">

                  <p className="font-bold text-sm mb-1" style={{ color: severityColor[latestAssessment.severity] || textPrimary }}>{latestAssessment.severity}</p>

                  <p className="text-xs" style={{ color: textSecondary }}>{new Date(latestAssessment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>

                </div>

              </div>

            )}

          </div>

        </div>




        <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-6 pl-2" style={{ color: textSecondary }}>Your Wellness Modules</h3>

        <div className="grid grid-cols-3 gap-6">

          {features.map((item, i) => (

            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}

              transition={{ delay: i * 0.1 }} whileHover={{ y: -8 }}

              onClick={() => navigate(item.path)}

              className="rounded-[2rem] p-8 cursor-pointer relative overflow-hidden group"

              style={{ backgroundColor: item.color }}>

              <div className="flex justify-between items-start mb-8">

                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-sm group-hover:rotate-6 transition-transform" style={{ color: item.text }}>

                  {item.icon}

                </div>

              </div>

              <h5 className="text-lg font-black text-slate-800 mb-1">{item.title}</h5>

              <p className="text-sm text-slate-500">{item.desc}</p>

              <div className="mt-6 flex justify-end">

                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-slate-900 group-hover:text-white transition-all">

                  <span className="text-sm">→</span>

                </div>

              </div>

            </motion.div>

          ))}

        </div>

      </main>
      <FloatingRobot message="Welcome back! Check your wellness score and log today's mood 🚀" />


    </div>

  );

};



export default Dashboard;


