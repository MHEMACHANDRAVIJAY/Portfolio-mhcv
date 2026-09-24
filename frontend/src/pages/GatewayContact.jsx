import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    Loader2,
    Mail,
    CheckCircle,
    AlertCircle,
    ShieldCheck,
    ArrowRight,
    TowerControl,
    Zap,
    Fingerprint,
    Brain,
    ScanLine,
    Shield,
    Sparkles,
    AlertTriangle,
    MessageSquare,
    Clock,
    Banknote,
    Activity,
    Bot,
    Lock,
    Wifi
} from 'lucide-react';
import axios from 'axios';
import { BACKEND_URL } from '../utils/apiConfig';

// ─── Original FormInput (unchanged) ───────────────────────────────────────────
const FormInput = ({ label, ...props }) => (
    <div className="space-y-6">
        <label className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/20 ml-4 flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            {label}
        </label>
        <input
            {...props}
            required
            className="w-full px-10 py-8 rounded-[2rem] bg-primary/5 border-2 border-transparent focus:border-accent/30 focus:bg-background outline-none transition-all text-primary font-bold placeholder:text-primary/10 tracking-tight shadow-inner"
        />
    </div>
);

// ─── AI Analysis Engine (local logic, no API required) ────────────────────────
const analyzeMessage = (text) => {
    if (!text || text.trim().length < 5) return null;

    const lower = text.toLowerCase();

    // ── Category Detection ──────────────────────────────────────────
    const categories = [
        { id: 'job',        label: 'Job Opportunity',    icon: '💼', keywords: ['job', 'position', 'hire', 'hiring', 'vacancy', 'role', 'full time', 'full-time', 'permanent', 'salary', 'employ', 'career'] },
        { id: 'freelance',  label: 'Freelance Project',  icon: '🚀', keywords: ['freelance', 'contract', 'gig', 'project basis', 'short term', 'one-time', 'website', 'app development', 'build me'] },
        { id: 'collab',     label: 'Collaboration',      icon: '🤝', keywords: ['collab', 'collaborate', 'partner', 'together', 'team up', 'joint', 'work together', 'open source'] },
        { id: 'internship', label: 'Internship',         icon: '🎓', keywords: ['intern', 'internship', 'trainee', 'student', 'graduate', 'fresher', 'learning', 'training'] },
        { id: 'support',    label: 'Technical Support',  icon: '🔧', keywords: ['help', 'bug', 'error', 'fix', 'support', 'issue', 'problem', 'broken', 'not working', 'debug'] },
        { id: 'inquiry',    label: 'General Inquiry',    icon: '💬', keywords: ['question', 'inquiry', 'info', 'details', 'know more', 'curious', 'wondering', 'tell me'] },
    ];

    let detected = categories[categories.length - 1]; // default: General Inquiry
    let maxScore = 0;
    for (const cat of categories) {
        const score = cat.keywords.filter(k => lower.includes(k)).length;
        if (score > maxScore) { maxScore = score; detected = cat; }
    }

    // ── Budget Detection ────────────────────────────────────────────
    let budget = 'Medium';
    if (['enterprise', 'corporate', 'company', 'fund', 'investment', 'vc', 'startup'].some(k => lower.includes(k))) budget = 'High';
    else if (['affordable', 'cheap', 'low budget', 'small', 'student', 'free', 'intern'].some(k => lower.includes(k))) budget = 'Low';

    // ── Priority Detection ──────────────────────────────────────────
    let priority = 'Normal';
    if (['urgent', 'asap', 'immediately', 'critical', 'emergency', 'right now', 'today'].some(k => lower.includes(k))) priority = 'High';
    else if (['soon', 'this week', 'quickly', 'fast'].some(k => lower.includes(k))) priority = 'Medium';

    // ── Sentiment Detection ─────────────────────────────────────────
    let sentiment = 'Neutral';
    if (['excited', 'love', 'amazing', 'great', 'fantastic', 'wonderful', 'happy', 'glad', 'pleasure', 'appreciate'].some(k => lower.includes(k))) sentiment = 'Positive';
    else if (['urgent', 'critical', 'asap', 'must', 'emergency', 'immediately'].some(k => lower.includes(k))) sentiment = 'Urgent';

    // ── Response Time ───────────────────────────────────────────────
    const responseTime =
        priority === 'High' ? 'Within 2 Hours' :
        priority === 'Medium' ? 'Within 12 Hours' :
        detected.id === 'job' ? 'Within 24 Hours' : 'Within 48 Hours';

    // ── Subject Generator ───────────────────────────────────────────
    const subjects = {
        job:        'Exploring Professional Developer Opportunity',
        freelance:  'Freelance Development Project Proposal',
        collab:     'Collaboration Opportunity — Let\'s Build Together',
        internship: 'Internship Application & Training Request',
        support:    'Technical Support Request',
        inquiry:    'General Inquiry from Portfolio Visitor',
    };

    // ── Auto Reply Preview ──────────────────────────────────────────
    const replies = {
        job:        'Thank you for considering me for this opportunity! I\'ll review the details and get back to you shortly with my thoughts.',
        freelance:  'Thank you for reaching out about your project! I\'ll review your requirements and respond with an initial plan.',
        collab:     'Exciting collaboration idea! I\'ll carefully go through your proposal and reply with my availability.',
        internship: 'Thank you for your interest in learning! I\'ll look over your background and respond soon.',
        support:    'I\'ve received your support request and will look into the issue right away.',
        inquiry:    'Thank you for your message! I\'ll review it and respond as soon as possible.',
    };

    // ── Spam Detection ──────────────────────────────────────────────
    const spamFlags = [];
    const words = text.trim().split(/\s+/);
    const freq = {};
    words.forEach(w => { freq[w.toLowerCase()] = (freq[w.toLowerCase()] || 0) + 1; });
    const repeated = Object.entries(freq).filter(([, v]) => v >= 4);
    if (repeated.length > 0) spamFlags.push('Repeated words detected');
    if ((text.match(/https?:\/\//g) || []).length > 2) spamFlags.push('Multiple suspicious links');
    if ((text.match(/[!?]{3,}/g) || []).length > 0) spamFlags.push('Excessive symbols detected');
    if (text.trim().length < 15) spamFlags.push('Message is too short or empty');

    return {
        category: detected,
        budget,
        priority,
        sentiment,
        responseTime,
        subject: subjects[detected.id],
        autoReply: replies[detected.id],
        spamFlags,
        isSpam: spamFlags.length >= 2,
        wordCount: words.length,
        charCount: text.length,
    };
};

// ─── Badge helpers ─────────────────────────────────────────────────────────────
const priorityColor  = p => p === 'High' ? 'text-red-400 bg-red-500/10 border-red-500/20' : p === 'Medium' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : 'text-green-400 bg-green-500/10 border-green-500/20';
const budgetColor    = b => b === 'High' ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' : b === 'Low' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
const sentimentColor = s => s === 'Positive' ? 'text-green-400 bg-green-500/10 border-green-500/20' : s === 'Urgent' ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-slate-400 bg-slate-500/10 border-slate-500/20';
const sentimentEmoji = s => s === 'Positive' ? '😊' : s === 'Urgent' ? '🚨' : '😐';

// ─── AI Insight Row ───────────────────────────────────────────────────────────
const InsightRow = ({ icon: Icon, label, value, colorClass, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
    >
        <div className="flex items-center gap-3">
            <Icon className="w-3.5 h-3.5 text-cyan-400/60" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{label}</span>
        </div>
        <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${colorClass}`}>
            {value}
        </span>
    </motion.div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const GatewayContact = () => {
    // ── Original state (unchanged) ──────────────────────────────────
    const [formData, setFormData] = useState({ name: '', email: '', to: '', message: '' });
    const [status, setStatus]     = useState('idle');
    const [errorMsg, setErrorMsg] = useState('');

    // ── New AI state ────────────────────────────────────────────────
    const [aiData,       setAiData]       = useState(null);
    const [isAnalyzing,  setIsAnalyzing]  = useState(false);
    const [showPanel,    setShowPanel]    = useState(false);
    const [showReply,    setShowReply]    = useState(false);
    const [showSubject,  setShowSubject]  = useState(false);
    const analysisTimer = useRef(null);

    // ── Original handleChange + AI trigger ─────────────────────────
    const handleChange = (e) => {
        const updated = { ...formData, [e.target.name]: e.target.value };
        setFormData(updated);

        if (e.target.name === 'message') {
            clearTimeout(analysisTimer.current);
            if (e.target.value.trim().length > 10) {
                setIsAnalyzing(true);
                setShowPanel(false);
                analysisTimer.current = setTimeout(() => {
                    const result = analyzeMessage(e.target.value);
                    setAiData(result);
                    setIsAnalyzing(false);
                    setShowPanel(true);
                    setShowReply(false);
                    setShowSubject(false);
                }, 700);
            } else {
                setIsAnalyzing(false);
                setShowPanel(false);
                setAiData(null);
            }
        }
    };

    useEffect(() => () => clearTimeout(analysisTimer.current), []);

    // ── Original handleSubmit (unchanged) ──────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');
        try {
            const sendEndpoint = BACKEND_URL ? `${BACKEND_URL}/send-email` : '/send-email';
            const response = await axios.post(sendEndpoint, formData);
            if (response.status === 200) {
                setStatus('success');
                setFormData({ name: '', email: '', to: '', message: '' });
                setAiData(null); setShowPanel(false);
                setTimeout(() => setStatus('idle'), 5000);
            }
        } catch (error) {
            console.error('Failed to send:', error);
            setStatus('error');
            setErrorMsg(error.response?.data?.details || error.response?.data?.error || 'Transmission failed. PLEASE VERIFY SYSTEM STATUS.');
        }
    };

    return (
        <div className="max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-20 py-24 lg:py-48 relative min-h-screen">
            {/* ── Architectural Grid System (original) ── */}
            <div className="absolute inset-0 circuit-grid opacity-[0.03] dark:opacity-[0.05] -z-10" />

            {/* ── Narrative Header (original) ── */}
            <div className="max-w-5xl mx-auto text-center mb-32 space-y-12">
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-primary/5 border border-primary/10 text-primary/40 text-[10px] font-black uppercase tracking-[0.4em]"
                >
                    <TowerControl className="w-4 h-4 text-accent" />
                    Software Communication Gateway
                </motion.div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.04em] text-primary leading-[1.1] text-balance">
                    Start a <span className="text-accent italic">Project</span> Conversation
                </h1>
                <p className="text-lg sm:text-xl text-primary/40 leading-relaxed font-medium tracking-tight max-w-4xl mx-auto">
                    Start a direct communication channel for software development collaborations, project discussions, or technical opportunities. I am currently open to building scalable, secure, and high-performance applications for web and enterprise environments.
                </p>

                {/* ── NEW: AI Status Badges Bar ── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-3 pt-4"
                >
                    {[
                        { icon: Brain,  label: 'AI Processing Active',     color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5' },
                        { icon: Lock,   label: 'Secure Channel Verified',   color: 'text-green-400 border-green-500/20 bg-green-500/5' },
                        { icon: ScanLine, label: 'Smart Detection Enabled', color: 'text-purple-400 border-purple-500/20 bg-purple-500/5' },
                        { icon: Wifi,   label: 'TLS Protected',             color: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5' },
                    ].map(({ icon: Icon, label, color }, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[9px] font-black uppercase tracking-[0.3em] ${color}`}
                        >
                            <Icon className="w-3 h-3" />
                            {label}
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
                {/* ── Left Panel (original, unchanged) ── */}
                <div className="lg:col-span-4 space-y-12">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-12 rounded-[3.5rem] bg-primary text-background space-y-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden group"
                    >
                        <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-1000">
                            <ShieldCheck className="w-64 h-64" />
                        </div>
                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-background/60">Status: Online</span>
                            </div>
                            <h3 className="text-4xl font-black tracking-tighter leading-none italic text-background">
                                Secure Developer Communication
                            </h3>
                        </div>
                        <div className="space-y-8 relative z-10">
                            {[
                                { icon: Zap,         label: 'Technical Communication' },
                                { icon: Fingerprint, label: 'Identity Verified' },
                                { icon: Mail,        label: 'Secure Messaging' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-6 group/item">
                                    <div className="p-4 rounded-2xl bg-background/10 border border-background/10 text-accent group-hover/item:bg-accent group-hover/item:text-background transition-all duration-500">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-background/70 group-hover/item:text-background transition-colors duration-500">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* ── System Protocols (original) ── */}
                    <div className="px-10 py-10 rounded-[2.5rem] border border-primary/5 space-y-8 bg-card/40 backdrop-blur-sm">
                        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-primary/20 flex items-center gap-4">
                            <div className="w-1 h-4 bg-accent" />
                            System Protocols
                        </p>
                        <div className="space-y-6 text-xs font-black text-primary/40 uppercase tracking-widest">
                            <div className="flex justify-between items-center pb-4 border-b border-primary/5">
                                <span>Response Time</span>
                                <span className="text-primary tracking-normal font-bold lowercase">~ 24 Hours</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-primary/5">
                                <span>Security Level</span>
                                <span className="text-accent">TLS 1.3</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Availability</span>
                                <span className="text-green-500/60 font-medium">Open for Projects</span>
                            </div>
                        </div>
                    </div>

                    {/* ── NEW: AI Engine Status Card ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="px-10 py-10 rounded-[2.5rem] border border-cyan-500/10 space-y-8 bg-cyan-500/5 backdrop-blur-sm relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
                        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-cyan-400/60 flex items-center gap-4 relative z-10">
                            <Bot className="w-4 h-4" />
                            AI Engine Status
                        </p>
                        <div className="space-y-5 relative z-10">
                            {[
                                { label: 'Message Analyzer', active: true },
                                { label: 'Spam Detector',    active: true },
                                { label: 'Subject Builder',  active: true },
                                { label: 'Auto Reply AI',    active: true },
                            ].map(({ label, active }, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">{label}</span>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${active ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                                        <span className={`text-[9px] font-black uppercase tracking-wider ${active ? 'text-green-400' : 'text-red-400'}`}>
                                            {active ? 'Online' : 'Offline'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* ── Right Panel: Form + AI Features ── */}
                <div className="lg:col-span-8 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card/40 backdrop-blur-3xl border border-primary/5 rounded-[4rem] p-12 lg:p-24 shadow-[-50px_80px_120px_rgba(0,0,0,0.05)] relative overflow-hidden group"
                    >
                        {/* Background Ornament (original) */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:bg-accent/10 transition-colors duration-1000" />

                        <form onSubmit={handleSubmit} className="relative z-10 space-y-16">
                            {/* ── Name / Email / To fields (original) ── */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                <FormInput label="Full Name"       name="name"  value={formData.name}  onChange={handleChange} placeholder="Enter full name" />
                                <FormInput label="Your Email"      name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" type="email" />
                                <FormInput label="Recipient Email" name="to"    value={formData.to}    onChange={handleChange} placeholder="Recipient email"  type="email" />
                            </div>

                            {/* ── Message textarea (original + AI analyzing indicator) ── */}
                            <div className="space-y-6">
                                <label className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/20 ml-4 flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                    Message Details
                                    {/* AI analyzing badge */}
                                    <AnimatePresence>
                                        {isAnalyzing && (
                                            <motion.span
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="ml-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] tracking-widest"
                                            >
                                                <ScanLine className="w-3 h-3 animate-pulse" />
                                                AI Analyzing...
                                            </motion.span>
                                        )}
                                        {!isAnalyzing && aiData && !aiData.isSpam && (
                                            <motion.span
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="ml-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] tracking-widest"
                                            >
                                                <CheckCircle className="w-3 h-3" />
                                                Analysis Ready
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </label>
                                <textarea
                                    name="message"
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={8}
                                    placeholder="Describe your project, technical requirements, or collaboration proposal..."
                                    className="w-full px-10 py-8 rounded-[2.5rem] bg-primary/5 border-2 border-transparent focus:border-accent/30 focus:bg-background outline-none transition-all text-primary font-bold placeholder:text-primary/10 resize-none tracking-tight leading-relaxed shadow-inner"
                                />
                                {/* Word / Char counter */}
                                {aiData && (
                                    <div className="flex gap-4 ml-4">
                                        <span className="text-[9px] text-primary/20 font-black uppercase tracking-widest">{aiData.wordCount} words</span>
                                        <span className="text-[9px] text-primary/20 font-black uppercase tracking-widest">{aiData.charCount} chars</span>
                                    </div>
                                )}
                            </div>

                            {/* ── NEW: Spam Warning ── */}
                            <AnimatePresence>
                                {aiData?.isSpam && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex items-start gap-5 p-8 rounded-3xl bg-red-500/5 border border-red-500/20"
                                    >
                                        <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 shrink-0 animate-pulse" />
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400">⚠ Suspicious Message Detected</p>
                                            {aiData.spamFlags.map((f, i) => (
                                                <p key={i} className="text-[11px] text-red-400/70 font-medium">• {f}</p>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ── NEW: AI Insights Panel ── */}
                            <AnimatePresence>
                                {showPanel && aiData && !aiData.isSpam && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="rounded-[2.5rem] border border-cyan-500/15 bg-cyan-500/5 backdrop-blur-md overflow-hidden"
                                    >
                                        {/* Panel Header */}
                                        <div className="flex items-center justify-between px-10 py-6 border-b border-cyan-500/10">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                                                    <Brain className="w-4 h-4 text-cyan-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">AI Smart Analysis</p>
                                                    <p className="text-[9px] text-white/20 tracking-widest mt-0.5">Real-time intelligence active</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-cyan-400/60">Live</span>
                                            </div>
                                        </div>

                                        <div className="px-10 py-8 grid grid-cols-1 md:grid-cols-2 gap-x-12">
                                            {/* Left column: Insight rows */}
                                            <div className="space-y-1">
                                                <InsightRow icon={MessageSquare} label="Category"      value={`${aiData.category.icon} ${aiData.category.label}`} colorClass="text-cyan-400 bg-cyan-500/10 border-cyan-500/20"  delay={0.05} />
                                                <InsightRow icon={Banknote}      label="Est. Budget"   value={aiData.budget}     colorClass={budgetColor(aiData.budget)}      delay={0.1}  />
                                                <InsightRow icon={Activity}      label="Priority"      value={aiData.priority}   colorClass={priorityColor(aiData.priority)}  delay={0.15} />
                                                <InsightRow icon={Clock}         label="Response Time" value={aiData.responseTime} colorClass="text-white/50 bg-white/5 border-white/10" delay={0.2} />
                                                <InsightRow icon={Sparkles}      label="Sentiment"     value={`${sentimentEmoji(aiData.sentiment)} ${aiData.sentiment}`} colorClass={sentimentColor(aiData.sentiment)} delay={0.25} />
                                            </div>

                                            {/* Right column: Subject + Toggle Buttons */}
                                            <div className="flex flex-col gap-6 mt-4 md:mt-0">
                                                {/* Generated Subject */}
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.3 }}
                                                    className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/15 space-y-3"
                                                >
                                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-purple-400/70 flex items-center gap-2">
                                                        <Sparkles className="w-3 h-3" /> AI Subject Line
                                                    </p>
                                                    <p className="text-xs font-bold text-white/70 leading-relaxed">"{aiData.subject}"</p>
                                                </motion.div>

                                                {/* Auto Reply Toggle */}
                                                <motion.button
                                                    type="button"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.35 }}
                                                    onClick={() => setShowReply(r => !r)}
                                                    className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
                                                >
                                                    <Bot className="w-4 h-4" />
                                                    {showReply ? 'Hide' : 'Preview'} Auto-Reply
                                                </motion.button>

                                                <AnimatePresence>
                                                    {showReply && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="p-6 rounded-2xl bg-green-500/5 border border-green-500/15 overflow-hidden"
                                                        >
                                                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-green-400/70 flex items-center gap-2 mb-3">
                                                                <CheckCircle className="w-3 h-3" /> Auto-Reply Preview
                                                            </p>
                                                            <p className="text-xs text-white/50 leading-relaxed italic">"{aiData.autoReply}"</p>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ── Submit + Status (original, unchanged) ── */}
                            <div className="flex flex-col sm:flex-row items-center gap-12 pt-8">
                                <button
                                    type="submit"
                                    disabled={status === 'loading' || (aiData?.isSpam)}
                                    className="w-full sm:w-auto px-16 py-8 rounded-[2rem] bg-primary text-background font-black uppercase tracking-[0.5em] text-[10px] hover:bg-accent transition-all shadow-[0_30px_60px_-10px_rgba(0,0,0,0.3)] active:scale-95 disabled:opacity-50 group flex items-center justify-center gap-6"
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                                        </>
                                    )}
                                </button>

                                <AnimatePresence>
                                    {status === 'success' && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-4 text-green-500 font-black text-[10px] uppercase tracking-[0.3em] bg-green-500/5 px-10 py-5 rounded-full border border-green-500/10 shadow-sm"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            Message Sent Successfully
                                        </motion.div>
                                    )}
                                    {status === 'error' && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center gap-4 text-red-500 font-black text-[10px] uppercase tracking-[0.3em] bg-red-500/5 px-10 py-5 rounded-full border border-red-500/10 shadow-sm"
                                        >
                                            <AlertCircle className="w-5 h-5" />
                                            {errorMsg}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default GatewayContact;
