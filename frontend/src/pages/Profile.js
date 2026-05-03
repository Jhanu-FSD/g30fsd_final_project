
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Home, Heart, MessageSquare, ClipboardCheck, Calendar, BarChart3, Settings, LogOut, Phone, User, Mail, Lock, Eye, EyeOff, Shield, Bell } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('personal');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [studentId, setStudentId] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ moods: 0, assessments: 0, appointments: 0 });
  const [prefs, setPrefs] = useState({ moodReminders: true, assessmentReminders: false, appointmentNotifs: true, wellnessTips: true, anonymousMode: true });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const [m, a, ap] = await Promise.all([
          axios.get('http://localhost:5000/api/mood', { headers }),
          axios.get('http://localhost:5000/api/assessment', { headers }),
          axios.get('http://localhost:5000/api/appointments/student', { headers }),
        ]);
        setStats({ moods: m.data.length, assessments: a.data.length, appointments: ap.data.length });
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, []);

  const showMsg = (msg, isError = false) => {
    if (isError) setError(msg); else setMessage(msg);
    setTimeout(() => { setMessage(''); setError(''); }, 3000);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/users/profile', { name, email, phone, bio }, { headers: { Authorization: `Bearer ${token}` } });
      localStorage.setItem('user', JSON.stringify({ ...user, name, email }));
      showMsg('Profile updated! ✅');
    } catch { showMsg('Failed to update', true); }
    setLoading(false);
  };

  const handleSaveAcademic = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/users/academic', { college, department, year, studentId }, { headers: { Authorization: `Bearer ${token}` } });
      showMsg('Academic info saved! ✅');
    } catch { showMsg('Failed to save', true); }
    setLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { showMsg('Passwords do not match', true); return; }
    if (newPassword.length < 6) { showMsg('Min 6 characters required', true); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/users/password', { currentPassword, newPassword }, { headers: { Authorization: `Bearer ${token}` } });
      showMsg('Password changed! ✅');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch { showMsg('Incorrect current password', true); }
    setLoading(false);
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/users/preferences', { preferences: prefs }, { headers: { Authorization: `Bearer ${token}` } });
      showMsg('Preferences saved! ✅');
    } catch { showMsg('Failed to save', true); }
    setLoading(false);
  };

  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); };

  const sidebarItems = [
    { icon: <Home size={18} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Heart size={18} />, label: 'Mood Tracker', path: '/mood-tracker' },
    { icon: <MessageSquare size={18} />, label: 'AI Chatbot', path: '/chatbot' },
    { icon: <ClipboardCheck size={18} />, label: 'Assessment', path: '/assessment' },
    { icon: <Calendar size={18} />, label: 'Appointments', path: '/book-appointment' },
    { icon: <BarChart3 size={18} />, label: 'My Reports', path: '/my-reports' },
    { icon: <Settings size={18} />, label: 'Settings', path: '/profile' },
  ];

  const tabs = [
    { key: 'personal', label: 'Personal Info', icon: '👤' },
    { key: 'academic', label: 'Academic', icon: '🎓' },
    { key: 'security', label: 'Security', icon: '🔒' },
    { key: 'preferences', label: 'Preferences', icon: '⚙️' },
  ];

  const inputStyle = { width: '100%', padding: '10px 12px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#0F172A', backgroundColor: '#fff', transition: 'border 0.2s' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'system-ui, sans-serif' }}>



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
        <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #E2E8F0', padding: '16px 28px' }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>My Profile</h1>
          <p style={{ fontSize: 13, color: '#94A3B8', margin: 0 }}>Manage your account and personal information</p>
        </div>

        <div style={{ padding: '24px 28px' }}>

          {/* Profile Header */}
          <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, border: '1px solid #E2E8F0', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {/* Avatar with ring */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #1D4ED8, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 32, border: '4px solid #EFF6FF' }}>
                  {user?.name?.charAt(0)}
                </div>
                <div style={{ position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: '50%', background: '#22C55E', border: '2px solid #fff' }}></div>
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>{user?.name}</h2>
                <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 10px' }}>{user?.email}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, backgroundColor: '#EFF6FF', color: '#1D4ED8', textTransform: 'capitalize' }}>{user?.role || 'Student'}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, backgroundColor: '#F0FDF4', color: '#16A34A' }}>● Active</span>
                </div>
              </div>
              {/* Stats */}
              <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
                {[
                  { label: 'Mood Logs', value: stats.moods, color: '#1D4ED8', bg: '#EFF6FF' },
                  { label: 'Assessments', value: stats.assessments, color: '#16A34A', bg: '#F0FDF4' },
                  { label: 'Sessions', value: stats.appointments, color: '#7E22CE', bg: '#FDF4FF' },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '12px 18px', borderRadius: 12, backgroundColor: s.bg, border: '1px solid #E2E8F0' }}>
                    <p style={{ fontSize: 24, fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
                    <p style={{ fontSize: 11, color: '#64748B', margin: '2px 0 0' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 20, backgroundColor: '#F1F5F9', borderRadius: 12, padding: 4 }}>
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                style={{ flex: 1, padding: '9px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, backgroundColor: activeTab === tab.key ? '#fff' : 'transparent', color: activeTab === tab.key ? '#1D4ED8' : '#64748B', boxShadow: activeTab === tab.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s' }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Alert Messages */}
          {message && <div style={{ padding: '12px 16px', borderRadius: 10, backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', color: '#16A34A', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>{message}</div>}
          {error && <div style={{ padding: '12px 16px', borderRadius: 10, backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>{error}</div>}

          {/* Personal Tab */}
          {activeTab === 'personal' && (
            <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 20px' }}>Personal Information</h3>
              <form onSubmit={handleUpdateProfile}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Full Name *</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required style={inputStyle}
                      onFocus={e => e.target.style.border = '1.5px solid #1D4ED8'}
                      onBlur={e => e.target.style.border = '1.5px solid #E2E8F0'} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Email Address *</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle}
                      onFocus={e => e.target.style.border = '1.5px solid #1D4ED8'}
                      onBlur={e => e.target.style.border = '1.5px solid #E2E8F0'} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Phone Number</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" style={inputStyle}
                      onFocus={e => e.target.style.border = '1.5px solid #1D4ED8'}
                      onBlur={e => e.target.style.border = '1.5px solid #E2E8F0'} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Role</label>
                    <input type="text" value={user?.role || 'Student'} disabled style={{ ...inputStyle, backgroundColor: '#F8FAFC', color: '#94A3B8', textTransform: 'capitalize' }} />
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>About Me</label>
                  <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us a little about yourself..." rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => e.target.style.border = '1.5px solid #1D4ED8'}
                    onBlur={e => e.target.style.border = '1.5px solid #E2E8F0'} />
                </div>
                <button type="submit" disabled={loading} style={{ padding: '11px 28px', background: '#1D4ED8', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* Academic Tab */}
          {activeTab === 'academic' && (
            <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 20px' }}>Academic Information</h3>
              <form onSubmit={handleSaveAcademic}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>College / University</label>
                    <input type="text" value={college} onChange={e => setCollege(e.target.value)} placeholder="e.g. University of Kashmir" style={inputStyle}
                      onFocus={e => e.target.style.border = '1.5px solid #1D4ED8'}
                      onBlur={e => e.target.style.border = '1.5px solid #E2E8F0'} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Department</label>
                    <input type="text" value={department} onChange={e => setDepartment(e.target.value)} placeholder="e.g. Computer Science" style={inputStyle}
                      onFocus={e => e.target.style.border = '1.5px solid #1D4ED8'}
                      onBlur={e => e.target.style.border = '1.5px solid #E2E8F0'} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Year of Study</label>
                    <select value={year} onChange={e => setYear(e.target.value)} style={{ ...inputStyle, backgroundColor: '#fff' }}>
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="5">5th Year (PG)</option>
                      <option value="phd">PhD</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Student ID</label>
                    <input type="text" value={studentId} onChange={e => setStudentId(e.target.value)} placeholder="Your roll number" style={inputStyle}
                      onFocus={e => e.target.style.border = '1.5px solid #1D4ED8'}
                      onBlur={e => e.target.style.border = '1.5px solid #E2E8F0'} />
                  </div>
                </div>
                <div style={{ padding: '12px 16px', borderRadius: 10, backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', display: 'flex', gap: 10, marginBottom: 20 }}>
                  <span>ℹ️</span>
                  <p style={{ fontSize: 12, color: '#0284C7', margin: 0 }}>Academic information is kept strictly confidential and only used to improve mental health support.</p>
                </div>
                <button type="submit" disabled={loading} style={{ padding: '11px 28px', background: '#1D4ED8', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Saving...' : 'Save Academic Info'}
                </button>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 6px' }}>Security Settings</h3>
              <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 24px' }}>Keep your account secure with a strong password</p>
              <form onSubmit={handleChangePassword}>
                <div style={{ maxWidth: 480 }}>
                  {[
                    { label: 'Current Password', value: currentPassword, setter: setCurrentPassword, show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
                    { label: 'New Password', value: newPassword, setter: setNewPassword, show: showNew, toggle: () => setShowNew(!showNew) },
                    { label: 'Confirm New Password', value: confirmPassword, setter: setConfirmPassword, show: false, toggle: null },
                  ].map((field, i) => (
                    <div key={i} style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>{field.label} *</label>
                      <div style={{ position: 'relative' }}>
                        <input type={field.show ? 'text' : 'password'} value={field.value} onChange={e => field.setter(e.target.value)} required
                          placeholder={i === 0 ? 'Enter current password' : i === 1 ? 'Min 6 characters' : 'Repeat new password'}
                          style={{ ...inputStyle, paddingRight: field.toggle ? 40 : 12, border: i === 2 && confirmPassword && confirmPassword !== newPassword ? '1.5px solid #FECACA' : '1.5px solid #E2E8F0' }}
                          onFocus={e => e.target.style.border = '1.5px solid #1D4ED8'}
                          onBlur={e => e.target.style.border = i === 2 && confirmPassword && confirmPassword !== newPassword ? '1.5px solid #FECACA' : '1.5px solid #E2E8F0'} />
                        {field.toggle && (
                          <button type="button" onClick={field.toggle} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                            {field.show ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        )}
                      </div>
                      {i === 1 && newPassword && (
                        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                          {[1, 2, 3, 4].map(n => (
                            <div key={n} style={{ flex: 1, height: 4, borderRadius: 10, backgroundColor: newPassword.length >= n * 3 ? (newPassword.length >= 12 ? '#16A34A' : newPassword.length >= 8 ? '#CA8A04' : '#EA580C') : '#E2E8F0' }} />
                          ))}
                          <span style={{ fontSize: 11, color: '#64748B', marginLeft: 4 }}>{newPassword.length >= 12 ? 'Strong' : newPassword.length >= 8 ? 'Medium' : 'Weak'}</span>
                        </div>
                      )}
                      {i === 2 && confirmPassword && confirmPassword !== newPassword && <p style={{ fontSize: 12, color: '#DC2626', margin: '4px 0 0' }}>Passwords do not match</p>}
                    </div>
                  ))}
                  <button type="submit" disabled={loading} style={{ marginTop: 4, padding: '11px 28px', background: '#1D4ED8', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 20px' }}>App Preferences</h3>
              {[
                { key: 'moodReminders', label: 'Daily Mood Reminders', desc: 'Get reminded to log your mood every day' },
                { key: 'assessmentReminders', label: 'Assessment Reminders', desc: 'Weekly reminder to take PHQ-9 assessment' },
                { key: 'appointmentNotifs', label: 'Appointment Notifications', desc: 'Get notified before your counsellor sessions' },
                { key: 'wellnessTips', label: 'Wellness Tips', desc: 'Receive daily mental health tips' },
                { key: 'anonymousMode', label: 'Anonymous Mode', desc: 'Your name is hidden in community support' },
              ].map((pref, i) => (
                <div key={pref.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 12, border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', marginBottom: 10 }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', margin: 0 }}>{pref.label}</p>
                    <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>{pref.desc}</p>
                  </div>
                  <div onClick={() => setPrefs({ ...prefs, [pref.key]: !prefs[pref.key] })}
                    style={{ width: 44, height: 24, borderRadius: 20, backgroundColor: prefs[pref.key] ? '#1D4ED8' : '#E2E8F0', cursor: 'pointer', position: 'relative', flexShrink: 0, transition: 'all 0.2s' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: 3, left: prefs[pref.key] ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }} />
                  </div>
                </div>
              ))}
              <button onClick={handleSavePreferences} disabled={loading} style={{ marginTop: 8, padding: '11px 28px', background: '#1D4ED8', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
    </div>
  );
};

export default Profile;