import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";
import { jsPDF } from "jspdf";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    console.log('📄 [Super Choice PDF] PDF generation request received');
    console.log('📄 [Super Choice PDF] FormData received:', {
      hasData: !!formData,
      dataType: typeof formData,
      dataKeys: formData ? Object.keys(formData) : [],
      dataSample: formData ? {
        fullName: formData.fullName,
        tfn: formData.tfn,
        employeeNumber: formData.employeeNumber,
        fundChoice: formData.fundChoice,
        superFundName: formData.superFundName,
        hasSectionBSignature: !!formData.sectionBSignature,
        sectionBDate: formData.sectionBDate,
      } : null,
    });
    
    if (!formData || Object.keys(formData).length === 0) {
      console.error('📄 [Super Choice PDF] ERROR: No form data provided!');
      return NextResponse.json({ error: 'Form data is required' }, { status: 400 });
    }

    // Generate HTML content for all pages
    console.log('📄 [Super Choice PDF] Generating HTML content...');
    const htmlContent = generateSuperChoiceFormHTML(formData);
    console.log('📄 [Super Choice PDF] HTML content generated, length:', htmlContent.length);
    
    // Launch Playwright browser
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // Set viewport to match form dimensions (800x1000 per page)
    await page.setViewportSize({ width: 800, height: 1000 });
    
    // Set content and wait for images to load
    await page.setContent(htmlContent, { waitUntil: 'networkidle' });
    
    // Take screenshots of each page
    const screenshots = [];
    const pages = await page.locator('.form-page').all();
    
    for (let i = 0; i < pages.length; i++) {
      const screenshot = await pages[i].screenshot({
        type: 'png',
        clip: { x: 0, y: 0, width: 800, height: 1000 }
      });
      screenshots.push(screenshot);
    }
    
    await browser.close();
    
    // Create PDF from screenshots (same format as tax form)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [800, 1000]
    });
    
    for (let i = 0; i < screenshots.length; i++) {
      if (i > 0) {
        pdf.addPage([800, 1000]);
      }
      
      const base64Image = `data:image/png;base64,${screenshots[i].toString('base64')}`;
      pdf.addImage(base64Image, 'PNG', 0, 0, 800, 1000);
    }
    
    // Get PDF buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
    console.log('📄 [Super Choice PDF] PDF buffer generated, size:', pdfBuffer.length, 'bytes');
    console.log('📄 [Super Choice PDF] Total pages:', screenshots.length);
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="superannuation-standard-choice-form.pdf"'
      }
    });
    
  } catch (error: any) {
    console.error('📄 [Super Choice PDF] PDF generation error:', error);
    console.error('📄 [Super Choice PDF] Error stack:', error.stack);
    return NextResponse.json({ error: 'Failed to generate PDF', details: error.message }, { status: 500 });
  }
}

