import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Award, Star, Zap, Cpu } from 'lucide-react';

const LegendTheme = ({ data }) => {
    return (
        <div className="bg-white text-black font-serif min-h-full">
            {/* Massive Header */}
            <header className="px-12 py-32 border-b-[20px] border-black bg-[#fafafa]">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
                    <div className="lg:col-span-8">
                        <motion.h1
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="text-[120px] font-black uppercase leading-[0.8] tracking-[-0.05em] mb-8"
                        >
                            {(data?.name || 'PRO NAME').split(' ').map((n, i) => (
                                <span key={i} className="block">{n}</span>
                            ))}
                        </motion.h1>
                        <div className="h-4 w-64 bg-black mb-8" />
                        <p className="text-3xl font-black uppercase tracking-[-0.02em] text-gray-400 italic">
                            {data.title}
                        </p>
                    </div>
                    <div className="lg:col-span-4 pb-4">
                        <div className="space-y-4 text-xs font-black uppercase tracking-[0.3em] text-black">
                            {data.email && <div className="border-b-2 border-black/5 pb-2">EMAIL: {data.email}</div>}
                            {data.linkedin && <div className="border-b-2 border-black/5 pb-2">NETWORK: {data.linkedin}</div>}
                            {data.github && <div className="border-b-2 border-black/5 pb-2">CODEBASE: {data.github}</div>}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-12 py-32 grid grid-cols-1 lg:grid-cols-12 gap-24">
                {/* Left Side: Summary & Projects */}
                <div className="lg:col-span-7 space-y-32">
                    {data.summary && (
                        <section>
                            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-300 block mb-12">01 / OVERVIEW</span>
                            <p className="text-4xl font-medium leading-[1.1] text-black/90">
                                {data.summary}
                            </p>
                        </section>
                    )}

                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-300 block mb-12">02 / CORE PROJECTS</span>
                            <div className="space-y-12">
                                {data.projects.map((proj, idx) => (
                                    <div key={idx} className="group cursor-default border-t border-black/5 pt-12">
                                        <h3 className="text-6xl font-black uppercase tracking-tighter mb-6 group-hover:italic transition-all duration-500">
                                            {proj.title}
                                        </h3>
                                        <p className="text-lg leading-relaxed text-gray-500 max-w-xl font-medium">
                                            {proj.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Side: Experience, Skills, Education */}
                <div className="lg:col-span-5 space-y-32">
                    {data.experience && data.experience.length > 0 && (
                        <section>
                            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-300 block mb-12">03 / EXPERIENCE</span>
                            <div className="space-y-16">
                                {data.experience.map((exp, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between items-baseline border-b-4 border-black pb-4 mb-4">
                                            <h3 className="text-2xl font-black uppercase tracking-tight">{exp.role}</h3>
                                            <span className="text-[10px] font-black">{exp.period}</span>
                                        </div>
                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">{exp.company}</p>
                                        <p className="text-sm font-medium leading-relaxed text-gray-600 italic">
                                            "{exp.desc}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {Object.values(data.skills || {}).flat().length > 0 && (
                        <section className="bg-black text-white p-12 -mx-12 lg:mx-0">
                            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/30 block mb-12">04 / SYSTEM SKILLS</span>
                            <div className="grid grid-cols-1 gap-4">
                                {Object.values(data.skills || {}).flat().map((skill, idx) => (
                                    <div key={idx} className="flex items-center justify-between border-b border-white/10 pb-4">
                                        <span className="text-xs font-black uppercase tracking-widest">{skill}</span>
                                        <Star size={10} className="text-white/20" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.education && data.education.length > 0 && (
                        <section>
                            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-300 block mb-8">05 / ACADEMIC</span>
                            <div className="space-y-8">
                                {data.education.map((edu, idx) => (
                                    <div key={idx}>
                                        <h3 className="text-lg font-black uppercase">{edu.degree}</h3>
                                        <div className="flex justify-between items-center mt-2">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{edu.institution}</p>
                                            <p className="text-[10px] font-bold text-black uppercase tracking-widest">{edu.year}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>

            <footer className="bg-black text-white px-12 py-24 flex justify-between items-end overflow-hidden">
                <div className="text-[180px] font-black leading-none opacity-5 -mb-28 -ml-12 select-none">
                    LEGEND
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-2 opacity-40">Verification Protocol Active</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">ULTRA PORTFOLIO v2.0</p>
                </div>
            </footer>
        </div>
    );
};

export default LegendTheme;
