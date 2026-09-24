import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ShieldCheck,
    Library,
    ChevronRight,
    GraduationCap,
    Award,
    BookMarked,
    Star,
    Globe,
    FileText,
    X,
    ZoomIn,
    ZoomOut,
    Download,
    Upload,
    Cloud,
    Calendar,
    CheckCircle2,
    AlertCircle,
    ChevronLeft,
    ChevronDown,
    Eye,
    Maximize2,
    Archive,
    Lock,
    FolderLock,
    Database,
    Trash2,
    AlertTriangle
} from 'lucide-react';

import { BACKEND_URL } from '../utils/apiConfig';
import { saveVaultDocument, getAllVaultDocuments, deleteVaultDocument } from '../utils/vaultStorage';

// Ultra-Futuristic Upload Modal
const UploadModal = ({ isOpen, onClose, semester, onUpload, docType }) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [uploading, setUploading] = React.useState(false);
    const [uploadProgress, setUploadProgress] = React.useState(0);
    const [uploadError, setUploadError] = React.useState(null);
    const fileInputRef = React.useRef(null);

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
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const handleFileUpload = async (file) => {
        // Validate file type
        const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload a PDF, PNG, or JPG file');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }

        setUploading(true);
        setUploadProgress(0);
        setUploadError(null);

        try {
            // 1. Immediately save to IndexedDB database for guaranteed permanent persistence
            const localSaved = await saveVaultDocument('marksheets', docType, file, {
                docType,
                originalName: file.name,
                fileName: file.name,
                fileType: file.type
            });

            // 2. Simulate progress while uploading
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 85) { clearInterval(progressInterval); return 85; }
                    return prev + 15;
                });
            }, 120);

            // 3. Attempt backend upload if BACKEND_URL is available
            let serverMarksheet = null;
            if (BACKEND_URL) {
                try {
                    const response = await fetch(`${BACKEND_URL}/api/marksheets/${docType}`, {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        const data = await response.json();
                        serverMarksheet = data.marksheet;
                    }
                } catch (backendErr) {
                    console.warn('[EducationUpload] Backend unreachable, using vault persistence:', backendErr);
                }
            }

            clearInterval(progressInterval);
            setUploadProgress(100);

            const finalMarksheet = serverMarksheet || localSaved || {
                docType,
                originalName: file.name,
                fileName: file.name,
                fileType: file.type,
                file: URL.createObjectURL(file),
                uploadDate: new Date().toISOString()
            };

            setTimeout(() => {
                onUpload(finalMarksheet);
                setUploading(false);
                setUploadProgress(0);
                onClose();
            }, 400);
        } catch (err) {
            setUploading(false);
            setUploadProgress(0);
            setUploadError(err.message || 'Upload failed. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xl p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Executive Header */}
                    <div className="p-8 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                                    <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                                        Upload Grade Card
                                    </h3>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                                        {semester}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all duration-300 border border-slate-300 dark:border-slate-700"
                            >
                                <X className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                            </button>
                        </div>
                    </div>

                    {/* Upload Area */}
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
                                {/* Upload Icon */}
                                <motion.div
                                    animate={{ y: isDragging ? -10 : 0 }}
                                    className="flex justify-center"
                                >
                                    <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                                        <Cloud className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </motion.div>

                                {/* Upload Text */}
                                <div className="space-y-3">
                                    <p className="text-lg font-bold text-slate-800 dark:text-white">
                                        {isDragging ? 'Drop grade card here' : 'Drop grade card here or click to upload'}
                                    </p>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        Supports PDF, PNG, JPG • Max 10MB
                                    </p>
                                </div>

                                {/* File Types */}
                                <div className="flex items-center justify-center gap-3 pt-4">
                                    {['PDF', 'PNG', 'JPG'].map((type) => (
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
                                accept=".pdf,.png,.jpg,.jpeg"
                                onChange={handleFileSelect}
                            />
                        </div>

                        {/* Upload Progress */}
                        {uploading && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 space-y-3"
                            >
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                                        Uploading...
                                    </span>
                                    <span className="font-bold text-blue-600 dark:text-blue-400">
                                        {uploadProgress}%
                                    </span>
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

                        {/* Upload Error */}
                        {uploadError && (
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30"
                            >
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-red-900 dark:text-red-300">Upload Failed</p>
                                        <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">{uploadError}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Security Notice */}
                        <div className="mt-6 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-500/5 border border-blue-200/50 dark:border-blue-500/20">
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-blue-900 dark:text-blue-300">
                                        Secure Upload
                                    </p>
                                    <p className="text-xs text-blue-700 dark:text-blue-400">
                                        Files are stored securely and only visible to you
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Helper to convert data URI to Blob
const dataURItoBlob = (dataURI) => {
    try {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    } catch (e) {
        console.error("Error converting data URI to blob", e);
        return null;
    }
};

// Executive Grade Card Viewer - Clean & Professional
const ExecutiveGradeCardViewer = ({ isOpen, onClose, gradeCard, onDelete, onUpload }) => {
    const [zoom, setZoom] = React.useState(100);
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const [pdfUrl, setPdfUrl] = React.useState(null);

    // Set PDF/image URL for viewer
    React.useEffect(() => {
        if (isOpen && gradeCard?.file) {
            // Files are now served as HTTP URLs from backend — use directly
            setPdfUrl(gradeCard.file);
        } else {
            setPdfUrl(null);
        }
    }, [gradeCard, isOpen]);

    if (!isOpen || !gradeCard) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.98, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.98, opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className={`relative w-full ${isFullscreen ? 'max-w-full h-full' : 'max-w-6xl h-[85vh]'} bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Executive Header - Clean & Solid */}
                    <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    {gradeCard.semester}
                                </h3>
                                <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                                    <span>{gradeCard.year}</span>
                                    {gradeCard.uploadDate && (
                                        <>
                                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                                            <span>Uploaded {new Date(gradeCard.uploadDate).toLocaleDateString()}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Zoom Controls */}
                            <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mr-2">
                                <button
                                    onClick={() => setZoom(Math.max(50, zoom - 10))}
                                    className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                    title="Zoom Out"
                                >
                                    <ZoomOut className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                </button>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 min-w-[3rem] text-center">
                                    {zoom}%
                                </span>
                                <button
                                    onClick={() => setZoom(Math.min(200, zoom + 10))}
                                    className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                    title="Zoom In"
                                >
                                    <ZoomIn className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                </button>
                            </div>

                            {/* Delete Button */}
                            {gradeCard.file && onDelete && (
                                <button
                                    onClick={onDelete}
                                    className="p-2.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                                    title="Delete Document"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}

                            {/* Fullscreen & Close */}
                            <button
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                                title="Toggle Fullscreen"
                            >
                                <Maximize2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            </button>
                            <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 mx-1" />
                            <button
                                onClick={onClose}
                                className="p-2.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                                title="Close Viewer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Document View Area */}
                    <div className="flex-1 overflow-auto bg-slate-100 dark:bg-slate-950 p-8 flex items-start justify-center">
                        {gradeCard.file ? (
                            gradeCard.file.endsWith('.pdf') || gradeCard.fileType === 'application/pdf' ? (
                                /* PDF Viewer - Width-based scaling for sharpness */
                                <div
                                    className="relative bg-white shadow-xl transition-all duration-200"
                                    style={{
                                        width: zoom > 100 ? `${zoom}%` : `${zoom}%`,
                                        minWidth: '320px'
                                    }}
                                >
                                    <embed
                                        src={pdfUrl}
                                        type="application/pdf"
                                        className="w-full h-[1150px] bg-white border-none block"
                                    />
                                </div>
                            ) : (
                                /* Image Viewer - Transform-based scaling */
                                <div
                                    className="relative bg-white shadow-xl transition-transform duration-200 origin-top"
                                    style={{ transform: `scale(${zoom / 100})` }}
                                >
                                    <img
                                        src={gradeCard.file}
                                        alt={gradeCard.semester}
                                        className="max-w-[800px] h-auto object-contain block"
                                    />
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center p-12 mt-20">
                                <div className="p-6 rounded-full bg-slate-200 dark:bg-slate-800 mb-4">
                                    <FileText className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                                </div>
                                <h4 className="text-xl font-bold text-slate-700 dark:text-slate-300">
                                    No Document Found
                                </h4>
                                <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs mb-6">
                                    This document record hasn't been uploaded yet.
                                </p>
                                {onUpload && (
                                    <button
                                        onClick={onUpload}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md text-white"
                                    >
                                        <Upload className="w-4 h-4" />
                                        <span>Upload Document</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Academic Vault Modal - Professional Semester Vault View
const AcademicVaultModal = ({ isOpen, onClose, gradeCards, onViewCard, onUploadCard, onDeleteCard }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-2xl p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full max-w-7xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Vault Header */}
                    <div className="p-8 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                                    <Archive className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                        Semester Academic Records
                                    </h3>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                                        Secure Grade Card Vault • 8 Semesters
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all duration-300 border border-slate-300 dark:border-slate-700"
                            >
                                <X className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                            </button>
                        </div>
                    </div>

                    {/* Vault Content - Semester Grid */}
                    <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {gradeCards.map((card, idx) => (
                                <ExecutiveSemesterCard
                                    key={idx}
                                    gradeCard={card}
                                    onClick={() => onViewCard(card)}
                                    onUpload={() => onUploadCard({ card, index: idx })}
                                    onDelete={() => onDeleteCard({ card, index: idx })}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};


// Executive Delete Confirmation Modal
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, semesterName }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30">
                                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Grade Card</h3>
                            </div>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                            Are you sure you want to delete the grade card for <span className="font-semibold text-slate-900 dark:text-slate-200">{semesterName}</span>?
                            This action cannot be undone.
                        </p>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 shadow-sm shadow-red-500/20 transition-all duration-300"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Ultra-Premium Executive Semester Card
const ExecutiveSemesterCard = ({ gradeCard, onClick, onUpload, onDelete }) => {
    const hasFile = gradeCard.file !== null;
    const status = gradeCard.status || (hasFile ? 'uploaded' : 'pending');

    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-full"
        >
            <div className="h-full p-6 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_20px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_24px_48px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_24px_48px_rgba(0,0,0,0.4)] transition-all duration-500">

                <div className="flex flex-col h-full space-y-5">
                    {/* Top Section: Icon + Status */}
                    <div className="flex items-start justify-between">
                        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>

                        {/* Status Badge */}
                        {status === 'uploaded' ? (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30">
                                <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 dark:text-green-400">
                                    Uploaded
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <AlertCircle className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                    Pending
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Middle Section: Content */}
                    <div className="flex-1 space-y-2">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                            {gradeCard.semester}
                        </h4>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                            <Calendar className="w-4 h-4" />
                            <span>{gradeCard.year}</span>
                        </div>
                        {gradeCard.uploadDate && (
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-500">
                                Uploaded {new Date(gradeCard.uploadDate).toLocaleDateString()}
                            </p>
                        )}
                    </div>

                    {/* Bottom Section: Action Buttons */}
                    <div className="pt-2 space-y-3">
                        {hasFile ? (
                            <>
                                <button
                                    onClick={onClick}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold text-sm transition-all duration-300 shadow-[0_4px_6px_-1px_rgba(37,99,235,0.2)] hover:shadow-[0_10px_15px_-3px_rgba(37,99,235,0.3)]"
                                >
                                    <FileText className="w-4 h-4" />
                                    <span>View Academic Card</span>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete();
                                    }}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold text-xs transition-all duration-300 group"
                                >
                                    <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                    <span>Delete Grade Card</span>
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onUpload}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all duration-300 border border-slate-200 dark:border-slate-700"
                            >
                                <Upload className="w-4 h-4" />
                                <span>Upload Grade Card</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const InstitutionalPillar = ({ year, degree, institution, details, grade, type, icon: Icon, highlights, gradeCards: initialGradeCards, hasHSSVault, hasSSLCVault }) => {
    const [gradeCards, setGradeCards] = React.useState(initialGradeCards || []);
    const [consolidatedMarksheet, setConsolidatedMarksheet] = React.useState(null);
    const [graduationCertificate, setGraduationCertificate] = React.useState(null);
    const [hssMarksheet, setHssMarksheet] = React.useState(null);
    const [sslcMarksheet, setSslcMarksheet] = React.useState(null);
    const [loadingDocs, setLoadingDocs] = React.useState(true);

    const [selectedCard, setSelectedCard] = React.useState(null);
    const [uploadingCard, setUploadingCard] = React.useState(null);
    const [isVaultOpen, setIsVaultOpen] = React.useState(false);
    const [itemToDelete, setItemToDelete] = React.useState(null);

    // Fetch saved marksheets from IndexedDB and backend on mount
    React.useEffect(() => {
        const loadAllMarksheets = async () => {
            // 1. Instantly restore from permanent IndexedDB database
            try {
                const localDocs = await getAllVaultDocuments('marksheets');
                if (localDocs && Object.keys(localDocs).length > 0) {
                    if (localDocs.consolidated) setConsolidatedMarksheet(localDocs.consolidated);
                    if (localDocs.graduation) setGraduationCertificate(localDocs.graduation);
                    if (localDocs.hss) setHssMarksheet(localDocs.hss);
                    if (localDocs.sslc) setSslcMarksheet(localDocs.sslc);

                    if (initialGradeCards && initialGradeCards.length > 0) {
                        setGradeCards(prevCards => prevCards.map((card, idx) => {
                            const key = `semester_${idx}`;
                            if (localDocs[key]) {
                                return {
                                    ...card,
                                    file: localDocs[key].file,
                                    fileName: localDocs[key].fileName || localDocs[key].originalName,
                                    fileType: localDocs[key].fileType,
                                    uploadDate: localDocs[key].uploadDate,
                                    status: 'uploaded'
                                };
                            }
                            return card;
                        }));
                    }
                }
            } catch (idbErr) {
                console.warn('[Education] IndexedDB restore warning:', idbErr);
            }

            // 2. Sync with backend if BACKEND_URL is available
            if (BACKEND_URL) {
                try {
                    const res = await fetch(`${BACKEND_URL}/api/marksheets`);
                    if (res.ok) {
                        const data = await res.json();
                        if (data.success && data.marksheets) {
                            const saved = data.marksheets;

                            if (initialGradeCards && initialGradeCards.length > 0) {
                                setGradeCards(prev => prev.map((card, idx) => {
                                    const key = `semester_${idx}`;
                                    const savedCard = saved[key];
                                    if (savedCard) {
                                        return {
                                            ...card,
                                            file: `${BACKEND_URL}${savedCard.fileUrl}`,
                                            fileName: savedCard.originalName,
                                            fileType: savedCard.fileType,
                                            uploadDate: savedCard.uploadDate,
                                            status: 'uploaded'
                                        };
                                    }
                                    return card;
                                }));
                            }

                            if (saved.consolidated) {
                                setConsolidatedMarksheet({
                                    file: `${BACKEND_URL}${saved.consolidated.fileUrl}`,
                                    fileName: saved.consolidated.originalName,
                                    fileType: saved.consolidated.fileType,
                                    uploadDate: saved.consolidated.uploadDate
                                });
                            }
                            if (saved.graduation) {
                                setGraduationCertificate({
                                    file: `${BACKEND_URL}${saved.graduation.fileUrl}`,
                                    fileName: saved.graduation.originalName,
                                    fileType: saved.graduation.fileType,
                                    uploadDate: saved.graduation.uploadDate
                                });
                            }
                            if (saved.hss) {
                                setHssMarksheet({
                                    file: `${BACKEND_URL}${saved.hss.fileUrl}`,
                                    fileName: saved.hss.originalName,
                                    fileType: saved.hss.fileType,
                                    uploadDate: saved.hss.uploadDate
                                });
                            }
                            if (saved.sslc) {
                                setSslcMarksheet({
                                    file: `${BACKEND_URL}${saved.sslc.fileUrl}`,
                                    fileName: saved.sslc.originalName,
                                    fileType: saved.sslc.fileType,
                                    uploadDate: saved.sslc.uploadDate
                                });
                            }
                        }
                    }
                } catch (e) {
                    console.log('[Education] Operating in client-vault persistence mode');
                }
            }

            setLoadingDocs(false);
        };

        loadAllMarksheets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRequestDelete = (item) => {
        setItemToDelete(item);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;

        const deleteFromBackend = async (docType) => {
            // Delete from IndexedDB permanent store
            try {
                await deleteVaultDocument('marksheets', docType);
            } catch (idbErr) {
                console.warn('[Education] IndexedDB delete error:', idbErr);
            }

            // Delete from backend if available
            if (BACKEND_URL) {
                try {
                    await fetch(`${BACKEND_URL}/api/marksheets/${docType}`, { method: 'DELETE' });
                } catch (e) {
                    console.warn('[Education] Backend delete failed:', e);
                }
            }
        };

        if (itemToDelete.type === 'consolidated') {
            await deleteFromBackend('consolidated');
            setConsolidatedMarksheet(null);
            setItemToDelete(null);
            setSelectedCard(null);
            return;
        }
        if (itemToDelete.type === 'graduation') {
            await deleteFromBackend('graduation');
            setGraduationCertificate(null);
            setItemToDelete(null);
            setSelectedCard(null);
            return;
        }
        if (itemToDelete.type === 'hss') {
            await deleteFromBackend('hss');
            setHssMarksheet(null);
            setItemToDelete(null);
            setSelectedCard(null);
            return;
        }
        if (itemToDelete.type === 'sslc') {
            await deleteFromBackend('sslc');
            setSslcMarksheet(null);
            setItemToDelete(null);
            setSelectedCard(null);
            return;
        }

        // Semester card delete
        const semesterKey = `semester_${itemToDelete.index}`;
        await deleteFromBackend(semesterKey);

        const updatedCards = [...gradeCards];
        updatedCards[itemToDelete.index] = {
            ...updatedCards[itemToDelete.index],
            file: null,
            fileName: null,
            fileType: null,
            uploadDate: null,
            status: 'pending'
        };
        setGradeCards(updatedCards);
        setItemToDelete(null);
    };

    const handleUpload = (_semesterIndex, uploadedMarksheet) => {
        // uploadedMarksheet can be from backend or IndexedDB
        const fileUrl = uploadedMarksheet.fileUrl ? `${BACKEND_URL}${uploadedMarksheet.fileUrl}` : (uploadedMarksheet.file || '');
        const docMeta = {
            file: fileUrl,
            fileName: uploadedMarksheet.originalName || uploadedMarksheet.fileName,
            fileType: uploadedMarksheet.fileType,
            uploadDate: uploadedMarksheet.uploadDate
        };

        if (uploadingCard?.type === 'consolidated') {
            setConsolidatedMarksheet(docMeta);
            setUploadingCard(null);
            return;
        }
        if (uploadingCard?.type === 'graduation') {
            setGraduationCertificate(docMeta);
            setUploadingCard(null);
            return;
        }
        if (uploadingCard?.type === 'hss') {
            setHssMarksheet(docMeta);
            setUploadingCard(null);
            return;
        }
        if (uploadingCard?.type === 'sslc') {
            setSslcMarksheet(docMeta);
            setUploadingCard(null);
            return;
        }

        // Semester card
        const idx = uploadingCard?.index ?? _semesterIndex;
        if (idx !== undefined && idx !== null) {
            const updatedCards = [...gradeCards];
            updatedCards[idx] = {
                ...updatedCards[idx],
                file: fileUrl,
                fileName: uploadedMarksheet.originalName,
                fileType: uploadedMarksheet.fileType,
                uploadDate: uploadedMarksheet.uploadDate,
                status: 'uploaded'
            };
            setGradeCards(updatedCards);
        }
        setUploadingCard(null);
    };

    return (
        <>
            <motion.div
                whileHover={{ y: -10 }}
                className="relative flex flex-col h-full bg-card border border-primary/10 rounded-[2.5rem] p-10 lg:p-14 shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden group"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                <div className="relative z-10 space-y-6 flex flex-col">
                    <div className="flex justify-between items-start">
                        <div className="space-y-3">
                            <div className="px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary/50 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                                {type}
                            </div>
                            <p className="text-accent font-black tracking-[0.1em] text-sm uppercase">{year}</p>
                        </div>
                        <div className="p-4 rounded-3xl bg-primary/5 text-primary/30 group-hover:bg-accent group-hover:text-white transition-all duration-700 shadow-inner">
                            <Icon className="w-8 h-8" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-4xl font-black text-primary tracking-[-0.04em] leading-[0.9] group-hover:text-accent transition-colors duration-500">
                            {degree}
                        </h3>
                        <p className="text-lg font-bold text-primary/70 leading-tight">
                            {institution}
                        </p>
                    </div>

                    <div className="py-5 border-y border-primary/5 group-hover:border-accent/20 transition-colors">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 mb-2">My Grade</p>
                        <div className="flex items-baseline gap-2 group-hover:scale-105 origin-left transition-transform duration-700">
                            <span className="text-6xl font-black text-primary tracking-tighter">
                                {grade.value}
                            </span>
                            <span className="text-xl font-bold text-accent tracking-widest uppercase">
                                {grade.label}
                            </span>
                        </div>
                    </div>

                    <p className="text-[15px] font-medium text-primary/50 leading-relaxed">
                        {details}
                    </p>

                    {/* Academic Record Registry - Vaults (Middle Position) */}
                    {gradeCards && gradeCards.length > 0 && (
                        <div className="space-y-5 pt-6 border-t border-primary/5 group-hover:border-accent/20 transition-colors">
                            {/* Section Header */}
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                                    <Archive className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary/60">
                                    Academic Record Registry
                                </h4>
                            </div>

                            {/* Vault Cards Container */}
                            <div className="space-y-4">
                                {/* 1. Academic Grade Vault */}
                                <motion.button
                                    onClick={() => setIsVaultOpen(true)}
                                    whileHover={{ y: -4, scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="w-full relative group/vault p-6 rounded-[22px] bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-[0_15px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_25px_50px_rgba(37,99,235,0.12)] dark:hover:shadow-[0_25px_50px_rgba(37,99,235,0.25)] transition-all duration-500 overflow-hidden text-left"
                                >
                                    {/* Vault Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover/vault:opacity-100 transition-opacity duration-500" />

                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            {/* Vault Icon */}
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-lg opacity-0 group-hover/vault:opacity-100 transition-opacity duration-500" />
                                                <div className="relative p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 group-hover/vault:scale-105 transition-transform duration-500">
                                                    <FolderLock className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                                                </div>
                                            </div>

                                            {/* Text Content */}
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover/vault:text-blue-600 dark:group-hover/vault:text-blue-400 transition-colors">
                                                    Academic Grade Vault
                                                </h3>
                                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                                                    Secure Semester Record System • 8 Semesters
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Arrow */}
                                        <div className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 group-hover/vault:bg-blue-600 group-hover/vault:text-white transition-all duration-500">
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>

                                    {/* Status Indicator */}
                                    <div className="mt-5 flex items-center gap-3">
                                        <div className="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                                                style={{ width: `${(gradeCards.filter(c => c.file).length / gradeCards.length) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                            {gradeCards.filter(c => c.file).length}/{gradeCards.length} Uploaded
                                        </span>
                                    </div>
                                </motion.button>

                                {/* 2. Consolidated Marksheet Vault */}
                                <motion.button
                                    onClick={() => {
                                        setSelectedCard({
                                            semester: "Consolidated Marksheet Vault",
                                            year: "All Semesters • Consolidated Marks",
                                            file: consolidatedMarksheet?.file || null,
                                            fileType: consolidatedMarksheet?.fileType || null,
                                            uploadDate: consolidatedMarksheet?.uploadDate || null,
                                            type: 'consolidated'
                                        });
                                    }}
                                    whileHover={{ y: -4, scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="w-full relative group/vault p-6 rounded-[22px] bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-[0_15px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_25px_50px_rgba(37,99,235,0.12)] dark:hover:shadow-[0_25px_50px_rgba(37,99,235,0.25)] transition-all duration-500 overflow-hidden text-left"
                                >
                                    {/* Vault Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover/vault:opacity-100 transition-opacity duration-500" />

                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            {/* Vault Icon */}
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-lg opacity-0 group-hover/vault:opacity-100 transition-opacity duration-500" />
                                                <div className="relative p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 group-hover/vault:scale-105 transition-transform duration-500">
                                                    <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                                                </div>
                                            </div>

                                            {/* Text Content */}
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover/vault:text-blue-600 dark:group-hover/vault:text-blue-400 transition-colors">
                                                    Consolidated Marksheet Vault
                                                </h3>
                                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                                                    Complete Academic Performance Record
                                                </p>
                                                <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                                                    All Semesters • Consolidated Marks
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Arrow */}
                                        <div className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 group-hover/vault:bg-blue-600 group-hover/vault:text-white transition-all duration-500">
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>

                                    {/* Status Indicator */}
                                    <div className="mt-5 flex items-center gap-3">
                                        <div className="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                                                style={{ width: consolidatedMarksheet?.file ? '100%' : '0%' }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                            {consolidatedMarksheet?.file ? 'Verified Academic Record' : 'Document Not Uploaded'}
                                        </span>
                                    </div>
                                </motion.button>

                                {/* 3. Graduation Certificate Vault */}
                                <motion.button
                                    onClick={() => {
                                        setSelectedCard({
                                            semester: "Graduation Certificate Vault",
                                            year: "B.Tech • Information Technology",
                                            file: graduationCertificate?.file || null,
                                            fileType: graduationCertificate?.fileType || null,
                                            uploadDate: graduationCertificate?.uploadDate || null,
                                            type: 'graduation'
                                        });
                                    }}
                                    whileHover={{ y: -4, scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="w-full relative group/vault p-6 rounded-[22px] bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-[0_15px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_25px_50px_rgba(37,99,235,0.12)] dark:hover:shadow-[0_25px_50px_rgba(37,99,235,0.25)] transition-all duration-500 overflow-hidden text-left"
                                >
                                    {/* Vault Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover/vault:opacity-100 transition-opacity duration-500" />

                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            {/* Vault Icon */}
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-lg opacity-0 group-hover/vault:opacity-100 transition-opacity duration-500" />
                                                <div className="relative p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 group-hover/vault:scale-105 transition-transform duration-500">
                                                    <GraduationCap className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                                                </div>
                                            </div>

                                            {/* Text Content */}
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover/vault:text-blue-600 dark:group-hover/vault:text-blue-400 transition-colors">
                                                    Graduation Certificate Vault
                                                </h3>
                                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                                                    Official Degree Certification
                                                </p>
                                                <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                                                    B.Tech • Information Technology
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Arrow */}
                                        <div className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 group-hover/vault:bg-blue-600 group-hover/vault:text-white transition-all duration-500">
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>

                                    {/* Status Indicator */}
                                    <div className="mt-5 flex items-center gap-3">
                                        <div className="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                                                style={{ width: graduationCertificate?.file ? '100%' : '0%' }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                            {graduationCertificate?.file ? 'Official Graduation Record' : 'Document Not Uploaded'}
                                        </span>
                                    </div>
                                </motion.button>
                            </div>
                        </div>
                    )}

                    {/* HSS Marksheet Vault for Higher Secondary Education */}
                    {hasHSSVault && (
                        <div className="space-y-5 pt-6 border-t border-primary/5 group-hover:border-accent/20 transition-colors">
                            {/* Section Header */}
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                                    <Archive className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary/60">
                                    Academic Record Registry
                                </h4>
                            </div>

                            {/* HSS Marksheet Vault Card */}
                            <motion.button
                                onClick={() => {
                                    setSelectedCard({
                                        semester: "HSS Marksheet Vault",
                                        year: "Higher Secondary Marksheet",
                                        file: hssMarksheet?.file || null,
                                        fileType: hssMarksheet?.fileType || null,
                                        uploadDate: hssMarksheet?.uploadDate || null,
                                        type: 'hss'
                                    });
                                }}
                                whileHover={{ y: -4, scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full relative group/vault p-6 rounded-[22px] bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-[0_15px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_25px_50px_rgba(37,99,235,0.12)] dark:hover:shadow-[0_25px_50px_rgba(37,99,235,0.25)] transition-all duration-500 overflow-hidden text-left"
                            >
                                {/* Vault Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover/vault:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 flex items-center justify-between">
                                    <div className="flex items-center gap-5">
                                        {/* Vault Icon */}
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-lg opacity-0 group-hover/vault:opacity-100 transition-opacity duration-500" />
                                            <div className="relative p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 group-hover/vault:scale-105 transition-transform duration-500">
                                                <Award className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                                            </div>
                                        </div>

                                        {/* Text Content */}
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover/vault:text-blue-600 dark:group-hover/vault:text-blue-400 transition-colors">
                                                HSS Marksheet Vault
                                            </h3>
                                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                                                Secure Academic Record
                                            </p>
                                            <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                                                Higher Secondary Marksheet
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Arrow */}
                                    <div className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 group-hover/vault:bg-blue-600 group-hover/vault:text-white transition-all duration-500">
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>

                                {/* Status Indicator */}
                                <div className="mt-5 flex items-center gap-3">
                                    <div className="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                                            style={{ width: hssMarksheet?.file ? '100%' : '0%' }}
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                        {hssMarksheet?.file ? 'Verified Academic Record' : 'Document Not Uploaded'}
                                    </span>
                                </div>
                            </motion.button>
                        </div>
                    )}

                    {/* SSLC Marksheet Vault for SSLC 10th Standard */}
                    {hasSSLCVault && (
                        <div className="space-y-5 pt-6 border-t border-primary/5 group-hover:border-accent/20 transition-colors">
                            {/* Section Header */}
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                                    <Archive className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary/60">
                                    Academic Record Registry
                                </h4>
                            </div>

                            {/* SSLC Marksheet Vault Button */}
                            <motion.button
                                onClick={() => {
                                    setSelectedCard({
                                        semester: "SSLC Marksheet Vault",
                                        year: "SSLC 10th Standard Marksheet",
                                        file: sslcMarksheet?.file || null,
                                        fileType: sslcMarksheet?.fileType || null,
                                        uploadDate: sslcMarksheet?.uploadDate || null,
                                        type: 'sslc'
                                    });
                                }}
                                whileHover={{ y: -4, scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full relative group/vault p-6 rounded-[22px] bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-[0_15px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_25px_50px_rgba(37,99,235,0.12)] dark:hover:shadow-[0_25px_50px_rgba(37,99,235,0.25)] transition-all duration-500 overflow-hidden text-left"
                            >
                                {/* Vault Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover/vault:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 flex items-center justify-between">
                                    <div className="flex items-center gap-5">
                                        {/* Vault Icon */}
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-lg opacity-0 group-hover/vault:opacity-100 transition-opacity duration-500" />
                                            <div className="relative p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 group-hover/vault:scale-105 transition-transform duration-500">
                                                <BookMarked className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                                            </div>
                                        </div>

                                        {/* Text Content */}
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover/vault:text-blue-600 dark:group-hover/vault:text-blue-400 transition-colors">
                                                SSLC Marksheet Vault
                                            </h3>
                                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                                                Secure Academic Record
                                            </p>
                                            <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                                                SSLC 10th Standard Marksheet
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Arrow */}
                                    <div className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 group-hover/vault:bg-blue-600 group-hover/vault:text-white transition-all duration-500">
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>

                                {/* Status Indicator */}
                                <div className="mt-5 flex items-center gap-3">
                                    <div className="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                                            style={{ width: sslcMarksheet?.file ? '100%' : '0%' }}
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                        {sslcMarksheet?.file ? 'Verified Academic Record' : 'Document Not Uploaded'}
                                    </span>
                                </div>
                            </motion.button>
                        </div>
                    )}

                    {/* Key Focus Section */}
                    <div className="space-y-4 pt-6 border-t border-primary/5 group-hover:border-accent/20 transition-colors">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/30">Key Focus</p>
                        <div className="flex flex-wrap gap-3">
                            {highlights.map((h, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/5 text-xs font-bold text-primary/60 border border-transparent group-hover:border-accent/20 group-hover:text-primary transition-all duration-500"
                                >
                                    <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                                    {h}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="absolute inset-x-0 h-[2px] bg-accent/20 shadow-[0_0_15px_rgba(37,99,235,0.4)] pointer-events-none opacity-0 group-hover:opacity-100 group-hover:animate-[scan_3s_linear_infinite]" />
            </motion.div>

            {/* Modals */}
            {isVaultOpen && (
                <AcademicVaultModal
                    isOpen={isVaultOpen}
                    onClose={() => setIsVaultOpen(false)}
                    gradeCards={gradeCards}
                    onViewCard={(card) => {
                        setSelectedCard(card);
                    }}
                    onUploadCard={(data) => {
                        setUploadingCard(data);
                    }}
                    onDeleteCard={handleRequestDelete}
                />
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={handleConfirmDelete}
                semesterName={itemToDelete?.card?.semester || (itemToDelete?.type === 'consolidated' ? 'Consolidated Marksheet Vault' : itemToDelete?.type === 'graduation' ? 'Graduation Certificate Vault' : itemToDelete?.type === 'hss' ? 'HSS Marksheet Vault' : 'SSLC Marksheet Vault')}
            />

            {selectedCard && (
                <ExecutiveGradeCardViewer
                    isOpen={!!selectedCard}
                    onClose={() => setSelectedCard(null)}
                    gradeCard={selectedCard}
                    onDelete={selectedCard.type ? () => {
                        handleRequestDelete({
                            type: selectedCard.type,
                            card: selectedCard
                        });
                    } : undefined}
                    onUpload={selectedCard.type && !selectedCard.file ? () => {
                        const type = selectedCard.type;
                        setSelectedCard(null);
                        setUploadingCard({
                            card: { semester: selectedCard.semester },
                            type: type
                        });
                    } : undefined}
                />
            )}

            {uploadingCard && (
                <UploadModal
                    isOpen={!!uploadingCard}
                    onClose={() => setUploadingCard(null)}
                    semester={uploadingCard.card.semester}
                    docType={
                        uploadingCard.type
                            ? uploadingCard.type  // 'hss' | 'sslc' | 'consolidated' | 'graduation'
                            : `semester_${uploadingCard.index}`  // 'semester_0' .. 'semester_7'
                    }
                    onUpload={(data) => handleUpload(uploadingCard.index, data)}
                />
            )}
        </>
    );
};

const Education = () => {
    const educationTimeline = [
        {
            year: "2022 - 2026",
            degree: "B.Tech in Information Technology",
            institution: "Kalasalingam Academy",
            details: "Focusing on data analytics, cloud solutions architecture, and enterprise software patterns. Actively engaged in high-scale technical research.",
            grade: { value: "7.30", label: "CGPA" },
            type: "University",
            icon: GraduationCap,
            highlights: ["Data Structures", "Cloud Architecture", "Programming"],
            gradeCards: [
                { semester: "Semester 1", year: "2022-2023", file: null, status: "pending" },
                { semester: "Semester 2", year: "2022-2023", file: null, status: "pending" },
                { semester: "Semester 3", year: "2023-2024", file: null, status: "pending" },
                { semester: "Semester 4", year: "2023-2024", file: null, status: "pending" },
                { semester: "Semester 5", year: "2024-2025", file: null, status: "pending" },
                { semester: "Semester 6", year: "2024-2025", file: null, status: "pending" },
                { semester: "Semester 7", year: "2025-2026", file: null, status: "pending" },
                { semester: "Semester 8", year: "2025-2026", file: null, status: "pending" }
            ]
        },
        {
            year: "2021 - 2022",
            degree: "Higher Secondary Education",
            institution: "Saliyar Mahajana Higher Secondary school",
            details: "Academic concentration in Mathematics and Science, establishing the analytical foundation for engineering systems.",
            grade: { value: "65", label: "%" },
            type: "High School",
            icon: Award,
            highlights: ["Mathematics", "Physics", "Chemistry", "Bio-Botany", "Bio-Zoology", "Tamil", "English"],
            hasHSSVault: true
        },
        {
            year: "2019 - 2020",
            degree: "SSLC 10th Standard",
            institution: "SBK Boys Higher Secondary School",
            details: "Commenced early technical education with a focus on logical reasoning and scientific inquiry.",
            grade: { value: "68", label: "%" },
            type: "Secondary",
            icon: BookMarked,
            highlights: ["Science", "Math", "Tamil", "English", "Maths", "Social Science"],
            hasSSLCVault: true
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 50 },
        show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
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
                    transition={{ duration: 1 }}
                    className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-primary/5 border border-primary/10 text-primary/40 font-black text-[10px] uppercase tracking-[0.4em]"
                >
                    <Library className="w-4 h-4 text-accent" />
                    Academic Portfolio
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2 }}
                    className="text-5xl lg:text-6xl font-black tracking-[-0.04em] text-primary leading-[1.1] text-balance"
                >
                    My <span className="text-accent italic">Education</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="text-lg lg:text-xl text-primary/40 max-w-2xl mx-auto font-medium leading-relaxed tracking-tight"
                >
                    A comprehensive registry of academic milestones and the technical foundations of my engineering journey.
                </motion.p>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-12"
            >
                {educationTimeline.map((edu, idx) => (
                    <motion.div key={idx} variants={item}>
                        <InstitutionalPillar {...edu} />
                    </motion.div>
                ))}
            </motion.div>

            {/* Cinematic CTA */}
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="mt-64 relative group"
            >
                <div className="absolute inset-x-0 -bottom-20 h-80 bg-accent/10 rounded-full blur-[180px] group-hover:bg-accent/20 transition-all duration-1000 -z-10" />

                <div className="relative bg-primary rounded-[4rem] p-16 lg:p-32 flex flex-col lg:flex-row items-center justify-between gap-16 overflow-hidden shadow-[0_80px_160px_-40px_rgba(0,0,0,0.6)]">
                    <div className="space-y-10 text-center lg:text-left text-background relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-4 text-accent font-black text-[10px] uppercase tracking-[0.4em]">
                            <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
                            Engagement Status: Active
                        </div>
                        <h3 className="text-4xl lg:text-6xl font-black tracking-tighter leading-none text-background">
                            Let's Build <span className="text-accent italic">Together</span>
                        </h3>
                        <p className="text-background/40 text-xl font-medium leading-relaxed tracking-tight">
                            Strategic systems require structural integrity. Let's engage in a comprehensive technical dialogue regarding your next project.
                        </p>
                    </div>

                    <Link
                        to="/contact"
                        className="relative z-10 px-16 py-8 rounded-[2rem] bg-white text-primary font-black uppercase tracking-[0.4em] text-[10px] hover:bg-accent hover:text-white transition-all shadow-2xl active:scale-95 group/btn flex items-center gap-6"
                    >
                        Contact Me
                        <ChevronRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-3" />
                    </Link>

                    {/* Background Ornaments */}
                    <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] border-[60px] border-white/[0.02] rounded-full" />
                    <div className="absolute -top-20 -left-20 p-12 text-white/[0.01]">
                        <Globe className="w-96 h-96" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Education;