function generateSuperChoiceFormHTML(data: any): string {
  // Read background images and convert to base64
  const page1Path = path.join(process.cwd(), 'public', 'stafForms', 'super choice form-page1.jpg');
  const page2Path = path.join(process.cwd(), 'public', 'stafForms', 'super choice form-page2.jpg');
  const page3Path = path.join(process.cwd(), 'public', 'stafForms', 'super choice form-page3.jpg');
  const page4Path = path.join(process.cwd(), 'public', 'stafForms', 'super choice form-page4.jpg');
  const page5Path = path.join(process.cwd(), 'public', 'stafForms', 'super choice form-page5.jpg');
  
  const page1Image = fs.existsSync(page1Path) ? fs.readFileSync(page1Path).toString('base64') : '';
  const page2Image = fs.existsSync(page2Path) ? fs.readFileSync(page2Path).toString('base64') : '';
  const page3Image = fs.existsSync(page3Path) ? fs.readFileSync(page3Path).toString('base64') : '';
  const page4Image = fs.existsSync(page4Path) ? fs.readFileSync(page4Path).toString('base64') : '';
  const page5Image = fs.existsSync(page5Path) ? fs.readFileSync(page5Path).toString('base64') : '';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
        .form-page { position: relative; width: 800px; height: 1000px; margin-bottom: 20px; }
        .background-image { position: absolute; inset: 0; width: 100%; height: 100%; }
        .overlay-input { position: absolute; display: flex; gap: 0px; }
        .char-box { 
          width: 20px; height: 25px; border: 1px solid #666; 
          text-align: center; font-size: 12px; line-height: 25px;
          background: white; margin: 0;
        }
        .char-box-small { 
          width: 19px; height: 21px; border: 1px solid #666; 
          text-align: center; font-size: 11px; line-height: 21px;
          background: white; margin: 0;
        }
        .text-input {
          position: absolute;
          background: white;
          border: 1px solid #666;
          padding: 2px 4px;
          font-size: 15px;
          color: black;
        }
        .checkbox { 
          width: 20px; height: 20px; border: 1px solid #666;
          background: white; position: relative;
        }
        .checkbox.checked::after {
          content: '✔'; position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%); font-size: 16px;
        }
        .signature-img {
          position: absolute;
          background: white;
          border: 1px solid #ccc;
        }
      </style>
    </head>
    <body>
      <!-- Page 1 -->
      <div class="form-page">
        <img src="data:image/jpeg;base64,${page1Image}" class="background-image" alt="Page 1" />
        
        <!-- Full Name -->
        <div class="text-input" style="top: 470px; left: 400px; width: 398px;">
          ${data.fullName || ''}
        </div>
        
        <!-- Employee Number - 16 character boxes -->
        <div class="overlay-input" style="top: 514px; left: 410px;">
          ${generateCharBoxes(data.employeeNumber || '', 16)}
        </div>
        
        <!-- TFN - 9 boxes with 3-3-3 grouping -->
        <div style="position: absolute; top: 560px; left: 410px;">
          ${generateTFNBoxes(data.tfn || '')}
        </div>
        
        <!-- Fund Choice Checkboxes -->
        <div class="checkbox ${data.fundChoice === 'existing' ? 'checked' : ''}" style="position: absolute; top: 704px; left: 422px;"></div>
        <div class="checkbox ${data.fundChoice === 'default' ? 'checked' : ''}" style="position: absolute; top: 790px; left: 422px;"></div>
        <div class="checkbox ${data.fundChoice === 'smsf' ? 'checked' : ''}" style="position: absolute; top: 875px; left: 422px;"></div>
      </div>

      <!-- Page 2 -->
      <div class="form-page">
        <img src="data:image/jpeg;base64,${page2Image}" class="background-image" alt="Page 2" />
        
        <!-- Super Fund Name -->
        <div class="text-input" style="top: 195px; left: 30px; width: 730px;">
          ${data.superFundName || ''}
        </div>
        
        <!-- Super Fund ABN - 11 boxes with 2-3-3-3 grouping -->
        <div style="position: absolute; top: 242px; left: 38px;">
          ${generateABNBoxes(data.superFundABN || '', 19)}
        </div>
        
        <!-- USI - 11 character boxes -->
        <div class="overlay-input" style="top: 287px; left: 30px;">
          ${generateCharBoxesWithWidth(data.superFundUSI || '', 11, 330, 21)}
        </div>
        
        <!-- Member Account Number - 16 character boxes -->
        <div class="overlay-input" style="top: 372px; left: 30px;">
          ${generateCharBoxesWithWidth(data.memberAccountNumber || '', 16, 480, 22)}
        </div>
        
        <!-- Account Name -->
        <div class="text-input" style="top: 455px; left: 30px; width: 730px;">
          ${data.accountName || ''}
        </div>
        
        <!-- Compliance Letter Checkbox -->
        <div class="checkbox ${data.hasComplianceLetter ? 'checked' : ''}" style="position: absolute; top: 608px; left: 35px;"></div>
        
        <!-- Signature -->
        ${data.sectionBSignature ? `<img src="${data.sectionBSignature}" class="signature-img" style="top: 718px; left: 30px; width: 490px; height: 60px;" />` : ''}
        
        <!-- Date -->
        ${generateDateBoxes(data.sectionBDate || {}, 760, 565)}
      </div>

      <!-- Page 3 -->
      <div class="form-page">
        <img src="data:image/jpeg;base64,${page3Image}" class="background-image" alt="Page 3" />
        <!-- Page 3 is read-only, no fields to fill -->
      </div>

      <!-- Page 4 -->
      <div class="form-page">
        <img src="data:image/jpeg;base64,${page4Image}" class="background-image" alt="Page 4" />
        <!-- Page 4 is read-only, no fields to fill -->
      </div>

      <!-- Page 5 -->
      <div class="form-page">
        <img src="data:image/jpeg;base64,${page5Image}" class="background-image" alt="Page 5" />
      </div>
    </body>
    </html>
  `;
}

function generateCharBoxes(value: string, length: number): string {
  return Array.from({ length }, (_, i) => 
    `<div class="char-box">${value[i] || ''}</div>`
  ).join('');
}

function generateCharBoxesWithWidth(value: string, length: number, totalWidth: number, boxHeight: number = 25): string {
  const boxWidth = Math.floor(totalWidth / length);
  const heightClass = boxHeight === 21 ? 'char-box-small' : 'char-box';
  return Array.from({ length }, (_, i) => 
    `<div class="${heightClass}" style="width: ${boxWidth}px; height: ${boxHeight}px;">${value[i] || ''}</div>`
  ).join('');
}

function generateTFNBoxes(value: string): string {
  const digits = value.replace(/\D/g, '').padEnd(9, '');
  let html = '';
  let currentLeft = 0;
  
  for (let i = 0; i < 9; i++) {
    if (i === 3) currentLeft = 80; // Gap after 3rd digit
    if (i === 6) currentLeft = 160; // Gap after 6th digit
    
    html += `<div class="char-box" style="position: absolute; left: ${currentLeft}px;">${digits[i] || ''}</div>`;
    currentLeft += 20; // boxWidth
  }
  
  return html;
}

function generateABNBoxes(value: string, boxWidth: number = 19): string {
  const digits = value.replace(/\D/g, '').padEnd(11, '');
  let html = '';
  let currentLeft = 0;
  const gap = 18; // Gap between groups
  
  for (let i = 0; i < 11; i++) {
    // 2-3-3-3 grouping pattern
    if (i === 2) {
      currentLeft += gap; // Gap after first 2 digits
    } else if (i === 5) {
      currentLeft += gap; // Gap after next 3 digits
    } else if (i === 8) {
      currentLeft += gap; // Gap after next 3 digits
    }
    
    html += `<div class="char-box-small" style="position: absolute; left: ${currentLeft}px; width: ${boxWidth}px;">${digits[i] || ''}</div>`;
    currentLeft += boxWidth;
  }
  
  return html;
}

function generateDateBoxes(date: { day?: string; month?: string; year?: string } | string, top: number, left: number): string {
  let day = '', month = '', year = '';
  
  if (typeof date === 'string') {
    const digits = date.replace(/\D/g, '').padEnd(8, '');
    day = digits.slice(0, 2);
    month = digits.slice(2, 4);
    year = digits.slice(4, 8);
  } else {
    day = (date.day || '').padStart(2, '0');
    month = (date.month || '').padStart(2, '0');
    year = date.year || '';
  }
  
  // Date format: DD/MM/YYYY
  // Day: 2 boxes, Month: 2 boxes, Year: 4 boxes
  const dayLeft = left;
  const monthLeft = left + 50;
  const yearLeft = left + 100;
  
  return `
    <div class="overlay-input" style="top: ${top}px; left: ${dayLeft}px;">
      ${generateCharBoxes(day, 2)}
    </div>
    <span style="position: absolute; top: ${top + 1}px; left: ${dayLeft + 45}px; font-size: 14px; font-weight: bold;">/</span>
    <div class="overlay-input" style="top: ${top}px; left: ${monthLeft}px;">
      ${generateCharBoxes(month, 2)}
    </div>
    <span style="position: absolute; top: ${top + 1}px; left: ${monthLeft + 45}px; font-size: 14px; font-weight: bold;">/</span>
    <div class="overlay-input" style="top: ${top}px; left: ${yearLeft}px;">
      ${generateCharBoxes(year, 4)}
    </div>
  `;
}
