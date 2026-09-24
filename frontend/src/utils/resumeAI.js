// ════════════════════════════════════════════════════════════════
// MHCV Resume AI Engine v3.0
// Advanced local-first intelligence — no external API required
// ════════════════════════════════════════════════════════════════

// ── Action verb pools ──────────────────────────────────────────
const ACTION_VERBS = {
    development:   ['Architected', 'Engineered', 'Developed', 'Built', 'Implemented', 'Designed', 'Deployed', 'Optimized', 'Refactored', 'Automated', 'Integrated', 'Migrated'],
    leadership:    ['Spearheaded', 'Orchestrated', 'Led', 'Oversaw', 'Mentored', 'Coordinated', 'Established', 'Championed', 'Drove', 'Directed'],
    achievement:   ['Maximized', 'Accelerated', 'Streamlined', 'Enhanced', 'Boosted', 'Transformed', 'Delivered', 'Reduced', 'Improved', 'Increased'],
    analysis:      ['Analyzed', 'Evaluated', 'Assessed', 'Investigated', 'Identified', 'Diagnosed', 'Researched', 'Formulated'],
    collaboration: ['Collaborated', 'Partnered', 'Contributed', 'Supported', 'Facilitated', 'Coordinated'],
};

// ── Executive Wording Synonyms ──────────────────────────────────
const EXECUTIVE_MAP = {
    'worked on': 'spearheaded development of',
    'helped with': 'facilitated implementation of',
    'was responsible for': 'orchestrated key operations of',
    'assisted in': 'collaborated to deliver',
    'participated in': 'actively contributed to',
    'involved in': 'drove engineering aspects of',
    'did': 'executed and finalized',
    'made': 'engineered and deployed',
    'built': 'architected and implemented',
    'created': 'conceptualized and launched',
    'managed': 'directed and mentored',
    'changed': 'revamped and modernized',
    'used': 'leveraged and integrated',
    'fixed': 'debugged and optimized',
    'showed': 'demonstrated',
    'got': 'attained'
};

// ── ATS keyword pools by role ──────────────────────────────────
export const ATS_KEYWORDS = {
    developer:  ['REST API', 'Agile', 'CI/CD', 'Git', 'Code Review', 'Unit Testing', 'System Design', 'Microservices', 'Docker', 'Kubernetes', 'JIRA', 'TDD', 'TypeScript', 'Data Structures', 'Algorithms'],
    frontend:   ['React', 'TypeScript', 'HTML5', 'CSS3', 'Responsive Design', 'Performance Optimization', 'Accessibility', 'Vue.js', 'Angular', 'Webpack', 'Vite', 'Redux', 'Framer Motion', 'Tailwind CSS'],
    backend:    ['Node.js', 'Python', 'Java', 'Spring Boot', 'PostgreSQL', 'MongoDB', 'Redis', 'API Gateway', 'Authentication', 'REST', 'GraphQL', 'Express', 'Django', 'Microservices', 'Docker'],
    fullstack:  ['Full Stack', 'React', 'Node.js', 'PostgreSQL', 'REST API', 'System Architecture', 'Scalability', 'TypeScript', 'Database Design', 'CI/CD', 'Docker', 'State Management'],
    data:       ['Machine Learning', 'Python', 'TensorFlow', 'PyTorch', 'Data Pipeline', 'SQL', 'Tableau', 'ETL', 'Analytics', 'Pandas', 'NumPy', 'Data Modeling', 'Scikit-Learn', 'Apache Spark'],
    devops:     ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'CI/CD', 'Monitoring', 'Linux', 'Shell Scripting', 'Prometheus', 'Ansible', 'GitOps'],
    mobile:     ['React Native', 'Flutter', 'iOS', 'Android', 'Swift', 'Kotlin', 'App Store', 'Play Store', 'Mobile UI', 'Push Notifications', 'Mobile Architecture', 'API Integration'],
};

