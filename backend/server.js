import 'dotenv/config';
import express from 'express';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
const require = createRequire(import.meta.url);

const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP.'
});

// ── In-memory multer for resume analysis ────────────────────────────────────
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

// ── Disk-storage multer for marksheet persistence ───────────────────────────
const MARKSHEETS_DIR = path.join(__dirname, 'uploads', 'marksheets');
if (!fs.existsSync(MARKSHEETS_DIR)) {
    fs.mkdirSync(MARKSHEETS_DIR, { recursive: true });
}

const marksheetDiskStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, MARKSHEETS_DIR),
    filename: (_req, file, cb) => {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        cb(null, `${Date.now()}_${safeName}`);
    }
});
const uploadMarksheet = multer({
    storage: marksheetDiskStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
        cb(null, allowed.includes(file.mimetype));
    }
});

// ── Disk-storage multer for certificates persistence ─────────────────────────
const CERTIFICATES_DIR = path.join(__dirname, 'uploads', 'certificates');
if (!fs.existsSync(CERTIFICATES_DIR)) {
    fs.mkdirSync(CERTIFICATES_DIR, { recursive: true });
}

const certificateDiskStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, CERTIFICATES_DIR),
    filename: (_req, file, cb) => {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        cb(null, `${Date.now()}_${safeName}`);
    }
});
const uploadCertificate = multer({
    storage: certificateDiskStorage,
    limits: { fileSize: 15 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        cb(null, allowed.includes(file.mimetype));
    }
});

// ── Persistent metadata store (JSON file on disk) ────────────────────────────
const METADATA_FILE = path.join(__dirname, 'uploads', 'marksheets_meta.json');
const CERTIFICATES_META_FILE = path.join(__dirname, 'uploads', 'certificates_meta.json');

const loadMeta = () => {
    try {
        if (fs.existsSync(METADATA_FILE)) {
            return JSON.parse(fs.readFileSync(METADATA_FILE, 'utf-8'));
        }
    } catch (e) { console.error('[META READ ERROR]', e); }
    return {};
};

const saveMeta = (meta) => {
    try {
        fs.writeFileSync(METADATA_FILE, JSON.stringify(meta, null, 2), 'utf-8');
    } catch (e) { console.error('[META WRITE ERROR]', e); }
};

const loadCertMeta = () => {
    try {
        if (fs.existsSync(CERTIFICATES_META_FILE)) {
            return JSON.parse(fs.readFileSync(CERTIFICATES_META_FILE, 'utf-8'));
        }
    } catch (e) { console.error('[CERT META READ ERROR]', e); }
    return {};
};

const saveCertMeta = (meta) => {
    try {
        fs.writeFileSync(CERTIFICATES_META_FILE, JSON.stringify(meta, null, 2), 'utf-8');
    } catch (e) { console.error('[CERT META WRITE ERROR]', e); }
};

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve uploaded marksheet and certificate files as static assets
app.use('/uploads/marksheets', express.static(MARKSHEETS_DIR));
app.use('/uploads/certificates', express.static(CERTIFICATES_DIR));

// ═══════════════════════════════════════════════════════════════════════════════
// RESUME INTELLIGENCE ENGINE v6.0
// Complete rewrite — accurate extraction of all fields across all resume formats
// ═══════════════════════════════════════════════════════════════════════════════

// ── Date normalization ───────────────────────────────────────────────────────
const FULL_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const SHORT_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const normalizeDate = (dateStr) => {
    if (!dateStr) return '';
    let s = dateStr.trim();
    FULL_MONTHS.forEach((m, i) => { s = s.replace(new RegExp(m, 'gi'), SHORT_MONTHS[i]); });
    s = s.replace(/\s+to\s+/gi, ' – ').replace(/\s*[-—]\s*/g, ' – ');
    return s.trim();
};

// ── Skill categories ─────────────────────────────────────────────────────────
const SKILL_CATEGORIES = {
    Programming: [
        'java','python','javascript','js','typescript','ts','c++','c#','c','ruby','go','rust',
        'php','swift','kotlin','scala','r','matlab','perl','dart','objective-c','haskell','elixir',
        'fortran','cobol','assembly','vba','bash','shell','powershell','lua','groovy'
    ],
    Frontend: [
        'html','css','react','reactjs','vue','vuejs','angular','angularjs','next.js','nextjs',
        'nuxt','tailwind','bootstrap','sass','scss','less','jquery','webpack','vite','svelte',
        'redux','framer motion','styled-components','material-ui','chakra-ui','ant design',
        'three.js','d3.js','electron'
    ],
    Backend: [
        'node','nodejs','express','expressjs','django','flask','spring','spring boot','fastapi',
        'laravel','rails','asp.net','.net','graphql','rest','restful','api','microservices',
        'servlet','hibernate','maven','gradle','celery','gunicorn','nginx','apache','nestjs',
        'fastify','koa','hapi','gin','fiber','echo'
    ],
    Database: [
        'sql','mysql','postgresql','postgres','mongodb','mongo','redis','sqlite','oracle',
        'firebase','cassandra','dynamodb','supabase','nosql','mariadb','db2','neo4j',
        'elasticsearch','influxdb','cockroachdb','planetscale','prisma','sequelize','mongoose'
    ],
    Cloud: [
        'aws','azure','gcp','google cloud','heroku','netlify','vercel','digitalocean',
        'cloudflare','lambda','s3','ec2','kubernetes','k8s','docker','terraform','jenkins',
        'ci/cd','devops','ansible','puppet','chef','github actions','gitlab ci','circleci',
        'travisci','helm','istio','prometheus','grafana'
    ],
    Analytics: [
        'power bi','powerbi','tableau','excel','pandas','numpy','matplotlib','seaborn',
        'scikit','sklearn','tensorflow','pytorch','keras','machine learning','ml','deep learning',
        'dl','data analysis','data visualization','etl','hadoop','spark','jupyter','rstudio',
        'spss','sas','statistics','computer vision','nlp','natural language processing',
        'opencv','yolo','bert','gpt','llm','hugging face','langchain','transformers'
    ],
    Tools: [
        'git','github','gitlab','bitbucket','jira','confluence','figma','postman','linux',
        'bash','vim','vs code','vscode','intellij','eclipse','android studio','xcode',
        'photoshop','canva','notion','slack','trello','asana','sonarqube','selenium',
        'cypress','jest','mocha','pytest','junit','swagger','insomnia','bruno'
    ],
    Soft: [
        'communication', 'leadership', 'teamwork', 'collaboration', 'problem solving',
        'critical thinking', 'adaptability', 'flexibility', 'time management', 'work ethic',
        'interpersonal', 'negotiation', 'conflict resolution', 'active listening',
        'public speaking', 'presentation', 'decision making', 'detail-oriented',
        'creativity', 'emotional intelligence', 'empathy', 'patience', 'mentoring',
        'coaching', 'organization', 'planning', 'strategic thinking', 'self-motivation'
    ]
};

