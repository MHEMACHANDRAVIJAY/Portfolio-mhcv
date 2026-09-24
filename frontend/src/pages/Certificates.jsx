import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ExternalLink, X, ShieldCheck, Download, Search, ZoomIn, Calendar, Building2, Upload, FileText, CheckCircle2, Trash2, Cloud, ZoomOut, Maximize2, AlertCircle } from 'lucide-react';
import { certificates as initialCertificates } from '../data/certificates';

import { BACKEND_URL } from '../utils/apiConfig';
import { saveVaultDocument, getAllVaultDocuments, deleteVaultDocument } from '../utils/vaultStorage';

// Ultra-Futuristic Upload Modal for Certificates
const CertificateUploadModal = ({ isOpen, onClose, cert, onUpload }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState(null);
    const fileInputRef = useRef(null);

    if (!isOpen || !cert) return null;

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const handleFileUpload = async (file) => {
        const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setUploadError('Please upload a PDF, PNG, JPG, or WebP document.');
            return;
        }

        if (file.size > 15 * 1024 * 1024) {
            setUploadError('File size must be less than 15MB.');
            return;
        }

        setUploading(true);
        setUploadProgress(0);
        setUploadError(null);

        try {
            // 1. Immediately save to IndexedDB database for guaranteed permanent persistence
            const localSaved = await saveVaultDocument('certificates', cert.id, file, {
                title: cert.title,
                issuer: cert.issuer,
                fileName: file.name,
                fileType: file.type
            });

            // 2. Progress simulation for sleek UX
            const interval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 85) {
                        clearInterval(interval);
                        return 85;
                    }
                    return prev + 15;
                });
            }, 120);

            // 3. Attempt backend upload if backend URL is available
            let serverCert = null;
            if (BACKEND_URL) {
                try {
                    const formData = new FormData();
                    formData.append('file', file);
                    if (cert.title) formData.append('title', cert.title);
                    if (cert.issuer) formData.append('issuer', cert.issuer);

                    const res = await fetch(`${BACKEND_URL}/api/certificates/${cert.id}`, {
                        method: 'POST',
                        body: formData
                    });

                    if (res.ok) {
                        const data = await res.json();
                        serverCert = data.certificate;
                    }
                } catch (backendErr) {
                    console.warn('[CertificateUpload] Backend unreachable, using vault persistence:', backendErr);
                }
            }

            clearInterval(interval);
            setUploadProgress(100);

            const finalDoc = serverCert || localSaved || {
                certId: cert.id,
                id: cert.id,
                fileName: file.name,
                fileType: file.type,
                file: URL.createObjectURL(file),
                uploadDate: new Date().toISOString()
            };

            setTimeout(() => {
                onUpload(cert.id, finalDoc);
                setUploading(false);
                setUploadProgress(0);
                onClose();
            }, 400);
        } catch (err) {
            console.error('[CERTIFICATE UPLOAD ERROR]', err);
            setUploading(false);
            setUploadProgress(0);
            setUploadError(err.message || 'Upload failed. Please try again.');
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-2xl p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-8 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                                    <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                                            {cert.id}
                                        </span>
                                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                            {cert.issuer}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
                                        {cert.title}
                                    </h3>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all border border-slate-300 dark:border-slate-700 cursor-pointer"
                            >
                                <X className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                            </button>
                        </div>
                    </div>

                    <div className="p-8">
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-500 ${isDragging
                                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/5 scale-[1.02]'
                                : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/30 dark:hover:bg-blue-500/5'
                                }`}
                        >
                            <div className="p-12 text-center space-y-6">
                                <motion.div animate={{ y: isDragging ? -10 : 0 }} className="flex justify-center">
                                    <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                                        <Cloud className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </motion.div>
                                <div className="space-y-3">
                                    <p className="text-lg font-bold text-slate-800 dark:text-white">
                                        {isDragging ? 'Drop certificate here' : 'Drop official certificate file here or click to upload'}
                                    </p>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        Supports PDF, PNG, JPG, WebP • Max 15MB
                                    </p>
                                </div>
                                <div className="flex items-center justify-center gap-3 pt-4">
                                    {['PDF', 'PNG', 'JPG', 'WebP'].map((type) => (
                                        <div
                                            key={type}
                                            className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
                                        >
                                            {type}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept=".pdf,.png,.jpg,.jpeg,.webp"
                                onChange={handleFileSelect}
                            />
                        </div>

                        {uploadError && (
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{uploadError}</span>
                                </div>
                                <button onClick={() => setUploadError(null)} className="p-1 hover:opacity-70">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </motion.div>
                        )}

                        {uploading && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">Uploading to Vault...</span>
                                    <span className="font-bold text-blue-600 dark:text-blue-400">{uploadProgress}%</span>
                                </div>
                                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${uploadProgress}%` }}
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const CertificateCard = ({ cert, onClick, onUpload, uploadedDoc }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="group bg-card border border-primary/10 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 flex flex-col h-full relative"
    >
        <div className="relative h-72 bg-primary flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_70%)] group-hover:scale-150 transition-transform duration-1000" />

            {uploadedDoc?.file ? (
                uploadedDoc.fileType === 'application/pdf' || uploadedDoc.file.endsWith('.pdf') ? (
                    <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white space-y-2 p-6">
                        <FileText className="w-16 h-16 text-blue-400" />
                        <span className="text-xs font-bold text-blue-200 truncate max-w-full">
                            {uploadedDoc.fileName || uploadedDoc.originalName || 'Uploaded PDF Document'}
                        </span>
                    </div>
                ) : (
                    <img
                        src={uploadedDoc.file}
                        alt={cert.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                    />
                )
            ) : (
                <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700 hover:scale-110"
                />
            )}

            <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-primary/30 backdrop-blur-sm">
                <button
                    onClick={() => onClick(cert)}
                    className="p-4 rounded-full bg-white text-primary shadow-2xl hover:scale-110 transition-all cursor-pointer"
                    title="View Certificate Details"
                >
                    <ZoomIn className="w-5 h-5" />
                </button>
                {uploadedDoc?.file && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            window.open(uploadedDoc.file, '_blank', 'noopener,noreferrer');
                        }}
                        className="p-4 rounded-full bg-emerald-600 text-white shadow-2xl hover:scale-110 transition-all cursor-pointer"
                        title="View Certificate Document"
                    >
                        <ExternalLink className="w-5 h-5" />
                    </button>
                )}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onUpload(cert);
                    }}
                    className="p-4 rounded-full bg-blue-600 text-white shadow-2xl hover:scale-110 transition-all cursor-pointer"
                    title="Upload / Replace Certificate File"
                >
                    <Upload className="w-5 h-5" />
                </button>
            </div>

            <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[9px] font-black text-white/60 tracking-[0.2em] uppercase">
                ID: {cert.id}
            </div>

            {uploadedDoc?.file && (
                <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-[9px] font-extrabold uppercase tracking-wider shadow-lg">
                    <CheckCircle2 className="w-3 h-3" />
                    UPLOADED
                </div>
            )}
        </div>

        <div className="p-10 flex flex-col flex-grow space-y-6">
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <Building2 className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                    <p className="text-accent font-black text-[10px] uppercase tracking-[0.3em]">{cert.issuer}</p>
                </div>
                <h3 className="text-2xl font-black text-primary tracking-tighter leading-snug group-hover:text-accent transition-colors">
                    {cert.title}
                </h3>
                {cert.role && (
                    <p className="text-sm font-bold text-primary/60 tracking-tight">{cert.role}</p>
                )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-primary/5 mt-auto gap-2 flex-wrap">
                <div className="flex items-center gap-2 text-[10px] font-bold text-primary/30 uppercase tracking-widest">
                    <Calendar className="w-3.5 h-3.5" />
                    {cert.duration || `Issued: ${cert.year}`}
                </div>

                {uploadedDoc?.file ? (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(uploadedDoc.file, '_blank', 'noopener,noreferrer');
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                            title="View Certificate"
                        >
                            <ExternalLink className="w-3 h-3" />
                            View Certificate
                        </button>
                        <button
                            onClick={() => onUpload(cert)}
                            className="px-2.5 py-1.5 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary/60 text-[10px] font-bold transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                            title="Replace Certificate"
                        >
                            <Upload className="w-3 h-3" />
                            Replace
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => onUpload(cert)}
                        className="px-3.5 py-1.5 rounded-xl bg-primary/5 hover:bg-blue-600 hover:text-white text-[10px] font-bold text-primary/60 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                    >
                        <Upload className="w-3 h-3" />
                        Upload Vault
                    </button>
                )}
            </div>
        </div>
    </motion.div>
);

