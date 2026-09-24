import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import {
    Mail, Phone, Linkedin, Github, ExternalLink, ArrowRight, X,
    Briefcase, Award, GraduationCap, Code, Zap, Download, MapPin,
    Star, Globe, Terminal, Database, Layers, BarChart2,
    BookOpen, Cpu, Layout, Server, Shield, TrendingUp,
    ChevronDown, FileText, Target
} from 'lucide-react';

// ─── Fade-up Section wrapper ───────────────────────────────────────────────
const Section = ({ children, className = '', delay = 0 }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    return (
        <motion.div ref={ref}
            initial={{ opacity: 0, y: 36 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
            className={className}
        >{children}</motion.div>
    );
};

// ─── Section Label ─────────────────────────────────────────────────────────
const SectionLabel = ({ icon: Icon, text }) => (
    <div className="flex items-center gap-3 mb-12">
        <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <Icon size={16} className="text-indigo-400" />
        </div>
        <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">{text}</span>
        <div className="flex-1 h-px bg-white/5" />
    </div>
);

// ─── Animated Counter ──────────────────────────────────────────────────────
const AnimatedCounter = ({ target }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);
    const num = parseInt(target, 10) || 0;
    useEffect(() => {
        if (!inView || num === 0) { setCount(num); return; }
        let c = 0;
        const step = Math.ceil(num / (1200 / 16));
        const t = setInterval(() => { c = Math.min(c + step, num); setCount(c); if (c >= num) clearInterval(t); }, 16);
        return () => clearInterval(t);
    }, [inView, num]);
    return <span ref={ref}>{count}</span>;
};

// ─── Typewriter Role ───────────────────────────────────────────────────────
const TypewriterRole = ({ text }) => {
    const parts = (text || 'Developer').split(/[•\/,]/).map(s => s.trim()).filter(Boolean);
    const [idx, setIdx] = useState(0);
    const [chars, setChars] = useState('');
    const [deleting, setDeleting] = useState(false);
    useEffect(() => {
        const current = parts[idx % parts.length];
        if (!deleting && chars === current) { const t = setTimeout(() => setDeleting(true), 2500); return () => clearTimeout(t); }
        if (deleting && chars === '') { setDeleting(false); setIdx(i => (i + 1) % parts.length); return; }
        const t = setTimeout(() => {
            setChars(deleting ? chars.slice(0, -1) : current.slice(0, chars.length + 1));
        }, deleting ? 35 : 85);
        return () => clearTimeout(t);
    }, [chars, deleting, idx, parts]);
    return (
        <span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 font-black">{chars}</span>
            <span className="animate-pulse text-violet-400 ml-0.5 font-light">|</span>
        </span>
    );
};

// ─── Starfield Canvas Background ──────────────────────────────────────────
const StarfieldCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let frameId;

        const dpr = window.devicePixelRatio || 1;
        const handleResize = () => {
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        const stars = [];
        const numStars = 85;
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: 0.4 + Math.random() * 0.9,
                depth: 0.2 + Math.random() * 0.8,
                phase: Math.random() * Math.PI * 2,
                twinkleSpeed: 0.01 + Math.random() * 0.02
            });
        }

        const render = () => {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            stars.forEach(star => {
                star.phase += star.twinkleSpeed;
                const alpha = 0.15 + (Math.sin(star.phase) + 1) * 0.5 * 0.45 * star.depth;
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            });

            frameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

// ─── 3D Profile Particle Orb Canvas ───────────────────────────────────────
const ProfileOrbCanvas = ({ name, topSkills = [] }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [mouse, setMouse] = useState({ x: 0, y: 0, targetX: 0, targetY: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = rect.height;

        // Fibonacci sphere point distribution
        const points = [];
        const numPoints = 140;
        for (let i = 0; i < numPoints; i++) {
            const y = 1 - (i / (numPoints - 1)) * 2;
            const radius = Math.sqrt(1 - y * y);
            const theta = 3.69 * i;
            const x = Math.cos(theta) * radius;
            const z = Math.sin(theta) * radius;
            points.push({ x, y, z });
        }

        let rotX = 0;
        let rotY = 0;
        let rotZ = 0;

        const handleMouseMove = (e) => {
            const container = containerRef.current;
            if (!container) return;
            const cRect = container.getBoundingClientRect();
            const cx = e.clientX - cRect.left - cRect.width / 2;
            const cy = e.clientY - cRect.top - cRect.height / 2;
            setMouse(prev => ({
                ...prev,
                targetX: cx / (cRect.width / 2),
                targetY: cy / (cRect.height / 2)
            }));
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
        }

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            const currentMouseX = mouse.x + (mouse.targetX - mouse.x) * 0.08;
            const currentMouseY = mouse.y + (mouse.targetY - mouse.y) * 0.08;
            mouse.x = currentMouseX;
            mouse.y = currentMouseY;

            rotX += 0.002 + currentMouseY * 0.004;
            rotY += 0.003 + currentMouseX * 0.004;
            rotZ += 0.001;

            const cx = width / 2;
            const cy = height / 2;
            const sphereRadius = 95;

            // Core glow
            const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, sphereRadius);
            coreGlow.addColorStop(0, 'rgba(99, 102, 241, 0.28)');
            coreGlow.addColorStop(0.5, 'rgba(139, 92, 246, 0.12)');
            coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = coreGlow;
            ctx.beginPath();
            ctx.arc(cx, cy, sphereRadius * 1.6, 0, Math.PI * 2);
            ctx.fill();

            // projected orbits
            const rings = 3;
            for (let r = 0; r < rings; r++) {
                ctx.strokeStyle = `rgba(129, 140, 248, ${0.16 - r * 0.03})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.ellipse(cx, cy, sphereRadius * (1.2 + r * 0.2), sphereRadius * 0.45, Math.PI / 6 * r + rotY * 0.2, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Project and sort points
            const projectedPoints = points.map(pt => {
                let x1 = pt.x * Math.cos(rotY) - pt.z * Math.sin(rotY);
                let z1 = pt.x * Math.sin(rotY) + pt.z * Math.cos(rotY);
                
                let y2 = pt.y * Math.cos(rotX) - z1 * Math.sin(rotX);
                let z2 = pt.y * Math.sin(rotX) + z1 * Math.cos(rotX);

                const distance = 2.5;
                const perspective = distance / (distance - z2);
                const px = cx + x1 * sphereRadius * perspective;
                const py = cy + y2 * sphereRadius * perspective;

                return { x: px, y: py, z: z2 };
            });

            projectedPoints.sort((a, b) => a.z - b.z);

            projectedPoints.forEach(pt => {
                const opacity = (pt.z + 1) / 2;
                const size = 1.6 + opacity * 2.8;
                
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, size, 0, Math.PI * 2);
                
                if (pt.z > 0) {
                    ctx.fillStyle = `rgba(139, 92, 246, ${0.35 + opacity * 0.65})`;
                    ctx.shadowBlur = 12;
                    ctx.shadowColor = '#8b5cf6';
                } else {
                    ctx.fillStyle = `rgba(99, 102, 241, ${0.12 + opacity * 0.4})`;
                    ctx.shadowBlur = 0;
                }
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            // Center initials
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 20px "Clash Display", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'MH';
            ctx.fillText(initials, cx, cy);

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            if (container) {
                container.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, [name]);

    const positions = [
        { top: '-10px', right: '-10px' },
        { bottom: '22%', right: '-24px' },
        { top: '28%', left: '-24px' },
        { bottom: '-6px', left: '22%' },
    ];
    const techEmojis = { react:'⚛️', python:'🐍', node:'🟢', javascript:'🟡', typescript:'🔷', ml:'🤖', ai:'🤖', java:'☕', c:'💻', sql:'🗄️', html:'🌐', css:'🎨', docker:'🐳', aws:'☁️', git:'📦' };
    const getEmoji = (skill) => {
        const k = skill.toLowerCase();
        return Object.entries(techEmojis).find(([key]) => k.includes(key))?.[1] || '⚡';
    };

    return (
        <div ref={containerRef} className="relative flex items-center justify-center" style={{ width: 360, height: 360 }}>
            {/* Glowing blur */}
            <div className="absolute inset-16 rounded-full bg-indigo-600/20 blur-3xl" />
            <canvas ref={canvasRef} className="w-[360px] h-[360px] cursor-grab active:cursor-grabbing relative z-10" />

            {/* Orbiting Tech badges */}
            {topSkills.slice(0, 4).map((skill, i) => (
                <motion.div key={i}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3.5 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
                    style={{ position: 'absolute', ...positions[i] }}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-2xl z-20
                               bg-[#0d1526]/90 border border-white/12 backdrop-blur-md
                               text-[11px] font-bold text-white whitespace-nowrap
                               shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.25)] transition-all"
                >
                    <span>{getEmoji(skill)}</span>
                    <span>{skill}</span>
                </motion.div>
            ))}
        </div>
    );
};

// ─── Interactive Skill Galaxy Canvas ──────────────────────────────────────
const SkillGalaxyCanvas = ({ skills }) => {
    const canvasRef = useRef(null);
    const [hoveredSkill, setHoveredSkill] = useState(null);
    
    const skillsObj = (typeof skills === 'object' && !Array.isArray(skills)) ? skills : {};
    const allSkills = Array.isArray(skills) ? skills : Object.values(skillsObj).flat();
    
    const categories = {
        'Frontend': ['react', 'html', 'css', 'javascript', 'typescript', 'vue', 'next', 'tailwind', 'ui', 'ux', 'sass', 'jquery'],
        'Backend': ['node', 'python', 'java', 'django', 'express', 'spring', 'flask', 'php', 'c#', 'ruby', 'go', 'c++', 'apis', 'rest'],
        'AI & Data Science': ['machine learning', 'deep learning', 'pytorch', 'tensorflow', 'keras', 'nlp', 'llm', 'computer vision', 'ai', 'data science', 'pandas', 'numpy', 'scikit', 'jupyter'],
        'Database & Systems': ['sql', 'postgres', 'mongodb', 'mysql', 'database', 'sqlite', 'redis', 'oracle', 'firebase'],
        'Cloud & DevOps': ['aws', 'docker', 'kubernetes', 'jenkins', 'git', 'github', 'ci/cd', 'cloud', 'nginx', 'linux', 'azure', 'devops']
    };

    const classifiedSkills = {};
    Object.keys(categories).forEach(cat => {
        classifiedSkills[cat] = [];
    });
    
    const unclassified = [];
    
    allSkills.forEach(skill => {
        let matched = false;
        const sLower = skill.toLowerCase();
        for (const [cat, keywords] of Object.entries(categories)) {
            if (keywords.some(kw => sLower.includes(kw))) {
                classifiedSkills[cat].push(skill);
                matched = true;
                break;
            }
        }
        if (!matched) {
            unclassified.push(skill);
        }
    });
    
    if (unclassified.length > 0) {
        classifiedSkills['General Stack'] = unclassified;
    }

    const activeCategories = Object.entries(classifiedSkills).filter(([, list]) => list.length > 0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let frameId;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        const w = rect.width;
        const h = rect.height;
        const cx = w / 2;
        const cy = h / 2;

        const nodes = [];
        let catIndex = 0;
        
        activeCategories.forEach(([catName, list]) => {
            const orbitRadius = 75 + catIndex * 48;
            const speed = 0.0008 + (4 - catIndex) * 0.0004;
            
            list.forEach((skill, i) => {
                const angle = (i / list.length) * Math.PI * 2 + Math.random() * 0.4;
                nodes.push({
                    name: skill,
                    category: catName,
                    orbitRadius,
                    angle,
                    speed,
                    size: 4.5 + Math.random() * 3,
                    glowColor: `hsl(${220 + catIndex * 35}, 80%, 65%)`,
                    pulse: Math.random() * Math.PI
                });
            });
            catIndex++;
        });

        let mousePos = { x: -1000, y: -1000 };

        const handleMouseMove = (e) => {
            const cRect = canvas.getBoundingClientRect();
            mousePos = {
                x: e.clientX - cRect.left,
                y: e.clientY - cRect.top
            };
        };

        const handleMouseLeave = () => {
            mousePos = { x: -1000, y: -1000 };
            setHoveredSkill(null);
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        const render = () => {
            ctx.clearRect(0, 0, w, h);

            // 1. Draw gravitational center core (Neon gravity well)
            const corePulse = Math.sin(Date.now() * 0.002) * 4;
            const coreRad = 28 + corePulse;
            const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRad * 1.8);
            coreGrad.addColorStop(0, '#ffffff');
            coreGrad.addColorStop(0.2, 'rgba(139, 92, 246, 0.85)');
            coreGrad.addColorStop(0.6, 'rgba(99, 102, 241, 0.28)');
            coreGrad.addColorStop(1, 'rgba(3, 7, 18, 0)');
            
            ctx.fillStyle = coreGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, coreRad * 2.2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = '900 9px "Space Grotesk", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText("CORE", cx, cy);

            // 2. Draw Orbit Rings
            activeCategories.forEach((_, catIdx) => {
                const r = 75 + catIdx * 48;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.stroke();
            });

            // 3. Render Nodes
            let currentHovered = null;

            nodes.forEach(node => {
                node.angle += node.speed;
                node.pulse += 0.02;

                const nx = cx + Math.cos(node.angle) * node.orbitRadius;
                const ny = cy + Math.sin(node.angle) * node.orbitRadius;

                const dist = Math.hypot(mousePos.x - nx, mousePos.y - ny);
                const isHovered = dist < 22;

                if (isHovered) {
                    currentHovered = node;
                }

                if (isHovered) {
                    ctx.strokeStyle = 'rgba(99, 102, 241, 0.18)';
                    ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.arc(cx, cy, node.orbitRadius, 0, Math.PI * 2);
                    ctx.stroke();
                }

                if (isHovered) {
                    ctx.strokeStyle = node.glowColor;
                    ctx.lineWidth = 1.8;
                    ctx.beginPath();
                    ctx.moveTo(cx, cy);
                    ctx.quadraticCurveTo(
                        (cx + nx) / 2 + (Math.random() - 0.5) * 12,
                        (cy + ny) / 2 + (Math.random() - 0.5) * 12,
                        nx, ny
                    );
                    ctx.stroke();
                }

                const currentSize = isHovered ? node.size + 4.5 : node.size + Math.sin(node.pulse) * 0.7;
                ctx.beginPath();
                ctx.arc(nx, ny, currentSize, 0, Math.PI * 2);

                if (isHovered) {
                    ctx.fillStyle = '#ffffff';
                    ctx.shadowBlur = 20;
                    ctx.shadowColor = node.glowColor;
                } else {
                    ctx.fillStyle = node.glowColor;
                    ctx.shadowBlur = 4;
                    ctx.shadowColor = node.glowColor;
                }
                ctx.fill();
                ctx.shadowBlur = 0;

                ctx.fillStyle = isHovered ? '#ffffff' : 'rgba(148, 163, 184, 0.85)';
                ctx.font = isHovered ? 'bold 11px "Satoshi", sans-serif' : '500 9px "Satoshi", sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(node.name, nx + currentSize + 5, ny + 2.5);
            });

            if (currentHovered !== hoveredSkill) {
                setHoveredSkill(currentHovered);
            }

            frameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(frameId);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [activeCategories, hoveredSkill]);

    return (
        <div className="relative w-full max-w-[640px] h-[460px] mx-auto bg-black/45 border border-white/5 rounded-[2rem] overflow-hidden glass">
            <div className="absolute inset-0 opacity-[0.015] circuit-grid pointer-events-none" />
            <canvas ref={canvasRef} className="w-full h-full cursor-crosshair relative z-10" />
            
            <AnimatePresence>
                {hoveredSkill && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-[#0b1329]/95 border border-indigo-500/30 backdrop-blur-md shadow-2xl flex items-center justify-between pointer-events-none z-20"
                    >
                        <div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 block mb-0.5">
                                {hoveredSkill.category} Universe
                            </span>
                            <h3 className="text-sm font-black text-white">{hoveredSkill.name}</h3>
                        </div>
                        <div className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase text-indigo-300">
                            Active Gravitational Pull
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── 3D Tilt Wrapper component ────────────────────────────────────────────
const TiltCard = ({ children, className = '', onClick }) => {
    const cardRef = useRef(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 0, glareY: 0, showGlare: false });

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const normX = x / (rect.width / 2);
        const normY = y / (rect.height / 2);
        
        const tiltX = -normY * 8;
        const tiltY = normX * 8;
        
        const glareX = ((e.clientX - rect.left) / rect.width) * 100;
        const glareY = ((e.clientY - rect.top) / rect.height) * 100;

        setTilt({ x: tiltX, y: tiltY, glareX, glareY, showGlare: true });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0, glareX: 0, glareY: 0, showGlare: false });
    };

    return (
        <div
            ref={cardRef}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`tilt-card-container ${onClick ? 'cursor-pointer' : ''} ${className}`}
        >
            <div
                className="tilt-card relative overflow-hidden rounded-[2.5rem] bg-[#060d1f] border border-white/8 h-full
                           shadow-[0_20px_50px_rgba(0,0,0,0.3)]
                           hover:shadow-[0_20px_80px_rgba(99,102,241,0.3)]
                           hover:border-indigo-500/30
                           transition-all duration-300"
                style={{
                    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                }}
            >
                {tilt.showGlare && (
                    <div
                        className="absolute inset-0 pointer-events-none transition-opacity duration-150 mix-blend-overlay"
                        style={{
                            background: `radial-gradient(circle 240px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.16), transparent 80%)`,
                        }}
                    />
                )}
                <div className="tilt-card-inner h-full flex flex-col">
                    {children}
                </div>
            </div>
        </div>
    );
};

// ─── Issuer-branded SVG logo ───────────────────────────────────────────────
const IssuerLogo = ({ issuer = '' }) => {
    const n = issuer.toLowerCase();
    if (n.includes('google')) return (<svg viewBox="0 0 24 24" width="26" height="26"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>);
    if (n.includes('aws') || n.includes('amazon')) return (<svg viewBox="0 0 80 30" width="48" height="18"><text x="2" y="22" fontSize="22" fontWeight="900" fill="#FF9900" fontFamily="Arial">aws</text></svg>);
    if (n.includes('microsoft') || n.includes('azure')) return (<svg viewBox="0 0 23 23" width="26" height="26"><path d="M1 1h10v10H1z" fill="#f25022"/><path d="M12 1h10v10H12z" fill="#7fba00"/><path d="M1 12h10v10H1z" fill="#00a4ef"/><path d="M12 12h10v10H12z" fill="#ffb900"/></svg>);
    if (n.includes('coursera')) return (<svg viewBox="0 0 100 100" width="26" height="26"><circle cx="50" cy="50" r="50" fill="#0056D2"/><text x="50" y="67" textAnchor="middle" fontSize="52" fontWeight="bold" fill="white">C</text></svg>);
    if (n.includes('udemy')) return (<svg viewBox="0 0 100 100" width="26" height="26"><circle cx="50" cy="50" r="50" fill="#A435F0"/><text x="50" y="67" textAnchor="middle" fontSize="52" fontWeight="bold" fill="white">U</text></svg>);
    if (n.includes('nptel') || n.includes('iit') || n.includes('swayam')) return (<svg viewBox="0 0 100 100" width="26" height="26"><circle cx="50" cy="50" r="50" fill="#ff6d00"/><text x="50" y="67" textAnchor="middle" fontSize="38" fontWeight="bold" fill="white">N</text></svg>);
    if (n.includes('ibm')) return (<svg viewBox="0 0 100 100" width="26" height="26"><rect width="100" height="100" rx="12" fill="#1F70C1"/><text x="50" y="67" textAnchor="middle" fontSize="38" fontWeight="bold" fill="white">IBM</text></svg>);
    if (n.includes('meta') || n.includes('facebook')) return (<svg viewBox="0 0 100 100" width="26" height="26"><rect width="100" height="100" rx="12" fill="#0866FF"/><text x="50" y="67" textAnchor="middle" fontSize="52" fontWeight="bold" fill="white">M</text></svg>);
    const letter = issuer.charAt(0).toUpperCase() || '?';
    return (<svg viewBox="0 0 100 100" width="26" height="26"><rect width="100" height="100" rx="16" fill="rgba(99,102,241,0.25)"/><text x="50" y="67" textAnchor="middle" fontSize="52" fontWeight="bold" fill="#818cf8">{letter}</text></svg>);
};

// ─── Project Thumbnail ─────────────────────────────────────────────────────
const ProjectThumbnail = ({ proj, index }) => {
    const palettes = [
        { from: '#1e1b4b', via: '#312e81', to: '#4c1d95' },
        { from: '#0c4a6e', via: '#075985', to: '#1e3a5f' },
        { from: '#4a044e', via: '#701a75', to: '#831843' },
        { from: '#064e3b', via: '#065f46', to: '#134e4a' },
        { from: '#431407', via: '#7c2d12', to: '#78350f' },
        { from: '#1e3a8a', via: '#1d4ed8', to: '#312e81' },
    ];
    const p = palettes[index % palettes.length];
    const icons = ['⚡', '🔬', '🧠', '🛡️', '📊', '🌐', '🚀', '💡', '🔮', '🌊'];
    const techList = proj.tech?.slice(0, 2) || [];

    return (
        <div className="relative h-52 overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${p.from}, ${p.via}, ${p.to})` }}>
            <div className="absolute top-4 right-4 w-20 h-20 rounded-full border border-white/10 opacity-50" />
            <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full border border-white/5 opacity-40" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-white/5 opacity-30" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(255,255,255,0.07),transparent_60%)]" />
            
            <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-50 select-none">
                {icons[index % icons.length]}
            </div>
            
            <div className="absolute bottom-3 right-3 flex flex-col gap-1 items-end z-20">
                {techList.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-black/60 border border-white/20 text-white/80 backdrop-blur-sm">
                        {t}
                    </span>
                ))}
            </div>
            
            <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#060d1f] to-transparent z-10" />
        </div>
    );
};

