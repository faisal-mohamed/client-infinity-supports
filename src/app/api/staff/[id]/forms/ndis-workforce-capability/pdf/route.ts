import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import NdisWorkforceCapabilityPDF from '@/components-server/PrintableForms/staff/ndis-workforce-capability/page';
import fs from 'fs';
import path from 'path';
// @ts-ignore - pdf-lib types may not be available immediately after install
import { PDFDocument } from 'pdf-lib';

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

    // Create PDF component props
    const pdfProps = {
      data: formData,
      staff: {
        firstName: staff.firstName,
        surname: staff.surname,
        email: staff.email,
      },
      settings,
      images,
      showBlankForm: showBlank,
    };

    console.log('🎨 [PDF API] Creating PDF document with dynamic content...');

    // Generate PDF
    // @ts-ignore - renderToBuffer accepts React elements
    const pdfDoc = React.createElement(NdisWorkforceCapabilityPDF as any, pdfProps);
    // @ts-ignore - renderToBuffer type definition may be strict
    const pdfBuffer = await renderToBuffer(pdfDoc);

    console.log('✅ [PDF API] Acknowledgement PDF generated successfully, size:', pdfBuffer.length, 'bytes');

    // If mergeWithFramework is true, merge with the static framework PDF
    let finalPdfBuffer = pdfBuffer;
    if (mergeWithFramework && !showBlank) {
      try {
        console.log('📄 [PDF API] Merging with framework PDF...');
        
        // Read the static framework PDF
        const frameworkPdfPath = path.join(process.cwd(), 'public', 'stafForms', 'NDIS WORKFORCE CAPABILITY FRAMEWORK.pdf');
        
        if (!fs.existsSync(frameworkPdfPath)) {
          console.warn('⚠️ [PDF API] Framework PDF not found at:', frameworkPdfPath);
        } else {
          const frameworkPdfBytes = fs.readFileSync(frameworkPdfPath);
          
          // Create a new PDF document
          const mergedPdf = await PDFDocument.create();
          
          // Load the framework PDF
          const frameworkPdf = await PDFDocument.load(frameworkPdfBytes);
          const frameworkPages = await mergedPdf.copyPages(frameworkPdf, frameworkPdf.getPageIndices());
          frameworkPages.forEach((page: any) => {
            mergedPdf.addPage(page);
          });
          
          // Load the acknowledgement PDF
          const acknowledgementPdf = await PDFDocument.load(pdfBuffer);
          const acknowledgementPages = await mergedPdf.copyPages(acknowledgementPdf, acknowledgementPdf.getPageIndices());
          acknowledgementPages.forEach((page: any) => {
            mergedPdf.addPage(page);
          });
          
          // Generate the merged PDF
          finalPdfBuffer = Buffer.from(await mergedPdf.save());
          console.log('✅ [PDF API] PDFs merged successfully, final size:', finalPdfBuffer.length, 'bytes');
        }
      } catch (mergeError) {
        console.error('❌ [PDF API] Error merging PDFs:', mergeError);
        // Fall back to just the acknowledgement PDF if merge fails
        console.log('⚠️ [PDF API] Falling back to acknowledgement PDF only');
      }
    }

    // Return PDF as inline (for iframe viewing in admin) or attachment (for download)
    const contentDisposition = showBlank || mergeWithFramework ? 'attachment' : 'inline';
    
    return new NextResponse(finalPdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${contentDisposition}; filename="NDIS_Workforce_Capability_${staff.firstName}_${staff.surname}.pdf"`,
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

