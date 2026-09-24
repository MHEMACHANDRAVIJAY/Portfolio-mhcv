import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfessionalTheme from './themes/ProfessionalTheme';
import CorporateTheme from './themes/CorporateTheme';
import ExecutiveTheme from './themes/ExecutiveTheme';
import SaaSTheme from './themes/SaaSTheme';
import DarkEnterpriseTheme from './themes/DarkEnterpriseTheme';
import MinimalTheme from './themes/MinimalTheme';
import ModernTheme from './themes/ModernTheme';
import NeutralCleanTheme from './themes/NeutralCleanTheme';
import MonochromeTheme from './themes/MonochromeTheme';
import BentoTheme from './themes/BentoTheme';
import SidebarTheme from './themes/SidebarTheme';
import TechTheme from './themes/TechTheme';
import TimelineTheme from './themes/TimelineTheme';
import LegendTheme from './themes/LegendTheme';
import CustomTheme from './themes/CustomTheme';

const PortfolioPreview = ({ data, theme }) => {
    if (!data) return null;

    const renderTheme = () => {
        switch (theme) {
            case 'professional':
                return <ProfessionalTheme data={data} />;
            case 'corporate':
                return <CorporateTheme data={data} />;
            case 'executive':
                return <ExecutiveTheme data={data} />;
            case 'saas':
                return <SaaSTheme data={data} />;
            case 'dark_enterprise':
                return <DarkEnterpriseTheme data={data} />;
            case 'minimal':
                return <MinimalTheme data={data} />;
            case 'modern':
                return <ModernTheme data={data} />;
            case 'neutral_clean':
                return <NeutralCleanTheme data={data} />;
            case 'monochrome':
                return <MonochromeTheme data={data} />;
            case 'bento':
                return <BentoTheme data={data} />;
            case 'sidebar':
                return <SidebarTheme data={data} />;
            case 'tech':
                return <TechTheme data={data} />;
            case 'timeline':
                return <TimelineTheme data={data} />;
            case 'legend':
                return <LegendTheme data={data} />;
            case 'custom':
                return <CustomTheme data={data} />;
            default:
                return <ProfessionalTheme data={data} />;
        }
    };

    return (
        <div className="w-full min-h-full bg-white text-gray-900 transition-all duration-700">
            <AnimatePresence mode="wait">
                <motion.div
                    key={theme}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full"
                >
                    {renderTheme()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default PortfolioPreview;
