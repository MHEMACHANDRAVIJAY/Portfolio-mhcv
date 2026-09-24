import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Bot, Sparkles, User, RefreshCw, BadgeHelp } from 'lucide-react';

export const PortfolioChatbot = ({ portfolioData }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    const name = portfolioData?.name || 'the developer';
    const title = portfolioData?.title || 'Professional';

    // Set initial greeting
    useEffect(() => {
        if (portfolioData) {
            setMessages([
                {
                    sender: 'assistant',
                    text: `Hi there! I am your interactive Portfolio Chatbot, trained specifically on **${name}**'s background as a **${title}**.\n\nAsk me anything about their experience, projects, skills, education, or contact details!`,
                }
            ]);
        }
    }, [portfolioData, name, title]);

    // Scroll to bottom
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const suggestions = [
        "What are the main projects?",
        "What is their work experience?",
        "List all skills & technologies",
        "Where did they study?",
        "How can I contact them?"
    ];

    // local NLP / response generation system
    const generateLocalResponse = (query) => {
        const q = query.toLowerCase();
        const p = portfolioData || {};
        
        // 1. Projects
        if (q.includes('project') || q.includes('build') || q.includes('work done') || q.includes('portfolio')) {
            const projs = p.projects || [];
            if (!projs.length) {
                return `There are no specific projects listed in ${name}'s resume yet. Let's add some in the editor!`;
            }
            let reply = `Here are the key projects **${name}** has worked on:\n\n`;
            projs.forEach((proj, idx) => {
                reply += `🔹 **${proj.title || `Project ${idx + 1}`}**\n`;
                if (proj.description || proj.desc) {
                    reply += `   *Description:* ${proj.description || proj.desc}\n`;
                }
                const tech = proj.technologies || proj.tech || '';
                if (tech) {
                    reply += `   *Tech Stack:* \`${Array.isArray(tech) ? tech.join(', ') : tech}\`\n`;
                }
                if (proj.link && proj.link !== '#') {
                    reply += `   *Live Link:* [View Live Demo](${proj.link})\n`;
                }
                reply += `\n`;
            });
            return reply;
        }

        // 2. Experience
        if (q.includes('experience') || q.includes('job') || q.includes('work') || q.includes('career') || q.includes('company')) {
            const exp = p.experience || [];
            if (!exp.length) {
                return `${name} has not listed any corporate work experience, or is starting fresh! You can add entries in the timeline editor above.`;
            }
            let reply = `Here is **${name}**'s professional experience history:\n\n`;
            exp.forEach((job) => {
                const cmp = job.company || 'Company';
                const role = job.role || 'Professional';
                const dur = job.duration || job.period || '';
                const desc = job.description || job.desc || '';
                reply += `💼 **${role}** at **${cmp}** ${dur ? `(${dur})` : ''}\n`;
                if (desc) {
                    // split descriptions into clean lines
                    desc.split('\n').forEach(line => {
                        if (line.trim()) reply += `   • ${line.trim().replace(/^[•\-*]\s*/, '')}\n`;
                    });
                }
                reply += `\n`;
            });
            return reply;
        }

        // 3. Skills
        if (q.includes('skill') || q.includes('technology') || q.includes('tech') || q.includes('stack') || q.includes('language') || q.includes('tool')) {
            let reply = `**${name}** possesses expertise across these domains & technologies:\n\n`;
            
            if (p.skills && typeof p.skills === 'object' && !Array.isArray(p.skills)) {
                // Grouped skills
                let found = false;
                Object.entries(p.skills).forEach(([category, list]) => {
                    if (Array.isArray(list) && list.length > 0) {
                        found = true;
                        reply += `⚙️ **${category.toUpperCase()}**:\n   ${list.map(s => `\`${s}\``).join('  ')}\n\n`;
                    }
                });
                if (!found && p.skills.languages) {
                    reply = `⚙️ **Core Skills**:\n \`${p.skills}\``;
                }
            } else if (p.skills) {
                const skillStr = Array.isArray(p.skills) ? p.skills.join(', ') : p.skills;
                reply += `⚙️ **Core Stack**:\n   ${skillStr.split(',').map(s => `\`${s.trim()}\``).join('  ')}\n`;
            } else {
                reply = `No technical skills listed in the extracted dataset. Let's key in some skills in the Context Editor!`;
            }
            return reply;
        }

        // 4. Education
        if (q.includes('education') || q.includes('study') || q.includes('college') || q.includes('university') || q.includes('degree') || q.includes('gpa')) {
            const edu = p.education || [];
            if (!edu.length) {
                return `There is no formal education history listed. Feel free to fill it in above!`;
            }
            let reply = `Here is **${name}**'s academic background:\n\n`;
            edu.forEach((e) => {
                const deg = e.degree || 'Degree';
                const inst = e.institution || e.inst || 'Institution';
                const yr = e.year || '';
                const grade = e.grade || e.cgpa || '';
                reply += `🎓 **${deg}**\n   ${inst} ${yr ? `| ${yr}` : ''} ${grade ? `(Grade: ${grade})` : ''}\n\n`;
            });
            return reply;
        }

        // 5. Contact
        if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('linkedin') || q.includes('github') || q.includes('location')) {
            let reply = `You can connect with **${name}** directly through these channels:\n\n`;
            const contact = p.contact || {};
            const email = p.email || contact.email;
            const phone = p.phone || contact.phone;
            const loc = p.location || contact.location;
            const lkd = p.linkedin || contact.linkedin;
            const gh = p.github || contact.github;
            const web = p.website || contact.website;

            if (email) reply += `📧 **Email:** [${email}](mailto:${email})\n`;
            if (phone) reply += `📞 **Phone:** ${phone}\n`;
            if (loc)   reply += `📍 **Location:** ${loc}\n`;
            if (lkd)   reply += `🔗 **LinkedIn:** [View Profile](${lkd})\n`;
            if (gh)    reply += `💻 **GitHub:** [View Repository](${gh})\n`;
            if (web && web !== '#') reply += `🌐 **Website:** [Personal Site](${web})\n`;

            if (!email && !phone && !lkd && !gh) {
                reply = `Contact details are currently set to private or weren't detected. You can configure them in the editor above!`;
            }
            return reply;
        }

        // 6. Certifications & Achievements
        if (q.includes('cert') || q.includes('award') || q.includes('achieve') || q.includes('paper') || q.includes('license')) {
            const certs = p.certifications || [];
            const achs = p.achievements || [];
            let reply = '';
            
            if (certs.length > 0) {
                reply += `🏆 **Certifications:**\n`;
                certs.forEach(c => {
                    const title = typeof c === 'string' ? c : c.title;
                    const iss = c.issuer ? ` by ${c.issuer}` : '';
                    reply += `   • **${title}**${iss}\n`;
                });
                reply += `\n`;
            }
            if (achs.length > 0) {
                reply += `🌟 **Key Achievements:**\n`;
                achs.forEach(a => {
                    reply += `   • ${a}\n`;
                });
            }
            
            if (!reply) {
                return `No certifications or achievements listed. Add them in the editor for that extra V10 flair!`;
            }
            return reply;
        }

        // 7. General Profile Intro/Bio
        if (q.includes('hello') || q.includes('hi ') || q.includes('who are you') || q.includes('about') || q.includes('tell me about')) {
            const bio = p.bio || p.summary || '';
            let reply = `**About ${name}**:\n`;
            if (p.title) reply += `*Role:* **${p.title}**\n\n`;
            if (bio) {
                reply += `${bio}\n\n`;
            } else {
                reply += `An ambitious professional working in this domain. You can see their full details across categories in the editor above!\n\n`;
            }
            return reply;
        }

        // Default response: Keyword matching fails, do a smart summary
        const allSkills = p.skills 
            ? (typeof p.skills === 'object' && !Array.isArray(p.skills) ? Object.values(p.skills).flat().join(', ') : p.skills)
            : '';
        
        return `Interesting question! Let me compile what I know about **${name}** based on their resume data:\n\n` +
               `* **Core Role:** ${title}\n` +
               (allSkills ? `* **Key Technologies:** \`${allSkills.split(',').slice(0, 5).join(', ')}\`...\n` : '') +
               (p.experience?.length ? `* **Companies:** ${p.experience.map(e => e.company).slice(0, 3).join(', ')}\n` : '') +
               (p.projects?.length ? `* **Featured Project:** ${p.projects[0].title}\n` : '') +
               `\n*Try asking about: "projects", "work experience", "skills", "education", or "contact info".*`;
    };

    const handleSend = (text) => {
        const query = text || input.trim();
        if (!query) return;

        // User message
        setMessages(prev => [...prev, { sender: 'user', text: query }]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const reply = generateLocalResponse(query);
            setMessages(prev => [...prev, { sender: 'assistant', text: reply }]);
            setIsTyping(false);
        }, 600);
    };

    return (
        <div className="border border-primary/10 rounded-[2rem] bg-gradient-to-br from-primary/3 via-accent/2 to-primary/3 p-6 space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-primary/8">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-primary/8 rounded-xl">
                        <MessageSquare className="w-5 h-5 text-accent animate-pulse" />
                    </div>
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-primary">
                            Ask My Portfolio
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-accent/15 border border-accent/20 text-[7px] font-black uppercase tracking-widest text-accent">
                                <Sparkles className="w-2 h-2 mr-1 animate-spin" style={{ animationDuration: '6s' }} />
                                AI Chatbot
                            </span>
                        </h4>
                        <p className="text-[9px] font-bold text-primary/40">
                            Ask questions regarding {name}'s extracted resume details.
                        </p>
                    </div>
                </div>
                <button 
                    onClick={() => setMessages(prev => [prev[0]])}
                    className="p-1.5 hover:bg-primary/5 rounded-lg text-primary/30 hover:text-primary transition-colors text-[9px] font-black uppercase tracking-widest flex items-center gap-1"
                    title="Reset Chat"
                >
                    <RefreshCw className="w-3 h-3" /> Reset
                </button>
            </div>

            {/* Message Area */}
            <div className="h-[260px] overflow-y-auto px-1 space-y-4 pr-2 custom-scrollbar">
                <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px]
                                                ${msg.sender === 'user' ? 'bg-primary text-background' : 'bg-accent/15 text-accent'}`}>
                                    {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                                </div>
                                <div className={`p-3.5 rounded-2xl text-[10px] font-medium leading-relaxed whitespace-pre-line border
                                                ${msg.sender === 'user' 
                                                    ? 'bg-primary text-background border-primary rounded-tr-none' 
                                                    : 'bg-background/80 text-primary border-primary/5 rounded-tl-none shadow-sm'}`}
                                >
                                    {msg.text.split('\n').map((line, lIdx) => {
                                        // Simple bold rendering
                                        let content = line;
                                        // simple bold conversion (**word**)
                                        const boldRegex = /\*\*(.*?)\*\*/g;
                                        const parts = [];
                                        let lastIndex = 0;
                                        let match;
                                        while ((match = boldRegex.exec(line)) !== null) {
                                            if (match.index > lastIndex) {
                                                parts.push(line.substring(lastIndex, match.index));
                                            }
                                            parts.push(<strong key={match.index} className="font-extrabold text-accent">{match[1]}</strong>);
                                            lastIndex = boldRegex.lastIndex;
                                        }
                                        if (lastIndex < line.length) {
                                            parts.push(line.substring(lastIndex));
                                        }
                                        
                                        // simple link/code rendering
                                        const finalParts = parts.map((part, pIdx) => {
                                            if (typeof part === 'string') {
                                                // check for backticks `code`
                                                const codeParts = part.split(/`([^`]+)`/g);
                                                if (codeParts.length > 1) {
                                                    return codeParts.map((sub, sIdx) => 
                                                        sIdx % 2 === 1 
                                                            ? <code key={sIdx} className="bg-primary/8 text-primary px-1.5 py-0.5 rounded font-mono text-[9px] font-bold">{sub}</code>
                                                            : sub
                                                    );
                                                }
                                            }
                                            return part;
                                        });

                                        return <p key={lIdx} className={lIdx > 0 ? "mt-1.5" : ""}>{finalParts}</p>;
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-start"
                        >
                            <div className="flex gap-2 items-center">
                                <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center text-accent">
                                    <Bot className="w-3.5 h-3.5 animate-pulse" />
                                </div>
                                <div className="bg-primary/3 p-3 rounded-2xl rounded-tl-none border border-primary/5 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={chatEndRef} />
            </div>

            {/* Suggestions list */}
            {messages.length < 3 && (
                <div className="space-y-1.5">
                    <p className="text-[8px] font-black uppercase tracking-widest text-primary/30 flex items-center gap-1.5">
                        <BadgeHelp className="w-3 h-3 text-accent" /> Suggested Questions
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {suggestions.map((s, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSend(s)}
                                className="px-2.5 py-1.5 bg-primary/4 border border-primary/6 text-primary/60 hover:border-accent hover:text-accent hover:bg-accent/5 rounded-xl text-[9px] font-bold transition-all uppercase tracking-widest active:scale-95"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Box */}
            <div className="bg-primary/4 border border-primary/10 rounded-2xl p-2">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex items-center gap-2 relative"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about projects, work history, skills..."
                        className="w-full pl-4 pr-12 py-3 rounded-xl bg-background border-none outline-none text-[10px] text-primary placeholder:text-primary/30 font-bold focus:ring-1 focus:ring-accent/15 transition-all uppercase tracking-wider"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="absolute right-2 p-2 rounded-xl bg-accent text-background disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-colors shadow-sm active:scale-95 flex items-center justify-center"
                    >
                        <Send className="w-3.5 h-3.5" />
                    </button>
                </form>
            </div>
        </div>
    );
};
