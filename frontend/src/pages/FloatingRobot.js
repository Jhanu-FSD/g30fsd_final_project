import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingRobot = ({ message, position = 'bottom-right', size = 'medium' }) => {
  const [showMsg, setShowMsg] = useState(true);

  const sizes = {
    small:  { robot: 60,  font: 10 },
    medium: { robot: 80,  font: 12 },
    large:  { robot: 100, font: 13 },
  };

  const positions = {
    'bottom-right': { bottom: 24, right: 24 },
    'bottom-left':  { bottom: 24, left:  24 },
    'top-right':    { top:    24, right: 24 },
  };

  const s = sizes[size];
  const p = positions[position];

  return (
    <div style={{ position: 'fixed', ...p, zIndex: 999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, pointerEvents: 'none' }}>

      {/* Speech Bubble */}
      <AnimatePresence>
        {showMsg && message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'linear-gradient(135deg, #1D4ED8, #6366F1)',
              borderRadius: 14, padding: '10px 14px',
              maxWidth: 200, boxShadow: '0 4px 20px rgba(29,78,216,0.35)',
              position: 'relative', pointerEvents: 'auto',
            }}>
            <p style={{ fontSize: s.font, color: '#fff', margin: 0, fontWeight: 600, fontFamily: 'system-ui', lineHeight: 1.5 }}>{message}</p>
            {/* Tail */}
            <div style={{ position: 'absolute', bottom: -8, right: 20, width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '8px solid #6366F1' }} />
            {/* Close */}
            <button onClick={() => setShowMsg(false)}
              style={{ position: 'absolute', top: -8, right: -8, width: 18, height: 18, borderRadius: '50%', background: '#EF4444', border: 'none', color: '#fff', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Robot */}
      <motion.div
       animate={{ y: [0, -10, 0] }}
transition={{ duration: 3, repeat: Infinity }}
        onClick={() => setShowMsg(!showMsg)}
        style={{ cursor: 'pointer', pointerEvents: 'auto', filter: 'drop-shadow(0 8px 20px rgba(29,78,216,0.4))' }}>

        <svg width={s.robot} height={s.robot} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* Glow */}
          <defs>
            <radialGradient id="bodyGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FCD34D"/>
              <stop offset="100%" stopColor="#F59E0B"/>
            </radialGradient>
            <radialGradient id="headGrad" cx="50%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#ffffff"/>
              <stop offset="100%" stopColor="#e2e8f0"/>
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Antenna Left */}
          <line x1="35" y1="12" x2="30" y2="4" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="30" cy="3" r="3" fill="#60A5FA" filter="url(#glow)"/>

          {/* Antenna Right */}
          <line x1="65" y1="12" x2="70" y2="4" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="70" cy="3" r="3" fill="#60A5FA" filter="url(#glow)"/>

          {/* Head */}
          <rect x="22" y="10" width="56" height="42" rx="14" fill="url(#headGrad)" stroke="#CBD5E1" strokeWidth="1.5"/>

          {/* Face screen */}
          <rect x="27" y="15" width="46" height="32" rx="10" fill="#0F172A"/>

          {/* Eyes */}
          <ellipse cx="38" cy="31" rx="7" ry="8" fill="#06B6D4" filter="url(#glow)"/>
          <ellipse cx="62" cy="31" rx="7" ry="8" fill="#06B6D4" filter="url(#glow)"/>
          <ellipse cx="38" cy="31" rx="4" ry="5" fill="#22D3EE"/>
          <ellipse cx="62" cy="31" rx="4" ry="5" fill="#22D3EE"/>
          <circle cx="40" cy="29" r="1.5" fill="#fff"/>
          <circle cx="64" cy="29" r="1.5" fill="#fff"/>

          {/* Ear Left */}
          <rect x="14" y="20" width="10" height="18" rx="5" fill="#94A3B8"/>
          <rect x="16" y="24" width="6" height="10" rx="3" fill="#60A5FA"/>

          {/* Ear Right */}
          <rect x="76" y="20" width="10" height="18" rx="5" fill="#94A3B8"/>
          <rect x="78" y="24" width="6" height="10" rx="3" fill="#60A5FA"/>

          {/* Neck */}
          <rect x="42" y="51" width="16" height="8" rx="4" fill="#94A3B8"/>

          {/* Body */}
          <rect x="18" y="58" width="64" height="34" rx="14" fill="url(#bodyGrad)" stroke="#F59E0B" strokeWidth="1.5"/>

          {/* Chest gem */}
          <circle cx="50" cy="73" r="7" fill="#06B6D4" filter="url(#glow)"/>
          <circle cx="50" cy="73" r="4" fill="#22D3EE"/>
          <circle cx="48" cy="71" r="1.5" fill="#fff"/>

          {/* Body panel lines */}
          <line x1="30" y1="65" x2="30" y2="85" stroke="#F59E0B" strokeWidth="1" opacity="0.5"/>
          <line x1="70" y1="65" x2="70" y2="85" stroke="#F59E0B" strokeWidth="1" opacity="0.5"/>

          {/* Arm Left */}
          <rect x="6" y="62" width="14" height="22" rx="7" fill="url(#headGrad)" stroke="#CBD5E1" strokeWidth="1.5"/>
          <circle cx="13" cy="87" r="5" fill="#94A3B8"/>

          {/* Arm Right */}
          <rect x="80" y="62" width="14" height="22" rx="7" fill="url(#headGrad)" stroke="#CBD5E1" strokeWidth="1.5"/>
          <circle cx="87" cy="87" r="5" fill="#94A3B8"/>

          {/* Feet */}
          <ellipse cx="37" cy="95" rx="10" ry="5" fill="#475569"/>
          <ellipse cx="63" cy="95" rx="10" ry="5" fill="#475569"/>
        </svg>
      </motion.div>
    </div>
  );
};

export default FloatingRobot;