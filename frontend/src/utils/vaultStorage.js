// High-Performance IndexedDB Storage Engine for Academic & Certificate Vaults
// Provides permanent browser persistence for PDF and image documents across sessions, reloads, and offline modes

const DB_NAME = 'MHCV_Portfolio_Vault';
const DB_VERSION = 1;

let dbInstance = null;

export const openVaultDB = () => {
    if (dbInstance) return Promise.resolve(dbInstance);

    return new Promise((resolve) => {
        if (typeof window === 'undefined' || !window.indexedDB) {
            resolve(null);
            return;
        }

        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('certificates')) {
                db.createObjectStore('certificates', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('marksheets')) {
                db.createObjectStore('marksheets', { keyPath: 'id' });
            }
        };

        request.onsuccess = () => {
            dbInstance = request.result;
            resolve(dbInstance);
        };

        request.onerror = (e) => {
            console.error('[VaultStorage] IndexedDB open error:', e);
            resolve(null);
        };
    });
};

/**
 * Save a document (File/Blob + metadata) into the vault store
 */
export const saveVaultDocument = async (storeName, id, fileBlob, meta = {}) => {
    try {
        const db = await openVaultDB();
        if (!db) return null;

        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);

            const record = {
                id,
                fileBlob,
                fileName: meta.fileName || meta.originalName || fileBlob?.name || `${id}_document`,
                fileType: meta.fileType || fileBlob?.type || 'application/pdf',
                uploadDate: meta.uploadDate || new Date().toISOString(),
                fileSize: fileBlob?.size || meta.fileSize || 0,
                ...meta
            };

            const req = store.put(record);
            req.onsuccess = () => resolve(record);
            req.onerror = () => reject(req.error);
        });
    } catch (err) {
        console.error(`[VaultStorage] Error saving to ${storeName}:`, err);
        return null;
    }
};

/**
 * Retrieve a single document by ID from the vault store
 */
export const getVaultDocument = async (storeName, id) => {
    try {
        const db = await openVaultDB();
        if (!db) return null;

        return new Promise((resolve) => {
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const req = store.get(id);

            req.onsuccess = () => {
                const item = req.result;
                if (!item) {
                    resolve(null);
                    return;
                }
                let fileUrl = item.fileUrl;
                if (!fileUrl && item.fileBlob) {
                    try {
                        fileUrl = URL.createObjectURL(item.fileBlob);
                    } catch (e) {
                        console.error('[VaultStorage] Blob URL creation failed:', e);
                    }
                }
                resolve({
                    ...item,
                    file: fileUrl || item.file
                });
            };
            req.onerror = () => resolve(null);
        });
    } catch (err) {
        console.error(`[VaultStorage] Error getting document ${id} from ${storeName}:`, err);
        return null;
    }
};

/**
 * Retrieve all documents from a vault store as an ID -> document map
 */
export const getAllVaultDocuments = async (storeName) => {
    try {
        const db = await openVaultDB();
        if (!db) return {};

        return new Promise((resolve) => {
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const req = store.getAll();

            req.onsuccess = () => {
                const items = req.result || [];
                const map = {};
                items.forEach((item) => {
                    let fileUrl = item.fileUrl;
                    if (!fileUrl && item.fileBlob) {
                        try {
                            fileUrl = URL.createObjectURL(item.fileBlob);
                        } catch (e) {
                            console.error('[VaultStorage] Blob URL creation failed:', e);
                        }
                    }
                    map[item.id] = {
                        ...item,
                        file: fileUrl || item.file
                    };
                });
                resolve(map);
            };
            req.onerror = () => resolve({});
        });
    } catch (err) {
        console.error(`[VaultStorage] Error getting all documents from ${storeName}:`, err);
        return {};
    }
};

/**
 * Delete a document from the vault store
 */
export const deleteVaultDocument = async (storeName, id) => {
    try {
        const db = await openVaultDB();
        if (!db) return false;

        return new Promise((resolve) => {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const req = store.delete(id);
            req.onsuccess = () => resolve(true);
            req.onerror = () => resolve(false);
        });
    } catch (err) {
        console.error(`[VaultStorage] Error deleting document ${id} from ${storeName}:`, err);
        return false;
    }
};