const CertificateModal = ({ cert, onClose, onUpload, onDeleteDoc, uploadedDoc }) => {
    if (!cert) return null;

    const displayPdf = uploadedDoc?.file || cert.pdfUrl;
    const isUploadedPdf = uploadedDoc?.file && (uploadedDoc.fileType === 'application/pdf' || uploadedDoc.file.endsWith('.pdf'));

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-20 bg-primary/20 backdrop-blur-[20px] overflow-y-auto"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-background w-full max-w-6xl rounded-[3rem] overflow-hidden shadow-[0_100px_200px_-50px_rgba(0,0,0,0.5)] border border-primary/10 flex flex-col lg:flex-row relative my-auto max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 p-4 rounded-2xl bg-primary/5 text-primary/40 hover:bg-red-500 hover:text-white transition-all z-20 cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Certificate Render Area */}
                <div className="lg:w-[60%] bg-primary flex items-center justify-center p-8 lg:p-12 relative overflow-hidden">
                    <div className="absolute top-12 left-12 flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 z-10">
                        <Award className="w-5 h-5 text-accent" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">
                            {uploadedDoc?.file ? 'Verified User Document' : 'Digital Evidence'}
                        </span>
                    </div>

                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.4)] group/img">
                        {isUploadedPdf ? (
                            <iframe
                                src={uploadedDoc.file}
                                title={cert.title}
                                className="w-full h-full bg-white border-none"
                            />
                        ) : (
                            <img
                                src={uploadedDoc?.file || cert.image}
                                alt={cert.title}
                                className="w-full h-full object-cover"
                            />
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-10 pt-20">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">MHCV Verified Credential</p>
                        </div>
                        <div className="absolute inset-0 border-8 border-white/5 pointer-events-none" />
                    </div>
                </div>

                {/* Metadata Area */}
                <div className="lg:w-[40%] p-12 lg:p-20 flex flex-col justify-between overflow-y-auto">
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 px-5 py-2 rounded-full bg-primary/5 border border-primary/10 w-fit">
                                <ShieldCheck className="w-4 h-4 text-accent" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40">Verified Credential</span>
                            </div>
                            <h2 className="text-3xl font-black tracking-tighter text-primary leading-tight">
                                {cert.title}
                            </h2>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="p-4 rounded-2xl bg-primary/5 text-primary/30">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/20">Issuing Authority</p>
                                    <p className="text-lg font-bold text-primary">{cert.issuer}</p>
                                </div>
                            </div>

                            {cert.role && (
                                <div className="flex items-center gap-6">
                                    <div className="p-4 rounded-2xl bg-primary/5 text-primary/30">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/20">Role / Specialization</p>
                                        <p className="text-lg font-bold text-primary">{cert.role}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-6">
                                <div className="p-4 rounded-2xl bg-primary/5 text-primary/30">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/20">{cert.duration ? 'Duration' : 'Year of Completion'}</p>
                                    <p className="text-lg font-bold text-primary">{cert.duration || cert.year}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/20">Institutional Context</p>
                            <p className="text-[14px] font-medium text-primary/50 leading-relaxed italic">
                                "{cert.description}"
                            </p>
                        </div>
                    </div>

                    <div className="pt-12 mt-12 border-t border-primary/5 space-y-4">
                        <div className="flex flex-wrap gap-4">
                            {uploadedDoc?.file && (
                                <button
                                    onClick={() => window.open(uploadedDoc.file, '_blank', 'noopener,noreferrer')}
                                    className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 transition-all shadow-xl active:scale-95 cursor-pointer"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    View Certificate
                                </button>
                            )}

                            <button
                                onClick={() => onUpload(cert)}
                                className={`px-6 py-3.5 rounded-2xl ${uploadedDoc?.file ? 'bg-primary/5 hover:bg-primary/10 text-primary/80' : 'bg-blue-600 hover:bg-blue-700 text-white'} text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 transition-all shadow-xl active:scale-95 cursor-pointer`}
                            >
                                <Upload className="w-4 h-4" />
                                {uploadedDoc?.file ? 'Replace Document' : 'Upload Document'}
                            </button>

                            {uploadedDoc?.file && (
                                <button
                                    onClick={() => onDeleteDoc(cert.id)}
                                    className="px-6 py-3.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/30 dark:hover:bg-red-900/50 dark:text-red-400 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 transition-all active:scale-95 cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Upload
                                </button>
                            )}

                            {displayPdf && (
                                <a
                                    href={displayPdf}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download={uploadedDoc?.fileName || uploadedDoc?.originalName || `${cert.id}_Certificate.pdf`}
                                    className="px-6 py-3.5 rounded-2xl bg-primary text-background text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-accent transition-all shadow-xl active:scale-95"
                                >
                                    <Download className="w-4 h-4" />
                                    Download File
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Certificates = () => {
    const [selectedCert, setSelectedCert] = useState(null);
    const [uploadingCert, setUploadingCert] = useState(null);
    const [uploads, setUploads] = useState({});

    // Fetch saved certificates from IndexedDB and backend on mount for permanent persistence
    useEffect(() => {
        const loadCertificates = async () => {
            // 1. Instantly load from IndexedDB permanent browser database
            try {
                const localVault = await getAllVaultDocuments('certificates');
                if (localVault && Object.keys(localVault).length > 0) {
                    setUploads(prev => ({ ...prev, ...localVault }));
                }
            } catch (idbErr) {
                console.warn('[Certificates] IndexedDB load warning:', idbErr);
            }

            // 2. Sync with backend if BACKEND_URL is available
            if (BACKEND_URL) {
                try {
                    const res = await fetch(`${BACKEND_URL}/api/certificates`);
                    if (res.ok) {
                        const data = await res.json();
                        if (data.success && data.certificates) {
                            const loaded = {};
                            Object.entries(data.certificates).forEach(([certId, certData]) => {
                                loaded[certId] = {
                                    ...certData,
                                    file: certData.fileUrl ? `${BACKEND_URL}${certData.fileUrl}` : certData.file
                                };
                            });
                            setUploads(prev => ({ ...prev, ...loaded }));
                        }
                    }
                } catch (err) {
                    console.log('[Certificates] Operating in client-vault persistence mode');
                }
            }
        };

        loadCertificates();
    }, []);

    const handleUploadDoc = (certId, savedCert) => {
        const formattedDoc = {
            ...savedCert,
            file: savedCert.fileUrl ? `${BACKEND_URL}${savedCert.fileUrl}` : savedCert.file
        };
        setUploads(prev => ({
            ...prev,
            [certId]: formattedDoc
        }));
    };

    const handleDeleteDoc = async (certId) => {
        if (!window.confirm('Are you sure you want to remove this uploaded certificate?')) {
            return;
        }

        // Delete from local IndexedDB
        try {
            await deleteVaultDocument('certificates', certId);
        } catch (idbErr) {
            console.warn('[Certificates] IndexedDB delete error:', idbErr);
        }

        // Delete from backend if available
        if (BACKEND_URL) {
            try {
                await fetch(`${BACKEND_URL}/api/certificates/${certId}`, {
                    method: 'DELETE'
                });
            } catch (err) {
                console.warn('[Certificates] Backend delete note:', err);
            }
        }

        setUploads(prev => {
            const next = { ...prev };
            delete next[certId];
            return next;
        });
        setSelectedCert(null);
    };

    return (
        <div className="max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-20 py-24 lg:py-48 relative min-h-screen">
            {/* Architectural Grid System */}
            <div className="absolute inset-0 circuit-grid opacity-[0.03] dark:opacity-[0.05] -z-10" />

            {/* Narrative Header */}
            <div className="max-w-5xl mx-auto text-center mb-32 space-y-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-primary/5 border border-primary/10 text-primary/40 font-black text-[10px] uppercase tracking-[0.4em]"
                >
                    <Award className="w-4 h-4 text-accent" />
                    Credentials & Certifications
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2 }}
                    className="text-5xl lg:text-6xl font-black tracking-[-0.04em] text-primary leading-[1.1] text-balance"
                >
                    Professional <span className="text-accent italic">Authority</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="text-lg lg:text-xl text-primary/40 max-w-2xl mx-auto font-medium leading-relaxed tracking-tight"
                >
                    A registry of institutional acknowledgments, research conference presentation certificates, and technical certifications verifying specialized expertise.
                </motion.p>
            </div>

            {/* Grid Architecture */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-12">
                {initialCertificates.map((cert, idx) => (
                    <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <CertificateCard
                            cert={cert}
                            onClick={setSelectedCert}
                            onUpload={(c) => setUploadingCert(c)}
                            uploadedDoc={uploads[cert.id]}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Registry Footer */}
            <div className="mt-48 text-center">
                <div className="h-[2px] w-24 bg-primary/5 mx-auto mb-12" />
                <p className="text-[10px] font-black text-primary/20 uppercase tracking-[0.6em]">
                    End of Credentials Registry • Integrity Verified
                </p>
            </div>

            <AnimatePresence>
                {selectedCert && (
                    <CertificateModal
                        cert={selectedCert}
                        onClose={() => setSelectedCert(null)}
                        onUpload={(c) => setUploadingCert(c)}
                        onDeleteDoc={handleDeleteDoc}
                        uploadedDoc={uploads[selectedCert.id]}
                    />
                )}
            </AnimatePresence>

            {uploadingCert && (
                <CertificateUploadModal
                    isOpen={!!uploadingCert}
                    onClose={() => setUploadingCert(null)}
                    cert={uploadingCert}
                    onUpload={handleUploadDoc}
                />
            )}
        </div>
    );
};

export default Certificates;
