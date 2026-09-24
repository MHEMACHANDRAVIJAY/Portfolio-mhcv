import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Linkedin, Github, Globe, MapPin, ExternalLink, Award, Code, Briefcase, GraduationCap } from 'lucide-react';

const BentoTheme = ({ data }) => {
    if (!data) return null;

    const cards = [
        {
            id: 'hero',
            className: 'col-span-12 md:col-span-8 row-span-2 bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-12 flex flex-col justify-center',
            content: (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <h1 className="text-6xl font-black uppercase tracking-tighter mb-4">{data.name}</h1>
                    <p className="text-2xl font-bold opacity-80 mb-8">{data.title}</p>
                    <div className="flex gap-4">
                        {data.email && <div className="p-3 bg-white/10 rounded-2xl"><Mail size={20} /></div>}
                        {data.linkedin && <div className="p-3 bg-white/10 rounded-2xl"><Linkedin size={20} /></div>}
                        {data.github && <div className="p-3 bg-white/10 rounded-2xl"><Github size={20} /></div>}
                    </div>
                </motion.div>
            )
        },
        {
            id: 'summary',
            className: 'col-span-12 md:col-span-4 row-span-2 bg-white border border-gray-100 p-8 flex flex-col justify-between',
            content: (
                <>
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit mb-6">
                        <Award size={24} />
                    </div>
                    <p className="text-lg font-medium leading-relaxed text-gray-600 italic">
                        "{data.summary || data.bio}"
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
                        <MapPin size={12} /> {data.location || 'Remote / Global'}
                    </div>
                </>
            )
        },
        {
            id: 'skills',
            className: 'col-span-12 md:col-span-5 bg-gray-900 text-white p-8',
            content: (
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-6">Competencies</h3>
                    <div className="flex flex-wrap gap-2">
                        {Object.values(data.skills || {}).flat().map((skill, i) => (
                            <span key={i} className="px-3 py-1 bg-white/10 rounded-lg text-xs font-bold">{skill.trim()}</span>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: 'experience-count',
            className: 'col-span-12 md:col-span-3 bg-indigo-50 border border-indigo-100 p-8 flex items-center justify-center text-center',
            content: (
                <div>
                    <p className="text-5xl font-black text-indigo-600">{data.experience?.length || 0}</p>
                    <p className="text-xs font-black uppercase tracking-widest text-indigo-400 mt-2">Roles Held</p>
                </div>
            )
        },
        {
            id: 'connect',
            className: 'col-span-12 md:col-span-4 bg-accent text-primary p-8 flex flex-col justify-center',
            content: (
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest mb-4">Let's Connect</h3>
                    <p className="text-sm font-bold opacity-70 mb-4">Available for enterprise collaborations and high-impact projects.</p>
                    <div className="text-xs font-black uppercase tracking-widest border-b border-primary/20 pb-2 w-fit">Registry Active</div>
                </div>
            )
        }
    ];

    return (
        <div className="max-w-6xl mx-auto p-8 font-sans bg-gray-50/50 min-h-screen">
            <div className="grid grid-cols-12 auto-rows-[150px] gap-4">
                {cards.map((card) => (
                    <div key={card.id} className={`${card.className} rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-700 overflow-hidden`}>
                        {card.content}
                    </div>
                ))}

                {/* Experience Cards */}
                {(data.experience || []).map((exp, i) => (
                    <div key={i} className="col-span-12 md:col-span-6 row-span-2 bg-white border border-gray-100 p-8 flex flex-col justify-between hover:border-indigo-200 transition-all group">
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-gray-50 text-gray-400 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <Briefcase size={20} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1 rounded-full">{exp.period || exp.duration}</span>
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight mb-2">{exp.role}</h3>
                            <p className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-4">{exp.company}</p>
                            <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{exp.desc || exp.description}</p>
                        </div>
                    </div>
                ))}

                {/* Education & Projects (Simplified for Bento) */}
                <div className="col-span-12 md:col-span-4 row-span-2 bg-indigo-600 text-white p-8">
                    <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-8">Academic Base</h3>
                    <div className="space-y-8">
                        {(data.education || []).map((edu, i) => (
                            <div key={i}>
                                <h4 className="text-lg font-black leading-tight uppercase mb-1">{edu.degree}</h4>
                                <p className="text-xs font-bold opacity-60 uppercase">{edu.institution}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-span-12 md:col-span-8 bg-white border border-gray-100 p-8 flex items-center justify-between">
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Portfolio Protocol</h3>
                        <p className="text-xl font-black uppercase tracking-tighter text-gray-900">Bento Grid System V1.0</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Code size={20} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BentoTheme;
