import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageSquare, ClipboardCheck, Calendar, BarChart3, Shield, ChevronRight, ChevronLeft, Star, Phone, Mail, MapPin, ArrowRight, Activity, Brain, Users } from 'lucide-react';

const heroSlides = [
  { title: "Your Mental Health", highlight: "is Our Priority.", desc: "A clinically designed digital support system for college students — mood tracking, AI counselling, and professional appointments all in one place." },
  { title: "Break the Stigma,", highlight: "Seek Support.", desc: "MindCare provides anonymous, stigma-free mental health care for students across Jammu & Kashmir's higher education institutions." },
  { title: "Professional Care,", highlight: "Anytime. Anywhere.", desc: "Connect with certified counsellors, take validated assessments, and get 24/7 AI-powered mental health support." },
];

const testimonials = [
  { name: 'Rahul S.', role: 'Engineering Student', text: 'MindCare helped me manage my exam anxiety. The AI chatbot is always there when I need it.', color: '#0057B8' },
  { name: 'Priya M.', role: 'Medical Student', text: 'The mood tracker revealed patterns I never noticed. I feel so much more in control now.', color: '#0F6E56' },
  { name: 'Arjun K.', role: 'MBA Student', text: 'Booking a session was effortless. The anonymous support made me feel safe to open up.', color: '#EA580C' },
  { name: 'Sneha R.', role: 'Arts Student', text: 'I was hesitant at first but MindCare made me feel so comfortable. Truly life-changing!', color: '#7C3AED' },
  { name: 'Vikram P.', role: 'Science Student', text: 'The PHQ-9 assessment helped me understand my mental state better. Highly recommend!', color: '#0284C7' },
];

const features = [
  { icon: <Heart size={22} />, title: 'Mood Tracker', desc: 'Clinically track your daily emotional wellbeing with evidence-based mood monitoring.', color: '#FFF0F3', text: '#E11D48' },
  { icon: <Brain size={22} />, title: 'AI Mental Health Assistant', desc: 'Talk to our NIMHANS-aligned AI assistant — confidential, compassionate, 24/7.', color: '#EFF6FF', text: '#0057B8' },
  { icon: <ClipboardCheck size={22} />, title: 'PHQ-9 & GAD-7 Screening', desc: 'WHO-approved depression and anxiety screening with instant clinical insights.', color: '#F0FDF4', text: '#16A34A' },
  { icon: <Calendar size={22} />, title: 'Counsellor Appointments', desc: 'Book private sessions with certified mental health professionals instantly.', color: '#FFF7ED', text: '#EA580C' },
  { icon: <Activity size={22} />, title: 'Progress & Reports', desc: 'Track your mental health journey with visual progress reports over time.', color: '#F0F9FF', text: '#0284C7' },
  { icon: <Shield size={22} />, title: 'HIPAA-Compliant & Safe', desc: 'Your data is fully encrypted. Complete anonymity and privacy guaranteed.', color: '#F5F3FF', text: '#7C3AED' },
  { icon: <Users size={22} />, title: 'Peer Support Community', desc: 'Anonymous peer support groups moderated by trained counsellors.', color: '#F0FDF4', text: '#0F6E56' },
  { icon: <BarChart3 size={22} />, title: 'Wellness Analytics', desc: 'AI-powered insights into your mental health patterns and triggers.', color: '#FFF0F3', text: '#E11D48' },
];

const stats = [
  { end: 10000, suffix: '+', label: 'Students Helped' },
  { end: 500, suffix: '+', label: 'Certified Counsellors' },
  { end: 98, suffix: '%', label: 'Satisfaction Rate' },
  { end: 24, suffix: '/7', label: 'AI Support' },
];

