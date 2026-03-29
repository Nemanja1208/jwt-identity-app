import { motion } from 'framer-motion';

const sections = [
  {
    title: '📦 NuGet Packages',
    color: '#ff6b35',
    items: [
      'Microsoft.AspNetCore.Authentication.JwtBearer',
      'Microsoft.AspNetCore.Identity.EntityFrameworkCore',
      'Microsoft.EntityFrameworkCore.SqlServer',
      'System.IdentityModel.Tokens.Jwt',
    ],
  },
  {
    title: '⚙️ Program.cs — Services',
    color: '#a855f7',
    items: [
      'AddDbContext<AppDbContext>()',
      'AddIdentity<ApplicationUser, IdentityRole>()',
      '.AddEntityFrameworkStores<AppDbContext>()',
      'AddAuthentication(JwtBearerDefaults)',
      '.AddJwtBearer(opt => { TokenValidationParameters })',
      'AddAuthorization()',
    ],
  },
  {
    title: '⚙️ Program.cs — Middleware',
    color: '#fbbf24',
    items: [
      'UseAuthentication()  ← FIRST',
      'UseAuthorization()   ← SECOND',
      'MapControllers()',
    ],
  },
  {
    title: '🎫 Token Generation',
    color: '#00d4ff',
    items: [
      'Build List<Claim> (sub, email, role, jti)',
      'SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret))',
      'SigningCredentials(key, HmacSha256)',
      'new JwtSecurityToken(issuer, audience, claims, expires, creds)',
      'JwtSecurityTokenHandler().WriteToken(token)',
    ],
  },
  {
    title: '🛡️ Protecting Endpoints',
    color: '#00ff88',
    items: [
      '[Authorize]                    → Any valid token',
      '[Authorize(Roles = "Admin")]   → Role-based',
      '[Authorize(Policy = "Name")]   → Policy-based',
      '[AllowAnonymous]               → No auth needed',
      'User.FindFirstValue(ClaimTypes.NameIdentifier)',
    ],
  },
  {
    title: '🗄️ EF Migrations',
    color: '#86efac',
    items: [
      'dotnet ef migrations add InitialCreate',
      'dotnet ef database update',
      'Seed roles: RoleManager.CreateAsync()',
      'Assign roles: UserManager.AddToRoleAsync()',
    ],
  },
  {
    title: '🔒 Security Tips',
    color: '#f97316',
    items: [
      'Store SecretKey in User Secrets / Key Vault',
      'Use HTTPS always in production',
      'Set short token expiry + implement refresh tokens',
      'Never store sensitive data in JWT payload',
      'Validate Issuer + Audience on every request',
    ],
  },
  {
    title: '📡 Frontend Usage',
    color: '#c084fc',
    items: [
      'POST /api/auth/login → receive token',
      'Store in localStorage or httpOnly cookie',
      'Send: Authorization: Bearer {token}',
      'Use Axios interceptor for auto-attach',
      'Handle 401 → redirect to login',
    ],
  },
];

export default function SlideCheatSheet() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '70px 24px 70px', gap: '16px', overflow: 'hidden' }}>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.1rem', color: '#00ff88', textShadow: '0 0 20px rgba(0,255,136,0.5)', letterSpacing: '0.1em', flexShrink: 0 }}
      >
        📋 JWT + IDENTITY CHEAT SHEET
      </motion.h2>

      <div style={{
        width: '100%', maxWidth: 1060,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px',
        flex: 1,
        minHeight: 0,
        overflow: 'auto',
      }}>
        {sections.map((sec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -3, boxShadow: `0 8px 30px ${sec.color}20` }}
            style={{
              background: '#080f1a',
              border: `1px solid ${sec.color}25`,
              borderTop: `3px solid ${sec.color}`,
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              transition: 'box-shadow 0.2s',
            }}
          >
            <div style={{ color: sec.color, fontSize: '0.65rem', fontWeight: 700, marginBottom: '4px', letterSpacing: '0.03em' }}>
              {sec.title}
            </div>
            {sec.items.map((item, j) => (
              <motion.div
                key={j}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.07 + j * 0.05 }}
                style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
              >
                <span style={{ color: sec.color, opacity: 0.4, fontSize: '0.55rem', marginTop: '3px', flexShrink: 0 }}>▸</span>
                <span style={{ color: '#64748b', fontSize: '0.6rem', lineHeight: 1.5, fontFamily: 'JetBrains Mono' }}>{item}</span>
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{
          display: 'flex', gap: '20px', alignItems: 'center',
          color: '#1e3a52', fontSize: '0.6rem',
          flexShrink: 0,
        }}
      >
        <span>Built with ASP.NET Core 8 + Identity + JWT Bearer</span>
        <span style={{ color: '#00ff88' }}>◆</span>
        <span>NBI Handelsakademin</span>
      </motion.div>
    </div>
  );
}
