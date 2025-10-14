# PDF Letter Generator

A professional PDF letter generator built with Node.js, Puppeteer, and Handlebars. Generate beautifully formatted one-page letters from JSON data with support for Markdown, HTML, and plain text formatting.

## Features

- **Professional Templates**: Clean, customizable HTML/CSS letter template
- **Rich Text Support**: Accept Markdown, HTML, or plain text for body content
- **Flexible Data Input**: Use JSON files or programmatic API
- **High-Quality Output**: Puppeteer ensures consistent, print-ready PDFs
- **Easy Customization**: Simple Handlebars template syntax

## Installation

```bash
npm install
```

This will install the required dependencies:
- `puppeteer` - For PDF generation
- `handlebars` - For template rendering
- `marked` - For Markdown processing

## Usage

### Command Line

Generate a PDF from a JSON file:

```bash
node generate-pdf.js example-letter.json output.pdf
```

### Programmatic API

```javascript
const PDFLetterGenerator = require('./generate-pdf');

const generator = new PDFLetterGenerator('./template.html');

const letterData = {
    companyName: "Your Company",
    companyAddress: "123 Main St",
    // ... other fields
    body: "Letter body content here",
    bodyFormat: "markdown", // or "html" or "plain"
};

await generator.generate(letterData, './output.pdf');
```

## Letter Data Format

Your JSON file should include the following fields:

### Company/Sender Information
- `companyName` - Your company name
- `companyAddress` - Street address
- `companyCity` - City
- `companyState` - State
- `companyZip` - ZIP code
- `companyPhone` - Phone number
- `companyEmail` - Email address

### Letter Details
- `date` - Letter date (e.g., "October 14, 2025")

### Recipient Information
- `recipientName` - Recipient's name
- `recipientTitle` - Recipient's job title
- `recipientCompany` - Recipient's company
- `recipientAddress` - Street address
- `recipientCity` - City
- `recipientState` - State
- `recipientZip` - ZIP code

### Letter Content
- `salutation` - Greeting (e.g., "Dear Ms. Smith,")
- `body` - Main letter content
- `bodyFormat` - Format type: `"markdown"`, `"html"`, or `"plain"` (default: "plain")
- `closing` - Closing phrase (e.g., "Sincerely,")
- `senderName` - Your name
- `senderTitle` - Your job title
- `footerText` - Optional footer text

## Body Format Options

### Markdown (recommended)
```json
{
  "body": "This is **bold** and this is *italic*.\n\nNew paragraph with a list:\n\n- Item 1\n- Item 2",
  "bodyFormat": "markdown"
}
```

### HTML
```json
{
  "body": "<p>This is <strong>bold</strong> and <em>italic</em>.</p><ul><li>Item 1</li></ul>",
  "bodyFormat": "html"
}
```

### Plain Text
```json
{
  "body": "Simple paragraph.\n\nAnother paragraph.",
  "bodyFormat": "plain"
}
```

## Customization

### Modifying the Template

Edit [template.html](template.html) to customize:
- **Styles**: Modify the `<style>` section for fonts, colors, spacing
- **Layout**: Adjust HTML structure for different letter formats
- **Fields**: Add or remove Handlebars variables as needed

### PDF Options

Pass custom PDF options when generating:

```javascript
await generator.generate(letterData, './output.pdf', {
    pdfOptions: {
        format: 'A4', // Change paper size
        landscape: false,
        // Other Puppeteer PDF options
    }
});
```

## Examples

See [example-letter.json](example-letter.json) for a complete example with Markdown formatting.

Run the example:
```bash
node generate-pdf.js example-letter.json example-output.pdf
```

## Technical Details

**Tech Stack:**
- **Node.js** - Runtime environment
- **Puppeteer** - PDF generation via headless Chromium
- **Handlebars** - Template engine for dynamic content
- **Marked.js** - Markdown to HTML conversion

**PDF Specifications:**
- Page size: Letter (8.5" × 11")
- Margins: 0.75" top/bottom, 1" left/right
- Format: High-quality PDF with embedded fonts

## License

ISC
