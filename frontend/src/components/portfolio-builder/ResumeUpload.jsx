import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload, FileText, Loader2, CheckCircle2, Sparkles,
    AlertCircle, Download, Eye, Palette, Wand2,
    Sun, Moon, Code, Briefcase, Brush, Layers,
    Globe, RefreshCw, Archive, Zap, MessageCircle, ChevronDown
} from 'lucide-react';
import JSZip from 'jszip';
import { generatePortfolioHTML } from '../../utils/exportGenerator';
import { PortfolioChatbot } from './PortfolioChatbot';
import { BACKEND_URL } from '../../utils/apiConfig';

// ─── Theme Configurations Grouped by Category ───────────────────────────────
const THEMES = [
    // General
    { id: 'minimal',      name: 'Minimalist',    category: 'general',   primary: '#64748b', secondary: '#475569', bg: '#ffffff', mode: 'light', desc: 'Clean layout focusing on typography.' },
    { id: 'neutral_clean',name: 'Neutral Clean', category: 'general',   primary: '#0284c7', secondary: '#0369a1', bg: '#f8fafc', mode: 'light', desc: 'Soft colors and warm layout.' },
    { id: 'monochrome',   name: 'Monochrome',    category: 'general',   primary: '#18181b', secondary: '#27272a', bg: '#ffffff', mode: 'light', desc: 'High-contrast black & white style.' },
    { id: 'custom',       name: 'Customizable',  category: 'general',   primary: '#ec4899', secondary: '#db2777', bg: '#faf5ff', mode: 'light', desc: 'Vibrant colors and creative vibes.' },

    // Tech Industry
    { id: 'saas',         name: 'Tech SaaS',     category: 'tech',      primary: '#6366f1', secondary: '#4f46e5', bg: '#030712', mode: 'dark',  desc: 'Gradient aesthetics for modern SaaS.' },
    { id: 'bento',        name: 'Bento Grid',    category: 'tech',      primary: '#7c3aed', secondary: '#6d28d9', bg: '#09090b', mode: 'dark',  desc: 'Modular tile grid presentation.' },
    { id: 'tech',         name: 'Raw Tech',      category: 'tech',      primary: '#22c55e', secondary: '#16a34a', bg: '#020617', mode: 'dark',  desc: 'Terminal and hacker-style console UI.' },
    { id: 'modern',       name: 'Modern Flex',   category: 'tech',      primary: '#8b5cf6', secondary: '#7c3aed', bg: '#0d0d1a', mode: 'dark',  desc: 'Dynamic layouts with vibrant glow.' },

    // Creative Industry
    { id: 'executive',    name: 'Executive',     category: 'creative',  primary: '#d4af37', secondary: '#b8960c', bg: '#0c0c0c', mode: 'dark',  desc: 'Elite gold gradients for directors.' },
    { id: 'sidebar',      name: 'Sidebar Layout',category: 'creative',  primary: '#d97706', secondary: '#b45309', bg: '#fef3c7', mode: 'light', desc: 'Side navigation panel presentation.' },
    { id: 'timeline',     name: 'Timeline',      category: 'creative',  primary: '#3b82f6', secondary: '#2563eb', bg: '#f0fdf4', mode: 'light', desc: 'Chronological milestone layout.' },
    { id: 'legend',       name: 'The Legend',    category: 'creative',  primary: '#ef4444', secondary: '#dc2626', bg: '#0f0505', mode: 'dark',  desc: 'Cinematic red with high-impact hero.' },

    // Corporate
    { id: 'professional', name: 'Elite Pro',     category: 'corporate', primary: '#2563eb', secondary: '#1d4ed8', bg: '#0f172a', mode: 'dark',  desc: 'Professional corporate structure.' },
    { id: 'corporate',    name: 'Corporate',     category: 'corporate', primary: '#475569', secondary: '#334155', bg: '#f8fafc', mode: 'light', desc: 'Formal and balanced standard.' },
    { id: 'dark_enterprise',name: 'Dark Shield', category: 'corporate', primary: '#10b981', secondary: '#059669', bg: '#0a1628', mode: 'dark',  desc: 'Emerald accents for security & operations.' },
];

