// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');
const PDFLetterGenerator = require('./generate-pdf');

const app = express();
const PORT = process.env.PORT || 3000;

// Password protection - Set this in .env file or Railway environment variables
const ACCESS_PASSWORD = process.env.ACCESS_PASSWORD;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Password check middleware
const checkPassword = (req, res, next) => {
  const providedPassword = req.headers['x-access-password'] || req.body.password;

  if (providedPassword === ACCESS_PASSWORD) {
    next();
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
};

// Serve the HTML form (no auth needed to see form)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to verify password
app.post('/api/verify-password', (req, res) => {
  const { password } = req.body;

  if (password === ACCESS_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// API endpoint to generate PDF (password protected)
app.post('/api/generate-pdf', checkPassword, async (req, res) => {
  try {
    const {
      patientName,
      patientDOB,
      date,
      language,
      body,
      senderName,
      senderTitle
    } = req.body;

    // Validate required fields
    if (!patientName || !date || !body) {
      return res.status(400).json({
        error: 'Missing required fields: patientName, date, and body are required'
      });
    }

    // Prepare letter data
    const letterData = {
      logoPath: path.join(__dirname, 'alai_logo.png'),
      signatureImagePath: path.join(__dirname, 'ma_sign.png'),
      date,
      language: language || 'en',
      patientName,
      patientDOB: patientDOB || '',
      body,
      bodyFormat: 'html', // Rich text editor outputs HTML
      senderName: senderName || 'Dr. MIKEL ARAMBERRI, M.D., Ph.D.',
      senderTitle: senderTitle || 'Orthopedic Surgeon and Sports Medicine'
    };

    // Generate PDF
    const generator = new PDFLetterGenerator();
    const filename = generator.generateFilename(letterData);
    const outputPath = path.join(__dirname, 'temp', filename);

    // Create temp directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, 'temp'))) {
      fs.mkdirSync(path.join(__dirname, 'temp'));
    }

    await generator.generate(letterData, outputPath);

    // Send PDF file
    res.download(outputPath, filename, (err) => {
      // Clean up temp file after sending
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }

      if (err) {
        console.error('Error sending file:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Error generating PDF' });
        }
      }
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({
      error: 'Failed to generate PDF',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Open your browser and visit: http://localhost:${PORT}`);
});
