const express = require('express');
const multer = require('multer');
const performOCR = require('./ocr');
const path = require('path');

const app = express();
const upload = multer();

// Parse URL-encoded data from forms
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve login-styles.css and login.js files
app.use('/login-styles.css', express.static(path.join(__dirname, 'login-styles.css')));
app.use('/login.js', express.static(path.join(__dirname, 'login.js')));

// Route for the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Handle login form submission
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Perform authentication here (e.g., check username and password)
    // For simplicity, let's assume the credentials are correct
    if (username === 'roger' && password === 'roger') {
        // Redirect to the OCR page
        res.redirect('/ocr');
    } else {
        // Handle incorrect credentials
        res.redirect('/login');
    }
});

// Route for the OCR page
app.get('/ocr', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to perform OCR (similar to your previous implementation)
app.post('/perform-ocr', upload.single('image'), async (req, res) => {
    try {
        const extractedText = await performOCR(req.file.buffer);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(extractedText);
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('An error occurred');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
