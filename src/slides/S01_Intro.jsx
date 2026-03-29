import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const glyphs = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';

function MatrixRain({ x, delay }) {
  const [chars, setChars] = useState([]);
  useEffect(() => {
    const cols = [];
    for (let i = 0; i < 15; i++) cols.push(glyphs[Math.floor(Math.random() * glyphs.length)]);
    setChars(cols);
    const interval = setInterval(() => {
      setChars(prev => prev.map(() => glyphs[Math.floor(Math.random() * glyphs.length)]));
    }, 120 + Math.random() * 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.6, 0] }}
      transition={{ delay, duration: 3, repeat: Infinity, repeatDelay: Math.random() * 4 }}
      style={{
        position: 'absolute', left: x, top: 0,
        display: 'flex', flexDirection: 'column', gap: '2px',
        fontFamily: 'JetBrains Mono', fontSize: '0.65rem',
        pointerEvents: 'none', zIndex: 0,
      }}
    >
      {chars.map((c, i) => (
        <span key={i} style={{ color: i === 0 ? '#fff' : `rgba(0,255,136,${0.7 - i * 0.04})` }}>{c}</span>
      ))}
    </motion.div>
  );
}

export default function SlideIntro() {
  const columns = Array.from({ length: 20 }, (_, i) => ({
    x: `${(i / 20) * 100}%`,
    delay: Math.random() * 5,
  }));

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Matrix rain background */}
      {columns.map((col, i) => <MatrixRain key={i} {...col} />)}

      {/* Center content */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 700 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'backOut' }}
        >
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
            {['J', 'W', 'T'].map((l, i) => (
              <motion.div
                key={l}
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.3, type: 'spring', stiffness: 300 }}
                style={{
                  width: 64, height: 64,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: ['rgba(255,107,53,0.15)', 'rgba(168,85,247,0.15)', 'rgba(0,212,255,0.15)'][i],
                  border: `2px solid ${['#ff6b35', '#a855f7', '#00d4ff'][i]}`,
                  borderRadius: '10px',
                  fontSize: '2rem',
                  fontFamily: 'Orbitron, monospace',
                  fontWeight: 900,
                  color: ['#ff6b35', '#a855f7', '#00d4ff'][i],
                  boxShadow: `0 0 20px ${['rgba(255,107,53,0.4)', 'rgba(168,85,247,0.4)', 'rgba(0,212,255,0.4)'][i]}`,
                }}
              >{l}</motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{ fontSize: '0.7rem', color: '#475569', letterSpacing: '0.3em', marginBottom: '8px' }}
          >
            &amp;
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{
              fontFamily: 'Orbitron, monospace',
              fontSize: '2rem',
              fontWeight: 900,
              color: '#00ff88',
              textShadow: '0 0 30px rgba(0,255,136,0.6)',
              letterSpacing: '0.05em',
              marginBottom: '8px',
            }}
          >
            ASP.NET CORE IDENTITY
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            style={{ color: '#64748b', fontSize: '0.8rem', letterSpacing: '0.08em', marginBottom: '40px' }}
          >
            Authentication &amp; Authorization in .NET Core APIs
          </motion.p>

          {/* Topic pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}
          >
            {['JWT Structure', 'Identity Setup', 'Token Generation', 'Protected Endpoints', 'Auth Flow'].map((topic, i) => (
              <motion.span
                key={topic}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 + i * 0.1 }}
                style={{
                  padding: '5px 14px',
                  background: 'rgba(0,255,136,0.08)',
                  border: '1px solid rgba(0,255,136,0.2)',
                  borderRadius: '20px',
                  fontSize: '0.65rem',
                  color: '#00ff88',
                  letterSpacing: '0.05em',
                }}
              >
                {topic}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ delay: 2, duration: 1.5, repeat: Infinity }}
            style={{ fontSize: '0.65rem', color: '#00ff88', letterSpacing: '0.2em' }}
          >
            PRESS → TO BEGIN
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
