
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Home, Calendar, Users, BarChart3, LogOut, Settings, Bell, Shield, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

const NOTIF_KEY = 'mindcare_notifications';
const getNotifs = () => { try { return JSON.parse(localStorage.getItem(NOTIF_KEY) || '[]'); } catch { return []; } };

const CounsellorDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [activePage, setActivePage] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState(getNotifs());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/appointments/counsellor', { headers: { Authorization: `Bearer ${token}` } });
        setAppointments(res.data);
        const existing = getNotifs();
        const newNotifs = [];
        res.data.filter(a => a.status === 'pending').forEach(appt => {
          const id = `new-booking-${appt._id}`;
          if (!existing.find(n => n.id === id)) {
            newNotifs.push({ id, icon: '📅', text: `New booking from ${appt.student?.name || 'Student'}`, time: `${appt.date} • ${appt.time}`, read: false });
          }
        });
        if (newNotifs.length > 0) {
          const updated = [...newNotifs, ...existing].slice(0, 15);
          localStorage.setItem(NOTIF_KEY, JSON.stringify(updated));
          setNotifications(updated);
        }
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/appointments/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      setAppointments(appointments.map(a => a._id === id ? { ...a, status } : a));
      const appt = appointments.find(a => a._id === id);
      const existing = getNotifs();
      const notifId = `appt-${status}-${id}`;
      if (!existing.find(n => n.id === notifId)) {
        const updated = [{ id: notifId, icon: status === 'confirmed' ? '✅' : '❌', text: `Appointment ${status} — ${appt?.date} ${appt?.time}`, time: 'Just now', read: false }, ...existing].slice(0, 15);
        localStorage.setItem(NOTIF_KEY, JSON.stringify(updated));
        setNotifications(updated);
      }
    } catch (err) { console.error(err); }
  };

  const pending = appointments.filter(a => a.status === 'pending');
  const confirmed = appointments.filter(a => a.status === 'confirmed');
  const cancelled = appointments.filter(a => a.status === 'cancelled');
  const filtered = activeTab === 'all' ? appointments : activeTab === 'pending' ? pending : activeTab === 'confirmed' ? confirmed : cancelled;
  const uniqueStudents = [...new Map(appointments.map(a => [a.student?._id, a.student])).values()].filter(Boolean);
  const unreadCount = notifications.filter(n => !n.read).length;

  const statusStyle = {
    pending: { color: '#CA8A04', bg: '#FEFCE8', border: '#FDE047' },
    confirmed: { color: '#16A34A', bg: '#F0FDF4', border: '#86EFAC' },
    cancelled: { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
  };

  const navSections = [
    { label: 'MAIN', items: [
      { icon: <Home size={17} />, label: 'Overview', key: 'overview' },
      { icon: <Calendar size={17} />, label: 'Appointments', key: 'appointments', badge: pending.length },
    ]},
    { label: 'MANAGE', items: [
      { icon: <Users size={17} />, label: 'My Students', key: 'students' },
      { icon: <BarChart3 size={17} />, label: 'Reports', key: 'reports' },
    ]},
    { label: 'TOOLS', items: [
      { icon: <Settings size={17} />, label: 'Settings', key: 'settings' },
    ]},
  ];

 // 1. Calculate stats from real data
const totalSessions = appointments.length;
const activeStudents = uniqueStudents.length;
const confirmedCount = confirmed.length;
const cancelledCount = cancelled.length;
const pendingCount = totalSessions - (confirmedCount + cancelledCount);
const completionRate = totalSessions > 0 ? Math.round((confirmedCount / totalSessions) * 100) : 0;

// 2. Real Weekly Data (Mon-Sun)
const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const engagementData = daysOrder.map(day => {
  const count = appointments.filter(appt => {
    const d = new Date(appt.date).toLocaleDateString('en-US', { weekday: 'short' });
    return d === day;
  }).length;
  return { day, sessions: count };
});

// 3. Status Distribution Data for Donut
const statusData = [
  { name: 'Confirmed', value: confirmedCount, color: '#2563EB' },
  { name: 'Pending', value: pendingCount, color: '#93C5FD' },
  { name: 'Cancelled', value: cancelledCount, color: '#DBEAFE' }
];
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'system-ui, sans-serif' }}>

      {/* Sidebar */}
      <aside style={{ width: 230, backgroundColor: '#242734', borderRight: '1px solid #1e293a', display: 'flex', flexDirection: 'column', flexShrink: 0, boxShadow: '1px 0 8px rgba(0,0,0,0.04)' }}>
        <div style={{ padding: '22px 20px 16px', borderBottom: '1px solid #535a64' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1D4ED8, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🧠</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>MindCare</div>
              <div style={{ fontSize: 10, color: '#19a6fd' }}>Counsellor Portal</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '14px 20px', borderBottom: '1px solid #1E293B', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #1D4ED8, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16 }}>
            {user?.name?.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#c0cfdd' }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: '#22C55E', display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E' }}></div> Online
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '16px 10px', overflowY: 'auto' }}>
          {navSections.map((section, si) => (
            

            <div key={si} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#598ccb', letterSpacing: '0.1em', padding: '0 8px 8px', marginBottom: 4 }}>{section.label}</div>
              {section.items.map(item => (
                <button key={item.key} onClick={() => setActivePage(item.key)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, fontSize: 13, fontWeight: activePage === item.key ? 600 : 400, border: 'none', cursor: 'pointer', marginBottom: 2, transition: 'all 0.15s', backgroundColor: activePage === item.key ? '#332d51' : 'transparent', color: activePage === item.key ? '#bbbbd2' : '#d4dce6' }}>
                  {item.icon}
                  <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                  {item.badge > 0 && <span style={{ background: '#e4e7f9', color: '#959090', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 20 }}>{item.badge}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div style={{ padding: '12px', borderTop: '1px solid #E2E8F0' }}>
          <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: '1px solid #272020', cursor: 'pointer', backgroundColor: '#413838', color: '#ec6d6d', fontSize: 13, fontWeight: 600 }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {/* Topbar */}
        <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #E2E8F0', padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: 0 }}>
              {activePage === 'overview' ? '📊 Overview' : activePage === 'appointments' ? '📅 Appointments' : activePage === 'students' ? '👥 My Students' : activePage === 'reports' ? '📈 Reports' : '⚙️ Settings'}
            </h1>
            <p style={{ fontSize: 12, color: '#94A3B8', margin: '2px 0 0' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowNotif(!showNotif)} style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid #E2E8F0', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
                <Bell size={17} color="#64748B" />
                {unreadCount > 0 && <div style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%', background: '#EF4444', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>{unreadCount}</div>}
              </button>
              {showNotif && (
                <div style={{ position: 'absolute', right: 0, top: 46, width: 300, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', zIndex: 50, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: 0 }}>🔔 Notifications</p>
                    <button onClick={() => { const u = notifications.map(n => ({...n, read: true})); localStorage.setItem(NOTIF_KEY, JSON.stringify(u)); setNotifications(u); }} style={{ fontSize: 11, color: '#1D4ED8', background: 'none', border: 'none', cursor: 'pointer' }}>Mark all read</button>
                  </div>
                  {notifications.length === 0 ? <p style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', padding: '16px 0' }}>No notifications</p>
                    : notifications.slice(0, 5).map((n, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < 4 ? '1px solid #F1F5F9' : 'none', opacity: n.read ? 0.6 : 1 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{n.icon}</div>
                        <div>
                          <p style={{ fontSize: 12, color: '#0F172A', margin: 0, fontWeight: n.read ? 400 : 600 }}>{n.text}</p>
                          <p style={{ fontSize: 11, color: '#94A3B8', margin: '2px 0 0' }}>{n.time}</p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #16A34A, #22C55E)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 15 }}>{user?.name?.charAt(0)}</div>
          </div>
        </div>

        <div style={{ padding: '24px 28px' }}>
          { /*{activePage === 'overview' && (
            <>
              <div style={{ background: 'linear-gradient(135deg, #1D4ED8, #2563EB)', borderRadius: 16, padding: '24px 28px', marginBottom: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: -20, top: -20, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>
                <div>
                  <p style={{ color: '#93C5FD', fontSize: 12, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Welcome back,</p>
                  <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 8px' }}>{user?.name} 👋</h2>
                  <p style={{ color: '#BFDBFE', fontSize: 13, margin: 0 }}>
                    You have <strong style={{ color: '#FCD34D' }}>{pending.length} pending</strong> appointment{pending.length !== 1 ? 's' : ''} awaiting your response.
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: '#93C5FD', fontSize: 11, margin: '0 0 4px' }}>Today</p>
                  <p style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 22 }}>
                {[
                  { label: 'Total', value: appointments.length, icon: '📅', color: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE' },
                  { label: 'Pending', value: pending.length, icon: '⏳', color: '#CA8A04', bg: '#FEFCE8', border: '#FDE047' },
                  { label: 'Confirmed', value: confirmed.length, icon: '✅', color: '#16A34A', bg: '#F0FDF4', border: '#86EFAC' },
                  { label: 'Students', value: uniqueStudents.length, icon: '👥', color: '#7E22CE', bg: '#FDF4FF', border: '#E9D5FF' },
                ].map((s, i) => (
                  <div key={i} style={{ backgroundColor: '#fff', borderRadius: 12, padding: '18px', border: `1px solid #E2E8F0` }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 10 }}>{s.icon}</div>
                    <p style={{ fontSize: 26, fontWeight: 800, color: s.color, margin: '0 0 2px' }}>{s.value}</p>
                    <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>{s.label}</p>
                  </div>
                ))}
              </div>

              <div style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E2E8F0' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Recent Appointments</h3>
                  <button onClick={() => setActivePage('appointments')} style={{ fontSize: 12, color: '#1D4ED8', background: 'none', border: 'none', cursor: 'pointer' }}>View All →</button>
                </div>
                {loading ? <p style={{ textAlign: 'center', padding: 24, color: '#94A3B8' }}>Loading...</p>
                  : appointments.length === 0 ? <p style={{ textAlign: 'center', padding: 32, color: '#94A3B8', fontSize: 13 }}>No appointments yet</p>
                  : appointments.slice(0, 5).map((appt, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', borderBottom: i < 4 ? '1px solid #F8FAFC' : 'none' }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1D4ED8', fontWeight: 700, fontSize: 16 }}>{appt.student?.name?.charAt(0) || 'S'}</div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', margin: 0 }}>{appt.student?.name || 'Student'}</p>
                        <p style={{ fontSize: 11, color: '#94A3B8', margin: '2px 0 0' }}>{appt.date} • {appt.time}</p>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, backgroundColor: statusStyle[appt.status]?.bg, color: statusStyle[appt.status]?.color, border: `1px solid ${statusStyle[appt.status]?.border}` }}>
                        {appt.status}
                      </span>
                      {appt.status === 'pending' && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => updateStatus(appt._id, 'confirmed')} style={{ padding: '5px 12px', background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 8, color: '#16A34A', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>✓ Confirm</button>
                          <button onClick={() => updateStatus(appt._id, 'cancelled')} style={{ padding: '5px 12px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, color: '#DC2626', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>✗ Cancel</button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </>
          )}  */}



          {activePage === 'overview' && (
  <>
    {/* Welcome Banner */}
    <div style={{ background: 'linear-gradient(135deg, #2e3547, #2563EB)', borderRadius: 16, padding: '24px 28px', marginBottom: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', right: -20, top: -20, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>
      <div>
        <p style={{ color: '#93C5FD', fontSize: 12, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Welcome back,</p>
        <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 8px' }}>{user?.name} 👋</h2>
        <p style={{ color: '#BFDBFE', fontSize: 13, margin: 0 }}>
          You have <strong style={{ color: '#FCD34D' }}>{pending.length} pending</strong> appointment{pending.length !== 1 ? 's' : ''} awaiting response.
        </p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={{ color: '#93C5FD', fontSize: 11, margin: '0 0 4px' }}>Today</p>
        <p style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
      </div>
    </div>

    {/* Stats */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 22 }}>
      {[
        { label: 'Total Sessions', value: appointments.length, icon: '📅', color: '#1D4ED8', bg: '#EFF6FF' },
        { label: 'Pending', value: pending.length, icon: '⏳', color: '#CA8A04', bg: '#FEFCE8' },
        { label: 'Confirmed', value: confirmed.length, icon: '✅', color: '#16A34A', bg: '#F0FDF4' },
        { label: 'Students Helped', value: uniqueStudents.length, icon: '👥', color: '#7E22CE', bg: '#FDF4FF' },
      ].map((s, i) => (
        <div key={i} style={{ backgroundColor: '#fff', borderRadius: 12, padding: '18px', border: '1px solid #E2E8F0' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 10 }}>{s.icon}</div>
          <p style={{ fontSize: 26, fontWeight: 800, color: s.color, margin: '0 0 2px' }}>{s.value}</p>
          <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>{s.label}</p>
        </div>
      ))}
    </div>

    {/* Charts Row */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 22 }}>
      
      {/* Appointment Status Chart — Bar */}
      <div style={{ backgroundColor: '#fff', borderRadius: 14, padding: 20, border: '1px solid #E2E8F0' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>📊 Appointment Analytics</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 120, marginBottom: 12 }}>
          {[
            { label: 'Total', value: appointments.length, color: '#1D4ED8', bg: '#EFF6FF' },
            { label: 'Confirmed', value: confirmed.length, color: '#16A34A', bg: '#F0FDF4' },
            { label: 'Pending', value: pending.length, color: '#CA8A04', bg: '#FEFCE8' },
            { label: 'Cancelled', value: cancelled.length, color: '#DC2626', bg: '#FEF2F2' },
          ].map((bar, i) => {
            const maxVal = Math.max(appointments.length, 1);
            const height = Math.max((bar.value / maxVal) * 100, 4);
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: bar.color }}>{bar.value}</span>
                <motion.div initial={{ height: 0 }} animate={{ height: `${height}px` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                  style={{ width: '100%', backgroundColor: bar.color, borderRadius: '6px 6px 0 0', minHeight: 4 }} />
                <span style={{ fontSize: 10, color: '#94A3B8', textAlign: 'center' }}>{bar.label}</span>
              </div>
            );
          })}
        </div>
        <div style={{ padding: '10px 12px', borderRadius: 10, backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>Completion rate: <strong style={{ color: '#16A34A' }}>{appointments.length > 0 ? Math.round((confirmed.length / appointments.length) * 100) : 0}%</strong></p>
        </div>
      </div>

      {/* Donut-style Status Distribution */}
      <div style={{ backgroundColor: '#fff', borderRadius: 14, padding: 20, border: '1px solid #E2E8F0' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>🎯 Session Distribution</h3>
        {appointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <p style={{ fontSize: 28 }}>📊</p>
            <p style={{ fontSize: 13, color: '#94A3B8' }}>No appointment data yet</p>
          </div>
        ) : (
          <>
            {[
              { label: 'Confirmed', value: confirmed.length, color: '#16A34A', bg: '#F0FDF4' },
              { label: 'Pending', value: pending.length, color: '#CA8A04', bg: '#FEFCE8' },
              { label: 'Cancelled', value: cancelled.length, color: '#DC2626', bg: '#FEF2F2' },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.value} ({appointments.length > 0 ? Math.round((item.value / appointments.length) * 100) : 0}%)</span>
                </div>
                <div style={{ height: 8, backgroundColor: '#F1F5F9', borderRadius: 10, overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${appointments.length > 0 ? (item.value / appointments.length) * 100 : 0}%` }} transition={{ duration: 0.8, delay: i * 0.15 }}
                    style={{ height: '100%', backgroundColor: item.color, borderRadius: 10 }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 10, backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-around' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: '#16A34A', margin: 0 }}>{appointments.length > 0 ? Math.round((confirmed.length / appointments.length) * 100) : 0}%</p>
                <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>Success Rate</p>
              </div>
              <div style={{ width: 1, backgroundColor: '#E2E8F0' }} />
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: '#1D4ED8', margin: 0 }}>{uniqueStudents.length}</p>
                <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>Students</p>
              </div>
              <div style={{ width: 1, backgroundColor: '#E2E8F0' }} />
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: '#7E22CE', margin: 0 }}>{appointments.length}</p>
                <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>Total</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>

    {/* Monthly Activity + Recent */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 22 }}>
      {/* Weekly Breakdown */}
      <div style={{ backgroundColor: '#fff', borderRadius: 14, padding: 20, border: '1px solid #E2E8F0' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>📅 Workload Breakdown</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Avg Sessions/Week', value: appointments.length > 0 ? Math.ceil(appointments.length / 4) : 0, max: 20, color: '#1D4ED8' },
            { label: 'Student Engagement', value: uniqueStudents.length, max: Math.max(uniqueStudents.length || 10, 10), color: '#16A34A' },
            { label: 'Completion Rate', value: appointments.length > 0 ? Math.round((confirmed.length / appointments.length) * 100) : 0, max: 100, color: '#7E22CE', suffix: '%' },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: '#374151' }}>{item.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.value}{item.suffix || ''}</span>
              </div>
              <div style={{ height: 7, backgroundColor: '#F1F5F9', borderRadius: 10 }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }} transition={{ duration: 1, delay: i * 0.2 }}
                  style={{ height: '100%', backgroundColor: item.color, borderRadius: 10 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Card */}
      <div style={{ backgroundColor: '#fff', borderRadius: 14, padding: 20, border: '1px solid #E2E8F0' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>🏆 Performance Summary</h3>
        {[
          { label: 'Total Sessions Conducted', value: confirmed.length, icon: '✅', color: '#16A34A', bg: '#F0FDF4' },
          { label: 'Students Currently Helping', value: uniqueStudents.length, icon: '👥', color: '#1D4ED8', bg: '#EFF6FF' },
          { label: 'Pending Responses', value: pending.length, icon: '⏳', color: '#CA8A04', bg: '#FEFCE8' },
          { label: 'Sessions This Month', value: appointments.length, icon: '📊', color: '#7E22CE', bg: '#FDF4FF' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < 3 ? '1px solid #F1F5F9' : 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{item.icon}</div>
            <span style={{ fontSize: 13, color: '#374151', flex: 1 }}>{item.label}</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: item.color }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Recent Appointments Table */}
    <div style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E2E8F0' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Recent Appointments</h3>
        <button onClick={() => setActivePage('appointments')} style={{ fontSize: 12, color: '#1D4ED8', background: 'none', border: 'none', cursor: 'pointer' }}>View All →</button>
      </div>
      {loading ? <p style={{ textAlign: 'center', padding: 24, color: '#94A3B8' }}>Loading...</p>
        : appointments.length === 0 ? <p style={{ textAlign: 'center', padding: 32, color: '#94A3B8', fontSize: 13 }}>No appointments yet</p>
        : appointments.slice(0, 5).map((appt, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', borderBottom: i < 4 ? '1px solid #F8FAFC' : 'none' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1D4ED8', fontWeight: 700, fontSize: 16 }}>{appt.student?.name?.charAt(0) || 'S'}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', margin: 0 }}>{appt.student?.name || 'Student'}</p>
              <p style={{ fontSize: 11, color: '#94A3B8', margin: '2px 0 0' }}>{appt.date} • {appt.time}</p>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, backgroundColor: statusStyle[appt.status]?.bg, color: statusStyle[appt.status]?.color, border: `1px solid ${statusStyle[appt.status]?.border}` }}>{appt.status}</span>
            {appt.status === 'pending' && (
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => updateStatus(appt._id, 'confirmed')} style={{ padding: '5px 12px', background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 8, color: '#16A34A', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>✓ Confirm</button>
                <button onClick={() => updateStatus(appt._id, 'cancelled')} style={{ padding: '5px 12px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, color: '#DC2626', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>✗ Cancel</button>
              </div>
            )}
          </div>
        ))}
    </div>
  </>
)}

          {activePage === 'appointments' && (
            <>
              <div style={{ display: 'flex', gap: 6, marginBottom: 18, background: '#F1F5F9', borderRadius: 12, padding: 4 }}>
                {[{k:'all',l:`All (${appointments.length})`},{k:'pending',l:`Pending (${pending.length})`},{k:'confirmed',l:`Confirmed (${confirmed.length})`},{k:'cancelled',l:`Cancelled (${cancelled.length})`}].map(t => (
                  <button key={t.k} onClick={() => setActiveTab(t.k)} style={{ flex: 1, padding: '8px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, backgroundColor: activeTab === t.k ? '#a5b0f3' : 'transparent', color: activeTab === t.k ? '#0a183e' : '#64748B', boxShadow: activeTab === t.k ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>{t.l}</button>
                ))}
              </div>
              <div style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ backgroundColor: '#F8FAFC' }}>
                    {['Student', 'Date & Time', 'Reason', 'Status', 'Actions'].map(h => <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {filtered.length === 0 ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: '#94A3B8', fontSize: 13 }}>No appointments found</td></tr>
                      : filtered.map((appt, i) => (
                        <tr key={i} style={{ borderTop: '1px solid #9dc8f4' }}>
                          <td style={{ padding: '13px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1D4ED8', fontWeight: 700, fontSize: 14 }}>{appt.student?.name?.charAt(0)}</div>
                              <div>
                                <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', margin: 0 }}>{appt.student?.name}</p>
                                <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>{appt.student?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '13px 16px' }}>
                            <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: 0 }}>{appt.date}</p>
                            <p style={{ fontSize: 11, color: '#b6c6df', margin: '2px 0 0' }}>{appt.time}</p>
                          </td>
                          <td style={{ padding: '13px 16px', fontSize: 12, color: '#54647a' }}>{appt.reason || '—'}</td>
                          <td style={{ padding: '13px 16px' }}>
                            <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, backgroundColor: statusStyle[appt.status]?.bg, color: statusStyle[appt.status]?.color, border: `1px solid ${statusStyle[appt.status]?.border}` }}>{appt.status}</span>
                          </td>
                          <td style={{ padding: '13px 16px' }}>
                            {appt.status === 'pending' ? (
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button onClick={() => updateStatus(appt._id, 'confirmed')} style={{ padding: '5px 12px', background: '#edfbf1', border: '1px solid #86EFAC', borderRadius: 8, color: '#16A34A', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Confirm</button>
                                <button onClick={() => updateStatus(appt._id, 'cancelled')} style={{ padding: '5px 12px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, color: '#DC2626', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                              </div>
                            ) : <span style={{ fontSize: 12, color: '#94A3B8' }}>—</span>}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activePage === 'students' && (
            <div style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Students Who Booked Sessions</h3>
                <p style={{ fontSize: 12, color: '#94A3B8', margin: '2px 0 0' }}>{uniqueStudents.length} students total</p>
              </div>
              {uniqueStudents.length === 0 ? <div style={{ textAlign: 'center', padding: 48 }}><p style={{ fontSize: 36 }}>👥</p><p style={{ fontSize: 13, color: '#94A3B8' }}>No students yet</p></div>
                : uniqueStudents.map((s, i) => {
                  const sAppts = appointments.filter(a => a.student?._id === s?._id);
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: i < uniqueStudents.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
                      <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #1D4ED8, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18 }}>{s?.name?.charAt(0)}</div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', margin: 0 }}>{s?.name}</p>
                        <p style={{ fontSize: 12, color: '#94A3B8', margin: '2px 0 0' }}>{s?.email}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#1D4ED8', margin: 0 }}>{sAppts.length} sessions</p>
                        <p style={{ fontSize: 11, color: '#94A3B8', margin: '2px 0 0' }}>{sAppts.filter(a => a.status === 'confirmed').length} confirmed</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

         {/* {activePage === 'reports' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { title: 'Total Sessions', value: appointments.length, color: '#1D4ED8', bg: '#EFF6FF', icon: '📅' },
                { title: 'Completion Rate', value: appointments.length > 0 ? `${Math.round((confirmed.length / appointments.length) * 100)}%` : '0%', color: '#16A34A', bg: '#F0FDF4', icon: '✅' },
                { title: 'Students Helped', value: uniqueStudents.length, color: '#7E22CE', bg: '#FDF4FF', icon: '👥' },
                { title: 'Cancellation Rate', value: appointments.length > 0 ? `${Math.round((cancelled.length / appointments.length) * 100)}%` : '0%', color: '#DC2626', bg: '#FEF2F2', icon: '❌' },
              ].map((s, i) => (
                <div key={i} style={{ backgroundColor: '#fff', borderRadius: 14, padding: 24, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{s.icon}</div>
                  <div>
                    <p style={{ fontSize: 13, color: '#94A3B8', margin: 0 }}>{s.title}</p>
                    <p style={{ fontSize: 32, fontWeight: 800, color: s.color, margin: '4px 0 0' }}>{s.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
            */}

          {activePage === 'reports' && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '20px', background: '#F8FAFC', borderRadius: '30px' }}>
    
    {/* Header */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', margin: 0 }}>Dashboard Overview</h1>
        <p style={{ color: '#64748B', fontSize: '14px', marginTop: '8px' }}>Real-time performance metrics from your appointments</p>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', fontWeight: '600', fontSize: '14px' }}>
          Live Status: <span style={{ color: '#2563EB' }}>Active</span>
        </div>
      </div>
    </div>

    {/* Stat Cards - Exact Image Style with Real Data */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
      {[
        { label: 'Total Sessions', val: totalSessions, bg: '#2563EB', text: '#fff', sub: 'Across all time' },
        { label: 'Active Students', val: activeStudents, bg: '#fff', text: '#0F172A', sub: 'Unique users helped' },
        { label: 'Pending Requests', val: pendingCount, bg: '#fff', text: '#2563EB', sub: 'Awaiting action' },
        { label: 'Completion Rate', val: `${completionRate}%`, bg: '#fff', text: '#0F172A', sub: 'Confirmed sessions' },
      ].map((card, i) => (
        <div key={i} style={{ 
          background: card.bg, padding: '24px', borderRadius: '20px', 
          border: card.bg === '#fff' ? '1px solid #F1F5F9' : 'none',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
          <p style={{ fontSize: '13px', color: card.bg === '#fff' ? '#64748B' : '#BFDBFE', margin: 0, fontWeight: '600' }}>{card.label}</p>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: card.text, margin: '12px 0' }}>{card.val}</h2>
          <p style={{ fontSize: '11px', color: card.bg === '#fff' ? '#94A3B8' : '#BFDBFE', margin: 0 }}>{card.sub}</p>
        </div>
      ))}
    </div>

    {/* Charts Row */}
    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px' }}>
      
      {/* Dynamic Line Graph */}
      <div style={{ background: '#fff', padding: '32px', borderRadius: '24px', border: '1px solid #F1F5F9' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', marginBottom: '24px' }}>Weekly Engagement</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}
                cursor={{ stroke: '#2563EB', strokeWidth: 2 }}
              />
              <Area 
                type="monotone" 
                dataKey="sessions" 
                stroke="#2563EB" 
                strokeWidth={3} 
                fill="transparent" 
                dot={{ r: 4, fill: '#2563EB', strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 6, fill: '#2563EB' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dynamic Donut Chart */}
      <div style={{ background: '#fff', padding: '32px', borderRadius: '24px', border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>Session Health</p>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', margin: '4px 0' }}>{confirmedCount}</h2>
            <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '700' }}>Confirmed</span>
          </div>
          <div style={{ width: '140px', height: '140px' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie 
                  data={statusData} 
                  innerRadius={45} 
                  outerRadius={60} 
                  dataKey="value" 
                  stroke="none"
                  paddingAngle={5}
                >
                  {statusData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
           {statusData.map((s, i) => (
             <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i !== 2 ? '1px solid #F1F5F9' : 'none' }}>
               <span style={{ fontSize: '13px', color: '#64748B' }}>● {s.name}</span>
               <span style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>{s.value}</span>
             </div>
           ))}
        </div>
      </div>

    </div>
  </motion.div>
)}

          {activePage === 'settings' && (
            <div style={{ backgroundColor: '#fff', borderRadius: 14, padding: 24, border: '1px solid #E2E8F0', maxWidth: 480 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 20px' }}>Account Settings</h3>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Full Name</label>
                <input defaultValue={user?.name} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#0F172A' }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Email</label>
                <input defaultValue={user?.email} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#0F172A' }} />
              </div>
              <button style={{ padding: '11px 24px', background: '#1D4ED8', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Save Changes</button>
            </div>
          )} 
        </div>
      </main>
    </div>
  );
};

export default CounsellorDashboard;