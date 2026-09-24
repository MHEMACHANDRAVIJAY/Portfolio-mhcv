import React from 'react';

// ════════════════════════════════════════════════════════════
// ATS-GRADE Professional Theme — MHCV Resume Engine v2.0
// Matches quality of Google / Amazon / Microsoft resume format
// ════════════════════════════════════════════════════════════

// Renders a description string as clean bullet point list
const BulletList = ({ text, className = '' }) => {
    if (!text) return null;
    const lines = text
        .split('\n')
        .map(l => l.replace(/^[•\-*]\s*/, '').trim())
        .filter(Boolean);
    return (
        <ul className={`space-y-1.5 ${className}`}>
            {lines.map((line, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[12px] leading-relaxed text-[#444]">
                    <span className="mt-[5px] shrink-0 w-[5px] h-[5px] rounded-full bg-[#2563eb]" />
                    <span>{line}</span>
                </li>
            ))}
        </ul>
    );
};

// Section heading used throughout
const SectionHeading = ({ children }) => (
    <div className="mb-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.35em] text-[#2563eb]">
            {children}
        </h2>
        <div className="mt-1.5 h-[2px] bg-[#2563eb] w-full" />
    </div>
);

const ProfessionalTheme = ({ data }) => {
    if (!data) return null;

    const allSkills = Object.values(data.skills || {}).flat();

    // Contact line items — only show if value exists
    const contactItems = [
        data.contact?.email    && { label: data.contact.email,    href: `mailto:${data.contact.email}` },
        data.contact?.phone    && { label: data.contact.phone,    href: `tel:${data.contact.phone}` },
        data.contact?.location && { label: data.contact.location  },
        data.contact?.linkedin && { label: 'LinkedIn',            href: data.contact.linkedin },
        data.contact?.github   && { label: 'GitHub',              href: data.contact.github   },
        data.contact?.website  && { label: 'Portfolio',           href: data.contact.website  },
    ].filter(Boolean);

    return (
        <div
            className="bg-white text-[#1a1a1a] font-sans"
            style={{ fontFamily: "'Arial', 'Helvetica', sans-serif", minHeight: '100%' }}
        >
            {/* ═══════ HEADER ═══════ */}
            <header style={{ backgroundColor: '#f8fafc', borderBottom: '3px solid #2563eb', padding: '28px 36px 20px' }}>

                {/* Name */}
                <h1 style={{ fontSize: '26px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#0f172a', marginBottom: '4px', lineHeight: 1.1 }}>
                    {data.name || 'YOUR NAME'}
                </h1>

                {/* Title */}
                {data.title && (
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '14px' }}>
                        {data.title}
                    </p>
                )}

                {/* Contact row — pipe-separated, ATS-safe */}
                {contactItems.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 0', alignItems: 'center' }}>
                        {contactItems.map((item, i) => (
                            <React.Fragment key={i}>
                                {i > 0 && (
                                    <span style={{ color: '#94a3b8', fontSize: '11px', margin: '0 8px' }}>|</span>
                                )}
                                {item.href ? (
                                    <a
                                        href={item.href}
                                        style={{ fontSize: '11px', color: '#475569', fontWeight: 600, textDecoration: 'none' }}
                                    >
                                        {item.label}
                                    </a>
                                ) : (
                                    <span style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>
                                        {item.label}
                                    </span>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </header>

            {/* ═══════ BODY ═══════ */}
            <div style={{ padding: '24px 36px', display: 'flex', flexDirection: 'column', gap: '22px' }}>

                {/* PROFESSIONAL SUMMARY */}
                {data.summary && (
                    <section>
                        <SectionHeading>Professional Summary</SectionHeading>
                        <p style={{ fontSize: '12px', lineHeight: 1.75, color: '#374151', fontWeight: 400 }}>
                            {data.summary}
                        </p>
                    </section>
                )}

                {/* WORK EXPERIENCE */}
                {(data.experience || []).length > 0 && (
                    <section>
                        <SectionHeading>Work Experience</SectionHeading>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {data.experience.map((exp, i) => (
                                <div key={i} style={{ pageBreakInside: 'avoid' }}>
                                    {/* Role + Period row */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                                        <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                                            {exp.role || 'Role'}
                                        </h3>
                                        {exp.period && (
                                            <span style={{ fontSize: '10px', fontWeight: 700, color: '#2563eb', whiteSpace: 'nowrap', marginLeft: '12px', backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: '4px' }}>
                                                {exp.period}
                                            </span>
                                        )}
                                    </div>
                                    {/* Company */}
                                    {exp.company && (
                                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', marginTop: '1px' }}>
                                            {exp.company}
                                        </p>
                                    )}
                                    {/* Bullets */}
                                    {exp.desc && <BulletList text={exp.desc} />}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* TECHNICAL SKILLS */}
                {allSkills.length > 0 && (
                    <section>
                        <SectionHeading>Technical Skills</SectionHeading>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {Object.entries(data.skills).map(([key, skills]) =>
                                skills && skills.length > 0 ? (
                                    <div key={key} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                        <span style={{ fontSize: '10px', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap', minWidth: '110px', paddingTop: '1px' }}>
                                            {key}:
                                        </span>
                                        <span style={{ fontSize: '11px', color: '#374151', fontWeight: 500, lineHeight: 1.6 }}>
                                            {skills.join(' • ')}
                                        </span>
                                    </div>
                                ) : null
                            )}
                        </div>
                    </section>
                )}

                {/* PROJECTS */}
                {(data.projects || []).length > 0 && (
                    <section>
                        <SectionHeading>Projects</SectionHeading>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {data.projects.map((proj, i) => (
                                <div key={i} style={{ pageBreakInside: 'avoid' }}>
                                    <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                                        {proj.title || 'Project'}
                                    </h3>
                                    {proj.desc && <BulletList text={proj.desc} />}
                                    {proj.tech && proj.tech.length > 0 && (
                                        <p style={{ fontSize: '10px', color: '#2563eb', fontWeight: 700, marginTop: '4px' }}>
                                            Tech: {proj.tech.join(', ')}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* EDUCATION + CERTIFICATIONS — 2-col if both present */}
                <div style={{ display: 'grid', gridTemplateColumns: (data.education?.length > 0 && data.certifications?.length > 0) ? '1fr 1fr' : '1fr', gap: '24px' }}>

                    {(data.education || []).length > 0 && (
                        <section>
                            <SectionHeading>Education</SectionHeading>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {data.education.map((edu, i) => (
                                    <div key={i}>
                                        <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                                            {edu.degree}
                                        </h3>
                                        <p style={{ fontSize: '10px', fontWeight: 600, color: '#64748b', marginTop: '2px' }}>
                                            {[edu.institution, edu.year].filter(Boolean).join(' — ')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {(data.certifications || []).length > 0 && (
                        <section>
                            <SectionHeading>Certifications</SectionHeading>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {data.certifications.map((cert, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                        <span style={{ marginTop: '5px', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#2563eb', flexShrink: 0 }} />
                                        <div>
                                            <p style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                                                {cert.title}
                                            </p>
                                            {cert.issuer && (
                                                <p style={{ fontSize: '10px', color: '#64748b', marginTop: '1px' }}>
                                                    {cert.issuer}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

            </div>

            {/* ═══════ FOOTER ═══════ */}
            <footer style={{ marginTop: '16px', padding: '10px 36px', backgroundColor: '#0f172a', textAlign: 'center' }}>
                <p style={{ fontSize: '8px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4em', color: '#ffffff', opacity: 0.3 }}>
                    Generated via MHCV Portfolio Infrastructure V4.0 — ATS Optimized
                </p>
            </footer>
        </div>
    );
};

export default ProfessionalTheme;
