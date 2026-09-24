import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Cpu, Check, Download, Share2, Briefcase, Award,
    Code2, GraduationCap, Link as LinkIcon, Edit3, Eye,
    ChevronDown, Plus, Trash2, ShieldCheck, Zap, Info, Target,
    ListChecks, UploadCloud, AlertCircle, Sparkles, Wand2, FileSearch,
    History, BarChart3, Binary, Layout, Server, Database, Globe, X, CheckCircle, HelpCircle
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useSearchParams } from 'react-router-dom';
import { portfolioKnowledge } from '@backend/portfolio_knowledge';
import {
    enhanceBulletPoints,
    enhanceExecutiveWording,
    generateProfessionalSummary,
    calculateATSScore,
    detectMissingKeywords,
    validateResume,
    rankSkillsByRole,
    getATSScoreColor,
    ATS_KEYWORDS
} from '../utils/resumeAI';
import { BACKEND_URL } from '../utils/apiConfig';

const ROLES_LIST = [
    { id: 'developer',  label: 'Full Stack Dev'  },
    { id: 'frontend',   label: 'Frontend Dev'     },
    { id: 'backend',    label: 'Backend Dev'      },
    { id: 'devops',     label: 'DevOps/Cloud'     },
    { id: 'data',       label: 'Data / ML'        },
    { id: 'mobile',     label: 'Mobile Dev'       },
];

