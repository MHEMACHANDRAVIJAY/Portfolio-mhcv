import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import {
    Layout, Sparkles, Download, Eye, X, AlertCircle,
    ArrowLeft, Edit3, Wand2, ChevronRight, CheckCircle2,
    Layers
} from 'lucide-react';
import ResumeUpload from '../components/portfolio-builder/ResumeUpload';
import DataEditor from '../components/portfolio-builder/DataEditor';
import PortfolioPreview from '../components/portfolio-builder/PortfolioPreview';
import ThemeSelector from '../components/portfolio-builder/ThemeSelector';
import ExportPanel from '../components/portfolio-builder/ExportPanel';
import FullScreenPortfolio from '../components/portfolio-builder/FullScreenPortfolio';
import { calculateQualityScore, detectCareerCategory, generateStructuredSummary, smartProjectEnhancement } from '../utils/resumeAI';

// ─── Step Indicator ────────────────────────────────────────────────────────────
const StepPill = ({ num, label, active, done }) => (
    <div className={`flex items-center gap-2.5 px-4 py-2 rounded-full border transition-all duration-300
                     ${active
                         ? 'bg-accent text-background border-accent shadow-lg shadow-accent/20'
                         : done
                             ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                             : 'bg-primary/5 text-primary/30 border-primary/8'}`}>
        {done
            ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            : <span className={`w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center
                                ${active ? 'bg-background text-accent' : 'bg-primary/20 text-primary/40'}`}>
                {num}
              </span>}
        <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">{label}</span>
    </div>
);