// ── Metric templates for realistic quantifiable impact ─────────
const OUTCOMES_POOL = [
    { text: 'establishing robust clean code practices and system modularity', val: 'scale' },
    { text: 'ensuring optimal database indexing and seamless data persistence', val: 'db' },
    { text: 'promoting robust architectural standards and high infrastructure availability', val: 'cloud' },
    { text: 'delivering responsive user interfaces and highly fluid interaction flows', val: 'frontend' },
    { text: 'establishing high test coverage and production-grade software reliability', val: 'qa' },
    { text: 'minimizing API transaction friction and ensuring secure communication channels', val: 'latency' },
    { text: 'automating deployment workflows and optimizing release build velocity', val: 'devops' }
];

// ── Weak phrase patterns ───────────────────────────────────────
const WEAK_PATTERNS = [
    /^worked on\s*/i,
    /^helped with\s*/i,
    /^was responsible for\s*/i,
    /^assisted in\s*/i,
    /^participated in\s*/i,
    /^involved in\s*/i,
    /^did\s+/i,
    /^made\s+/i,
    /^tried to\s*/i,
    /^tasked with\s*/i,
    /^handled\s+/i,
    /^built\s+/i,
    /^used\s+/i,
    /^created\s+/i,
];

const stripWeakPrefix = (text) =>
    text.replace(/^(worked on|helped with|was responsible for|assisted in|participated in|involved in|did |made |tried to|tasked with|handled |built |used |created )\s*/i, '');

// ── Bullet point enhancer ──────────────────────────────────────
export const enhanceBulletPoints = (text) => {
    if (!text || text.trim().length < 5) return text;

    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    const enhanced = lines.map((line) => {
        const cleanLine = line.replace(/^[•\-*]\s*/, '').trim();
        const isWeak = WEAK_PATTERNS.some(p => p.test(cleanLine)) || cleanLine.length < 35;

        if (isWeak && cleanLine.length > 3) {
            const stripped = stripWeakPrefix(cleanLine);
            
            // Choose strong verb deterministically
            const devVerbs = ACTION_VERBS.development;
            const verbIdx = (cleanLine.charCodeAt(0) || 0) % devVerbs.length;
            const verb = devVerbs[verbIdx];

            // Choose appropriate outcome based on bullet contents
            let selectedOutcome = OUTCOMES_POOL[cleanLine.length % OUTCOMES_POOL.length].text;
            if (/database|query|sql|postgres|mongo/i.test(cleanLine)) {
                selectedOutcome = OUTCOMES_POOL.find(m => m.val === 'db').text;
            } else if (/aws|cloud|azure|docker|kubernetes/i.test(cleanLine)) {
                selectedOutcome = OUTCOMES_POOL.find(m => m.val === 'cloud').text;
            } else if (/react|ui|css|frontend|view/i.test(cleanLine)) {
                selectedOutcome = OUTCOMES_POOL.find(m => m.val === 'frontend').text;
            } else if (/api|route|backend|spring|controller/i.test(cleanLine)) {
                selectedOutcome = OUTCOMES_POOL.find(m => m.val === 'latency').text;
            }

            return `• ${verb} and optimized ${stripped.charAt(0).toLowerCase()}${stripped.slice(1)}, directly ${selectedOutcome}.`;
        }

        // Standardize bullet points format
        const prefixed = cleanLine.startsWith('•') || cleanLine.startsWith('-') || cleanLine.startsWith('*')
            ? cleanLine.replace(/^[•\-*]\s*/, '• ')
            : `• ${cleanLine}`;

        return prefixed;
    });

    return enhanced.join('\n');
};

// ── Executive Vocabulary Enhancer ──────────────────────────────
export const enhanceExecutiveWording = (text) => {
    if (!text) return '';
    let enriched = text;
    // Replace weak phrases with premium executive wording
    Object.entries(EXECUTIVE_MAP).forEach(([weak, strong]) => {
        const regex = new RegExp('\\b' + weak + '\\b', 'gi');
        enriched = enriched.replace(regex, strong);
    });
    return enriched;
};

