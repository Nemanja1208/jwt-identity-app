import { motion } from 'framer-motion';

export function SlideNav({ current, total, onPrev, onNext, slideTitle }) {
  const progress = ((current + 1) / total) * 100;

  return (
    <>
      {/* Top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px',
        background: 'rgba(4, 8, 16, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,255,136,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: '#00ff88', fontSize: '0.65rem', fontFamily: 'Orbitron, monospace', letterSpacing: '0.1em' }}>
            JWT & IDENTITY
          </span>
          <span style={{ color: '#1e3a52', fontSize: '0.6rem' }}>◆</span>
          <span style={{ color: '#475569', fontSize: '0.65rem' }}>.NET CORE</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {Array.from({ length: total }).map((_, i) => (
            <motion.div
              key={i}
              style={{
                width: i === current ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background: i === current ? '#00ff88' : i < current ? 'rgba(0,255,136,0.4)' : 'rgba(255,255,255,0.1)',
              }}
              animate={{ width: i === current ? 20 : 6 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        <span style={{ color: '#475569', fontSize: '0.65rem' }}>
          {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ position: 'fixed', top: 45, left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.05)', zIndex: 100 }}>
        <motion.div
          style={{ height: '100%', background: 'linear-gradient(90deg, #00ff88, #00d4ff)', transformOrigin: 'left' }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Bottom nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px',
        background: 'rgba(4, 8, 16, 0.9)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(0,255,136,0.1)'
      }}>
        <span style={{ color: '#1e3a52', fontSize: '0.65rem' }}>← → arrow keys to navigate</span>

        <motion.span
          key={slideTitle}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ color: '#64748b', fontSize: '0.65rem', letterSpacing: '0.05em' }}
        >
          {slideTitle}
        </motion.span>

        <div style={{ display: 'flex', gap: '8px' }}>
          <NavBtn onClick={onPrev} disabled={current === 0} label="◀ PREV" />
          <NavBtn onClick={onNext} disabled={current === total - 1} label="NEXT ▶" primary />
        </div>
      </div>
    </>
  );
}

function NavBtn({ onClick, disabled, label, primary }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      style={{
        background: primary && !disabled ? 'rgba(0,255,136,0.15)' : 'transparent',
        border: `1px solid ${primary && !disabled ? '#00ff88' : 'rgba(255,255,255,0.1)'}`,
        color: disabled ? '#1e3a52' : primary ? '#00ff88' : '#64748b',
        padding: '4px 14px',
        borderRadius: '4px',
        fontSize: '0.6rem',
        fontFamily: 'JetBrains Mono, monospace',
        cursor: disabled ? 'not-allowed' : 'pointer',
        letterSpacing: '0.08em',
        boxShadow: primary && !disabled ? '0 0 10px rgba(0,255,136,0.2)' : 'none',
      }}
    >
      {label}
    </motion.button>
  );
}
