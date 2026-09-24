const MARKSHEETS_DATA = {
    "SEM_01": {
        "docType": "SEM_01",
        "fileName": "SEM_01_MARKSHEET.pdf",
        "fileType": "application/pdf",
        "fileUrl": "/grades/SEM_01_MARKSHEET.pdf"
    },
    "SEM_02": {
        "docType": "SEM_02",
        "fileName": "SEM_02_MARKSHEET.pdf",
        "fileType": "application/pdf",
        "fileUrl": "/grades/SEM_02_MARKSHEET.pdf"
    },
    "SEM_03": {
        "docType": "SEM_03",
        "fileName": "SEM_03_MARKSHEET.pdf",
        "fileType": "application/pdf",
        "fileUrl": "/grades/SEM_03_MARKSHEET.pdf"
    },
    "SEM_04": {
        "docType": "SEM_04",
        "fileName": "SEM_04_MARKSHEET.pdf",
        "fileType": "application/pdf",
        "fileUrl": "/grades/SEM_04_MARKSHEET.pdf"
    }
};

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        return res.status(200).json(MARKSHEETS_DATA);
    }

    if (req.method === 'POST') {
        return res.status(200).json({ message: 'Marksheet acknowledged' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
