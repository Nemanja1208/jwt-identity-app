import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const packages = [
  {
    name: 'Microsoft.AspNetCore.Authentication.JwtBearer',
    version: '8.0.0',
    desc: 'JWT Bearer authentication middleware',
    icon: '🔐',
    color: '#ff6b35',
  },
  {
    name: 'Microsoft.AspNetCore.Identity.EntityFrameworkCore',
    version: '8.0.0',
    desc: 'ASP.NET Core Identity with EF Core',
    icon: '👤',
    color: '#a855f7',
  },
  {
    name: 'Microsoft.EntityFrameworkCore.SqlServer',
    version: '8.0.0',
    desc: 'SQL Server provider for EF Core',
    icon: '🗄️',
    color: '#00d4ff',
  },
  {
    name: 'System.IdentityModel.Tokens.Jwt',
    version: '7.3.1',
    desc: 'JWT token creation & validation',
    icon: '🎫',
    color: '#fbbf24',
  },
];

const installLines = packages.map(p =>
  `dotnet add package ${p.name} --version ${p.version}`
);

function TerminalLine({ text, delay, color = '#00ff88' }) {
  const [visible, setVisible] = useState(false);
  const [typed, setTyped] = useState('');

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), delay * 1000);
    return () => clearTimeout(showTimer);
  }, [delay]);

  useEffect(() => {
    if (!visible) return;
    let i = 0;
    const interval = setInterval(() => {
      setTyped(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 12);
    return () => clearInterval(interval);
  }, [visible, text]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}
    >
      <span style={{ color: '#00ff88', opacity: 0.5, flexShrink: 0 }}>$</span>
      <span style={{ color, fontSize: '0.7rem', wordBreak: 'break-all', lineHeight: 1.6 }}>{typed}</span>
    </motion.div>
  );
}

export default function SlideInstall() {
  const [showOutput, setShowOutput] = useState(false);
  const [replay, setReplay] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setShowOutput(true), (installLines.length * 0.8 + 1) * 1000);
    return () => clearTimeout(t);
  }, [replay]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 40px', gap: '24px' }}>

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.1rem', color: '#00ff88', textShadow: '0 0 20px rgba(0,255,136,0.5)', letterSpacing: '0.1em' }}
      >
        📦 INSTALL PACKAGES
      </motion.h2>

      <div style={{ width: '100%', maxWidth: 880, display: 'flex', gap: '16px' }}>
        {/* Package list */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {packages.map((pkg, i) => (
            <motion.div
              key={`${replay}-${i}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              style={{
                background: '#080f1a',
                border: `1px solid ${pkg.color}30`,
                borderLeft: `3px solid ${pkg.color}`,
                borderRadius: '8px',
                padding: '12px 16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '1rem' }}>{pkg.icon}</span>
                <span style={{ color: pkg.color, fontSize: '0.7rem', fontWeight: 600 }}>{pkg.name}</span>
                <span style={{ marginLeft: 'auto', color: '#1e3a52', fontSize: '0.6rem', background: '#010409', padding: '1px 6px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  v{pkg.version}
                </span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.65rem' }}>{pkg.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Terminal */}
        <div style={{ flex: 1.1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Terminal window */}
          <div style={{
            background: '#010409',
            border: '1px solid rgba(0,255,136,0.2)',
            borderRadius: '10px',
            overflow: 'hidden',
            flex: 1,
          }}>
            {/* Title bar */}
            <div style={{
              background: '#080f1a',
              padding: '8px 14px',
              display: 'flex', alignItems: 'center', gap: '6px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
              <span style={{ marginLeft: 8, color: '#475569', fontSize: '0.6rem' }}>bash — MyProject</span>
            </div>

            <div style={{ padding: '16px', minHeight: 200 }}>
              <TerminalLine key={`${replay}-header`} text="cd MyProject/" delay={0.2} color="#64748b" />
              {installLines.map((line, i) => (
                <TerminalLine key={`${replay}-${i}`} text={line} delay={0.6 + i * 0.8} color="#e2e8f0" />
              ))}
              {showOutput && (
                <motion.div
                  key={`${replay}-output`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ marginTop: '8px' }}
                >
                  <div style={{ color: '#475569', fontSize: '0.65rem', marginBottom: '4px' }}>Determining projects to restore...</div>
                  <div style={{ color: '#00ff88', fontSize: '0.65rem' }}>✓ All packages installed successfully!</div>
                </motion.div>
              )}
            </div>
          </div>

          {/* NuGet PM alternative */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              background: '#080f1a',
              border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: '8px',
              padding: '12px 16px',
            }}
          >
            <div style={{ color: '#00d4ff', fontSize: '0.6rem', marginBottom: '8px', letterSpacing: '0.08em' }}>
              📦 NuGet Package Manager (Visual Studio)
            </div>
            {packages.slice(0, 2).map((pkg, i) => (
              <div key={i} style={{ color: '#475569', fontSize: '0.65rem', marginBottom: '2px' }}>
                <span style={{ color: '#64748b' }}>Install-Package </span>
                <span style={{ color: '#fbbf24' }}>{pkg.name}</span>
                <span style={{ color: '#475569' }}> -Version </span>
                <span style={{ color: '#86efac' }}>{pkg.version}</span>
              </div>
            ))}
            <div style={{ color: '#1e3a52', fontSize: '0.6rem', marginTop: '6px' }}>...and 2 more</div>
          </motion.div>

          <motion.button
            onClick={() => { setShowOutput(false); setReplay(r => r + 1); setTimeout(() => setShowOutput(true), (installLines.length * 0.8 + 1) * 1000); }}
            whileHover={{ scale: 1.05 }}
            style={{
              background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)',
              color: '#00ff88', padding: '6px', borderRadius: '6px',
              fontSize: '0.65rem', fontFamily: 'JetBrains Mono', cursor: 'pointer',
            }}
          >
            ↺ Replay Install
          </motion.button>
        </div>
      </div>
    </div>
  );
}