const categoryIcons = {
    general: <Palette className="h-3.5 w-3.5" />,
    tech: <Code className="h-3.5 w-3.5" />,
    creative: <Brush className="h-3.5 w-3.5" />,
    corporate: <Briefcase className="h-3.5 w-3.5" />,
};

const categoryLabels = {
    general: 'General Themes',
    tech: 'Tech Industry',
    creative: 'Creative Industry',
    corporate: 'Corporate / Pro',
};

const STEPS = [
    { pct: 10,  label: 'Reading file contents...' },
    { pct: 30,  label: 'Uploading to AI parsing engine...' },
    { pct: 60,  label: 'Extracting semantic resume data...' },
    { pct: 85,  label: 'Generating portfolio showcase...' },
    { pct: 95,  label: 'Applying cinematic layout theme...' },
    { pct: 100, label: 'Portfolio ready!' },
];

const ResumeUpload = ({ onDataParsed }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState('');
    const [extracted, setExtracted] = useState(null);
    const [originalRes, setOriginalRes] = useState(null);
    const [selectedTheme, setSelectedTheme] = useState('professional');
    const [generatedHTML, setGeneratedHTML] = useState(null);
    const [error, setError] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const fileRef = useRef(null);
    const dropdownRef = useRef(null);

    // Close theme dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ── Simulate progress ───────────────────────────────────────────────────
    const runProgress = () => {
        let i = 0;
        const advance = () => {
            if (i >= STEPS.length - 1) return;
            i++;
            setProgress(STEPS[i].pct);
            setCurrentStep(STEPS[i].label);
            setTimeout(advance, 800 + Math.random() * 500);
        };
        setProgress(STEPS[0].pct);
        setCurrentStep(STEPS[0].label);
        setTimeout(advance, 500);
    };

    // ── Build HTML using exportGenerator ─────────────────────────────────────
    const buildHTML = (data, themeId) => {
        const skills = data.skills || {};
        // Build flat skills array: prefer backend's pre-built skillsFlat,
        // fallback to flattening the categorised object
        const skillsFlat =
            Array.isArray(data.skillsFlat) && data.skillsFlat.length > 0
                ? data.skillsFlat
                : Object.values(skills).flat().filter(Boolean);

        return generatePortfolioHTML({
            name:           data.name           || '',
            title:          data.title          || '',
            summary:        data.summary        || '',
            contact:        data.contact        || {},
            skills:         { ...skills },
            skillsFlat,                          // ← explicit flat list for galaxy canvas
            projects:       data.projects       || [],
            experience:     data.experience     || [],
            education:      data.education      || [],
            certifications: data.certifications || [],
            achievements:   data.achievements   || [],
            theme:          themeId,
        });
    };

    // ── Handle Theme Selection ───────────────────────────────────────────────
    const handleThemeChange = (themeId) => {
        setSelectedTheme(themeId);
        setIsDropdownOpen(false);
        if (extracted) {
            const html = buildHTML(extracted, themeId);
            setGeneratedHTML(html);
        }
    };

    // ── Handle File Upload / Processing ──────────────────────────────────────
    const handleFile = async (file) => {
        if (!file) return;

        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        if (!validTypes.includes(file.type) && !file.name.endsWith('.txt')) {
            setError('Please upload a PDF, DOCX, or TXT file.');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setError('File size must be under 10 MB.');
            return;
        }

        setIsProcessing(true);
        setError(null);
        setExtracted(null);
        setGeneratedHTML(null);
        setOriginalRes(null);
        runProgress();

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const analyzeEndpoint = BACKEND_URL ? `${BACKEND_URL}/api/analyze-resume` : '/api/analyze-resume';
            const res = await fetch(analyzeEndpoint, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Gateway server returned an error.');
            const result = await res.json();
            if (result.status !== 'success') throw new Error(result.error || 'Parsing failed.');

            const data = result.data;

            setProgress(100);
            setCurrentStep('Complete!');
            setExtracted(data);
            setOriginalRes(result);

            // Pre-select suggested theme or fallback
            const themeId = data.suggestedTheme || 'professional';
            setSelectedTheme(themeId);

            const html = buildHTML(data, themeId);
            setGeneratedHTML(html);

        } catch (err) {
            console.error(err);
            setError(err.message || 'Error parsing resume file. Try again.');
            setProgress(0);
            setCurrentStep('');
        } finally {
            setIsProcessing(false);
        }
    };

    // ── ZIP packaging (JSZip) ────────────────────────────────────────────────
    const downloadAsZip = async () => {
        if (!extracted || !generatedHTML) return;

        try {
            const zip = new JSZip();
            const activeTheme = THEMES.find(t => t.id === selectedTheme) || THEMES[0];

            // 1. main HTML page
            zip.file('index.html', generatedHTML);

            // 2. Custom formatted README
            const readme = `# ${extracted.name || 'Developer'}'s Portfolio

## Generated Portfolio Showcase Website

This offline-first, cinematic portfolio was automatically generated from your resume using AI.

## Presentation Theme Details
- **Active Theme**: ${activeTheme.name}
- **Presentation Category**: ${activeTheme.category.toUpperCase()}
- **Layout Mode**: ${activeTheme.mode}
- **Description**: ${activeTheme.desc}

## Structure
- \`index.html\` - The complete portfolio website (100% self-contained, offline compatible)
- \`portfolio-data.json\` - The structured data extracted by the AI engine
- \`README.md\` - Documentation and details

## How to Deploy
1. Simply double-click \`index.html\` to view it locally in any modern web browser.
2. To publish: Upload \`index.html\` to any static web hosting service (GitHub Pages, Vercel, Netlify, Surge, or Cloudflare Pages) for free!

## Customization
The portfolio is styled with semantic CSS variables for instant customization:
- Primary Color Accent: \`${activeTheme.primary}\`
- Secondary Accent: \`${activeTheme.secondary}\`
- Body Background Color: \`${activeTheme.bg}\`

## Structured Extract Stats
- **Name**: ${extracted.name || 'Developer'}
- **Title**: ${extracted.title || 'Professional'}
- **Extracted Skills**: ${extracted.skillsFlat?.length || 0}
- **Experience Records**: ${extracted.experience?.length || 0}
- **Academic Milestones**: ${extracted.education?.length || 0}
- **Project Showcases**: ${extracted.projects?.length || 0}

---
Generated with ❤️ by AI Portfolio Builder
`;
            zip.file('README.md', readme);

            // 3. Raw Data
            zip.file('portfolio-data.json', JSON.stringify(extracted, null, 2));

            // Generate ZIP Blob
            const content = await zip.generateAsync({ type: 'blob' });
            
            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${(extracted.name || 'portfolio').toLowerCase().replace(/\s+/g, '-')}-website.zip`;
            a.click();
            URL.revokeObjectURL(url);

        } catch (err) {
            console.error('Failed to create ZIP package:', err);
        }
    };

    const groupedThemes = THEMES.reduce((acc, theme) => {
        if (!acc[theme.category]) acc[theme.category] = [];
        acc[theme.category].push(theme);
        return acc;
    }, {});

    const skillsFlat = extracted?.skillsFlat || [];
    const activeThemeConfig = THEMES.find(t => t.id === selectedTheme) || THEMES[0];

    return (
        <div className="w-full max-w-3xl mx-auto space-y-6">

            {/* ── CARD COVER ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-[2.5rem] border-2 border-dashed border-primary/30
                           bg-gradient-to-br from-primary/5 via-accent/3 to-secondary/5 p-1 shadow-2xl"
            >
                <div className="rounded-[2.2rem] bg-background/95 backdrop-blur-xl p-8 space-y-6">
                    
                    {/* Card Header */}
                    <div className="flex items-center gap-4 pb-6 border-b border-primary/8">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <Wand2 className="h-6 w-6 text-accent animate-pulse" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-sm font-black uppercase tracking-wider text-primary">
                                    AI Auto-Generate Portfolio
                                </h3>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full
                                                 bg-accent/15 border border-accent/20 text-[8px] font-black uppercase tracking-widest text-accent">
                                    <Sparkles className="h-2.5 w-2.5" />
                                    15 Themes
                                </span>
                            </div>
                            <p className="text-[10px] font-bold text-primary/40 leading-relaxed mt-1">
                                Upload your resume and let AI parse, categorize, and construct a complete showcase portfolio.
                            </p>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {/* ── UPLOAD STATE (IDLE) ── */}
                        {!isProcessing && !extracted && (
                            <motion.div
                                key="idle-upload"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-6"
                            >
                                <div
                                    className={`flex flex-col items-center justify-center py-10 px-6 border-2 border-dashed rounded-[2rem] transition-all duration-300
                                               ${isDragging 
                                                   ? 'border-accent bg-accent/5 scale-[1.01]' 
                                                   : 'border-primary/10 bg-primary/3 hover:border-primary/20'}`}
                                    onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={e => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
                                >
                                    <Upload className="h-12 w-12 text-primary/40 mb-4 animate-bounce" style={{ animationDuration: '3s' }} />
                                    <p className="text-xs font-black text-primary/60 uppercase tracking-widest mb-1 text-center">
                                        Upload PDF, DOCX, or TXT resume
                                    </p>
                                    <p className="text-[8px] font-black text-primary/30 uppercase tracking-[0.2em] mb-6">
                                        Max size 10MB
                                    </p>

                                    <input
                                        ref={fileRef}
                                        type="file"
                                        accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                                        onChange={e => handleFile(e.target.files[0])}
                                        className="hidden"
                                    />
                                    
                                    {error && (
                                        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-2xl text-[9px] font-black uppercase tracking-widest text-red-500 mb-5">
                                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        onClick={() => fileRef.current?.click()}
                                        className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary text-background font-black text-[9px] uppercase tracking-[0.2em] hover:bg-accent transition-all duration-300 shadow-xl hover:shadow-accent/20 active:scale-95"
                                    >
                                        <FileText className="h-4 w-4" />
                                        Select Resume File
                                    </button>

                                    {/* Swatch Preview Grid */}
                                    <div className="mt-8 w-full border-t border-primary/6 pt-6">
                                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/30 text-center mb-4">
                                            Premium Preset Themes
                                        </p>
                                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                                            {THEMES.slice(0, 8).map((theme) => (
                                                <div
                                                    key={theme.id}
                                                    className="aspect-square rounded-xl overflow-hidden border border-primary/10 relative group"
                                                    title={`${theme.name} (${theme.category})`}
                                                >
                                                    <div 
                                                        className="absolute inset-0"
                                                        style={{ background: theme.bg }}
                                                    />
                                                    <div 
                                                        className="absolute inset-1.5 rounded-lg opacity-85"
                                                        style={{ 
                                                            background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                                                        }}
                                                    />
                                                    <div className="absolute bottom-0 left-0 right-0 p-0.5 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <p className="text-[6px] text-white text-center truncate font-bold uppercase tracking-widest">{theme.name}</p>
                                                    </div>
                                                    {theme.mode === 'light' ? (
                                                        <Sun className="absolute top-1 right-1 h-2.5 w-2.5 text-white/80" />
                                                    ) : (
                                                        <Moon className="absolute top-1 right-1 h-2.5 w-2.5 text-white/80" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ── PROCESSING STATE ── */}
                        {isProcessing && (
                            <motion.div
                                key="processing-bar"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4 py-8"
                            >
                                <div className="flex items-center justify-center gap-3">
                                    <Loader2 className="h-5 w-5 animate-spin text-accent" />
                                    <span className="text-xs font-black uppercase tracking-widest text-primary/60">{currentStep}</span>
                                </div>
                                <div className="w-full bg-primary/5 rounded-full h-2 overflow-hidden border border-primary/5">
                                    <motion.div 
                                        className="h-full rounded-full bg-gradient-to-r from-accent via-indigo-500 to-violet-500" 
                                        initial={{ width: '0%' }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                                <p className="text-center text-[9px] font-black text-primary/30 uppercase tracking-widest">
                                    {progress}% complete
                                </p>
                            </motion.div>
                        )}

                        {/* ── GENERATED PORTFOLIO SHOW ── */}
                        {!isProcessing && extracted && (
                            <motion.div
                                key="generated-show"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-2.5 text-emerald-500 border border-emerald-500/10 bg-emerald-500/5 px-4 py-3 rounded-2xl">
                                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Portfolio Generated Successfully!</span>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                    {[
                                        { label: 'Projects', val: (extracted.projects || []).length, icon: Layers },
                                        { label: 'Experience', val: (extracted.experience || []).length, icon: Briefcase },
                                        { label: 'Education', val: (extracted.education || []).length, icon: Wand2 },
                                        { label: 'Skills Flat', val: skillsFlat.length, icon: Zap }
                                    ].map((stat, sIdx) => (
                                        <div key={sIdx} className="bg-primary/4 border border-primary/6 p-4 rounded-2xl hover:border-accent/15 transition-all">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-primary/30 mb-1 flex items-center gap-1.5">
                                                <stat.icon className="h-3 w-3 text-accent" />
                                                {stat.label}
                                            </p>
                                            <p className="text-xl font-black text-primary">{stat.val}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Theme Selector Dropdown grouped by categories */}
                                <div className="space-y-2 relative" ref={dropdownRef}>
                                    <label className="text-[9px] font-black uppercase tracking-[0.25em] text-primary/40 flex items-center gap-2">
                                        <Palette className="h-3.5 w-3.5 text-accent" />
                                        Choose theme
                                    </label>
                                    
                                    {/* Styled Toggle Trigger */}
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="w-full flex items-center justify-between px-4 py-3 bg-primary/4 border border-primary/8 rounded-xl text-[10px] font-black uppercase tracking-wider text-primary/80 hover:border-primary/20 transition-all text-left"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div 
                                                className="w-3.5 h-3.5 rounded-full border border-primary/10"
                                                style={{ background: `linear-gradient(135deg, ${activeThemeConfig.primary}, ${activeThemeConfig.secondary})` }}
                                            />
                                            <span>{activeThemeConfig.name} ({categoryLabels[activeThemeConfig.category]})</span>
                                            {activeThemeConfig.mode === 'light' ? (
                                                <Sun className="h-3 w-3 text-primary/40" />
                                            ) : (
                                                <Moon className="h-3 w-3 text-primary/40" />
                                            )}
                                        </div>
                                        <ChevronDown className={`h-4 w-4 text-primary/40 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Options Container */}
                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -5 }}
                                                className="absolute left-0 right-0 z-50 mt-1 bg-slate-950 border border-primary/10 rounded-2xl p-2 max-h-[250px] overflow-y-auto shadow-2xl custom-scrollbar"
                                            >
                                                {Object.entries(groupedThemes).map(([category, themes]) => (
                                                    <div key={category} className="mb-2">
                                                        <div className="px-2 py-1.5 text-[8px] font-black uppercase tracking-[0.25em] text-primary/30 flex items-center gap-1.5 border-b border-primary/5 mb-1">
                                                            {categoryIcons[category]}
                                                            {categoryLabels[category]}
                                                        </div>
                                                        <div className="grid grid-cols-1 gap-1">
                                                            {themes.map((theme) => (
                                                                <button
                                                                    key={theme.id}
                                                                    onClick={() => handleThemeChange(theme.id)}
                                                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all text-left
                                                                               ${selectedTheme === theme.id 
                                                                                   ? 'bg-primary text-background' 
                                                                                   : 'text-primary/60 hover:text-primary hover:bg-primary/5'}`}
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <div 
                                                                            className="w-3 h-3 rounded-full border border-primary/10 shrink-0"
                                                                            style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                                                                        />
                                                                        <span>{theme.name}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 shrink-0">
                                                                        {theme.mode === 'light' ? (
                                                                            <Sun className="h-3 w-3 opacity-60" />
                                                                        ) : (
                                                                            <Moon className="h-3 w-3 opacity-60" />
                                                                        )}
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* iframe Preview Panel */}
                                <div className="border border-primary/10 rounded-[1.5rem] overflow-hidden shadow-sm bg-white">
                                    <div className="bg-primary/4 px-4 py-2.5 border-b border-primary/8 flex items-center justify-between">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-primary/50 flex items-center gap-1.5">
                                            <Eye className="h-3 w-3 text-accent" /> Theme Live Preview
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                                        </div>
                                    </div>
                                    <iframe
                                        srcDoc={generatedHTML || ''}
                                        className="w-full h-[280px] border-0"
                                        title="Showcase Preview"
                                        sandbox="allow-scripts allow-same-origin"
                                    />
                                </div>

                                {/* Chatbot description panel */}
                                <div className="bg-gradient-to-r from-accent/5 to-primary/5 rounded-[1.5rem] p-4 border border-accent/25">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <MessageCircle className="h-4.5 w-4.5 text-accent animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-wider text-primary">Ask My Portfolio</span>
                                    </div>
                                    <p className="text-[10px] font-medium text-primary/50 leading-relaxed">
                                        Try the interactive AI Chatbot below! It uses natural language lookup to instantly answer any questions regarding the details parsed from your resume.
                                    </p>
                                </div>

                                {/* Actions Panels */}
                                <div className="flex gap-3 flex-wrap">
                                    <button 
                                        onClick={downloadAsZip} 
                                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full bg-gradient-to-r from-accent to-indigo-500 text-background font-black text-[9px] uppercase tracking-[0.2em] hover:opacity-95 hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-accent/10"
                                    >
                                        <Download className="h-4 w-4" />
                                        Download as ZIP
                                    </button>
                                    
                                    <button
                                        onClick={() => {
                                            // Notify parent page and switch steps to builder
                                            onDataParsed(originalRes);
                                        }}
                                        className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-primary text-background border border-primary font-black text-[9px] uppercase tracking-[0.15em] hover:opacity-90 active:scale-95 transition-all"
                                    >
                                        <Wand2 className="h-4 w-4" />
                                        Advanced Editor →
                                    </button>

                                    <button 
                                        onClick={() => {
                                            setExtracted(null);
                                            setGeneratedHTML(null);
                                            setOriginalRes(null);
                                            setError(null);
                                            setProgress(0);
                                        }}
                                        className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-primary/5 border border-primary/10 text-primary/60 font-black text-[9px] uppercase tracking-[0.15em] hover:bg-primary/10 transition-all active:scale-95"
                                    >
                                        <RefreshCw className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '10s' }} />
                                        New
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </motion.div>

            {/* ── INTERACTIVE AI CHATBOT ── */}
            <AnimatePresence>
                {extracted && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                    >
                        <PortfolioChatbot
                            portfolioData={{
                                name: extracted.name,
                                title: extracted.title,
                                bio: extracted.summary || extracted.bio || '',
                                email: extracted.contact?.email || '',
                                phone: extracted.contact?.phone || '',
                                location: extracted.contact?.location || '',
                                github: extracted.contact?.github || '',
                                linkedin: extracted.contact?.linkedin || '',
                                website: extracted.contact?.portfolio || '',
                                skills: extracted.skills || {},
                                projects: extracted.projects || [],
                                experience: extracted.experience || [],
                                education: extracted.education || [],
                                certifications: extracted.certifications || [],
                                achievements: extracted.achievements || []
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── FEATURE HINTS (only on idle) ── */}
            <AnimatePresence>
                {!extracted && !isProcessing && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        {[
                            { icon: Sparkles,  title: 'AI Extraction',    desc: 'Uses real data from your resume — nothing fabricated.' },
                            { icon: Palette,   title: '15 Preset Themes',  desc: 'From minimal to cinematic — switch instantly.' },
                            { icon: Archive,   title: 'One-File Export',   desc: 'Self-contained HTML and ZIP files work anywhere.' },
                        ].map((h, i) => (
                            <div key={i}
                                className="bg-primary/3 p-6 rounded-[1.5rem] border border-primary/6
                                           hover:border-primary/15 transition-colors">
                                <h.icon className="w-5 h-5 text-accent mb-3 animate-pulse" />
                                <h3 className="text-[9px] font-black uppercase tracking-widest text-primary mb-1.5">{h.title}</h3>
                                <p className="text-[9px] font-bold text-primary/40 leading-relaxed">{h.desc}</p>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default ResumeUpload;
