import React, { createContext, useContext, useEffect, useState } from 'react';

const PortfolioContext = createContext();

const defaultProfileData = {
    name: "M. Hemachandravijay",
    title: "Software Developer",
    contact: {
        email: "mhemachandravijay347@gmail.com",
        phone: "+91 9488347494",
        location: "Aruppukottai, Tamil Nadu, India",
        linkedin: "https://linkedin.com/in/hemachandravijay-m",
        github: "https://github.com/hemachandravijay-m",
        website: "https://github.com/hemachandravijay-m"
    },
    summary: "Software developer specializing in the design and development of scalable, secure, and maintainable software systems. Focuses on clean architecture, performance optimization, and real-world problem solving to deliver resilient digital outcomes.",
    skills: {
        languages: ["Java", "Python", "JavaScript", "C++", "HTML", "CSS"],
        frameworks: ["React", "Spring Boot", "Django", "Node.js", "Express", "Tailwind CSS"],
        tools: ["Git", "GitHub", "Jira", "VS Code", "Figma", "Postman", "IoT"],
        databases: ["PostgreSQL", "MySQL", "Room", "MongoDB"],
        cloud: ["AWS", "Cloud Architecture"]
    },
    experience: [
        {
            role: "Software Developer",
            company: "Startup / Enterprise",
            period: "MAR 2025 - PRESENT",
            desc: "• Leading development of scalable web applications, optimizing backend performance, and implementing secure cloud infrastructure."
        },
        {
            role: "Mobile App Development Intern",
            company: "Native Sparrow Software Solutions LLP",
            period: "MAY 2024 - JUN 2024",
            desc: "• Completed a one-month intensive internship in Mobile App Development at Native Sparrow Software Solutions LLP, Chennai. Demonstrated strong professional conduct and attendance throughout the training period."
        }
    ],
    projects: [
        {
            id: "TODO-07",
            title: 'Smart To-Do Pro Enterprise',
            type: 'Enterprise Productivity Android App',
            desc: 'Native Android productivity app with real authentication, offline-first architecture using Room, smart task prioritization, cloud sync, and enterprise-grade UI powered by Spring Boot and PostgreSQL backend.',
            stack: ['Android', 'Java', 'Spring Boot', 'PostgreSQL', 'JWT', 'MVVM'],
            github: 'https://github.com/hemachandravijay-m',
            live: '#'
        },
        {
            id: "SEC-06",
            title: 'SecureSnap',
            type: 'Cybersecure Stock Photo Marketplace',
            desc: 'Enterprise-grade stock photo marketplace with security-first architecture, featuring role-based access control, watermarked previews, secure downloads, and real-time fiscal monitoring.',
            stack: ['Django', 'PostgreSQL', 'JWT Auth', 'REST API', 'Tailwind'],
            github: 'https://github.com/hemachandravijay-m',
            live: '#'
        },
        {
            id: "TWIN-05",
            title: 'Farmer Digital Twin',
            type: 'IoT Software System',
            desc: 'Developed a high-fidelity digital twin ecosystem for precision agriculture, integrating real-time sensor data and predictive algorithms.',
            stack: ['IoT', 'Python', 'React', 'Data Processing'],
            github: 'https://github.com/hemachandravijay-m',
            live: '#'
        }
    ],
    education: [
        {
            degree: "B.Tech Information Technology",
            school: "Kalasalingam Academy",
            period: "2022 - 2026",
            score: "CGPA: 7.30"
        }
    ],
    certifications: [
        {
            title: "Data Analytics & Visualization",
            issuer: "Accenture",
            year: "2025"
        },
        {
            title: "Solutions Architecture",
            issuer: "Amazon Web Services",
            year: "2025"
        },
        {
            title: "TCS iON Career Edge - Young Professional",
            issuer: "Tata Consultancy Services",
            year: "2025"
        }
    ],
    achievements: [
        "Ranked top 20% globally across professional simulations and achieved 100% accuracy in leadership modules."
    ]
};

export const PortfolioProvider = ({ children }) => {
    const [portfolioData, setPortfolioData] = useState(() => {
        const saved = localStorage.getItem('portfolioData');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse saved portfolioData", e);
            }
        }
        return defaultProfileData;
    });

    useEffect(() => {
        if (portfolioData) {
            localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
        } else {
            localStorage.removeItem('portfolioData');
        }
    }, [portfolioData]);

    const updatePortfolioData = (data) => {
        setPortfolioData(data);
    };

    const clearPortfolioData = () => {
        setPortfolioData(defaultProfileData);
    };

    return (
        <PortfolioContext.Provider value={{ portfolioData, setPortfolioData: updatePortfolioData, clearPortfolioData }}>
            {children}
        </PortfolioContext.Provider>
    );
};

export const usePortfolio = () => useContext(PortfolioContext);
