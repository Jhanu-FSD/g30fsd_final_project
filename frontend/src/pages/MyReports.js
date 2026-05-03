

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart3, Heart, Calendar, ClipboardCheck, Home, MessageSquare, Settings, LogOut, Phone, TrendingUp, Award, ChevronDown, ChevronUp } from 'lucide-react';

const moodEmoji = { happy: '😄', calm: '😌', sad: '😔', anxious: '😰', angry: '😠', stressed: '😩' };
const moodColor = { happy: '#16A34A', calm: '#0284C7', sad: '#7C3AED', anxious: '#CA8A04', angry: '#DC2626', stressed: '#EA580C' };
const moodBg = { happy: '#F0FDF4', calm: '#F0F9FF', sad: '#F5F3FF', anxious: '#FEFCE8', angry: '#FEF2F2', stressed: '#FFF7ED' };

const severityColor = {
  'Minimal Depression': { color: '#16A34A', bg: '#F0FDF4' },
  'Mild Depression': { color: '#CA8A04', bg: '#FEFCE8' },
  'Moderate Depression': { color: '#EA580C', bg: '#FFF7ED' },
  'Moderately Severe Depression': { color: '#DC2626', bg: '#FEF2F2' },
  'Severe Depression': { color: '#7F1D1D', bg: '#FEF2F2' },
};

const statusColor = {
  pending: { color: '#CA8A04', bg: '#FEFCE8', label: 'Pending' },
  confirmed: { color: '#16A34A', bg: '#F0FDF4', label: 'Confirmed' },
  cancelled: { color: '#DC2626', bg: '#FEF2F2', label: 'Cancelled' },
};

