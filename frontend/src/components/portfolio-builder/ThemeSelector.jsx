import React from 'react';
import { Monitor, Star, Sparkles, Code, Zap, Layout, Maximize, Ghost, Droplet, Shield, Layers, Columns, Terminal, History, Trophy, Palette, Briefcase } from 'lucide-react';

const themes = [
    { id: 'professional', label: 'Elite Pro', icon: Monitor, color: 'bg-blue-600' },
    { id: 'corporate', label: 'Corporate', icon: Briefcase, color: 'bg-slate-700' },
    { id: 'executive', label: 'Executive', icon: Star, color: 'bg-[#d4af37]' },
    { id: 'saas', label: 'Tech SaaS', icon: Sparkles, color: 'bg-indigo-600' },
    { id: 'dark_enterprise', label: 'Dark Shield', icon: Shield, color: 'bg-emerald-900' },
    { id: 'modern', label: 'Modern Flex', icon: Maximize, color: 'bg-indigo-500' },
    { id: 'minimal', label: 'Minimalist', icon: Layout, color: 'bg-slate-400' },
    { id: 'neutral_clean', label: 'Neutral Clean', icon: Droplet, color: 'bg-slate-200' },
    { id: 'monochrome', label: 'Monochrome', icon: Ghost, color: 'bg-black' },
    { id: 'bento', label: 'Bento Grid', icon: Layers, color: 'bg-violet-600' },
    { id: 'sidebar', label: 'Sidebar', icon: Columns, color: 'bg-amber-600' },
    { id: 'tech', label: 'Raw Tech', icon: Terminal, color: 'bg-green-600' },
    { id: 'timeline', label: 'Timeline', icon: History, color: 'bg-blue-500' },
    { id: 'legend', label: 'The Legend', icon: Trophy, color: 'bg-red-600' },
    { id: 'custom', label: 'Customizable', icon: Palette, color: 'bg-pink-500' },
];

const ThemeSelector = ({ currentTheme, onThemeChange }) => {
    return (
        <div className="flex flex-wrap gap-2 bg-primary/2 p-2 rounded-2xl border border-primary/5">
            {themes.map((theme) => (
                <button
                    key={theme.id}
                    onClick={() => onThemeChange(theme.id)}
                    className={`relative flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-500 group overflow-hidden border ${currentTheme === theme.id ? 'bg-primary border-primary shadow-2xl scale-105' : 'bg-background border-primary/5 hover:border-primary/20'}`}
                >
                    <div className={`w-2 h-2 rounded-full ${theme.color}`} />
                    <theme.icon className={`w-3.5 h-3.5 transition-colors duration-500 ${currentTheme === theme.id ? 'text-accent' : 'text-primary/40'}`} />
                    <span className={`text-[9px] font-black uppercase tracking-widest transition-colors duration-500 ${currentTheme === theme.id ? 'text-background' : 'text-primary/40'}`}>
                        {theme.label}
                    </span>

                    {currentTheme === theme.id && (
                        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent pointer-events-none" />
                    )}
                </button>
            ))}
        </div>
    );
};

export default ThemeSelector;
