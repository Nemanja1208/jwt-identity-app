import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const migrationSteps = [
  {
    cmd: 'dotnet ef migrations add InitialCreate',
    output: ['Build started...', 'Build succeeded.', 'Done. To undo this action, use "ef migrations remove"'],
    color: '#00ff88',
    desc: 'Creates the Identity tables migration',
  },
  {
    cmd: 'dotnet ef database update',
    output: ['Applying migration "20240101_InitialCreate"...', 'Creating table AspNetUsers', 'Creating table AspNetRoles', 'Creating table AspNetUserRoles', 'Done.'],
    color: '#00d4ff',
    desc: 'Runs migration — creates tables in DB',
  },
  {
    cmd: 'dotnet ef migrations add SeedRoles',
    output: ['Build succeeded.', 'Done. Add HasData() in OnModelCreating.'],
    color: '#a855f7',
    desc: 'Optional: seed default roles',
  },
];

const identityTables = [
  { table: 'AspNetUsers', desc: 'Users (incl. ApplicationUser fields)', color: '#ff6b35' },
  { table: 'AspNetRoles', desc: 'Roles (Admin, User, etc.)', color: '#a855f7' },
  { table: 'AspNetUserRoles', desc: 'User ↔ Role mapping', color: '#00d4ff' },
  { table: 'AspNetUserClaims', desc: 'Per-user custom claims', color: '#fbbf24' },
  { table: 'AspNetUserTokens', desc: 'Refresh tokens, etc.', color: '#00ff88' },
  { table: 'AspNetUserLogins', desc: 'External logins (Google, etc.)', color: '#64748b' },
];

const seedCode = `<span style="color:#475569;font-style:italic">// In Program.cs — seed roles on startup</span>
<span style="color:#c084fc">using var</span> scope = app.Services.<span style="color:#00ff88">CreateScope</span>();
<span style="color:#c084fc">var</span> roleManager = scope.ServiceProvider
    .<span style="color:#00ff88">GetRequiredService</span>&lt;<span style="color:#67e8f9">RoleManager</span>&lt;<span style="color:#67e8f9">IdentityRole</span>&gt;&gt;();

<span style="color:#c084fc">foreach</span> (<span style="color:#c084fc">var</span> role <span style="color:#c084fc">in new</span>[] { <span style="color:#86efac">"Admin"</span>, <span style="color:#86efac">"User"</span> })
{
    <span style="color:#c084fc">if</span> (!<span style="color:#c084fc">await</span> roleManager.<span style="color:#00ff88">RoleExistsAsync</span>(role))
        <span style="color:#c084fc">await</span> roleManager.<span style="color:#00ff88">CreateAsync</span>(
            <span style="color:#c084fc">new</span> <span style="color:#67e8f9">IdentityRole</span>(role));
}`;

function TerminalRunner({ steps }) {
  const [activeStep, setActiveStep] = useState(0);
  const [outputLines, setOutputLines] = useState([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const runStep = (stepIdx) => {
    if (running || stepIdx >= steps.length) return;
    setRunning(true);
    setOutputLines([]);
    setDone(false);

    const step = steps[stepIdx];
    let lineIdx = 0;
    const interval = setInterval(() => {
      if (lineIdx >= step.output.length) {
        clearInterval(interval);
        setRunning(false);
        setDone(true);
        return;
      }
      setOutputLines(prev => [...prev, step.output[lineIdx]]);
      lineIdx++;
    }, 500);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Step buttons */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {steps.map((s, i) => (
          <motion.button
            key={i}
            onClick={() => { setActiveStep(i); runStep(i); }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={running}
            style={{
              background: activeStep === i ? `${s.color}15` : '#080f1a',
              border: `1px solid ${activeStep === i ? s.color : 'rgba(255,255,255,0.06)'}`,
              color: activeStep === i ? s.color : '#475569',
              padding: '5px 12px', borderRadius: '6px',
              fontSize: '0.6rem', fontFamily: 'JetBrains Mono',
              cursor: running ? 'not-allowed' : 'pointer',
            }}
          >
            Step {i + 1}
          </motion.button>
        ))}
      </div>

      {/* Terminal */}
      <div style={{ background: '#010409', border: '1px solid rgba(0,255,136,0.15)', borderRadius: '10px', overflow: 'hidden', flex: 1 }}>
        <div style={{ background: '#080f1a', padding: '8px 14px', display: 'flex', gap: '6px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          {['#ff5f57','#febc2e','#28c840'].map((c,i) => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
          <span style={{ marginLeft: 8, color: '#475569', fontSize: '0.6rem' }}>bash — EF Core Migrations</span>
        </div>
        <div style={{ padding: '14px', minHeight: 150 }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
            <span style={{ color: '#00ff88', opacity: 0.5 }}>$</span>
            <span style={{ color: '#e2e8f0', fontSize: '0.7rem', wordBreak: 'break-all' }}>{steps[activeStep].cmd}</span>
          </div>
          {outputLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ color: i === outputLines.length - 1 && done ? steps[activeStep].color : '#475569', fontSize: '0.65rem', marginBottom: '2px' }}
            >
              {line}
            </motion.div>
          ))}
          {running && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              style={{ color: '#00ff88', fontSize: '0.8rem' }}
            >_</motion.span>
          )}
        </div>
      </div>
      <div style={{ color: '#475569', fontSize: '0.6rem' }}>{steps[activeStep].desc}</div>
    </div>
  );
}

export default function SlideMigrations() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 40px', gap: '16px' }}>

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.1rem', color: '#00ff88', textShadow: '0 0 20px rgba(0,255,136,0.5)', letterSpacing: '0.1em' }}
      >
        🗄️ EF MIGRATIONS & DATABASE SETUP
      </motion.h2>

      <div style={{ width: '100%', maxWidth: 960, display: 'flex', gap: '16px', flex: 1, minHeight: 0 }}>
        <TerminalRunner steps={migrationSteps} />

        <div style={{ flex: 0.8, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Identity tables */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{ background: '#080f1a', border: '1px solid rgba(0,255,136,0.15)', borderRadius: '8px', padding: '14px' }}
          >
            <div style={{ color: '#00ff88', fontSize: '0.65rem', fontWeight: 600, marginBottom: '10px' }}>📋 Identity Tables Created</div>
            {identityTables.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
                <span style={{ color: t.color, fontSize: '0.62rem', fontFamily: 'JetBrains Mono', minWidth: 140 }}>{t.table}</span>
                <span style={{ color: '#475569', fontSize: '0.58rem' }}>{t.desc}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Seed roles */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            style={{ background: '#010409', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '8px', padding: '12px', position: 'relative' }}
          >
            <div style={{ position: 'absolute', top: 8, right: 12, color: '#475569', fontSize: '0.58rem' }}>c#</div>
            <pre style={{ fontSize: '0.62rem', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: seedCode }} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
