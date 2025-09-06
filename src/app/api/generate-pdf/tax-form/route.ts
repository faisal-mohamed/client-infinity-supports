import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";
import { jsPDF } from "jspdf";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Generate HTML content with form data
    const htmlContent = generateTaxFormHTML(formData);
    
    // Launch Playwright browser
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // Set viewport to match your form dimensions
    await page.setViewportSize({ width: 800, height: 1100 });
    
    // Set content and wait for images to load
    await page.setContent(htmlContent, { waitUntil: 'networkidle' });
    
    // Take screenshot
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: true,
      clip: { x: 0, y: 0, width: 800, height: 1100 }
    });
    
    await browser.close();
    
    // Convert screenshot to PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [800, 1100]
    });
    
    // Convert buffer to base64
    const base64Image = `data:image/png;base64,${screenshot.toString('base64')}`;
    
    // Add image to PDF
    pdf.addImage(base64Image, 'PNG', 0, 0, 800, 1100);
    
    // Get PDF buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="tax-form.pdf"'
      }
    });
    
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}

function generateTaxFormHTML(data: any): string {
  // Read the background image and convert to base64
  const imagePath = path.join(process.cwd(), 'public', 'tax-3img.jpg');
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
        .form-container { position: relative; width: 800px; height: 1100px; }
        .background-image { position: absolute; inset: 0; width: 100%; height: 100%; }
        .overlay-input { position: absolute; display: flex; gap: 0px; }
        .char-box { 
          width: 20px; height: 25px; border: 1px solid #666; 
          text-align: center; font-size: 12px; line-height: 25px;
          background: white; margin: 0;
        }
        .checkbox { 
          width: 16px; height: 16px; border: 1px solid #666;
          background: white; position: relative;
        }
        .checkbox.checked::after {
          content: '✔'; position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%); font-size: 14px;
        }
        .signature-img {
          position: absolute;
          background: white;
          border: 1px solid #ccc;
        }
      </style>
    </head>
    <body>
      <div class="form-container">
        <img src="data:image/jpeg;base64,${base64Image}" class="background-image" alt="Form" />
        
        <!-- TFN -->
        <div class="overlay-input" style="top: 120px; left: 147px;">
          ${generateCharBoxesWithWidth(data.tfn || '', 9, 230)}
        </div>
        
        <!-- Checkboxes -->
        <div class="checkbox ${data.check1 ? 'checked' : ''}" style="position: absolute; top: 155px; left: 372px;"></div>
        <div class="checkbox ${data.check2 ? 'checked' : ''}" style="position: absolute; top: 187px; left: 372px;"></div>
        <div class="checkbox ${data.check3 ? 'checked' : ''}" style="position: absolute; top: 218px; left: 372px;"></div>
        <div class="checkbox ${data.check4 ? 'checked' : ''}" style="position: absolute; top: 252px; left: 200px;"></div>
        <div class="checkbox ${data.check5 ? 'checked' : ''}" style="position: absolute; top: 252px; left: 255px;"></div>
        <div class="checkbox ${data.check6 ? 'checked' : ''}" style="position: absolute; top: 252px; left: 315px;"></div>
        <div class="checkbox ${data.check7 ? 'checked' : ''}" style="position: absolute; top: 252px; left: 372px;"></div>
        <div class="checkbox ${data.check8 ? 'checked' : ''}" style="position: absolute; top: 910px; left: 747px;"></div>
        
        <!-- Names -->
        <div class="overlay-input" style="top: 283px; left: 30px;">
          ${generateCharBoxesWithWidth(data.surname || '', 19, 340)}
        </div>
        <div class="overlay-input" style="top: 320px; left: 30px;">
          ${generateCharBoxesWithWidth(data.firstName || '', 19, 340)}
        </div>
        <div class="overlay-input" style="top: 355px; left: 30px;">
          ${generateCharBoxesWithWidth(data.otherName || '', 19, 340)}
        </div>
        <div class="overlay-input" style="top: 415px; left: 30px;">
          ${generateCharBoxesWithWidth(data.anotherName || '', 19, 340)}
        </div>
        
        <!-- DOB -->
        ${generateDateBoxes(data.dob || '', 455, 210, 265, 315)}
        
        <!-- Address -->
        ${generateMultiRowBoxes(data.address || '', 503, 30, 2, 19, 17, 28, 0, 2)}
        
        <!-- Town, State, Postcode -->
        <div class="overlay-input" style="top: 570px; left: 30px;">
          ${generateCharBoxesWithWidth(data.town || '', 19, 340)}
        </div>
        <div class="overlay-input" style="top: 605px; left: 30px;">
          ${generateCharBoxes(data.state || '', 3)}
        </div>
        <div class="overlay-input" style="top: 605px; left: 125px;">
          ${generateCharBoxes(data.postcode || '', 4)}
        </div>
        
        <!-- ABN -->
        ${generateABNBoxes(data.abnno || '', 710, 30)}
        
        <!-- Branch No -->
        <div class="overlay-input" style="top: 708px; left: 320px;">
          ${generateCharBoxes(data.branchNo || '', 3)}
        </div>
        
        <!-- Legal Name -->
        ${generateMultiRowBoxes(data.legalName || '', 828, 30, 3, 19, 17, 28, 0, 2)}
        
        <!-- Business Address -->
        ${generateMultiRowBoxes(data.bussinessAddress || '', 695, 425, 2, 19, 17, 28, 0, 2)}
        
        <!-- Business Town -->
        <div class="overlay-input" style="top: 762px; left: 425px;">
          ${generateCharBoxesWithWidth(data.bussinessTown || '', 19, 340)}
        </div>
        
        <!-- Business State & Postcode -->
        <div class="overlay-input" style="top: 797px; left: 425px;">
          ${generateCharBoxes(data.bussinessState || '', 3)}
        </div>
        <div class="overlay-input" style="top: 797px; left: 520px;">
          ${generateCharBoxes(data.bussinessPostcode || '', 4)}
        </div>
        
        <!-- Contact Person -->
        <div class="overlay-input" style="top: 840px; left: 425px;">
          ${generateCharBoxesWithWidth(data.contactPerson || '', 19, 340)}
        </div>
        
        <!-- Business Phone -->
        <div class="overlay-input" style="top: 872px; left: 537px;">
          ${generateCharBoxes(data.bussinessPhoneNo || '', 10)}
        </div>
        
        <!-- Radio buttons -->
        ${generateRadioBoxes(data.austrailanResident, 166, 717, 767)}
        ${generateRadioBoxes(data.claimTaxFree, 256, 442, 495)}
        ${generateRadioBoxes(data.seniorPensioner, 322, 442, 767)}
        ${generateRadioBoxes(data.overseasForces, 391, 443, 767)}
        ${generateRadioBoxes(data.tsldebt, 453, 443, 767)}
        ${generateRadioBoxes(data.financialDebt, 497, 443, 767)}
        ${generateRadioBoxes(data.haveAbn, 768, 50, 100)}
        
        <!-- Multi-option radio -->
        ${generateMultiRadioBoxes(data.selectedOption, 126.5, [477, 552, 603, 692, 767])}
        
        <!-- Signature dates -->
        ${generateDateBoxes(data.payerSignatureAt || '', 970, 215, 265, 315)}
        ${generateDateBoxes(data.payeeSignatureAt || '', 570, 610, 660, 710)}
        
        <!-- Signatures -->
        ${data.payerSignature ? `<img src="${data.payerSignature}" class="signature-img" style="top: 952px; left: 10px; width: 200px; height: 40px;" />` : ''}
        ${data.payeeSignature ? `<img src="${data.payeeSignature}" class="signature-img" style="top: 555px; left: 410px; width: 200px; height: 40px;" />` : ''}
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

