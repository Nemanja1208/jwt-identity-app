import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext.jsx';

export function SlideNav({ current, total, onPrev, onNext, slideTitle }) {
  const progress = ((current + 1) / total) * 100;
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px',
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--nav-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: 'var(--neon-green)', fontSize: '0.65rem', fontFamily: 'Orbitron, monospace', letterSpacing: '0.1em' }}>
            JWT & IDENTITY
          </span>
          <span style={{ color: 'var(--nav-hint)', fontSize: '0.6rem' }}>◆</span>
          <span style={{ color: 'var(--nav-label)', fontSize: '0.65rem' }}>.NET CORE</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {Array.from({ length: total }).map((_, i) => (
            <motion.div
              key={i}
              style={{
                width: i === current ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background: i === current ? 'var(--neon-green)' : i < current ? 'var(--border)' : 'var(--dot-inactive)',
              }}
              animate={{ width: i === current ? 20 : 6 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              width: 28,
              height: 28,
              borderRadius: '6px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'inherit',
            }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </motion.button>
          <span style={{ color: 'var(--nav-label)', fontSize: '0.65rem' }}>
            {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ position: 'fixed', top: 45, left: 0, right: 0, height: '2px', background: 'var(--dot-inactive)', zIndex: 100 }}>
        <motion.div
          style={{ height: '100%', background: 'linear-gradient(90deg, var(--neon-green), var(--neon-blue))', transformOrigin: 'left' }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Bottom nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px',
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid var(--nav-border)'
      }}>
        <span style={{ color: 'var(--nav-hint)', fontSize: '0.65rem' }}>← → arrow keys to navigate</span>

        <motion.span
          key={slideTitle}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '0.05em' }}
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
        background: primary && !disabled ? 'color-mix(in srgb, var(--neon-green) 15%, transparent)' : 'transparent',
        border: `1px solid ${primary && !disabled ? 'var(--neon-green)' : 'var(--btn-inactive-border)'}`,
        color: disabled ? 'var(--nav-hint)' : primary ? 'var(--neon-green)' : 'var(--text-muted)',
        padding: '4px 14px',
        borderRadius: '4px',
        fontSize: '0.6rem',
        fontFamily: 'JetBrains Mono, monospace',
        cursor: disabled ? 'not-allowed' : 'pointer',
        letterSpacing: '0.08em',
        boxShadow: primary && !disabled ? 'var(--glow-green)' : 'none',
      }}
    >
      {label}
    </motion.button>
  );
}