// ── Career Category Detector ──────────────────────────────────────
export const detectCareerCategory = (data) => {
    if (data.title) return data.title;

    const allText = [
        data.title || '',
        data.summary || '',
        ...(Array.isArray(data.skills) ? data.skills : Object.values(data.skills || {}).flat()),
        ...(data.experience || []).map(e => `${e.role} ${e.desc}`),
        ...(data.projects || []).map(p => `${p.title} ${p.desc} ${p.stack}`)
    ].join(' ').toLowerCase();

    if (/data scientist|machine learning|deep learning|tensorflow|pytorch/i.test(allText)) return 'Data Scientist';
    if (/data analyst|power bi|tableau|sql|excel/i.test(allText)) return 'Data Analyst';
    if (/cloud|aws|azure|devops|kubernetes|docker|terraform/i.test(allText)) return 'Cloud Engineer';
    if (/ui\/ux|figma|designer|user experience|interface/i.test(allText)) return 'UI UX Designer';
    if (/cyber|security|penetration|firewall|infosec/i.test(allText)) return 'Cyber Security Engineer';
    if (/ai engineer|artificial intelligence|llm|nlp/i.test(allText)) return 'AI Engineer';
    if (/full stack|mern|mean|react.*node/i.test(allText)) return 'Full Stack Developer';
    if (/frontend|react|vue|angular|css/i.test(allText)) return 'Frontend Developer';
    if (/backend|node|spring|django|flask|express/i.test(allText)) return 'Backend Developer';

    return 'Software Developer';
};

// ── Smart Project Enhancement ─────────────────────────────────────
export const smartProjectEnhancement = (project) => {
    const desc = project.desc || '';
    const stack = project.stack || '';
    
    const lowerDesc = desc.toLowerCase();
    let problem = '';
    let solution = '';
    let impact = project.impact || '';
    
    if (lowerDesc.includes('challenge:') || lowerDesc.includes('problem:')) {
        const match = desc.match(/(?:challenge|problem):\s*(.*?)(?=(?:solution|impact|result):|$)/i);
        if (match) problem = match[1].trim();
    }
    if (lowerDesc.includes('solution:')) {
        const match = desc.match(/solution:\s*(.*?)(?=(?:challenge|problem|impact|result):|$)/i);
        if (match) solution = match[1].trim();
    }
    if (!impact && (lowerDesc.includes('impact:') || lowerDesc.includes('result:'))) {
        const match = desc.match(/(?:impact|result):\s*(.*?)(?=(?:challenge|problem|solution):|$)/i);
        if (match) impact = match[1].trim();
    }

    if (problem || solution) {
        return {
            ...project,
            problem: problem,
            solution: solution,
            impact: impact || project.impact || '',
            results: impact || project.impact || ''
        };
    }
    
    return {
        ...project,
        problem: '',
        solution: '',
        impact: project.impact || '',
        results: project.impact || ''
    };
};

// ── Structured Professional Summary Generator ────────────────────
export const generateStructuredSummary = (data, targetRole = 'developer') => {
    const role = data.title || detectCareerCategory(data);
    const allSkills = Array.isArray(data.skills) ? data.skills : Object.values(data.skills || {}).flat();
    const topSkills = allSkills.slice(0, 5).join(', ');
    const summaryText = data.summary || '';

    // If summary exists, use it
    if (summaryText.trim().length > 10) {
        return {
            executiveSummary: summaryText,
            professionalBio: summaryText,
            valueProposition: null,
            careerHighlights: null
        };
    }

    // Factual fallback without subjective claims
    const factualSummary = topSkills 
        ? `${role} specializing in ${topSkills}.` 
        : `Professional ${role}.`;

    return {
        executiveSummary: factualSummary,
        professionalBio: factualSummary,
        valueProposition: null,
        careerHighlights: null
    };
};

