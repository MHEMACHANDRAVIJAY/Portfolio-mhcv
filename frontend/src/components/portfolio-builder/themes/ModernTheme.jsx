import React from 'react';
import { Mail, Phone, Linkedin, Github, ExternalLink, ArrowRight } from 'lucide-react';

const ModernTheme = ({ data }) => {
    if (!data) return null;

    return (
        <div className="max-w-[1200px] mx-auto bg-white text-slate-900 font-sans selection:bg-indigo-600 selection:text-white min-h-screen">
            <header className="px-16 py-32 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/5 -skew-x-12 translate-x-1/2 pointer-events-none" />

                <div className="relative max-w-[800px]">
                    <h1 className="text-8xl font-black tracking-tight mb-8 leading-[0.9] text-slate-900">
                        {data.name}
                    </h1>
                    <div className="h-2 w-32 bg-indigo-600 mb-8" />
                    <p className="text-3xl font-bold text-slate-400 mb-12 tracking-tight uppercase">{data.title}</p>

                    <div className="flex flex-wrap gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                        {data.contact?.email && <div className="flex items-center gap-2 underline underline-offset-8 decoration-indigo-600/30">{data.contact.email}</div>}
                        {data.contact?.linkedin && <div className="flex items-center gap-2 hover:text-indigo-600 transition-colors cursor-pointer">LinkedIn <ExternalLink size={10} /></div>}
                        {data.contact?.github && <div className="flex items-center gap-2 hover:text-indigo-600 transition-colors cursor-pointer">GitHub <ExternalLink size={10} /></div>}
                    </div>
                </div>
            </header>

            <div className="p-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16">
                <main className="lg:col-span-8 space-y-32">
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-600 mb-12">Narrative</h2>
                        {data.structuredSummary ? (
                            <div className="space-y-6">
                                <p className="text-3xl font-medium leading-relaxed text-slate-900 tracking-tight">
                                    {data.structuredSummary.executiveSummary}
                                </p>
                                <p className="text-xl font-medium leading-relaxed text-slate-500">
                                    {data.structuredSummary.professionalBio}
                                </p>
                                <div className="p-8 bg-indigo-50/50 rounded-3xl border border-indigo-100/50 mt-8">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-3">Value Proposition</h3>
                                    <p className="text-lg text-slate-700 font-medium">{data.structuredSummary.valueProposition}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-2xl font-medium leading-relaxed text-slate-600">
                                {data.summary}
                            </p>
                        )}
                    </section>

                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-600 mb-12">Professional History</h2>
                        <div className="space-y-20">
                            {(data.experience || []).map((exp, i) => (
                                <div key={i} className="group">
                                    <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                                        <div>
                                            <h3 className="text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{exp.role}</h3>
                                            <p className="text-lg font-bold text-slate-400 mt-1">{exp.company}</p>
                                        </div>
                                        <div className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-6 py-2 rounded-full self-start">
                                            {exp.period}
                                        </div>
                                    </div>
                                    <p className="text-lg text-slate-500 leading-relaxed font-medium">
                                        {exp.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-600 mb-12">Featured Engineering</h2>
                        <div className="space-y-16">
                            {(data.projects || []).map((proj, i) => (
                                <div key={i} className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(79,70,229,0.1)] transition-all duration-500 group">
                                    <h3 className="text-2xl font-black text-slate-900 mb-6 group-hover:text-indigo-600 transition-colors">{proj.title}</h3>
                                    
                                    {proj.problem ? (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="p-6 bg-slate-50 rounded-3xl">
                                                    <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">The Challenge</h4>
                                                    <p className="text-sm font-medium text-slate-700 leading-relaxed">{proj.problem}</p>
                                                </div>
                                                <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-50">
                                                    <h4 className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-2">The Solution</h4>
                                                    <p className="text-sm font-medium text-slate-700 leading-relaxed">{proj.solution}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100">
                                                <div className="flex-1">
                                                    <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Architecture</h4>
                                                    <p className="text-xs font-bold text-slate-600">{proj.architecture || proj.tech?.join(', ')}</p>
                                                </div>
                                                {proj.impact && (
                                                    <div className="px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-700 text-xs font-bold">
                                                        {proj.impact}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-lg text-slate-500 leading-relaxed font-medium mb-6">
                                                {proj.desc}
                                            </p>
                                            {proj.tech && proj.tech.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {proj.tech.map((t, j) => (
                                                        <span key={j} className="px-3 py-1.5 bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-lg">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </main>

                <aside className="lg:col-span-4 space-y-24">
                    <section className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-600 mb-10">Tech Stack</h2>
                        <div className="space-y-10">
                            {Object.entries(data.skills).map(([key, skills]) => skills.length > 0 && (
                                <div key={key}>
                                    <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-4">{key}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((s, i) => (
                                            <span key={i} className="px-4 py-2 bg-white rounded-xl text-xs font-bold text-slate-600 border border-slate-200 shadow-sm">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="p-10">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-600 mb-10">Academic Foundation</h2>
                        <div className="space-y-8">
                            {(data.education || []).map((edu, i) => (
                                <div key={i}>
                                    <h3 className="text-lg font-black text-slate-900 leading-tight">{edu.degree}</h3>
                                    <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">{edu.institution} • {edu.year}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </aside>
            </div>

            <footer className="p-24 border-t border-slate-100 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-200">Modern Professional Infrastructure • Version 4.8.0</p>
            </footer>
        </div>
    );
};

export default ModernTheme;