function generateCharBoxesWithWidth(value: string, length: number, totalWidth: number): string {
  const boxWidth = Math.floor(totalWidth / length);
  return Array.from({ length }, (_, i) => 
    `<div class="char-box" style="width: ${boxWidth}px;">${value[i] || ''}</div>`
  ).join('');
}

function generateDateBoxes(date: string, top: number, dayLeft: number, monthLeft: number, yearLeft: number): string {
  const digits = date.replace(/\D/g, '').padEnd(8, '');
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  
  return `
    <div class="overlay-input" style="top: ${top}px; left: ${dayLeft}px;">
      ${generateCharBoxes(day, 2)}
    </div>
    <div class="overlay-input" style="top: ${top}px; left: ${monthLeft}px;">
      ${generateCharBoxes(month, 2)}
    </div>
    <div class="overlay-input" style="top: ${top}px; left: ${yearLeft}px;">
      ${generateCharBoxes(year, 4)}
    </div>
  `;
}

function generateMultiRowBoxes(value: string, top: number, left: number, rows: number, cols: number, boxWidth: number = 18, boxHeight: number = 28, gap: number = 1, rowGap: number = 2): string {
  let html = '';
  for (let row = 0; row < rows; row++) {
    const rowValue = value.slice(row * cols, (row + 1) * cols);
    html += `<div class="overlay-input" style="top: ${top + row * (boxHeight + rowGap)}px; left: ${left}px;">`;
    for (let col = 0; col < cols; col++) {
      const char = rowValue[col] || '';
      const marginRight = col < cols - 1 ? gap : 0;
      html += `<div class="char-box" style="width: ${boxWidth}px; height: ${boxHeight}px; margin-right: ${marginRight}px;">${char}</div>`;
    }
    html += `</div>`;
  }
  return html;
}

function generateABNBoxes(value: string, top: number, left: number): string {
  const digits = value.replace(/\D/g, '').padEnd(11, '');
  const groups = [
    { chars: digits.slice(0, 2), left: left },
    { chars: digits.slice(2, 5), left: left + 50 },
    { chars: digits.slice(5, 8), left: left + 125 },
    { chars: digits.slice(8, 11), left: left + 200 }
  ];
  
  return groups.map(group => 
    `<div class="overlay-input" style="top: ${top}px; left: ${group.left}px;">
      ${generateCharBoxes(group.chars, group.chars.length)}
    </div>`
  ).join('');
}

function generateRadioBoxes(value: string, top: number, yesLeft: number, noLeft: number): string {
  return `
    <div class="checkbox ${value === 'yes' ? 'checked' : ''}" style="position: absolute; top: ${top}px; left: ${yesLeft}px;"></div>
    <div class="checkbox ${value === 'no' ? 'checked' : ''}" style="position: absolute; top: ${top}px; left: ${noLeft}px;"></div>
  `;
}

function generateMultiRadioBoxes(value: string, top: number, positions: number[]): string {
  const options = ['opt1', 'opt2', 'opt3', 'opt4', 'opt5'];
  return positions.map((left, i) => 
    `<div class="checkbox ${value === options[i] ? 'checked' : ''}" style="position: absolute; top: ${top}px; left: ${left}px;"></div>`
  ).join('');
}
