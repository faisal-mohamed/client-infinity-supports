import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import SupportWorkerPDF from '@/components-server/PrintableForms/staff/support-worker/page';
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
    
    // Check if we should show blank acknowledgement form (for staff download)
    const { searchParams } = new URL(req.url);
    const showBlank = searchParams.get('blank') === 'true';

    console.log('📥 [PDF API] Generating Support Worker PDF for staff:', staffId, '| Blank page 4:', showBlank);

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
    const formData = submission?.data || {};

    console.log('📊 [PDF API] Staff data:', { 
      id: staff.id, 
      name: `${staff.firstName} ${staff.surname}`,
      hasSubmission: !!submission 
    });

    // Encode images to base64
    const images = {
      fullLogo: await encodeImageToBase64('/client_full_logo.jpg'),
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
      data: {
        ...formData,
        signature: submission?.staffSignature,
        signatureDate: submission?.staffSignedAt,
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

    console.log('🎨 [PDF API] Creating PDF document...');

    // Generate PDF
    const pdfDoc = React.createElement(SupportWorkerPDF, pdfProps);
    const pdfBuffer = await renderToBuffer(pdfDoc);

    console.log('✅ [PDF API] PDF generated successfully, size:', pdfBuffer.length, 'bytes');

    // Return PDF as inline (for iframe viewing in admin)
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Support_Worker_${staff.firstName}_${staff.surname}.pdf"`,
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

