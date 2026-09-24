import React from 'react';

const MonochromeTheme = ({ data }) => {
    if (!data) return null;

    const allSkills = Object.values(data.skills || {}).flat();

    return (
        <div className="max-w-[1200px] mx-auto bg-white text-black font-sans selection:bg-black selection:text-white min-h-screen border-x-4 border-black">
            <header className="p-20 border-b-4 border-black grid grid-cols-12 gap-12">
                <div className="col-span-12 lg:col-span-8">
                    <h1 className="text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-8">
                        {data.name}
                    </h1>
                    <p className="text-2xl font-black uppercase tracking-[0.2em]">{data.title}</p>
                </div>
                <div className="col-span-12 lg:col-span-4 flex flex-col justify-end text-[11px] font-black uppercase tracking-widest gap-2">
                    {data.contact?.email && <div>E: {data.contact.email}</div>}
                    {data.contact?.phone && <div>T: {data.contact.phone}</div>}
                    {data.contact?.linkedin && <div>LI: LinkedIn</div>}
                </div>
            </header>

            <div className="p-20 space-y-32">
                <section className="grid grid-cols-12 gap-12">
                    <div className="col-span-12 lg:col-span-4 self-start">
                        <h2 className="text-[12px] font-black uppercase tracking-[0.5em] mb-4">Summary</h2>
                        <div className="h-1 w-full bg-black/10" />
                    </div>
                    <div className="col-span-12 lg:col-span-8">
                        <p className="text-3xl font-bold leading-tight tracking-tight uppercase">
                            {data.summary}
                        </p>
                    </div>
                </section>

                <section className="grid grid-cols-12 gap-12">
                    <div className="col-span-12 lg:col-span-4 self-start">
                        <h2 className="text-[12px] font-black uppercase tracking-[0.5em] mb-4">Record</h2>
                        <div className="h-1 w-full bg-black/10" />
                    </div>
                    <div className="col-span-12 lg:col-span-8 space-y-24">
                        {(data.experience || []).map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-6 border-b-2 border-black pb-4">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter">{exp.role}</h3>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{exp.period}</span>
                                </div>
                                <p className="text-sm font-black uppercase tracking-[0.3em] mb-10 opacity-40">{exp.company}</p>
                                <p className="text-lg font-bold leading-relaxed max-w-[600px] uppercase tracking-tight">
                                    {exp.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="grid grid-cols-12 gap-12">
                    <div className="col-span-12 lg:col-span-4 self-start">
                        <h2 className="text-[12px] font-black uppercase tracking-[0.5em] mb-4">Intel</h2>
                        <div className="h-1 w-full bg-black/10" />
                    </div>
                    <div className="col-span-12 lg:col-span-8">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                            {allSkills.map((s, i) => (
                                <div key={i} className="text-lg font-black uppercase tracking-tighter border-l-4 border-black pl-6">
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-12 gap-12">
                    <div className="col-span-12 lg:col-span-4 self-start">
                        <h2 className="text-[12px] font-black uppercase tracking-[0.5em] mb-4">Academy</h2>
                        <div className="h-1 w-full bg-black/10" />
                    </div>
                    <div className="col-span-12 lg:col-span-8 space-y-12">
                        {(data.education || []).map((edu, i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <h3 className="text-4xl font-black uppercase tracking-tighter">{edu.degree}</h3>
                                <p className="text-sm font-black uppercase tracking-widest opacity-40">{edu.institution} | {edu.year}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <footer className="p-20 border-t-4 border-black bg-black text-white text-center">
                <p className="text-[10px] font-black uppercase tracking-[1em]">System_Monochrome V9.0.0</p>
            </footer>
        </div>
    );
};

export default MonochromeTheme;
