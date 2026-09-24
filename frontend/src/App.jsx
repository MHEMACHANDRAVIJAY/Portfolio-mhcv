import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { PortfolioProvider } from './context/PortfolioContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PortfolioAssistant from './components/PortfolioAssistant';

// Lazy Load Pages for Performance Optimization
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Skills = lazy(() => import('./pages/Skills'));
const Projects = lazy(() => import('./pages/Projects'));
const Education = lazy(() => import('./pages/Education'));
const Certificates = lazy(() => import('./pages/Certificates'));
const Resume = lazy(() => import('./pages/Resume'));
const Contact = lazy(() => import('./pages/GatewayContact'));
const PortfolioBuilder = lazy(() => import('./pages/PortfolioBuilder'));

// Premium Loading State
const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
            <div className="w-12 h-12 rounded-full border-2 border-primary/5 border-t-accent animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/20">Initializing System</span>
        </div>
    </div>
);

const App = () => {
    const location = useLocation();

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <ThemeProvider>
            <PortfolioProvider>
                <div className="flex flex-col min-h-screen bg-background transition-colors duration-500 font-inter text-primary overflow-x-hidden">
                    <Navbar />

                    <main className="flex-grow">
                        <Suspense fallback={<PageLoader />}>
                            <AnimatePresence mode="wait">
                                <Routes location={location} key={location.pathname}>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/about" element={<About />} />
                                    <Route path="/skills" element={<Skills />} />
                                    <Route path="/projects" element={<Projects />} />
                                    <Route path="/education" element={<Education />} />
                                    <Route path="/certificates" element={<Certificates />} />
                                    <Route path="/resume" element={<Resume />} />
                                    <Route path="/contact" element={<Contact />} />
                                    <Route path="/portfolio-builder" element={<PortfolioBuilder />} />
                                </Routes>
                            </AnimatePresence>
                        </Suspense>
                    </main>

                    <PortfolioAssistant />
                    <Footer />
                </div>
            </PortfolioProvider>
        </ThemeProvider>
    );
};

export default App;
