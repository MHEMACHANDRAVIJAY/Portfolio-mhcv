import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';

const InteractiveResume = lazy(() => import('../components/InteractiveResume'));

const Resume = () => {
    return (
        <div className="min-h-screen bg-background pt-32 pb-20 overflow-hidden relative">
            {/* Cinematic Background Elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 blur-[150px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/2 blur-[150px] -z-10" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <Suspense fallback={
                    <div className="min-h-[60vh] flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full border-2 border-primary/5 border-t-accent animate-spin" />
                    </div>
                }>
                    <InteractiveResume />
                </Suspense>
            </motion.div>
        </div>
    );
};

export default Resume;
