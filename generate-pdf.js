const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const Handlebars = require('handlebars');
const { marked } = require('marked');

/**
 * PDF Letter Generator
 * Generates a professional one-page letter PDF from a template
 */
class PDFLetterGenerator {
  constructor(templatePath = './template.html') {
    this.templatePath = templatePath;
    this.template = null;
  }

  /**
   * Load and compile the Handlebars template
   */
  loadTemplate() {
    const templateContent = fs.readFileSync(this.templatePath, 'utf-8');
    this.template = Handlebars.compile(templateContent);
  }

  /**
   * Convert image file to base64 data URL
   * @param {string} imagePath - Path to image file
   * @returns {string} Base64 data URL or empty string if file doesn't exist
   */
  imageToBase64(imagePath) {
    if (!imagePath) return '';

    // Remove file:// prefix if present
    let cleanPath = imagePath.replace(/^file:\/\//, '');

    // Check if file exists
    if (!fs.existsSync(cleanPath)) {
      console.warn(`Warning: Image not found: ${cleanPath}`);
      return '';
    }

    // Read file and convert to base64
    const imageBuffer = fs.readFileSync(cleanPath);
    const mimeType = this.getMimeType(cleanPath);
    const base64 = imageBuffer.toString('base64');

    return `data:${mimeType};base64,${base64}`;
  }

  /**
   * Get MIME type based on file extension
   * @param {string} filePath - Path to file
   * @returns {string} MIME type
   */
  getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp'
    };
    return mimeTypes[ext] || 'image/png';
  }

  /**
   * Process body text based on format (markdown, html, or plain text)
   * @param {string} body - The body content
   * @param {string} format - The format type ('markdown', 'html', or 'plain')
   * @returns {string} Processed HTML content
   */
  processBody(body, format = 'plain') {
    switch (format.toLowerCase()) {
      case 'markdown':
        return marked(body);
      case 'html':
        return body;
      case 'plain':
      default:
        // Convert plain text to paragraphs
        return body
          .split('\n\n')
          .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
          .join('\n');
    }
  }

  /**
   * Get localized labels based on language
   * @param {string} language - Language code ('en' or 'es')
   * @returns {Object} Localized labels
   */
  getLabels(language = 'en') {
    const labels = {
      en: {
        patientNameLabel: 'First and Last Name',
        patientDOBLabel: 'Date of Birth'
      },
      es: {
        patientNameLabel: 'Nombre y Apellidos',
        patientDOBLabel: 'Fecha de Nacimiento'
      }
    };
    return labels[language] || labels.en;
  }

  /**
   * Generate PDF from letter data
   * @param {Object} letterData - The letter content and metadata
   * @param {string} outputPath - Where to save the PDF
   * @param {Object} options - Additional options
   */
  async generate(letterData, outputPath = './output.pdf', options = {}) {
    // Load template if not already loaded
    if (!this.template) {
      this.loadTemplate();
    }

    // Get language and labels
    const language = letterData.language || options.language || 'en';
    const labels = this.getLabels(language);

    // Process the body content and convert images to base64
    const processedData = {
      ...letterData,
      ...labels,
      body: this.processBody(
        letterData.body,
        letterData.bodyFormat || options.bodyFormat || 'plain'
      ),
      logoPath: this.imageToBase64(letterData.logoPath),
      signatureImagePath: this.imageToBase64(letterData.signatureImagePath)
    };

    // Generate HTML from template
    const html = this.template(processedData);

    // Launch Puppeteer and generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, {
        waitUntil: 'networkidle0'
      });

      // Generate PDF with options
      await page.pdf({
        path: outputPath,
        format: 'letter',
        printBackground: true,
        margin: {
          top: '0.75in',
          right: '1in',
          bottom: '0.75in',
          left: '1in'
        },
        ...options.pdfOptions
      });

      console.log(`PDF generated successfully: ${outputPath}`);
    } finally {
      await browser.close();
    }
  }

  /**
   * Generate automatic filename from patient data
   * @param {Object} data - Letter data with patientName and date
   * @returns {string} Generated filename
   */
  generateFilename(data) {
    if (!data.patientName || !data.date) {
      return 'output.pdf';
    }

    // Determine language prefix (INFORME for Spanish, REPORT for English)
    const language = data.language || 'en';
    const prefix = language === 'es' ? 'INFORME' : 'REPORT';

    // Convert patient name to uppercase and replace spaces with underscores
    const namePart = data.patientName.toUpperCase().replace(/\s+/g, '_');

    // Convert date slashes to periods
    const datePart = data.date.replace(/\//g, '.');

    return `${prefix}_${namePart}_${datePart}.pdf`;
  }

  /**
   * Generate PDF from a JSON file
   * @param {string} jsonPath - Path to JSON file with letter data
   * @param {string} outputPath - Where to save the PDF (optional, auto-generated if not provided)
   * @param {Object} options - Additional options
   */
  async generateFromFile(jsonPath, outputPath = null, options = {}) {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    // Auto-generate filename if not provided
    if (!outputPath) {
      outputPath = this.generateFilename(data);
    }

    await this.generate(data, outputPath, options);
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node generate-pdf.js <input.json> [output.pdf]');
    console.log('Example: node generate-pdf.js letter-data.json');
    console.log('         node generate-pdf.js letter-data.json custom-output.pdf');
    console.log('');
    console.log('If output filename is not specified, it will be auto-generated from patient name and date.');
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = args[1] || null; // null means auto-generate

  const generator = new PDFLetterGenerator();
  generator.generateFromFile(inputFile, outputFile)
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch(err => {
      console.error('Error generating PDF:', err);
      process.exit(1);
    });
}

module.exports = PDFLetterGenerator;
