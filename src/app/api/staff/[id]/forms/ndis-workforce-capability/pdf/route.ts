import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { chromium } from 'playwright';
import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

async function encodeImageToBase64(imagePath: string): Promise<string> {
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    
    if (!fs.existsSync(fullPath)) {
      console.error(`Image file not found: ${fullPath}`);
      return '';
    }
    
    const imageBuffer = fs.readFileSync(fullPath);
    const extension = path.extname(imagePath).substring(1);
    
    if (!imageBuffer || imageBuffer.length === 0) {
      console.error(`Image file is empty: ${fullPath}`);
      return '';
    }

    const base64String = `data:image/${extension};base64,${imageBuffer.toString('base64')}`;
    console.log(`✅ Encoded image: ${imagePath} (${imageBuffer.length} bytes)`);
    return base64String;
  } catch (error) {
    console.error(`❌ Error encoding image ${imagePath}:`, error);
    return '';
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const staffId = parseInt(id);
    const { searchParams } = new URL(req.url);
    const showBlank = searchParams.get('blank') === 'true';
    const mergeWithFramework = searchParams.get('merge') === 'true';

    console.log('📥 [PDF API] Generating NDIS Workforce Capability PDF for staff:', staffId, 'blank:', showBlank, 'merge:', mergeWithFramework);

    // Fetch staff data
    const db: any = prisma as any;
    const staff = await db.staff.findUnique({
      where: { id: staffId },
      select: { id: true, firstName: true, surname: true, email: true },
    });

    if (!staff) {
      return NextResponse.json(
        { error: 'Staff not found' },
        { status: 404 }
      );
    }

    // Get form submission data - check both StaffFormSubmission table and dedicated table
    const submission = await db.staffFormSubmission.findFirst({
      where: {
        staffId: staffId,
        formKey: 'ndis_workforce_capability'
      }
    });

    // Also check dedicated table
    const ndisWorkforceCapability = await db.staffNdisWorkforceCapability.findUnique({
      where: { staffId }
    });

    // Merge data from both sources
    const submissionData = submission?.data || {};
    const dedicatedTableData = (ndisWorkforceCapability?.data as any) || {};
    
    // Merge form data - dedicated table takes priority
    const formData = {
      ...submissionData,
      ...dedicatedTableData,
      // Handle signature fields - prefer dedicated table top-level fields, fallback to submission
      signature: ndisWorkforceCapability?.staffSignature || submission?.staffSignature || dedicatedTableData?.signature || submissionData?.signature,
      date: ndisWorkforceCapability?.staffSignedAt ? new Date(ndisWorkforceCapability.staffSignedAt).toISOString().split('T')[0] : (submission?.staffSignedAt ? new Date(submission.staffSignedAt).toISOString().split('T')[0] : dedicatedTableData?.date || submissionData?.date),
      staffSignature: ndisWorkforceCapability?.staffSignature || submission?.staffSignature,
      staffSignedAt: ndisWorkforceCapability?.staffSignedAt || submission?.staffSignedAt,
    };

    console.log('📊 [PDF API] Staff data:', { 
      id: staff.id, 
      name: `${staff.firstName} ${staff.surname}`,
      hasSubmission: !!submission,
      hasDedicatedRecord: !!ndisWorkforceCapability,
    });

    // Encode images to base64
    const images = {
      infinityLogo: await encodeImageToBase64('/infinity_logo.png'),
    };

    // Get app settings for footer
    const rawSettings = await prisma.appSettings.findMany({
      where: { isActive: true },
      select: { key: true, value: true },
    });

    const settings: Record<string, any> = {};
    rawSettings.forEach(setting => {
      if (setting.value && setting.value.trim() !== '') {
        settings[setting.key] = setting.value;
      }
    });

    console.log('⚙️ [PDF API] Settings from DB:', settings);

    // Read the background image (JPG) and convert to base64 - like tax form uses tax-3img.jpg
    const imagePath = path.join(process.cwd(), 'public', '6.NDIS WCF_1.jpg');
    if (!fs.existsSync(imagePath)) {
      return NextResponse.json(
        { error: 'Background image not found: 6.NDIS WCF_1.jpg' },
        { status: 404 }
      );
    }
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString('base64');

    // Generate HTML content with form data overlaid on the background image
    const htmlContent = generateNDISFormHTML(formData, staff, imageBase64);

    // Launch Playwright browser
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Set viewport to match A4 size (800x1123)
    await page.setViewportSize({ width: 800, height: 1123 });

    // Set content and wait for images to load
    await page.setContent(htmlContent, { waitUntil: 'networkidle' });
    
    // Wait for signature processing to complete
    await page.waitForFunction(() => {
      const sigImg = document.getElementById('signature-img');
      if (!sigImg) return true; // No signature, continue
      // Check if image has been processed (src changed to data URL)
      return sigImg.src && sigImg.src.startsWith('data:image/png');
    }, { timeout: 5000 }).catch(() => {
      // If signature processing fails or times out, continue anyway
      console.log('⚠️ Signature processing timeout, continuing...');
    });
    
    // Wait a bit more for everything to render
    await page.waitForTimeout(500);

    // Take screenshot of final form
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false,
      clip: { x: 0, y: 0, width: 800, height: 1123 }
    });

    await page.close();
    await browser.close();

    // Convert screenshot to PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [800, 1123]
    });

    // Convert buffer to base64
    const base64Image = `data:image/png;base64,${screenshot.toString('base64')}`;

    // Add first page (filled form) only
    pdf.addImage(base64Image, 'PNG', 0, 0, 800, 1123);

    // Get PDF buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

    console.log('✅ [PDF API] First page PDF generated successfully, size:', pdfBuffer.length, 'bytes');

    // Return PDF as attachment for download
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="NDIS_Workforce_Capability_${staff.firstName}_${staff.surname}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error('❌ [PDF API] Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error.message },
      { status: 500 }
    );
  }
}

