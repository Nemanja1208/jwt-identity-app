import { motion, useAnimation } from 'framer-motion';
import { useState, useEffect } from 'react';

const steps = [
  { id: 0, label: 'POST /auth/login', sub: '{ email, password }', color: '#ff6b35', from: 'client', to: 'server' },
  { id: 1, label: 'Validate Credentials', sub: 'Identity checks DB', color: '#fbbf24', from: 'server', to: 'db' },
  { id: 2, label: 'User Found ✓', sub: 'PasswordHasher.Verify()', color: '#00ff88', from: 'db', to: 'server' },
  { id: 3, label: 'Generate JWT Token', sub: 'JwtSecurityToken + Sign', color: '#a855f7', from: 'server', to: 'server' },
  { id: 4, label: '200 OK + Token', sub: '{ token: "eyJ..." }', color: '#00d4ff', from: 'server', to: 'client' },
  { id: 5, label: 'GET /api/protected', sub: 'Authorization: Bearer eyJ...', color: '#ff6b35', from: 'client', to: 'server' },
  { id: 6, label: 'Validate Token', sub: '[Authorize] middleware', color: '#fbbf24', from: 'server', to: 'server' },
  { id: 7, label: '200 Protected Data', sub: 'Authorized! ✓', color: '#00ff88', from: 'server', to: 'client' },
];

const nodes = {
  client: { label: '💻 CLIENT', x: 100, color: '#ff6b35' },
  server: { label: '⚙️ API SERVER', x: 460, color: '#00ff88' },
  db: { label: '🗄️ DATABASE', x: 820, color: '#00d4ff' },
};

export default function SlideAuthFlow() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          setTimeout(() => setCurrentStep(-1), 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1400);
    return () => clearInterval(timer);
  }, [auto]);

  const getArrow = (step) => {
    const from = nodes[step.from];
    const to = nodes[step.to];
    if (step.from === step.to) return null; // internal
    const isRight = to.x > from.x;
    return { x1: from.x + 60, x2: to.x - 60, isRight };
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px 80px', gap: '20px' }}>

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.1rem', color: '#00ff88', textShadow: '0 0 20px rgba(0,255,136,0.5)', letterSpacing: '0.1em' }}
      >
        JWT AUTHENTICATION FLOW
      </motion.h2>

      {/* Node diagram */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 940, height: 100 }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
          {/* Static lines */}
          <line x1="160" y1="50" x2="400" y2="50" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeDasharray="6,4" />
          <line x1="520" y1="50" x2="760" y2="50" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeDasharray="6,4" />

          {/* Animated packet */}
          {currentStep >= 0 && (() => {
            const step = steps[currentStep];
            const arrow = getArrow(step);
            if (!arrow) return null;
            return (
              <motion.circle
                key={currentStep}
                r="6"
                fill={step.color}
                filter={`drop-shadow(0 0 6px ${step.color})`}
                initial={{ cx: arrow.x1, cy: 50 }}
                animate={{ cx: arrow.x2, cy: 50 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
            );
          })()}
        </svg>

        {/* Node boxes */}
        {Object.entries(nodes).map(([key, node]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              position: 'absolute',
              left: node.x - 60,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 120,
              background: '#080f1a',
              border: `2px solid ${node.color}`,
              borderRadius: '10px',
              padding: '10px',
              textAlign: 'center',
              boxShadow: `0 0 15px ${node.color}30`,
            }}
          >
            <div style={{ fontSize: '0.7rem', color: node.color, fontWeight: 600 }}>{node.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Steps list */}
      <div style={{ width: '100%', maxWidth: 940, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '8px 14px',
              borderRadius: '6px',
              background: currentStep === i ? `${step.color}15` : currentStep > i ? 'rgba(0,255,136,0.05)' : '#08101a',
              border: `1px solid ${currentStep === i ? step.color : currentStep > i ? 'rgba(0,255,136,0.15)' : 'rgba(255,255,255,0.04)'}`,
              transition: 'all 0.3s',
              cursor: 'pointer',
            }}
            onClick={() => { setAuto(false); setCurrentStep(i); }}
          >
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: currentStep >= i ? step.color : 'rgba(255,255,255,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.6rem', color: '#000', fontWeight: 700, flexShrink: 0,
              transition: 'background 0.3s',
            }}>
              {currentStep > i ? '✓' : i + 1}
            </div>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flex: 1 }}>
              <span style={{ fontSize: '0.7rem', color: currentStep >= i ? step.color : '#475569', fontWeight: currentStep === i ? 600 : 400 }}>
                {step.label}
              </span>
              <span style={{ fontSize: '0.6rem', color: '#1e3a52' }}>—</span>
              <span style={{ fontSize: '0.6rem', color: '#64748b' }}>{step.sub}</span>
            </div>

            <div style={{ fontSize: '0.55rem', color: '#1e3a52', letterSpacing: '0.05em' }}>
              {step.from.toUpperCase()} → {step.to.toUpperCase()}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        onClick={() => { setCurrentStep(-1); setAuto(true); }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)',
          color: '#00ff88', padding: '6px 20px', borderRadius: '20px',
          fontSize: '0.65rem', fontFamily: 'JetBrains Mono', cursor: 'pointer',
          letterSpacing: '0.08em',
        }}
      >
        ↺ REPLAY ANIMATION
      </motion.button>
    </div>
  );
}
