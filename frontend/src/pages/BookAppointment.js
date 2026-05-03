
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, CheckCircle, MapPin, Video, Phone, MessageSquare } from 'lucide-react';
import axios from 'axios';
import FloatingRobot from './FloatingRobot';


const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

const appointmentModes = [
  { id: 'video', label: 'Video Call', icon: <Video size={18} /> },
  { id: 'audio', label: 'Audio Call', icon: <Phone size={18} /> },
  { id: 'chat', label: 'Chat Session', icon: <MessageSquare size={18} /> }
];

const BookAppointment = () => {
  const navigate = useNavigate();
  const [counsellors, setCounsellors] = useState([]);
  const [formData, setFormData] = useState({
    counsellorId: '',
    date: '',
    time: '',
    mode: 'video', // default mode
    reason: ''
  });
  const [booked, setBooked] = useState(false);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    const fetchCounsellors = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/users/counsellors', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCounsellors(res.data);
      } catch (err) { console.error("Error fetching counsellors", err); }
    };
    fetchCounsellors();
  }, []);

  const handleBooking = async () => {
    if (!formData.counsellorId || !formData.date || !formData.time) {
      alert("Please complete the required fields.");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/appointments', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooked(true);
    } catch (err) {
      console.error(err);
      alert("Booking failed. Try again.");
    } finally { setLoading(false); }
  };

  if (booked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white p-10 rounded-2xl shadow-sm text-center border border-gray-100">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed</h2>
          <p className="text-gray-500 mb-8">Your {formData.mode} session has been successfully scheduled. You can view details in your dashboard.</p>
          <button onClick={() => navigate('/dashboard')} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">Return to Dashboard</button>
          
          
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 font-sans">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold">M</div>
          <span className="font-bold text-lg tracking-tight">MindCare</span>
        </div>
       {/* <button onClick={() => navigate('/dashboard')} className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition">Back to Dashboard</button> */}
       <button onClick={() => navigate('/dashboard')} style={{ padding: '7px 16px', background: '#EFF6FF', border: 'none', borderRadius: 8, color: '#1D4ED8', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          ← Back to Dashboard
          </button>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-8">
            <header>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Schedule a Session</h1>
              <p className="text-gray-500 mt-2">Connect with our certified mental health professionals.</p>
            </header>

            {/* Step 1: Appointment Mode */}
            <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-6 uppercase text-xs tracking-widest text-indigo-600">
                <CheckCircle size={16} /> 01. Select Mode
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {appointmentModes.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setFormData({...formData, mode: m.id})}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${formData.mode === m.id ? 'border-indigo-600 bg-indigo-50/30 text-indigo-600' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}
                  >
                    {m.icon}
                    <span className="text-xs font-bold">{m.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Step 2: Select Counsellor */}
            <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-6 uppercase text-xs tracking-widest text-indigo-600">
                <User size={16} /> 02. Select Expert
              </h3>
              <div className="space-y-3">
                {counsellors.map((c) => (
                  <label key={c._id} className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${formData.counsellorId === c._id ? 'border-indigo-600 bg-indigo-50/20' : 'border-gray-100 hover:border-gray-200'}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold capitalize">{c.name.charAt(0)}</div>
                      <div>
                        <p className="font-bold text-gray-800">{c.name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12}/> Professional Counselor</p>
                      </div>
                    </div>
                    <input type="radio" name="counsellor" className="hidden" onChange={() => setFormData({...formData, counsellorId: c._id})} />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.counsellorId === c._id ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'}`}>
                      {formData.counsellorId === c._id && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Step 3: Date & Time */}
            <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-6 uppercase text-xs tracking-widest text-indigo-600">
                <Calendar size={16} /> 03. Date & Time
              </h3>
              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Pick Date</label>
                  <input 
                    type="date" 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-indigo-600 transition" 
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Time Slot</label>
                    <select 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-indigo-600 transition"
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                    >
                        <option value="">Select a time</option>
                        {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
              </div>
              <div className="space-y-4">
                 <label className="block text-xs font-bold text-gray-400 uppercase">Reason for Session (Optional)</label>
                 <textarea 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-indigo-600 transition resize-none h-24 text-sm"
                    placeholder="Briefly describe what's on your mind..."
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                 />
              </div>
            </section>

            <button 
              onClick={handleBooking}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all disabled:bg-indigo-300"
            >
              {loading ? "Processing..." : "Complete Booking"}
            </button>
          </div>

          <div className="lg:col-span-1">
             <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-28 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-6">Booking Summary</h4>
                <div className="space-y-4 text-sm">
                   <div className="flex justify-between border-b border-gray-50 pb-4">
                      <span className="text-gray-400">Mode</span>
                      <span className="font-bold text-indigo-600 capitalize">{formData.mode}</span>
                   </div>
                   <div className="flex justify-between border-b border-gray-50 pb-4">
                      <span className="text-gray-400">Expert</span>
                      <span className="font-bold text-gray-700">{counsellors.find(c => c._id === formData.counsellorId)?.name || '---'}</span>
                   </div>
                   <div className="flex justify-between border-b border-gray-50 pb-4">
                      <span className="text-gray-400">Date</span>
                      <span className="font-bold text-gray-700">{formData.date || '---'}</span>
                   </div>
                   <div className="flex justify-between border-b border-gray-50 pb-4">
                      <span className="text-gray-400">Time</span>
                      <span className="font-bold text-gray-700">{formData.time || '---'}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>
      <FloatingRobot 
message="Your time matters—book a session and take care of yourself 💙"
/>

    </div>
  );
};

export default BookAppointment;