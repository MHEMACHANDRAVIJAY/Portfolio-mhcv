import React from 'react';

const MinimalTheme = ({ data }) => {
    if (!data) return null;

    const allSkills = Object.values(data.skills || {}).flat();

    return (
        <div className="max-w-[800px] mx-auto bg-white text-[#333] font-sans py-32 px-12 selection:bg-black selection:text-white">
            {/* Minimal Header */}
            <header className="mb-32">
                <h1 className="text-4xl font-black mb-4 tracking-tighter uppercase">{data.name}</h1>
                <p className="text-lg font-medium text-slate-400 mb-12 tracking-tight">{data.title}</p>

                <div className="flex flex-wrap gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-300">
                    {data.contact?.email && <div>{data.contact.email}</div>}
                    {data.contact?.linkedin && <div>LinkedIn</div>}
                    {data.contact?.github && <div>GitHub</div>}
                </div>
            </header>

            <div className="space-y-32">
                {/* Intro */}
                <section>
                    <p className="text-xl leading-relaxed text-slate-600 font-medium">
                        {data.summary}
                    </p>
                </section>

                {/* Role List */}
                {data.experience?.length > 0 && (
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200 mb-12">Experience</h2>
                        <div className="space-y-16">
                            {data.experience.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline mb-4">
                                        <h3 className="text-lg font-black">{exp.role}</h3>
                                        <span className="text-[10px] font-bold text-slate-300 uppercase">{exp.period}</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{exp.company}</p>
                                    <p className="text-base text-slate-500 leading-relaxed max-w-[600px]">{exp.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skill List */}
                {allSkills.length > 0 && (
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200 mb-12">Capabilities</h2>
                        <div className="flex flex-wrap gap-x-12 gap-y-6">
                            {allSkills.map((s, i) => (
                                <span key={i} className="text-sm font-bold text-slate-500 uppercase tracking-widest">{s}</span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Simple Projects */}
                {data.projects?.length > 0 && (
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200 mb-12">Projects</h2>
                        <div className="grid grid-cols-1 gap-12">
                            {data.projects.map((proj, i) => (
                                <div key={i}>
                                    <h3 className="text-lg font-black mb-2">{proj.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed max-w-[600px]">{proj.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <footer className="mt-32 pt-12 border-t border-slate-100">
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-200">2024 • Minimal Portfolio Infrastructure</p>
            </footer>
        </div>
    );
};

export default MinimalTheme;
