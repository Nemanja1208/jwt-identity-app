import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const FLOW = [
  { id: 0, phase: 'REGISTRATION', icon: '📝', color: '#ff6b35', steps: ['POST /api/auth/register', 'Identity creates user', 'Password hashed (PBKDF2)', 'User stored in AspNetUsers'] },
  { id: 1, phase: 'LOGIN', icon: '🔑', color: '#a855f7', steps: ['POST /api/auth/login', 'FindByEmailAsync()', 'CheckPasswordAsync()', 'GenerateTokenAsync() → JWT'] },
  { id: 2, phase: 'TOKEN', icon: '🎫', color: '#fbbf24', steps: ['Claims built (sub, email, role)', 'Signed with HS256 + SecretKey', 'Token returned to client', 'Client stores in localStorage'] },
  { id: 3, phase: 'REQUEST', icon: '📡', color: '#00d4ff', steps: ['GET /api/protected', 'Authorization: Bearer {token}', '[Authorize] middleware fires', 'Token validated (sig + exp + iss)'] },
  { id: 4, phase: 'RESPONSE', icon: '✅', color: '#00ff88', steps: ['Claims extracted to User obj', 'Role/Policy checked', 'Handler executes', '200 OK + data returned'] },
];

export default function SlideFullFlow() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setActive(p => (p + 1) % FLOW.length), 2500);
    return () => clearInterval(t);
  }, [auto]);

  const phase = FLOW[active];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 40px', gap: '24px' }}>

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.1rem', color: '#00ff88', textShadow: '0 0 20px rgba(0,255,136,0.5)', letterSpacing: '0.1em' }}
      >
        🔄 COMPLETE AUTH FLOW
      </motion.h2>

      {/* Phase selector */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {FLOW.map((f, i) => (
          <motion.button
            key={i}
            onClick={() => { setAuto(false); setActive(i); }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: active === i ? `${f.color}20` : '#080f1a',
              border: `2px solid ${active === i ? f.color : 'rgba(255,255,255,0.06)'}`,
              color: active === i ? f.color : '#475569',
              padding: '8px 16px', borderRadius: '8px',
              fontSize: '0.65rem', fontFamily: 'JetBrains Mono',
              cursor: 'pointer',
              boxShadow: active === i ? `0 0 15px ${f.color}30` : 'none',
              transition: 'all 0.2s',
            }}
          >
            {f.icon} {f.phase}
          </motion.button>
        ))}
      </div>

      {/* Flow pipeline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', width: '100%', maxWidth: 900 }}>
        {FLOW.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <motion.div
              animate={{
                background: active === i ? `${f.color}20` : active > i ? 'rgba(0,255,136,0.08)' : '#080f1a',
                borderColor: active === i ? f.color : active > i ? '#00ff88' : 'rgba(255,255,255,0.06)',
                scale: active === i ? 1.05 : 1,
              }}
              transition={{ duration: 0.3 }}
              style={{
                flex: 1, padding: '12px 8px', textAlign: 'center',
                border: '2px solid',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
              onClick={() => { setAuto(false); setActive(i); }}
            >
              <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{f.icon}</div>
              <div style={{ fontSize: '0.58rem', fontFamily: 'Orbitron', color: active >= i ? f.color : '#475569', letterSpacing: '0.05em' }}>
                {f.phase}
              </div>
            </motion.div>
            {i < FLOW.length - 1 && (
              <motion.div
                animate={{ background: active > i ? '#00ff88' : 'rgba(255,255,255,0.1)' }}
                style={{ height: 2, width: 24, flexShrink: 0, transition: 'background 0.3s' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.97 }}
          transition={{ duration: 0.3 }}
          style={{
            width: '100%', maxWidth: 700,
            background: `${phase.color}08`,
            border: `2px solid ${phase.color}30`,
            borderRadius: '12px',
            padding: '20px 24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '2rem' }}>{phase.icon}</span>
            <span style={{ fontFamily: 'Orbitron, monospace', color: phase.color, fontSize: '0.9rem', letterSpacing: '0.1em' }}>
              {phase.phase}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {phase.steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}
              >
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: phase.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.58rem', color: '#000', fontWeight: 700, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <span style={{ color: '#94a3b8', fontSize: '0.68rem', lineHeight: 1.5, paddingTop: '2px' }}>{step}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.button
        onClick={() => { setAuto(true); setActive(0); }}
        whileHover={{ scale: 1.05 }}
        style={{
          background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)',
          color: '#00ff88', padding: '6px 20px', borderRadius: '20px',
          fontSize: '0.65rem', fontFamily: 'JetBrains Mono', cursor: 'pointer',
        }}
      >
        ↺ Auto-Play
      </motion.button>
    </div>
  );
}
