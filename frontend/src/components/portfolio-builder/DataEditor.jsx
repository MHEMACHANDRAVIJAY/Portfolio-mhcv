import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Briefcase, GraduationCap, Code, FileText, Award, Layers,
    Plus, X, Mail, Phone, Linkedin, Github, AlertCircle,
    Sparkles, Brain, Target, TrendingUp, CheckCircle, XCircle,
    ChevronDown, ChevronUp, Zap, RefreshCw
} from 'lucide-react';
import {
    enhanceBulletPoints,
    generateProfessionalSummary,
    calculateATSScore,
    detectMissingKeywords,
    deduplicateSkills,
    validateResume,
    getATSScoreColor,
    ATS_KEYWORDS,
    detectCareerCategory,
    generateStructuredSummary,
    smartProjectEnhancement,
    calculateQualityScore
} from '../../utils/resumeAI';

const ROLES = [
    { id: 'developer',  label: 'Full Stack Dev'  },
    { id: 'frontend',   label: 'Frontend Dev'     },
    { id: 'backend',    label: 'Backend Dev'      },
    { id: 'devops',     label: 'DevOps/Cloud'     },
    { id: 'data',       label: 'Data / ML'        },
    { id: 'mobile',     label: 'Mobile Dev'       },
];

const DataEditor = ({ data, onUpdate, confidence = 85 }) => {
    const [activeSection, setActiveSection] = useState('personal');
    const [targetRole, setTargetRole]       = useState('developer');
    const [enhancing, setEnhancing]         = useState({});
    const [showKeywords, setShowKeywords]   = useState(false);
    const [showValidation, setShowValidation] = useState(false);

    if (!data) return (
        <div className="p-12 text-center text-primary/40 font-black uppercase tracking-widest text-xs">
            Wait for system intel...
        </div>
    );

    // ── Live AI calculations (re-run on every data change) ──────
    const atsResult    = useMemo(() => calculateATSScore(data),              [data]);
    const kwResult     = useMemo(() => detectMissingKeywords(data, targetRole), [data, targetRole]);
    const validation   = useMemo(() => validateResume(data),                 [data]);
    const atsColor     = getATSScoreColor(atsResult.score);

    // ── Section definitions (original, unchanged) ───────────────
    const sections = [
        { id: 'personal',    label: 'Personal Info',   icon: User        },
        { id: 'experience',  label: 'Experience',      icon: Briefcase   },
        { id: 'education',   label: 'Education',       icon: GraduationCap },
        { id: 'projects',    label: 'Projects',        icon: Layers      },
        { id: 'skills',      label: 'Skills',          icon: Code        },
        { id: 'certs',       label: 'Certifications',  icon: Award       },
    ];

    // ── Handlers (original, unchanged) ──────────────────────────
    const handleChange = (field, value) => onUpdate({ ...data, [field]: value });

    const handleContactChange = (field, value) =>
        onUpdate({ ...data, contact: { ...data.contact, [field]: value } });

    const handleSkillsChange = (category, value) => {
        const skillsArray = value.split(',').map(s => s.trim()).filter(s => s !== '');
        onUpdate({ ...data, skills: { ...data.skills, [category]: skillsArray } });
    };

    const handleArrayChange = (field, index, subfield, value) => {
        const newArray = [...data[field]];
        newArray[index] = { ...newArray[index], [subfield]: value };
        onUpdate({ ...data, [field]: newArray });
    };

    const addItem = (field, template) =>
        onUpdate({ ...data, [field]: [...data[field], template] });

    const removeItem = (field, index) =>
        onUpdate({ ...data, [field]: data[field].filter((_, i) => i !== index) });

    const isSectionEmpty = (id) => {
        if (id === 'personal') return !data.name || !data.contact.email;
        if (id === 'skills')   return Object.values(data.skills).flat().length === 0;
        if (id === 'certs')    return (data.certifications || []).length === 0;
        return (data[id] || []).length === 0;
    };

    // ── NEW: AI handlers ─────────────────────────────────────────
    const handleEnhanceExperience = (idx) => {
        setEnhancing(prev => ({ ...prev, [`exp_${idx}`]: true }));
        setTimeout(() => {
            const enhanced = enhanceBulletPoints(data.experience[idx].desc || '');
            handleArrayChange('experience', idx, 'desc', enhanced);
            setEnhancing(prev => ({ ...prev, [`exp_${idx}`]: false }));
        }, 600);
    };

    const handleEnhanceProject = (idx) => {
        setEnhancing(prev => ({ ...prev, [`proj_${idx}`]: true }));
        setTimeout(() => {
            const enhanced = enhanceBulletPoints(data.projects[idx].desc || '');
            handleArrayChange('projects', idx, 'desc', enhanced);
            setEnhancing(prev => ({ ...prev, [`proj_${idx}`]: false }));
        }, 600);
    };

    const handleGenerateSummary = () => {
        setEnhancing(prev => ({ ...prev, summary: true }));
        setTimeout(() => {
            const generated = generateProfessionalSummary(data);
            handleChange('summary', generated);
            setEnhancing(prev => ({ ...prev, summary: false }));
        }, 800);
    };

    const handleGenerateProfessionalPortfolio = () => {
        setEnhancing(prev => ({ ...prev, full: true }));
        setTimeout(() => {
            // 1. Detect Role
            const role = detectCareerCategory(data);
            setTargetRole(role.toLowerCase().includes('data') ? 'data' : role.toLowerCase().includes('cloud') ? 'devops' : 'developer');

            // 2. Generate Structured Summary
            const structuredSummary = generateStructuredSummary(data);

            // 3. Enhance all projects
            const enhancedProjects = (data.projects || []).map(p => smartProjectEnhancement(p));

            // 4. Update data
            onUpdate({
                ...data,
                title: data.title || role,
                summary: structuredSummary.executiveSummary + ' ' + structuredSummary.professionalBio,
                projects: enhancedProjects,
                structuredSummary: structuredSummary, // Pass structured object
            });
            setEnhancing(prev => ({ ...prev, full: false }));
        }, 1200);
    };

    const handleDeduplicateSkills = () => {
        const deduped = deduplicateSkills(data.skills);
        onUpdate({ ...data, skills: deduped });
    };

    const inputClasses = "w-full bg-background border border-primary/10 rounded-xl px-4 py-3 text-[11px] font-bold text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-primary/10";
    const labelClasses = "block text-[9px] font-black uppercase tracking-widest text-primary/40 mb-2 ml-1";

    const AIButton = ({ onClick, loading, children, small }) => (
        <button
            type="button"
            onClick={onClick}
            disabled={loading}
            className={`flex items-center gap-1.5 ${small ? 'px-3 py-1.5 text-[8px]' : 'px-4 py-2 text-[9px]'} rounded-xl bg-accent/10 border border-accent/20 text-accent font-black uppercase tracking-widest hover:bg-accent hover:text-background transition-all disabled:opacity-50 shrink-0`}
        >
            {loading
                ? <RefreshCw className={`${small ? 'w-2.5 h-2.5' : 'w-3 h-3'} animate-spin`} />
                : <Sparkles  className={`${small ? 'w-2.5 h-2.5' : 'w-3 h-3'}`} />
            }
            {children}
        </button>
    );

    return (
        <div className="flex flex-col gap-8 pb-10">

            {/* AI Enhancement Master Button */}
            <div className="bg-accent/10 border border-accent/20 rounded-[2rem] p-6 text-center shadow-lg">
                <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-accent mb-2">Portfolio Intelligence Upgrade</h3>
                <p className="text-[10px] text-primary/60 font-bold mb-4">Automatically convert raw resume text into a professional, role-specific portfolio with measurable achievements and case studies.</p>
                <button
                    onClick={handleGenerateProfessionalPortfolio}
                    disabled={enhancing.full}
                    className="w-full py-4 rounded-full bg-accent text-primary text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                    {enhancing.full ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {enhancing.full ? 'Generating Intelligence...' : 'Generate Professional Portfolio'}
                </button>
            </div>

            {/* ── Section Tabs (original, unchanged) ── */}
            <div className="flex flex-wrap gap-2">
                {sections.map((section) => {
                    const isEmpty = isSectionEmpty(section.id);
                    return (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all duration-500 relative ${activeSection === section.id ? 'bg-primary text-background border-primary shadow-xl scale-105' : 'bg-background text-primary/40 border-primary/5 hover:border-primary/20'}`}
                        >
                            <section.icon className="w-3 h-3" />
                            {section.label}
                            {isEmpty && (
                                <div className="absolute -top-1 -right-1">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-20" />
                                        <AlertCircle className="w-3 h-3 text-accent fill-accent/10" />
                                    </div>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* ── Section Content (original + AI buttons added) ── */}
            <div className="bg-background/20 rounded-[2rem] p-4 border border-primary/5 min-h-[400px]">
                <AnimatePresence mode="wait">

                    {/* Personal Info ──────────────────────────── */}
                    {activeSection === 'personal' && (
                        <motion.div key="personal" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className={labelClasses}>Full Name</label>
                                    <input className={inputClasses} value={data.name || ''} onChange={(e) => handleChange('name', e.target.value)} placeholder="JOHN DOE" />
                                </div>
                                <div className="col-span-2">
                                    <label className={labelClasses}>Professional Title</label>
                                    <input className={inputClasses} value={data.title || ''} onChange={(e) => handleChange('title', e.target.value)} placeholder="Senior Systems Architect" />
                                </div>
                                <div>
                                    <label className={labelClasses}>Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-primary/20" />
                                        <input className={`${inputClasses} pl-10`} value={data.contact.email || ''} onChange={(e) => handleContactChange('email', e.target.value)} placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClasses}>Phone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-primary/20" />
                                        <input className={`${inputClasses} pl-10`} value={data.contact.phone || ''} onChange={(e) => handleContactChange('phone', e.target.value)} placeholder="+1 234 567 890" />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClasses}>LinkedIn</label>
                                    <div className="relative">
                                        <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-primary/20" />
                                        <input className={`${inputClasses} pl-10`} value={data.contact.linkedin || ''} onChange={(e) => handleContactChange('linkedin', e.target.value)} placeholder="https://linkedin.com/in/username" />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClasses}>GitHub</label>
                                    <div className="relative">
                                        <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-primary/20" />
                                        <input className={`${inputClasses} pl-10`} value={data.contact.github || ''} onChange={(e) => handleContactChange('github', e.target.value)} placeholder="https://github.com/username" />
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className={labelClasses}>Location</label>
                                    <input className={inputClasses} value={data.contact.location || ''} onChange={(e) => handleContactChange('location', e.target.value)} placeholder="New York, USA" />
                                </div>
                            </div>

                            {/* Summary with AI Generate */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className={labelClasses}>Professional Summary</label>
                                    <AIButton onClick={handleGenerateSummary} loading={enhancing.summary} small>
                                        AI Generate
                                    </AIButton>
                                </div>
                                <textarea
                                    className={`${inputClasses} min-h-[120px] resize-none`}
                                    value={data.summary || ''}
                                    onChange={(e) => handleChange('summary', e.target.value)}
                                    placeholder="Briefly describe your professional background..."
                                />
                                <p className="text-[8px] text-primary/20 font-bold uppercase tracking-widest mt-1 ml-1">
                                    {(data.summary || '').length} chars — aim for 150+
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Experience ──────────────────────────────── */}
                    {activeSection === 'experience' && (
                        <motion.div key="experience" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                            {(data.experience || []).map((exp, idx) => (
                                <div key={idx} className="p-6 bg-primary/5 rounded-[2rem] border border-primary/5 relative group">
                                    <button onClick={() => removeItem('experience', idx)} className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                                        <X className="w-3 h-3" />
                                    </button>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <input className={inputClasses} value={exp.role || ''} onChange={(e) => handleArrayChange('experience', idx, 'role', e.target.value)} placeholder="Role / Job Title" />
                                        </div>
                                        <div>
                                            <input className={inputClasses} value={exp.company || ''} onChange={(e) => handleArrayChange('experience', idx, 'company', e.target.value)} placeholder="Company Name" />
                                        </div>
                                        <div>
                                            <input className={inputClasses} value={exp.period || ''} onChange={(e) => handleArrayChange('experience', idx, 'period', e.target.value)} placeholder="Period (e.g. 2020 - 2024)" />
                                        </div>
                                        <div className="col-span-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={labelClasses}>Bullet Points / Description</span>
                                                <AIButton onClick={() => handleEnhanceExperience(idx)} loading={enhancing[`exp_${idx}`]} small>
                                                    Enhance
                                                </AIButton>
                                            </div>
                                            <textarea
                                                className={`${inputClasses} min-h-[80px] resize-none`}
                                                value={exp.desc || ''}
                                                onChange={(e) => handleArrayChange('experience', idx, 'desc', e.target.value)}
                                                placeholder="• Key responsibilities and achievements..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => addItem('experience', { role: '', company: '', period: '', desc: '' })} className="w-full py-4 rounded-[1.5rem] border-2 border-dashed border-primary/10 text-primary/40 font-black text-[9px] uppercase tracking-widest hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" /> Add Experience Position
                            </button>
                        </motion.div>
                    )}

                    {/* Projects ────────────────────────────────── */}
                    {activeSection === 'projects' && (
                        <motion.div key="projects" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                            {(data.projects || []).map((proj, idx) => (
                                <div key={idx} className="p-6 bg-primary/5 rounded-[2rem] border border-primary/5 relative group">
                                    <button onClick={() => removeItem('projects', idx)} className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                                        <X className="w-3 h-3" />
                                    </button>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <input className={inputClasses} value={proj.title || ''} onChange={(e) => handleArrayChange('projects', idx, 'title', e.target.value)} placeholder="Project Title" />
                                        </div>
                                        <div className="col-span-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={labelClasses}>Description & Impact</span>
                                                <AIButton onClick={() => handleEnhanceProject(idx)} loading={enhancing[`proj_${idx}`]} small>
                                                    Enhance
                                                </AIButton>
                                            </div>
                                            <textarea
                                                className={`${inputClasses} min-h-[80px] resize-none`}
                                                value={proj.desc || ''}
                                                onChange={(e) => handleArrayChange('projects', idx, 'desc', e.target.value)}
                                                placeholder="Project description and measurable impact..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => addItem('projects', { title: '', desc: '', tech: [] })} className="w-full py-4 rounded-[1.5rem] border-2 border-dashed border-primary/10 text-primary/40 font-black text-[9px] uppercase tracking-widest hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" /> Add Enterprise Project
                            </button>
                        </motion.div>
                    )}

                    {/* Skills ──────────────────────────────────── */}
                    {activeSection === 'skills' && (
                        <motion.div key="skills" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className={labelClasses}>Enter skills separated by commas</span>
                                <AIButton onClick={handleDeduplicateSkills} small>Remove Duplicates</AIButton>
                            </div>
                            {Object.entries({ languages: 'Programming Languages', frameworks: 'Frameworks & Libraries', databases: 'Databases', tools: 'Tools & DevOps', cloud: 'Cloud Infrastructure' }).map(([key, label]) => (
                                <div key={key}>
                                    <label className={labelClasses}>{label} — {(data.skills[key] || []).length} entries</label>
                                    <input className={inputClasses} value={(data.skills[key] || []).join(', ')} onChange={(e) => handleSkillsChange(key, e.target.value)} placeholder="Item 1, Item 2, ..." />
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* Education ───────────────────────────────── */}
                    {activeSection === 'education' && (
                        <motion.div key="education" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                            {(data.education || []).map((edu, idx) => (
                                <div key={idx} className="p-6 bg-primary/5 rounded-[2rem] border border-primary/5 relative group">
                                    <button onClick={() => removeItem('education', idx)} className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                                        <X className="w-3 h-3" />
                                    </button>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className={labelClasses}>Degree / Certificate</label>
                                            <input className={inputClasses} value={edu.degree || ''} onChange={(e) => handleArrayChange('education', idx, 'degree', e.target.value)} placeholder="B.Tech Computer Science" />
                                        </div>
                                        <div>
                                            <label className={labelClasses}>University / School</label>
                                            {/* parser uses 'school', editor normalises to 'institution' */}
                                            <input className={inputClasses} value={edu.institution || edu.school || ''} onChange={(e) => handleArrayChange('education', idx, 'institution', e.target.value)} placeholder="University / School" />
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Year / Period</label>
                                            <input className={inputClasses} value={edu.year || edu.period || ''} onChange={(e) => handleArrayChange('education', idx, 'year', e.target.value)} placeholder="2020 – 2024" />
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Grade / CGPA (optional)</label>
                                            <input className={inputClasses} value={edu.score || edu.cgpa || ''} onChange={(e) => handleArrayChange('education', idx, 'score', e.target.value)} placeholder="8.5 / 10" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => addItem('education', { degree: '', institution: '', year: '', score: '' })} className="w-full py-4 rounded-[1.5rem] border-2 border-dashed border-primary/10 text-primary/40 font-black text-[9px] uppercase tracking-widest hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" /> Add Academic Record
                            </button>
                        </motion.div>
                    )}

                    {/* Certifications ──────────────────────────── */}
                    {activeSection === 'certs' && (
                        <motion.div key="certs" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                            {(data.certifications || []).map((cert, idx) => (
                                <div key={idx} className="p-6 bg-primary/5 rounded-[2rem] border border-primary/5 relative group">
                                    <button onClick={() => removeItem('certifications', idx)} className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                                        <X className="w-3 h-3" />
                                    </button>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <input className={inputClasses} value={cert.title || ''} onChange={(e) => handleArrayChange('certifications', idx, 'title', e.target.value)} placeholder="Certification Title" />
                                        </div>
                                        <div className="col-span-2">
                                            <input className={inputClasses} value={cert.issuer || ''} onChange={(e) => handleArrayChange('certifications', idx, 'issuer', e.target.value)} placeholder="Issuing Organization" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => addItem('certifications', { title: '', issuer: '' })} className="w-full py-4 rounded-[1.5rem] border-2 border-dashed border-primary/10 text-primary/40 font-black text-[9px] uppercase tracking-widest hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" /> Add Certification
                            </button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* ── NEW: Live ATS Score Panel ─────────────────────── */}
            <div className={`bg-primary p-8 rounded-[2rem] text-background border border-primary shadow-2xl ring-4 ${atsColor.ring}`}>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Brain className="w-5 h-5 text-accent" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60">ATS Intelligence Score</h3>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${atsColor.text} bg-background/10`}>
                        {atsColor.label}
                    </div>
                </div>

                {/* Score bar */}
                <div className="mb-6">
                    <div className="flex justify-between mb-2">
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-60">ATS Compatibility Score</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-accent">{atsResult.score}%</span>
                    </div>
                    <div className="h-2 w-full bg-background/10 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full ${atsColor.bg} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${atsResult.score}%` }}
                            transition={{ duration: 1.2, delay: 0.3 }}
                        />
                    </div>
                </div>

                {/* Extraction Confidence (original) */}
                <div className="mb-6">
                    <div className="flex justify-between mb-2">
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Extraction Confidence Level</span>
                        <span className="text-[9px] font-black uppercase tracking-widest">{confidence}%</span>
                    </div>
                    <div className="h-1 w-full bg-background/10 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-accent" initial={{ width: 0 }} animate={{ width: `${confidence}%` }} transition={{ duration: 1, delay: 0.5 }} />
                    </div>
                </div>

                {/* ATS Suggestions */}
                {atsResult.suggestions.length > 0 && (
                    <div className="mt-4 space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-3">Improvement Actions</p>
                        {atsResult.suggestions.slice(0, 4).map((s, i) => (
                            <div key={i} className="flex items-start gap-2">
                                <Zap className="w-3 h-3 text-accent shrink-0 mt-0.5" />
                                <p className="text-[9px] font-bold opacity-60 leading-relaxed">{s}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Original content strength */}
                <div className="mt-6 pt-6 border-t border-background/10">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-background/10 rounded-xl">
                            <Award className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed">
                                Content Strength: <span className="text-accent">{atsColor.label} Grade</span>
                            </p>
                            <p className="text-[8px] font-bold opacity-40 mt-1 leading-relaxed">
                                {atsResult.score >= 85 ? 'Your profile is optimized for enterprise recruitment.' : 'Follow the improvement actions above to reach Elite ATS score.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── NEW: Target Role Selector + Keyword Analysis ── */}
            <div className="bg-background/30 rounded-[2rem] border border-primary/5 overflow-hidden">
                <button
                    onClick={() => setShowKeywords(v => !v)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-primary/5 transition-all"
                >
                    <div className="flex items-center gap-3">
                        <Target className="w-4 h-4 text-accent" />
                        <span className="text-[10px] font-black uppercase tracking-widest">ATS Keyword Gap Analysis</span>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black ${kwResult.missing.length === 0 ? 'bg-green-500/10 text-green-500' : 'bg-accent/10 text-accent'}`}>
                            {kwResult.missing.length} missing
                        </span>
                    </div>
                    {showKeywords ? <ChevronUp className="w-4 h-4 opacity-40" /> : <ChevronDown className="w-4 h-4 opacity-40" />}
                </button>

                <AnimatePresence>
                    {showKeywords && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="px-6 pb-6 space-y-5">
                                {/* Role selector */}
                                <div>
                                    <label className={labelClasses}>Target Role</label>
                                    <div className="flex flex-wrap gap-2">
                                        {ROLES.map(r => (
                                            <button
                                                key={r.id}
                                                onClick={() => setTargetRole(r.id)}
                                                className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${targetRole === r.id ? 'bg-primary text-background border-primary' : 'border-primary/10 text-primary/40 hover:border-primary/30'}`}
                                            >
                                                {r.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Present keywords */}
                                {kwResult.present.length > 0 && (
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-green-500/60 mb-2">✓ Present Keywords ({kwResult.present.length}/{kwResult.total})</p>
                                        <div className="flex flex-wrap gap-2">
                                            {kwResult.present.map((kw, i) => (
                                                <span key={i} className="px-2 py-1 rounded-lg bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-wider border border-green-500/20">{kw}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Missing keywords */}
                                {kwResult.missing.length > 0 && (
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-accent/60 mb-2">⚠ Missing Keywords — Add to skills or summary</p>
                                        <div className="flex flex-wrap gap-2">
                                            {kwResult.missing.map((kw, i) => (
                                                <span key={i} className="px-2 py-1 rounded-lg bg-accent/10 text-accent text-[8px] font-black uppercase tracking-wider border border-accent/20">{kw}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── NEW: Validation Panel ──────────────────────────── */}
            {validation.totalIssues > 0 && (
                <div className="bg-background/30 rounded-[2rem] border border-primary/5 overflow-hidden">
                    <button
                        onClick={() => setShowValidation(v => !v)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-primary/5 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-4 h-4 text-accent" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Section Quality Check</span>
                            {validation.errors.length > 0 && (
                                <span className="px-2 py-0.5 rounded-full text-[8px] font-black bg-red-500/10 text-red-500">{validation.errors.length} errors</span>
                            )}
                            {validation.warnings.length > 0 && (
                                <span className="px-2 py-0.5 rounded-full text-[8px] font-black bg-yellow-500/10 text-yellow-500">{validation.warnings.length} warnings</span>
                            )}
                        </div>
                        {showValidation ? <ChevronUp className="w-4 h-4 opacity-40" /> : <ChevronDown className="w-4 h-4 opacity-40" />}
                    </button>
                    <AnimatePresence>
                        {showValidation && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="px-6 pb-6 space-y-3">
                                    {validation.errors.map((e, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                                            <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                                            <div>
                                                <span className="text-[8px] font-black uppercase tracking-widest text-red-500">{e.field}</span>
                                                <p className="text-[10px] font-bold text-primary/70 mt-0.5">{e.msg}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {validation.warnings.map((w, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
                                            <AlertCircle className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />
                                            <div>
                                                <span className="text-[8px] font-black uppercase tracking-widest text-yellow-500">{w.field}</span>
                                                <p className="text-[10px] font-bold text-primary/70 mt-0.5">{w.msg}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

        </div>
    );
};

export default DataEditor;
