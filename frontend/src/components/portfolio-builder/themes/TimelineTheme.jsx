import React from 'react';
import { motion } from 'framer-motion';
import { MousePointer2, Briefcase, GraduationCap, Trophy, Link, Mail, Linkedin, Github } from 'lucide-react';

const TimelineTheme = ({ data }) => {
    if (!data) return null;

    const sections = [
        { title: 'Experience', items: data.experience || [], icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Education', items: data.education || [], icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50' },
        { title: 'Projects', items: data.projects || [], icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    return (
        <div className="max-w-4xl mx-auto p-12 bg-[#0a0a0a] text-white font-sans min-h-screen">
            <header className="mb-24 flex flex-col items-center text-center">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-8"
                >
                    <div className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 mb-4">The Professional Journey</div>
                    <h1 className="text-7xl font-black uppercase tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                        {data.name}
                    </h1>
                    <p className="text-xl font-bold text-blue-500 uppercase tracking-widest">{data.title}</p>
                </motion.div>

                <div className="flex gap-8">
                    {data.email && <Mail size={18} className="text-white/20 hover:text-blue-500 transition-colors cursor-pointer" />}
                    {data.linkedin && <Linkedin size={18} className="text-white/20 hover:text-blue-500 transition-colors cursor-pointer" />}
                    {data.github && <Github size={18} className="text-white/20 hover:text-blue-500 transition-colors cursor-pointer" />}
                </div>
            </header>

            <div className="relative pl-8 border-l border-white/10 space-y-24">
                {/* Summary node */}
                <div className="relative">
                    <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-blue-600 border-4 border-[#0a0a0a] ring-4 ring-blue-600/20" />
                    <div className="max-w-2xl">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-6">Briefing</h2>
                        <p className="text-2xl font-medium leading-relaxed text-white/80">
                            {data.summary || data.bio}
                        </p>
                    </div>
                </div>

                {sections.map((section, sidx) => section.items.length > 0 && (
                    <div key={sidx} className="space-y-16">
                        <div className="relative">
                            <div className={`absolute -left-[41px] top-1/2 -translate-y-1/2 p-2 ${section.bg} ${section.color} rounded-xl border-4 border-[#0a0a0a]`}>
                                <section.icon size={16} />
                            </div>
                            <h2 className="text-4xl font-black uppercase tracking-tighter text-white/20">{section.title}</h2>
                        </div>

                        <div className="space-y-12">
                            {section.items.map((item, iidx) => (
                                <div key={iidx} className="relative group">
                                    <div className="absolute -left-[35px] top-3 w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-blue-600 group-hover:scale-150 transition-all" />
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="md:col-span-1">
                                            <span className="text-xs font-black uppercase tracking-widest text-white/30">{item.period || item.duration || item.year}</span>
                                        </div>
                                        <div className="md:col-span-3">
                                            <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-blue-400 transition-colors mb-2">
                                                {item.role || item.degree || item.title}
                                            </h3>
                                            <p className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">
                                                {item.company || item.institution}
                                            </p>
                                            <p className="text-sm leading-relaxed text-white/60 max-w-xl">
                                                {item.desc || item.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <footer className="mt-32 pt-16 border-t border-white/5 text-center flex flex-col items-center">
                <div className="w-1 h-12 bg-gradient-to-b from-blue-600 to-transparent mb-8" />
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/10 italic">Chronological Protocol Completed</p>
            </footer>
        </div>
    );
};

export default TimelineTheme;
