import { motion } from 'framer-motion';
import { CodeBlock } from '../components/CodeBlock.jsx';
import { useState } from 'react';

const appSettingsCode = `<span class="cm">// appsettings.json</span>
{
  <span class="st">"ConnectionStrings"</span>: {
    <span class="st">"DefaultConnection"</span>: <span class="st">"Server=(localdb)\\\\mssqllocaldb;Database=MyAppDb;Trusted_Connection=True;"</span>
  },
  <span class="st">"JwtSettings"</span>: {
    <span class="st">"SecretKey"</span>: <span class="st">"your-super-secret-key-min-256-bits-long!!"</span>,
    <span class="st">"Issuer"</span>:    <span class="st">"https://your-api.com"</span>,
    <span class="st">"Audience"</span>:  <span class="st">"https://your-client.com"</span>,
    <span class="st">"ExpiryHours"</span>: <span class="nu">24</span>
  },
  <span class="st">"Logging"</span>: {
    <span class="st">"LogLevel"</span>: { <span class="st">"Default"</span>: <span class="st">"Information"</span> }
  }
}`;

const jwtSettingsModel = `<span class="cm">// JwtSettings.cs — Bind to config</span>
<span class="kw">public class</span> <span class="tp">JwtSettings</span>
{
    <span class="kw">public string</span> SecretKey  { <span class="kw">get</span>; <span class="kw">set</span>; } = <span class="st">""</span>;
    <span class="kw">public string</span> Issuer     { <span class="kw">get</span>; <span class="kw">set</span>; } = <span class="st">""</span>;
    <span class="kw">public string</span> Audience   { <span class="kw">get</span>; <span class="kw">set</span>; } = <span class="st">""</span>;
    <span class="kw">public int</span>    ExpiryHours { <span class="kw">get</span>; <span class="kw">set</span>; } = <span class="nu">24</span>;
}

<span class="cm">// In Program.cs — register for DI</span>
builder.Services.<span class="mx">Configure</span>&lt;<span class="tp">JwtSettings</span>&gt;(
    builder.Configuration.<span class="mx">GetSection</span>(<span class="st">"JwtSettings"</span>)
);`;

const warnings = [
  { icon: '🔐', color: '#ff6b35', title: 'NEVER commit SecretKey', desc: 'Use User Secrets (dev) or Azure Key Vault / env vars (prod)' },
  { icon: '📏', color: '#fbbf24', title: 'Key must be 256+ bits', desc: 'HS256 requires at least 32 characters (256 bits) for the secret' },
  { icon: '🌐', color: '#a855f7', title: 'Set correct Issuer/Audience', desc: 'These are validated on every request — mismatches = 401 Unauthorized' },
];

export default function SlideConfig() {
  const [showSecret, setShowSecret] = useState(false);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 40px', gap: '20px' }}>

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.1rem', color: 'var(--neon-green)', textShadow: '0 0 20px rgba(0,255,136,0.5)', letterSpacing: '0.1em' }}
      >
        ⚙️ APPSETTINGS.JSON + JWT CONFIG
      </motion.h2>

      <div style={{ width: '100%', maxWidth: 900, display: 'flex', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <CodeBlock code={appSettingsCode} lang="json" delay={0.2} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <CodeBlock code={jwtSettingsModel} lang="c#" delay={0.4} />

          {/* User Secrets tip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: '8px',
              padding: '12px 16px',
            }}
          >
            <div style={{ color: 'var(--neon-blue)', fontSize: '0.65rem', marginBottom: '8px', fontWeight: 600 }}>🔒 Dev Secret (User Secrets)</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem', marginBottom: '6px' }}>Never store secrets in appsettings — use:</div>
            <div style={{
              background: 'var(--code-bg)', borderRadius: '4px', padding: '8px',
              border: '1px solid rgba(255,255,255,0.05)',
              fontSize: '0.65rem', color: 'var(--neon-yellow)',
              wordBreak: 'break-all',
            }}>
              dotnet user-secrets set "JwtSettings:SecretKey" "your-real-secret"
            </div>
          </motion.div>
        </div>
      </div>

      {/* Warnings */}
      <div style={{ width: '100%', maxWidth: 900, display: 'flex', gap: '12px' }}>
        {warnings.map((w, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
            style={{
              flex: 1,
              background: 'var(--bg-card)',
              border: `1px solid ${w.color}30`,
              borderTop: `3px solid ${w.color}`,
              borderRadius: '8px',
              padding: '12px',
            }}
          >
            <div style={{ fontSize: '1.1rem', marginBottom: '6px' }}>{w.icon}</div>
            <div style={{ color: w.color, fontSize: '0.65rem', fontWeight: 600, marginBottom: '4px' }}>{w.title}</div>
            <div style={{ color: 'var(--nav-label)', fontSize: '0.6rem' }}>{w.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
