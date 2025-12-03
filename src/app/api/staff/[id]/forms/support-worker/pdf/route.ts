import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getStaffSettingsForForm } from '@/lib/settings-server';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import SupportWorkerPDF from '@/components-server/PrintableForms/staff/support-worker/page';
import fs from 'fs';
import path from 'path';

// Log component import at module level to verify it's loaded correctly
console.log('📚 [PDF API MODULE] Support Worker PDF Route Loaded');
console.log('  - SupportWorkerPDF imported from: @/components-server/PrintableForms/staff/support-worker/page');
console.log('  - Component type:', typeof SupportWorkerPDF);
console.log('  - renderToBuffer imported from: @react-pdf/renderer');
console.log('  - renderToBuffer type:', typeof renderToBuffer);

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
    
    // Check if we should show blank acknowledgement form (for staff download)
    const { searchParams } = new URL(req.url);
    const showBlank = searchParams.get('blank') === 'true';

    console.log('📥 [PDF API] Generating Position Description PDF for staff:', staffId, '| Blank page 5:', showBlank);

    // Fetch staff data
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      include: {
        submissions: {
          where: { formKey: 'support_worker' }
        }
      }
    });

    if (!staff) {
      return NextResponse.json(
        { error: 'Staff not found' },
        { status: 404 }
      );
    }

    // Get form submission data
    const submission = staff.submissions.find(s => s.formKey === 'support_worker');
    const formData = (submission?.data as any) || {};

    console.log('📊 [PDF API] Staff data:', { 
      id: staff.id, 
      name: `${staff.firstName} ${staff.surname}`,
      hasSubmission: !!submission 
    });

    // Encode images to base64
    const images = {
      fullLogo: await encodeImageToBase64('/client_full_logo.jpg'),
    };

    // Get staff-specific app settings for footer (website, form ID, review date)
    const settings = await getStaffSettingsForForm(staffId, 'support_worker');

    console.log('⚙️ [PDF API] Staff settings for Support Worker Position Description:', settings);

    // Format signature date properly
    let signatureDate = null;
    if (submission?.staffSignedAt) {
      // Convert Date to ISO string if it's a Date object
      signatureDate = submission.staffSignedAt instanceof Date 
        ? submission.staffSignedAt.toISOString()
        : submission.staffSignedAt;
    }

    console.log('📝 [PDF API] Signature data:', {
      hasSignature: !!submission?.staffSignature,
      signatureDate: signatureDate,
      staffSignedAt: submission?.staffSignedAt
    });

    // Create PDF component props
    const pdfProps = {
      data: {
        ...formData,
        signature: submission?.staffSignature || null,
        signatureDate: signatureDate,
      },
      staff: {
        firstName: staff.firstName,
        surname: staff.surname,
        email: staff.email,
        phone: staff.phone
      },
      settings,
      images,
      showBlankAcknowledgement: showBlank
    };

    console.log('🎨 [PDF API] ========== PDF GENERATION START ==========');
    console.log('📦 [PDF API] Component Import Check:');
    console.log('  - SupportWorkerPDF component:', typeof SupportWorkerPDF);
    console.log('  - Component path: @/components-server/PrintableForms/staff/support-worker/page');
    console.log('  - Is React Component:', typeof SupportWorkerPDF === 'function');
    
    console.log('🔧 [PDF API] React-PDF Library Check:');
    console.log('  - renderToBuffer function:', typeof renderToBuffer);
    console.log('  - React library:', typeof React);
    
    console.log('📋 [PDF API] PDF Props being passed:');
    console.log('  - Has data:', !!pdfProps.data);
    console.log('  - Has staff:', !!pdfProps.staff);
    console.log('  - Has settings:', !!pdfProps.settings);
    console.log('  - Has images:', !!pdfProps.images);
    console.log('  - Show blank:', pdfProps.showBlankAcknowledgement);
    
    console.log('🏗️ [PDF API] Creating React element with SupportWorkerPDF component...');
    
    // Generate PDF
    const pdfDoc = React.createElement(SupportWorkerPDF, pdfProps);
    
    console.log('✅ [PDF API] React element created:', {
      type: pdfDoc?.type?.name || pdfDoc?.type || 'Unknown',
      props: Object.keys(pdfDoc?.props || {}),
    });
    
    console.log('⚙️ [PDF API] Calling renderToBuffer from @react-pdf/renderer...');
    console.log('  - This is the React-PDF function that generates the actual PDF buffer');
    
    const pdfBuffer = await renderToBuffer(pdfDoc as any);
    
    console.log('📊 [PDF API] PDF Buffer Generated:');
    console.log('  - Buffer type:', Buffer.isBuffer(pdfBuffer) ? 'Buffer' : typeof pdfBuffer);
    console.log('  - Buffer size:', pdfBuffer.length, 'bytes');
    console.log('  - Buffer first 4 bytes (PDF magic):', pdfBuffer.slice(0, 4).toString());
    
    // Check if it's actually a PDF (PDF files start with %PDF)
    const isPDF = pdfBuffer.slice(0, 4).toString() === '%PDF';
    console.log('  - Is valid PDF:', isPDF ? '✅ YES' : '❌ NO');
    
    if (!isPDF) {
      console.error('⚠️ [PDF API] WARNING: Buffer does not appear to be a valid PDF!');
      console.error('  - First 100 bytes:', pdfBuffer.slice(0, 100).toString());
    }
    
    console.log('📤 [PDF API] Returning PDF buffer as NextResponse...');
    console.log('✅ [PDF API] ========== PDF GENERATION COMPLETE ==========');

    // Return PDF as inline (for iframe viewing in admin)
    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Position_Description_${staff.firstName}_${staff.surname}.pdf"`,
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

