import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const PARTS = [
  {
    label: 'HEADER',
    color: '#ff6b35',
    glow: 'rgba(255,107,53,0.4)',
    encoded: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    decoded: `{
  "alg": "HS256",
  "typ": "JWT"
}`,
    desc: 'Algorithm & token type',
    icon: '🔑',
  },
  {
    label: 'PAYLOAD',
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.4)',
    encoded: 'eyJzdWIiOiJ1c2VyMTIzIiwibmFtZSI6IkpvaG4iLCJyb2xlIjoiQWRtaW4iLCJleHAiOjE3MDAwMDB9',
    decoded: `{
  "sub": "user123",
  "name": "John Doe",
  "role": "Admin",
  "exp": 1700000000
}`,
    desc: 'User data & claims',
    icon: '📦',
  },
  {
    label: 'SIGNATURE',
    color: '#00d4ff',
    glow: 'rgba(0,212,255,0.4)',
    encoded: 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    decoded: `HMACSHA256(
  base64(header) + "." +
  base64(payload),
  secretKey
)`,
    desc: 'Cryptographic verification',
    icon: '🔒',
  },
];

export default function SlideJwtStructure() {
  const [active, setActive] = useState(null);
  const [exploded, setExploded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setExploded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const fullToken = PARTS.map(p => p.encoded).join('.');

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 40px', gap: '30px' }}>

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.2rem', color: 'var(--neon-green)', textShadow: '0 0 20px rgba(0,255,136,0.5)', letterSpacing: '0.1em' }}
      >
        JWT TOKEN STRUCTURE
      </motion.h2>

      {/* Full token display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          background: 'var(--code-bg)',
          border: '1px solid rgba(0,255,136,0.2)',
          borderRadius: '8px',
          padding: '12px 20px',
          maxWidth: '90%',
          wordBreak: 'break-all',
          fontSize: '0.65rem',
          lineHeight: 1.8,
          textAlign: 'center',
        }}
      >
        {PARTS.map((part, i) => (
          <span key={i}>
            <motion.span
              onClick={() => setActive(active === i ? null : i)}
              whileHover={{ scale: 1.02 }}
              style={{
                color: part.color,
                textShadow: active === i ? `0 0 10px ${part.glow}` : 'none',
                cursor: 'pointer',
                background: active === i ? `rgba(${part.color}, 0.1)` : 'transparent',
                borderRadius: '3px',
                transition: 'all 0.2s',
                opacity: active !== null && active !== i ? 0.3 : 1,
              }}
            >
              {part.encoded}
            </motion.span>
            {i < 2 && <span style={{ color: 'var(--neon-green)', opacity: 0.5 }}>.</span>}
          </span>
        ))}
      </motion.div>

      {/* Three parts */}
      <div style={{ display: 'flex', gap: '16px', width: '100%', maxWidth: '900px' }}>
        {PARTS.map((part, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: exploded ? 0 : 40 }}
            transition={{ delay: 0.5 + i * 0.15, type: 'spring', stiffness: 200 }}
            onClick={() => setActive(active === i ? null : i)}
            whileHover={{ y: -4, scale: 1.02 }}
            style={{
              flex: 1,
              background: 'var(--bg-card)',
              border: `1px solid ${active === i ? part.color : 'rgba(255,255,255,0.06)'}`,
              borderRadius: '10px',
              padding: '16px',
              cursor: 'pointer',
              boxShadow: active === i ? `0 0 20px ${part.glow}` : 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontSize: '1.2rem' }}>{part.icon}</span>
              <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.65rem', color: part.color, letterSpacing: '0.1em' }}>
                {part.label}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', marginBottom: '10px' }}>{part.desc}</p>
            <div style={{
              background: 'var(--code-bg)',
              borderRadius: '6px',
              padding: '10px',
              border: `1px solid rgba(255,255,255,0.05)`,
              fontSize: '0.65rem',
              color: part.color,
              fontFamily: 'JetBrains Mono, monospace',
              whiteSpace: 'pre',
            }}>
              {part.decoded}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info banner */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              background: `rgba(${PARTS[active].color.replace('#','')}, 0.08)`,
              border: `1px solid ${PARTS[active].color}30`,
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '0.7rem',
              color: PARTS[active].color,
              display: 'flex', alignItems: 'center', gap: '10px',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>{PARTS[active].icon}</span>
            <span>
              {active === 0 && 'The header is Base64URL encoded. It tells the server which algorithm to use for verification.'}
              {active === 1 && 'The payload carries claims (data). NEVER store sensitive info here — it is readable by anyone!'}
              {active === 2 && 'The signature uses your secret key. Only the server can create valid signatures. This prevents tampering.'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{ color: 'var(--nav-hint)', fontSize: '0.6rem', letterSpacing: '0.05em' }}
      >
        Click each section to inspect • Header . Payload . Signature
      </motion.p>
    </div>
  );
}
