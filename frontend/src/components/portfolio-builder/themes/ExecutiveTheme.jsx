import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Star } from 'lucide-react';

const ExecutiveTheme = ({ data }) => {
    if (!data) return null;

    return (
        <div className="max-w-[1200px] mx-auto bg-[#faf9f6]/30 min-h-screen font-serif text-[#1c1c1c] selection:bg-[#e8e4db] py-12">
            <div className="max-w-[1000px] mx-auto bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-[#e8e4db]">
                {/* Executive Header */}
                <header className="p-20 text-center border-b-[20px] border-[#1c1c1c]">
                    <h1 className="text-7xl font-light uppercase tracking-[0.2em] mb-8 leading-none">{data.name}</h1>
                    <div className="flex items-center justify-center gap-6 mb-12">
                        <div className="h-px w-12 bg-[#1c1c1c]/10" />
                        <p className="text-xl font-medium text-[#1c1c1c]/60 italic tracking-widest">{data.title}</p>
                        <div className="h-px w-12 bg-[#1c1c1c]/10" />
                    </div>

                    <div className="flex flex-wrap justify-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-[#1c1c1c]/40">
                        {data.contact?.email && <div className="flex items-center gap-2">{data.contact.email}</div>}
                        {data.contact?.phone && <div className="flex items-center gap-2">{data.contact.phone}</div>}
                        {data.contact?.linkedin && <div className="flex items-center gap-2">LinkedIn Resource</div>}
                    </div>
                </header>

                <div className="p-20 space-y-32">
                    {/* Visionary Summary */}
                    <section className="text-center max-w-[700px] mx-auto">
                        <Star className="mx-auto mb-10 text-[#d4af37]" size={24} />
                        <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#1c1c1c]/20 mb-8">Professional Philosophy</h2>
                        <p className="text-2xl font-light leading-relaxed italic text-[#1c1c1c]/80">
                            "{data.summary}"
                        </p>
                    </section>

                    {/* Career Milestones */}
                    <section>
                        <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#1c1c1c]/20 mb-16 border-b border-[#f0f0f0] pb-6">Career Milestones</h2>
                        <div className="space-y-24">
                            {(data.experience || []).map((exp, i) => (
                                <div key={i} className="grid grid-cols-12 gap-12">
                                    <div className="col-span-12 lg:col-span-4">
                                        <div className="text-[11px] font-black text-[#1c1c1c]/30 uppercase tracking-[0.4em] mb-4">{exp.period}</div>
                                        <h3 className="text-xl font-bold text-[#1c1c1c] tracking-tight">{exp.company}</h3>
                                    </div>
                                    <div className="col-span-12 lg:col-span-8">
                                        <h4 className="text-2xl font-light text-[#1c1c1c] mb-6 italic">{exp.role}</h4>
                                        <div className="text-base text-[#1c1c1c]/60 leading-relaxed font-serif pl-8 border-l border-[#f0f0f0]">
                                            {exp.desc}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Intellectual Property (Projects) */}
                    <section>
                        <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#1c1c1c]/20 mb-16 border-b border-[#f0f0f0] pb-6">Strategic Projects</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                            {(data.projects || []).map((proj, i) => (
                                <div key={i} className="space-y-6">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#d4af37]">Deployment_{i + 1}</h3>
                                    <h4 className="text-2xl font-bold tracking-tight text-[#1c1c1c]">{proj.title}</h4>
                                    <p className="text-base text-[#1c1c1c]/60 leading-relaxed font-serif">{proj.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Core Skills Grid */}
                    <section>
                        <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#1c1c1c]/20 mb-16 border-b border-[#f0f0f0] pb-6">System Architecture</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                            {Object.entries(data.skills).map(([key, skills]) => skills.length > 0 && (
                                <div key={key}>
                                    <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1c1c1c]/30 mb-6">{key}</h3>
                                    <div className="space-y-3">
                                        {skills.map((s, i) => (
                                            <div key={i} className="text-xs font-bold text-[#1c1c1c]/70">{s}</div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <footer className="p-20 bg-[#1c1c1c] text-[#faf9f6] text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.8em] opacity-30 italic">Confidential Executive Dossier • 2024</p>
                </footer>
            </div>
        </div>
    );
};

export default ExecutiveTheme;