const navLinks = [
  { label: 'Services', id: 'features' },
  { label: 'About', id: 'how-it-works' },
  { label: 'Research', id: 'testimonials' },
  { label: 'Support', id: 'cta' },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [heroIndex, setHeroIndex] = useState(0);
  const [testIndex, setTestIndex] = useState(0);
  const [counts, setCounts] = useState(stats.map(() => 0));
  const [counted, setCounted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setHeroIndex(prev => (prev + 1) % heroSlides.length), 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTestIndex(prev => (prev + 1) % testimonials.length), 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (counted) return;
    setCounted(true);
    stats.forEach((stat, i) => {
      let start = 0;
      const step = stat.end / (2000 / 16);
      const timer = setInterval(() => {
        start += step;
        if (start >= stat.end) { start = stat.end; clearInterval(timer); }
        setCounts(prev => { const n = [...prev]; n[i] = Math.floor(start); return n; });
      }, 16);
    });
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const visibleTests = [
    testimonials[testIndex % testimonials.length],
    testimonials[(testIndex + 1) % testimonials.length],
    testimonials[(testIndex + 2) % testimonials.length],
  ];

  return (
    <div style={{ backgroundColor: '#F8FAFF', fontFamily: 'system-ui, sans-serif' }}>

      {/* Navbar */}
      <nav style={{ backgroundColor: '#fff', borderBottom: '1px solid #E5E7EB', padding: '14px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#0057B8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 20 }}>🧠</span>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#0057B8' }}>MindCare</div>
            <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 500 }}>Digital Mental Health Platform</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          {navLinks.map(l => (
            <a key={l.label}
              href={`#${l.id}`}
              onClick={(e) => { e.preventDefault(); scrollTo(l.id); }}
              style={{ color: '#374151', fontSize: 14, fontWeight: 500, textDecoration: 'none', cursor: 'pointer' }}>
              {l.label}
            </a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={() => navigate('/login')} style={{ padding: '9px 20px', background: 'transparent', border: '1.5px solid #0057B8', borderRadius: 8, color: '#0057B8', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Sign In</button>
          <button onClick={() => navigate('/register')} style={{ padding: '10px 22px', background: '#0057B8', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Get Started Free</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #EBF4FF 0%, #F0F9FF 50%, #E8F5E9 100%)', padding: '80px 48px 100px', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 48 }}>
          <div style={{ maxWidth: 560 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', padding: '6px 16px', borderRadius: 20, marginBottom: 24, border: '1px solid #BFDBFE' }}>
              <div style={{ width: 8, height: 8, background: '#22C55E', borderRadius: '50%' }}></div>
              <span style={{ color: '#0057B8', fontSize: 12, fontWeight: 600 }}>🏥 Govt. of Andhra Pradesh — Higher Education Dept.</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={heroIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                <h1 style={{ fontSize: 50, fontWeight: 900, color: '#0A2647', lineHeight: 1.15, marginBottom: 20 }}>
                  {heroSlides[heroIndex].title}<br />
                  <span style={{ color: '#0057B8' }}>{heroSlides[heroIndex].highlight}</span>
                </h1>
                <p style={{ color: '#4B5563', fontSize: 17, lineHeight: 1.7, marginBottom: 36 }}>
                  {heroSlides[heroIndex].desc}
                </p>
              </motion.div>
            </AnimatePresence>

            <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
              {heroSlides.map((_, i) => (
                <div key={i} onClick={() => setHeroIndex(i)} style={{ height: 4, borderRadius: 2, background: i === heroIndex ? '#0057B8' : '#BFDBFE', width: i === heroIndex ? 32 : 12, cursor: 'pointer', transition: 'all 0.3s' }}></div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 14, marginBottom: 36 }}>
              <button onClick={() => navigate('/register')} style={{ padding: '14px 32px', background: '#0057B8', border: 'none', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                Start for Free <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate('/login')} style={{ padding: '14px 32px', border: '2px solid #0057B8', borderRadius: 10, background: '#fff', color: '#0057B8', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                Sign In
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex' }}>
                {['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'].map((c, i) => (
                  <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: c, border: '2px solid #fff', marginLeft: i === 0 ? 0 : -10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>
                    {['R', 'P', 'A', 'S', 'K'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} style={{ fill: '#FBBF24', color: '#FBBF24' }} />)}
                </div>
                <span style={{ color: '#6B7280', fontSize: 13 }}><strong style={{ color: '#111827' }}>10,000+</strong> students trust MindCare</span>
              </div>
            </div>
          </div>

          {/* Hero Card */}
          <div style={{ background: '#fff', borderRadius: 24, padding: 20, width: 320, flexShrink: 0, border: '1px solid #E5E7EB', boxShadow: '0 8px 32px rgba(0,87,184,0.1)' }}>
            <div style={{ background: '#EBF4FF', borderRadius: 16, padding: 16, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#0057B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>😊</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#0A2647' }}>Daily Mood Check-in</div>
                  <div style={{ fontSize: 11, color: '#6B7280' }}>How are you feeling today?</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {['😄', '😌', '😔', '😰', '😠'].map((m, i) => (
                  <div key={i} style={{ fontSize: 20, padding: '7px 9px', borderRadius: 8, background: i === 0 ? '#BFDBFE' : '#F9FAFB', cursor: 'pointer', border: i === 0 ? '1.5px solid #0057B8' : '1.5px solid transparent' }}>{m}</div>
                ))}
              </div>
            </div>
            <div style={{ background: '#F0FDF4', borderRadius: 16, padding: 16, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, background: '#22C55E', borderRadius: '50%' }}></div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#0F6E56', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Health Assistant • Online</span>
              </div>
              <div style={{ background: '#fff', borderRadius: 10, padding: '9px 12px', marginBottom: 6, fontSize: 12, color: '#0A2647' }}>Hi! I'm your MindCare assistant 💙 How are you feeling?</div>
              <div style={{ background: '#E8F5E9', borderRadius: 10, padding: '9px 12px', marginBottom: 6, fontSize: 12, color: '#374151', textAlign: 'right' }}>Stressed about exams...</div>
              <div style={{ background: '#fff', borderRadius: 10, padding: '9px 12px', fontSize: 12, color: '#0A2647' }}>I understand. Let's try a calming exercise 🧘</div>
            </div>
            <div style={{ background: '#FFF7ED', borderRadius: 16, padding: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>📋</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0A2647' }}>PHQ-9 Assessment</div>
                <div style={{ fontSize: 11, color: '#6B7280' }}>WHO-approved screening • 5 mins</div>
              </div>
              <div onClick={() => navigate('/register')} style={{ marginLeft: 'auto', padding: '4px 10px', background: '#0057B8', borderRadius: 6, color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Take Now</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#0057B8', padding: '48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: '#fff', marginBottom: 6 }}>{counts[i]}{s.suffix}</div>
              <div style={{ color: '#BFDBFE', fontSize: 14 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '80px 0', background: '#fff' }}>
        <div style={{ textAlign: 'center', marginBottom: 48, padding: '0 48px' }}>
          <div style={{ color: '#0057B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Clinical Features</div>
          <h2 style={{ fontSize: 38, fontWeight: 900, color: '#0A2647', marginBottom: 12 }}>Comprehensive Mental Health Care</h2>
          <p style={{ color: '#6B7280', fontSize: 15, maxWidth: 500, margin: '0 auto' }}>Evidence-based tools designed with mental health professionals</p>
        </div>
        <div style={{ overflowX: 'auto', paddingBottom: 16, scrollbarWidth: 'none' }}>
          <div style={{ display: 'flex', gap: 20, padding: '8px 48px', width: 'max-content' }}>
            {features.map((f, i) => (
              <motion.div key={i} whileHover={{ y: -6 }}
                style={{ width: 240, padding: 22, borderRadius: 16, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', flexShrink: 0 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: f.color, color: f.text, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#0A2647', marginBottom: 8 }}>{f.title}</div>
                <div style={{ color: '#6B7280', fontSize: 12, lineHeight: 1.6 }}>{f.desc}</div>
                <div style={{ color: f.text, fontSize: 12, fontWeight: 600, marginTop: 12, display: 'flex', alignItems: 'center', gap: 4 }}>Learn more <ChevronRight size={13} /></div>
              </motion.div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 8, color: '#9CA3AF', fontSize: 12 }}>← Scroll to explore features →</div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ background: '#EBF4FF', padding: '80px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ color: '#0057B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Process</div>
          <h2 style={{ fontSize: 38, fontWeight: 900, color: '#0A2647', marginBottom: 12 }}>How MindCare Works</h2>
          <p style={{ color: '#4B5563', fontSize: 15, marginBottom: 48 }}>Get started in 3 simple steps</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
            {[
              { n: '01', t: 'Create Your Account', d: 'Register free with your college email. Your identity stays anonymous.', icon: '👤' },
              { n: '02', t: 'Take a Screening', d: 'Complete a WHO-approved PHQ-9 or GAD-7 assessment in 5 minutes.', icon: '📋' },
              { n: '03', t: 'Get Professional Support', d: 'Chat with AI, track mood daily, or book a certified counsellor session.', icon: '💊' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }}>
                <div style={{ width: 60, height: 60, borderRadius: 16, background: '#0057B8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', flexDirection: 'column' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: '#BFDBFE' }}>{s.n}</div>
                  <div style={{ fontSize: 22 }}>{s.icon}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 17, color: '#0A2647', marginBottom: 10 }}>{s.t}</div>
                <div style={{ color: '#4B5563', fontSize: 14, lineHeight: 1.6 }}>{s.d}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" style={{ padding: '80px 48px', background: '#fff', overflow: 'hidden' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ color: '#0057B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Patient Stories</div>
          <h2 style={{ fontSize: 38, fontWeight: 900, color: '#0A2647' }}>What Students Say</h2>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            <AnimatePresence mode="wait">
              {visibleTests.map((t, i) => (
                <motion.div key={`${testIndex}-${i}`}
                  initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  style={{ padding: 24, borderRadius: 16, border: '1px solid #E5E7EB', background: '#F8FAFF' }}>
                  <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                    {[...Array(5)].map((_, j) => <Star key={j} size={14} style={{ fill: '#FBBF24', color: '#FBBF24' }} />)}
                  </div>
                  <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.7, marginBottom: 18, fontStyle: 'italic' }}>"{t.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 14, borderTop: '1px solid #E5E7EB' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: t.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>{t.name.charAt(0)}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#0A2647' }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: '#9CA3AF' }}>{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24, alignItems: 'center' }}>
            <button onClick={() => setTestIndex(prev => (prev - 1 + testimonials.length) % testimonials.length)}
              style={{ width: 34, height: 34, borderRadius: '50%', border: '1.5px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={16} color="#6B7280" />
            </button>
            {testimonials.map((_, i) => (
              <div key={i} onClick={() => setTestIndex(i)} style={{ width: 7, height: 7, borderRadius: '50%', background: i === testIndex % testimonials.length ? '#0057B8' : '#E5E7EB', cursor: 'pointer', transition: 'all 0.3s' }}></div>
            ))}
            <button onClick={() => setTestIndex(prev => (prev + 1) % testimonials.length)}
              style={{ width: 34, height: 34, borderRadius: '50%', border: '1.5px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronRight size={16} color="#6B7280" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" style={{ padding: '80px 48px', background: '#EBF4FF' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', background: '#0057B8', borderRadius: 24, padding: '60px 48px', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', padding: '4px 16px', borderRadius: 20, color: '#fff', fontSize: 12, fontWeight: 600, marginBottom: 16 }}>
            🏥 Government of Andhra Pradesh Initiative
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 12 }}>Begin Your Mental Health Journey Today</h2>
          <p style={{ color: '#BFDBFE', fontSize: 15, marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>Join thousands of students receiving professional mental health support through MindCare.</p>
          <button onClick={() => navigate('/register')} style={{ padding: '14px 36px', background: '#fff', border: 'none', borderRadius: 10, color: '#0057B8', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Get Started for Free <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0A2647', padding: '56px 48px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, maxWidth: 1100, margin: '0 auto 32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 22 }}>🧠</span>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>MindCare</span>
            </div>
            <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>Digital Mental Health Support System for Higher Education Students.</p>
            <div style={{ display: 'inline-block', background: '#1E3A5F', padding: '4px 12px', borderRadius: 6, color: '#BFDBFE', fontSize: 11, fontWeight: 600 }}>Govt. of AP Initiative</div>
          </div>
          {[
            { h: 'Services', items: ['Mood Tracker', 'AI Chatbot', 'PHQ-9 Screening', 'Counselling'] },
            { h: 'Support', items: ['Help Center', 'Privacy Policy', 'Terms of Service', 'Contact Us'] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 16 }}>{col.h}</div>
              {col.items.map(item => <div key={item} style={{ color: '#6B7280', fontSize: 13, marginBottom: 10 }}>{item}</div>)}
            </div>
          ))}
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Emergency Support</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6B7280', fontSize: 13, marginBottom: 10 }}><Phone size={14} /> iCall: 9152987821</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6B7280', fontSize: 13, marginBottom: 10 }}><Mail size={14} /> support@mindcare.in</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6B7280', fontSize: 13 }}><MapPin size={14} /> Andhra Pradesh</div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #1E3A5F', paddingTop: 20, textAlign: 'center', color: '#4B5563', fontSize: 12, maxWidth: 1100, margin: '0 auto' }}>
          © 2026 MindCare. Government of Andhra Pradesh — Higher Education Department. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;