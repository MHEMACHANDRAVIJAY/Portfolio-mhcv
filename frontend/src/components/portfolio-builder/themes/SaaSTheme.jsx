import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, ExternalLink, Sparkles, Globe } from 'lucide-react';

const SaaSTheme = ({ data }) => {
    if (!data) return null;

    return (
        <div className="max-w-[1200px] mx-auto bg-slate-50 min-h-screen font-sans text-slate-900 selection:bg-indigo-100">
            {/* SaaS Tech Header */}
            <header className="p-16 pt-32 text-center bg-white relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-indigo-50/50 to-transparent -z-10" />

                <div className="max-w-[800px] mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-12">
                        <Sparkles size={12} /> Digital Product Architect
                    </div>
                    <h1 className="text-7xl font-black tracking-tighter text-slate-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-900 to-indigo-600">
                        {data.name}
                    </h1>
                    <p className="text-2xl font-bold text-slate-400 mb-12 uppercase tracking-widest">{data.title}</p>

                    <div className="flex flex-wrap justify-center gap-4">
                        {data.contact?.email && <div className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-200">Contact Intel</div>}
                        {data.contact?.linkedin && <div className="px-8 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-indigo-200 hover:text-indigo-600 transition-all cursor-pointer">LinkedIn</div>}
                        {data.contact?.github && <div className="px-8 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-indigo-200 hover:text-indigo-600 transition-all cursor-pointer">GitHub</div>}
                    </div>
                </div>
            </header>

            <div className="px-16 py-24 grid grid-cols-12 gap-16">
                {/* Product Bio */}
                <section className="col-span-12 lg:col-span-8 p-12 bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-100">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-600 mb-10">Strategic Narrative</h2>
                    <p className="text-xl leading-relaxed text-slate-600 font-medium">{data.summary}</p>
                </section>

                {/* Tech Stack Card */}
                <section className="col-span-12 lg:col-span-4 p-12 bg-slate-900 rounded-[3rem] text-white shadow-2xl">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 mb-12 text-center">Core Infrastructure</h2>
                    <div className="space-y-10">
                        {Object.entries(data.skills).map(([key, skills]) => skills.length > 0 && (
                            <div key={key}>
                                <h3 className="text-[9px] font-bold text-slate-500 uppercase mb-4 tracking-widest">{key}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((s, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-indigo-200">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Road Map (Experience) */}
                <section className="col-span-12 space-y-12">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-12 text-center">Implementation History</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {(data.experience || []).map((exp, i) => (
                            <div key={i} className="p-10 bg-white rounded-[2.5rem] border border-slate-100 hover:border-indigo-200 transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                                        {exp.period}
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{exp.role}</h3>
                                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-6">{exp.company}</p>
                                <p className="text-sm text-slate-500 leading-relaxed line-clamp-4">{exp.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Projects Section */}
                <section className="col-span-12 py-12">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-600 mb-12 text-center">Shipped Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {(data.projects || []).map((proj, i) => (
                            <div key={i} className="group relative overflow-hidden bg-slate-900 rounded-[3rem] p-12">
                                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:rotate-12 transition-transform">
                                    <Globe size={100} className="text-white" />
                                </div>
                                <h3 className="text-3xl font-black text-white mb-6 tracking-tighter">{proj.title}</h3>
                                <p className="text-slate-400 leading-relaxed mb-8 max-w-[400px]">{proj.desc}</p>
                                <div className="flex items-center gap-4 text-white/40 text-[10px] font-black uppercase tracking-widest">
                                    <span>V1.0.0</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                    <span>Production Ready</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <footer className="p-24 text-center border-t border-slate-200 mt-24">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 italic">Modern SaaS Visual Infrastructure V5.2.0 • Build 8492</p>
            </footer>
        </div>
    );
};

export default SaaSTheme;
