import { motion } from 'framer-motion';
import { CodeBlock } from '../components/CodeBlock.jsx';

const tokenServiceInterface = `<span class="kw">public interface</span> <span class="tp">ITokenService</span>
{
    <span class="tp">Task</span>&lt;<span class="kw">string</span>&gt; <span class="mx">GenerateTokenAsync</span>(
        <span class="tp">ApplicationUser</span> user);
}`;

const tokenServiceImpl = `<span class="kw">public class</span> <span class="tp">TokenService</span> : <span class="tp">ITokenService</span>
{
    <span class="kw">private readonly</span> <span class="tp">UserManager</span>&lt;<span class="tp">ApplicationUser</span>&gt; _um;
    <span class="kw">private readonly</span> <span class="tp">JwtSettings</span> _jwt;

    <span class="kw">public</span> <span class="tp">TokenService</span>(
        <span class="tp">UserManager</span>&lt;<span class="tp">ApplicationUser</span>&gt; um,
        <span class="tp">IOptions</span>&lt;<span class="tp">JwtSettings</span>&gt; jwt)
    { _um = um; _jwt = jwt.Value; }

    <span class="kw">public async</span> <span class="tp">Task</span>&lt;<span class="kw">string</span>&gt; <span class="mx">GenerateTokenAsync</span>(
        <span class="tp">ApplicationUser</span> user)
    {
        <span class="kw">var</span> roles = <span class="kw">await</span> _um
            .<span class="mx">GetRolesAsync</span>(user);

        <span class="cm">// Build claims list</span>
        <span class="kw">var</span> claims = <span class="kw">new</span> <span class="tp">List</span>&lt;<span class="tp">Claim</span>&gt; {
            <span class="kw">new</span>(<span class="tp">JwtRegisteredClaimNames</span>.Sub,   user.Id),
            <span class="kw">new</span>(<span class="tp">JwtRegisteredClaimNames</span>.Email, user.Email!),
            <span class="kw">new</span>(<span class="tp">JwtRegisteredClaimNames</span>.Jti,   <span class="tp">Guid</span>.<span class="mx">NewGuid</span>()
                                                    .<span class="mx">ToString</span>()),
            <span class="kw">new</span>(<span class="st">"fullName"</span>, user.FullName)
        };

        <span class="cm">// Add role claims</span>
        claims.<span class="mx">AddRange</span>(roles.<span class="mx">Select</span>(r =>
            <span class="kw">new</span> <span class="tp">Claim</span>(<span class="tp">ClaimTypes</span>.Role, r)));

        <span class="kw">var</span> key   = <span class="kw">new</span> <span class="tp">SymmetricSecurityKey</span>(
            <span class="tp">Encoding</span>.UTF8.<span class="mx">GetBytes</span>(_jwt.SecretKey));
        <span class="kw">var</span> creds = <span class="kw">new</span> <span class="tp">SigningCredentials</span>(
            key, <span class="tp">SecurityAlgorithms</span>.HmacSha256);

        <span class="kw">var</span> token = <span class="kw">new</span> <span class="tp">JwtSecurityToken</span>(
            issuer:             _jwt.Issuer,
            audience:           _jwt.Audience,
            claims:             claims,
            expires:            <span class="tp">DateTime</span>.UtcNow
                                    .<span class="mx">AddHours</span>(_jwt.ExpiryHours),
            signingCredentials: creds
        );

        <span class="kw">return new</span> <span class="tp">JwtSecurityTokenHandler</span>()
            .<span class="mx">WriteToken</span>(token);
    }
}`;

const registerDI = `<span class="cm">// In Program.cs — register service</span>
builder.Services
    .<span class="mx">AddScoped</span>&lt;<span class="tp">ITokenService</span>, <span class="tp">TokenService</span>&gt;();`;

const claimsList = [
  { claim: 'sub', value: 'user.Id', desc: 'Subject — unique user ID', color: '#ff6b35' },
  { claim: 'email', value: 'user.Email', desc: 'User email address', color: '#a855f7' },
  { claim: 'jti', value: 'Guid.NewGuid()', desc: 'JWT ID — unique per token', color: '#00d4ff' },
  { claim: 'role', value: 'roles[]', desc: 'Roles for [Authorize(Roles)]', color: '#fbbf24' },
  { claim: 'fullName', value: 'user.FullName', desc: 'Custom claim', color: '#00ff88' },
];

export default function SlideTokenService() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 40px', gap: '16px' }}>

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.1rem', color: 'var(--neon-green)', textShadow: '0 0 20px rgba(0,255,136,0.5)', letterSpacing: '0.1em' }}
      >
        🎫 TOKEN SERVICE — JWT GENERATION
      </motion.h2>

      <div style={{ width: '100%', maxWidth: 960, display: 'flex', gap: '16px', flex: 1, minHeight: 0 }}>

        {/* Code */}
        <div style={{ flex: 1.5, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <CodeBlock code={tokenServiceImpl} lang="c#" delay={0.2} />
          <CodeBlock code={registerDI} lang="c#" delay={0.4} />
        </div>

        {/* Claims + interface */}
        <div style={{ flex: 0.8, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <CodeBlock code={tokenServiceInterface} lang="c#" delay={0.3} />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            style={{ background: 'var(--bg-card)', border: '1px solid rgba(0,255,136,0.15)', borderRadius: '8px', padding: '14px' }}
          >
            <div style={{ color: 'var(--neon-green)', fontSize: '0.65rem', fontWeight: 600, marginBottom: '10px' }}>📋 Claims in Token</div>
            {claimsList.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '8px' }}
              >
                <span style={{ color: c.color, fontSize: '0.65rem', fontWeight: 600, minWidth: 60 }}>{c.claim}</span>
                <div>
                  <div style={{ color: 'var(--text-primary)', fontSize: '0.6rem' }}>{c.value}</div>
                  <div style={{ color: 'var(--nav-label)', fontSize: '0.58rem' }}>{c.desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Token lifecycle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: '8px', padding: '12px 14px' }}
          >
            <div style={{ color: 'var(--neon-yellow)', fontSize: '0.65rem', fontWeight: 600, marginBottom: '6px' }}>⏱️ Token Lifecycle</div>
            <div style={{ color: '#78716c', fontSize: '0.6rem', lineHeight: 1.7 }}>
              Tokens expire after <span style={{ color: 'var(--neon-yellow)' }}>ExpiryHours</span>.<br />
              Use <span style={{ color: 'var(--neon-yellow)' }}>Refresh Tokens</span> for silent renewal.<br />
              Store token in <span style={{ color: '#86efac' }}>localStorage</span> or <span style={{ color: '#86efac' }}>httpOnly cookie</span>.
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
