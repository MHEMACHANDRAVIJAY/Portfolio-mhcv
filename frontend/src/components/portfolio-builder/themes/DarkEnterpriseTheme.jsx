import React from 'react';
import { Shield, Zap, Terminal, Activity, Code, Globe, Mail, MapPin, Linkedin, Github } from 'lucide-react';

const DarkEnterpriseTheme = ({ data }) => {
    if (!data) return null;

    return (
        <div className="max-w-[1200px] mx-auto bg-[#0a0a0c] text-[#e2e8f0] font-mono selection:bg-emerald-500/20 min-h-screen border-x border-[#1e1e24]">
            {/* Terminal Style Header */}
            <header className="p-16 border-b border-[#1e1e24] bg-[#0d0d0f] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                <div className="relative">
                    <div className="flex items-center gap-3 mb-8 text-emerald-500">
                        <Terminal size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">System Operational</span>
                    </div>

                    <h1 className="text-7xl font-black uppercase tracking-tighter mb-4 text-white">
                        {data.name}
                    </h1>
                    <p className="text-xl font-bold text-emerald-500/80 mb-12 flex items-center gap-4">
                        <span className="opacity-50 text-xs">ARCHITECT_ROLE:</span> {data.title}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {data.contact?.email && (
                            <div className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-emerald-500/30 transition-all group">
                                <div className="text-[8px] font-black uppercase tracking-widest text-[#52525b] mb-2 group-hover:text-emerald-500">Email_Access</div>
                                <div className="text-xs font-bold text-[#a1a1aa]">{data.contact.email}</div>
                            </div>
                        )}
                        {data.contact?.phone && (
                            <div className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-emerald-500/30 transition-all group">
                                <div className="text-[8px] font-black uppercase tracking-widest text-[#52525b] mb-2 group-hover:text-emerald-500">Secure_Comms</div>
                                <div className="text-xs font-bold text-[#a1a1aa]">{data.contact.phone}</div>
                            </div>
                        )}
                        {data.contact?.location && (
                            <div className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-emerald-500/30 transition-all group">
                                <div className="text-[8px] font-black uppercase tracking-widest text-[#52525b] mb-2 group-hover:text-emerald-500">Geospatial_Loc</div>
                                <div className="text-xs font-bold text-[#a1a1aa]">{data.contact.location}</div>
                            </div>
                        )}
                        <div className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-emerald-500/30 transition-all group">
                            <div className="text-[8px] font-black uppercase tracking-widest text-[#52525b] mb-2 group-hover:text-emerald-500">Encryption</div>
                            <div className="text-xs font-bold text-[#a1a1aa]">AES-256 Enabled</div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="p-16 space-y-32">
                {/* System Core (Skills) */}
                <section>
                    <div className="flex items-center gap-4 mb-12">
                        <Activity className="text-emerald-500" size={18} />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#52525b]">System_Core_Competencies</h2>
                        <div className="flex-1 h-px bg-[#1e1e24]" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {Object.entries(data.skills).map(([key, skills]) => skills.length > 0 && (
                            <div key={key} className="space-y-6">
                                <h3 className="text-[9px] font-black text-emerald-500/40 uppercase tracking-widest">{key}_MODULES</h3>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((s, i) => (
                                        <div key={i} className="flex items-center gap-2 px-3 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded overflow-hidden">
                                            <div className="w-1 h-1 bg-emerald-500" />
                                            <span className="text-[11px] font-bold text-[#a1a1aa]">{s}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Experience Logs */}
                <section>
                    <div className="flex items-center gap-4 mb-12">
                        <Activity className="text-emerald-500" size={18} />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#52525b]">Project_Implementation_Logs</h2>
                        <div className="flex-1 h-px bg-[#1e1e24]" />
                    </div>

                    <div className="space-y-16">
                        {(data.experience || []).map((exp, i) => (
                            <div key={i} className="grid grid-cols-12 gap-8 group">
                                <div className="col-span-12 lg:col-span-3 text-[10px] font-black text-[#52525b] uppercase tracking-widest py-2">
                                    {exp.period}
                                </div>
                                <div className="col-span-12 lg:col-span-9 p-8 border border-white/5 bg-white/[0.02] rounded-2xl group-hover:border-emerald-500/20 group-hover:bg-emerald-500/[0.01] transition-all">
                                    <h3 className="text-2xl font-black text-white mb-2">{exp.role}</h3>
                                    <p className="text-xs font-bold text-emerald-500/60 uppercase tracking-widest mb-6">{exp.company}</p>
                                    <div className="text-base text-[#71717a] leading-relaxed font-sans opacity-80 group-hover:opacity-100 transition-opacity">
                                        {exp.desc}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Secure Projects */}
                <section>
                    <div className="flex items-center gap-4 mb-12">
                        <Shield className="text-emerald-500" size={18} />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#52525b]">Secured_Deployments</h2>
                        <div className="flex-1 h-px bg-[#1e1e24]" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {(data.projects || []).map((proj, i) => (
                            <div key={i} className="p-10 bg-[#0d0d0f] border border-[#1e1e24] rounded-3xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[64px] group-hover:bg-emerald-500/10 transition-all" />
                                <h3 className="text-xl font-black text-white mb-4 tracking-tight uppercase">{proj.title}</h3>
                                <p className="text-sm text-[#71717a] leading-relaxed mb-8">{proj.desc}</p>
                                <div className="flex items-center gap-3 text-[9px] font-black text-[#3f3f46] uppercase tracking-widest">
                                    <Code size={12} /> Binary Analysis Confirmed
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <footer className="p-16 border-t border-[#1e1e24] text-center bg-[#0d0d0f]">
                <div className="flex justify-center gap-8 mb-8">
                    <Zap className="text-emerald-500/20" size={24} />
                </div>
                <p className="text-[9px] font-black uppercase tracking-[1em] text-[#3f3f46]">SECURE_SYSTEM_ENTITY_AUTH_LEVEL_9</p>
            </footer>
        </div>
    );
};

export default DarkEnterpriseTheme;