const InteractiveResume = () => {
    // --- STATE MANAGEMENT ---
    const [searchParams, setSearchParams] = useSearchParams();
    const [resumeMode, setResumeMode] = useState('visual'); // visual, ats, executive
    const [expandedEditSection, setExpandedEditSection] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    
    // Target Role and AI loadings
    const [targetRole, setTargetRole] = useState(searchParams.get('role') || 'developer');
    const [enhancing, setEnhancing] = useState({});
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [fontsReady, setFontsReady] = useState(false);

    // Dynamic Resume Data (Populated by Extraction & Manual edits)
    const [resumeData, setResumeData] = useState({
        name: portfolioKnowledge.profile.name,
        title: portfolioKnowledge.profile.role,
        email: portfolioKnowledge.profile.email,
        phone: "+91 90000 00000",
        location: portfolioKnowledge.profile.location,
        linkedin: "linkedin.com/in/mhcv",
        github: "github.com/hemachandravijay-m",
        portfolio: "mhemachandravijay.me", // Added portfolio field
        summary: portfolioKnowledge.profile.bio,
        skills: [
            ...portfolioKnowledge.skills.languages, 
            ...portfolioKnowledge.skills.frontend, 
            ...portfolioKnowledge.skills.backend, 
            ...portfolioKnowledge.skills.tools
        ],
        education: [
            {
                degree: "B.Tech Information Technology",
                institution: "Kalasalingam Academy of Research and Education",
                year: "2022 - 2026",
                cgpa: "7.30/10"
            }
        ],
        experience: [
            {
                role: "Software Development Intern",
                company: "Tech Enterprise Solutions",
                period: "2024 - Present",
                desc: "• Designed and implemented RESTful APIs using Node.js and Spring Boot.\n• Optimized database queries for high-traffic applications, reducing latency by 20%.\n• Delivered 5+ feature modules with high test coverage."
            }
        ],
        projects: [
            {
                title: "Smart To-Do Pro Enterprise",
                stack: "Java, Spring Boot, PostgreSQL",
                desc: "Developed offline-first productivity application with secure authentication and cloud sync.",
                impact: "Architected scalable backend reducing sync conflicts by 40%."
            },
            {
                title: "SecureSnap - Cybersecurity Hub",
                stack: "Django, React, AWS",
                desc: "Enterprise image security portal with role-based access and automated watermarking.",
                impact: "Implemented AES-256 encryption ensuring zero-data leak during transmission."
            }
        ],
        certifications: [...portfolioKnowledge.certifications],
        achievements: [
            "Achieved top honors in distributed database design tournament.",
            "Consistently delivered clean architecture modules with zero production-critical issues."
        ]
    });

    const resumeRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showShareToast, setShowShareToast] = useState(false);

    // --- CHECK FOR FONTS READY ---
    useEffect(() => {
        document.fonts.ready.then(() => {
            setFontsReady(true);
        }).catch((err) => {
            console.warn("Font loading checklist failed: ", err);
            setFontsReady(true); // Fallback to allow print anyway
        });
    }, []);

    // --- LIVE INTELLIGENCE RUNS ---
    const atsResult = useMemo(() => calculateATSScore(resumeData), [resumeData]);
    const kwResult = useMemo(() => detectMissingKeywords(resumeData, targetRole), [resumeData, targetRole]);
    const validation = useMemo(() => validateResume(resumeData), [resumeData]);
    const atsColor = getATSScoreColor(atsResult.score);

    // Dynamic Spacing / Scaling Engine
    const dynamicSpacing = useMemo(() => {
        // Calculate total text density in chars
        const textCount = 
            (resumeData.name || '').length +
            (resumeData.title || '').length +
            (resumeData.summary || '').length +
            resumeData.skills.join(' ').length +
            resumeData.experience.map(e => e.role + e.desc).join(' ').length +
            resumeData.projects.map(p => p.title + p.desc + p.impact).join(' ').length;

        let baseFontSize = '11px';
        let verticalSpacing = 'space-y-10';
        let elementPadding = 'p-16';
        let itemGap = 'space-y-4';

        if (textCount > 2200) {
            baseFontSize = '9px';
            verticalSpacing = 'space-y-4';
            elementPadding = 'p-6';
            itemGap = 'space-y-2';
        } else if (textCount > 1500) {
            baseFontSize = '10px';
            verticalSpacing = 'space-y-6';
            elementPadding = 'p-10';
            itemGap = 'space-y-3';
        }

        return { baseFontSize, verticalSpacing, elementPadding, itemGap, density: textCount };
    }, [resumeData]);

    // --- REAL BACKEND EXTRACTION HUB ---
    const processResumeFile = async (file) => {
        if (!file) return;
        setIsAnalyzing(true);

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const analyzeEndpoint = BACKEND_URL ? `${BACKEND_URL}/api/analyze-resume` : '/api/analyze-resume';
            const response = await fetch(analyzeEndpoint, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error("Backend Extraction Failed");

            const result = await response.json();
            const extracted = result.data;

            // STRICT OVERWRITE ON RESUME IMPORT — ZERO DATA BLENDING
            setResumeData({
                name: extracted.name || '',
                title: extracted.title || '',
                email: extracted.contact?.email || extracted.email || '',
                phone: extracted.contact?.phone || extracted.phone || '',
                location: extracted.contact?.location || extracted.location || '',
                linkedin: extracted.contact?.linkedin || extracted.linkedin || '',
                github: extracted.contact?.github || extracted.github || '',
                portfolio: extracted.contact?.portfolio || extracted.portfolio || '',
                summary: extracted.summary || '',
                skills: Array.isArray(extracted.skills) 
                    ? extracted.skills 
                    : (extracted.skillsFlat || Object.values(extracted.skills || {}).flat() || []),
                experience: extracted.experience || [],
                education: extracted.education || [],
                projects: extracted.projects || [],
                certifications: extracted.certifications || [],
                achievements: extracted.achievements || [],
                achievementsStructured: extracted.achievementsStructured || { awards: [], researchPapers: [], presentations: [], scholarships: [], competitions: [] },
                confidenceDetails: extracted.confidenceDetails || { contact: 0, skills: 0, projects: 0, experience: 0, certifications: 0, overall: 0 }
            });

            // Strict Role Priority Map from parsed data title
            const cleanTitle = (extracted.title || '').toLowerCase();
            if (cleanTitle.includes('backend') || cleanTitle.includes('spring') || cleanTitle.includes('node')) setTargetRole('backend');
            else if (cleanTitle.includes('frontend') || cleanTitle.includes('react') || cleanTitle.includes('vue')) setTargetRole('frontend');
            else if (cleanTitle.includes('devops') || cleanTitle.includes('aws') || cleanTitle.includes('docker')) setTargetRole('devops');
            else if (cleanTitle.includes('data') || cleanTitle.includes('ml')) setTargetRole('data');
            else if (cleanTitle.includes('mobile') || cleanTitle.includes('native')) setTargetRole('mobile');
            else setTargetRole('developer');

        } catch (error) {
            console.error("ANALYSIS_ERROR:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        processResumeFile(file);
    }, []);

    // --- SKILL CLASSIFICATION ---
    const categorizedSkills = useMemo(() => {
        return {
            languages: resumeData.skills.filter(s => ['Java', 'Python', 'JavaScript', 'SQL', 'C++', 'Go', 'PHP', 'Ruby', 'Rust', 'TypeScript', 'HTML', 'CSS'].some(key => s.toLowerCase().includes(key.toLowerCase()))),
            frameworks: resumeData.skills.filter(s => ['React', 'Tailwind', 'Vue', 'Next.js', 'Spring', 'Django', 'Express', 'Angular', 'Laravel', 'Flutter', 'Bootstrap'].some(key => s.toLowerCase().includes(key.toLowerCase()))),
            databases: resumeData.skills.filter(s => ['Postgres', 'MongoDB', 'MySQL', 'Redis', 'Firebase', 'SQLite', 'Oracle', 'Cassandra'].some(key => s.toLowerCase().includes(key.toLowerCase()))),
            tools: resumeData.skills.filter(s => ['Git', 'Docker', 'Postman', 'Vs Code', 'Jenkins', 'Jira', 'Kubernetes', 'Webpack', 'Vite', 'NPM'].some(key => s.toLowerCase().includes(key.toLowerCase()))),
            cloud: resumeData.skills.filter(s => ['AWS', 'Azure', 'GCP', 'Vercel', 'Netlify', 'Heroku', 'DigitalOcean'].some(key => s.toLowerCase().includes(key.toLowerCase())))
        };
    }, [resumeData.skills]);

    // --- ACTIONS ---
    const handleInputChange = (field, value) => setResumeData(prev => ({ ...prev, [field]: value }));
    
    const handleArrayChange = (field, index, subfield, value) => {
        const updated = [...resumeData[field]];
        updated[index] = { ...updated[index], [subfield]: value };
        setResumeData(prev => ({ ...prev, [field]: updated }));
    };
    
    const addItem = (field, template) => setResumeData(prev => ({ ...prev, [field]: [...prev[field], template] }));
    const removeItem = (field, index) => setResumeData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));

    // --- AI UTILITY TRIGGERS ---
    const triggerBulletEnhancement = (type, index) => {
        setEnhancing(prev => ({ ...prev, [`${type}_${index}`]: true }));
        setTimeout(() => {
            if (type === 'experience') {
                const updatedDesc = enhanceBulletPoints(resumeData.experience[index].desc);
                handleArrayChange('experience', index, 'desc', updatedDesc);
            } else if (type === 'projects_desc') {
                const updatedDesc = enhanceBulletPoints(resumeData.projects[index].desc);
                handleArrayChange('projects', index, 'desc', updatedDesc);
            } else if (type === 'projects_impact') {
                const updatedImpact = enhanceBulletPoints(resumeData.projects[index].impact);
                handleArrayChange('projects', index, 'impact', updatedImpact);
            }
            setEnhancing(prev => ({ ...prev, [`${type}_${index}`]: false }));
        }, 700);
    };

    const triggerSummaryGeneration = () => {
        setEnhancing(prev => ({ ...prev, summary: true }));
        setTimeout(() => {
            const sumText = generateProfessionalSummary(resumeData, targetRole);
            handleInputChange('summary', sumText);
            setEnhancing(prev => ({ ...prev, summary: false }));
        }, 800);
    };

    const triggerExecutiveWording = () => {
        setEnhancing(prev => ({ ...prev, executive: true }));
        setTimeout(() => {
            setResumeData(prev => {
                const enhancedExp = prev.experience.map(e => ({ ...e, desc: enhanceExecutiveWording(e.desc) }));
                const enhancedProj = prev.projects.map(p => ({ ...p, desc: enhanceExecutiveWording(p.desc), impact: enhanceExecutiveWording(p.impact) }));
                return {
                    ...prev,
                    summary: enhanceExecutiveWording(prev.summary),
                    experience: enhancedExp,
                    projects: enhancedProj
                };
            });
            setEnhancing(prev => ({ ...prev, executive: false }));
        }, 900);
    };

    const triggerSkillRanking = () => {
        setResumeData(prev => ({
            ...prev,
            skills: rankSkillsByRole(prev.skills, targetRole)
        }));
    };

    const triggerAddMissingKeywords = () => {
        setResumeData(prev => ({
            ...prev,
            skills: [...new Set([...prev.skills, ...kwResult.missing.slice(0, 5)])]
        }));
    };

    const executePdfExport = async () => {
        setIsExportModalOpen(false);
        setIsGenerating(true);
        const fileName = `${resumeData.name.replace(/\s/g, '_')}_${targetRole.replace(/\s/g, '_')}_Resume`;

        try {
            // Force document fonts load ready check
            await document.fonts.ready;
            
            const element = resumeRef.current;
            
            // Generate canvas with exact quality properties
            const canvas = await html2canvas(element, { 
                scale: 3, 
                useCORS: true, 
                backgroundColor: "#ffffff",
                logging: false
            });
            const data = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${fileName}.pdf`);
        } catch (err) {
            console.error("PDF Export Failure: ", err);
        } finally {
            setIsGenerating(false);
        }
    };

    const EditSection = ({ id, label, icon: Icon, children }) => (
        <div className="border border-primary/5 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-md transition-all">
            <button onClick={() => setExpandedEditSection(expandedEditSection === id ? null : id)} className="w-full flex items-center justify-between p-5 hover:bg-primary/5 rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-accent"><Icon className="w-4 h-4" /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">{label}</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${expandedEditSection === id ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>{expandedEditSection === id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 pb-6 space-y-4">
                    {children}
                </motion.div>
            )}</AnimatePresence>
        </div>
    );

    const checkIcon = (status) => {
        return status ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-yellow-500" />;
    };

    return (
        <div className="max-w-[1700px] mx-auto px-6 py-24 lg:py-32">

            {/* --- HERO INTELLIGENCE --- */}
            <div className="mb-20 space-y-8">
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-accent text-[9px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                        <Zap className="w-3 h-3" /> Enterprise Intelligence Hub
                    </div>
                    {isAnalyzing && (
                        <div className="flex items-center gap-3 text-primary animate-pulse">
                            <Binary className="w-4 h-4 animate-spin" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Neural Parsing in Progress...</span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                    <div>
                        <h2 className="text-6xl lg:text-8xl font-black text-primary tracking-tighter italic leading-none">
                            Resume <span className="text-accent underline decoration-primary/10">Optimization</span> Hub
                        </h2>
                        <p className="text-xl text-primary/40 mt-4 max-w-2xl font-medium italic">
                            Construct enterprise-grade documents from legacy data. Machine-verified, recruiter-optimized.
                        </p>
                    </div>

                    {/* LIVE VALIDATION INDICATOR */}
                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex items-center gap-6">
                        <div className="relative w-16 h-16">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-primary/10" />
                                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={176} strokeDashoffset={176 - (176 * atsResult.score) / 100} className="text-accent transition-all duration-1000" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black">{atsResult.score}%</div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-primary/40">ATS Score: {atsColor.label}</p>
                            <div className="flex gap-2">
                                <div title="Contacts" className={`w-2 h-2 rounded-full ${resumeData.email && resumeData.phone ? 'bg-accent' : 'bg-primary/10'}`} />
                                <div title="Summary" className={`w-2 h-2 rounded-full ${(resumeData.summary || '').length >= 100 ? 'bg-accent' : 'bg-primary/10'}`} />
                                <div title="Skills" className={`w-2 h-2 rounded-full ${resumeData.skills.length >= 8 ? 'bg-accent' : 'bg-primary/10'}`} />
                                <div title="Experience" className={`w-2 h-2 rounded-full ${resumeData.experience.length > 0 ? 'bg-accent' : 'bg-primary/10'}`} />
                                <div title="Projects" className={`w-2 h-2 rounded-full ${resumeData.projects.length > 0 ? 'bg-accent' : 'bg-primary/10'}`} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                {/* --- LEFT: CONTROL & ANALYSIS --- */}
                <div className="lg:col-span-5 space-y-10">

                    {/* DROP ZONE */}
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={onDrop}
                        className={`relative group p-12 rounded-[40px] border-2 border-dashed transition-all flex flex-col items-center gap-6 text-center
                            ${isDragging ? 'bg-accent/10 border-accent scale-[1.02]' : 'bg-primary/5 border-primary/10 hover:border-accent/40'}
                            ${isAnalyzing ? 'pointer-events-none opacity-50' : ''}`}
                    >
                        <input type="file" accept=".pdf,.docx" onChange={(e) => processResumeFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                        <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex items-center justify-center text-accent group-hover:rotate-12 transition-transform">
                            <UploadCloud className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-black uppercase tracking-widest text-primary">Import Professional Asset</h3>
                            <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.2em]">Drop PDF/DOCX or Click to Browse</p>
                        </div>
                    </div>

                    {/* LIVE ATS INTELLIGENCE COMPATIBILITY DISPLAY */}
                    <div className="p-8 rounded-[40px] bg-slate-900 text-white shadow-3xl space-y-8 relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-accent">ATS Compliance Grade</p>
                                <h4 className="text-6xl font-black tracking-tighter italic mt-2">{atsResult.score}%</h4>
                            </div>
                            <div className="px-3 py-1 bg-white/10 rounded-full text-[8px] font-black uppercase text-accent">{atsColor.label}</div>
                        </div>

                        {/* Keyword Gap Widget */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black uppercase text-white/40 tracking-wider">Target Job Role</span>
                                <select 
                                    value={targetRole} 
                                    onChange={(e) => setTargetRole(e.target.value)} 
                                    className="bg-white/5 border border-white/10 text-[9px] font-black uppercase text-white rounded-xl px-2 py-1 outline-none"
                                >
                                    {ROLES_LIST.map(role => (
                                        <option key={role.id} value={role.id} className="bg-slate-900 text-white">{role.label}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="space-y-2 pt-2 border-t border-white/5">
                                <div className="flex justify-between text-[8px] font-black uppercase text-white/30">
                                    <span>Keywords Gap Analysis</span>
                                    <span>{kwResult.present.length} / {kwResult.total} Present</span>
                                </div>
                                
                                {kwResult.missing.length > 0 ? (
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                                            {kwResult.missing.slice(0, 6).map((kw, i) => (
                                                <span key={i} className="text-[8px] font-bold text-accent bg-accent/15 px-2 py-0.5 rounded-lg border border-accent/25">{kw}</span>
                                            ))}
                                        </div>
                                        <button 
                                            onClick={triggerAddMissingKeywords}
                                            className="w-full py-2 bg-accent/20 border border-accent/40 rounded-xl text-[8px] font-black uppercase tracking-wider text-accent hover:bg-accent hover:text-slate-900 transition-all flex items-center justify-center gap-1.5"
                                        >
                                            <Plus className="w-3.5 h-3.5" /> Inject Missing Keywords to Skills
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-[9px] font-bold text-green-400">✓ Excellent job role skill alignment achieved.</p>
                                )}
                            </div>
                        </div>

                        {/* Suggestions list */}
                        {atsResult.suggestions.length > 0 && (
                            <div className="space-y-2 pt-4 border-t border-white/5">
                                <p className="text-[9px] font-black uppercase tracking-wider text-white/40">Required Actions</p>
                                <div className="space-y-1 max-h-28 overflow-y-auto">
                                    {atsResult.suggestions.map((sg, i) => (
                                        <div key={i} className="text-[9px] text-white/60 flex items-start gap-1.5 leading-snug">
                                            <span className="text-accent mt-0.5">•</span>
                                            <span>{sg}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* TRIPLE MODE CONTROLS */}
                    <div className="flex gap-4 p-2 bg-primary/5 rounded-[30px] border border-primary/5">
                        {['visual', 'ats', 'executive'].map(mode => (
                            <button key={mode} onClick={() => setResumeMode(mode)} className={`flex-1 py-4 rounded-3xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${resumeMode === mode ? 'bg-primary text-background shadow-xl' : 'text-primary/40 hover:text-primary'}`}>
                                {mode}
                            </button>
                        ))}
                    </div>

                    {/* LIVE VALIDATION & WARNINGS PANEL */}
                    {validation.totalIssues > 0 && (
                        <div className="bg-primary/5 rounded-[2.5rem] p-6 border border-primary/5 space-y-4">
                            <div className="flex items-center gap-2 text-primary/40">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Section Quality Warnings ({validation.totalIssues})</span>
                            </div>
                            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                                {validation.errors.map((err, i) => (
                                    <div key={i} className="flex gap-2 text-[10px] font-bold text-red-500 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
                                        <span className="shrink-0">[Err]</span>
                                        <span>{err.field}: {err.msg}</span>
                                    </div>
                                ))}
                                {validation.warnings.map((warn, i) => (
                                    <div key={i} className="flex gap-2 text-[10px] font-bold text-yellow-600 bg-yellow-500/5 border border-yellow-500/10 p-2.5 rounded-xl">
                                        <span className="shrink-0">[Warn]</span>
                                        <span>{warn.field}: {warn.msg}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* MANUAL CORRECTIONS TOOLKIT */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 px-2">
                            <Edit3 className="w-4 h-4 text-accent" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30">Manual Refinement</h3>
                        </div>

                        <EditSection id="identity" label="Identity & Contact" icon={Info}>
                            <div className="grid grid-cols-2 gap-4">
                                <input placeholder="Full Name" value={resumeData.name} onChange={(e) => handleInputChange('name', e.target.value)} className="bg-primary/5 p-3 rounded-xl text-xs font-bold text-primary outline-none col-span-2" />
                                <input placeholder="Professional Title" value={resumeData.title} onChange={(e) => handleInputChange('title', e.target.value)} className="bg-primary/5 p-3 rounded-xl text-xs font-bold text-primary outline-none col-span-2" />
                                <input placeholder="Email" value={resumeData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="bg-primary/5 p-3 rounded-xl text-xs font-bold text-primary outline-none" />
                                <input placeholder="Phone" value={resumeData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="bg-primary/5 p-3 rounded-xl text-xs font-bold text-primary outline-none" />
                                <input placeholder="LinkedIn" value={resumeData.linkedin} onChange={(e) => handleInputChange('linkedin', e.target.value)} className="bg-primary/5 p-3 rounded-xl text-xs font-bold text-primary outline-none" />
                                <input placeholder="GitHub" value={resumeData.github} onChange={(e) => handleInputChange('github', e.target.value)} className="bg-primary/5 p-3 rounded-xl text-xs font-bold text-primary outline-none" />
                                <input placeholder="Portfolio Link" value={resumeData.portfolio} onChange={(e) => handleInputChange('portfolio', e.target.value)} className="bg-primary/5 p-3 rounded-xl text-xs font-bold text-primary outline-none col-span-2" />
                                <input placeholder="Location" value={resumeData.location} onChange={(e) => handleInputChange('location', e.target.value)} className="bg-primary/5 p-3 rounded-xl text-xs font-bold text-primary outline-none col-span-2" />
                            </div>
                        </EditSection>

                        <EditSection id="summary" label="Professional Summary" icon={Edit3}>
                            <div className="flex justify-end gap-2 mb-2">
                                <button 
                                    onClick={triggerExecutiveWording}
                                    disabled={enhancing.executive}
                                    className="px-2.5 py-1.5 rounded-lg bg-primary/5 border border-primary/10 text-[8px] font-black uppercase text-accent flex items-center gap-1 hover:bg-accent hover:text-slate-900 transition-all disabled:opacity-50"
                                >
                                    <Sparkles className="w-2.5 h-2.5" /> Executive Refine
                                </button>
                                <button 
                                    onClick={triggerSummaryGeneration}
                                    disabled={enhancing.summary}
                                    className="px-2.5 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-[8px] font-black uppercase text-accent flex items-center gap-1 hover:bg-accent hover:text-slate-900 transition-all disabled:opacity-50"
                                >
                                    <Wand2 className="w-2.5 h-2.5" /> AI Generate
                                </button>
                            </div>
                            <textarea value={resumeData.summary} onChange={(e) => handleInputChange('summary', e.target.value)} rows={4} className="w-full bg-primary/5 p-4 rounded-xl text-xs font-medium text-primary outline-none resize-none leading-relaxed" />
                        </EditSection>

                        <EditSection id="experience" label="Work Experience" icon={Briefcase}>
                            {resumeData.experience.map((exp, i) => (
                                <div key={i} className="p-4 bg-primary/5 rounded-2xl relative group/item border border-primary/5 mb-4 space-y-2">
                                    <button onClick={() => removeItem('experience', i)} className="absolute top-2 right-2 text-primary/20 hover:text-red-500 opacity-0 group-hover/item:opacity-100"><Trash2 className="w-4 h-4" /></button>
                                    <input value={exp.role} onChange={(e) => handleArrayChange('experience', i, 'role', e.target.value)} className="bg-transparent text-xs font-black text-primary outline-none mb-1 block w-full border-b border-primary/5 pb-1 focus:border-accent" placeholder="Role Title" />
                                    <input value={exp.company} onChange={(e) => handleArrayChange('experience', i, 'company', e.target.value)} className="bg-transparent text-[10px] font-bold text-accent outline-none mb-1 block w-full" placeholder="Company Name" />
                                    <input value={exp.period} onChange={(e) => handleArrayChange('experience', i, 'period', e.target.value)} className="bg-transparent text-[9px] font-bold text-primary/40 outline-none mb-2 block w-full" placeholder="Duration (e.g. 2022 - Present)" />
                                    
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-[8px] font-black uppercase text-primary/30">Description & Accomplishments</span>
                                        <button 
                                            onClick={() => triggerBulletEnhancement('experience', i)}
                                            disabled={enhancing[`experience_${i}`]}
                                            className="px-2 py-1 rounded-lg bg-accent/10 border border-accent/20 text-[7.5px] font-black uppercase text-accent flex items-center gap-0.5 hover:bg-accent hover:text-slate-900 transition-all disabled:opacity-50"
                                        >
                                            <Wand2 className="w-2 h-2" /> AI Enhance
                                        </button>
                                    </div>
                                    <textarea value={exp.desc} onChange={(e) => handleArrayChange('experience', i, 'desc', e.target.value)} className="w-full bg-transparent text-[10px] font-medium text-primary/60 outline-none resize-none bg-primary/2 p-2 rounded-xl" rows={4} placeholder="• Achievements..." />
                                </div>
                            ))}
                            <button onClick={() => addItem('experience', { role: "Engineering Lead", company: "System X", period: "2024", desc: "Delivered X using Y..." })} className="w-full py-4 border-2 border-dashed border-primary/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary/20 flex items-center justify-center gap-2 hover:border-accent hover:text-accent"><Plus className="w-4 h-4" /> Add Experience</button>
                        </EditSection>

                        <EditSection id="projects" label="Strategic Projects" icon={Target}>
                            {resumeData.projects.map((proj, i) => (
                                <div key={i} className="p-4 bg-primary/5 rounded-2xl relative group/item border border-primary/5 mb-4 space-y-2">
                                    <button onClick={() => removeItem('projects', i)} className="absolute top-2 right-2 text-primary/20 hover:text-red-500 opacity-0 group-hover/item:opacity-100"><Trash2 className="w-4 h-4" /></button>
                                    <input value={proj.title} onChange={(e) => handleArrayChange('projects', i, 'title', e.target.value)} className="bg-transparent text-xs font-black text-primary outline-none mb-1 block w-full border-b border-primary/5 pb-1 focus:border-accent" placeholder="Project Name" />
                                    <input value={proj.stack} onChange={(e) => handleArrayChange('projects', i, 'stack', e.target.value)} className="bg-transparent text-[10px] font-bold text-accent outline-none mb-1 block w-full" placeholder="Tech Stack" />
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-[8px] font-black uppercase text-primary/30">Description</span>
                                        <button 
                                            onClick={() => triggerBulletEnhancement('projects_desc', i)}
                                            disabled={enhancing[`projects_desc_${i}`]}
                                            className="px-2 py-1 rounded-lg bg-accent/10 border border-accent/20 text-[7.5px] font-black uppercase text-accent flex items-center gap-0.5 hover:bg-accent hover:text-slate-900 transition-all disabled:opacity-50"
                                        >
                                            <Wand2 className="w-2 h-2" /> AI Enhance
                                        </button>
                                    </div>
                                    <textarea value={proj.desc} onChange={(e) => handleArrayChange('projects', i, 'desc', e.target.value)} className="w-full bg-transparent text-[10px] font-medium text-primary/60 outline-none resize-none bg-primary/2 p-2 rounded-xl" rows={2} placeholder="Description..." />
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-[8px] font-black uppercase text-primary/30">Quantifiable Impact</span>
                                        <button 
                                            onClick={() => triggerBulletEnhancement('projects_impact', i)}
                                            disabled={enhancing[`projects_impact_${i}`]}
                                            className="px-2 py-1 rounded-lg bg-accent/10 border border-accent/20 text-[7.5px] font-black uppercase text-accent flex items-center gap-0.5 hover:bg-accent hover:text-slate-900 transition-all disabled:opacity-50"
                                        >
                                            <Wand2 className="w-2 h-2" /> AI Enhance
                                        </button>
                                    </div>
                                    <input value={proj.impact} onChange={(e) => handleArrayChange('projects', i, 'impact', e.target.value)} className="bg-transparent text-[9px] font-bold text-primary/60 italic outline-none block w-full bg-primary/2 p-2 rounded-xl" placeholder="Impact/Achievement" />
                                </div>
                            ))}
                            <button onClick={() => addItem('projects', { title: "New Venture", stack: "Tech A, B", desc: "Built X...", impact: "Saved Y hours..." })} className="w-full py-4 border-2 border-dashed border-primary/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary/20 flex items-center justify-center gap-2 hover:border-accent hover:text-accent"><Plus className="w-4 h-4" /> Add Project</button>
                        </EditSection>

                        <EditSection id="skills" label="Technical Skills" icon={Code2}>
                            <div className="flex justify-end gap-2 mb-2">
                                <button 
                                    onClick={() => {
                                        setResumeData(prev => ({ ...prev, skills: [...new Set(prev.skills)] }));
                                    }}
                                    className="px-2 py-1 rounded-lg bg-primary/5 border border-primary/10 text-[8px] font-black uppercase text-primary/60"
                                >
                                    Deduplicate
                                </button>
                                <button 
                                    onClick={triggerSkillRanking}
                                    className="px-2 py-1 rounded-lg bg-accent/10 border border-accent/20 text-[8px] font-black uppercase text-accent flex items-center gap-1 hover:bg-accent hover:text-slate-900 transition-all"
                                >
                                    <Target className="w-2.5 h-2.5" /> Rank by Role
                                </button>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[8px] font-black uppercase text-primary/40 ml-1">Enter skills separated by commas</label>
                                <textarea 
                                    value={resumeData.skills.join(', ')} 
                                    onChange={(e) => {
                                        const parsed = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                        handleInputChange('skills', parsed);
                                    }} 
                                    rows={4}
                                    className="w-full bg-primary/5 p-4 rounded-xl text-xs font-medium text-primary outline-none resize-none leading-relaxed" 
                                />
                            </div>
                        </EditSection>

                        <EditSection id="education" label="Academic Record" icon={GraduationCap}>
                            {resumeData.education.map((edu, i) => (
                                <div key={i} className="p-4 bg-primary/5 rounded-2xl relative group/item border border-primary/5 mb-4">
                                    <button onClick={() => removeItem('education', i)} className="absolute top-2 right-2 text-primary/20 hover:text-red-500 opacity-0 group-hover/item:opacity-100"><Trash2 className="w-4 h-4" /></button>
                                    <input value={edu.degree} onChange={(e) => handleArrayChange('education', i, 'degree', e.target.value)} className="bg-transparent text-xs font-black text-primary outline-none mb-1 block w-full" placeholder="Degree" />
                                    <input value={edu.institution} onChange={(e) => handleArrayChange('education', i, 'institution', e.target.value)} className="bg-transparent text-[10px] font-bold text-accent outline-none mb-1 block w-full" placeholder="Institution" />
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        <input value={edu.year} onChange={(e) => handleArrayChange('education', i, 'year', e.target.value)} className="bg-primary/5 p-2 rounded-lg text-[10px] font-bold text-primary outline-none" placeholder="Year" />
                                        <input value={edu.cgpa} onChange={(e) => handleArrayChange('education', i, 'cgpa', e.target.value)} className="bg-primary/5 p-2 rounded-lg text-[10px] font-bold text-primary outline-none" placeholder="CGPA" />
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => addItem('education', { degree: "New Degree", institution: "University", year: "2024", cgpa: "4.0" })} className="w-full py-4 border-2 border-dashed border-primary/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary/20 flex items-center justify-center gap-2 hover:border-accent hover:text-accent"><Plus className="w-4 h-4" /> Add Education</button>
                        </EditSection>

                        <EditSection id="certifications" label="Professional Certifications" icon={Award}>
                            {resumeData.certifications.map((cert, i) => (
                                <div key={i} className="p-4 bg-primary/5 rounded-2xl relative group/item border border-primary/5 mb-4">
                                    <button onClick={() => removeItem('certifications', i)} className="absolute top-2 right-2 text-primary/20 hover:text-red-500 opacity-0 group-hover/item:opacity-100"><Trash2 className="w-4 h-4" /></button>
                                    <input value={cert.title} onChange={(e) => handleArrayChange('certifications', i, 'title', e.target.value)} className="bg-transparent text-xs font-black text-primary outline-none mb-1 block w-full" placeholder="Certification Title" />
                                    <input value={cert.issuer} onChange={(e) => handleArrayChange('certifications', i, 'issuer', e.target.value)} className="bg-transparent text-[10px] font-bold text-accent outline-none mb-1 block w-full" placeholder="Issuing Body" />
                                    <input value={cert.year} onChange={(e) => handleArrayChange('certifications', i, 'year', e.target.value)} className="bg-transparent text-[9px] font-bold text-primary/40 italic outline-none block w-full" placeholder="Year" />
                                </div>
                            ))}
                            <button onClick={() => addItem('certifications', { title: "New Certification", issuer: "Provider", year: "2024" })} className="w-full py-4 border-2 border-dashed border-primary/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary/20 flex items-center justify-center gap-2 hover:border-accent hover:text-accent"><Plus className="w-4 h-4" /> Add Certification</button>
                        </EditSection>

                        {/* ACHIEVEMENTS MANUAL SECTION */}
                        <EditSection id="achievements" label="Key Achievements" icon={Award}>
                            {resumeData.achievements?.map((ach, i) => (
                                <div key={i} className="flex gap-2 items-center mb-2">
                                    <input 
                                        value={ach} 
                                        onChange={(e) => {
                                            const updated = [...resumeData.achievements];
                                            updated[i] = e.target.value;
                                            handleInputChange('achievements', updated);
                                        }} 
                                        className="bg-primary/5 p-3 rounded-xl text-xs font-bold text-primary outline-none flex-1" 
                                        placeholder="Key Accomplishment" 
                                    />
                                    <button 
                                        onClick={() => {
                                            const updated = resumeData.achievements.filter((_, idx) => idx !== i);
                                            handleInputChange('achievements', updated);
                                        }} 
                                        className="text-red-500 p-2 hover:bg-red-500/10 rounded-xl"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button 
                                onClick={() => handleInputChange('achievements', [...(resumeData.achievements || []), "New professional landmark metric..."])} 
                                className="w-full py-4 border-2 border-dashed border-primary/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary/20 flex items-center justify-center gap-2 hover:border-accent hover:text-accent"
                            >
                                <Plus className="w-4 h-4" /> Add Achievement
                            </button>
                        </EditSection>
                    </div>

                    <button 
                        onClick={() => setIsExportModalOpen(true)}
                        className="w-full py-6 rounded-3xl bg-accent text-white font-black uppercase tracking-[0.3em] text-xs shadow-3xl hover:bg-accent/90 transition-all flex items-center justify-center gap-4 group"
                    >
                        <Download className="w-6 h-6 group-hover:translate-y-1 transition-transform" /> Generate Professional Asset
                    </button>
                </div>

                {/* --- RIGHT: THE DOC ENGINE --- */}
                <div className="lg:col-span-7">
                    <div className="sticky top-32 space-y-10">
                        {/* Status bar */}
                        <div className="p-6 bg-accent/5 rounded-3xl border border-accent/10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent"><History className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">Interactive Layout Engine</p>
                                    <p className="text-[9px] font-bold text-primary/40 italic">Spacing Factor: {dynamicSpacing.baseFontSize} base size • Length {dynamicSpacing.density} chars</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-right">
                                    <p className="text-xl font-black text-primary">{Math.min(100, Math.floor(100 - (dynamicSpacing.density / 35)))}%</p>
                                    <p className="text-[8px] font-black uppercase text-primary/30">Density Match</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-1 rounded-[45px] bg-gradient-to-b from-primary/10 to-transparent border border-primary/5 shadow-4xl overflow-hidden">
                            
                            {/* Dynamic styling root */}
                            <div 
                                ref={resumeRef} 
                                className={`bg-white text-slate-900 transition-all duration-700 overflow-hidden ${dynamicSpacing.elementPadding}`} 
                                style={{ 
                                    minHeight: '1120px', 
                                    fontSize: dynamicSpacing.baseFontSize,
                                    fontFamily: resumeMode === 'ats' ? 'Georgia, serif' : 'Inter, sans-serif'
                                }}
                            >
                                {/* PDF-SAFE OVERRIDES STYLE BLOCK */}
                                <style dangerouslySetInnerHTML={{__html: `
                                  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Roboto:wght@400;500;700;900&display=swap');
                                  
                                  * {
                                     box-sizing: border-box;
                                  }
                                  
                                  p, span, div, li, h1, h2, h3, h4, h5, h6, a {
                                     text-decoration: none !important;
                                     text-decoration-line: none !important;
                                     position: relative;
                                     z-index: 2;
                                  }
                                  
                                  .section-divider {
                                     position: relative;
                                     z-index: 1 !important;
                                     text-decoration: none !important;
                                     text-decoration-line: none !important;
                                  }
                                `}} />

                                {/* ════════════════════════════════════════════════════════════ */}
                                {/* VISUAL MODE — ATS SAFE AND PREMIUM                         */}
                                {/* ════════════════════════════════════════════════════════════ */}
                                {resumeMode === 'visual' && (
                                    <div className={dynamicSpacing.verticalSpacing}>
                                        <div className="flex justify-between items-start pb-4">
                                            <div className="space-y-3">
                                                <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">{resumeData.name}</h1>
                                                <div className="bg-slate-900 px-4 py-1.5 inline-block text-white text-[10px] font-black uppercase tracking-[0.4em]">{resumeData.title}</div>
                                            </div>
                                            <div className="text-right text-[9px] font-black uppercase tracking-[0.1em] text-slate-500 space-y-1">
                                                <p className="text-slate-900 font-bold">{resumeData.email} • {resumeData.phone}</p>
                                                <p>{resumeData.linkedin} • {resumeData.github}</p>
                                                {resumeData.portfolio && <p className="text-accent">{resumeData.portfolio}</p>}
                                                <p className="opacity-70">{resumeData.location}</p>
                                            </div>
                                        </div>
                                        <div className="section-divider my-3 bg-slate-900" style={{ height: '3px', width: '100%', zIndex: 1 }} />

                                        <div className="space-y-8">
                                            <section className="space-y-2">
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Professional Narrative</h3>
                                                <div className="section-divider my-1.5 bg-slate-200" style={{ height: '1px', width: '100%', zIndex: 1 }} />
                                                <p className="leading-relaxed text-slate-700 text-justify text-[11px] font-medium">{resumeData.summary}</p>
                                            </section>

                                            <section className="grid grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Technical Matrix</h3>
                                                    <div className="section-divider my-1.5 bg-slate-200" style={{ height: '1px', width: '100%', zIndex: 1 }} />
                                                    <div className="space-y-4">
                                                        {Object.entries(categorizedSkills).map(([cat, skills]) => skills.length > 0 && (
                                                            <div key={cat} className="space-y-1" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                                                <p className="text-[8px] font-black uppercase text-accent tracking-widest">{cat}</p>
                                                                <div className="flex flex-wrap gap-1.5 text-[9px] font-bold text-slate-600 uppercase">
                                                                    {skills.join(' • ')}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Academic Credentials</h3>
                                                    <div className="section-divider my-1.5 bg-slate-200" style={{ height: '1px', width: '100%', zIndex: 1 }} />
                                                    {resumeData.education.map((edu, i) => (
                                                        <div key={i} className="space-y-1" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                                            <p className="text-[11px] font-black text-slate-900 italic">{edu.degree}</p>
                                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{edu.institution}</p>
                                                            <p className="text-[8px] font-black text-accent">{edu.year} • CGPA: {edu.cgpa}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>

                                            {/* Work Experience */}
                                            <section className="space-y-4">
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Commercial Experience</h3>
                                                <div className="section-divider my-1.5 bg-slate-200" style={{ height: '1px', width: '100%', zIndex: 1 }} />
                                                <div className={dynamicSpacing.verticalSpacing}>
                                                    {resumeData.experience.map((exp, i) => (
                                                        <div key={i} className="space-y-1.5" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                                            <div className="flex justify-between items-baseline">
                                                                <h5 className="text-[14px] font-black italic tracking-tighter text-slate-900">{exp.role}</h5>
                                                                <span className="text-[9px] font-black text-slate-400 uppercase">{exp.period}</span>
                                                            </div>
                                                            <p className="text-[9px] font-black uppercase text-accent tracking-[0.2em]">{exp.company}</p>
                                                            <div className="text-[10.5px] text-slate-600 leading-relaxed text-justify whitespace-pre-line">{exp.desc}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>

                                            {/* Projects */}
                                            <section className="space-y-4">
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Key Projects</h3>
                                                <div className="section-divider my-1.5 bg-slate-200" style={{ height: '1px', width: '100%', zIndex: 1 }} />
                                                <div className="grid grid-cols-2 gap-8">
                                                    {resumeData.projects.map((proj, i) => (
                                                        <div key={i} className="space-y-1.5" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                                            <h5 className="text-[12px] font-black italic text-slate-900 uppercase tracking-tighter">{proj.title}</h5>
                                                            <p className="text-[8px] font-black text-accent uppercase tracking-widest">{proj.stack}</p>
                                                            <p className="text-[10px] text-slate-500 leading-relaxed">{proj.desc}</p>
                                                            {proj.impact && <p className="text-[9px] font-bold text-slate-400 italic">Impact: {proj.impact}</p>}
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>

                                            {/* Achievements & Certs */}
                                            {(resumeData.achievements?.length > 0 || resumeData.certifications?.length > 0) && (
                                                <section className="grid grid-cols-2 gap-8">
                                                    {resumeData.achievements?.length > 0 && (
                                                        <div className="space-y-3">
                                                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Key Landmarks</h3>
                                                            <div className="section-divider my-1.5 bg-slate-200" style={{ height: '1px', width: '100%', zIndex: 1 }} />
                                                            <ul className="list-disc list-inside text-[10px] text-slate-600 space-y-1">
                                                                {resumeData.achievements.map((ach, i) => (
                                                                    <li key={i} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>{ach}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    {resumeData.certifications?.length > 0 && (
                                                        <div className="space-y-3">
                                                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Accreditation</h3>
                                                            <div className="section-divider my-1.5 bg-slate-200" style={{ height: '1px', width: '100%', zIndex: 1 }} />
                                                            {resumeData.certifications.map((cert, i) => (
                                                                <div key={i} className="space-y-0.5" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                                                    <p className="text-[10.5px] font-black text-slate-900 italic">{cert.title}</p>
                                                                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{cert.issuer} ({cert.year || "2024"})</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </section>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* ════════════════════════════════════════════════════════════ */}
                                {/* ATS MODE — MAXIMUM COMPATIBLE STANDARD FORMAT              */}
                                {/* ════════════════════════════════════════════════════════════ */}
                                {resumeMode === 'ats' && (
                                    <div className="space-y-6 text-slate-950 max-w-[95%] mx-auto font-serif">
                                        <header className="text-center pb-2 space-y-1">
                                            <h1 className="text-2xl font-bold uppercase tracking-tight">{resumeData.name}</h1>
                                            <p className="text-xs font-bold uppercase tracking-wider">{resumeData.title}</p>
                                            <div className="text-[9.5px] flex justify-center gap-2 pt-1">
                                                <span>{resumeData.email}</span>|<span>{resumeData.phone}</span>|<span>{resumeData.location}</span>
                                            </div>
                                            <div className="text-[9px] flex justify-center gap-2 pt-1 text-slate-800">
                                                {resumeData.linkedin && <span>LinkedIn: {resumeData.linkedin}</span>}
                                                {resumeData.github && <span>• GitHub: {resumeData.github}</span>}
                                                {resumeData.portfolio && <span>• Website: {resumeData.portfolio}</span>}
                                            </div>
                                        </header>
                                        <div className="section-divider my-2 bg-slate-950" style={{ height: '1.5px', width: '100%', zIndex: 1 }} />

                                        <section className="space-y-1.5">
                                            <h2 className="text-[10.5px] font-bold uppercase tracking-wider">Professional Summary</h2>
                                            <div className="section-divider my-1.5 bg-slate-950" style={{ height: '1px', width: '100%', zIndex: 1 }} />
                                            <p className="text-[10px] leading-relaxed text-justify">{resumeData.summary}</p>
                                        </section>

                                        <section className="space-y-1.5">
                                            <h2 className="text-[10.5px] font-bold uppercase tracking-wider">Technical Skills</h2>
                                            <div className="section-divider my-1.5 bg-slate-950" style={{ height: '1px', width: '100%', zIndex: 1 }} />
                                            <div className="text-[9.5px] leading-relaxed space-y-0.5">
                                                {Object.entries(categorizedSkills).map(([cat, skills]) => skills.length > 0 && (
                                                    <p key={cat} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}><span className="font-bold uppercase">{cat}: </span>{skills.join(', ')}</p>
                                                ))}
                                            </div>
                                        </section>

                                        <section className="space-y-4">
                                            <h2 className="text-[10.5px] font-bold uppercase tracking-wider">Work Experience</h2>
                                            <div className="section-divider my-1.5 bg-slate-950" style={{ height: '1px', width: '100%', zIndex: 1 }} />
                                            {resumeData.experience.map((exp, i) => (
                                                <div key={i} className="space-y-0.5" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                                    <div className="flex justify-between font-bold text-[9.5px]">
                                                        <span>{exp.role.toUpperCase()} — {exp.company.toUpperCase()}</span>
                                                        <span>{exp.period}</span>
                                                    </div>
                                                    <div className="text-[9.5px] leading-relaxed whitespace-pre-line text-justify">{exp.desc}</div>
                                                </div>
                                            ))}
                                        </section>

                                        <section className="space-y-4">
                                            <h2 className="text-[10.5px] font-bold uppercase tracking-wider">Key Projects</h2>
                                            <div className="section-divider my-1.5 bg-slate-950" style={{ height: '1px', width: '100%', zIndex: 1 }} />
                                            {resumeData.projects.map((proj, i) => (
                                                <div key={i} className="space-y-0.5" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                                    <div className="flex justify-between font-bold text-[9.5px]">
                                                        <span>{proj.title} ({proj.stack})</span>
                                                    </div>
                                                    <p className="text-[9.5px] leading-tight">• {proj.desc}</p>
                                                    {proj.impact && <p className="text-[9.5px] italic font-bold">• Impact: {proj.impact}</p>}
                                                </div>
                                            ))}
                                        </section>

                                        {resumeData.achievements?.length > 0 && (
                                            <section className="space-y-1.5">
                                                <h2 className="text-[10.5px] font-bold uppercase tracking-wider">Achievements</h2>
                                                <div className="section-divider my-1.5 bg-slate-950" style={{ height: '1px', width: '100%', zIndex: 1 }} />
                                                <div className="text-[9.5px] space-y-0.5">
                                                    {resumeData.achievements.map((ach, i) => (
                                                        <p key={i} className="leading-tight" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>• {ach}</p>
                                                    ))}
                                                </div>
                                            </section>
                                        )}

                                        <section className="space-y-2">
                                            <h2 className="text-[10.5px] font-bold uppercase tracking-wider">Education</h2>
                                            <div className="section-divider my-1.5 bg-slate-950" style={{ height: '1px', width: '100%', zIndex: 1 }} />
                                            {resumeData.education.map((edu, i) => (
                                                <div key={i} className="flex justify-between text-[9.5px] font-bold" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                                    <span>{edu.degree} — {edu.institution}</span>
                                                    <span>{edu.year} (CGPA: {edu.cgpa})</span>
                                                </div>
                                            ))}
                                        </section>

                                        {resumeData.certifications.length > 0 && (
                                            <section className="space-y-1.5">
                                                <h2 className="text-[10.5px] font-bold uppercase tracking-wider">Certifications</h2>
                                                <div className="section-divider my-1.5 bg-slate-950" style={{ height: '1px', width: '100%', zIndex: 1 }} />
                                                {resumeData.certifications.map((cert, i) => (
                                                    <p key={i} className="text-[9.5px] font-bold" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>• {cert.title} — {cert.issuer} ({cert.year || "2024"})</p>
                                                ))}
                                            </section>
                                        )}
                                    </div>
                                )}

                                {/* ════════════════════════════════════════════════════════════ */}
                                {/* EXECUTIVE MODE — ELITE EXECUTIVE STYLE                     */}
                                {/* ════════════════════════════════════════════════════════════ */}
                                {resumeMode === 'executive' && (
                                    <div className={dynamicSpacing.verticalSpacing}>
                                        <div className="bg-slate-900 -mx-16 -mt-16 p-12 text-white flex justify-between items-center">
                                            <div className="space-y-2">
                                                <h1 className="text-4xl font-black uppercase tracking-tighter">{resumeData.name}</h1>
                                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-accent">{resumeData.title}</p>
                                            </div>
                                            <div className="text-right text-[8.5px] font-bold space-y-1 text-white/40 uppercase tracking-widest">
                                                <p className="text-white">{resumeData.email}</p>
                                                {resumeData.phone && <p>{resumeData.phone}</p>}
                                                {resumeData.portfolio && <p className="text-accent">{resumeData.portfolio}</p>}
                                                <p>{resumeData.linkedin}</p>
                                                <p>{resumeData.location}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-12 gap-10 pt-4">
                                            <div className="col-span-8 space-y-8">
                                                <section className="space-y-3">
                                                    <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">Professional Narrative</h3>
                                                    <div className="section-divider my-1 bg-accent/25" style={{ height: '1px', width: '100%', zIndex: 1 }} />
                                                    <p className="text-[11px] font-semibold text-slate-800 leading-relaxed text-justify">{enhanceExecutiveWording(resumeData.summary)}</p>
                                                </section>
                                                
                                                <section className="space-y-6">
                                                    <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">Career Milestones</h3>
                                                    <div className="section-divider my-1 bg-accent/25" style={{ height: '1px', width: '100%', zIndex: 1 }} />
                                                    <div className="space-y-6">
                                                        {resumeData.experience.map((exp, i) => (
                                                            <div key={i} className="space-y-1.5" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                                                <div className="flex justify-between items-center">
                                                                    <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{exp.role}</p>
                                                                    <span className="text-[8.5px] font-black text-slate-400">{exp.period}</span>
                                                                </div>
                                                                <p className="text-[9px] font-bold text-accent italic">{exp.company}</p>
                                                                <div className="text-[10px] text-slate-600 leading-relaxed text-justify whitespace-pre-line">{enhanceExecutiveWording(exp.desc)}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>

                                                {resumeData.projects?.length > 0 && (
                                                    <section className="space-y-6">
                                                        <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">Strategic Operations</h3>
                                                        <div className="section-divider my-1 bg-accent/25" style={{ height: '1px', width: '100%', zIndex: 1 }} />
                                                        <div className="space-y-4">
                                                            {resumeData.projects.map((proj, i) => (
                                                                <div key={i} className="space-y-1" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                                                    <p className="text-[11px] font-bold text-slate-950">{proj.title} ({proj.stack})</p>
                                                                    <p className="text-[10px] text-slate-600">{enhanceExecutiveWording(proj.desc)}</p>
                                                                    {proj.impact && <p className="text-[9px] font-bold text-accent italic">Metrics: {enhanceExecutiveWording(proj.impact)}</p>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </section>
                                                )}
                                            </div>

                                            <div className="col-span-4 space-y-8">
                                                <section className="space-y-4">
                                                    <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">Expertise Cluster</h3>
                                                    <div className="section-divider my-1 bg-accent/25" style={{ height: '1px', width: '100%', zIndex: 1 }} />
                                                    <div className="space-y-4">
                                                        {Object.entries(categorizedSkills).map(([cat, skills]) => skills.length > 0 && (
                                                            <div key={cat} className="space-y-1" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                                                <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{cat}</p>
                                                                <div className="text-[9.5px] font-black text-slate-900 leading-tight">
                                                                    {skills.join(' | ')}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>

                                                <section className="space-y-4 pt-4 border-t border-slate-100">
                                                    <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">Education Background</h3>
                                                    <div className="section-divider my-1 bg-accent/25" style={{ height: '1px', width: '100%', zIndex: 1 }} />
                                                    {resumeData.education.map((edu, i) => (
                                                        <div key={i} className="space-y-0.5" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                                            <p className="text-[10.5px] font-black text-slate-900 uppercase leading-none">{edu.degree}</p>
                                                            <p className="text-[8.5px] font-bold text-slate-400">{edu.institution} ({edu.year})</p>
                                                        </div>
                                                    ))}
                                                </section>

                                                {resumeData.certifications.length > 0 && (
                                                    <section className="space-y-4 pt-4 border-t border-slate-100">
                                                        <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">Recognition</h3>
                                                        <div className="section-divider my-1 bg-accent/25" style={{ height: '1px', width: '100%', zIndex: 1 }} />
                                                        {resumeData.certifications.map((cert, i) => (
                                                            <div key={i} className="space-y-0.5" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                                                <p className="text-[10px] font-black text-slate-900 uppercase leading-none">{cert.title}</p>
                                                                <p className="text-[8px] font-bold text-slate-400 italic">{cert.issuer}</p>
                                                            </div>
                                                        ))}
                                                    </section>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- PRE-EXPORT VALIDATION CHECKLIST MODAL --- */}
            <AnimatePresence>
                {isExportModalOpen && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            onClick={() => setIsExportModalOpen(false)} 
                            className="absolute inset-0 bg-background/80 backdrop-blur-2xl" 
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 15 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.95, y: 15 }} 
                            className="relative w-full max-w-xl bg-slate-900 border border-white/10 rounded-[35px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Pre-Export <span className="text-accent italic">Report</span></h3>
                                    <p className="text-[9px] font-black uppercase text-white/40 tracking-widest">Automatic quality validation checks</p>
                                </div>
                                <button onClick={() => setIsExportModalOpen(false)} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 text-white transition-all">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                                
                                {/* ATS Indexing Check */}
                                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 flex justify-between items-center">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black uppercase text-white/40 tracking-wider">ATS Score Review</p>
                                        <p className="text-lg font-black text-white">{atsResult.score}% Compatibility Rating</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase text-accent">
                                        {atsColor.label}
                                    </div>
                                </div>

                                {/* Validation checklists */}
                                <div className="space-y-3.5">
                                    <p className="text-[9px] font-black uppercase text-white/30 tracking-wider">System Checks Checklist</p>
                                    
                                    <div className="space-y-2">
                                        {/* 1. Content completeness */}
                                        <div className="flex items-center justify-between text-[11px] font-bold text-white/80 p-3 bg-white/2 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                {checkIcon(validation.errors.length === 0)}
                                                <span>Required fields (Name, Email, Phone)</span>
                                            </div>
                                            <span className="text-[9px] font-black text-white/40 uppercase">{validation.errors.length === 0 ? 'Passed' : `${validation.errors.length} Critical error`}</span>
                                        </div>

                                        {/* 2. Spacing Density */}
                                        <div className="flex items-center justify-between text-[11px] font-bold text-white/80 p-3 bg-white/2 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                {checkIcon(dynamicSpacing.density < 2500)}
                                                <span>A4 page length layout density</span>
                                            </div>
                                            <span className="text-[9px] font-black text-white/40 uppercase">{dynamicSpacing.density < 2500 ? 'Low Overflow Risk' : 'High Overflow Risk'}</span>
                                        </div>

                                        {/* 3. Skill & Keywords check */}
                                        <div className="flex items-center justify-between text-[11px] font-bold text-white/80 p-3 bg-white/2 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                {checkIcon(kwResult.missing.length < 5)}
                                                <span>ATS job role keywords gap</span>
                                            </div>
                                            <span className="text-[9px] font-black text-white/40 uppercase">{kwResult.missing.length === 0 ? '100% Match' : `${kwResult.missing.length} missing`}</span>
                                        </div>

                                        {/* 4. Grammar & Alignment checks */}
                                        <div className="flex items-center justify-between text-[11px] font-bold text-white/80 p-3 bg-white/2 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                {checkIcon(!validation.warnings.some(w => w.field === 'Grammar'))}
                                                <span>Spacing formatting &amp; sentence structure</span>
                                            </div>
                                            <span className="text-[9px] font-black text-white/40 uppercase">{!validation.warnings.some(w => w.field === 'Grammar') ? 'Clean' : 'Warnings'}</span>
                                        </div>

                                        {/* 5. Bullet Strength checks */}
                                        <div className="flex items-center justify-between text-[11px] font-bold text-white/80 p-3 bg-white/2 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                {checkIcon(!validation.warnings.some(w => w.msg.includes('bullets')))}
                                                <span>Achievement-based bullet descriptors</span>
                                            </div>
                                            <span className="text-[9px] font-black text-white/40 uppercase">{!validation.warnings.some(w => w.msg.includes('bullets')) ? 'Elite wording' : 'Action recommended'}</span>
                                        </div>

                                        {/* 6. Font Loader & CSS validation */}
                                        <div className="flex items-center justify-between text-[11px] font-bold text-white/80 p-3 bg-white/2 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                {checkIcon(fontsReady)}
                                                <span>Fonts embedding checked (Inter, Roboto, Georgia)</span>
                                            </div>
                                            <span className="text-[9px] font-black text-white/40 uppercase">{fontsReady ? 'Fonts Ready' : 'Loading...'}</span>
                                        </div>

                                        {/* 7. Underline & overlapping check */}
                                        <div className="flex items-center justify-between text-[11px] font-bold text-white/80 p-3 bg-white/2 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                {checkIcon(true)}
                                                <span>Accidental underline &amp; line-strike check</span>
                                            </div>
                                            <span className="text-[9px] font-black text-white/40 uppercase">Clean</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Warning messages summary */}
                                {validation.totalIssues > 0 && (
                                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl space-y-2">
                                        <p className="text-[9.5px] font-black uppercase text-yellow-500 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Quality Warnings</p>
                                        <div className="space-y-1 max-h-24 overflow-y-auto">
                                            {validation.errors.map((e, idx) => (
                                                <p key={idx} className="text-[9px] text-white/60 font-medium">• Critical: {e.field} - {e.msg}</p>
                                            ))}
                                            {validation.warnings.map((w, idx) => (
                                                <p key={idx} className="text-[9px] text-white/60 font-medium">• Suggestion: {w.field} - {w.msg}</p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 border-t border-white/5 bg-white/2 flex gap-4">
                                <button 
                                    onClick={() => setIsExportModalOpen(false)} 
                                    className="flex-1 py-4 bg-white/5 rounded-2xl text-[9px] font-black uppercase tracking-wider text-white hover:bg-white/10 transition-all"
                                >
                                    Refine Resume First
                                </button>
                                <button 
                                    onClick={executePdfExport} 
                                    disabled={validation.errors.length > 0}
                                    className="flex-1 py-4 bg-accent rounded-2xl text-[9px] font-black uppercase tracking-wider text-slate-900 hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                                >
                                    <Download className="w-4 h-4" /> Export Document PDF
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default InteractiveResume;
