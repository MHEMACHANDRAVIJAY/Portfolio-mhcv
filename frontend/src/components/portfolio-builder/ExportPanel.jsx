import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, Code, Archive, X, CheckCircle, AlertCircle, Loader2, Shield, XCircle, ChevronRight } from 'lucide-react';
import { generatePortfolioHTML } from '../../utils/exportGenerator';
import { validateResume, calculateATSScore, getATSScoreColor } from '../../utils/resumeAI';

const ExportPanel = ({ data, theme, onClose }) => {
    const [exportingType, setExportingType] = useState(null);
    const [step, setStep]                   = useState('validate'); // 'validate' | 'export'

    // ── Run validation before showing export options ──────────
    const validation  = useMemo(() => validateResume(data),      [data]);
    const atsResult   = useMemo(() => calculateATSScore(data),   [data]);
    const atsColor    = getATSScoreColor(atsResult.score);
    const canExport   = validation.errors.length === 0;

    // ── Export actions (original, unchanged) ──────────────────
    const downloadJSON = () => {
        setExportingType('json');
        setTimeout(() => {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement('a');
            a.href     = url;
            a.download = `${(data.name || 'Resume').replace(/\s+/g, '_')}_Portfolio.json`;
            a.click();
            setExportingType(null);
        }, 1500);
    };

    const downloadHTML = () => {
        setExportingType('html');
        setTimeout(() => {
            const htmlContent = generatePortfolioHTML({ ...data, theme });
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement('a');
            a.href     = url;
            a.download = `${(data.name || 'Resume').replace(/\s+/g, '_')}_Portfolio.html`;
            a.click();
            setExportingType(null);
        }, 2000);
    };

    const downloadPDF = (type) => {
        setExportingType(type);
        // Generate full self-contained HTML and open it in a hidden popup then print
        const htmlContent = generatePortfolioHTML({ ...data, theme });
        const printWin = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes');
        printWin.document.write(htmlContent);
        printWin.document.close();
        printWin.focus();
        // Wait for fonts/styles to load then print
        setTimeout(() => {
            printWin.print();
            setExportingType(null);
        }, 1200);
    };

    const exportOptions = [
        { id: 'html',          label: 'Self-Contained HTML', desc: 'Dark-mode portfolio website — identical to Live Preview.', icon: Archive,  action: downloadHTML },
        { id: 'portfolio_pdf', label: 'Portfolio PDF',       desc: 'Prints the full dark-mode portfolio. Opens a preview first.', icon: Download, action: () => downloadPDF('portfolio_pdf') },
        { id: 'resume_pdf',    label: 'ATS Resume PDF',      desc: 'Optimized for recruitment systems.',                         icon: FileText, action: () => downloadPDF('resume_pdf') },
        { id: 'json',          label: 'JSON Data',           desc: 'Raw structured portfolio data.',                             icon: Code,     action: downloadJSON },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 no-print">
            {/* Backdrop */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-background/80 backdrop-blur-2xl" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-xl bg-primary text-background rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden"
            >
                {/* Header (original, unchanged) */}
                <div className="p-10 border-b border-background/10 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter">Export <span className="text-accent italic">Engine</span></h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mt-1">
                            {step === 'validate' ? 'Pre-export validation running...' : 'Select your production format'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-4 rounded-3xl bg-background/10 hover:bg-background/20 transition-all group">
                        <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {/* ── Step 1: Validation Report ──────────────── */}
                    {step === 'validate' && (
                        <motion.div key="validate" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-10 space-y-6">

                            {/* ATS Score Summary */}
                            <div className="p-6 rounded-[2rem] bg-background/5 border border-background/10">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[9px] font-black uppercase tracking-widest opacity-60">ATS Compatibility Score</span>
                                    <span className={`text-[10px] font-black uppercase tracking-widest text-accent`}>{atsResult.score}% — {atsColor.label}</span>
                                </div>
                                <div className="h-2 w-full bg-background/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-accent rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${atsResult.score}%` }}
                                        transition={{ duration: 1, delay: 0.2 }}
                                    />
                                </div>
                            </div>

                            {/* Errors */}
                            {validation.errors.length > 0 && (
                                <div className="space-y-3">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-red-400 flex items-center gap-2">
                                        <XCircle className="w-3.5 h-3.5" /> {validation.errors.length} Critical Error{validation.errors.length > 1 ? 's' : ''} — Must Fix Before Export
                                    </p>
                                    {validation.errors.map((e, i) => (
                                        <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                                            <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                                            <div>
                                                <span className="text-[8px] font-black uppercase tracking-widest text-red-400">{e.field}</span>
                                                <p className="text-[10px] font-bold opacity-70 mt-0.5">{e.msg}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Warnings */}
                            {validation.warnings.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-yellow-400 flex items-center gap-2">
                                        <AlertCircle className="w-3.5 h-3.5" /> {validation.warnings.length} Warning{validation.warnings.length > 1 ? 's' : ''} — Recommended to Fix
                                    </p>
                                    <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                                        {validation.warnings.map((w, i) => (
                                            <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-yellow-500/5 border border-yellow-500/10">
                                                <AlertCircle className="w-3 h-3 text-yellow-400 shrink-0 mt-0.5" />
                                                <p className="text-[9px] font-bold opacity-60">{w.field}: {w.msg}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* All clear */}
                            {validation.totalIssues === 0 && (
                                <div className="flex items-center gap-4 p-6 rounded-2xl bg-green-500/10 border border-green-500/20">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-green-400">All Checks Passed</p>
                                        <p className="text-[9px] opacity-50 mt-0.5">Resume is ready for production export.</p>
                                    </div>
                                </div>
                            )}

                            {/* Action buttons */}
                            <div className="flex gap-4 pt-2">
                                <button onClick={onClose} className="flex-1 py-4 rounded-[1.5rem] bg-background/10 text-[9px] font-black uppercase tracking-widest hover:bg-background/20 transition-all">
                                    Go Back &amp; Fix
                                </button>
                                <button
                                    onClick={() => setStep('export')}
                                    disabled={!canExport}
                                    className="flex-1 py-4 rounded-[1.5rem] bg-accent text-primary text-[9px] font-black uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {canExport ? 'Proceed to Export' : 'Fix Errors First'}
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ── Step 2: Export Options (original layout) ── */}
                    {step === 'export' && (
                        <motion.div key="export" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="p-10 space-y-4">
                                {exportOptions.map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={opt.action}
                                        disabled={exportingType !== null}
                                        className={`w-full group p-6 rounded-[2rem] bg-background/5 border border-background/5 hover:border-accent hover:bg-background/10 transition-all duration-500 flex items-center justify-between text-left ${exportingType && exportingType !== opt.id ? 'opacity-30' : ''}`}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="p-4 rounded-2xl bg-background/10 group-hover:bg-accent group-hover:text-primary transition-all duration-500">
                                                {exportingType === opt.id
                                                    ? <Loader2 className="w-6 h-6 animate-spin" />
                                                    : <opt.icon className="w-6 h-6" />
                                                }
                                            </div>
                                            <div>
                                                <h3 className="text-[11px] font-black uppercase tracking-widest">{opt.label}</h3>
                                                <p className="text-[9px] font-bold opacity-30 mt-1 group-hover:opacity-100 transition-opacity">{opt.desc}</p>
                                            </div>
                                        </div>
                                        <div className="px-5 py-2 rounded-xl bg-background/10 text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                            Generate
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="p-10 bg-background/5 border-t border-background/10 flex items-center gap-4">
                                <div className="p-2 bg-green-500/20 rounded-xl">
                                    <Shield size={16} className="text-green-500" />
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-40">
                                    Validation passed — ATS score {atsResult.score}% — {atsColor.label} grade output.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default ExportPanel;
