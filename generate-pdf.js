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

        // Process the body content
        const processedData = {
            ...letterData,
            body: this.processBody(
                letterData.body,
                letterData.bodyFormat || options.bodyFormat || 'plain'
            )
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
     * Generate PDF from a JSON file
     * @param {string} jsonPath - Path to JSON file with letter data
     * @param {string} outputPath - Where to save the PDF
     * @param {Object} options - Additional options
     */
    async generateFromFile(jsonPath, outputPath = './output.pdf', options = {}) {
        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        await this.generate(data, outputPath, options);
    }
}

// CLI usage
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('Usage: node generate-pdf.js <input.json> [output.pdf]');
        console.log('Example: node generate-pdf.js letter-data.json output.pdf');
        process.exit(1);
    }

    const inputFile = args[0];
    const outputFile = args[1] || 'output.pdf';

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
