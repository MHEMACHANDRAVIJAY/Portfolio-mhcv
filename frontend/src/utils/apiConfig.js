// Centralized API configuration for production and development
export const getBackendUrl = () => {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        if (import.meta.env.VITE_API_URL) {
            return import.meta.env.VITE_API_URL.replace(/\/+$/, '');
        }
        if (import.meta.env.VITE_BACKEND_URL) {
            return import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, '');
        }
        if (import.meta.env.PROD) {
            // In production, default to empty string if co-hosted, or fallback to current origin
            return '';
        }
    }
    return 'http://localhost:5000';
};

export const BACKEND_URL = getBackendUrl();
