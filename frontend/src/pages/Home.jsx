import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, ShieldCheck, Zap, Layers, Cpu, Globe, Infinity, Activity, Database, Cloud, Camera, Sparkles, Star, Award, Briefcase } from 'lucide-react';

const InteractiveResume = lazy(() => import('../components/InteractiveResume'));

const FeatureCard = ({ icon: Icon, label }) => (
    <div className="flex flex-col items-center lg:items-start gap-3 group">
        <div className="p-3 rounded-xl bg-primary/5 text-primary/40 group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-sm">
            <Icon className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/30 group-hover:text-accent transition-colors">
                {label}
            </span>
        </div>
    </div>
);

const Home = () => {
    // Initialize profile image from localStorage or use default
    const [profileImage, setProfileImage] = React.useState(() => {
        const savedImage = localStorage.getItem('portfolio_profile_image');
        return savedImage || ":/https/ui-avatars.com/api/?name=MHCV&background=020617&color=fff&size=512";
    });

    // Check if custom image is uploaded
    const [hasCustomImage, setHasCustomImage] = React.useState(() => {
        return localStorage.getItem('portfolio_profile_image') !== null;
    });

    const [isUploading, setIsUploading] = React.useState(false);
    const [uploadSuccess, setUploadSuccess] = React.useState(false);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }

            setIsUploading(true);
            const reader = new FileReader();

            reader.onloadend = () => {
                const imageData = reader.result;
                // Save to localStorage for persistence
                localStorage.setItem('portfolio_profile_image', imageData);
                setProfileImage(imageData);
                setHasCustomImage(true);
                setIsUploading(false);
                setUploadSuccess(true);

                // Reset success indicator after 3 seconds
                setTimeout(() => setUploadSuccess(false), 3000);
            };

            reader.onerror = () => {
                setIsUploading(false);
                alert('Error uploading image. Please try again.');
            };

            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center relative overflow-hidden bg-background">
            {/* High-Fidelity Architectural Grid */}
            <div className="absolute inset-0 circuit-grid opacity-[0.03] dark:opacity-[0.05] -z-10" />

            {/* Cinematic Atmospheric FX */}
            <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] rounded-full bg-accent/10 blur-[180px] -z-10 animate-pulse" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[1000px] h-[1000px] rounded-full bg-accent/5 blur-[180px] -z-10 animate-pulse" />

            {/* Floating Ornaments */}
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-40 left-[10%] w-24 h-24 bg-accent/5 rounded-3xl border border-accent/10 backdrop-blur-3xl hidden lg:flex items-center justify-center -z-10"
            >
                <Cpu className="w-10 h-10 text-accent/20" />
            </motion.div>

            <div className="max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-20 w-full py-20 lg:pt-40">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">

                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-7 space-y-12 text-center lg:text-left"
                    >
                        <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-primary/5 border border-primary/10 text-primary/40 text-[10px] font-black uppercase tracking-[0.4em]">
                            <Zap className="w-4 h-4 text-accent" />
                            Software Engineering 2026
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.04em] text-primary leading-[1.1] text-balance">
                            Building <span className="text-accent italic selection:text-white">Scalable</span> and Reliable Software Systems
                        </h1>

                        <p className="text-lg sm:text-xl text-primary/40 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium tracking-tight">
                            I am <span className="text-primary font-black underline decoration-accent/20 underline-offset-8">M. Hemachandravijay</span>, a software developer focused on creating secure, scalable, and high-performance applications across web and enterprise environments.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-8 justify-center lg:justify-start pt-8">
                            <Link
                                to="/projects"
                                className="relative overflow-hidden inline-flex items-center justify-center px-14 py-7 rounded-[2rem] bg-primary text-background font-black uppercase tracking-[0.3em] text-[10px] hover:bg-accent transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] active:scale-95 group"
                            >
                                <span className="relative z-10 flex items-center gap-4">
                                    View Projects
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                                </span>
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                            </Link>
                            <Link
                                to="/contact"
                                className="inline-flex items-center justify-center px-14 py-7 rounded-[2rem] border-2 border-primary/10 hover:border-accent/40 hover:bg-accent/[0.03] font-black uppercase tracking-[0.3em] text-[10px] text-primary transition-all active:scale-95 shadow-sm"
                            >
                                Contact Me
                            </Link>
                        </div>

                        {/* Features Interface */}
                        <div className="pt-20 grid grid-cols-2 sm:grid-cols-4 gap-12 border-t border-primary/5">
                            <FeatureCard icon={Activity} label="Performance" />
                            <FeatureCard icon={Layers} label="Scalability" />
                            <FeatureCard icon={Database} label="Integrity" />
                            <FeatureCard icon={Cloud} label="Availability" />
                        </div>
                    </motion.div>

                    {/* Profile Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-5 relative flex justify-center lg:justify-end"
                    >
                        <div className="relative w-full max-w-[500px] aspect-[4/5] rounded-[24px] overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] group bg-slate-100 dark:bg-slate-900/50 transition-all duration-700 hover:shadow-[0_30px_60px_-10px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_40px_80px_-10px_rgba(0,0,0,0.6)] hover:scale-[1.01]">

                            {/* Main Profile Image */}
                            <img
                                src={profileImage}
                                alt="Hemachandravijay M"
                                className={`w-full h-full object-cover object-top grayscale-[10%] group-hover:grayscale-0 transition-all duration-700 ${isUploading ? 'blur-sm' : ''}`}
                            />

                            {/* Inner Gradient Overlay - Professional Depth */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 dark:opacity-80 transition-opacity duration-700 pointer-events-none" />

                            {/* Executive Name Plate - Glassmorphism */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none"
                            >
                                <div className="p-5 rounded-[20px] bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg flex items-center justify-between gap-4 group-hover:translate-y-[-2px] transition-transform duration-500">
                                    <div className="space-y-1">
                                        <h3 className="cursive-signature text-2xl lg:text-3xl text-slate-900 dark:text-slate-100 leading-none pb-1">
                                            Hemachandravijay M
                                        </h3>
                                        <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">
                                            Software Developer
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800 text-accent">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Upload/Edit Trigger (Hidden by default, visible on hover) */}
                            <label className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer z-10 ${isUploading ? 'pointer-events-none' : ''}`}>
                                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-primary px-8 py-4 rounded-full flex items-center gap-3 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 border border-white/20">
                                    <Camera className="w-4 h-4 text-accent" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{hasCustomImage ? 'Update Profile' : 'Upload Photo'}</span>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isUploading}
                                />
                            </label>

                            {/* Upload Loading State */}
                            {isUploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm z-30">
                                    <div className="w-12 h-12 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
                                </div>
                            )}

                            {/* Success Confirmation */}
                            {uploadSuccess && !isUploading && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-md z-30"
                                >
                                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                                            <ShieldCheck className="w-6 h-6 text-green-500" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Updated</span>
                                    </div>
                                </motion.div>
                            )}

                        </div>

                        {/* Subtle Background Glow behind container */}
                        <div className="absolute -inset-10 bg-gradient-to-tr from-slate-200/50 via-transparent to-slate-200/30 dark:from-slate-800/20 dark:to-slate-800/10 rounded-[3rem] blur-3xl -z-10 opacity-100" />

                    </motion.div>

                </div>

                {/* Resume Builder Section */}
                <div id="resume-builder" className="py-24 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
                    <Suspense fallback={<div className="h-96 flex items-center justify-center text-primary/20">Loading Resume Builder...</div>}>
                        <InteractiveResume />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default Home;
