import { motion } from 'framer-motion';
import { CodeBlock } from '../components/CodeBlock.jsx';

const programCode = `<span class="kw">var</span> builder = <span class="tp">WebApplication</span>.<span class="mx">CreateBuilder</span>(args);

<span class="cm">// ──────────────────────────────────────────</span>
<span class="cm">// 1. EF Core + SQL Server</span>
<span class="cm">// ──────────────────────────────────────────</span>
builder.Services.<span class="mx">AddDbContext</span>&lt;<span class="tp">AppDbContext</span>&gt;(opt =>
    opt.<span class="mx">UseSqlServer</span>(builder.Configuration
        .<span class="mx">GetConnectionString</span>(<span class="st">"DefaultConnection"</span>)));

<span class="cm">// ──────────────────────────────────────────</span>
<span class="cm">// 2. ASP.NET Core Identity</span>
<span class="cm">// ──────────────────────────────────────────</span>
builder.Services
    .<span class="mx">AddIdentity</span>&lt;<span class="tp">ApplicationUser</span>, <span class="tp">IdentityRole</span>&gt;(opt => {
        opt.Password.RequireDigit           = <span class="kw">true</span>;
        opt.Password.RequiredLength         = <span class="nu">8</span>;
        opt.Password.RequireUppercase       = <span class="kw">true</span>;
        opt.Password.RequireNonAlphanumeric = <span class="kw">false</span>;
    })
    .<span class="mx">AddEntityFrameworkStores</span>&lt;<span class="tp">AppDbContext</span>&gt;()
    .<span class="mx">AddDefaultTokenProviders</span>();

<span class="cm">// ──────────────────────────────────────────</span>
<span class="cm">// 3. JWT Bearer Authentication</span>
<span class="cm">// ──────────────────────────────────────────</span>
<span class="kw">var</span> jwt = builder.Configuration
    .<span class="mx">GetSection</span>(<span class="st">"JwtSettings"</span>).<span class="mx">Get</span>&lt;<span class="tp">JwtSettings</span>&gt;()!;

builder.Services
    .<span class="mx">AddAuthentication</span>(<span class="tp">JwtBearerDefaults</span>.AuthenticationScheme)
    .<span class="mx">AddJwtBearer</span>(opt => {
        opt.TokenValidationParameters = <span class="kw">new</span> <span class="tp">TokenValidationParameters</span> {
            ValidateIssuer           = <span class="kw">true</span>,
            ValidateAudience         = <span class="kw">true</span>,
            ValidateLifetime         = <span class="kw">true</span>,
            ValidateIssuerSigningKey = <span class="kw">true</span>,
            ValidIssuer              = jwt.Issuer,
            ValidAudience            = jwt.Audience,
            IssuerSigningKey         = <span class="kw">new</span> <span class="tp">SymmetricSecurityKey</span>(
                <span class="tp">Encoding</span>.UTF8.<span class="mx">GetBytes</span>(jwt.SecretKey))
        };
    });

builder.Services.<span class="mx">AddAuthorization</span>();
builder.Services.<span class="mx">AddControllers</span>();

<span class="kw">var</span> app = builder.<span class="mx">Build</span>();

<span class="cm">// ──────────────────────────────────────────</span>
<span class="cm">// Middleware pipeline ORDER matters!</span>
<span class="cm">// ──────────────────────────────────────────</span>
app.<span class="mx">UseAuthentication</span>();  <span class="cm">// ← Must come BEFORE Authorization!</span>
app.<span class="mx">UseAuthorization</span>();
app.<span class="mx">MapControllers</span>();

app.<span class="mx">Run</span>();`;

const steps = [
  { color: '#ff6b35', label: 'AddDbContext', desc: 'Register EF Core with SQL Server connection string' },
  { color: '#a855f7', label: 'AddIdentity', desc: 'User management, password hashing, role management' },
  { color: '#00d4ff', label: 'AddJwtBearer', desc: 'Configure JWT validation parameters and signing key' },
  { color: '#fbbf24', label: 'UseAuthentication', desc: 'Must come BEFORE UseAuthorization in pipeline!' },
];

export default function SlideProgramCs() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', gap: '16px' }}>

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.1rem', color: '#00ff88', textShadow: '0 0 20px rgba(0,255,136,0.5)', letterSpacing: '0.1em' }}
      >
        🔧 PROGRAM.CS — SERVICE REGISTRATION
      </motion.h2>

      <div style={{ width: '100%', maxWidth: 940, display: 'flex', gap: '16px', flex: 1, minHeight: 0 }}>
        {/* Code */}
        <div style={{ flex: 1.4, overflow: 'auto' }}>
          <CodeBlock code={programCode} lang="c#" delay={0.2} />
        </div>

        {/* Steps sidebar */}
        <div style={{ flex: 0.6, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ color: '#475569', fontSize: '0.65rem', letterSpacing: '0.05em', marginBottom: '4px' }}
          >
            KEY STEPS:
          </motion.div>

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.15 }}
              style={{
                background: '#080f1a',
                border: `1px solid ${step.color}30`,
                borderLeft: `3px solid ${step.color}`,
                borderRadius: '8px',
                padding: '10px 14px',
              }}
            >
              <div style={{ color: step.color, fontSize: '0.7rem', fontWeight: 600, marginBottom: '4px' }}>{step.label}()</div>
              <div style={{ color: '#64748b', fontSize: '0.62rem', lineHeight: 1.5 }}>{step.desc}</div>
            </motion.div>
          ))}

          {/* Warning */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            style={{
              background: 'rgba(251,191,36,0.08)',
              border: '1px solid rgba(251,191,36,0.3)',
              borderRadius: '8px',
              padding: '10px 14px',
              marginTop: '6px',
            }}
          >
            <div style={{ color: '#fbbf24', fontSize: '0.65rem', fontWeight: 600, marginBottom: '4px' }}>
              ⚠️ ORDER MATTERS
            </div>
            <div style={{ color: '#78716c', fontSize: '0.62rem', lineHeight: 1.6 }}>
              Always <span style={{ color: '#fbbf24' }}>UseAuthentication</span> before <span style={{ color: '#f97316' }}>UseAuthorization</span>. Wrong order = all requests fail with 401.
            </div>
          </motion.div>

          {/* AppDbContext reminder */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{
              background: '#080f1a',
              border: '1px solid rgba(0,255,136,0.15)',
              borderRadius: '8px',
              padding: '10px 14px',
            }}
          >
            <div style={{ color: '#00ff88', fontSize: '0.6rem', fontWeight: 600, marginBottom: '6px' }}>📋 AppDbContext.cs</div>
            <pre style={{ color: '#475569', fontSize: '0.6rem', lineHeight: 1.6 }}>
{`public class AppDbContext
  : IdentityDbContext
    <ApplicationUser>
{
  public AppDbContext(
    DbContextOptions opts)
    : base(opts) { }
}`}
            </pre>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
