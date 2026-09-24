import React from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, GraduationCap, Code, Mail, Phone, MapPin, Linkedin, Github, ExternalLink } from 'lucide-react';

const SidebarTheme = ({ data }) => {
    if (!data) return null;

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-white text-gray-900 font-inter">
            {/* Sidebar */}
            <aside className="w-full md:w-80 md:h-screen md:sticky md:top-0 bg-[#f8f9fa] border-r border-gray-100 p-10 flex flex-col justify-between">
                <div>
                    <div className="w-20 h-20 bg-gray-900 text-white rounded-[2rem] flex items-center justify-center text-3xl font-black mb-10 shadow-lg">
                        {data.name?.charAt(0)}
                    </div>
                    <h1 className="text-3xl font-black tracking-tight mb-2 leading-none uppercase">{data.name}</h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-10">{data.title}</p>

                    <nav className="space-y-6">
                        <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 cursor-pointer transition-colors group">
                            <User size={14} className="group-hover:text-blue-600" /> Profile
                        </div>
                        <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 cursor-pointer transition-colors group">
                            <Briefcase size={14} className="group-hover:text-blue-600" /> Experience
                        </div>
                        <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 cursor-pointer transition-colors group">
                            <Code size={14} className="group-hover:text-blue-600" /> Skills
                        </div>
                    </nav>
                </div>

                <div className="mt-20 space-y-4">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500">
                        <Mail size={12} /> {data.email}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500">
                        <MapPin size={12} /> {data.location || 'Global'}
                    </div>
                    <div className="flex gap-4 pt-6">
                        {data.linkedin && <Linkedin size={16} className="text-gray-300 hover:text-gray-900 cursor-pointer" />}
                        {data.github && <Github size={16} className="text-gray-300 hover:text-gray-900 cursor-pointer" />}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-12 md:p-24 max-w-5xl">
                <section className="mb-32">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300 mb-12">01. Briefing</h2>
                    <p className="text-4xl font-medium leading-[1.1] text-gray-900">
                        {data.summary || data.bio}
                    </p>
                </section>

                <section className="mb-32">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300 mb-12">02. Experience</h2>
                    <div className="space-y-20">
                        {(data.experience || []).map((exp, i) => (
                            <div key={i} className="group">
                                <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-4 gap-2">
                                    <h3 className="text-2xl font-black uppercase tracking-tight group-hover:text-blue-600 transition-colors">{exp.role}</h3>
                                    <span className="text-xs font-black text-gray-300 uppercase tracking-widest">{exp.period || exp.duration}</span>
                                </div>
                                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">{exp.company}</p>
                                <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">{exp.desc || exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-32">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300 mb-12">03. Capabilities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest mb-6">System</h4>
                            <div className="flex flex-wrap gap-2">
                                {Object.values(data.skills || {}).flat().map((skill, i) => (
                                    <span key={i} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-600">{skill.trim()}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest mb-6">Academic</h4>
                            <div className="space-y-4">
                                {(data.education || []).map((edu, i) => (
                                    <div key={i}>
                                        <p className="text-sm font-black uppercase leading-tight">{edu.degree}</p>
                                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">{edu.institution}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="pt-20 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 hover:text-gray-900 transition-colors cursor-default">Sidebar Architecture v1.0</p>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full text-[8px] font-black uppercase tracking-widest text-gray-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Portfolo Protocol
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default SidebarTheme;