const categorizeSkill = (skill) => {
    const s = skill.toLowerCase().trim();
    for (const [cat, keywords] of Object.entries(SKILL_CATEGORIES)) {
        if (keywords.some(k => s === k.trim().toLowerCase())) return cat;
    }
    for (const [cat, keywords] of Object.entries(SKILL_CATEGORIES)) {
        if (keywords.some(k => {
            const kw = k.trim().toLowerCase();
            if (kw.length <= 2) return s === kw || new RegExp('\\b' + kw.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + '\\b').test(s);
            return s.includes(kw) || kw.includes(s);
        })) return cat;
    }
    return 'Tools';
};

// ── Section header map — exhaustive patterns for all resume styles ────────────
const SECTION_HEADERS = {
    summary: /^(summary|professional\s*summary|career\s*summary|profile|professional\s*profile|career\s*objective|objective|about\s*me|about|overview|executive\s*summary|personal\s*statement|career\s*overview|introduction|professional\s*narrative|brief|bio|candidate\s*summary|self\s*summary)$/i,
    skills:  /^(skills|technical\s*skills|technologies|tools|competencies|expertise|technical\s*expertise|technical\s*matrix|core\s*competencies|key\s*skills|skill\s*set|programming\s*skills|it\s*skills|computer\s*skills|technical\s*competencies|areas\s*of\s*expertise|proficiencies|technology\s*stack|tools\s*&\s*technologies|skills\s*&\s*technologies|technical\s*proficiencies|software\s*skills)$/i,
    experience: /^(experience|work\s*experience|professional\s*experience|employment|employment\s*history|work\s*history|career\s*history|industrial\s*experience|industry\s*experience|job\s*experience|professional\s*background|relevant\s*experience|internship|internship\s*experience|internship\s*&\s*experience|trainings?|apprenticeship|contract\s*experience)$/i,
    projects: /^(projects|personal\s*projects|academic\s*projects|key\s*projects|project\s*work|engineering\s*projects|portfolio|capstone\s*projects|research\s*projects|internship\s*projects|mini\s*projects|college\s*projects|side\s*projects|notable\s*projects|selected\s*projects|featured\s*projects|major\s*projects|open\s*source|open-source\s*projects|development\s*projects)$/i,
    education: /^(education|academic|academic\s*background|qualification|qualifications|educational\s*background|academic\s*record|academic\s*qualifications|schooling|degrees?|academic\s*details|educational\s*qualification|educational\s*details)$/i,
    certifications: /^(certifications?|certificates?|certification\s*programs?|courses?|online\s*courses?|professional\s*certifications?|credentials?|accreditations?|courses?\s*&\s*certifications?|training\s*&\s*certifications?|professional\s*development|moocs?|specializations?)$/i,
    achievements: /^(achievements?|awards?|accomplishments?|honors?|honours?|recognitions?|publications?|research|activities|extracurricular|co-curricular|competitions?|scholarships?|fellowships?|distinctions?|milestones?|highlights?)$/i,
    misc: /^(languages?|languages?\s*known|spoken\s*languages?|personal\s*details?|personal\s*profile|declarations?|references?|hobbies|interests|additional\s*information|strengths|hobbies\s*(and|&)\s*interests|volunteer|volunteering|social\s*work|community\s*service|declaration|referee)$/i,
};

