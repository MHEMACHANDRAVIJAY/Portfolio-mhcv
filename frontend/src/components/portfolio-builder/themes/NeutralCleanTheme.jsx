import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';

const NeutralCleanTheme = ({ data }) => {
    if (!data) return null;

    return (
        <div className="max-w-[1200px] mx-auto bg-[#fafafa] text-[#2d2d2d] font-sans selection:bg-[#e5e5e5] min-h-screen py-16 px-8">
            <div className="max-w-[900px] mx-auto bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
                <header className="p-16 border-b border-slate-50 bg-[#fdfdfd]">
                    <h1 className="text-5xl font-black tracking-tight text-[#1a1a1a] mb-6">{data.name}</h1>
                    <p className="text-xl font-medium text-slate-400 mb-10 tracking-wide uppercase">{data.title}</p>

                    <div className="flex flex-wrap gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        {data.contact?.email && <div className="flex items-center gap-2 underline decoration-slate-200">{data.contact.email}</div>}
                        {data.contact?.linkedin && <div>LinkedIn</div>}
                        {data.contact?.github && <div>GitHub</div>}
                    </div>
                </header>

                <div className="p-16 space-y-24">
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-10">Brief</h2>
                        <p className="text-lg leading-relaxed text-slate-500 font-medium max-w-[700px]">
                            {data.summary}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-12">Experience Log</h2>
                        <div className="space-y-16">
                            {(data.experience || []).map((exp, i) => (
                                <div key={i} className="relative pl-12 border-l border-slate-100">
                                    <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-slate-200" />
                                    <div className="flex justify-between items-baseline mb-4">
                                        <h3 className="text-xl font-black text-[#1a1a1a]">{exp.role}</h3>
                                        <span className="text-[10px] font-bold text-slate-300 uppercase">{exp.period}</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">{exp.company}</p>
                                    <p className="text-base text-slate-500 leading-relaxed font-medium">
                                        {exp.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-10">Capacities</h2>
                            <div className="space-y-8">
                                {Object.entries(data.skills).map(([key, skills]) => skills.length > 0 && (
                                    <div key={key}>
                                        <h3 className="text-[9px] font-bold text-slate-300 uppercase mb-4 tracking-widest">{key}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.map((s, i) => (
                                                <span key={i} className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-500 border border-slate-100">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-10">Academy</h2>
                            <div className="space-y-8">
                                {(data.education || []).map((edu, i) => (
                                    <div key={i}>
                                        <h3 className="text-lg font-black text-[#1a1a1a] leading-tight">{edu.degree}</h3>
                                        <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">{edu.institution} • {edu.year}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                <footer className="p-16 bg-slate-50 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-300">Clean Professional Standard • 2024</p>
                </footer>
            </div>
        </div>
    );
};

export default NeutralCleanTheme;
