
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Home, Users, Calendar, BarChart3, LogOut, Settings, Bell, Search, Shield } from 'lucide-react';

const NOTIF_KEY = 'mindcare_notifications';
const getNotifs = () => { try { return JSON.parse(localStorage.getItem(NOTIF_KEY) || '[]'); } catch { return []; } };

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [students, setStudents] = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [activePage, setActivePage] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState(getNotifs());
  const [appointments, setAppointments] = useState([]); // Add this new state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const [sRes, cRes, aRes ] = await Promise.all([
          axios.get('http://localhost:5000/api/users/students', { headers }),
          axios.get('http://localhost:5000/api/users/counsellors', { headers }),
          
          
        ]);
        setStudents(sRes.data);
        setCounsellors(cRes.data);
        
      
        
        const existing = getNotifs();
        const id = 'admin-login-' + new Date().toDateString();
        if (!existing.find(n => n.id === id)) {
          const updated = [{ id, icon: '🏥', text: `Platform active — ${sRes.data.length} students, ${cRes.data.length} counsellors`, time: 'Now', read: false }, ...existing].slice(0, 15);
          localStorage.setItem(NOTIF_KEY, JSON.stringify(updated));
          setNotifications(updated);
        }
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); };
  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredStudents = students.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()));
  const filteredCounsellors = counsellors.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()));

 

  const navSections = [
    { label: 'MAIN', items: [
      { icon: <Home size={17} />, label: 'Overview', key: 'overview' },
      { icon: <Users size={17} />, label: 'Students', key: 'students', badge: students.length },
      { icon: <Shield size={17} />, label: 'Counsellors', key: 'counsellors', badge: counsellors.length },
    ]},
    { label: 'ANALYTICS', items: [
      { icon: <Calendar size={17} />, label: 'Appointments', key: 'appointments' },
      { icon: <BarChart3 size={17} />, label: 'Analytics', key: 'analytics' },
    ]},
    
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'system-ui, sans-serif' }}>

      
      <aside style={{ width: 230, backgroundColor:  '#242734', borderRight: '1px solid #1E293B', display: 'flex', flexDirection: 'column', flexShrink: 0, boxShadow: '1px 0 8px rgba(0,0,0,0.04)' }}>
        <div style={{ padding: '22px 20px 16px', borderBottom: '1px solid #1E293B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1D4ED8, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🧠</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>MindCare</div>
              <div style={{ fontSize: 10, color: '#19a6fd' }}>Admin Console</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '14px 20px', borderBottom: '1px solid #1E293B', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1D4ED8, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 15 }}>{user?.name?.charAt(0)}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#c0cfdd' }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: '#22C55E' }}>System Administrator</div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '16px 10px', overflowY: 'auto' }}>
          {navSections.map((section, si) => (
            <div key={si} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#598ccb', letterSpacing: '0.1em', padding: '0 8px 8px', marginBottom: 4 }}>{section.label}</div>
              {section.items.map(item => (
                <button key={item.key} onClick={() => setActivePage(item.key)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, fontSize: 13, fontWeight: activePage === item.key ? 600 : 400, border: 'none', cursor: 'pointer', marginBottom: 2, backgroundColor: activePage === item.key ? '#332d51' : 'transparent', color: activePage === item.key ? '#bbbbd2' : '#d4dce6' }}>
                  {item.icon}
                  <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                  {item.badge !== undefined && <span style={{ background: activePage === item.key ? '#6366F1' : '#d2e1f6', color: activePage === item.key ? '#efd5d5' : '#64748B', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 20 }}>{item.badge}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div style={{ padding: '12px', borderTop: '1px solid #d6e2f0' }}>
          <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: '1px solid #272020', cursor: 'pointer', backgroundColor: '#413838', color: '#ec6d6d', fontSize: 13, fontWeight: 600 }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #E2E8F0', padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: '8px 14px' }}>
              <Search size={14} color="#94A3B8" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
                style={{ border: 'none', outline: 'none', fontSize: 13, backgroundColor: 'transparent', color: '#374151', width: 180 }} />
            </div>
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
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: 0 }}>🔔 System Alerts</p>
                    <button onClick={() => { const u = notifications.map(n => ({...n, read: true})); localStorage.setItem(NOTIF_KEY, JSON.stringify(u)); setNotifications(u); }} style={{ fontSize: 11, color: '#6366F1', background: 'none', border: 'none', cursor: 'pointer' }}>Clear all</button>
                  </div>
                  {notifications.slice(0, 5).map((n, i) => (
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>{user?.name?.charAt(0)}</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', margin: 0 }}>{user?.name}</p>
                <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>Administrator</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '24px 28px' }}>
          {activePage === 'overview' && (
            <>
              <div style={{ marginBottom: 22 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>System Overview</h2>
                <p style={{ fontSize: 13, color: '#94A3B8', margin: 0 }}>MindCare platform statistics</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 22 }}>
                {[
                  { label: 'Total Students', value: students.length, icon: '👨‍🎓', color: '#1D4ED8', bg: '#EFF6FF', change: '+12%' },
                  { label: 'Counsellors', value: counsellors.length, icon: '👨‍⚕️', color: '#16A34A', bg: '#F0FDF4', change: '+5%' },
                  { label: 'Total Users', value: students.length + counsellors.length, icon: '👥', color: '#7E22CE', bg: '#FDF4FF', change: '+8%' },
                  { label: 'Platform', value: 'Active', icon: '✅', color: '#CA8A04', bg: '#FEFCE8', change: '100%' },
                ].map((s, i) => (
                  <motion.div key={i} whileHover={{ y: -3 }} style={{ backgroundColor: '#fff', borderRadius: 14, padding: '20px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{s.icon}</div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#16A34A', background: '#F0FDF4', padding: '2px 8px', borderRadius: 20 }}>{s.change}</span>
                    </div>
                    <p style={{ fontSize: 28, fontWeight: 800, color: s.color, margin: '0 0 4px' }}>{s.value}</p>
                    <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>{s.label}</p>
                  </motion.div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[{title:'Recent Students', data: students.slice(0,5), color:'#1D4ED8', bg:'#EFF6FF', page:'students'}, {title:'Counsellors', data: counsellors.slice(0,5), color:'#16A34A', bg:'#F0FDF4', page:'counsellors'}].map((col, ci) => (
                  <div key={ci} style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E2E8F0' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between' }}>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: 0 }}>{col.title}</h3>
                      <button onClick={() => setActivePage(col.page)} style={{ fontSize: 12, color: col.color, background: 'none', border: 'none', cursor: 'pointer' }}>View All</button>
                    </div>
                    {col.data.map((u, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', borderBottom: i < col.data.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: col.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: col.color, fontWeight: 700, fontSize: 13 }}>{u.name?.charAt(0)}</div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', margin: 0 }}>{u.name}</p>
                          <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>{u.email}</p>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#16A34A', background: '#F0FDF4', padding: '2px 8px', borderRadius: 20 }}>Active</span>
                      </div>
                    ))}
                    {col.data.length === 0 && <p style={{ textAlign: 'center', padding: 24, color: '#94A3B8', fontSize: 13 }}>None yet</p>}
                  </div>
                ))}
              </div>
            </>
          )}

          {activePage === 'students' && (
            <div style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 2px' }}>All Students</h3>
                <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>{filteredStudents.length} students registered</p>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ backgroundColor: '#F8FAFC' }}>
                  {['#', 'Name', 'Email', 'Joined', 'Status'].map(h => <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {loading ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: '#94A3B8' }}>Loading...</td></tr>
                    : filteredStudents.map((s, i) => (
                      <tr key={i} style={{ borderTop: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '13px 16px', fontSize: 12, color: '#94A3B8' }}>{i + 1}</td>
                        <td style={{ padding: '13px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1D4ED8', fontWeight: 700, fontSize: 14 }}>{s.name?.charAt(0)}</div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{s.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: 12, color: '#64748B' }}>{s.email}</td>
                        <td style={{ padding: '13px 16px', fontSize: 12, color: '#64748B' }}>{new Date(s.createdAt).toLocaleDateString('en-IN')}</td>
                        <td style={{ padding: '13px 16px' }}><span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, backgroundColor: '#F0FDF4', color: '#16A34A', border: '1px solid #86EFAC' }}>Active</span></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {activePage === 'counsellors' && (
            <div style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 2px' }}>All Counsellors</h3>
                <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>{filteredCounsellors.length} counsellors registered</p>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ backgroundColor: '#F8FAFC' }}>
                  {['#', 'Name', 'Email', 'Joined', 'Status'].map(h => <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {filteredCounsellors.map((c, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '13px 16px', fontSize: 12, color: '#94A3B8' }}>{i + 1}</td>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A', fontWeight: 700, fontSize: 14 }}>{c.name?.charAt(0)}</div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{c.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 12, color: '#64748B' }}>{c.email}</td>
                      <td style={{ padding: '13px 16px', fontSize: 12, color: '#64748B' }}>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                      <td style={{ padding: '13px 16px' }}><span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, backgroundColor: '#F0FDF4', color: '#16A34A', border: '1px solid #86EFAC' }}>Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

            {activePage === 'appointments' && (
            <div style={{ backgroundColor: '#fff', borderRadius: 14, padding: 28, border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <p style={{ fontSize: 40, margin: '0 0 12px' }}>📅</p>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: '0 0 8px' }}>Appointments Overview</h3>
              <p style={{ fontSize: 13, color: '#94A3B8', margin: '0 0 20px' }}>All counsellor-student sessions across the platform</p>
              <div style={{ display: 'inline-flex', gap: 10 }}>
                <div style={{ padding: '10px 20px', background: '#EFF6FF', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#1D4ED8', border: '1px solid #BFDBFE' }}>👨‍🎓 {students.length} Students</div>
                <div style={{ padding: '10px 20px', background: '#F0FDF4', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#16A34A', border: '1px solid #86EFAC' }}>👨‍⚕️ {counsellors.length} Counsellors</div>
              </div>
            </div>
          )} 

          
          
        
           
        
          {activePage === 'analytics' && (
            <div>
              <div style={{ marginBottom: 22 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>Platform Analytics</h2>
                <p style={{ fontSize: 13, color: '#94A3B8', margin: 0 }}>Real-time platform insights</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 22 }}>
                {[
                  { label: 'Total Users', value: students.length + counsellors.length, color: '#1D4ED8', bg: '#EFF6FF', icon: '👥', sub: 'All accounts' },
                  { label: 'Students', value: students.length, color: '#7E22CE', bg: '#FDF4FF', icon: '👨‍🎓', sub: 'Active learners' },
                  { label: 'Counsellors', value: counsellors.length, color: '#16A34A', bg: '#F0FDF4', icon: '👨‍⚕️', sub: 'Health experts' },
                  { label: 'Platform Health', value: '100%', color: '#CA8A04', bg: '#FEFCE8', icon: '💚', sub: 'All systems active' },
                ].map((s, i) => (
                  <div key={i} style={{ backgroundColor: '#fff', borderRadius: 14, padding: '18px', border: '1px solid #E2E8F0' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 12 }}>{s.icon}</div>
                    <p style={{ fontSize: 26, fontWeight: 800, color: s.color, margin: '0 0 2px' }}>{s.value}</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 2px' }}>{s.label}</p>
                    <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>{s.sub}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ backgroundColor: '#fff', borderRadius: 14, padding: 20, border: '1px solid #E2E8F0' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>👥 User Distribution</h3>
                  {[{label:'Students', count: students.length, color: '#1D4ED8'}, {label:'Counsellors', count: counsellors.length, color: '#16A34A'}].map((item, i) => (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, color: '#374151' }}>{item.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{students.length + counsellors.length > 0 ? Math.round((item.count / (students.length + counsellors.length)) * 100) : 0}%</span>
                      </div>
                      <div style={{ height: 8, backgroundColor: '#F1F5F9', borderRadius: 10, overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${students.length + counsellors.length > 0 ? (item.count / (students.length + counsellors.length)) * 100 : 0}%` }} transition={{ duration: 1 }}
                          style={{ height: '100%', backgroundColor: item.color, borderRadius: 10 }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ backgroundColor: '#fff', borderRadius: 14, padding: 20, border: '1px solid #E2E8F0' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>📊 Platform Metrics</h3>
                  {[
                    { label: 'Student:Counsellor Ratio', value: counsellors.length > 0 ? `${Math.round(students.length/counsellors.length)}:1` : 'N/A', color: '#1D4ED8' },
                    { label: 'Platform Uptime', value: '99.9%', color: '#16A34A' },
                    { label: 'Active Features', value: '7', color: '#7E22CE' },
                    { label: 'Data Encryption', value: 'AES-256', color: '#CA8A04' },
                  ].map((m, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: i < 3 ? '1px solid #F1F5F9' : 'none' }}>
                      <span style={{ fontSize: 13, color: '#64748B' }}>{m.label}</span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: m.color }}>{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden', marginTop: 16 }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: 0 }}>🕐 Recent Registrations</h3>
                </div>
                {[...students, ...counsellors].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5).map((u, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', borderBottom: i < 4 ? '1px solid #F8FAFC' : 'none' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: u.role === 'student' ? '#EFF6FF' : '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: u.role === 'student' ? '#1D4ED8' : '#16A34A', fontWeight: 700, fontSize: 14 }}>{u.name?.charAt(0)}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', margin: 0 }}>{u.name}</p>
                      <p style={{ fontSize: 11, color: '#94A3B8', margin: '1px 0 0' }}>{u.email}</p>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, backgroundColor: u.role === 'student' ? '#EFF6FF' : '#F0FDF4', color: u.role === 'student' ? '#1D4ED8' : '#16A34A', textTransform: 'capitalize' }}>{u.role}</span>
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>{new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;