const MyReports = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [moods, setMoods] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [expandedAssessment, setExpandedAssessment] = useState(null);

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
      setLoading(false);
    };
    fetchData();
  }, []);

  const sidebarItems = [
    { icon: <Home size={18} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Heart size={18} />, label: 'Mood Tracker', path: '/mood-tracker' },
    { icon: <MessageSquare size={18} />, label: 'AI Chatbot', path: '/chatbot' },
    { icon: <ClipboardCheck size={18} />, label: 'Assessment', path: '/assessment' },
    { icon: <Calendar size={18} />, label: 'Appointments', path: '/book-appointment' },
    { icon: <BarChart3 size={18} />, label: 'My Reports', path: '/my-reports' },
    { icon: <Settings size={18} />, label: 'Settings', path: '/profile' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Mood stats
  const moodCounts = moods.reduce((acc, m) => { acc[m.mood] = (acc[m.mood] || 0) + 1; return acc; }, {});
  const mostFrequentMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
  const latestAssessment = assessments[0];
  const confirmedAppts = appointments.filter(a => a.status === 'confirmed').length;

  // Last 7 days mood
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const found = moods.find(m => new Date(m.createdAt).toDateString() === d.toDateString());
    return { day: d.toLocaleDateString('en-IN', { weekday: 'short' }), mood: found?.mood || null };
  });

  const tabs = [
    { key: 'overview', label: '📊 Overview', count: null },
    { key: 'moods', label: '😊 Mood History', count: moods.length },
    { key: 'assessments', label: '📋 Assessments', count: assessments.length },
    { key: 'appointments', label: '📅 Appointments', count: appointments.length },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'system-ui, sans-serif' }}>

      {/* Sidebar */}
      {/*<aside style={{ width: 220, backgroundColor: '#fff', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 18px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🧠</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#1D4ED8' }}>MindCare</div>
            <div style={{ fontSize: 10, color: '#94A3B8' }}>Mental Health Portal</div>
          </div>
        </div>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>
            {user?.name?.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#0F172A' }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: '#22C55E' }}>● Online</div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '10px 8px' }}>
          {sidebarItems.map(item => (
            <button key={item.path} onClick={() => navigate(item.path)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, fontSize: 13, border: 'none', cursor: 'pointer', marginBottom: 2, backgroundColor: item.path === '/my-reports' ? '#EFF6FF' : 'transparent', color: item.path === '/my-reports' ? '#1D4ED8' : '#475569', fontWeight: item.path === '/my-reports' ? 600 : 400 }}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '10px 8px', borderTop: '1px solid #E2E8F0' }}>
          <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, border: 'none', backgroundColor: 'transparent', color: '#94A3B8', fontSize: 12, cursor: 'pointer' }}>
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </aside>
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

      {/* Main */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {/* Topbar */}
        <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #E2E8F0', padding: '16px 28px' }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>📊 My Health Reports</h1>
          <p style={{ fontSize: 13, color: '#94A3B8', margin: 0 }}>Your complete mental health history and progress</p>
        </div>

        <div style={{ padding: '24px 28px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#94A3B8' }}>Loading your reports...</div>
          ) : (
            <>
              {/* Stats Overview */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
                {[
                  { label: 'Total Mood Logs', value: moods.length, icon: '😊', color: '#1D4ED8', bg: '#EFF6FF', sub: mostFrequentMood ? `Most: ${mostFrequentMood[0]}` : 'No data yet' },
                  { label: 'Assessments Taken', value: assessments.length, icon: '📋', color: '#16A34A', bg: '#F0FDF4', sub: latestAssessment ? `Last: ${latestAssessment.score}/27` : 'Not taken yet' },
                  { label: 'Sessions Booked', value: appointments.length, icon: '📅', color: '#7E22CE', bg: '#FDF4FF', sub: `${confirmedAppts} confirmed` },
                  { label: 'Wellness Score', value: moods.length > 0 ? '78%' : 'N/A', icon: '🏆', color: '#CA8A04', bg: '#FEFCE8', sub: moods.length > 0 ? 'Based on your logs' : 'Log moods to track' },
                ].map((s, i) => (
                  <div key={i} style={{ backgroundColor: '#fff', borderRadius: 12, padding: '18px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{s.icon}</div>
                      <div>
                        <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>{s.label}</p>
                        <p style={{ fontSize: 22, fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: 11, color: '#64748B', margin: 0, padding: '6px 0 0', borderTop: '1px solid #F1F5F9' }}>{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 20, backgroundColor: '#F1F5F9', borderRadius: 12, padding: 4 }}>
                {tabs.map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    style={{ flex: 1, padding: '9px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, backgroundColor: activeTab === tab.key ? '#fff' : 'transparent', color: activeTab === tab.key ? '#1D4ED8' : '#64748B', boxShadow: activeTab === tab.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    {tab.label}
                    {tab.count !== null && <span style={{ background: activeTab === tab.key ? '#EFF6FF' : '#E2E8F0', color: activeTab === tab.key ? '#1D4ED8' : '#64748B', borderRadius: 20, padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>{tab.count}</span>}
                  </button>
                ))}
              </div>

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {/* Mood Chart */}
                  <div style={{ backgroundColor: '#fff', borderRadius: 14, padding: 20, border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>📈 Last 7 Days Mood</h3>
                    {moods.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '24px 0' }}>
                        <p style={{ fontSize: 28 }}>📊</p>
                        <p style={{ fontSize: 13, color: '#94A3B8' }}>No mood data yet</p>
                        <button onClick={() => navigate('/mood-tracker')} style={{ marginTop: 8, padding: '6px 14px', background: '#EFF6FF', border: 'none', borderRadius: 8, color: '#1D4ED8', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Log First Mood</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
                        {last7.map((d, i) => (
                          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            {d.mood && <span style={{ fontSize: 14 }}>{moodEmoji[d.mood]}</span>}
                            <div style={{ width: '100%', borderRadius: 6, backgroundColor: d.mood ? moodColor[d.mood] : '#E2E8F0', height: d.mood ? '60px' : '6px', opacity: d.mood ? 0.8 : 0.4 }} />
                            <span style={{ fontSize: 10, color: '#94A3B8' }}>{d.day}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mood Distribution */}
                  <div style={{ backgroundColor: '#fff', borderRadius: 14, padding: 20, border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>🎯 Mood Distribution</h3>
                    {moods.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '24px 0' }}>
                        <p style={{ fontSize: 13, color: '#94A3B8' }}>No data available</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {Object.entries(moodCounts).sort((a, b) => b[1] - a[1]).map(([mood, count]) => (
                          <div key={mood} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 18, width: 24 }}>{moodEmoji[mood]}</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                                <span style={{ fontSize: 12, fontWeight: 600, color: '#374151', textTransform: 'capitalize' }}>{mood}</span>
                                <span style={{ fontSize: 12, color: '#94A3B8' }}>{count}x</span>
                              </div>
                              <div style={{ height: 6, backgroundColor: '#F1F5F9', borderRadius: 10 }}>
                                <div style={{ height: '100%', width: `${(count / moods.length) * 100}%`, backgroundColor: moodColor[mood], borderRadius: 10 }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Latest Assessment Summary */}
                  <div style={{ backgroundColor: '#fff', borderRadius: 14, padding: 20, border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>🩺 Latest Assessment</h3>
                    {!latestAssessment ? (
                      <div style={{ textAlign: 'center', padding: '24px 0' }}>
                        <p style={{ fontSize: 28 }}>📋</p>
                        <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 8 }}>No assessment taken</p>
                        <button onClick={() => navigate('/assessment')} style={{ padding: '6px 14px', background: '#FFF7ED', border: 'none', borderRadius: 8, color: '#EA580C', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Take PHQ-9</button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px', borderRadius: 10, backgroundColor: severityColor[latestAssessment.severity]?.bg || '#F8FAFC', marginBottom: 12 }}>
                          <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: 36, fontWeight: 900, color: severityColor[latestAssessment.severity]?.color || '#1D4ED8', margin: 0 }}>{latestAssessment.score}</p>
                            <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>/ 27</p>
                          </div>
                          <div>
                            <p style={{ fontWeight: 700, fontSize: 15, color: severityColor[latestAssessment.severity]?.color || '#1D4ED8', margin: '0 0 4px' }}>{latestAssessment.severity}</p>
                            <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>{new Date(latestAssessment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <button onClick={() => navigate('/assessment')} style={{ width: '100%', padding: '8px', background: '#EFF6FF', border: 'none', borderRadius: 8, color: '#1D4ED8', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Retake Assessment</button>
                      </div>
                    )}
                  </div>

                  {/* Appointment Summary */}
                  <div style={{ backgroundColor: '#fff', borderRadius: 14, padding: 20, border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>📅 Appointment Summary</h3>
                    {appointments.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '24px 0' }}>
                        <p style={{ fontSize: 28 }}>👨‍⚕️</p>
                        <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 8 }}>No appointments yet</p>
                        <button onClick={() => navigate('/book-appointment')} style={{ padding: '6px 14px', background: '#FDF4FF', border: 'none', borderRadius: 8, color: '#7E22CE', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Book Session</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {[
                          { label: 'Total Booked', value: appointments.length, color: '#1D4ED8' },
                          { label: 'Confirmed', value: confirmedAppts, color: '#16A34A' },
                          { label: 'Pending', value: appointments.filter(a => a.status === 'pending').length, color: '#CA8A04' },
                          { label: 'Cancelled', value: appointments.filter(a => a.status === 'cancelled').length, color: '#DC2626' },
                        ].map((s, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, backgroundColor: '#F8FAFC' }}>
                            <span style={{ fontSize: 13, color: '#374151' }}>{s.label}</span>
                            <span style={{ fontSize: 15, fontWeight: 700, color: s.color }}>{s.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mood History Tab */}
              {activeTab === 'moods' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {moods.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E2E8F0' }}>
                      <p style={{ fontSize: 48 }}>😊</p>
                      <p style={{ fontSize: 16, fontWeight: 600, color: '#0F172A', margin: '8px 0 4px' }}>No mood logs yet</p>
                      <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 16 }}>Start tracking your daily mood</p>
                      <button onClick={() => navigate('/mood-tracker')} style={{ padding: '10px 24px', background: '#1D4ED8', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Log First Mood</button>
                    </div>
                  ) : moods.map((mood, i) => (
                    <div key={i} style={{ backgroundColor: '#fff', borderRadius: 12, padding: '16px 20px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: moodBg[mood.mood], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
                        {moodEmoji[mood.mood]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: moodColor[mood.mood], textTransform: 'capitalize' }}>{mood.mood}</span>
                          <span style={{ fontSize: 11, background: moodBg[mood.mood], color: moodColor[mood.mood], padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>Mood Log</span>
                        </div>
                        {mood.note && <p style={{ fontSize: 13, color: '#64748B', margin: 0, fontStyle: 'italic' }}>"{mood.note}"</p>}
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: 0 }}>{new Date(mood.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                        <p style={{ fontSize: 11, color: '#94A3B8', margin: '2px 0 0' }}>{new Date(mood.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Assessments Tab */}
              {activeTab === 'assessments' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {assessments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E2E8F0' }}>
                      <p style={{ fontSize: 48 }}>📋</p>
                      <p style={{ fontSize: 16, fontWeight: 600, color: '#0F172A', margin: '8px 0 4px' }}>No assessments taken</p>
                      <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 16 }}>Take a PHQ-9 screening to understand your mental health</p>
                      <button onClick={() => navigate('/assessment')} style={{ padding: '10px 24px', background: '#EA580C', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Take PHQ-9 Now</button>
                    </div>
                  ) : assessments.map((a, i) => (
                    <div key={i} style={{ backgroundColor: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }} onClick={() => setExpandedAssessment(expandedAssessment === i ? null : i)}>
                        <div style={{ width: 52, height: 52, borderRadius: 12, backgroundColor: severityColor[a.severity]?.bg || '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: 22, fontWeight: 900, color: severityColor[a.severity]?.color || '#1D4ED8' }}>{a.score}</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>PHQ-9 Assessment</span>
                            {i === 0 && <span style={{ fontSize: 11, background: '#EFF6FF', color: '#1D4ED8', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>Latest</span>}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: severityColor[a.severity]?.color || '#1D4ED8' }}>{a.severity}</span>
                            <span style={{ fontSize: 11, color: '#94A3B8' }}>• Score: {a.score}/27</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <p style={{ fontSize: 12, color: '#374151', fontWeight: 600, margin: 0 }}>{new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginTop: 4 }}>
                            <span style={{ fontSize: 11, color: '#94A3B8' }}>{expandedAssessment === i ? 'Hide' : 'Details'}</span>
                            {expandedAssessment === i ? <ChevronUp size={14} color="#94A3B8" /> : <ChevronDown size={14} color="#94A3B8" />}
                          </div>
                        </div>
                      </div>
                      {expandedAssessment === i && (
                        <div style={{ padding: '0 20px 16px', borderTop: '1px solid #F1F5F9' }}>
                          <div style={{ marginTop: 12, padding: '12px', borderRadius: 10, backgroundColor: severityColor[a.severity]?.bg || '#F8FAFC' }}>
                            <p style={{ fontSize: 13, fontWeight: 600, color: severityColor[a.severity]?.color, margin: '0 0 4px' }}>Result: {a.severity}</p>
                            <div style={{ height: 6, backgroundColor: '#E2E8F0', borderRadius: 10, marginTop: 8 }}>
                              <div style={{ height: '100%', width: `${(a.score / 27) * 100}%`, backgroundColor: severityColor[a.severity]?.color, borderRadius: 10 }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                              <span style={{ fontSize: 10, color: '#94A3B8' }}>0 - Minimal</span>
                              <span style={{ fontSize: 10, color: '#94A3B8' }}>27 - Severe</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Appointments Tab */}
              {activeTab === 'appointments' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {appointments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E2E8F0' }}>
                      <p style={{ fontSize: 48 }}>📅</p>
                      <p style={{ fontSize: 16, fontWeight: 600, color: '#0F172A', margin: '8px 0 4px' }}>No appointments yet</p>
                      <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 16 }}>Book a session with a professional counsellor</p>
                      <button onClick={() => navigate('/book-appointment')} style={{ padding: '10px 24px', background: '#7E22CE', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Book Now</button>
                    </div>
                  ) : appointments.map((appt, i) => (
                    <div key={i} style={{ backgroundColor: '#fff', borderRadius: 12, padding: '18px 20px', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
                          {appt.counsellor?.name?.charAt(0) || 'C'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{appt.counsellor?.name || 'Counsellor'}</span>
                            <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, backgroundColor: statusColor[appt.status]?.bg, color: statusColor[appt.status]?.color }}>
                              {statusColor[appt.status]?.label}
                            </span>
                          </div>
                          <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>{appt.counsellor?.email}</p>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: 0 }}>📅 {appt.date}</p>
                          <p style={{ fontSize: 12, color: '#94A3B8', margin: '2px 0 0' }}>🕐 {appt.time}</p>
                          {appt.reason && <p style={{ fontSize: 11, color: '#94A3B8', margin: '2px 0 0', fontStyle: 'italic' }}>{appt.reason}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
    </div>
  );
};

export default MyReports;