function generateNDISFormHTML(data: any, staff: any, imageBase64: string): string {
  // Get the full name
  const fullName = data.fullName || data.staffName || `${staff.firstName || ''} ${staff.surname || ''}`.trim();
  
  // Get signature (base64 image)
  const signature = data.signature || data.staffSignature || '';
  
  // Get date
  const date = data.date || data.staffSignedAt || '';
  // Format date as DD-MM-YYYY if needed
  let formattedDate = date;
  if (date && date.includes('-')) {
    try {
      const dateObj = new Date(date);
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      formattedDate = `${day}-${month}-${year}`;
    } catch {
      formattedDate = date;
    }
  }
  
  // Process signature to make it transparent (will be done in browser)
  const signatureId = signature ? 'signature-img' : '';

  // Use the JPG image as background (like tax form uses tax-3img.jpg)
  // Then overlay the data on top
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; background: white; }
        .form-container { position: relative; width: 800px; height: 1123px; margin: 0 auto; }
        .background-image { 
          position: absolute; 
          inset: 0; 
          width: 100%; 
          height: 100%; 
          object-fit: contain;
        }
        .overlay-name {
          position: absolute;
          top: 890px;
          left: 80px;
          width: 315px;
          height: 35px;
          border: none;
          background: transparent;
          font-size: 18px;
          font-family: Arial, Helvetica, sans-serif;
          color: #000;
          padding: 0;
          z-index: 10;
          line-height: 35px;
        }
        .overlay-signature {
          position: absolute;
          top: 958px;
          left: 160px;
          width: 310px;
          height: 60px;
          border: none;
          border-bottom: 1.5px solid #111827;
          background: transparent;
          display: flex;
          align-items: flex-end;
          justify-content: flex-start;
          padding-bottom: 0px;
          z-index: 10;
        }
        .overlay-signature img {
          width: auto;
          height: 50px;
          max-width: 100%;
          object-fit: contain;
          image-rendering: auto;
          image-rendering: -webkit-optimize-contrast;
          filter: contrast(1.2) brightness(1.0);
          background-color: transparent;
          mix-blend-mode: multiply;
        }
        #signature-img {
          image-rendering: auto;
        }
        .overlay-date {
          position: absolute;
          top: 1020px;
          left: 130px;
          width: 280px;
          height: 35px;
          border: none;
          background: transparent;
          font-size: 18px;
          font-family: Arial, Helvetica, sans-serif;
          color: #000;
          padding: 0;
          z-index: 10;
          line-height: 35px;
        }
      </style>
    </head>
    <body>
      <div class="form-container">
        <img src="data:image/jpeg;base64,${imageBase64}" class="background-image" alt="NDIS Framework" />
        
        <!-- Name field -->
        <div class="overlay-name">${fullName}</div>
        
        <!-- Signature field -->
        <div class="overlay-signature">
          ${signature ? `<img id="signature-img" src="${signature}" alt="Signature" />` : ''}
        </div>
        
        <!-- Date field -->
        <div class="overlay-date">${formattedDate}</div>
      </div>
      
      <script>
        // Process signature to make background transparent
        (function() {
          const sigImg = document.getElementById('signature-img');
          if (!sigImg) return;
          
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Draw the image
            ctx.drawImage(img, 0, 0);
            
            // Get image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // Process pixels to make background transparent
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              const a = data[i + 3];
              
              // Calculate brightness
              const brightness = (r + g + b) / 3;
              
              // Check if pixel is white, light grey, or very light (background)
              const isBackground = brightness > 200 || (r > 200 && g > 200 && b > 200) || a < 10;
              
              if (isBackground) {
                // Make background pixels fully transparent
                data[i + 3] = 0;
              } else {
                // Make signature darker and more visible
                const isSignature = brightness < 200;
                if (isSignature) {
                  data[i] = 0;       // R - pure black
                  data[i + 1] = 0;   // G - pure black
                  data[i + 2] = 0;   // B - pure black
                  data[i + 3] = Math.min(255, Math.max(200, a * 1.5)); // A - fully opaque
                } else {
                  // For any remaining pixels, make them darker
                  data[i] = Math.max(0, Math.min(255, r * 0.5));
                  data[i + 1] = Math.max(0, Math.min(255, g * 0.5));
                  data[i + 2] = Math.max(0, Math.min(255, b * 0.5));
                  data[i + 3] = Math.min(255, a * 1.3);
                }
              }
            }
            
            // Put processed image data back
            ctx.putImageData(imageData, 0, 0);
            
            // Replace the original image with processed one
            sigImg.src = canvas.toDataURL('image/png', 1.0);
          };
          
          img.src = sigImg.src;
        })();
      </script>
    </body>
    </html>
  `;
}

