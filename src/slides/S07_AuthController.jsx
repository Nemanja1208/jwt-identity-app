import { motion } from 'framer-motion';
import { CodeBlock } from '../components/CodeBlock.jsx';
import { useState } from 'react';

const registerCode = `<span class="at">[HttpPost(<span class="st">"register"</span>)]</span>
<span class="kw">public async</span> <span class="tp">Task</span>&lt;<span class="tp">IActionResult</span>&gt; <span class="mx">Register</span>(
    [<span class="at">FromBody</span>] <span class="tp">RegisterDto</span> dto)
{
    <span class="kw">var</span> user = <span class="kw">new</span> <span class="tp">ApplicationUser</span> {
        UserName = dto.Email,
        Email    = dto.Email,
        FullName = dto.FullName
    };

    <span class="kw">var</span> result = <span class="kw">await</span> _userManager
        .<span class="mx">CreateAsync</span>(user, dto.Password);

    <span class="kw">if</span> (!result.Succeeded)
        <span class="kw">return</span> <span class="mx">BadRequest</span>(result.Errors);

    <span class="cm">// Optional: assign default role</span>
    <span class="kw">await</span> _userManager.<span class="mx">AddToRoleAsync</span>(
        user, <span class="st">"User"</span>);

    <span class="kw">return</span> <span class="mx">Ok</span>(<span class="kw">new</span> { message = <span class="st">"Registered!"</span> });
}`;

const loginCode = `<span class="at">[HttpPost(<span class="st">"login"</span>)]</span>
<span class="kw">public async</span> <span class="tp">Task</span>&lt;<span class="tp">IActionResult</span>&gt; <span class="mx">Login</span>(
    [<span class="at">FromBody</span>] <span class="tp">LoginDto</span> dto)
{
    <span class="kw">var</span> user = <span class="kw">await</span> _userManager
        .<span class="mx">FindByEmailAsync</span>(dto.Email);

    <span class="kw">if</span> (user == <span class="kw">null</span> ||
        !<span class="kw">await</span> _userManager
            .<span class="mx">CheckPasswordAsync</span>(user, dto.Password))
        <span class="kw">return</span> <span class="mx">Unauthorized</span>(<span class="st">"Invalid credentials"</span>);

    <span class="kw">var</span> token = <span class="kw">await</span> _tokenService
        .<span class="mx">GenerateTokenAsync</span>(user);

    <span class="kw">return</span> <span class="mx">Ok</span>(<span class="kw">new</span> {
        token,
        expiry = <span class="tp">DateTime</span>.UtcNow
            .<span class="mx">AddHours</span>(_jwt.ExpiryHours)
    });
}`;

const controllerHeader = `<span class="at">[Route(<span class="st">"api/[controller]"</span>)]</span>
<span class="at">[ApiController]</span>
<span class="kw">public class</span> <span class="tp">AuthController</span> : <span class="tp">ControllerBase</span>
{
    <span class="kw">private readonly</span> <span class="tp">UserManager</span>&lt;<span class="tp">ApplicationUser</span>&gt; _userManager;
    <span class="kw">private readonly</span> <span class="tp">ITokenService</span>               _tokenService;
    <span class="kw">private readonly</span> <span class="tp">JwtSettings</span>                  _jwt;

    <span class="kw">public</span> <span class="tp">AuthController</span>(
        <span class="tp">UserManager</span>&lt;<span class="tp">ApplicationUser</span>&gt; userManager,
        <span class="tp">ITokenService</span> tokenService,
        <span class="tp">IOptions</span>&lt;<span class="tp">JwtSettings</span>&gt; jwtOptions)
    {
        _userManager  = userManager;
        _tokenService = tokenService;
        _jwt          = jwtOptions.Value;
    }`;

const tabs = ['Controller Setup', 'Register', 'Login'];

export default function SlideAuthController() {
  const [tab, setTab] = useState(0);
  const codes = [controllerHeader, registerCode, loginCode];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 40px', gap: '16px' }}>

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.1rem', color: 'var(--neon-green)', textShadow: '0 0 20px rgba(0,255,136,0.5)', letterSpacing: '0.1em' }}
      >
        🎮 AUTH CONTROLLER
      </motion.h2>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-card)', borderRadius: '8px', padding: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
        {tabs.map((t, i) => (
          <motion.button
            key={t}
            onClick={() => setTab(i)}
            whileHover={{ scale: 1.02 }}
            style={{
              background: tab === i ? 'rgba(0,255,136,0.15)' : 'transparent',
              border: `1px solid ${tab === i ? 'rgba(0,255,136,0.4)' : 'transparent'}`,
              color: tab === i ? 'var(--neon-green)' : 'var(--nav-label)',
              padding: '6px 18px',
              borderRadius: '6px',
              fontSize: '0.65rem',
              fontFamily: 'JetBrains Mono',
              cursor: 'pointer',
              letterSpacing: '0.04em',
            }}
          >
            {t}
          </motion.button>
        ))}
      </div>

      <div style={{ width: '100%', maxWidth: 940, display: 'flex', gap: '16px', flex: 1, minHeight: 0 }}>
        {/* Code panel */}
        <div style={{ flex: 1.4, overflow: 'auto' }}>
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <CodeBlock code={codes[tab]} lang="c#" delay={0} />
          </motion.div>
        </div>

        {/* Right panel */}
        <div style={{ flex: 0.6, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* DTOs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{ background: 'var(--bg-card)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '8px', padding: '12px 16px' }}
          >
            <div style={{ color: 'var(--neon-blue)', fontSize: '0.65rem', fontWeight: 600, marginBottom: '8px' }}>📝 DTOs</div>
            <pre style={{ color: 'var(--text-muted)', fontSize: '0.62rem', lineHeight: 1.7 }}>{`public record RegisterDto(
  string Email,
  string Password,
  string FullName
);

public record LoginDto(
  string Email,
  string Password
);`}</pre>
          </motion.div>

          {/* Endpoint map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '12px 16px' }}
          >
            <div style={{ color: 'var(--neon-yellow)', fontSize: '0.65rem', fontWeight: 600, marginBottom: '8px' }}>🗺️ Endpoints</div>
            {[
              { method: 'POST', path: '/api/auth/register', color: '#86efac', desc: 'Create user' },
              { method: 'POST', path: '/api/auth/login', color: '#00d4ff', desc: 'Get token' },
            ].map((ep, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ background: ep.color + '20', color: ep.color, padding: '2px 6px', borderRadius: '3px', fontSize: '0.6rem', fontWeight: 700, minWidth: 40 }}>{ep.method}</span>
                <span style={{ color: 'var(--text-primary)', fontSize: '0.62rem' }}>{ep.path}</span>
                <span style={{ color: 'var(--nav-label)', fontSize: '0.6rem', marginLeft: 'auto' }}>{ep.desc}</span>
              </div>
            ))}
          </motion.div>

          {/* ApplicationUser */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            style={{ background: 'var(--bg-card)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '8px', padding: '12px 16px' }}
          >
            <div style={{ color: 'var(--neon-purple)', fontSize: '0.65rem', fontWeight: 600, marginBottom: '8px' }}>👤 ApplicationUser.cs</div>
            <pre style={{ color: 'var(--text-muted)', fontSize: '0.62rem', lineHeight: 1.7 }}>{`public class ApplicationUser
  : IdentityUser
{
  public string FullName { get; set; }
    = "";
  // Add custom props here
}`}</pre>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
