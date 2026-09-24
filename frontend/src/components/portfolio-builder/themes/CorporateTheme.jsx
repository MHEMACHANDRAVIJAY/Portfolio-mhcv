import React from 'react';
import { Mail, Phone, Linkedin, Github, Shield, Award } from 'lucide-react';

const CorporateTheme = ({ data }) => {
    if (!data) return null;

    return (
        <div className="max-w-[1200px] mx-auto bg-white text-[#1e293b] font-serif selection:bg-slate-200">
            {/* Executive Masthead */}
            <header className="p-16 text-center border-b-8 border-slate-900 bg-[#f8fafc]">
                <h1 className="text-6xl font-black uppercase tracking-tighter text-slate-900 mb-6">{data.name}</h1>
                <p className="text-xl font-bold text-slate-500 uppercase tracking-[0.4em] mb-12">{data.title}</p>

                <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {data.contact?.email && <div className="flex items-center gap-2"><Mail size={12} className="text-slate-900" /> {data.contact.email}</div>}
                    {data.contact?.phone && <div className="flex items-center gap-2"><Phone size={12} className="text-slate-900" /> {data.contact.phone}</div>}
                    {data.contact?.location && <div className="flex items-center gap-2"> {data.contact.location}</div>}
                </div>
            </header>

            <div className="p-16 grid grid-cols-12 gap-16">
                {/* Lateral Navigation Sidebar (Simulated) */}
                <aside className="col-span-12 lg:col-span-4 space-y-16">
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8 border-l-4 border-slate-900 pl-4">Intellectual Capital</h2>
                        <div className="space-y-8">
                            {Object.entries(data.skills).map(([key, skills]) => skills.length > 0 && (
                                <div key={key}>
                                    <h3 className="text-[9px] font-bold text-slate-300 uppercase mb-4 tracking-widest">{key}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((s, i) => (
                                            <span key={i} className="text-[11px] font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8 border-l-4 border-slate-900 pl-4">Academic Background</h2>
                        <div className="space-y-6">
                            {(data.education || []).map((edu, i) => (
                                <div key={i}>
                                    <h3 className="text-sm font-black text-slate-900 leading-tight">{edu.degree}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{edu.institution}</p>
                                    <p className="text-[10px] font-black text-slate-900 mt-1">{edu.year}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </aside>

                {/* Main Component Block */}
                <main className="col-span-12 lg:col-span-8 space-y-20">
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-10 pb-4 border-b border-slate-100">Executive Summary</h2>
                        <p className="text-xl leading-relaxed text-slate-700 font-medium italic">"{data.summary}"</p>
                    </section>

                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-10 pb-4 border-b border-slate-100">Professional Record</h2>
                        <div className="space-y-16">
                            {(data.experience || []).map((exp, i) => (
                                <div key={i} className="relative">
                                    <div className="flex justify-between items-baseline mb-4">
                                        <h3 className="text-2xl font-black text-slate-900">{exp.role}</h3>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{exp.period}</span>
                                    </div>
                                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 opacity-60">{exp.company}</p>
                                    <div className="text-base text-slate-600 leading-relaxed font-serif pl-8 border-l border-slate-200">
                                        {exp.desc}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-10 pb-4 border-b border-slate-100">Strategic Projects</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {(data.projects || []).map((proj, i) => (
                                <div key={i} className="p-8 border-2 border-slate-900 bg-white shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                                    <h3 className="text-lg font-black uppercase tracking-tight mb-4">{proj.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed font-serif">{proj.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>

            <footer className="p-16 border-t-8 border-slate-900 text-center bg-[#f8fafc]">
                <div className="flex justify-center gap-12 mb-8 opacity-20">
                    <Shield size={24} />
                    <Award size={24} />
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.6em] text-slate-400">Privileged & Confidential Correspondence</p>
            </footer>
        </div>
    );
};

export default CorporateTheme;
