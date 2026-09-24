import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles, AlertCircle, Cpu, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { BACKEND_URL } from '../utils/apiConfig';

const PortfolioAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            sender: 'assistant',
            text: "Hello. I am the Portfolio Assistant. I can provide details on Hemachandravijay's technical architecture, skills, and project history. How may I assist you?"
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    const quickQuestions = [
        "Tell me about this developer",
        "Show his projects",
        "What are his skills?",
        "How can I contact him?"
    ];

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (text) => {
        const query = text || input.trim();
        if (!query) return;

        // Add user message
        const newMessages = [...messages, { sender: 'user', text: query }];
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);

        try {
            // Simulate network delay for realism
            await new Promise(resolve => setTimeout(resolve, 800));

            const assistantEndpoint = BACKEND_URL ? `${BACKEND_URL}/api/assistant` : '/api/assistant';
            const response = await axios.post(assistantEndpoint, { query });

            setMessages(prev => [...prev, {
                sender: 'assistant',
                text: response.data.response
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                sender: 'assistant',
                text: "I am currently unable to access the portfolio database. Please check back later."
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[99] flex flex-col items-end gap-4 font-inter">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 25, scale: 0.92 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="w-[360px] sm:w-[420px] h-[540px] bg-slate-900/95 dark:bg-slate-950/98 backdrop-blur-3xl rounded-[2.2rem] shadow-[0_30px_100px_-15px_rgba(0,0,0,0.7)] border border-cyan-500/20 dark:border-cyan-500/30 flex flex-col overflow-hidden relative"
                    >
                        {/* Ambient Neural Glow & Tech Background Overlay */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_60%)] pointer-events-none" />
                        <div className="absolute inset-0 circuit-grid opacity-[0.04] pointer-events-none" />

                        {/* Top Decorative Corner Accents */}
                        <div className="absolute top-3 left-3 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400/40 pointer-events-none" />
                        <div className="absolute top-3 right-3 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400/40 pointer-events-none" />

                        {/* Futuristic Ultra-Premium AI Logo Header */}
                        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-cyan-500/20 flex items-center justify-between relative z-10 shadow-lg">
                            <div className="flex items-center gap-4">
                                {/* Ultra-Premium AI Intelligence Core Icon */}
                                <div className="relative group">
                                    {/* Outer Security Ring & Breathing Glow */}
                                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/30 via-blue-500/20 to-indigo-500/30 blur-md opacity-75 group-hover:opacity-100 transition-all duration-700 animate-pulse" />

                                    {/* Precision Layered Core Container */}
                                    <div className="relative w-11 h-11 rounded-2xl bg-slate-950 border border-cyan-400/40 p-0.5 shadow-[inset_0_2px_10px_rgba(6,182,212,0.25)] flex items-center justify-center overflow-hidden">
                                        {/* Circuit Layer Micro Traces */}
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15),transparent_70%)] pointer-events-none" />
                                        <div className="absolute inset-0 border border-cyan-400/10 rounded-xl pointer-events-none" />

                                        {/* Icon Core */}
                                        <Bot className="w-5 h-5 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] relative z-10 transition-transform duration-500 group-hover:scale-110" />

                                        {/* Micro Perimeter Ring */}
                                        <div className="absolute inset-0 rounded-xl border border-cyan-400/20 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Identity & Status */}
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2.5">
                                        <h3 className="text-sm font-black tracking-tight text-white drop-shadow-sm">Portfolio Assistant</h3>
                                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[9px] font-black uppercase tracking-[0.25em] text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                                            AI
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[9px] font-black text-cyan-400/80 tracking-[0.2em] uppercase">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]"></span>
                                        </span>
                                        SYSTEM ONLINE
                                    </div>
                                </div>
                            </div>

                            {/* Close Control */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-all border border-cyan-500/20 hover:border-cyan-400/40 shadow-sm active:scale-95"
                                title="Close Assistant"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Chat Messages Body */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 relative z-10 custom-scrollbar">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className="space-y-1 max-w-[85%]">
                                        {msg.sender === 'assistant' && (
                                            <div className="flex items-center gap-1.5 ml-1">
                                                <Sparkles className="w-3 h-3 text-cyan-400" />
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-400/80">AI Core Response</span>
                                            </div>
                                        )}
                                        <div
                                            className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-md backdrop-blur-md ${msg.sender === 'user'
                                                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm border border-blue-400/30'
                                                    : 'bg-slate-800/80 text-slate-100 border border-slate-700/70 rounded-tl-sm shadow-black/40'
                                                }`}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Neural Response / Processing Animation */}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-slate-800/90 border border-cyan-500/20 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-3 shadow-md">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                        <span className="text-[9px] font-black tracking-widest text-cyan-400/70 uppercase">PROCESSING INTEL...</span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Quick Questions Suggestions */}
                        {messages.length < 3 && (
                            <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar relative z-10 border-t border-slate-800/40">
                                {quickQuestions.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSend(q)}
                                        className="whitespace-nowrap px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-cyan-500/20 text-[10px] font-bold text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-200 transition-all shadow-sm active:scale-95"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="p-4 bg-slate-950/95 border-t border-cyan-500/15 relative z-10 backdrop-blur-2xl">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex items-center gap-2 relative"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about projects..."
                                    className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500/50 focus:bg-slate-850 outline-none text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 font-medium transition-all shadow-inner"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isTyping}
                                    className="absolute right-1.5 p-2 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-500 hover:to-cyan-500 transition-all shadow-md shadow-cyan-500/20 active:scale-95"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 rounded-2xl bg-slate-900/95 dark:bg-slate-950/98 border border-cyan-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex items-center justify-center group overflow-hidden relative z-50 backdrop-blur-2xl"
            >
                <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors" />
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                        >
                            <X className="w-6 h-6 text-cyan-300" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                        >
                            <MessageSquare className="w-6 h-6 text-cyan-400" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Notification Pulse Dot */}
                {!isOpen && (
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-slate-900 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                )}
            </motion.button>
        </div>
    );
};

export default PortfolioAssistant;
