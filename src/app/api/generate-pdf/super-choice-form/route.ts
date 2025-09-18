import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';
import { jsPDF } from 'jspdf';

export async function POST(request: NextRequest) {
  try {
    const { formData } = await request.json();

    if (!formData) {
      return NextResponse.json({ error: 'Form data is required' }, { status: 400 });
    }

    // Launch browser
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Set viewport size
    await page.setViewportSize({ width: 1200, height: 1600 });

    // Create HTML content for the form
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Superannuation Standard Choice Form</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background: white;
            }
            .form-page {
              width: 100%;
              max-width: 800px;
              margin: 0 auto;
              page-break-after: always;
            }
            .form-page:last-child {
              page-break-after: avoid;
            }
            .field-overlay {
              position: absolute;
              background: white;
              border: 1px solid #ccc;
              padding: 2px;
              font-size: 12px;
              min-height: 20px;
            }
            .signature-overlay {
              position: absolute;
              background: white;
              border: 1px solid #ccc;
              min-height: 60px;
            }
            .checkbox-overlay {
              position: absolute;
              width: 15px;
              height: 15px;
              border: 1px solid #000;
              background: ${formData.hasComplianceLetter ? 'black' : 'white'};
            }
            .radio-overlay {
              position: absolute;
              width: 15px;
              height: 15px;
              border: 1px solid #000;
              border-radius: 50%;
              background: white;
            }
            .radio-overlay.checked {
              background: black;
            }
            .date-field {
              display: inline-block;
              width: 30px;
              text-align: center;
              border-bottom: 1px solid #000;
              margin: 0 5px;
            }
          </style>
        </head>
        <body>
          <!-- Page 1 -->
          <div class="form-page" style="position: relative;">
            <img src="/stafForms/super choice form-page1.jpg" style="width: 100%; height: auto;" />
            
            <!-- Section A Fields -->
            <div class="field-overlay" style="top: 280px; left: 400px; width: 300px;">
              ${formData.fullName || ''}
            </div>
            
            <div class="field-overlay" style="top: 320px; left: 400px; width: 220px;">
              ${formData.employeeNumber || ''}
            </div>
            
            <div class="field-overlay" style="top: 360px; left: 400px; width: 180px;">
              ${formData.tfn || ''}
            </div>
            
            <!-- Fund Choice Radio Buttons -->
            <div class="radio-overlay ${formData.fundChoice === 'existing' ? 'checked' : ''}" 
                 style="top: 450px; left: 50px;"></div>
            <div class="radio-overlay ${formData.fundChoice === 'default' ? 'checked' : ''}" 
                 style="top: 500px; left: 50px;"></div>
            <div class="radio-overlay ${formData.fundChoice === 'smsf' ? 'checked' : ''}" 
                 style="top: 550px; left: 50px;"></div>
          </div>

          <!-- Page 2 -->
          <div class="form-page" style="position: relative;">
            <img src="/stafForms/super choice form-page2.jpg" style="width: 100%; height: auto;" />
            
            <!-- Section B Fields -->
            <div class="field-overlay" style="top: 200px; left: 300px; width: 400px;">
              ${formData.superFundName || ''}
            </div>
            
            <div class="field-overlay" style="top: 250px; left: 300px; width: 220px;">
              ${formData.superFundABN || ''}
            </div>
            
            <div class="field-overlay" style="top: 300px; left: 300px; width: 220px;">
              ${formData.superFundUSI || ''}
            </div>
            
            <div class="field-overlay" style="top: 350px; left: 300px; width: 320px;">
              ${formData.memberAccountNumber || ''}
            </div>
            
            <div class="field-overlay" style="top: 400px; left: 300px; width: 400px;">
              ${formData.accountName || ''}
            </div>
            
            <div class="checkbox-overlay" style="top: 500px; left: 50px;"></div>
            
            <div class="signature-overlay" style="top: 600px; left: 300px; width: 300px;">
              ${formData.sectionBSignature ? '<img src="' + formData.sectionBSignature + '" style="width: 100%; height: 100%; object-fit: contain;" />' : ''}
            </div>
            
            <div style="position: absolute; top: 700px; left: 300px;">
              <span class="date-field">${formData.sectionBDate?.day || ''}</span>/
              <span class="date-field">${formData.sectionBDate?.month || ''}</span>/
              <span class="date-field">${formData.sectionBDate?.year || ''}</span>
            </div>
          </div>

          <!-- Page 3 -->
          <div class="form-page" style="position: relative;">
            <img src="/stafForms/super choice form-page3.jpg" style="width: 100%; height: auto;" />
            
            <!-- Section C Fields -->
            <div class="field-overlay" style="top: 200px; left: 300px; width: 400px;">
              ${formData.businessName || ''}
            </div>
            
            <div class="field-overlay" style="top: 250px; left: 300px; width: 220px;">
              ${formData.businessABN || ''}
            </div>
            
            <div class="field-overlay" style="top: 300px; left: 300px; width: 400px;">
              ${formData.defaultSuperFundName || ''}
            </div>
            
            <div class="field-overlay" style="top: 350px; left: 300px; width: 220px;">
              ${formData.defaultSuperFundABN || ''}
            </div>
            
            <div class="field-overlay" style="top: 400px; left: 300px; width: 220px;">
              ${formData.defaultSuperFundUSI || ''}
            </div>
            
            <div class="checkbox-overlay" style="top: 500px; left: 50px; background: ${formData.chooseDefaultFund ? 'black' : 'white'};"></div>
            
            <div class="signature-overlay" style="top: 600px; left: 300px; width: 300px;">
              ${formData.sectionCSignature ? '<img src="' + formData.sectionCSignature + '" style="width: 100%; height: 100%; object-fit: contain;" />' : ''}
            </div>
            
            <div style="position: absolute; top: 700px; left: 300px;">
              <span class="date-field">${formData.sectionCDate?.day || ''}</span>/
              <span class="date-field">${formData.sectionCDate?.month || ''}</span>/
              <span class="date-field">${formData.sectionCDate?.year || ''}</span>
            </div>
          </div>

          <!-- Page 4 -->
          <div class="form-page" style="position: relative;">
            <img src="/stafForms/super choice form-page4.jpg" style="width: 100%; height: auto;" />
            
            <!-- Section D Fields -->
            <div class="field-overlay" style="top: 200px; left: 300px; width: 400px;">
              ${formData.smsfName || ''}
            </div>
            
            <div class="field-overlay" style="top: 250px; left: 300px; width: 220px;">
              ${formData.smsfABN || ''}
            </div>
            
            <div class="field-overlay" style="top: 300px; left: 300px; width: 400px;">
              ${formData.smsfESA || ''}
            </div>
            
            <div class="field-overlay" style="top: 350px; left: 300px; width: 400px;">
              ${formData.smsfAccountName || ''}
            </div>
            
            <div class="field-overlay" style="top: 450px; left: 300px; width: 400px;">
              ${formData.bankAccountName || ''}
            </div>
            
            <div class="field-overlay" style="top: 500px; left: 300px; width: 120px;">
              ${formData.bsbCode || ''}
            </div>
            
            <div class="field-overlay" style="top: 550px; left: 300px; width: 180px;">
              ${formData.accountNumber || ''}
            </div>
            
            <div class="checkbox-overlay" style="top: 650px; left: 50px; background: ${formData.hasSMSFEvidence ? 'black' : 'white'};"></div>
            
            <div class="signature-overlay" style="top: 750px; left: 300px; width: 300px;">
              ${formData.sectionDSignature ? '<img src="' + formData.sectionDSignature + '" style="width: 100%; height: 100%; object-fit: contain;" />' : ''}
            </div>
            
            <div style="position: absolute; top: 850px; left: 300px;">
              <span class="date-field">${formData.sectionDDate?.day || ''}</span>/
              <span class="date-field">${formData.sectionDDate?.month || ''}</span>/
              <span class="date-field">${formData.sectionDDate?.year || ''}</span>
            </div>
          </div>

          <!-- Page 5 -->
          <div class="form-page" style="position: relative;">
            <img src="/stafForms/super choice form-page5.jpg" style="width: 100%; height: auto;" />
          </div>
        </body>
      </html>
    `;

    // Set content and wait for images to load
    await page.setContent(htmlContent);
    await page.waitForLoadState('networkidle');

    // Take screenshots of each page
    const screenshots = [];
    const pages = await page.locator('.form-page').all();
    
    for (let i = 0; i < pages.length; i++) {
      const screenshot = await pages[i].screenshot({ type: 'png' });
      screenshots.push(screenshot);
    }

    await browser.close();

    // Create PDF from screenshots
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    for (let i = 0; i < screenshots.length; i++) {
      if (i > 0) {
        pdf.addPage();
      }
      
      const imgData = `data:image/png;base64,${screenshots[i].toString('base64')}`;
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297); // A4 size in mm
    }

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="superannuation-standard-choice-form.pdf"',
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
