import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Code, Database, Cpu, Globe } from 'lucide-react';

const TechTheme = ({ data }) => {
    if (!data) return null;

    const Tag = ({ children }) => (
        <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded font-mono text-[10px] border border-green-500/20">
            {children}
        </span>
    );

    return (
        <div className="max-w-6xl mx-auto p-12 bg-[#0d1117] text-[#c9d1d9] font-mono min-h-screen">
            {/* Dev Terminal Header */}
            <header className="mb-16 border border-[#30363d] rounded-xl overflow-hidden shadow-2xl">
                <div className="bg-[#161b22] px-4 py-3 border-b border-[#30363d] flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    </div>
                    <div className="text-[10px] font-bold text-[#8b949e] ml-4 flex items-center gap-2">
                        <Terminal size={12} /> portfolio.sys — 80x24
                    </div>
                </div>
                <div className="p-10">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="text-green-500 mb-2">class <span className="text-blue-400">{data.name.replace(/\s+/g, '')}</span> {'{'}</div>
                        <div className="pl-6 space-y-2">
                            <div><span className="text-purple-400">role:</span> <span className="text-[#a5d6ff]">"{data.title}"</span>;</div>
                            <div><span className="text-purple-400">status:</span> <span className="text-green-500">AVAILABLE_FOR_HIRE</span>;</div>
                            <div><span className="text-purple-400">contact:</span> {'{'}</div>
                            <div className="pl-6 space-y-1">
                                {data.email && <div><span className="text-orange-400">email:</span> <span className="text-[#a5d6ff]">"{data.email}"</span>,</div>}
                                {data.location && <div><span className="text-orange-400">location:</span> <span className="text-[#a5d6ff]">"{data.location}"</span>,</div>}
                                {data.github && <div><span className="text-orange-400">github:</span> <span className="text-[#a5d6ff]">"{data.github}"</span></div>}
                            </div>
                            <div>{'}'}</div>
                        </div>
                        <div className="text-green-500 mt-2">{'}'}</div>
                    </motion.div>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-8">
                {/* Main Logic */}
                <div className="col-span-12 lg:col-span-8 space-y-8">
                    <section className="border border-[#30363d] rounded-xl p-8 bg-[#161b22]/50">
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white mb-8 flex items-center gap-3">
                            <span className="text-green-500">&lt;</span> EXPERIENCE <span className="text-green-500">/&gt;</span>
                        </h2>
                        <div className="space-y-10">
                            {(data.experience || []).map((exp, i) => (
                                <div key={i} className="relative pl-6 border-l border-[#30363d]">
                                    <h3 className="text-blue-400 font-bold mb-1">{exp.role}</h3>
                                    <div className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest mb-4">
                                        {exp.company} <span className="mx-2 text-[#30363d]">|</span> {exp.period || exp.duration}
                                    </div>
                                    <p className="text-sm text-[#8b949e] leading-relaxed font-sans">{exp.desc || exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {(data.projects || []).map((proj, i) => (
                            <div key={i} className="border border-[#30363d] rounded-xl p-6 bg-[#161b22]/50 hover:border-green-500/30 transition-colors group">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-green-500 font-bold text-sm tracking-tight">{proj.title}</h3>
                                    <Globe size={14} className="text-[#30363d] group-hover:text-green-500 transition-colors" />
                                </div>
                                <p className="text-xs text-[#8b949e] leading-relaxed font-sans mb-6">{proj.desc || proj.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {(proj.tech || '').split(',').map((t, j) => (
                                        <Tag key={j}>{t.trim()}</Tag>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </section>
                </div>

                {/* System Specs Sidebar */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                    <section className="border border-[#30363d] rounded-xl p-6 bg-[#161b22]">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-6 flex items-center gap-2">
                            <Cpu size={14} /> SYSTEM_STACK
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {Object.values(data.skills || {}).flat().map((skill, i) => (
                                <div key={i} className="px-3 py-1 bg-[#0d1117] border border-[#30363d] text-[10px] text-[#8b949e] rounded hover:text-green-500 hover:border-green-500/50 transition-all cursor-default">
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="border border-[#30363d] rounded-xl p-6 bg-[#161b22]">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-purple-400 mb-6 flex items-center gap-2">
                            <Database size={14} /> ACADEMIC_LOGS
                        </h2>
                        <div className="space-y-6">
                            {(data.education || []).map((edu, i) => (
                                <div key={i}>
                                    <p className="text-[11px] font-bold text-[#c9d1d9] leading-tight mb-2 underline decoration-[#30363d]">{edu.degree}</p>
                                    <p className="text-[10px] text-[#8b949e]">{edu.institution}</p>
                                    <div className="mt-2 text-[9px] font-mono text-green-500/50">Timestamp: {edu.year}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            <footer className="mt-20 py-8 border-t border-[#30363d] text-center text-[#30363d] text-[10px] font-bold uppercase tracking-[0.4em]">
                DevOps Certified Architecture V3.1415
            </footer>
        </div>
    );
};

export default TechTheme;