// ─── Case Study Modal (Elite Founder Edition V10 — In-Portfolio) ──────────────
const CaseStudyModal = ({ proj, onClose }) => {
    useEffect(() => {
        const h = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [onClose]);

    const techList = proj.tech || (proj.stack ? proj.stack.split(',').map(s => s.trim()) : []);
    const hasLiveDemo = proj.link && proj.link !== '#';
    const hasGitHub   = proj.github && proj.github !== '#';

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-8"
                onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
                <div className="absolute inset-0 bg-black/92 backdrop-blur-2xl" />

                <motion.div initial={{ opacity: 0, scale: 0.93, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.93, y: 40 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2.5rem]
                               bg-[#060f20] border border-indigo-500/25
                               shadow-[0_40px_120px_rgba(99,102,241,0.35)]"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(99,102,241,0.2) transparent' }}>

                    {/* Top gradient glow */}
                    <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-500/14 to-transparent pointer-events-none rounded-[2.5rem]" />

                    {/* Close button */}
                    <button onClick={onClose}
                        className="absolute top-6 right-6 z-20 p-2.5 rounded-xl bg-white/5 hover:bg-white/12 border border-white/10 hover:border-white/20 transition-all">
                        <X size={15} />
                    </button>

                    <div className="relative p-8 sm:p-12">
                        {/* Kicker */}
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-4 block">📂 Project Details</span>

                        {/* Project Name — big and bold */}
                        <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 tracking-tight leading-tight">
                            {proj.title}
                        </h2>

                        {/* ── LIVE DEMO + GITHUB ── prominent hero buttons at the top */}
                        {(hasLiveDemo || hasGitHub) && (
                            <div className="flex flex-wrap gap-3 mb-10">
                                {hasLiveDemo && (
                                    <a href={proj.link} target="_blank" rel="noreferrer"
                                        onClick={e => e.stopPropagation()}
                                        className="flex items-center gap-2.5 px-7 py-4 rounded-full
                                                   bg-gradient-to-r from-indigo-500 to-violet-500
                                                   text-white text-[12px] font-black uppercase tracking-widest
                                                   hover:opacity-90 hover:scale-105 active:scale-95 transition-all
                                                   shadow-[0_12px_32px_-6px_rgba(99,102,241,0.55)]">
                                        <Globe size={14} /> Live Demo
                                    </a>
                                )}
                                {hasGitHub && (
                                    <a href={proj.github} target="_blank" rel="noreferrer"
                                        onClick={e => e.stopPropagation()}
                                        className="flex items-center gap-2.5 px-7 py-4 rounded-full
                                                   bg-white/5 border border-white/15 text-white
                                                   text-[12px] font-black uppercase tracking-widest
                                                   hover:bg-white/10 hover:border-white/25 hover:scale-105 active:scale-95 transition-all">
                                        <Github size={14} /> GitHub
                                    </a>
                                )}
                            </div>
                        )}

                        <div className="space-y-5">
                            {/* Description / Challenge */}
                            {(proj.desc || proj.problem) && (
                                <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/6 hover:border-white/10 transition-colors">
                                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500 block mb-2.5">🎯 Challenge & Objective</span>
                                    <p className="text-sm text-slate-300 leading-relaxed font-medium">{proj.desc || proj.problem}</p>
                                </div>
                            )}

                            {/* Research & Solution */}
                            {proj.problem && proj.solution && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/6">
                                        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500 block mb-2.5">🔬 Research Insights</span>
                                        <p className="text-xs text-slate-400 leading-relaxed font-medium">{proj.problem}</p>
                                    </div>
                                    <div className="p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/15">
                                        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-indigo-400 block mb-2.5">✅ Strategy & Execution</span>
                                        <p className="text-sm text-indigo-200/90 leading-relaxed font-medium">{proj.solution}</p>
                                    </div>
                                </div>
                            )}

                            {/* Tech Stack */}
                            {techList.length > 0 && (
                                <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/6">
                                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500 block mb-4">🏗️ Tech Stack</span>
                                    <div className="flex flex-wrap gap-2">
                                        {techList.map((t, i) => (
                                            <span key={i} className="px-3.5 py-2 bg-black/60 border border-white/8 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-300 hover:border-indigo-500/40 transition-colors">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Impact */}
                            {proj.impact && proj.impact !== 'Improved operational efficiency and delivered a high-performance system.' && (
                                <div className="p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/15">
                                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-400 block mb-2.5">📈 Results & Impact</span>
                                    <p className="text-sm text-emerald-200/90 leading-relaxed font-medium">{proj.impact}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// ─── Achievement Card ──────────────────────────────────────────────────────
const categorizeAchievement = (text) => {
    const t = text.toLowerCase();
    if (/research|paper|publish|journal|arxiv|ieee|acm|springer/.test(t)) return 'research';
    if (/conference|symposium|workshop|present|keynote|talk/.test(t)) return 'conference';
    if (/award|prize|winner|gold|silver|bronze|rank.1|first.place|champion|best/.test(t)) return 'award';
    if (/scholarship|fellowship|grant|funded|stipend/.test(t)) return 'scholarship';
    return 'trophy';
};

const achConfig = {
    research:     { emoji: '📄', label: 'Research Paper', bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    text: 'text-blue-400' },
    conference:   { emoji: '🎤', label: 'Conference',     bg: 'bg-violet-500/10',  border: 'border-violet-500/20',  text: 'text-violet-400' },
    award:        { emoji: '🏆', label: 'Award',          bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   text: 'text-amber-400' },
    scholarship:  { emoji: '🎓', label: 'Scholarship',    bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
    trophy:       { emoji: '⭐', label: 'Recognition',    bg: 'bg-indigo-500/10',  border: 'border-indigo-500/20',  text: 'text-indigo-400' },
};

const AchievementCard = ({ ach }) => {
    const type = categorizeAchievement(ach);
    const cfg = achConfig[type];
    return (
        <motion.div whileHover={{ y: -4 }}
            className={`p-6 rounded-[2rem] bg-white/[0.02] border border-white/6 hover:border-indigo-500/40 transition-all duration-300 flex items-start gap-4 glass`}>
            <div className={`w-11 h-11 rounded-2xl ${cfg.bg} border ${cfg.border} flex items-center justify-center text-xl shrink-0`}>
                {cfg.emoji}
            </div>
            <div>
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${cfg.text} block mb-1.5`}>{cfg.label}</span>
                <p className="text-sm text-slate-300 leading-relaxed font-semibold">{ach}</p>
            </div>
        </motion.div>
    );
};

// ─── Timeline Entry ────────────────────────────────────────────────────────
const TimelineEntry = ({ exp, index }) => {
    const [open, setOpen] = useState(index === 0);
    return (
        <Section delay={index * 0.06}>
            <div className="flex gap-6 md:gap-10">
                {/* Left: dot + line anchor */}
                <div className="flex flex-col items-center shrink-0 pt-1.5 relative">
                    <div className="w-4 h-4 rounded-full bg-indigo-500 border-4 border-[#030712] ring-4 ring-indigo-500/20 shrink-0 z-10" />
                </div>

                {/* Right: card */}
                <div className="flex-1 pb-12">
                    <button onClick={() => setOpen(o => !o)} className="w-full text-left group">
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                                <h3 className="text-xl font-black text-white group-hover:text-indigo-300 transition-colors tracking-tight">{exp.role}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm font-bold text-slate-400">{exp.company}</span>
                                    {exp.location && (
                                        <><span className="text-slate-700">•</span>
                                        <span className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={10} />{exp.location}</span></>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                                    {exp.period || 'Present'}
                                </span>
                                <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                    <ChevronDown size={15} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                                </motion.div>
                            </div>
                        </div>
                    </button>

                    <AnimatePresence>
                        {open && exp.desc && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
                                <div className="mt-4 p-6 rounded-[2rem] bg-white/[0.02] border border-white/6 space-y-2.5">
                                    {exp.desc.split('\n').filter(Boolean).map((line, li) => (
                                        <div key={li} className="flex items-start gap-3">
                                            <div className="mt-2.5 shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                            <p className="text-sm text-slate-300 leading-relaxed font-semibold">
                                                {line.replace(/^[•\-*]\s*/, '')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </Section>
    );
};

// ─── Cert Gallery Card ─────────────────────────────────────────────────────
const CertCard = ({ cert }) => (
    <motion.div whileHover={{ y: -5, scale: 1.01 }}
        className="group p-5 rounded-[2rem] bg-white/[0.02] border border-white/6
                   hover:border-indigo-500/40 hover:bg-indigo-500/5
                   hover:shadow-[0_12px_40px_-8px_rgba(99,102,241,0.2)]
                   transition-all duration-400 flex items-center gap-4 glass">
        <div className="p-3 rounded-2xl bg-black/40 border border-white/8 shrink-0">
            <IssuerLogo issuer={cert.issuer || ''} />
        </div>
        <div className="min-w-0">
            <h3 className="text-sm font-black text-white group-hover:text-indigo-300 transition-colors leading-snug mb-1">
                {cert.title}
            </h3>
            <p className="text-xs text-slate-500 font-bold">{cert.issuer}</p>
            {cert.year && <p className="text-[10px] text-indigo-500/80 mt-1.5 font-black uppercase tracking-wider">{cert.year}</p>}
        </div>
    </motion.div>
);

// ─── Dynamic Experience Scrolling Roadmap Path ──────────────────────────────
const ScrollingRoadmapLine = () => {
    const lineRef = useRef(null);
    useEffect(() => {
        const handleScroll = () => {
            const line = lineRef.current;
            if (!line) return;
            const rect = line.getBoundingClientRect();
            const winH = window.innerHeight;
            
            const topPassed = winH / 2 - rect.top;
            const percentage = Math.max(0, Math.min(100, (topPassed / rect.height) * 100));
            line.style.setProperty('--scroll-percent', `${percentage}%`);
        };
        
        window.addEventListener('scroll', handleScroll);
        setTimeout(handleScroll, 100);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div ref={lineRef} className="absolute left-[33px] top-6 bottom-6 w-[2px] bg-white/5 overflow-hidden rounded-full">
            <div
                className="w-full h-full bg-gradient-to-b from-indigo-500 via-violet-500 to-fuchsia-500 origin-top transition-transform duration-75"
                style={{
                    transform: 'scaleY(0)',
                    height: 'var(--scroll-percent, 0%)'
                }}
            />
        </div>
    );
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────
const FullScreenPortfolio = ({ data, onClose }) => {
    if (!data) return null;

    const containerRef = useRef(null);
    const mainRef = useRef(null);
    const { scrollYProgress } = useScroll({ container: containerRef });
    const [selectedProject, setSelectedProject] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = useCallback((e) => {
        const rect = mainRef.current?.getBoundingClientRect();
        if (rect) setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }, []);

    useEffect(() => {
        document.body.classList.add('portfolio-preview-open');
        return () => document.body.classList.remove('portfolio-preview-open');
    }, []);

    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const heroY = useTransform(scrollYProgress, [0, 0.25], [0, 80]);

    // Data Mapping
    const expCount  = (data.experience || []).length;
    const projCount = (data.projects || []).length;
    const certCount = (data.certifications || []).length;
    const skillsObj = (typeof data.skills === 'object' && !Array.isArray(data.skills)) ? data.skills : {};
    const allSkills = Array.isArray(data.skills) ? data.skills : Object.values(skillsObj).flat();
    const topSkills = allSkills.slice(0, 4);

    const metrics = [
        { val: `${projCount}`,        label: 'Projects Built',     icon: Layers,    g: 'from-indigo-600/8 to-transparent' },
        { val: `${expCount}`,         label: 'Internships & Roles', icon: Briefcase, g: 'from-violet-600/8 to-transparent' },
        { val: `${certCount}`,        label: 'Certifications',     icon: Award,     g: 'from-fuchsia-600/8 to-transparent' },
        { val: `${allSkills.length}`, label: 'Skills Mastered',    icon: Zap,       g: 'from-cyan-600/8 to-transparent' },
    ];

    const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } };
    const fadeUp  = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } };

    return (
        <motion.div ref={mainRef} onMouseMove={handleMouseMove}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[200] bg-[#030712] text-white font-sans overflow-hidden noise-overlay">

            {/* ══ BACKGROUND LAYER ══ */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <StarfieldCanvas />
                
                {/* Aurora blobs */}
                <div className="aurora-1 absolute top-[-30%] left-[-15%] w-[65%] h-[65%] rounded-full bg-indigo-800/24 blur-[160px]" />
                <div className="aurora-2 absolute bottom-[-20%] right-[-15%] w-[55%] h-[70%] rounded-full bg-violet-800/20 blur-[180px]" />
                <div className="aurora-3 absolute top-[40%] left-[35%] w-[45%] h-[45%] rounded-full bg-fuchsia-900/12 blur-[140px]" />
                <div className="aurora-4 absolute top-[5%] right-[20%] w-[28%] h-[28%] rounded-full bg-cyan-900/10 blur-[100px]" />
                
                {/* Micro Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.015] circuit-grid" />
            </div>

            {/* Mouse-following spotlight */}
            <div className="fixed inset-0 pointer-events-none z-[1] transition-all duration-75"
                style={{ background: `radial-gradient(800px at ${mousePos.x}px ${mousePos.y}px, rgba(99,102,241,0.08), transparent 80%)` }} />

            {/* ══ NAVBAR ══ */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-12 py-5
                            bg-[#030712]/75 backdrop-blur-2xl border-b border-white/5 no-print">
                <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
                    className="flex items-center gap-2.5">
                    <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-black shadow-[0_0_14px_rgba(99,102,241,0.4)]">
                        {data.name?.charAt(0)}
                    </div>
                    <span className="text-sm font-black tracking-tighter">
                        {data.name?.split(' ')[0]}<span className="text-indigo-500">.</span>dev
                    </span>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                    className="hidden md:flex items-center gap-8">
                    {['About', 'Skills', 'Projects', 'Experience', 'Contact'].map(s => (
                        <button key={s} onClick={() => document.getElementById(s.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                            className="text-[11px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest">
                            {s}
                        </button>
                    ))}
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
                    className="flex items-center gap-3">
                    <button onClick={() => window.print()}
                        className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-90 text-[11px] font-black uppercase tracking-widest transition-all">
                        <Download size={12} /> <span className="hidden sm:inline">Save PDF</span>
                    </button>
                    <button onClick={onClose}
                        className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-black uppercase tracking-widest transition-all">
                        <X size={12} /> <span className="hidden sm:inline">Exit</span>
                    </button>
                </motion.div>
            </nav>

            {/* ══ SCROLLABLE CONTENT ══ */}
            <div ref={containerRef} className="h-screen overflow-y-auto overflow-x-hidden relative z-[2]"
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(99,102,241,0.3) transparent' }}>

                {/* ─── HERO ─────────────────────────────────────────────── */}
                <section className="relative min-h-screen flex items-center pt-24 pb-16 px-6 sm:px-12">
                    <motion.div style={{ y: heroY, opacity: heroOpacity }} className="w-full max-w-[1200px] mx-auto">
                        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                            {/* LEFT */}
                            <motion.div variants={stagger} initial="hidden" animate="visible"
                                className="flex-1 space-y-8 max-w-[580px]">
                                {/* Availability badge */}
                                <motion.div variants={fadeUp}
                                    className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                    </span>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Available for Roles</span>
                                </motion.div>

                                {/* Name */}
                                <motion.h1 variants={fadeUp}
                                    className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.92]
                                               text-transparent bg-clip-text bg-gradient-to-br from-white via-white/95 to-white/30 font-heading">
                                    {data.name || 'Your Name'}
                                </motion.h1>

                                {/* Typewriter role */}
                                <motion.div variants={fadeUp} className="text-xl sm:text-2xl font-black h-8 flex items-center tracking-tight">
                                    <TypewriterRole text={data.title || 'Software Developer'} />
                                </motion.div>

                                {/* Summary */}
                                <motion.p variants={fadeUp} className="text-base text-slate-400 font-semibold leading-relaxed">
                                    {data.summary || ''}
                                </motion.p>

                                {/* CTA buttons */}
                                <motion.div variants={fadeUp} className="flex flex-wrap gap-4.5 pt-2">
                                    <button onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="group px-8 py-4 rounded-full bg-white text-black font-black uppercase tracking-widest text-[11px]
                                                   hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all shadow-[0_16px_36px_rgba(255,255,255,0.08)] flex items-center gap-2">
                                        View Projects <ArrowRight size={12} className="group-hover:translate-x-1.5 transition-transform" />
                                    </button>
                                    <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="px-8 py-4 rounded-full bg-white/5 border border-white/12 text-white font-black uppercase tracking-widest text-[11px]
                                                   hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95 transition-all">
                                        Contact Me
                                    </button>
                                </motion.div>

                                {/* Social links */}
                                <motion.div variants={fadeUp} className="flex gap-3.5 pt-4">
                                    {data.contact?.email && (
                                        <a href={`mailto:${data.contact.email}`} className="text-xs font-black text-slate-500 hover:text-indigo-400 uppercase tracking-wider transition-colors">
                                            Email
                                        </a>
                                    )}
                                    {data.contact?.linkedin && (
                                        <a href={data.contact.linkedin} target="_blank" rel="noreferrer" className="text-xs font-black text-slate-500 hover:text-indigo-400 uppercase tracking-wider transition-colors">
                                            LinkedIn
                                        </a>
                                    )}
                                    {data.contact?.github && (
                                        <a href={data.contact.github} target="_blank" rel="noreferrer" className="text-xs font-black text-slate-500 hover:text-indigo-400 uppercase tracking-wider transition-colors">
                                            GitHub
                                        </a>
                                    )}
                                </motion.div>
                            </motion.div>

                            {/* RIGHT - 3D Orb and orbits */}
                            <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: 'easeOut' }}
                                className="flex-1 flex justify-center items-center">
                                <ProfileOrbCanvas name={data.name} topSkills={topSkills} />
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/* ─── LIVE DASHBOARD STATISTICS ───────────────────────────── */}
                <div className="container px-6 sm:px-12 max-w-[1200px] mx-auto mb-28 relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {metrics.map((m, i) => (
                            <motion.div key={i} whileHover={{ y: -4, scale: 1.02 }}
                                className="relative overflow-hidden p-6 sm:p-7 rounded-[2rem] bg-white/[0.02] border border-white/6
                                           hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all duration-400 group glass">
                                <div className={`absolute inset-0 bg-gradient-to-br ${m.g} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                <div className="relative flex items-start gap-4">
                                    <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 shrink-0">
                                        <m.icon size={18} className="text-indigo-400" />
                                    </div>
                                    <div>
                                        <div className="text-3xl sm:text-4xl font-black text-white mb-1 font-heading">
                                            <AnimatedCounter target={m.val} />
                                        </div>
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{m.label}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ─── ABOUT SECTION ───────────────────────────────────── */}
                <section id="about" className="px-6 sm:px-12 max-w-[1200px] mx-auto mb-28 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                        <div>
                            <SectionLabel icon={Cpu} text="Core Architect" />
                            <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 font-heading tracking-tight leading-snug">
                                Engineering Intelligent,<br />High-Performance Systems
                            </h2>
                            <p className="text-base text-slate-400 font-semibold leading-relaxed mb-6">
                                {data.summary || 'Developing complex modern software applications with absolute focus on code scalability, speed, and beautiful design aesthetics.'}
                            </p>
                            {data.contact?.location && (
                                <p className="text-sm text-indigo-400 font-bold flex items-center gap-2 mb-8">
                                    <MapPin size={14} /> Base Location: {data.contact.location}
                                </p>
                            )}

                            {/* Education journey inside Timeline */}
                            {(data.education || []).length > 0 && (
                                <div className="pt-8 border-t border-white/5">
                                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 block mb-5">🎓 Academic Grounding</span>
                                    <div className="space-y-4">
                                        {data.education.map((edu, i) => (
                                            <div key={i} className="flex gap-4 items-start">
                                                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 shrink-0">
                                                    <GraduationCap size={16} className="text-indigo-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-white">{edu.degree}</h4>
                                                    <p className="text-xs text-indigo-300 font-semibold">{edu.institution}</p>
                                                    <p className="text-[10px] text-slate-500 mt-0.5 font-bold">
                                                        {edu.year} {edu.cgpa ? `• CGPA: ${edu.cgpa}` : ''}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Interactive Skill Galaxy right next to about text */}
                        <div className="flex flex-col justify-center items-center">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-6 block self-start">🌌 Interactive Skill Galaxy</span>
                            <SkillGalaxyCanvas skills={data.skills} />
                        </div>
                    </div>
                </section>

                {/* ─── PROJECTS ────────────────────────────────────────── */}
                <section id="projects" className="px-6 sm:px-12 max-w-[1200px] mx-auto mb-28 relative z-10">
                    <Section className="mb-14 text-center">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-5">
                            <Layers size={13} className="text-indigo-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Featured Work</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                            Elite Case <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Studies</span>
                        </h2>
                        <p className="text-sm text-slate-400 mt-3 max-w-[480px] mx-auto font-semibold">
                            Explore full-screen visual breakdowns detailing core engineering problems, architectures, and results.
                        </p>
                    </Section>

                    {(data.projects || []).length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {data.projects.map((p, i) => (
                                <TiltCard key={i} onClick={() => setSelectedProject(p)}>
                                    <ProjectThumbnail proj={p} index={i} />
                                    <div className="p-8 flex flex-col flex-1 cursor-pointer">
                                        <h3 className="text-xl font-black text-white mb-4 group-hover:text-indigo-200 transition-colors leading-tight">
                                            {p.title}
                                        </h3>
                                        {p.problem ? (
                                            <p className="text-xs text-slate-400 leading-relaxed mb-5 line-clamp-2 font-semibold">{p.problem}</p>
                                        ) : p.desc ? (
                                            <p className="text-xs text-slate-400 leading-relaxed mb-5 line-clamp-2 font-semibold">{p.desc}</p>
                                        ) : null}

                                        {/* Tech Badges */}
                                        <div className="flex flex-wrap gap-1.5 mb-6">
                                            {(p.tech || (p.stack ? p.stack.split(',') : [])).slice(0, 4).map((t, idx) => (
                                                <span key={idx} className="px-2.5 py-1.5 bg-black/40 border border-white/8 rounded-lg text-[9px] font-black uppercase tracking-wider text-slate-500">
                                                    {t.trim()}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Bottom row — tap anywhere on card to open */}
                                        <div className="flex items-center gap-2.5 mt-auto pt-5 border-t border-white/5">
                                            <div className="flex-1 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600
                                                           text-white text-[11px] font-black uppercase tracking-widest
                                                           flex items-center justify-center gap-2
                                                           shadow-[0_8px_20px_-4px_rgba(99,102,241,0.4)]">
                                                <BookOpen size={11} /> View Project
                                            </div>
                                            {p.link && p.link !== '#' && (
                                                <div className="py-3 px-4 rounded-full bg-white/5 border border-white/10 text-white
                                                               text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                                    <Globe size={11} /> Live
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TiltCard>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-slate-600">
                            <Layers size={48} className="mx-auto mb-4 opacity-30" />
                            <p className="font-bold">No projects present. Fill in the data editor!</p>
                        </div>
                    )}
                </section>

                {/* ─── CAREER JOURNEY TIMELINE ROADMAP ────────────────────── */}
                {(data.experience || []).length > 0 && (
                    <section id="experience" className="px-6 sm:px-12 max-w-[1200px] mx-auto mb-28 relative z-10">
                        <Section className="mb-14">
                            <SectionLabel icon={Briefcase} text="Technical Journey" />
                        </Section>
                        <div className="relative">
                            <ScrollingRoadmapLine />
                            <div className="space-y-2">
                                {data.experience.map((exp, i) => (
                                    <TimelineEntry key={i} exp={exp} index={i} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ─── CERTIFICATIONS ──────────────────────────────────── */}
                {(data.certifications || []).length > 0 && (
                    <section id="certifications" className="px-6 sm:px-12 max-w-[1200px] mx-auto mb-28 relative z-10">
                        <Section className="mb-12">
                            <SectionLabel icon={Award} text="Verified Credentials" />
                        </Section>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {data.certifications.map((cert, i) => (
                                <Section key={i} delay={i * 0.05}><CertCard cert={cert} /></Section>
                            ))}
                        </div>
                    </section>
                )}

                {/* ─── ACHIEVEMENTS WALL ─────────────────────────────────── */}
                {(data.achievements || []).length > 0 && (
                    <section className="px-6 sm:px-12 max-w-[1200px] mx-auto mb-28 relative z-10">
                        <Section className="mb-12">
                            <SectionLabel icon={Star} text="Achievements Wall" />
                        </Section>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {data.achievements.map((ach, i) => (
                                <Section key={i} delay={i * 0.04}><AchievementCard ach={ach} /></Section>
                            ))}
                        </div>
                    </section>
                )}

                {/* ─── CONTACT SECTION ─────────────────────────────────── */}
                <section id="contact" className="px-6 sm:px-12 max-w-[1200px] mx-auto mb-24 relative z-10">
                    <Section>
                        <div className="relative overflow-hidden rounded-[2.5rem] p-12 sm:p-24 text-center
                                        bg-gradient-to-br from-indigo-950/80 via-violet-950/60 to-[#030712]
                                        border border-indigo-500/20 shadow-[0_30px_90px_rgba(99,102,241,0.15)]">
                            {/* Inner blur */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-3/4 rounded-full bg-indigo-600/18 blur-[130px] pointer-events-none" />
                            <div className="absolute inset-0 opacity-[0.02] circuit-grid pointer-events-none" />

                            <div className="relative z-10">
                                <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-6 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                                    Let's Collaborate
                                </span>
                                <h2 className="text-4xl sm:text-6xl font-black text-white mb-6 leading-tight tracking-tight font-heading">
                                    Let's Build The<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400">
                                        Future Together
                                    </span>
                                </h2>
                                <p className="text-base sm:text-lg text-slate-400 max-w-[480px] mx-auto mb-10 font-semibold leading-relaxed">
                                    Open to full-time engineering roles, research programs, and high-impact custom design architectural builds.
                                </p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    {data.contact?.email && (
                                        <a href={`mailto:${data.contact.email}`}
                                            className="group px-8 py-4.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-black uppercase tracking-widest text-[11px]
                                                       hover:scale-105 active:scale-95 transition-all shadow-[0_16px_40px_-8px_rgba(99,102,241,0.5)] flex items-center gap-2">
                                            <Mail size={14} /> Send Email
                                        </a>
                                    )}
                                    {data.contact?.linkedin && (
                                        <a href={data.contact.linkedin} target="_blank" rel="noreferrer"
                                            className="px-8 py-4.5 rounded-full bg-white/5 border border-white/12 text-white font-black uppercase tracking-widest text-[11px] hover:bg-white/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                                            <Linkedin size={14} /> LinkedIn
                                        </a>
                                    )}
                                    {data.contact?.github && (
                                        <a href={data.contact.github} target="_blank" rel="noreferrer"
                                            className="px-8 py-4.5 rounded-full bg-white/5 border border-white/12 text-white font-black uppercase tracking-widest text-[11px] hover:bg-white/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                                            <Github size={14} /> GitHub
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Section>
                </section>

                {/* ─── FOOTER ──────────────────────────────────────────── */}
                <footer className="px-6 sm:px-12 py-12 border-t border-white/5 text-center relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">
                        {data.name} • Portfolio V10.0 • ELITE FOUNDER EDITION
                    </p>
                </footer>
            </div>

            {/* ══ CASE STUDY MODAL ══ */}
            {selectedProject && (
                <CaseStudyModal proj={selectedProject} onClose={() => setSelectedProject(null)} />
            )}
        </motion.div>
    );
};

export default FullScreenPortfolio;
