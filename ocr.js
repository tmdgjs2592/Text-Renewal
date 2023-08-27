const tesseract = require('node-tesseract-ocr');

async function performOCR(imageBuffer) {
    const config = {
        lang: 'eng', // Specify the language
    };

    try {
        const extractedText = await tesseract.recognize(imageBuffer, config);
        return extractedText;
    } catch (error) {
        console.error('OCR Error:', error);
        throw error;
    }
}

module.exports = performOCR;