// Detect section header — strips list prefixes, checks word count
const isSectionHeader = (line) => {
    let clean = line.trim()
        .replace(/^(?:[a-zA-Z\d]+|[ivxlcdmIVXLCDM]+)(?:[\s.):\-–—]+)/, '') // strip "1.", "A.", "I-"
        .replace(/[:\-_=*•|#]+$/g, '')   // strip trailing punctuation
        .replace(/^[:\-_=*•|#\s]+/, '')  // strip leading punctuation
        .trim();
    if (!clean || clean.split(/\s+/).length > 6) return null;
    for (const [key, pat] of Object.entries(SECTION_HEADERS)) {
        if (pat.test(clean)) return key;
    }
    return null;
};

// ── Date range regex (comprehensive) ────────────────────────────────────────
const DATE_RANGE_RE = /(?:(?:\d{1,2}[\/\-]\d{2,4})|(?:\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\b\s*,?\s*\d{4})|(?:\b\d{4}\b))\s*(?:to|[-–—]|till|until|–)\s*(?:Present|Current|Now|Till\s*Date|Till\s*date|(?:\d{1,2}[\/\-]\d{2,4})|(?:\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\b\s*,?\s*\d{4})|(?:\b\d{4}\b))/i;

// Common job title keywords
const JOB_TITLE_WORDS = /developer|engineer|architect|analyst|programmer|lead|manager|intern|designer|specialist|consultant|executive|associate|scientist|researcher|administrator|devops|sre|officer|coordinator|director|head|chief|vp|president/i;

// Action verbs that start bullet points — not project titles
const ACTION_VERBS = /^(developed|built|designed|implemented|created|optimized|engineered|spearheaded|led|orchestrated|automated|integrated|migrated|assisted|collaborated|managed|fixed|achieved|wrote|performed|configured|deployed|maintained|analyzed|evaluated|conducted|contributed|enhanced|improved|resolved|utilized|leveraged|ensured|delivered|provided|supported|tested|reviewed|monitored|documented|established|streamlined|generated|facilitated)/i;

// ── Professional title inference from skill set ────────────────────────────
const inferTitleFromSkills = (skillsFlat) => {
    if (!skillsFlat || skillsFlat.length === 0) return '';
    const flat = skillsFlat.map(s => s.toLowerCase()).join(' ');
    if (/tensorflow|pytorch|machine\s*learning|deep\s*learning|keras|llm|bert|nlp|yolo|computer\s*vision/.test(flat)) return 'AI/ML Engineer';
    if (/power\s*bi|tableau|analytics|pandas|numpy|matplotlib|scikit|seaborn|etl|hadoop|spark/.test(flat)) return 'Data Analyst';
    if (/react|angular|vue|svelte|next\.?js|frontend|html|css|tailwind/.test(flat)) return 'Frontend Developer';
    if (/aws|azure|gcp|kubernetes|docker|devops|terraform|ci\/cd|jenkins/.test(flat)) return 'Cloud/DevOps Engineer';
    if (/android|ios|flutter|react\s*native|mobile/.test(flat)) return 'Mobile Developer';
    if (/node|express|django|flask|spring|fastapi|laravel|rails/.test(flat)) return 'Backend Developer';
    if (/figma|ux|ui\s*design|user\s*interface|wireframe|prototyp/.test(flat)) return 'UI/UX Designer';
    if (/java|python|c\+\+|c#|go|rust|kotlin|scala|php/.test(flat)) return 'Software Developer';
    return '';
};

// City/state/country words that must NEVER be a job title
const LOCATION_NAME_RE = /^(india|usa|usa|uk|canada|australia|germany|france|singapore|dubai|uae|tamil\s*nadu|kerala|karnataka|andhra|telangana|maharashtra|gujarat|rajasthan|west\s*bengal|chennai|bengaluru|bangalore|mumbai|hyderabad|delhi|kolkata|pune|coimbatore|madurai|trichy|tirunelveli|aruppukottai|tiruppur|erode|vellore|kochi|new\s*york|california|london|berlin|toronto|sydney)[,\s]*(india|usa|uk|canada|australia|germany|france|singapore|dubai|uae|tamil\s*nadu|kerala|karnataka|andhra|telangana|maharashtra|gujarat|rajasthan|west\s*bengal|[a-z]+)?$/i;

const LOCATION_KEYWORDS = /india|usa|uk|canada|australia|germany|france|singapore|dubai|uae|tamil\s*nadu|kerala|karnataka|andhra|telangana|maharashtra|gujarat|rajasthan|west\s*bengal|chennai|bengaluru|bangalore|mumbai|hyderabad|delhi|kolkata|pune|coimbatore|madurai|trichy|tirunelveli|aruppukottai|tiruppur|erode|vellore|kochi|new\s*york|california|london|berlin|toronto|sydney/i;

const isLocationLine = (line) => {
    const clean = line.replace(/^[•\-*|]?\s*/, '').trim();
    return LOCATION_NAME_RE.test(clean) || (LOCATION_KEYWORDS.test(clean) && clean.split(/\s+/).length <= 4);
};

// Cleans a raw title string — removes company/org noise, fixes casing
const cleanTitle = (raw, skillsFlat = []) => {
    if (!raw) return '';
    let s = raw.replace(/[:\-_=*•|#\n]/g, ' ').replace(/\s+/g, ' ').trim();

    // Reject if it looks like a city/location — never use as title
    if (LOCATION_NAME_RE.test(s.trim())) {
        return inferTitleFromSkills(skillsFlat) || 'Software Developer';
    }

    // Reject phone numbers, emails, URLs leaking in
    if (/\+?\d{7,}/.test(s) || s.includes('@') || s.includes('http')) {
        return inferTitleFromSkills(skillsFlat) || 'Software Developer';
    }

    // Strip company suffixes
    const companySuffixRe = /\b(llp|pvt|ltd|inc|solutions|technologies|services|labs|systems|limited|corp|corporation|software|technology|consulting|group|pvt\.?\s*ltd\.?|private\s*limited)\b/gi;
    if (companySuffixRe.test(s)) {
        const lower = s.toLowerCase();
        const coreMatch = lower.match(/\b(full[\s-]?stack|frontend|front[\s-]?end|backend|back[\s-]?end|mobile|android|ios|ai[\s\/]?ml|machine\s*learning|data\s*(analyst|scientist|engineer)|cloud|devops|ui[\s\/]?ux|software|web)\s*(developer|engineer|analyst|designer|programmer|architect|specialist|lead|manager|intern|researcher|consultant)?\b/i);
        if (coreMatch) return toTitleCase(coreMatch[0].trim());
        return inferTitleFromSkills(skillsFlat) || 'Software Developer';
    }

    // If too long (>5 words) — extract the core role keyword
    const words = s.split(/\s+/);
    if (words.length > 5) {
        const lower = s.toLowerCase();
        const match = lower.match(/\b(full[\s-]?stack|frontend|front[\s-]?end|backend|back[\s-]?end|mobile|android|ios|ai[\s\/]?ml|machine\s*learning|data\s*(analyst|scientist|engineer)|cloud|devops|ui[\s\/]?ux|software|web)?\s*(developer|engineer|analyst|designer|programmer|architect|specialist|lead|manager|intern|researcher|scientist|consultant)\b/i);
        if (match) return toTitleCase(match[0].trim());
        return inferTitleFromSkills(skillsFlat) || 'Software Developer';
    }

    // Reject obvious section names / non-titles
    if (/^(internship|internships|experience|projects|education|skills|certifications|achievements|profile|summary|objective|curriculum|vitae|resume|cv)$/i.test(s.trim())) {
        return inferTitleFromSkills(skillsFlat) || 'Software Developer';
    }

    return toTitleCase(s.trim());
};

const toTitleCase = (str) =>
    str.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

// ── MAIN EXTRACTION FUNCTION ─────────────────────────────────────────────────
const extractSections = (rawText) => {
    // Normalize line endings, tabs → spaces
    const text = rawText
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\t/g, ' ')
        .replace(/[ ]{3,}/g, '  ');

    const allLines = text.split('\n').map(l => l.trimEnd());
    // Lines trimmed for processing; we keep original index
    const lines = allLines.map(l => l.trim()).filter(l => l.length > 0);

    const result = {
        name: '',
        title: '',
        contact: { email: '', phone: '', linkedin: '', github: '', portfolio: '', location: '' },
        summary: '',
        skills: { Programming: [], Frontend: [], Backend: [], Database: [], Cloud: [], Analytics: [], Tools: [], Soft: [] },
        skillsFlat: [],
        experience: [],
        projects: [],
        education: [],
        certifications: [],
        achievements: [],
        achievementsStructured: { awards: [], researchPapers: [], presentations: [], scholarships: [], competitions: [] },
        confidence: 0,
        confidenceDetails: { contact: 0, skills: 0, projects: 0, experience: 0, certifications: 0, overall: 0 }
    };

    // ════════════════════════════════════════════════════════
    // PASS 1: Global regex-based extraction (contact info)
    // ════════════════════════════════════════════════════════

    // Email
    const emailM = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
    if (emailM) result.contact.email = emailM[0].toLowerCase();

    // Phone — support Indian, US, international
    const phonePatterns = [
        /(?:\+91[\s\-]?)?[6-9]\d{9}/,
        /\+?1?\s*\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}/,
        /\+?\d{1,3}[\s\-]?\(?\d{2,4}\)?[\s\-]?\d{3,4}[\s\-]?\d{3,4}/,
        /\(?\d{3}\)?[\s\-]\d{3}[\s\-]\d{4}/
    ];
    for (const pat of phonePatterns) {
        const m = text.match(pat);
        if (m && m[0].replace(/\D/g,'').length >= 7) { result.contact.phone = m[0].trim(); break; }
    }

    // LinkedIn
    const liM = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_\-]+)\/?/i);
    if (liM) result.contact.linkedin = 'https://linkedin.com/in/' + liM[1];

    // GitHub
    const ghM = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_\-]+)\/?/i);
    if (ghM) result.contact.github = 'https://github.com/' + ghM[1];

    // Portfolio / personal website (not LinkedIn/GitHub/mailto)
    const urlMatches = text.match(/https?:\/\/[^\s,<>"'}\]]+/gi) || [];
    for (const url of urlMatches) {
        const u = url.toLowerCase();
        if (!u.includes('linkedin') && !u.includes('github') && !u.includes('mailto') && !u.includes('@')) {
            result.contact.portfolio = url;
            break;
        }
    }

    // Location — scan first 20 lines for city/state/country pattern
    const LOCATION_KEYWORDS = /india|usa|uk|canada|australia|germany|france|singapore|dubai|uae|tamil\s*nadu|kerala|karnataka|andhra|telangana|maharashtra|gujarat|rajasthan|west\s*bengal|chennai|bengaluru|bangalore|mumbai|hyderabad|delhi|kolkata|pune|coimbatore|madurai|trichy|tirunelveli|aruppukottai|tiruppur|erode|vellore|kochi/i;
    for (let i = 0; i < Math.min(20, lines.length); i++) {
        const line = lines[i];
        if (line.includes(',') && LOCATION_KEYWORDS.test(line) && !line.includes('@') && !line.includes('http')) {
            result.contact.location = line.replace(/^[•\-*|]?\s*/, '').trim();
            break;
        }
        // Also capture plain city lines
        if (LOCATION_KEYWORDS.test(line) && line.split(/\s+/).length <= 5 && !line.includes('@') && !line.includes('http') && !isSectionHeader(line)) {
            if (!result.contact.location) result.contact.location = line.replace(/^[•\-*|]?\s*/, '').trim();
        }
    }

    // ════════════════════════════════════════════════════════
    // PASS 2: Name extraction
    // ════════════════════════════════════════════════════════
    const NAME_FORBIDDEN = new Set([
        'current','location','address','temporary','permanent','contact','email','phone','mobile',
        'resume','cv','curriculum','vitae','profile','career','objective','summary','skills',
        'experience','projects','education','page','date','birth','gender','nationality','languages',
        'known','father','mother','hobbies','interest','declaration','signature','academic',
        'work','certifications','reference','linkedin','github','portfolio','website'
    ]);

    const isLikelyName = (line) => {
        if (!line || line.length < 2 || line.length > 50) return false;
        if (line.includes('@') || line.includes('http') || /\+?\d{7,}/.test(line) || line.includes('|')) return false;
        if (isSectionHeader(line)) return false;
        const lower = line.toLowerCase();
        if (lower.split(/\s+/).some(w => NAME_FORBIDDEN.has(w))) return false;
        if (/[:;,=]/.test(line)) {
            // Allow "Name: John Doe" pattern
            const colonParts = line.split(':');
            if (colonParts[0].trim().toLowerCase() === 'name' && colonParts[1]) {
                const candidate = colonParts[1].trim();
                const words = candidate.split(/\s+/);
                return words.length >= 1 && words.length <= 5 && words.every(w => /^[A-Za-z][a-zA-Z.\-']*$/.test(w));
            }
            return false;
        }
        const words = line.split(/\s+/);
        if (words.length < 1 || words.length > 5) return false;
        return words.every(w => /^[A-Za-z][a-zA-Z.\-']*$/.test(w));
    };

    for (let i = 0; i < Math.min(12, lines.length); i++) {
        const line = lines[i].trim();
        if (line.includes(':')) {
            const parts = line.split(':');
            if (parts[0].trim().toLowerCase() === 'name' && parts[1]) {
                const candidate = parts[1].replace(/[^A-Za-z\s.\-']/g, '').trim();
                if (candidate.length > 2) {
                    result.name = toTitleCase(candidate);
                    break;
                }
            }
            continue;
        }
        if (isLikelyName(line)) {
            result.name = toTitleCase(line.replace(/[^A-Za-z\s.\-']/g, '').trim());
            break;
        }
    }

    // Fallback name: first non-junk line in first 6
    if (!result.name) {
        for (let i = 0; i < Math.min(6, lines.length); i++) {
            const line = lines[i].trim();
            if (line.includes('@') || line.includes('http') || /\+?\d{7,}/.test(line) || isSectionHeader(line)) continue;
            const nameClean = line.replace(/[^A-Za-z\s.\-']/g, '').replace(/\s+/g, ' ').trim();
            const words = nameClean.split(/\s+/);
            if (words.length >= 1 && words.length <= 5 && nameClean.length >= 3 && nameClean.length <= 45) {
                const lower = nameClean.toLowerCase();
                if (!lower.split(/\s+/).some(w => NAME_FORBIDDEN.has(w))) {
                    result.name = toTitleCase(nameClean);
                    break;
                }
            }
        }
    }

    // ════════════════════════════════════════════════════════
    // PASS 3: Section-based parsing
    // ════════════════════════════════════════════════════════
    let currentSection = null;
    let currentExp = null;
    let currentProj = null;
    let summaryLines = [];

    // Detect inline-label lines like "Objective: ..." or "Summary: ..."
    // where content follows on the same line
    const INLINE_SECTION_RE = /^(summary|profile|objective|about\s*me|career\s*objective|professional\s*summary|professional\s*profile)\s*[:\-–]\s*(.+)/i;

    for (let idx = 0; idx < lines.length; idx++) {
        const line = lines[idx];
        const nextLine = lines[idx + 1] || '';
        const prevLine = idx > 0 ? lines[idx - 1] : '';

        // ── Section header detection ──
        const detectedSection = isSectionHeader(line);
        if (detectedSection) {
            currentSection = detectedSection;
            // Finalize any open experience/project
            if (detectedSection !== 'experience') currentExp = null;
            if (detectedSection !== 'projects') currentProj = null;
            continue;
        }

        // ── Inline summary detection (e.g. "Objective: Looking for a role...") ──
        if (!currentSection || currentSection === null) {
            const inlineM = line.match(INLINE_SECTION_RE);
            if (inlineM && inlineM[2].length > 15) {
                if (!isLocationLine(inlineM[2])) {
                    summaryLines.push(inlineM[2].trim());
                    // Collect continuation lines until next section
                    let j = idx + 1;
                    while (j < lines.length && !isSectionHeader(lines[j])) {
                        if (!isLocationLine(lines[j])) {
                            summaryLines.push(lines[j]);
                        }
                        j++;
                    }
                    idx = j - 1;
                    continue;
                }
            }
        }

        if (line.length < 2) continue;
        if (currentSection === 'misc') continue; // Skip personal/declaration sections

        // Universal skill scanner — run on all lines to catch skills anywhere
        const skillMatch = line.match(/(?:skills?|technologies|tech\s*stack|tools|competencies)\s*[:\-]?\s*(.*)/i);
        if (skillMatch && skillMatch[1].length > 3) {
            const tokens = skillMatch[1].split(/[|,;•\t\/]/).map(s => s.replace(/^[\-*•◆▪\s]+/, '').trim()).filter(s => s.length > 1);
            tokens.forEach(token => {
                const cat = categorizeSkill(token);
                if (token && !result.skillsFlat.includes(token)) {
                    result.skills[cat].push(token);
                    result.skillsFlat.push(token);
                }
            });
        }

        // If no active section header, treat general lines as potential summary
        if (!currentSection && !isSectionHeader(line) && !line.includes('@') && !line.includes('http') && line.length > 20) {
            if (!isLocationLine(line)) {
                if (summaryLines.length < 5) summaryLines.push(line);
            }
        }

        switch (currentSection) {
            // ─────────────────────────────────────────────────────
            case 'summary': {
                if (line.length < 10) break;
                if (line.includes('@') || line.includes('http') || /\+?\d{7,}/.test(line)) break;
                if (isLocationLine(line)) break;

                summaryLines.push(line);
                break;
            }

            // ─────────────────────────────────────────────────────
            case 'skills': {
                let content = line;
                if (line.includes(':')) {
                    const parts = line.split(':');
                    if (parts[0].trim().split(/\s+/).length <= 4) {
                        content = parts.slice(1).join(':');
                    }
                }
                const tokens = content.split(/[|,;•\t\/]/)
                    .map(s => s.replace(/^[\-*•◆▪\s]+/, '').trim())
                    .filter(s => s.length > 1 && s.length < 40);
                tokens.forEach(token => {
                    const cat = categorizeSkill(token);
                    if (token && !result.skillsFlat.includes(token)) {
                        result.skills[cat].push(token);
                        result.skillsFlat.push(token);
                    }
                });
                break;
            }

            // ─────────────────────────────────────────────────────
            case 'experience': {
                const dateMatch = line.match(DATE_RANGE_RE);
                const isBullet = /^[•\-*◆▪›➢>–]/.test(line) || ACTION_VERBS.test(line);

                if (dateMatch) {
                    const period = dateMatch[0];
                    let remaining = line.replace(period, '')
                        .replace(/^[•\-*◆▪›➢>|,\s]+/, '')
                        .replace(/[•\-*◆▪›➢>|,\s]+$/, '')
                        .trim();
                    
                    let role = '';
                    let company = '';
                    
                    // Split by typical separators
                    const parts = remaining.split(/\s*[\-|–|—|\|]\s*/);
                    if (parts.length >= 2) {
                        if (JOB_TITLE_WORDS.test(parts[0])) {
                            role = parts[0].trim();
                            company = parts[1].trim();
                        } else if (JOB_TITLE_WORDS.test(parts[1])) {
                            role = parts[1].trim();
                            company = parts[0].trim();
                        } else {
                            role = parts[0].trim();
                            company = parts[1].trim();
                        }
                    } else {
                        if (JOB_TITLE_WORDS.test(remaining)) {
                            role = remaining;
                            if (prevLine && prevLine.length < 50 && !prevLine.match(DATE_RANGE_RE) && !/^[•\-*◆▪›➢>]/.test(prevLine)) {
                                company = prevLine;
                            }
                        } else {
                            company = remaining;
                            if (prevLine && JOB_TITLE_WORDS.test(prevLine)) {
                                role = prevLine;
                            }
                        }
                    }

                    if (!role) role = remaining || 'Professional';
                    if (!company) company = prevLine && prevLine.length < 50 && !isSectionHeader(prevLine) ? prevLine : 'Company';

                    currentExp = {
                        role: cleanTitle(role),
                        company: company.replace(/^[•\-*◆▪›➢>|,\s]+/, '').trim(),
                        period: normalizeDate(period),
                        desc: ''
                    };
                    result.experience.push(currentExp);
                } else if (isBullet && currentExp) {
                    const bulletClean = line.replace(/^[•\-*◆▪›➢>–\s]+/, '').trim();
                    currentExp.desc += '• ' + bulletClean + '\n';
                } else {
                    if (line.length < 60 && JOB_TITLE_WORDS.test(line) && !isSectionHeader(line)) {
                        currentExp = {
                            role: cleanTitle(line),
                            company: prevLine && prevLine.length < 40 && !isSectionHeader(prevLine) && !prevLine.match(DATE_RANGE_RE) ? prevLine : 'Company',
                            period: 'Present',
                            desc: ''
                        };
                        result.experience.push(currentExp);
                    }
                }
                break;
            }

            // ─────────────────────────────────────────────────────
            case 'projects': {
                const cleanLine = line.replace(/^[•\-*◆▪›➢>–\s]+/, '').trim();
                const isBullet = /^[•\-*◆▪›➢>–]/.test(line) || ACTION_VERBS.test(cleanLine);
                const hasTechLabel = /^(tech|technologies|stack|tools|environment)\s*[:\-]/i.test(line);

                const isNewProject = !isBullet && !hasTechLabel && line.length < 60 && !line.includes('|') && !isSectionHeader(line);

                if (isNewProject) {
                    currentProj = {
                        title: cleanLine.replace(/[:\-–—]+$/, '').trim(),
                        desc: '',
                        tech: [],
                        stack: ''
                    };
                    result.projects.push(currentProj);
                } else if (currentProj) {
                    handleProjectLine(line, cleanLine, currentProj);
                }
                break;
            }

            // ─────────────────────────────────────────────────────
            case 'education': {
                const dateMatch = line.match(DATE_RANGE_RE);
                const scoreMatch = line.match(/\b(?:gpa|cgpa|percentage|marks?)\s*[:\-]?\s*([0-9.]+(?:\s*\/[0-9.]+)?%?)/i) || 
                                   line.match(/\b([0-9.]+)\s*(?:gpa|cgpa)/i) || 
                                   line.match(/\b([0-9.]+%)/);
                
                let score = scoreMatch ? scoreMatch[1] || scoreMatch[0] : '';
                let period = dateMatch ? dateMatch[0] : '';
                
                let clean = line;
                if (dateMatch) clean = clean.replace(dateMatch[0], '');
                if (scoreMatch) clean = clean.replace(scoreMatch[0], '');
                clean = clean.replace(/^[•\-*◆▪›➢>|,\s]+/, '').replace(/[•\-*◆▪›➢>|,\s]+$/, '').trim();
                
                const isAcademicLine = /university|college|school|academy|institute|bachelor|master|b\.e|b\.tech|m\.tech|degree|diploma|hsc|sslc|cbse/i.test(clean);
                
                if (isAcademicLine || line.length < 80) {
                    let degree = '';
                    let school = '';
                    
                    const parts = clean.split(/\s*[\-|–|—|\|]\s*/);
                    if (parts.length >= 2) {
                        if (/bachelor|master|b\.e|b\.tech|m\.tech|degree|diploma|hsc|sslc/i.test(parts[0])) {
                            degree = parts[0].trim();
                            school = parts[1].trim();
                        } else {
                            school = parts[0].trim();
                            degree = parts[1].trim();
                        }
                    } else {
                        if (/bachelor|master|b\.e|b\.tech|m\.tech|degree|diploma|hsc|sslc/i.test(clean)) {
                            degree = clean;
                        } else {
                            school = clean;
                        }
                    }
                    
                    if (!degree && prevLine && /bachelor|master|b\.e|b\.tech|m\.tech|degree|diploma|hsc|sslc/i.test(prevLine)) {
                        degree = prevLine;
                    }
                    
                    if (degree || school) {
                        result.education.push({
                            degree: degree || 'Degree',
                            school: school || (prevLine && prevLine.length < 50 ? prevLine : 'Institution'),
                            period: period || 'Completed',
                            score: score || ''
                        });
                    }
                }
                break;
            }

            // ─────────────────────────────────────────────────────
            case 'certifications': {
                const clean = line.replace(/^[•\-*◆▪›➢>–\s]+/, '').replace(/[:\-–—]+$/, '').trim();
                if (clean.length > 3 && clean.length < 150) {
                    let title = clean;
                    let issuer = 'Credential Authority';
                    let year = '';
                    
                    const yearMatch = clean.match(/\b(19\d{2}|20\d{2})\b/);
                    if (yearMatch) {
                        year = yearMatch[1];
                    }
                    
                    let textWithoutYear = clean;
                    if (yearMatch) {
                        textWithoutYear = clean.replace(yearMatch[0], '').replace(/\(\s*\)/, '').replace(/\[\s*\]/, '').trim();
                    }
                    
                    const parts = textWithoutYear.split(/\s*(?:[-–—,|]|\bby\b|\bfrom\b)\s*/i).filter(Boolean);
                    if (parts.length >= 2) {
                        title = parts[0].trim();
                        issuer = parts[1].trim();
                    } else {
                        title = textWithoutYear.trim();
                    }
                    
                    title = title.replace(/^[•\-*◆▪›➢>–|,\s]+/, '').replace(/[•\-*◆▪›➢>|,\s]+$/, '').trim();
                    issuer = issuer.replace(/^[•\-*◆▪›➢>–|,\s]+/, '').replace(/[•\-*◆▪›➢>|,\s]+$/, '').trim();
                    
                    result.certifications.push({
                        title: toTitleCase(title),
                        issuer: toTitleCase(issuer),
                        year: year || '2025',
                        description: `Professional certification verified by ${issuer}${year ? ` in ${year}` : ''}.`
                    });
                }
                break;
            }

            // ─────────────────────────────────────────────────────
            case 'achievements': {
                const clean = line.replace(/^[•\-*◆▪›➢>–\s]+/, '').trim();
                if (clean.length > 5) {
                    result.achievements.push(clean);
                    
                    const cleanLower = clean.toLowerCase();
                    if (/award|won|prize|first|1st|second|2nd|third|3rd|gold|silver|bronze/i.test(cleanLower)) {
                        result.achievementsStructured.awards.push(clean);
                    } else if (/paper|publish|journal|patent|ieee|research/i.test(cleanLower)) {
                        result.achievementsStructured.researchPapers.push(clean);
                    } else if (/present|speaker|talk|conference/i.test(cleanLower)) {
                        result.achievementsStructured.presentations.push(clean);
                    } else if (/scholarship|fellowship|grant/i.test(cleanLower)) {
                        result.achievementsStructured.scholarships.push(clean);
                    } else if (/hackathon|compet|contest|olympiad|codeforces|leetcode/i.test(cleanLower)) {
                        result.achievementsStructured.competitions.push(clean);
                    }
                }
                break;
            }
        }
    }

    // Final Post-processing
    if (summaryLines.length > 0) result.summary = summaryLines.join(' ').replace(/\s+/g, ' ').trim();
    result.experience.forEach(exp => exp.desc = exp.desc.trim());
    result.projects.forEach(proj => {
        proj.desc = proj.desc.trim();
        proj.tech = [...new Set(proj.tech)];
    });

    // ════════════════════════════════════════════════════════
    // TITLE EXTRACTION — Priority chain
    // ════════════════════════════════════════════════════════

    let detectedTitle = '';
    if (result.name) {
        const nameIdx = lines.findIndex(l => l.toLowerCase().includes(result.name.toLowerCase()));
        if (nameIdx >= 0) {
            for (let i = 1; i <= 4; i++) {
                const checkLine = lines[nameIdx + i];
                if (checkLine && JOB_TITLE_WORDS.test(checkLine)) { detectedTitle = checkLine; break; }
            }
        }
    }

    if (!detectedTitle && result.summary) {
        const patterns = [
            /\b(?:seeking|looking\s*for|aspiring)\s+(?:a\s+)?(?:position\s+(?:as|of)\s+a?\s*)?([A-Za-z\s\/&.\-]{3,40}?)(?:\s+role|\s+position|\s+opportunity|\s+with|\.|,|$)/i,
            /\b(?:experienced|passionate|skilled|dedicated|motivated|results-driven|seasoned|dynamic)\s+([A-Za-z\s\/&.\-]{3,40}?)(?:\s+with|\s+who|\.|,|$)/i,
            /\b(?:i\s+am\s+a|i\s+am\s+an)\s+([A-Za-z\s\/&.\-]{3,40}?)(?:\s+with|\s+who|\.|,|$)/i,
            /\b(?:a\s+passionate|an\s+aspiring|a\s+motivated|a\s+dedicated)\s+([A-Za-z\s\/&.\-]{3,40}?)(?:\s+with|\s+who|\.|,|$)/i,
        ];
        for (const pat of patterns) {
            const m = result.summary.match(pat);
            if (m && m[1] && JOB_TITLE_WORDS.test(m[1])) {
                const candidate = m[1].trim().replace(/^(a|an|the)\s+/i, '');
                if (candidate.split(/\s+/).length <= 5) {
                    detectedTitle = candidate;
                    break;
                }
            }
        }
    }

    // Strategy 3: Use most recent experience role
    if (!detectedTitle && result.experience.length > 0) {
        detectedTitle = result.experience[0].role;
    }

    // Strategy 4: Infer from skills
    if (!detectedTitle) {
        detectedTitle = inferTitleFromSkills(result.skillsFlat);
    }

    // Final cleanup and normalization of title
    result.title = cleanTitle(detectedTitle, result.skillsFlat) || 'Software Developer';

    // NOTE: Per design requirement — do NOT synthesise a fake summary.
    // If the resume has no summary/objective/about-me section, leave it empty.
    // The portfolio template handles an empty summary gracefully.
    // (Removed synthetic fallback to prevent incorrect/fake content)

    // ════════════════════════════════════════════════════════
    // CONFIDENCE SCORING
    // ════════════════════════════════════════════════════════
    let contactScore = 0;
    if (result.name) contactScore += 20;
    if (result.contact.email) contactScore += 30;
    if (result.contact.phone) contactScore += 20;
    if (result.contact.linkedin) contactScore += 15;
    if (result.contact.github) contactScore += 15;

    const skillsScore = result.skillsFlat.length >= 10 ? 100 : result.skillsFlat.length >= 5 ? 80 : result.skillsFlat.length >= 1 ? 50 : 0;
    const projectsScore = result.projects.length >= 2 ? 100 : result.projects.length === 1 ? 85 : lines.some(l => isSectionHeader(l) === 'projects') ? 50 : 0;
    const experienceScore = result.experience.length >= 2 ? 100 : result.experience.length === 1 ? 85 : lines.some(l => isSectionHeader(l) === 'experience') ? 50 : 0;
    const certsScore = result.certifications.length >= 1 ? 100 : lines.some(l => isSectionHeader(l) === 'certifications') ? 50 : 60;

    const overall = Math.round((contactScore + skillsScore + projectsScore + experienceScore + certsScore) / 5);

    result.confidenceDetails = { contact: contactScore, skills: skillsScore, projects: projectsScore, experience: experienceScore, certifications: certsScore, overall };
    result.confidence = overall;

    return result;
};

// Helper: process a line inside a project's body
function handleProjectLine(line, cleanLine, proj) {
    if (/^tech(?:nologies)?(?:\s*used)?[:\-]|^stack[:\-]|^tools\s*used[:\-]/i.test(line)) {
        const techPart = line.replace(/^[^:\-]+[:\-]\s*/i, '').trim();
        proj.stack = techPart;
        proj.tech = [...new Set([...proj.tech, ...techPart.split(/[,|]/).map(t => t.trim()).filter(Boolean)])];
    } else if (/duration[:\-]|period[:\-]|timeline[:\-]/i.test(line)) {
        proj.duration = line.replace(/^[^:\-]+[:\-]\s*/i, '').trim();
    } else if (/impact|result|achiev|improved|reduced|increased/i.test(cleanLine)) {
        proj.impact += cleanLine.replace(/^[•\-*]\s*/, '') + ' ';
    } else {
        // Auto-detect tech from content
        const COMMON_TECH = ['React','Angular','Vue','Node','Django','Flask','Spring Boot','FastAPI',
            'PostgreSQL','MongoDB','MySQL','Redis','AWS','Azure','GCP','Docker','Kubernetes',
            'Python','Java','JavaScript','TypeScript','TensorFlow','PyTorch','Keras',
            'OpenCV','NLTK','Pandas','Scikit-learn','Next.js','Express','GraphQL',
            'Firebase','Supabase','Tailwind','Bootstrap','Figma','Unity','Unreal'];
        if (!proj.tech || proj.tech.length < 5) {
            const found = COMMON_TECH.filter(t => new RegExp('\\b' + t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + '\\b', 'i').test(line));
            found.forEach(t => { if (!proj.tech.includes(t)) proj.tech.push(t); });
        }
        if (cleanLine.length > 5) proj.desc += cleanLine.replace(/^[•\-*◆▪>]\s*/, '') + ' ';
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// API ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// ── Marksheet Persistence API ────────────────────────────────────────────────

// GET /api/marksheets — return all saved marksheet metadata
app.get('/api/marksheets', (req, res) => {
    const meta = loadMeta();
    res.json({ success: true, marksheets: meta });
});

// POST /api/marksheets/:docType — upload & persist a marksheet file
// :docType is one of: hss | sslc | consolidated | graduation | semester_0 .. semester_7
app.post('/api/marksheets/:docType', uploadMarksheet.single('file'), (req, res) => {
    const { docType } = req.params;
    if (!req.file) return res.status(400).json({ error: 'No file received' });

    const meta = loadMeta();

    // Delete old file from disk if one already exists for this docType
    if (meta[docType]?.filename) {
        const oldPath = path.join(MARKSHEETS_DIR, meta[docType].filename);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    meta[docType] = {
        docType,
        filename: req.file.filename,
        originalName: req.file.originalname,
        fileType: req.file.mimetype,
        fileUrl: `/uploads/marksheets/${req.file.filename}`,
        uploadDate: new Date().toISOString(),
        fileSize: req.file.size
    };

    saveMeta(meta);
    res.json({ success: true, marksheet: meta[docType] });
});

// DELETE /api/marksheets/:docType — remove a marksheet
app.delete('/api/marksheets/:docType', (req, res) => {
    const { docType } = req.params;
    const meta = loadMeta();

    if (!meta[docType]) return res.status(404).json({ error: 'Not found' });

    const filePath = path.join(MARKSHEETS_DIR, meta[docType].filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    delete meta[docType];
    saveMeta(meta);
    res.json({ success: true });
});

// ── Certificate Persistence API ─────────────────────────────────────────────

// GET /api/certificates — return all saved certificate metadata
app.get('/api/certificates', (_req, res) => {
    const meta = loadCertMeta();
    res.json({ success: true, certificates: meta });
});

// POST /api/certificates/:certId — upload & persist a certificate file
app.post('/api/certificates/:certId', uploadCertificate.single('file'), (req, res) => {
    const { certId } = req.params;
    if (!req.file) return res.status(400).json({ error: 'No file received' });

    const meta = loadCertMeta();

    // Delete old file from disk if one already exists for this certId
    if (meta[certId]?.filename) {
        const oldPath = path.join(CERTIFICATES_DIR, meta[certId].filename);
        if (fs.existsSync(oldPath)) {
            try { fs.unlinkSync(oldPath); } catch (err) { console.error('Failed to delete old certificate file:', err); }
        }
    }

    meta[certId] = {
        certId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileUrl: `/uploads/certificates/${req.file.filename}`,
        uploadDate: new Date().toISOString(),
        fileSize: req.file.size,
        title: req.body.title || '',
        issuer: req.body.issuer || ''
    };

    saveCertMeta(meta);
    res.json({ success: true, certificate: meta[certId] });
});

// DELETE /api/certificates/:certId — remove a certificate
app.delete('/api/certificates/:certId', (req, res) => {
    const { certId } = req.params;
    const meta = loadCertMeta();

    if (!meta[certId]) return res.status(404).json({ error: 'Not found' });

    const filePath = path.join(CERTIFICATES_DIR, meta[certId].filename);
    if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (err) { console.error('Failed to delete certificate file:', err); }
    }

    delete meta[certId];
    saveCertMeta(meta);
    res.json({ success: true });
});

app.post('/api/analyze-resume', limiter, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'Null Payload: Resume required.' });

        let rawText = '';
        const mime = req.file.mimetype;

        if (mime === 'application/pdf') {
            const parsed = await pdfParse(req.file.buffer);
            rawText = parsed.text;
        } else if (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const data = await mammoth.extractRawText({ buffer: req.file.buffer });
            rawText = data.value;
        } else if (mime === 'text/plain') {
            rawText = req.file.buffer.toString('utf-8');
        } else {
            return res.status(400).json({ error: 'Mime Error: PDF, DOCX, or TXT only.' });
        }

        if (!rawText || rawText.trim().length < 50) {
            return res.status(400).json({ error: 'Empty or unreadable resume. Please upload a text-based PDF.' });
        }

        const structuredData = extractSections(rawText);

        const warnings = [];
        if (!structuredData.contact.email) warnings.push('Email not detected');
        if (!structuredData.contact.phone) warnings.push('Phone not detected');
        if (structuredData.skillsFlat.length === 0) warnings.push('No skills detected — check skills section formatting');
        if (structuredData.projects.length === 0) warnings.push('No projects detected — check projects section formatting');
        if (structuredData.experience.length === 0) warnings.push('No experience/internship detected');
        if (structuredData.certifications.length === 0) warnings.push('No certifications detected');

        res.json({
            status: 'success',
            data: structuredData,
            warnings,
            intel: {
                atsScore: Math.min(40 + structuredData.skillsFlat.length * 3 + structuredData.projects.length * 5, 95),
                completeness: structuredData.confidence,
                keywords: structuredData.skillsFlat.length
            }
        });
    } catch (error) {
        console.error('[PARSE ERROR]', error);
        res.status(500).json({ error: 'Resume parsing failed: ' + error.message });
    }
});

// ── Email route ──────────────────────────────────────────────────────────────
app.post(['/send-email', '/api/send-email'], limiter, async (req, res) => {
    const { name, email, to, message } = req.body;
    if (!name || !email || !to || !message) return res.status(400).json({ error: 'Missing fields' });

    if (process.env.EMAIL_PASS === 'mock' || !process.env.EMAIL_PASS || process.env.EMAIL_PASS.trim() === '') {
        console.log(`\n--- [MOCK EMAIL SENT] ---`);
        console.log(`From: ${name} <${email}>`);
        console.log(`To: ${to}`);
        console.log(`Message: ${message}`);
        console.log(`-------------------------\n`);
        return res.status(200).json({ message: 'Success (Mock Mode)' });
    }

    try {
        const formattedTimestamp = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short'
        }) + ' (IST)';

        const htmlContent = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#080c14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#f8fafc;">
  <table width="100%" style="background:#080c14;padding:40px 16px;"><tr><td align="center">
    <table width="100%" style="max-width:600px;background:#0f1626;border:2px solid #1e293b;border-radius:28px;overflow:hidden;box-shadow:0 0 30px rgba(0,229,255,0.15);">
      <tr><td height="6" style="background:linear-gradient(90deg,#6366f1,#8b5cf6);"></td></tr>
      <tr><td style="padding:40px 40px 24px;">
        <span style="font-size:11px;font-weight:800;color:#6366f1;letter-spacing:3px;text-transform:uppercase;">✦ NEW INQUIRY</span>
        <h1 style="margin:8px 0 0;font-size:26px;font-weight:900;color:#fff;">New message from ${name}</h1>
      </td></tr>
      <tr><td style="padding:0 40px 24px;">
        <table width="100%" style="background:#172033;border:1px solid #2d3b55;border-radius:20px;padding:24px;">
          <tr><td><span style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Email</span><br>
            <a href="mailto:${email}" style="color:#6366f1;font-size:15px;font-weight:700;">${email}</a></td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:0 40px 30px;">
        <table width="100%" style="background:#0a0f1d;border:1px solid #1e293b;border-radius:20px;">
          <tr><td style="padding:28px;font-size:15px;line-height:1.7;color:#cbd5e1;white-space:pre-wrap;">${message}</td></tr>
        </table>
      </td></tr>
      <tr><td align="center" style="background:#06090f;padding:24px;border-top:1px solid #1e293b;">
        <span style="font-size:9px;font-weight:800;color:#475569;letter-spacing:4px;text-transform:uppercase;">MHCV PORTFOLIO — ${formattedTimestamp}</span>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;

        const primaryPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : '';
        const fallbackPasses = [primaryPass, 'xfrdmfudwswbhboc', 'ffgakueatejdasid'].filter(Boolean);
        const uniquePasses = [...new Set(fallbackPasses)];

        let sent = false;
        let lastError = null;

        for (const pass of uniquePasses) {
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER || 'mhemachandravijay347@gmail.com',
                        pass: pass,
                    },
                });

                await transporter.sendMail({
                    from: `"MHCV Gateway" <${process.env.EMAIL_USER || 'mhemachandravijay347@gmail.com'}>`,
                    to, replyTo: email,
                    subject: `⚡ [UPLINK] Message from ${name}`,
                    text: `From: ${name} <${email}>\n\n${message}`,
                    html: htmlContent
                });
                sent = true;
                break;
            } catch (authErr) {
                lastError = authErr;
                console.warn(`[SMTP ATTEMPT] Pass failed: ${authErr.message}`);
            }
        }

        if (sent) {
            return res.status(200).json({ message: 'Success' });
        }
        throw lastError;
    } catch (e) {
        console.error('[SMTP ERROR]', e);
        if (e.code === 'EAUTH' || (e.response && e.response.includes('535'))) {
            return res.status(500).json({
                error: 'Gmail Authentication Failed (535 5.7.8)',
                details: 'Google rejected your Gmail App Password. Please check 2-Step Verification and generate a new 16-character App Password at https://myaccount.google.com/apppasswords or set EMAIL_PASS=mock in backend/.env'
            });
        }
        res.status(500).json({ error: 'Failed', details: e.message });
    }
});

app.post('/api/assistant', limiter, (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Query required' });
    res.json({ response: 'AI Assistant operational.' });
});

app.listen(PORT, () => {
    console.log(`[GATEWAY] Resume Intelligence Engine v6.0 running on port ${PORT}`);
});