// ── Quality Score Calculator ───────────────────────────────────
export const calculateQualityScore = (data) => {
    let score = 0;
    if (data.name && data.contact?.email) score += 20;
    if (data.summary && data.summary.length > 50) score += 15;
    
    const allSkills = Array.isArray(data.skills) ? data.skills : Object.values(data.skills || {}).flat();
    if (allSkills.length > 8) score += 20;
    
    if ((data.experience || []).length > 0) score += 20;
    if ((data.projects || []).length > 0) score += 15;
    if ((data.education || []).length > 0) score += 10;
    
    let grade = 'Beginner';
    if (score >= 85) grade = 'Executive';
    else if (score >= 70) grade = 'Professional';
    else if (score >= 50) grade = 'Intermediate';

    return { score: Math.min(score, 100), grade };
};

// ── Backward compatible summary generator ───────────────────────
export const generateProfessionalSummary = (data, targetRole = 'developer') => {
    const structured = generateStructuredSummary(data, targetRole);
    return structured.executiveSummary + ' ' + structured.professionalBio;
};

// ── ATS Score Calculator ───────────────────────────────────────
export const calculateATSScore = (data) => {
    let score = 0;
    const suggestions = [];

    // 1. Identity & Contacts completeness (max 20 pts)
    if (data.name) score += 4;
    if (data.email || data.contact?.email) score += 4;
    if (data.phone || data.contact?.phone) score += 4;
    else suggestions.push('Missing contact phone number — critical for recruiter callbacks.');
    if (data.linkedin || data.contact?.linkedin) score += 4;
    else suggestions.push('Add a professional LinkedIn profile URL to build trust.');
    if (data.github || data.contact?.github || data.portfolio || data.contact?.portfolio) score += 4;

    // 2. Summary Length & Impact (max 15 pts)
    const summaryText = data.summary || '';
    if (summaryText.length >= 200) score += 15;
    else if (summaryText.length >= 100) {
        score += 9;
        suggestions.push('Expand professional summary to 200+ characters with clear enterprise verbs.');
    } else {
        suggestions.push('Add an impactful 3-4 sentence professional narrative summary.');
    }

    // 3. Technical Skill Density (max 20 pts)
    const allSkills = Array.isArray(data.skills) ? data.skills : Object.values(data.skills || {}).flat();
    if (allSkills.length >= 15) score += 20;
    else if (allSkills.length >= 8) {
        score += 12;
        suggestions.push('Increase skill density to 15+ relevant keywords for better ATS indexing.');
    } else {
        suggestions.push('List at least 8 technical skill tags covering languages, databases, and tools.');
    }

    // 4. Experience bullet points & metrics (max 25 pts)
    const expEntries = data.experience || [];
    if (expEntries.length > 0) {
        score += 10;
        let descCount = 0;
        let metricCount = 0;
        expEntries.forEach(exp => {
            if ((exp.desc || '').length > 40) descCount++;
            if (/\d+%|\d+\s*(?:hrs|users|ms|GB|x)/i.test(exp.desc || '')) metricCount++;
        });
        if (descCount >= 2) score += 10;
        if (metricCount >= 1) score += 5;
        else suggestions.push('Add quantifiable metrics (e.g. %, users, latency) to experience achievements.');
    } else {
        suggestions.push('Add at least one professional work experience history.');
    }

    // 5. Academic Foundations (max 10 pts)
    if ((data.education || []).length > 0) score += 10;
    else suggestions.push('Education credentials missing — essential for validation.');

    // 6. Project Impact details (max 10 pts)
    const projEntries = data.projects || [];
    if (projEntries.length >= 2) score += 10;
    else if (projEntries.length === 1) {
        score += 5;
        suggestions.push('Add a second key technical project demonstrating practical skills.');
    } else {
        suggestions.push('Include 2+ engineering projects illustrating your tech stack.');
    }

    return { score: Math.min(Math.round(score), 100), suggestions };
};

