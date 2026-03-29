import { motion } from 'framer-motion';
import { CodeBlock } from '../components/CodeBlock.jsx';
import { useState } from 'react';

const protectedController = `<span class="at">[ApiController]</span>
<span class="at">[Route(<span class="st">"api/[controller]"</span>)]</span>
<span class="at">[Authorize]</span> <span class="cm">// ← All endpoints require auth</span>
<span class="kw">public class</span> <span class="tp">ProductsController</span> : <span class="tp">ControllerBase</span>
{
    <span class="cm">// GET /api/products — requires any valid token</span>
    <span class="at">[HttpGet]</span>
    <span class="kw">public</span> <span class="tp">IActionResult</span> <span class="mx">GetAll</span>() =>
        <span class="mx">Ok</span>(<span class="kw">new</span>[] { <span class="st">"Product A"</span>, <span class="st">"Product B"</span> });

    <span class="cm">// GET /api/products/admin — requires Admin role</span>
    <span class="at">[HttpGet(<span class="st">"admin"</span>)]</span>
    <span class="at">[Authorize(Roles = <span class="st">"Admin"</span>)]</span>
    <span class="kw">public</span> <span class="tp">IActionResult</span> <span class="mx">AdminOnly</span>() =>
        <span class="mx">Ok</span>(<span class="st">"Admin secret data"</span>);

    <span class="cm">// GET /api/products/public — no auth needed</span>
    <span class="at">[HttpGet(<span class="st">"public"</span>)]</span>
    <span class="at">[AllowAnonymous]</span>
    <span class="kw">public</span> <span class="tp">IActionResult</span> <span class="mx">Public</span>() =>
        <span class="mx">Ok</span>(<span class="st">"Anyone can see this!"</span>);

    <span class="cm">// Access current user's identity</span>
    <span class="at">[HttpGet(<span class="st">"me"</span>)]</span>
    <span class="kw">public</span> <span class="tp">IActionResult</span> <span class="mx">Me</span>()
    {
        <span class="kw">var</span> userId = <span class="tp">User</span>.<span class="mx">FindFirstValue</span>(
            <span class="tp">ClaimTypes</span>.NameIdentifier);
        <span class="kw">var</span> email  = <span class="tp">User</span>.<span class="mx">FindFirstValue</span>(
            <span class="tp">ClaimTypes</span>.Email);
        <span class="kw">return</span> <span class="mx">Ok</span>(<span class="kw">new</span> { userId, email });
    }
}`;

const frontendUsage = `<span class="cm">// Send token in every request header</span>
<span class="kw">const</span> token = localStorage.<span class="mx">getItem</span>(<span class="st">'token'</span>);

<span class="kw">const</span> response = <span class="kw">await</span> <span class="mx">fetch</span>(<span class="st">'/api/products'</span>, {
    method: <span class="st">'GET'</span>,
    headers: {
        <span class="st">'Authorization'</span>: <span class="st">\`Bearer \${token}\`</span>,
        <span class="st">'Content-Type'</span>: <span class="st">'application/json'</span>
    }
});

<span class="cm">// Axios interceptor (cleaner)</span>
axios.interceptors.request.<span class="mx">use</span>(config => {
    config.headers.Authorization =
        <span class="st">\`Bearer \${localStorage.<span class="mx">getItem</span>('token')}\`</span>;
    <span class="kw">return</span> config;
});`;

const scenarios = [
  { code: '[Authorize]', result: '✓ Any authenticated user', color: '#00ff88' },
  { code: '[Authorize(Roles = "Admin")]', result: '✓ Admin role only', color: '#a855f7' },
  { code: '[Authorize(Policy = "MinAge18")]', result: '✓ Custom policy', color: '#00d4ff' },
  { code: '[AllowAnonymous]', result: '✓ Anyone, no token', color: '#fbbf24' },
  { code: 'No attribute', result: '→ Inherits controller', color: '#64748b' },
];

export default function SlideProtectedEndpoints() {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 40px', gap: '16px' }}>

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.1rem', color: '#00ff88', textShadow: '0 0 20px rgba(0,255,136,0.5)', letterSpacing: '0.1em' }}
      >
        🛡️ PROTECTING ENDPOINTS — [AUTHORIZE]
      </motion.h2>

      <div style={{ width: '100%', maxWidth: 960, display: 'flex', gap: '16px', flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1.4, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <CodeBlock code={protectedController} lang="c#" delay={0.2} />
          <CodeBlock code={frontendUsage} lang="js" delay={0.4} />
        </div>

        <div style={{ flex: 0.6, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Authorize variations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{ background: '#080f1a', border: '1px solid rgba(0,255,136,0.15)', borderRadius: '8px', padding: '14px' }}
          >
            <div style={{ color: '#00ff88', fontSize: '0.65rem', fontWeight: 600, marginBottom: '10px' }}>🔐 Authorize Variations</div>
            {scenarios.map((s, i) => (
              <motion.div
                key={i}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                style={{
                  padding: '6px 8px',
                  borderRadius: '4px',
                  marginBottom: '4px',
                  background: hovered === i ? 'rgba(255,255,255,0.04)' : 'transparent',
                  cursor: 'default',
                }}
              >
                <div style={{ color: s.color, fontSize: '0.62rem', fontFamily: 'JetBrains Mono' }}>{s.code}</div>
                <div style={{ color: '#475569', fontSize: '0.58rem' }}>{s.result}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Response codes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            style={{ background: '#080f1a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '14px' }}
          >
            <div style={{ color: '#fbbf24', fontSize: '0.65rem', fontWeight: 600, marginBottom: '10px' }}>📡 HTTP Responses</div>
            {[
              { code: '200 OK', desc: 'Valid token + authorized', color: '#86efac' },
              { code: '401 Unauthorized', desc: 'No token / expired token', color: '#ff6b35' },
              { code: '403 Forbidden', desc: 'Token valid, wrong role', color: '#fbbf24' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ background: r.color + '20', color: r.color, padding: '2px 6px', borderRadius: '3px', fontSize: '0.6rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                  {r.code}
                </span>
                <span style={{ color: '#64748b', fontSize: '0.6rem' }}>{r.desc}</span>
              </div>
            ))}
          </motion.div>

          {/* Policy example */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            style={{ background: '#080f1a', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '8px', padding: '12px 14px' }}
          >
            <div style={{ color: '#00d4ff', fontSize: '0.65rem', fontWeight: 600, marginBottom: '8px' }}>📜 Custom Policy</div>
            <pre style={{ color: '#64748b', fontSize: '0.6rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{`builder.Services.AddAuthorization(
  opts => opts.AddPolicy(
    "MinAge18",
    p => p.RequireClaim(
      "age", "18")));`}</pre>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
