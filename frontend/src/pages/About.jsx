import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Code, Terminal, Layout, Database, Palette, Fingerprint, ShieldCheck, Cpu, Globe, Compass, Layers, Zap, Activity } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const MilestoneItem = ({ year, role, company, desc, latest }) => (
    <div className="relative group pl-12 pb-12 last:pb-0">
        {/* Connector Line */}
        <div className="absolute left-[9px] top-2 bottom-0 w-[2px] bg-primary/10 group-last:hidden" />

        {/* Point Indicator */}
        <div className={`absolute left-0 top-1.5 w-5 h-5 rounded-full border-2 transition-all duration-500 z-10 
      ${latest ? 'bg-accent border-accent shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-125' : 'bg-background border-primary/20 group-hover:border-accent group-hover:scale-110'}`}
        />

        <div className="space-y-2">
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${latest ? 'text-accent' : 'text-primary/30'}`}>
                {year}
            </span>
            <h4 className="text-2xl font-black text-primary tracking-tighter leading-none group-hover:text-accent transition-colors">
                {role}
            </h4>
            <p className="text-sm font-bold text-primary/60 tracking-tight italic">
                {company}
            </p>
            <p className="text-[15px] font-medium text-primary/40 leading-relaxed max-w-xl pt-2">
                {desc}
            </p>
        </div>
    </div>
);

const ExpertiseCard = ({ title, desc, icon: Icon }) => (
    <div className="p-8 rounded-[2.5rem] bg-card border border-primary/10 hover:border-accent/40 hover:bg-accent/[0.02] transition-all duration-500 group shadow-sm hover:shadow-2xl">
        <div className="flex flex-col gap-6">
            <div className="p-4 rounded-2xl bg-primary/5 text-primary/30 group-hover:bg-accent group-hover:text-white transition-all duration-700 shadow-inner w-fit">
                <Icon className="w-6 h-6" />
            </div>
            <div className="space-y-3">
                <h4 className="text-xl font-black text-primary tracking-tighter transition-colors group-hover:text-accent">
                    {title}
                </h4>
                <p className="text-sm font-medium text-primary/50 leading-relaxed">
                    {desc}
                </p>
            </div>
        </div>
    </div>
);

const About = () => {
    const { portfolioData } = usePortfolio();

    // Dynamically compile timeline items
    const timelineItems = [
        ...(portfolioData?.experience || []).map((exp, idx) => ({
            year: exp.period || "Present",
            role: exp.role || "Experience",
            company: exp.company || "Company",
            desc: exp.desc ? exp.desc.replace(/^[•\-*]\s*/gm, '').split('\n').filter(Boolean).join(' ') : "Professional experience and software delivery.",
            latest: idx === 0
        })),
        ...(portfolioData?.education || []).map(edu => ({
            year: edu.period || "Academic Details",
            role: edu.degree || "Degree",
            company: edu.school || edu.institution || "Institution",
            desc: `Academic trajectory ${edu.score ? `with ${edu.score}` : ''}.`,
            latest: false
        })),
        ...(portfolioData?.achievements || []).slice(0, 1).map(ach => ({
            year: "Strategic Achievements",
            role: "Award & Accomplishment",
            company: "Professional Milestones",
            desc: ach,
            latest: false
        }))
    ];

    // Fallback if no timeline items parsed
    if (timelineItems.length === 0) {
        timelineItems.push({
            year: "MAR 2025 - PRESENT",
            role: "Software Developer",
            company: "Startup / Enterprise",
            desc: "Leading development of scalable web applications, optimizing backend performance, and implementing secure cloud infrastructure.",
            latest: true
        });
    }

    return (
        <div className="max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-20 py-24 lg:py-48 relative min-h-screen">
            {/* Architectural Grid System */}
            <div className="absolute inset-0 circuit-grid opacity-[0.03] dark:opacity-[0.05] -z-10" />

            {/* Cinematic Background Elements */}
            <div className="absolute top-40 right-10 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] -z-10 animate-pulse" />
            <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10" />

            {/* Main Content Architecture */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="space-y-48"
            >
                {/* Header Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
                    <div className="lg:col-span-8 space-y-12">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-primary/5 border border-primary/10 text-primary/40 text-[10px] font-black uppercase tracking-[0.4em]"
                        >
                            <Fingerprint className="w-4 h-4 text-accent" />
                            Personal Profile
                        </motion.div>
                        <h2 className="text-5xl lg:text-6xl font-black tracking-[-0.04em] text-primary leading-[1.1] selection:bg-accent selection:text-white">
                            Software <span className="text-accent italic">Engineering Philosophy</span>
                        </h2>
                        <p className="text-xl lg:text-2xl text-primary/50 leading-tight font-medium tracking-tighter text-balance">
                            I am <span className="text-primary font-black underline decoration-accent/20 underline-offset-8">{portfolioData?.name || "M. Hemachandravijay"}</span>. {portfolioData?.summary || "A software developer specializing in the design and development of scalable, secure, and maintainable software systems."}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                            <p className="text-base text-primary/40 leading-relaxed font-medium hover:text-primary transition-colors duration-500">
                                My work focuses on clean architecture, performance optimization, and real-world problem solving to deliver resilient digital outcomes.
                            </p>
                            <p className="text-base text-primary/40 leading-relaxed font-medium hover:text-primary transition-colors duration-500 border-l border-primary/5 pl-8">
                                I integrate modern software engineering principles with robust cloud infrastructure to ensure scalability and reliability.
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col gap-10">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="p-12 rounded-[3.5rem] bg-primary text-background space-y-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden group"
                        >
                            <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                                <ShieldCheck className="w-64 h-64" />
                            </div>
                            <div className="space-y-4 relative z-10">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-background/40 italic flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-accent" />
                                    Engineering Protocol
                                </p>
                                <p className="text-2xl font-black font-inter leading-[1.2] tracking-tight">
                                    "To engineer software solutions that drive strategic growth and structural resilience."
                                </p>
                            </div>
                            <div className="h-[2px] w-full bg-white/5" />
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-accent">
                                    <Compass className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Directional Excellence</span>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { icon: Cpu, label: "Intelligence" },
                                { icon: Globe, label: "Cloud Scale" }
                            ].map((item, idx) => (
                                <div key={idx} className="p-8 rounded-[2.5rem] bg-card border border-primary/5 flex flex-col items-center justify-center text-center gap-4 hover:border-accent/30 transition-all duration-700 group">
                                    <div className="p-4 rounded-2xl bg-primary/5 text-primary/20 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Engagement & Trajectory Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-32">

                    {/* Timeline Node Cluster */}
                    <div className="lg:col-span-12 xl:col-span-5 space-y-16">
                        <div className="flex items-center gap-6">
                            <div className="p-4 rounded-2xl bg-primary/5 text-accent border border-primary/5">
                                <Zap className="w-7 h-7" />
                            </div>
                            <h3 className="text-4xl font-black text-primary tracking-tighter">
                                My Journey
                            </h3>
                        </div>

                        <div className="space-y-2 border-l-2 border-primary/5 ml-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                {timelineItems.map((item, idx) => (
                                    <MilestoneItem
                                        key={idx}
                                        year={item.year}
                                        role={item.role}
                                        company={item.company}
                                        desc={item.desc}
                                        latest={item.latest}
                                    />
                                ))}
                            </motion.div>
                        </div>
                    </div>

                    {/* Expertise Grid Cluster */}
                    <div className="lg:col-span-12 xl:col-span-7 space-y-16">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="p-4 rounded-2xl bg-primary/5 text-accent border border-primary/5">
                                    <Layers className="w-7 h-7" />
                                </div>
                                <h3 className="text-4xl font-black text-primary tracking-tighter">
                                    Core Expertise
                                </h3>
                            </div>
                            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/5 text-accent text-[10px] font-black uppercase tracking-widest">
                                <Activity className="w-3 h-3" />
                                Active Stack
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <ExpertiseCard
                                title="Full Stack Development"
                                desc="Building high-impact web applications that improve operational efficiency and user engagement."
                                icon={Code}
                            />
                            <ExpertiseCard
                                title="Cloud Solutions"
                                desc="Designing scalable AWS infrastructures that reduce operational costs and enhance reliability."
                                icon={Cpu}
                            />
                            <ExpertiseCard
                                title="System Architecture"
                                desc="Designing scalable and maintainable software systems for complex business needs."
                                icon={Database}
                            />
                            <ExpertiseCard
                                title="Strategic Delivery"
                                desc="Maintaining 100% on-time delivery across enterprise-level software projects."
                                icon={ShieldCheck}
                            />
                        </div>
                    </div>

                </div>
            </motion.div>
        </div>
    );
};

export default About;
