// Example PDF generation code with Montserrat font support
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

export async function generatePDFWithMontserrat(htmlContent, outputPath) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Load the PDF-specific CSS
  const pdfCssPath = path.join(process.cwd(), 'src/styles/pdf-fonts.css');
  const pdfCss = fs.readFileSync(pdfCssPath, 'utf8');

  // Set content with font preloading
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          ${pdfCss}
        </style>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `, { waitUntil: 'networkidle' });

  // Wait for fonts to load
  await page.waitForLoadState('networkidle');
  
  // Additional wait to ensure fonts are rendered
  await page.waitForTimeout(2000);

  // Generate PDF with A4 settings
  const pdf = await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20mm',
      right: '15mm',
      bottom: '20mm',
      left: '15mm'
    }
  });

  await browser.close();
  return pdf;
}

// Alternative approach: Inject CSS directly
export async function generatePDFWithInlineFont(htmlContent, outputPath) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: 'networkidle' });

  // Inject Montserrat font styles directly
  await page.addStyleTag({
    content: `
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
      
      * {
        font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      }
      
      .font-montserrat {
        font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      }
    `
  });

  // Wait for fonts to load
  await page.waitForTimeout(3000);

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20mm',
      right: '15mm', 
      bottom: '20mm',
      left: '15mm'
    }
  });

  await browser.close();
  return pdf;
}