// ── Missing Keyword Detector ───────────────────────────────────
export const detectMissingKeywords = (data, role = 'developer') => {
    const allSkills = Array.isArray(data.skills) ? data.skills : Object.values(data.skills || {}).flat();
    const allText = [
        data.name || '',
        data.title || '',
        data.summary || '',
        ...allSkills,
        ...(data.experience || []).map(e => `${e.role || ''} ${e.company || ''} ${e.desc || ''}`),
        ...(data.projects || []).map(p => `${p.title || ''} ${p.desc || ''} ${p.stack || ''} ${p.impact || ''}`),
    ].join(' ').toLowerCase();

    // Clean match role
    let targetKey = 'developer';
    const roleLower = role.toLowerCase();
    if (roleLower.includes('full') || roleLower.includes('stack')) targetKey = 'fullstack';
    else if (roleLower.includes('front')) targetKey = 'frontend';
    else if (roleLower.includes('back')) targetKey = 'backend';
    else if (roleLower.includes('devops') || roleLower.includes('cloud')) targetKey = 'devops';
    else if (roleLower.includes('data') || roleLower.includes('ml') || roleLower.includes('ai')) targetKey = 'data';
    else if (roleLower.includes('mobile') || roleLower.includes('android') || roleLower.includes('ios')) targetKey = 'mobile';

    const roleKeywords = ATS_KEYWORDS[targetKey] || ATS_KEYWORDS.developer;
    const missing = roleKeywords.filter(kw => !allText.includes(kw.toLowerCase()));
    const present = roleKeywords.filter(kw => allText.includes(kw.toLowerCase()));

    return { missing, present, total: roleKeywords.length };
};

