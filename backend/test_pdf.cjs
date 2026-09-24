const { PDFParse } = require('pdf-parse');
(async () => {
    try {
        const parser = new PDFParse({ data: Buffer.from('%PDF-1.4\n1 0 obj\n<< /Length 2 >>\nstream\nhi\nendstream\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF') });
        const result = await parser.getText();
        console.log('Result type:', typeof result);
        console.log('Result keys:', Object.keys(result));
    } catch (e) {
        console.log('Error during getText:', e.message);
    }
})();
