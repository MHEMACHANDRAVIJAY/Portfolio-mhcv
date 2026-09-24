/**
 * generatePortfolioHTML — MHCV V10.0 Elite Founder Edition Export
 * Compiles a single-file, 100% self-contained award-winning showcase.
 * Zero-dependencies Canvas and ES6 physics systems mimic React live preview perfectly.
 */
export const generatePortfolioHTML = (portfolio) => {
    const d = portfolio || {};
    const name    = d.name    || 'Your Name';
    const title   = d.title   || 'Software Developer';
    const summary = d.summary || d.structuredSummary?.executiveSummary || '';
    const contact = d.contact || {};

    // Skills: prefer the explicitly-passed flat array, then flatten the category object
    const skillsObj     = (typeof d.skills === 'object' && !Array.isArray(d.skills)) ? d.skills : {};
    const allSkillsFlat =
        Array.isArray(d.skillsFlat) && d.skillsFlat.length > 0
            ? d.skillsFlat
            : Array.isArray(d.skills)
                ? d.skills
                : Object.values(skillsObj).flat().filter(Boolean);
    const hasCategories = Object.values(skillsObj).some(a => a.length > 0);

    const projects     = d.projects     || [];
    const experience   = d.experience   || [];
    const education    = d.education    || [];
    const certs        = d.certifications || [];
    const achievements = d.achievements || [];
    // Soft skills — stored under skills.soft or skills.Soft from parser
    const softSkillsArr = (skillsObj.soft || skillsObj.Soft || []).filter(Boolean);

    const projCount   = projects.length;
    const expCount    = experience.length;
    const certCount   = certs.length;
    const skillCount  = allSkillsFlat.length;
    const achCount    = achievements.length;

    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'MH';
    const topSkills = allSkillsFlat.slice(0, 4);

    // ── Floating Tech Stack Cards ─────────────────────────────────────────────
    const techEmojis = { react:'⚛️', python:'🐍', node:'🟢', javascript:'🟡', typescript:'🔷', ml:'🤖', ai:'🤖', java:'☕', sql:'🗄️', html:'🌐', css:'🎨', docker:'🐳', aws:'☁️', git:'📦' };
    const getEmoji = (s) => { const k = s.toLowerCase(); return (Object.entries(techEmojis).find(([key]) => k.includes(key)) || ['', '⚡'])[1]; };
    
    const floatPositions = ['top:-10px;right:-10px;', 'bottom:22%;right:-24px;', 'top:28%;left:-24px;', 'bottom:-6px;left:22%;'];
    const floatingBadgesHTML = topSkills.slice(0, 4).map((s, i) => `
    <div class="orbit-badge orbit-badge-${i}" style="${floatPositions[i]}">
      <span>${getEmoji(s)}</span>
      <span>${esc(s)}</span>
    </div>`).join('');

    // ── Issuer SVG logos ──────────────────────────────────────────────────────
    const getIssuerSVG = (issuer = '') => {
        const n = issuer.toLowerCase();
        if (n.includes('google')) return `<svg viewBox="0 0 24 24" width="26" height="26"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>`;
        if (n.includes('aws') || n.includes('amazon')) return `<svg viewBox="0 0 80 30" width="48" height="18"><text x="2" y="22" font-size="22" font-weight="900" fill="#FF9900" font-family="Arial">aws</text></svg>`;
        if (n.includes('microsoft') || n.includes('azure')) return `<svg viewBox="0 0 23 23" width="26" height="26"><path d="M1 1h10v10H1z" fill="#f25022"/><path d="M12 1h10v10H12z" fill="#7fba00"/><path d="M1 12h10v10H1z" fill="#00a4ef"/><path d="M12 12h10v10H12z" fill="#ffb900"/></svg>`;
        if (n.includes('coursera')) return `<svg viewBox="0 0 100 100" width="26" height="26"><circle cx="50" cy="50" r="50" fill="#0056D2"/><text x="50" y="67" text-anchor="middle" font-size="52" font-weight="bold" fill="white">C</text></svg>`;
        if (n.includes('udemy'))    return `<svg viewBox="0 0 100 100" width="26" height="26"><circle cx="50" cy="50" r="50" fill="#A435F0"/><text x="50" y="67" text-anchor="middle" font-size="52" font-weight="bold" fill="white">U</text></svg>`;
        if (n.includes('nptel') || n.includes('iit') || n.includes('swayam')) return `<svg viewBox="0 0 100 100" width="26" height="26"><circle cx="50" cy="50" r="50" fill="#ff6d00"/><text x="50" y="67" text-anchor="middle" font-size="38" font-weight="bold" fill="white">N</text></svg>`;
        if (n.includes('ibm'))  return `<svg viewBox="0 0 100 100" width="26" height="26"><rect width="100" height="100" rx="12" fill="#1F70C1"/><text x="50" y="67" text-anchor="middle" font-size="38" font-weight="bold" fill="white">IBM</text></svg>`;
        if (n.includes('meta') || n.includes('facebook')) return `<svg viewBox="0 0 100 100" width="26" height="26"><rect width="100" height="100" rx="12" fill="#0866FF"/><text x="50" y="67" text-anchor="middle" font-size="52" font-weight="bold" fill="white">M</text></svg>`;
        const letter = issuer.charAt(0).toUpperCase() || '?';
        return `<svg viewBox="0 0 100 100" width="26" height="26"><rect width="100" height="100" rx="16" fill="rgba(99,102,241,0.25)"/><text x="50" y="67" text-anchor="middle" font-size="52" font-weight="bold" fill="#818cf8">${esc(letter)}</text></svg>`;
    };

    // ── Project card grid ─────────────────────────────────────────────────────
    const thumbPalettes = [
        ['#1e1b4b','#312e81','#4c1d95'],
        ['#0c4a6e','#075985','#1e3a5f'],
        ['#4a044e','#701a75','#831843'],
        ['#064e3b','#065f46','#134e4a'],
        ['#431407','#7c2d12','#78350f'],
        ['#1e3a8a','#1d4ed8','#312e81'],
    ];
    const projEmojis = ['⚡','🔬','🧠','🛡️','📊','🌐','🚀','💡','🔮','🌊'];

    const projectCardsHTML = projects.map((p, i) => {
        const pal = thumbPalettes[i % thumbPalettes.length];
        const emoji = projEmojis[i % projEmojis.length];
        const techBadges = (p.tech || []).slice(0, 4).map(t => `<span class="tech-badge">${esc(t)}</span>`).join('');
        const stackBadges = (!p.tech || !p.tech.length) && p.stack
            ? p.stack.split(',').slice(0, 4).map(t => `<span class="tech-badge">${esc(t.trim())}</span>`).join('') : '';
        const allBadges = techBadges || stackBadges;
        const desc = p.problem || p.desc || '';

        return `
    <div class="tilt-card-container reveal">
      <div class="tilt-card">
        <div class="tilt-card-glare"></div>
        <div class="tilt-card-inner">
          <div class="proj-thumb" style="background:linear-gradient(135deg,${pal[0]},${pal[1]},${pal[2]})">
            <div class="proj-thumb-ring1"></div>
            <div class="proj-thumb-ring2"></div>
            <div class="proj-emoji">${emoji}</div>
            <div class="proj-thumb-tech">
              ${(p.tech || []).slice(0,2).map(t => `<span class="proj-thumb-badge">${esc(t)}</span>`).join('')}
            </div>
            <div class="proj-thumb-fade"></div>
          </div>
          <div class="proj-body">
            <h3 class="proj-title">${esc(p.title)}</h3>
            ${desc ? `<p class="proj-desc">${esc(desc)}</p>` : ''}
            ${allBadges ? `<div class="tech-row">${allBadges}</div>` : ''}
            <div class="proj-actions">
              <button class="btn-case-study" onclick="openCaseStudy(${i})">📖 Case Study</button>
              ${p.link && p.link !== '#' ? `<a href="${esc(p.link)}" target="_blank" class="btn-proj-sm">↗</a>` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>`;
    }).join('');

    // ── Experience nodes timeline ─────────────────────────────────────────────
    const timelineHTML = experience.map((exp, i) => `
    <div class="tl-item reveal">
      <div class="tl-dot-col">
        <div class="tl-dot"></div>
      </div>
      <div class="tl-body">
        <div class="tl-trigger" onclick="toggleTl(${i})">
          <div>
            <div class="tl-role">${esc(exp.role)}</div>
            <div class="tl-company">${esc(exp.company)}${exp.location ? ` • ${esc(exp.location)}` : ''}</div>
          </div>
          <div style="display:flex;align-items:center;gap:0.75rem;">
            <span class="tl-period">${esc(exp.period || '')}</span>
            <span class="tl-chevron" id="chev-${i}">▾</span>
          </div>
        </div>
        <div class="tl-content" id="tl-${i}" style="${i === 0 ? 'display:block' : 'display:none'}">
          ${exp.desc ? exp.desc.split('\n').filter(Boolean).map(l =>
        `<div class="tl-bullet"><span class="tl-dot-sm"></span><span>${esc(l.replace(/^[•\-*]\s*/, ''))}</span></div>`
    ).join('') : ''}
        </div>
      </div>
    </div>`).join('');

    // ── Certifications gallery ────────────────────────────────────────────────
    const certsHTML = certs.map(c => `
    <div class="cert-card reveal">
      <div class="cert-logo">${getIssuerSVG(c.issuer || '')}</div>
      <div>
        <div class="cert-title">${esc(c.title)}</div>
        ${c.issuer ? `<div class="cert-issuer">${esc(c.issuer)}</div>` : ''}
        ${c.year   ? `<div class="cert-year">${esc(c.year)}</div>` : ''}
      </div>
    </div>`).join('');

    // ── Education entries ─────────────────────────────────────────────────────
    // Backend parser outputs 'school'; DataEditor normalises to 'institution'.
    // Support both so that freshly parsed data and edited data both render.
    const eduHTML = education.map(e => `
    <div class="edu-item">
      <div class="edu-icon">🎓</div>
      <div>
        <div class="edu-degree">${esc(e.degree || '')}</div>
        <div class="edu-inst">${esc(e.institution || e.school || '')}</div>
        ${(e.year || e.period) ? `<div class="edu-year">${esc(e.year || e.period)}${(e.score || e.cgpa) ? ' • ' + esc(e.score || e.cgpa) : ''}</div>` : ''}
      </div>
    </div>`).join('');

    // ── Soft Skills badges HTML ───────────────────────────────────────────────
    const softSkillsHTML = softSkillsArr.length > 0
        ? `<div style="margin-bottom:1.75rem;">
            <div style="font-size:0.55rem;font-weight:900;letter-spacing:0.25em;text-transform:uppercase;color:#475569;margin-bottom:0.75rem;">Soft Skills</div>
            <div style="display:flex;flex-wrap:wrap;gap:0.45rem;">
              ${softSkillsArr.map(s => `<span style="display:inline-flex;align-items:center;padding:0.28rem 0.7rem;border-radius:99px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.22);font-size:0.68rem;font-weight:700;color:#6ee7b7;letter-spacing:0.02em;">${esc(s)}</span>`).join('')}
            </div>
           </div>`
        : '';

    // ── Achievements grid cards ───────────────────────────────────────────────
    const achTypeConfig = {
        research:   { emoji:'📄', label:'Research',    bg:'rgba(59,130,246,0.1)',  border:'rgba(59,130,246,0.25)',  color:'#93c5fd' },
        conference: { emoji:'🎤', label:'Conference',  bg:'rgba(139,92,246,0.1)', border:'rgba(139,92,246,0.25)', color:'#c4b5fd' },
        award:      { emoji:'🏆', label:'Award',       bg:'rgba(245,158,11,0.1)', border:'rgba(245,158,11,0.25)', color:'#fcd34d' },
        scholarship:{ emoji:'🎓', label:'Scholarship', bg:'rgba(16,185,129,0.1)', border:'rgba(16,185,129,0.25)', color:'#6ee7b7' },
        trophy:     { emoji:'⭐', label:'Recognition', bg:'rgba(99,102,241,0.1)', border:'rgba(99,102,241,0.25)', color:'#a5b4fc' },
    };
    const categorizeAch = (text) => {
        const t = text.toLowerCase();
        if (/research|paper|publish|journal|arxiv|ieee|acm|springer/.test(t)) return 'research';
        if (/conference|symposium|workshop|present|keynote/.test(t)) return 'conference';
        if (/award|prize|winner|gold|silver|bronze|rank.1|first.place|champion|best/.test(t)) return 'award';
        if (/scholarship|fellowship|grant|funded|stipend/.test(t)) return 'scholarship';
        return 'trophy';
    };
    const achHTML = achievements.slice(0, 10).map(a => {
        const type = categorizeAch(a);
        const c = achTypeConfig[type];
        return `
    <div class="ach-card reveal" style="background:${c.bg};border-color:${c.border}">
      <div class="ach-icon" style="background:${c.bg};border-color:${c.border}">${c.emoji}</div>
      <div>
        <div class="ach-type" style="color:${c.color}">${c.label}</div>
        <p class="ach-text">${esc(a)}</p>
      </div>
    </div>`;
    }).join('');

    const projectsJson = JSON.stringify(projects.map(p => ({
        title: p.title || '', desc: p.desc || '', problem: p.problem || '',
        solution: p.solution || '', impact: p.impact || '',
        tech: p.tech || (p.stack ? p.stack.split(',').map(s => s.trim()) : []),
        link: p.link || '', github: p.github || '',
    }))).replace(/<\/script>/gi, '<\\/script>');

    const skillsJson = JSON.stringify(allSkillsFlat);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(name)} — Portfolio</title>
  <meta name="description" content="${esc(summary.slice(0, 160))}">
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&f[]=clash-display@300,400,500,600,700&display=swap" rel="stylesheet">

  <style>
    /* ── Reset & Core ──────────────────────────────────────────── */
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
    html{scroll-behavior:smooth;}
    body{font-family:'Satoshi','Inter',system-ui,sans-serif;background:#030712;color:#e2e8f0;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
    a{color:inherit;text-decoration:none;}
    button{font-family:inherit;cursor:pointer;}

    /* ── Micro-noise overlay ───────────────────────────────────── */
    .noise-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.012'/%3E%3C/svg%3E");
    }

    /* ── High-end Grid overlay ─────────────────────────────────── */
    .circuit-grid {
      background-image:
        linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
      background-size: 50px 50px;
      mask-image: radial-gradient(circle at center, black, transparent 80%);
    }

    /* ── Aurora Background Mesh ────────────────────────────────── */
    .bg-layer{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;}
    .aurora-1{position:absolute;top:-30%;left:-15%;width:65%;height:65%;border-radius:50%;background:rgba(99,102,241,0.22);filter:blur(150px);animation:aFloat1 18s ease-in-out infinite;}
    .aurora-2{position:absolute;bottom:-20%;right:-15%;width:55%;height:70%;border-radius:50%;background:rgba(139,92,246,0.18);filter:blur(170px);animation:aFloat2 22s ease-in-out infinite;}
    .aurora-3{position:absolute;top:40%;left:35%;width:45%;height:45%;border-radius:50%;background:rgba(192,38,211,0.1);filter:blur(140px);animation:aFloat3 28s ease-in-out infinite;}
    .aurora-4{position:absolute;top:5%;right:20%;width:28%;height:28%;border-radius:50%;background:rgba(8,145,178,0.08);filter:blur(100px);animation:aFloat4 24s ease-in-out infinite;}
    @keyframes aFloat1{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(5%,8%) scale(1.08);}66%{transform:translate(-4%,4%) scale(0.95);}}
    @keyframes aFloat2{0%,100%{transform:translate(0,0) scale(1);}40%{transform:translate(-6%,-5%) scale(1.12);}70%{transform:translate(4%,3%) scale(0.93);}}
    @keyframes aFloat3{0%,100%{transform:translate(0,0);}50%{transform:translate(-8%,6%);}}
    @keyframes aFloat4{0%,100%{transform:translate(0,0);}50%{transform:translate(6%,-8%);}}

    /* ── Spotlight Cursor Glow ────────────────────────────────── */
    #cursorGlow {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 1;
      transition: background 0.08s ease;
    }

    /* ── Navbar ────────────────────────────────────────────────── */
    nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:1.25rem 3rem;background:rgba(3,7,18,0.75);backdrop-filter:blur(20px);border-b:1px solid rgba(255,255,255,0.05);}
    .nav-logo{font-size:0.95rem;font-weight:900;letter-spacing:-0.03em;color:#fff;}
    .nav-logo span{color:#6366f1;}
    .nav-links{display:flex;gap:2.25rem;}
    .nav-links a{font-size:0.65rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#64748b;transition:color 0.2s;}
    .nav-links a:hover{color:#fff;}
    @media(max-width:768px){.nav-links{display:none;}}

    /* ── Main Layout ───────────────────────────────────────────── */
    .page{position:relative;z-index:2;}
    .container{max-width:1200px;margin:0 auto;padding:0 2rem;}
    section{padding:6.5rem 0;}
    .section-label{display:flex;align-items:center;gap:1rem;margin-bottom:3rem;}
    .section-icon{display:flex;align-items:center;justify-content:center;width:2.25rem;height:2.25rem;border-radius:0.75rem;background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.2);font-size:0.9rem;}
    .section-text{font-size:0.6rem;font-weight:900;letter-spacing:0.3em;text-transform:uppercase;color:#6366f1;}
    .section-line{flex:1;height:1px;background:rgba(255,255,255,0.05);}
    h2.section-heading{font-size:clamp(2rem,5vw,3.5rem);font-weight:900;letter-spacing:-0.03em;color:#fff;margin-bottom:0.5rem;}
    .section-center{text-align:center;margin-bottom:4rem;}
    .section-pill{display:inline-flex;align-items:center;gap:0.5rem;padding:0.4rem 1rem;border-radius:99px;background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.2);font-size:0.6rem;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;color:#818cf8;margin-bottom:1.25rem;}

    /* ── Typography Heading override ────────────────────────────── */
    h1,h2,h3,h4,h5,h6,.font-heading{font-family:'Clash Display','Space Grotesk',sans-serif;}

    /* ── Hero ──────────────────────────────────────────────────── */
    #hero{min-height:100vh;display:flex;align-items:center;padding-top:6rem;}
    .hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;}
    @media(max-width:960px){.hero-grid{grid-template-columns:1fr;}.hero-right{display:none;}}
    .avail-badge{display:inline-flex;align-items:center;gap:0.6rem;padding:0.45rem 1rem;border-radius:99px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);font-size:0.65rem;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;color:#34d399;margin-bottom:1.5rem;}
    .avail-dot{width:0.5rem;height:0.5rem;border-radius:50%;background:#10b981;animation:pulseG 2s infinite;}
    @keyframes pulseG{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.5;transform:scale(1.6);}}
    h1.hero-name{font-size:clamp(2.5rem,7vw,4.5rem);font-weight:900;letter-spacing:-0.03em;line-height:0.95;background:linear-gradient(135deg,#fff 0%,rgba(255,255,255,0.3) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:1rem;}
    .hero-role{font-size:clamp(1.1rem,2.5vw,1.5rem);font-weight:900;margin-bottom:1.25rem;min-height:2.2rem;display:flex;align-items:center;}
    .hero-role-text{background:linear-gradient(135deg,#818cf8,#c084fc,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
    .hero-cursor{color:#8b5cf6;animation:blink 1s infinite;}
    @keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
    .hero-summary{font-size:1rem;color:#94a3b8;font-weight:600;line-height:1.75;margin-bottom:2rem;max-width:520px;}
    .hero-btns{display:flex;flex-wrap:wrap;gap:0.875rem;margin-bottom:1.75rem;}
    .btn-primary{display:inline-flex;align-items:center;gap:0.5rem;padding:0.875rem 1.875rem;border-radius:99px;background:#fff;color:#030712;font-size:0.65rem;font-weight:900;letter-spacing:0.15em;text-transform:uppercase;border:none;transition:all 0.2s;box-shadow:0 16px 40px -8px rgba(255,255,255,0.15);}
    .btn-primary:hover{transform:scale(1.04);background:#e0e7ff;}
    .btn-outline{display:inline-flex;align-items:center;gap:0.5rem;padding:0.875rem 1.875rem;border-radius:99px;background:rgba(255,255,255,0.03);color:#fff;border:1px solid rgba(255,255,255,0.12);font-size:0.65rem;font-weight:900;letter-spacing:0.15em;text-transform:uppercase;transition:all 0.2s;}
    .btn-outline:hover{background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.25);transform:scale(1.04);}
    .hero-socials{display:flex;gap:1rem;}
    .hero-socials a{font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#475569;padding:0.4rem 0.8rem;border-radius:0.5rem;border:1px solid rgba(255,255,255,0.05);transition:color 0.2s,border-color 0.2s;}
    .hero-socials a:hover{color:#818cf8;border-color:rgba(99,102,241,0.3);}

    /* ── Orb Container & Orbit badges ───────────────────────────── */
    .avatar-wrap{position:relative;display:flex;align-items:center;justify-content:center;width:360px;height:360px;margin:auto;}
    .orbit-badge{position:absolute;display:flex;align-items:center;gap:0.4rem;padding:0.45rem 0.85rem;border-radius:0.875rem;background:rgba(8,15,31,0.92);border:1px solid rgba(255,255,255,0.15);backdrop-filter:blur(8px);font-size:0.65rem;font-weight:700;color:#fff;white-space:nowrap;box-shadow:0 8px 24px -4px rgba(0,0,0,0.5);z-index:20;transition:border-color 0.2s,box-shadow 0.2s;}
    .orbit-badge:hover{border-color:rgba(99,102,241,0.5);box-shadow:0 0 15px rgba(99,102,241,0.25);}
    .orbit-badge-0{animation:fc0 3.5s ease-in-out infinite;}
    .orbit-badge-1{animation:fc1 4s ease-in-out infinite 0.8s;}
    .orbit-badge-2{animation:fc2 3.8s ease-in-out infinite 1.6s;}
    .orbit-badge-3{animation:fc3 4.2s ease-in-out infinite 2.4s;}
    @keyframes fc0{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
    @keyframes fc1{0%,100%{transform:translateY(0);}50%{transform:translateY(-9px);}}
    @keyframes fc2{0%,100%{transform:translateY(0);}50%{transform:translateY(-7px);}}
    @keyframes fc3{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}

    /* ── Metrics Live Dashboard ────────────────────────────────── */
    .metrics-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;margin-bottom:6rem;}
    @media(max-width:768px){.metrics-grid{grid-template-columns:repeat(2,1fr);}}
    .metric-card{padding:1.75rem;border-radius:2rem;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);transition:all 0.3s;display:flex;align-items:center;gap:1rem;}
    .metric-card:hover{border-color:rgba(99,102,241,0.45);background:rgba(99,102,241,0.05);transform:translateY(-4px);}
    .metric-icon{width:2.5rem;height:2.5rem;border-radius:0.75rem;background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.25);display:flex;align-items:center;justify-content:center;font-size:1.1rem;}
    .metric-val{font-size:2.25rem;font-weight:900;color:#fff;margin-bottom:0.15rem;}
    .metric-lbl{font-size:0.55rem;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;color:#64748b;}

    /* ── About ─────────────────────────────────────────────────── */
    .about-grid{display:grid;grid-template-columns:1fr 1.1fr;gap:5rem;align-items:center;}
    @media(max-width:1024px){.about-grid{grid-template-columns:1fr;}.galaxy-box-wrap{margin-top:2rem;}}
    .about-text{font-size:1.05rem;color:#94a3b8;font-weight:600;line-height:1.8;margin-bottom:1.5rem;}
    .edu-item{display:flex;align-items:flex-start;gap:0.85rem;margin-bottom:1rem;}
    .edu-icon{width:2.25rem;height:2.25rem;border-radius:0.6rem;background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.2);display:flex;align-items:center;justify-content:center;font-size:0.9rem;flex-shrink:0;}
    .edu-degree{font-size:0.875rem;font-weight:900;color:#e2e8f0;margin-bottom:0.15rem;}
    .edu-inst{font-size:0.75rem;color:#6366f1;font-weight:700;margin-bottom:0.1rem;}
    .edu-year{font-size:0.65rem;color:#64748b;font-weight:700;}

    /* ── Skill Galaxy HUD & Canvas ────────────────────────────── */
    .galaxy-box-wrap{position:relative;width:100%;max-width:560px;height:420px;border-radius:2rem;border:1px solid rgba(255,255,255,0.06);background:rgba(0,0,0,0.45);backdrop-filter:blur(8px);overflow:hidden;}
    .galaxy-hud{position:absolute;bottom:1.25rem;left:1.25rem;right:1.25rem;padding:1rem;border-radius:1.125rem;background:rgba(11,19,41,0.96);border:1px solid rgba(99,102,241,0.3);backdrop-filter:blur(10px);display:none;justify-content:space-between;align-items:center;z-index:20;}
    .hud-title{font-size:0.85rem;font-weight:900;color:#fff;}
    .hud-cat{font-size:0.55rem;font-weight:900;color:#6366f1;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:0.15rem;}
    .hud-pill{padding:0.3rem 0.75rem;border-radius:0.5rem;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.25);font-size:0.55rem;font-weight:900;text-transform:uppercase;color:#a5b4fc;}

    /* ── 3D perspective cards ───────────────────────────────────── */
    .tilt-card-container {
      perspective: 1200px;
    }
    .tilt-card {
      transition: transform 0.1s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease;
      transform-style: preserve-3d;
      position: relative;
      overflow: hidden;
      border-radius: 2.25rem;
      background: #060d1f;
      border: 1px solid rgba(255, 255, 255, 0.08);
      height: 100%;
      box-shadow: 0 20px 50px rgba(0,0,0,0.4);
    }
    .tilt-card-glare {
      position: absolute;
      inset: 0;
      pointer-events: none;
      mix-blend-mode: overlay;
      opacity: 0;
      transition: opacity 0.15s ease;
      background: radial-gradient(circle 240px at 0% 0%, rgba(255, 255, 255, 0.16), transparent 80%);
    }
    .tilt-card-inner {
      transform: translateZ(40px);
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    /* ── Projects grid ─────────────────────────────────────────── */
    .projects-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:2.25rem;}
    @media(max-width:768px){.projects-grid{grid-template-columns:1fr;}}
    .proj-thumb{position:relative;height:12rem;display:flex;align-items:center;justify-content:center;overflow:hidden;}
    .proj-thumb-ring1{position:absolute;top:1rem;right:1rem;width:4.5rem;height:4.5rem;border-radius:50%;border:1px solid rgba(255,255,255,0.12);}
    .proj-thumb-ring2{position:absolute;bottom:-1.5rem;left:-1.5rem;width:6.5rem;height:6.5rem;border-radius:50%;border:1px solid rgba(255,255,255,0.06);}
    .proj-emoji{position:absolute;font-size:4.5rem;opacity:0.5;}
    .proj-thumb-tech{position:absolute;bottom:0.75rem;right:0.75rem;display:flex;flex-direction:column;gap:0.25rem;align-items:flex-end;z-index:2;}
    .proj-thumb-badge{padding:0.15rem 0.55rem;border-radius:0.35rem;background:rgba(0,0,0,0.65);border:1px solid rgba(255,255,255,0.22);font-size:0.55rem;font-weight:900;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.85);backdrop-filter:blur(4px);}
    .proj-thumb-fade{position:absolute;bottom:0;left:0;right:0;height:5.5rem;background:linear-gradient(to top,#060d1f,transparent);z-index:1;}
    .proj-body{padding:2rem;flex:1;display:flex;flex-direction:column;}
    .proj-title{font-size:1.25rem;font-weight:900;color:#fff;margin-bottom:0.875rem;transition:color 0.2s;}
    .tilt-card:hover .proj-title{color:#a5b4fc;}
    .proj-desc{font-size:0.8rem;color:#94a3b8;line-height:1.65;margin-bottom:1.125rem;font-weight:600;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
    .tech-row{display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:1.25rem;}
    .tech-badge{padding:0.25rem 0.65rem;border-radius:0.5rem;background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.08);font-size:0.55rem;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;color:#64748b;}
    .proj-actions{display:flex;gap:0.6rem;margin-top:auto;padding-top:1.25rem;border-top:1px solid rgba(255,255,255,0.05);}
    .btn-case-study{flex:1;padding:0.75rem;border-radius:99px;border:none;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;font-size:0.6rem;font-weight:900;letter-spacing:0.14em;text-transform:uppercase;transition:all 0.2s;box-shadow:0 6px 20px -4px rgba(99,102,241,0.4);display:flex;align-items:center;justify-content:center;gap:0.5rem;}
    .btn-case-study:hover{opacity:0.88;transform:scale(1.02);}
    .btn-proj-sm{padding:0.75rem 1rem;border-radius:99px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.12);color:#fff;font-size:0.6rem;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;transition:all 0.2s;display:flex;align-items:center;justify-content:center;}
    .btn-proj-sm:hover{background:rgba(255,255,255,0.08);transform:scale(1.05);}

    /* ── Immersive Case Study Modal ────────────────────────────── */
    .modal-overlay{display:none;position:fixed;inset:0;z-index:500;align-items:center;justify-content:center;padding:1rem;}
    .modal-overlay.open{display:flex;}
    .modal-backdrop{position:absolute;inset:0;background:rgba(0,0,0,0.9);backdrop-filter:blur(24px);}
    .modal-box{position:relative;width:100%;max-width:720px;max-height:88vh;overflow-y:auto;border-radius:2.5rem;background:#060f20;border:1px solid rgba(99,102,241,0.22);box-shadow:0 40px 100px -20px rgba(99,102,241,0.35);scrollbar-width:thin;scrollbar-color:rgba(99,102,241,0.2) transparent;}
    .modal-glow{position:absolute;top:0;inset-x:0;height:180px;background:linear-gradient(to bottom,rgba(99,102,241,0.12),transparent);pointer-events:none;border-radius:2.5rem;}
    .modal-close{position:absolute;top:1.5rem;right:1.5rem;z-index:10;padding:0.5rem;border-radius:0.75rem;cursor:pointer;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);color:#fff;font-size:0.95rem;line-height:1;transition:all 0.2s;}
    .modal-close:hover{background:rgba(255,255,255,0.12);}
    .modal-body{padding:3rem;}
    .modal-kicker{font-size:0.55rem;font-weight:900;letter-spacing:0.3em;text-transform:uppercase;color:#818cf8;display:block;margin-bottom:0.625rem;}
    .modal-title{font-size:1.8rem;font-weight:900;color:#fff;line-height:1.2;margin-bottom:2.25rem;letter-spacing:-0.02em;}
    .modal-sec{margin-bottom:1.5rem;padding:1.5rem;border-radius:1.75rem;}
    .modal-sec-dark{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);}
    .modal-sec-indigo{background:rgba(99,102,241,0.05);border:1px solid rgba(99,102,241,0.15);}
    .modal-sec-green{background:rgba(16,185,129,0.05);border:1px solid rgba(16,185,129,0.15);}
    .modal-sec-lbl{font-size:0.55rem;font-weight:900;letter-spacing:0.25em;text-transform:uppercase;color:#64748b;display:block;margin-bottom:0.6rem;}
    .modal-sec-lbl.il{color:#818cf8;}
    .modal-sec-lbl.gl{color:#34d399;}
    .modal-sec p{font-size:0.82rem;color:#94a3b8;line-height:1.75;font-weight:600;}
    .modal-two{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;}
    @media(max-width:540px){.modal-two{grid-template-columns:1fr;}.modal-body{padding:2rem 1.5rem;}}
    .modal-links{display:flex;gap:1rem;margin-top:2.5rem;padding-top:1.5rem;border-top:1px solid rgba(255,255,255,0.05);}
    .modal-btn-p{flex:1;padding:0.9rem;border-radius:99px;border:none;cursor:pointer;background:#fff;color:#030712;font-size:0.65rem;font-weight:900;letter-spacing:0.14em;text-transform:uppercase;transition:all 0.2s;text-align:center;box-shadow:0 12px 24px rgba(255,255,255,0.08);}
    .modal-btn-p:hover{background:#e0e7ff;transform:scale(1.01);}
    .modal-btn-s{flex:1;padding:0.9rem;border-radius:99px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);color:#fff;font-size:0.65rem;font-weight:900;letter-spacing:0.14em;text-transform:uppercase;cursor:pointer;transition:all 0.2s;text-align:center;}
    .modal-btn-s:hover{background:rgba(255,255,255,0.1);transform:scale(1.01);}

    /* ── Luxury Animated Timeline Roadmap ───────────────────────── */
    .tl-container{position:relative;}
    .tl-roadmap-line{position:absolute;left:33px;top:6px;bottom:6px;w-width:2px;width:2px;background:rgba(255,255,255,0.05);overflow:hidden;border-radius:99px;}
    .tl-roadmap-progress{width:100%;height:100%;background:linear-gradient(to bottom,#6366f1,#8b5cf6,#d946ef);transform-origin:top;transform:scaleY(0);transition:transform 0.08s ease-out;}
    .tl-item{display:flex;gap:2rem;margin-bottom:0;position:relative;}
    .tl-dot-col{display:flex;flex-direction:column;align-items:center;flex-shrink:0;padding-top:0.3rem;position:relative;}
    .tl-dot{width:1rem;height:1rem;border-radius:50%;background:#6366f1;border:4px solid #030712;box-shadow:0 0 0 4px rgba(99,102,241,0.2);flex-shrink:0;z-index:10;}
    .tl-body{flex:1;padding-bottom:3rem;}
    .tl-trigger{display:flex;justify-content:space-between;align-items:flex-start;gap:1.5rem;cursor:pointer;padding:0.25rem 0;}
    .tl-role{font-size:1.15rem;font-weight:900;color:#fff;margin-bottom:0.25rem;transition:color 0.2s;letter-spacing:-0.01em;}
    .tl-trigger:hover .tl-role{color:#a5b4fc;}
    .tl-company{font-size:0.85rem;font-weight:700;color:#64748b;}
    .tl-period{font-size:0.55rem;font-weight:900;letter-spacing:0.15em;text-transform:uppercase;color:#6366f1;padding:0.35rem 0.9rem;border-radius:99px;background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.2);white-space:nowrap;}
    .tl-chevron{color:#4b5563;font-size:1rem;flex-shrink:0;transition:transform 0.3s;}
    .tl-chevron.open{transform:rotate(180deg);}
    .tl-content{margin-top:1rem;padding:1.5rem;border-radius:1.75rem;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);}
    .tl-bullet{display:flex;align-items:flex-start;gap:0.75rem;margin-bottom:0.45rem;}
    .tl-dot-sm{display:block;flex-shrink:0;width:0.35rem;height:0.35rem;border-radius:50%;background:#6366f1;margin-top:0.55rem;}
    .tl-bullet span:last-child{font-size:0.82rem;color:#cbd5e1;line-height:1.65;font-weight:600;}

    /* ── Certifications gallery ────────────────────────────────── */
    .certs-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;}
    @media(max-width:768px){.certs-grid{grid-template-columns:1fr 1fr;}}
    @media(max-width:480px){.certs-grid{grid-template-columns:1fr;}}
    .cert-card{display:flex;align-items:center;gap:1.25rem;padding:1.5rem;border-radius:2rem;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);transition:all 0.3s;}
    .cert-card:hover{border-color:rgba(99,102,241,0.4);transform:translateY(-5px);box-shadow:0 12px 40px -8px rgba(99,102,241,0.25);}
    .cert-logo{width:3rem;height:3rem;border-radius:0.875rem;flex-shrink:0;background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:center;}
    .cert-title{font-size:0.85rem;font-weight:900;color:#e2e8f0;margin-bottom:0.2rem;line-height:1.3;}
    .cert-issuer{font-size:0.72rem;color:#64748b;font-weight:700;}
    .cert-year{font-size:0.6rem;color:rgba(99,102,241,0.75);margin-top:0.15rem;font-weight:900;text-transform:uppercase;}

    /* ── Achievements Wall ─────────────────────────────────────── */
    .ach-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;}
    @media(max-width:640px){.ach-grid{grid-template-columns:1fr;}}
    .ach-card{display:flex;align-items:flex-start;gap:1.25rem;padding:1.5rem;border-radius:2rem;border:1px solid;transition:all 0.3s;}
    .ach-card:hover{transform:translateY(-4px);border-color:rgba(99,102,241,0.45);}
    .ach-icon{width:2.75rem;height:2.75rem;border-radius:0.875rem;border:1px solid;display:flex;align-items:center;justify-content:center;font-size:1.15rem;flex-shrink:0;}
    .ach-type{font-size:0.55rem;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:0.35rem;}
    .ach-text{font-size:0.82rem;color:#94a3b8;line-height:1.65;font-weight:600;}

    /* ── Contact Premium CTA ───────────────────────────────────── */
    .contact-cta{position:relative;overflow:hidden;padding:6rem 3rem;text-align:center;border-radius:2.5rem;background:linear-gradient(135deg,rgba(30,27,75,0.8),rgba(76,29,149,0.5),rgba(3,7,18,0.9));border:1px solid rgba(99,102,241,0.2);shadow-[0_30px_90px_rgba(99,102,241,0.15)]}
    .contact-cta::before{content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);width:70%;height:70%;border-radius:50%;background:rgba(99,102,241,0.18);filter:blur(90px);pointer-events:none;}
    .cta-inner{position:relative;z-index:1;}
    .cta-badge{display:inline-block;padding:0.45rem 1.1rem;border-radius:99px;background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.2);font-size:0.6rem;font-weight:900;letter-spacing:0.25em;text-transform:uppercase;color:#818cf8;margin-bottom:1.5rem;}
    h2.cta-heading{font-size:clamp(2rem,5vw,4rem);font-weight:900;letter-spacing:-0.03em;color:#fff;margin-bottom:1rem;line-height:1.15;}
    .cta-sub{font-size:1rem;color:#94a3b8;max-width:480px;margin:0 auto 2.5rem;line-height:1.75;font-weight:600;}
    .cta-links{display:flex;flex-wrap:wrap;justify-content:center;gap:1.25rem;}
    .cta-link{display:inline-flex;align-items:center;gap:0.5rem;padding:0.9rem 1.875rem;border-radius:99px;font-size:0.65rem;font-weight:900;letter-spacing:0.15em;text-transform:uppercase;transition:all 0.2s;}
    .cta-link:hover{transform:scale(1.05);}
    .cta-link.primary{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;box-shadow:0 16px 36px -8px rgba(99,102,241,0.55);}
    .cta-link.secondary{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);color:#fff;}
    .cta-link.secondary:hover{background:rgba(255,255,255,0.1);}

    /* ── Footer ────────────────────────────────────────────────── */
    footer{text-align:center;padding:3rem;border-top:1px solid rgba(255,255,255,0.05);font-size:0.55rem;font-weight:900;letter-spacing:0.4em;text-transform:uppercase;color:#334155;}

    /* ── Scroll Reveal ─────────────────────────────────────────── */
    .reveal {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .reveal.active {
      opacity: 1;
      transform: translateY(0);
    }

    /* ── Print reset ───────────────────────────────────────────── */
    @media print{
      nav,.modal-overlay,.tl-roadmap-line{display:none!important;}
      body{background:#030712!important;print-color-adjust:exact;-webkit-print-color-adjust:exact;}
      .bg-layer{display:block!important;}
      .tilt-card,.cert-card,.ach-card{break-inside:avoid;box-shadow:none!important;border:1px solid rgba(255,255,255,0.1)!important;}
    }
  </style>
</head>
<body>
  <!-- Micro Noise & Canvas Layers -->
  <div class="noise-overlay"></div>
  <div class="bg-layer">
    <canvas id="starCanvas" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;"></canvas>
    <div class="aurora-1"></div><div class="aurora-2"></div>
    <div class="aurora-3"></div><div class="aurora-4"></div>
    <div class="bg-grid circuit-grid" style="position:absolute;inset:0;opacity:0.02;"></div>
  </div>
  <div id="cursorGlow"></div>

  <!-- Navbar -->
  <nav>
    <div class="nav-logo">${esc(name.split(' ')[0])}<span>.</span>dev</div>
    <div class="nav-links">
      ${['About','Skills','Projects','Experience','Contact'].map(s => `<a href="#${s.toLowerCase()}">${s}</a>`).join('')}
    </div>
  </nav>

  <div class="page">
    <!-- ── HERO ──────────────────────────────────────────────────── -->
    <section id="hero"><div class="container">
      <div class="hero-grid">
        <div class="hero-left">
          <div class="avail-badge"><div class="avail-dot"></div>Available for Roles</div>
          <h1 class="hero-name">${esc(name)}</h1>
          <div class="hero-role">
            <span class="hero-role-text" id="typewriter"></span><span class="hero-cursor">|</span>
          </div>
          <p class="hero-summary">${esc(summary)}</p>
          <div class="hero-btns">
            <a href="#projects" class="btn-primary">View Projects →</a>
            <a href="#contact" class="btn-outline">Contact Me</a>
          </div>
          <div class="hero-socials">
            ${contact.email    ? `<a href="mailto:${esc(contact.email)}">Email</a>` : ''}
            ${contact.linkedin ? `<a href="${esc(contact.linkedin)}" target="_blank">LinkedIn</a>` : ''}
            ${contact.github   ? `<a href="${esc(contact.github)}" target="_blank">GitHub</a>` : ''}
            ${contact.phone    ? `<a href="tel:${esc(contact.phone)}">${esc(contact.phone)}</a>` : ''}
          </div>
        </div>
        <div class="hero-right" style="display:flex;align-items:center;justify-content:flex-end;">
          <div class="avatar-wrap">
            <canvas id="orbCanvas" style="width:360px;height:360px;"></canvas>
            ${floatingBadgesHTML}
          </div>
        </div>
      </div>
    </div></section>

    <!-- ── METRICS DASHBOARD ──────────────────────────────────────── -->
    <div class="container">
      <div class="metrics-grid">
        <div class="metric-card"><div class="metric-icon">📁</div><div><div class="metric-val counter" data-target="${projCount}">0</div><div class="metric-lbl">Projects Built</div></div></div>
        <div class="metric-card"><div class="metric-icon">💼</div><div><div class="metric-val counter" data-target="${expCount}">0</div><div class="metric-lbl">Internships &amp; Roles</div></div></div>
        <div class="metric-card"><div class="metric-icon">🏆</div><div><div class="metric-val counter" data-target="${certCount}">0</div><div class="metric-lbl">Certifications</div></div></div>
        <div class="metric-card"><div class="metric-icon">⚡</div><div><div class="metric-val counter" data-target="${skillCount}">0</div><div class="metric-lbl">Skills Mastered</div></div></div>
      </div>
    </div>

    <!-- ── ABOUT ──────────────────────────────────────────────────── -->
    <section id="about"><div class="container">
      <div class="about-grid">
        <div>
          <div class="section-label"><div class="section-icon">💻</div><span class="section-text">About Me</span><div class="section-line"></div></div>
          ${summary
            ? `<p class="about-text">${esc(summary)}</p>`
            : `<p class="about-text" style="color:#475569;font-style:italic;font-size:0.9rem;">No professional summary was found in the uploaded resume.</p>`
          }
          ${contact.location ? `<p style="font-size:0.85rem;color:#818cf8;font-weight:700;margin-bottom:1.75rem;display:flex;align-items:center;gap:0.4rem;">📍 ${esc(contact.location)}</p>` : ''}
          ${allSkillsFlat.length > 0 ? `
          <div style="margin-bottom:1.75rem;">
            <div style="font-size:0.55rem;font-weight:900;letter-spacing:0.25em;text-transform:uppercase;color:#475569;margin-bottom:0.75rem;">Technical Skills</div>
            <div style="display:flex;flex-wrap:wrap;gap:0.45rem;">
              ${allSkillsFlat.map(s => `<span style="display:inline-flex;align-items:center;padding:0.28rem 0.7rem;border-radius:99px;background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.22);font-size:0.68rem;font-weight:700;color:#a5b4fc;letter-spacing:0.02em;">${esc(s)}</span>`).join('')}
            </div>
          </div>` : ''}
          ${softSkillsHTML}
          ${education.length > 0 ? `<div style="border-top:1px solid rgba(255,255,255,0.05);padding-top:1.75rem;"><div style="font-size:0.55rem;font-weight:900;letter-spacing:0.25em;text-transform:uppercase;color:#475569;margin-bottom:1.125rem;">Education</div>${eduHTML}</div>` : ''}
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;">
          <div class="section-label" style="width:100%"><div class="section-icon">🌌</div><span class="section-text">Interactive Skill Galaxy</span><div class="section-line"></div></div>
          <div class="galaxy-box-wrap">
            <canvas id="galaxyCanvas" style="width:100%;height:100%;"></canvas>
            <div class="galaxy-hud" id="galaxyHud">
              <div>
                <div class="hud-cat" id="hudCat">Orbit</div>
                <div class="hud-title" id="hudName">Skill</div>
              </div>
              <div class="hud-pill">Orbiting Well</div>
            </div>
          </div>
        </div>
      </div>
    </div></section>

    <!-- ── PROJECTS ───────────────────────────────────────────────── -->
    ${projects.length > 0 ? `
    <section id="projects"><div class="container">
      <div class="section-center">
        <div class="section-pill">🗂️ Featured Work</div>
        <h2 class="section-heading">Elite Case <span style="background:linear-gradient(135deg,#818cf8,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">Studies</span></h2>
      </div>
      <div class="projects-grid">${projectCardsHTML}</div>
    </div></section>` : ''}

    <!-- ── EXPERIENCE ─────────────────────────────────────────────── -->
    ${experience.length > 0 ? `
    <section id="experience"><div class="container">
      <div class="section-label"><div class="section-icon">💼</div><span class="section-text">Technical Journey</span><div class="section-line"></div></div>
      <div class="tl-container">
        <div class="tl-roadmap-line"><div class="tl-roadmap-progress" id="roadmapLine"></div></div>
        <div>${timelineHTML}</div>
      </div>
    </div></section>` : ''}

    <!-- ── CERTIFICATIONS ─────────────────────────────────────────── -->
    ${certs.length > 0 ? `
    <section id="certifications"><div class="container">
      <div class="section-label"><div class="section-icon">🏆</div><span class="section-text">Verified Credentials</span><div class="section-line"></div></div>
      <div class="certs-grid">${certsHTML}</div>
    </div></section>` : ''}

    <!-- ── ACHIEVEMENTS ───────────────────────────────────────────── -->
    ${achievements.length > 0 ? `
    <section><div class="container">
      <div class="section-label"><div class="section-icon">⭐</div><span class="section-text">Achievements Wall</span><div class="section-line"></div></div>
      <div class="ach-grid">${achHTML}</div>
    </div></section>` : ''}

    <!-- ── CONTACT ────────────────────────────────────────────────── -->
    <section id="contact"><div class="container">
      <div class="contact-cta">
        <div class="cta-inner">
          <div class="cta-badge">Let's Collaborate</div>
          <h2 class="cta-heading">Let's Build The<br><span style="background:linear-gradient(135deg,#818cf8,#c084fc,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">Future Together</span></h2>
          <p class="cta-sub">Open to full-time engineering roles, research programs, and high-impact custom design architectural builds.</p>
          <div class="cta-links">
            ${contact.email    ? `<a href="mailto:${esc(contact.email)}" class="cta-link primary">✉ Send Email</a>` : ''}
            ${contact.linkedin ? `<a href="${esc(contact.linkedin)}" target="_blank" class="cta-link secondary">🔗 LinkedIn</a>` : ''}
            ${contact.github   ? `<a href="${esc(contact.github)}" target="_blank" class="cta-link secondary">⌥ GitHub</a>` : ''}
          </div>
        </div>
      </div>
    </div></section>

    <footer>${esc(name)} &bull; Portfolio V10.0 &bull; ELITE FOUNDER EDITION</footer>
  </div>

  <!-- Case Study Modal -->
  <div class="modal-overlay" id="csModal">
    <div class="modal-backdrop" onclick="closeCaseStudy()"></div>
    <div class="modal-box">
      <div class="modal-glow"></div>
      <button class="modal-close" onclick="closeCaseStudy()">✕</button>
      <div class="modal-body" id="csBody"></div>
    </div>
  </div>

  <script>
    /* ── Projects data ── */
    const PROJECTS = ${projectsJson};

    /* ── Case Study Modal ── */
    function openCaseStudy(idx) {
      const p = PROJECTS[idx]; if (!p) return;
      const techHTML = (p.tech && p.tech.length)
        ? p.tech.map(t => '<span class="tech-badge" style="margin-bottom:0.2rem">' + h(t) + '</span>').join('') : '';
      let html = '<span class="modal-kicker">📁 Immersive Deep-Dive Case Study</span>';
      html += '<div class="modal-title">' + h(p.title) + '</div>';
      if (p.desc || p.problem)
        html += '<div class="modal-sec modal-sec-dark"><span class="modal-sec-lbl">🎯 Challenge &amp; Objective</span><p>' + h(p.desc || p.problem) + '</p></div>';
      if (p.problem) {
        html += '<div class="modal-two">';
        html += '<div class="modal-sec modal-sec-dark"><span class="modal-sec-lbl">🔬 Research Insights</span><p>Mapped dependencies, optimized structural integrity, and engineered scalable architectures to solve: <strong style="display:block;margin-top:0.25rem;color:#cbd5e1">' + h(p.problem) + '</strong></p></div>';
        if (p.solution) html += '<div class="modal-sec modal-sec-indigo"><span class="modal-sec-lbl il">✅ Solved Strategy &amp; Execution</span><p>' + h(p.solution) + '</p></div>';
        html += '</div>';
      }
      if (techHTML)
        html += '<div class="modal-sec modal-sec-dark"><span class="modal-sec-lbl">🏗️ Architecture Stack</span><div class="tech-row" style="margin-top:0;margin-bottom:0">' + techHTML + '</div></div>';
      if (p.impact && p.impact !== 'Improved operational efficiency and delivered a high-performance system.')
        html += '<div class="modal-sec modal-sec-green"><span class="modal-sec-lbl gl">📈 Quantifiable Results &amp; Impact</span><p>' + h(p.impact) + '</p></div>';
      if (p.link || p.github) {
        html += '<div class="modal-links">';
        if (p.link)   html += '<a href="' + h(p.link)   + '" target="_blank" class="modal-btn-p">Live Demo ↗</a>';
        if (p.github) html += '<a href="' + h(p.github) + '" target="_blank" class="modal-btn-s">GitHub Repository</a>';
        html += '</div>';
      }
      document.getElementById('csBody').innerHTML = html;
      document.getElementById('csModal').classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeCaseStudy() {
      document.getElementById('csModal').classList.remove('open');
      document.body.style.overflow = '';
    }
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCaseStudy(); });
    function h(s) {
      return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    }

    /* ── Typewriter ── */
    const roles = ${JSON.stringify((title || 'Developer').split(/[•\/,]/).map(s => s.trim()).filter(Boolean))};
    let ri = 0, chars = '', del = false;
    function tick() {
      const cur = roles[ri % roles.length];
      if (!del && chars === cur) { setTimeout(() => { del = true; tick(); }, 2500); return; }
      if (del && chars === '')   { del = false; ri = (ri + 1) % roles.length; setTimeout(tick, 300); return; }
      chars = del ? chars.slice(0,-1) : cur.slice(0, chars.length+1);
      document.getElementById('typewriter').textContent = chars;
      setTimeout(tick, del ? 35 : 85);
    }
    tick();

    /* ── Accordion Timeline ── */
    function toggleTl(idx) {
      const el = document.getElementById('tl-' + idx);
      const ch = document.getElementById('chev-' + idx);
      const open = el.style.display !== 'none';
      el.style.display = open ? 'none' : 'block';
      ch.classList.toggle('open', !open);
    }

    /* ── Animated Counters ── */
    function animateCounter(el) {
      const target = parseInt(el.dataset.target, 10) || 0;
      if (!target) { el.textContent = '0'; return; }
      let cur = 0;
      const step = Math.ceil(target / (1200 / 16));
      const t = setInterval(() => { cur = Math.min(cur + step, target); el.textContent = cur; if (cur >= target) clearInterval(t); }, 16);
    }

    /* ── Scroll Reveal & Scroll Roadmap & Twinkle stars ── */
    (function initTwinkle() {
      const canvas = document.getElementById('starCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let stars = [];
      const numStars = 85;

      function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      resize();
      window.addEventListener('resize', resize);

      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: 0.4 + Math.random() * 0.9,
          depth: 0.2 + Math.random() * 0.8,
          phase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.01 + Math.random() * 0.02
        });
      }

      function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => {
          s.phase += s.twinkleSpeed;
          const alpha = 0.15 + (Math.sin(s.phase) + 1) * 0.5 * 0.45 * s.depth;
          ctx.fillStyle = "rgba(255,255,255," + alpha + ")";
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
        });
        requestAnimationFrame(loop);
      }
      loop();
    })();

    // Cursor spotlight glow
    document.addEventListener('mousemove', e => {
      const glow = document.getElementById('cursorGlow');
      if (glow) {
        glow.style.background = 'radial-gradient(800px at ' + e.clientX + 'px ' + e.clientY + 'px, rgba(99,102,241,0.08), transparent 80%)';
      }
    });

    // Reveal elements on scroll, growth roadmap progress
    const revealEls = document.querySelectorAll('.reveal');
    const counters = document.querySelectorAll('.counter');
    const roadmapLine = document.getElementById('roadmapLine');

    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); } });
    }, { threshold: 0.2 });
    counters.forEach(c => counterObs.observe(c));

    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('active'); revealObs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    revealEls.forEach(el => revealObs.observe(el));

    // Scroll listener for growing roadmap
    window.addEventListener('scroll', () => {
      if (!roadmapLine) return;
      const parent = roadmapLine.parentElement;
      const rect = parent.getBoundingClientRect();
      const winH = window.innerHeight;
      const topPassed = winH / 2 - rect.top;
      const percent = Math.max(0, Math.min(100, (topPassed / rect.height) * 100));
      roadmapLine.style.transform = 'scaleY(' + (percent/100) + ')';
    });

    /* ── 3D Profile Orb Canvas engine ── */
    (function initOrb() {
      const canvas = document.getElementById('orbCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      
      const width = 360, height = 360;
      canvas.width = width * (window.devicePixelRatio || 1);
      canvas.height = height * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

      const points = [];
      const numPoints = 140;
      for (let i = 0; i < numPoints; i++) {
        const y = 1 - (i / (numPoints - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const theta = 3.69 * i;
        points.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
      }

      let rotX = 0, rotY = 0, rotZ = 0;
      let targetMouseX = 0, targetMouseY = 0;
      let mouseX = 0, mouseY = 0;

      const container = canvas.parentElement;
      container.addEventListener('mousemove', e => {
        const r = container.getBoundingClientRect();
        targetMouseX = (e.clientX - r.left - r.width/2) / (r.width/2);
        targetMouseY = (e.clientY - r.top - r.height/2) / (r.height/2);
      });
      container.addEventListener('mouseleave', () => {
        targetMouseX = 0; targetMouseY = 0;
      });

      function loop() {
        ctx.clearRect(0,0,width,height);

        mouseX += (targetMouseX - mouseX) * 0.08;
        mouseY += (targetMouseY - mouseY) * 0.08;

        rotX += 0.002 + mouseY * 0.004;
        rotY += 0.003 + mouseX * 0.004;
        rotZ += 0.001;

        const cx = width / 2, cy = height / 2;
        const r = 95;

        // Core glow
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, 'rgba(99, 102, 241, 0.28)');
        g.addColorStop(0.5, 'rgba(139, 92, 246, 0.12)');
        g.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(cx, cy, r * 1.6, 0, Math.PI * 2); ctx.fill();

        // orbits ellipses
        for (let ri = 0; ri < 3; ri++) {
          ctx.strokeStyle = "rgba(129, 140, 248, " + (0.16 - ri * 0.03) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(cx, cy, r * (1.2 + ri * 0.2), r * 0.45, Math.PI / 6 * ri + rotY * 0.2, 0, Math.PI * 2);
          ctx.stroke();
        }

        // project & sort
        const proj = points.map(pt => {
          let x1 = pt.x * Math.cos(rotY) - pt.z * Math.sin(rotY);
          let z1 = pt.x * Math.sin(rotY) + pt.z * Math.cos(rotY);
          let y2 = pt.y * Math.cos(rotX) - z1 * Math.sin(rotX);
          let z2 = pt.y * Math.sin(rotX) + z1 * Math.cos(rotX);

          const dist = 2.5;
          const scale = dist / (dist - z2);
          return { x: cx + x1 * r * scale, y: cy + y2 * r * scale, z: z2 };
        });

        proj.sort((a, b) => a.z - b.z);

        proj.forEach(pt => {
          const op = (pt.z + 1) / 2;
          const sz = 1.6 + op * 2.8;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, sz, 0, Math.PI * 2);
          if (pt.z > 0) {
            ctx.fillStyle = "rgba(139, 92, 246, " + (0.35 + op * 0.65) + ")";
          } else {
            ctx.fillStyle = "rgba(99, 102, 241, " + (0.12 + op * 0.4) + ")";
          }
          ctx.fill();
        });

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 20px "Clash Display", sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText("${initials}", cx, cy);

        requestAnimationFrame(loop);
      }
      loop();
    })();

    /* ── Skill Galaxy Concentric orbits engine ── */
    (function initGalaxy() {
      const canvas = document.getElementById('galaxyCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.parentElement.clientWidth, h = canvas.parentElement.clientHeight;
      canvas.width = w * (window.devicePixelRatio || 1);
      canvas.height = h * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

      const cx = w/2, cy = h/2;

      // Group skills
      const allSkills = ${skillsJson};
      const cats = {
        'Frontend': ['react', 'html', 'css', 'javascript', 'typescript', 'vue', 'next', 'tailwind', 'ui', 'ux', 'sass', 'jquery'],
        'Backend': ['node', 'python', 'java', 'django', 'express', 'spring', 'flask', 'php', 'c#', 'ruby', 'go', 'c++', 'apis', 'rest'],
        'AI & Data Science': ['machine learning', 'deep learning', 'pytorch', 'tensorflow', 'keras', 'nlp', 'llm', 'computer vision', 'ai', 'data science', 'pandas', 'numpy', 'scikit', 'jupyter'],
        'Database & Systems': ['sql', 'postgres', 'mongodb', 'mysql', 'database', 'sqlite', 'redis', 'oracle', 'firebase'],
        'Cloud & DevOps': ['aws', 'docker', 'kubernetes', 'jenkins', 'git', 'github', 'ci/cd', 'cloud', 'nginx', 'linux', 'azure', 'devops']
      };

      const classified = {};
      Object.keys(cats).forEach(c => classified[c] = []);
      const unclassified = [];

      allSkills.forEach(s => {
        let matched = false;
        const low = s.toLowerCase();
        for (const [catName, keywords] of Object.entries(cats)) {
          if (keywords.some(kw => low.includes(kw))) {
            classified[catName].push(s); matched = true; break;
          }
        }
        if (!matched) unclassified.push(s);
      });
      if (unclassified.length > 0) classified['General Stack'] = unclassified;

      const activeCats = Object.entries(classified).filter(([, list]) => list.length > 0);
      const nodes = [];
      let catIdx = 0;

      activeCats.forEach(([catName, list]) => {
        const rad = 75 + catIdx * 48;
        const speed = 0.0008 + (4 - catIdx) * 0.0004;
        list.forEach((skill, i) => {
          nodes.push({
            name: skill,
            category: catName,
            orbitRadius: rad,
            angle: (i / list.length) * Math.PI * 2 + Math.random() * 0.4,
            speed,
            size: 4.5 + Math.random() * 3,
            glowColor: "hsl(" + (220 + catIdx * 35) + ", 80%, 65%)",
            pulse: Math.random() * Math.PI
          });
        });
        catIdx++;
      });

      let mousePos = { x: -1000, y: -1000 };
      canvas.addEventListener('mousemove', e => {
        const r = canvas.getBoundingClientRect();
        mousePos.x = e.clientX - r.left; mousePos.y = e.clientY - r.top;
      });
      canvas.addEventListener('mouseleave', () => {
        mousePos = { x: -1000, y: -1000 };
        document.getElementById('galaxyHud').style.display = 'none';
      });

      function loop() {
        ctx.clearRect(0,0,w,h);

        // Core gravity pulse
        const pulse = Math.sin(Date.now() * 0.002) * 4;
        const r = 28 + pulse;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.8);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(0.2, 'rgba(139, 92, 246, 0.85)');
        g.addColorStop(0.6, 'rgba(99, 102, 241, 0.28)');
        g.addColorStop(1, 'rgba(3, 7, 18, 0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r * 2.2, 0, Math.PI*2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 9px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText("CORE", cx, cy);

        // guides
        activeCats.forEach((_, cIdx) => {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(cx, cy, 75 + cIdx * 48, 0, Math.PI * 2); ctx.stroke();
        });

        let hoveredNode = null;

        nodes.forEach(node => {
          node.angle += node.speed;
          node.pulse += 0.02;

          const nx = cx + Math.cos(node.angle) * node.orbitRadius;
          const ny = cy + Math.sin(node.angle) * node.orbitRadius;

          const dist = Math.hypot(mousePos.x - nx, mousePos.y - ny);
          const active = dist < 22;

          if (active) hoveredNode = node;

          if (active) {
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.18)';
            ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.arc(cx, cy, node.orbitRadius, 0, Math.PI * 2); ctx.stroke();

            // lightning to core
            ctx.strokeStyle = node.glowColor;
            ctx.lineWidth = 1.8;
            ctx.beginPath(); ctx.moveTo(cx, cy);
            ctx.quadraticCurveTo(
              (cx + nx) / 2 + (Math.random() - 0.5) * 12,
              (cy + ny) / 2 + (Math.random() - 0.5) * 12,
              nx, ny
            );
            ctx.stroke();
          }

          const sz = active ? node.size + 4.5 : node.size + Math.sin(node.pulse) * 0.7;
          ctx.beginPath(); ctx.arc(nx, ny, sz, 0, Math.PI*2);
          
          if (active) {
            ctx.fillStyle = '#ffffff'; ctx.shadowBlur = 20; ctx.shadowColor = node.glowColor;
          } else {
            ctx.fillStyle = node.glowColor; ctx.shadowBlur = 4; ctx.shadowColor = node.glowColor;
          }
          ctx.fill(); ctx.shadowBlur = 0;

          ctx.fillStyle = active ? '#ffffff' : 'rgba(148, 163, 184, 0.85)';
          ctx.font = active ? 'bold 11px "Satoshi", sans-serif' : '500 9px "Satoshi", sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(node.name, nx + sz + 5, ny + 2.5);
        });

        if (hoveredNode) {
          document.getElementById('hudCat').textContent = hoveredNode.category + ' Orbit';
          document.getElementById('hudName').textContent = hoveredNode.name;
          document.getElementById('galaxyHud').style.display = 'flex';
        } else {
          document.getElementById('galaxyHud').style.display = 'none';
        }

        requestAnimationFrame(loop);
      }
      loop();
    })();

    /* ── Specular glare & 3D tilt calculations for cards ── */
    document.querySelectorAll('.tilt-card-container').forEach(cont => {
      const card = cont.querySelector('.tilt-card');
      const glare = cont.querySelector('.tilt-card-glare');
      
      cont.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width/2;
        const y = e.clientY - rect.top - rect.height/2;
        
        const nx = x / (rect.width/2);
        const ny = y / (rect.height/2);
        
        const tx = -ny * 8;
        const ty = nx * 8;
        
        card.style.transform = 'rotateX(' + tx + 'deg) rotateY(' + ty + 'deg)';
        
        const gx = ((e.clientX - rect.left) / rect.width) * 100;
        const gy = ((e.clientY - rect.top) / rect.height) * 100;
        
        glare.style.opacity = '1';
        glare.style.background = 'radial-gradient(circle 240px at ' + gx + '% ' + gy + '%, rgba(255,255,255,0.16), transparent 80%)';
      });

      cont.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0deg) rotateY(0deg)';
        glare.style.opacity = '0';
      });
    });

    /* ── Smooth Scroll Interceptor ── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const el = document.querySelector(a.getAttribute('href'));
        if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
      });
    });
  </script>
</body>
</html>`;
};

function esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