// ── Skill Deduplicator ─────────────────────────────────────────
export const deduplicateSkills = (skills) => {
    if (Array.isArray(skills)) {
        return [...new Set(skills)];
    }
    const seen = new Set();
    const result = {};
    for (const [cat, items] of Object.entries(skills || {})) {
        result[cat] = (items || []).filter(item => {
            const key = item.toLowerCase().trim();
            if (!key || seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }
    return result;
};

// ── Skill Ranker by Job Role ───────────────────────────────────
export const rankSkillsByRole = (skills, role = 'developer') => {
    let targetKey = 'developer';
    const roleLower = role.toLowerCase();
    if (roleLower.includes('full') || roleLower.includes('stack')) targetKey = 'fullstack';
    else if (roleLower.includes('front')) targetKey = 'frontend';
    else if (roleLower.includes('back')) targetKey = 'backend';
    else if (roleLower.includes('devops') || roleLower.includes('cloud')) targetKey = 'devops';
    else if (roleLower.includes('data') || roleLower.includes('ml') || roleLower.includes('ai')) targetKey = 'data';
    else if (roleLower.includes('mobile') || roleLower.includes('android') || roleLower.includes('ios')) targetKey = 'mobile';

    const roleKeywords = (ATS_KEYWORDS[targetKey] || ATS_KEYWORDS.developer).map(k => k.toLowerCase());
    
    if (Array.isArray(skills)) {
        return [...skills].sort((a, b) => {
            const aMatch = roleKeywords.some(kw => a.toLowerCase().includes(kw)) ? 1 : 0;
            const bMatch = roleKeywords.some(kw => b.toLowerCase().includes(kw)) ? 1 : 0;
            return bMatch - aMatch;
        });
    }

    const result = {};
    for (const [cat, items] of Object.entries(skills || {})) {
        result[cat] = [...items].sort((a, b) => {
            const aMatch = roleKeywords.some(kw => a.toLowerCase().includes(kw)) ? 1 : 0;
            const bMatch = roleKeywords.some(kw => b.toLowerCase().includes(kw)) ? 1 : 0;
            return bMatch - aMatch;
        });
    }
    return result;
};

// ── Resume Validator ───────────────────────────────────────────
export const validateResume = (data) => {
    const errors   = [];
    const warnings = [];

    // Critical errors
    if (!data.name || data.name.trim().length < 2)
        errors.push({ field: 'Identity', msg: 'Full name is required for identification.' });
    if (!data.email && !data.contact?.email)
        errors.push({ field: 'Contact', msg: 'Primary email address is missing.' });

    // Warnings
    if (!data.phone && !data.contact?.phone)
        warnings.push({ field: 'Contact', msg: 'Phone number is missing.' });
    if (!data.linkedin && !data.contact?.linkedin)
        warnings.push({ field: 'Contact', msg: 'LinkedIn address is missing.' });
    if (!data.summary || data.summary.trim().length < 60)
        warnings.push({ field: 'Summary', msg: 'Professional Summary is too short (aim for 100+ words).' });

    // Skills
    const allSkills = Array.isArray(data.skills) ? data.skills : Object.values(data.skills || {}).flat();
    if (allSkills.length < 5)
        errors.push({ field: 'Skills', msg: 'Technical Skills require at least 5 keyword tags.' });

    // Duplicate Skills
    const uniqueSkills = new Set(allSkills.map(s => s.toLowerCase().trim()));
    if (uniqueSkills.size < allSkills.length) {
        warnings.push({ field: 'Skills', msg: 'Duplicate skills found. Consider removing redundancy.' });
    }

    // Work Experience
    const expEntries = data.experience || [];
    if (expEntries.length === 0) {
        warnings.push({ field: 'Experience', msg: 'No Work Experience entries detected.' });
    } else {
        expEntries.forEach((exp, idx) => {
            if (!exp.role) errors.push({ field: `Experience #${idx + 1}`, msg: 'Job Role/Title is missing.' });
            if (!exp.company) errors.push({ field: `Experience #${idx + 1}`, msg: 'Company/Enterprise is missing.' });
            if (!exp.desc || exp.desc.length < 25) {
                warnings.push({ field: `Experience #${idx + 1}`, msg: 'Description is too short. Use achievement-based bullets.' });
            }
            if (exp.desc && !exp.desc.split('\n').every(line => line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*') || line.trim() === '')) {
                warnings.push({ field: `Experience #${idx + 1}`, msg: 'Bullets should be formatted with list points (•).' });
            }
        });
    }

    // Projects
    const projEntries = data.projects || [];
    if (projEntries.length === 0) {
        warnings.push({ field: 'Projects', msg: 'No key technical projects declared.' });
    } else {
        projEntries.forEach((proj, idx) => {
            if (!proj.title) errors.push({ field: `Project #${idx + 1}`, msg: 'Project title is missing.' });
            if (!proj.desc || proj.desc.length < 20) {
                warnings.push({ field: `Project #${idx + 1}`, msg: 'Project description is too short.' });
            }
        });
    }

    // Education
    if ((data.education || []).length === 0) {
        warnings.push({ field: 'Education', msg: 'Education history is empty.' });
    }

    // Grammar: Check for double spaces or uncapitalized lines
    let grammarIssue = false;
    if (data.summary && (data.summary.includes('  ') || /^[a-z]/.test(data.summary))) {
        grammarIssue = true;
    }
    expEntries.forEach(e => {
        if (e.desc && (e.desc.includes('  ') || /\b(i|he|she|we|they)\s+[a-z]+/i.test(e.desc))) grammarIssue = true;
    });
    if (grammarIssue) {
        warnings.push({ field: 'Grammar', msg: 'Double spaces or sentence capitalization issues found.' });
    }

    return {
        errors,
        warnings,
        isValid: errors.length === 0,
        totalIssues: errors.length + warnings.length,
    };
};

// ── ATS Score Color ────────────────────────────────────────────
export const getATSScoreColor = (score) => {
    if (score >= 85) return { text: 'text-green-600',  bg: 'bg-green-500',  label: 'Elite',        ring: 'ring-green-500/20' };
    if (score >= 70) return { text: 'text-blue-600',   bg: 'bg-blue-500',   label: 'Strong',       ring: 'ring-blue-500/20'  };
    if (score >= 50) return { text: 'text-yellow-600', bg: 'bg-yellow-500', label: 'Moderate',     ring: 'ring-yellow-500/20'};
    return           { text: 'text-red-600',   bg: 'bg-red-500',   label: 'Needs Work',   ring: 'ring-red-500/20'   };
};
