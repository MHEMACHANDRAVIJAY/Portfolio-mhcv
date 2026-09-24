import React, { useState } from 'react';
import { Mail, Phone, Linkedin, Github, Palette, Sun, Moon } from 'lucide-react';

const CustomTheme = ({ data }) => {
    // These states would ideally be lifted to the builder level, 
    // but for the preview, we'll default to some high-end values or detect from context/props
    const [accentColor, setAccentColor] = useState('#ff3366');
    const [isDarkMode, setIsDarkMode] = useState(false);

    const bgClass = isDarkMode ? 'bg-[#111] text-white' : 'bg-white text-gray-900';
    const borderClass = isDarkMode ? 'border-white/5' : 'border-gray-100';
    const mutedText = isDarkMode ? 'text-white/40' : 'text-gray-400';

    return (
        <div className={`min-h-full font-inter transition-colors duration-700 ${bgClass}`}>
            {/* Custom Theme Toolbar (Optional overlay in preview) */}
            <div className="sticky top-0 z-30 p-4 backdrop-blur-md bg-white/5 border-b border-black/5 flex items-center justify-center gap-6">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Accent</span>
                    <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-6 h-6 rounded-full overflow-hidden border-none pointer-cursor"
                    />
                </div>
                <div className="h-4 w-[1px] bg-black/5" />
                <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                >
                    {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
                </button>
            </div>

            <div className="max-w-4xl mx-auto px-12 py-20">
                <header className="flex flex-col items-center text-center mb-24">
                    <div className="w-16 h-1 bg-gray-200 mb-8 rounded-full" />
                    <h1 className="text-6xl font-black uppercase tracking-tight mb-4" style={{ color: isDarkMode ? 'white' : 'black' }}>
                        {data?.name || 'Professional Name'}
                    </h1>
                    <p className="text-xl font-bold uppercase tracking-[0.4em]" style={{ color: accentColor }}>
                        {data?.title || 'Expert'}
                    </p>

                    <div className="flex gap-8 mt-12">
                        {data.email && <Mail size={18} className={mutedText} />}
                        {data.linkedin && <Linkedin size={18} className={mutedText} />}
                        {data.github && <Github size={18} className={mutedText} />}
                    </div>
                </header>

                <main className="space-y-24">
                    {/* Simplified Layout Sections */}
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.6em] mb-12" style={{ color: accentColor }}>Summary</h2>
                        <div className="pl-12 border-l-2" style={{ borderColor: accentColor }}>
                            <p className="text-2xl font-medium leading-tight">{data.summary}</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.6em] mb-12" style={{ color: accentColor }}>Execution</h2>
                        <div className="space-y-16">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="group">
                                    <div className="flex items-baseline justify-between mb-4">
                                        <h3 className="text-3xl font-black uppercase tracking-tighter">{exp.role}</h3>
                                        <span className="text-xs font-black opacity-30">{exp.period}</span>
                                    </div>
                                    <p className="text-xs font-black uppercase tracking-widest mb-6 opacity-40">{exp.company}</p>
                                    <p className={`text-md leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`}>{exp.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="grid grid-cols-2 gap-12">
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] mb-8" style={{ color: accentColor }}>Academy</h2>
                            <div className="space-y-8">
                                {data.education.map((edu, i) => (
                                    <div key={i}>
                                        <h4 className="text-lg font-black uppercase leading-tight">{edu.degree}</h4>
                                        <p className="text-[9px] font-black uppercase tracking-widest mt-2" style={{ color: accentColor }}>{edu.year}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] mb-8" style={{ color: accentColor }}>Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {Object.values(data.skills || {}).flat().map((skill, i) => (
                                    <span key={i} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${borderClass}`}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CustomTheme;