const PortfolioBuilder = () => {
    const navigate = useNavigate();
    const { portfolioData, setPortfolioData } = usePortfolio();
    const [step,                setStep]                = useState('upload');   // upload | build
    const [selectedTheme,       setSelectedTheme]       = useState('professional');
    const [activeTab,           setActiveTab]           = useState('editor');   // editor | preview
    const [isExporting,         setIsExporting]         = useState(false);
    const [isLiveDemo,          setIsLiveDemo]          = useState(false);
    const [parsingConfidence,   setParsingConfidence]   = useState(0);
    const [validationWarnings,  setValidationWarnings]  = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('portfolio-builder-theme');
        if (saved) setSelectedTheme(saved);
    }, []);

    const handleThemeChange = (theme) => {
        setSelectedTheme(theme);
        localStorage.setItem('portfolio-builder-theme', theme);
    };

    const validateData = (data) => {
        const w = [];
        if (!data.name)                   w.push({ field: 'Identity',     msg: 'Full Name extraction incomplete.' });
        if (!data.contact?.email)         w.push({ field: 'Contact',      msg: 'Primary Email not found.' });
        if (!data.contact?.phone)         w.push({ field: 'Contact',      msg: 'Direct Phone number missing.' });
        if (!data.summary || data.summary.length < 50) w.push({ field: 'Impact', msg: 'Professional summary is too brief.' });
        const skillCount = Object.values(data.skills || {}).flat().length;
        if (skillCount < 10)              w.push({ field: 'Intelligence', msg: 'Technical skill density is low.' });
        return w;
    };

    const handleDataParsed = (response) => {
        if (!response?.data) return;
        const data        = response.data;
        const confidence  = data.confidence || 0;
        setParsingConfidence(confidence);

        const safeData = {
            name:    data.name    || '',
            title:   data.title   || '',
            contact: {
                email:    data.contact?.email    || '',
                phone:    data.contact?.phone    || '',
                location: data.contact?.location || '',
                linkedin: data.contact?.linkedin || '',
                github:   data.contact?.github   || '',
                website:  data.contact?.portfolio || '',
            },
            summary:  data.summary  || '',
            skills: {
                languages:  data.skills?.languages  || data.skills?.Programming || [],
                frameworks: data.skills?.frameworks || [...(data.skills?.Frontend || []), ...(data.skills?.Backend || [])],
                tools:      data.skills?.tools      || [...(data.skills?.Tools || []), ...(data.skills?.Analytics || [])],
                databases:  data.skills?.databases  || data.skills?.Database || [],
                cloud:      data.skills?.cloud      || data.skills?.Cloud    || [],
                soft:       data.skills?.soft       || data.skills?.Soft     || [],
            },
            experience:             data.experience             || [],
            education:              data.education              || [],
            projects:               data.projects               || [],
            certifications:         data.certifications         || [],
            achievements:           data.achievements           || [],
            achievementsStructured: data.achievementsStructured || { awards: [], researchPapers: [], presentations: [], scholarships: [], competitions: [] },
            confidenceDetails:      data.confidenceDetails      || { contact: 0, skills: 0, projects: 0, experience: 0, certifications: 0, overall: 0 },
        };

        setValidationWarnings(validateData(safeData));
        setPortfolioData(safeData);
        setStep('build');
    };

    const handleDataUpdate = (newData) => {
        setPortfolioData(newData);
        setValidationWarnings(validateData(newData));
    };

    const launchLiveDemo = () => {
        if (parsingConfidence < 85) {
            const go = window.confirm('Resume parsing confidence is low. Do you want to proceed to the Live Portfolio anyway?');
            if (!go) return;
        }
        const role            = detectCareerCategory(portfolioData);
        const structuredSummary = portfolioData.structuredSummary || generateStructuredSummary(portfolioData);
        const enhancedProjects  = (portfolioData.projects || []).map(p => p.problem ? p : smartProjectEnhancement(p));
        setPortfolioData({
            ...portfolioData,
            title:   portfolioData.title || role,
            summary: structuredSummary.executiveSummary + ' ' + structuredSummary.professionalBio,
            structuredSummary,
            projects: enhancedProjects,
        });
        setIsLiveDemo(true);
    };

    const qualityScore = portfolioData ? calculateQualityScore(portfolioData) : null;

    return (
        <div className="min-h-screen bg-background text-primary">

            {/* ── NAV ── */}
            <nav className="sticky top-0 z-50 border-b border-primary/6 bg-background/80 backdrop-blur-xl no-print">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">

                    {/* Logo + Steps */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                                <Layout className="w-4.5 h-4.5 text-background" />
                            </div>
                            <div>
                                <h1 className="text-[10px] font-black uppercase tracking-[0.35em] leading-none">
                                    Portfolio Builder
                                </h1>
                                <p className="text-[7px] font-bold text-primary/30 uppercase tracking-widest mt-0.5">
                                    V10 Elite Edition
                                </p>
                            </div>
                        </div>

                        {/* Step pills */}
                        <div className="hidden md:flex items-center gap-2">
                            <StepPill num="1" label="Upload Resume" active={step === 'upload'} done={step === 'build'} />
                            <ChevronRight className="w-3 h-3 text-primary/20 shrink-0" />
                            <StepPill num="2" label="Edit & Preview" active={step === 'build'} done={false} />
                        </div>
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-3">
                        {/* Mobile tab toggle */}
                        {step === 'build' && (
                            <div className="flex md:hidden bg-primary/5 p-1 rounded-xl border border-primary/8">
                                <button
                                    onClick={() => setActiveTab('editor')}
                                    className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all
                                                ${activeTab === 'editor' ? 'bg-primary text-background shadow' : 'text-primary/40'}`}
                                >
                                    <Edit3 className="w-3 h-3 inline mr-1" /> Edit
                                </button>
                                <button
                                    onClick={() => setActiveTab('preview')}
                                    className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all
                                                ${activeTab === 'preview' ? 'bg-primary text-background shadow' : 'text-primary/40'}`}
                                >
                                    <Eye className="w-3 h-3 inline mr-1" /> Preview
                                </button>
                            </div>
                        )}

                        {/* Quality badge */}
                        {qualityScore && (
                            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/8 rounded-xl">
                                <span className="text-[8px] font-black uppercase tracking-widest text-primary/40">Quality</span>
                                <span className="text-sm font-black text-accent">{qualityScore.score}</span>
                                <span className="text-[9px] font-black text-primary/30">/ 100</span>
                            </div>
                        )}

                        {/* Back button */}
                        <button
                            onClick={() => step === 'build' ? setStep('upload') : navigate('/')}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary/10
                                       text-primary/60 hover:text-primary hover:bg-primary/5
                                       text-[9px] font-black uppercase tracking-widest transition-all group"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                            {step === 'build' ? 'Back' : 'Exit'}
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── MAIN ── */}
            <main className="max-w-7xl mx-auto px-6 py-10">
                <AnimatePresence mode="wait">

                    {/* ── UPLOAD STEP ── centered card layout (like reference) */}
                    {step === 'upload' && (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            className="flex flex-col items-center"
                        >
                            {/* Hero headline */}
                            <div className="text-center mb-10 max-w-2xl">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                                                bg-accent/10 border border-accent/20 mb-6">
                                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-accent">
                                        AI-Powered • Instant Generation
                                    </span>
                                </div>
                                <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-primary mb-4 leading-tight">
                                    Build Your Portfolio<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">
                                        in Seconds
                                    </span>
                                </h2>
                                <p className="text-sm font-semibold text-primary/40 leading-relaxed">
                                    Upload your resume — our AI extracts everything and generates a premium, 
                                    cinematic portfolio with 15 high-end themes.
                                </p>
                            </div>

                            {/* The ResumeUpload card (now has full-featured UI) */}
                            <ResumeUpload onDataParsed={handleDataParsed} />
                        </motion.div>
                    )}

                    {/* ── BUILD STEP ── two-column editor + preview */}
                    {step === 'build' && (
                        <motion.div
                            key="build"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {/* Theme selector + action bar */}
                            <div className="flex flex-col lg:flex-row gap-6 items-end no-print">
                                <div className="flex-1 space-y-3">
                                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/30">
                                        Select Presentation Theme
                                    </p>
                                    <ThemeSelector currentTheme={selectedTheme} onThemeChange={handleThemeChange} />
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <button
                                        onClick={() => setIsExporting(true)}
                                        className="flex items-center gap-2.5 px-5 py-3 rounded-2xl
                                                   bg-primary/8 text-primary border border-primary/12
                                                   font-black text-[9px] uppercase tracking-[0.2em]
                                                   hover:bg-primary/15 transition-all active:scale-95"
                                    >
                                        <Download className="w-4 h-4" /> Export
                                    </button>
                                    <button
                                        onClick={launchLiveDemo}
                                        className="flex items-center gap-2.5 px-6 py-3 rounded-2xl
                                                   bg-gradient-to-r from-indigo-500 to-violet-500 text-white
                                                   font-black text-[9px] uppercase tracking-[0.2em]
                                                   hover:opacity-90 hover:scale-[1.02] active:scale-95
                                                   transition-all shadow-[0_12px_28px_-6px_rgba(99,102,241,0.4)]"
                                    >
                                        <Sparkles className="w-4 h-4" /> View Live Portfolio
                                    </button>
                                </div>
                            </div>

                            {/* Low confidence warning */}
                            <AnimatePresence>
                                {parsingConfidence > 0 && parsingConfidence < 85 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-start gap-4 p-6 rounded-[1.5rem]
                                                   bg-red-500/8 border border-red-500/20 no-print"
                                    >
                                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5 animate-pulse" />
                                        <div className="flex-1">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">
                                                Low parsing confidence ({parsingConfidence}%)
                                            </h4>
                                            <p className="text-[10px] font-bold text-primary/60 leading-relaxed mb-4">
                                                Please review and correct the detected data in the Context Editor before generating your portfolio.
                                            </p>
                                            {portfolioData?.confidenceDetails && (
                                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-red-500/15">
                                                    {Object.entries(portfolioData.confidenceDetails)
                                                        .filter(([k]) => k !== 'overall')
                                                        .map(([key, val]) => (
                                                            <div key={key}>
                                                                <p className="text-[8px] font-black uppercase tracking-widest text-primary/30 mb-0.5 capitalize">{key}</p>
                                                                <p className="text-sm font-black text-primary">{val}%</p>
                                                            </div>
                                                        ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Validation warnings */}
                            <AnimatePresence>
                                {validationWarnings.length > 0 && parsingConfidence >= 85 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 rounded-[1.5rem] bg-accent/5 border border-accent/15 no-print">
                                            <div className="flex items-center gap-3 mb-4">
                                                <AlertCircle className="w-4 h-4 text-accent" />
                                                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">
                                                    Quality Validation Warnings
                                                </h4>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {validationWarnings.map((w, i) => (
                                                    <div key={i}>
                                                        <p className="text-[8px] font-black uppercase tracking-widest text-accent/50 mb-0.5">{w.field}</p>
                                                        <p className="text-[10px] font-bold text-primary/70">{w.msg}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Editor + Preview grid */}
                            <div className="grid grid-cols-12 gap-8">
                                {/* Left: Data Editor */}
                                <div className={`col-span-12 lg:col-span-5 no-print ${activeTab === 'preview' ? 'hidden lg:block' : ''}`}>
                                    <DataEditor
                                        data={portfolioData}
                                        onUpdate={handleDataUpdate}
                                        confidence={parsingConfidence}
                                    />
                                </div>

                                {/* Right: Preview */}
                                <div className={`col-span-12 lg:col-span-7 print:col-span-12 ${activeTab === 'editor' ? 'hidden lg:block' : ''}`}>
                                    <div className="sticky top-28 print:static">
                                        {/* Preview header */}
                                        <div className="flex items-center justify-between mb-4 px-1 no-print">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                                <span className="text-[9px] font-black uppercase tracking-[0.35em] text-primary/60">
                                                    Real-Time Render
                                                </span>
                                            </div>
                                            <span className="text-[8px] font-black uppercase tracking-widest text-primary/20">
                                                Theme: {selectedTheme}
                                            </span>
                                        </div>

                                        {/* Browser-frame preview */}
                                        <div className="rounded-[2rem] border border-primary/8
                                                        shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)]
                                                        overflow-hidden bg-white print:rounded-none print:shadow-none">
                                            {/* Browser chrome */}
                                            <div className="bg-primary/5 border-b border-primary/6 px-4 py-3
                                                            flex items-center gap-3 no-print">
                                                <div className="flex gap-1.5">
                                                    <div className="w-3 h-3 rounded-full bg-red-400/70" />
                                                    <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                                                    <div className="w-3 h-3 rounded-full bg-green-400/70" />
                                                </div>
                                                <div className="flex-1 bg-primary/8 rounded-full px-3 py-1 text-[9px] font-mono text-primary/30">
                                                    {portfolioData?.name ? `${portfolioData.name.toLowerCase().replace(/\s+/g, '')}.dev` : 'portfolio.dev'}
                                                </div>
                                            </div>

                                            {/* Scroll area */}
                                            <div className="aspect-[3/4] overflow-y-auto custom-scrollbar print:aspect-auto print:overflow-visible">
                                                <PortfolioPreview data={portfolioData} theme={selectedTheme} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* ── EXPORT PANEL ── */}
            <AnimatePresence>
                {isExporting && (
                    <ExportPanel
                        data={portfolioData}
                        theme={selectedTheme}
                        onClose={() => setIsExporting(false)}
                    />
                )}
            </AnimatePresence>

            {/* ── LIVE DEMO FULL SCREEN ── */}
            <AnimatePresence>
                {isLiveDemo && (
                    <FullScreenPortfolio
                        data={portfolioData}
                        onClose={() => setIsLiveDemo(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default PortfolioBuilder;
