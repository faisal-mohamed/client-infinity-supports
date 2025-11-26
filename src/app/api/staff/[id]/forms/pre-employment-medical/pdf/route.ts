import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import PreEmploymentMedicalPDF from '@/components-server/PrintableForms/staff/pre-employment-medical/page';
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

    console.log('📥 [PDF API] Generating Pre-Employment Medical PDF for staff:', staffId);

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
        formKey: 'pre_employment_medical'
      }
    });

    // Also check dedicated table
    const preEmploymentMedical = await db.staffPreEmploymentMedical.findUnique({
      where: { staffId }
    });

    // Merge data from both sources
    // Priority: dedicated table data, then submission data
    const submissionData = submission?.data || {};
    const dedicatedTableData = (preEmploymentMedical?.data as any) || {};
    
    // Merge form data - dedicated table takes priority
    const formData = {
      ...submissionData,
      ...dedicatedTableData,
      // Handle signature fields - prefer dedicated table top-level fields, fallback to submission
      signature: preEmploymentMedical?.staffSignature || submission?.staffSignature || dedicatedTableData?.signature || submissionData?.signature,
      signatureDate: preEmploymentMedical?.staffSignedAt ? new Date(preEmploymentMedical.staffSignedAt).toISOString() : (submission?.staffSignedAt ? new Date(submission.staffSignedAt).toISOString() : dedicatedTableData?.signatureDate || submissionData?.signatureDate),
      // Declaration signature - check both dedicated table and submission data
      declarationSignature: dedicatedTableData?.declarationSignature || submissionData?.declarationSignature,
      declarationDate: dedicatedTableData?.declarationDate || submissionData?.declarationDate,
    };

    console.log('📊 [PDF API] Staff data:', { 
      id: staff.id, 
      name: `${staff.firstName} ${staff.surname}`,
      hasSubmission: !!submission,
      hasDedicatedRecord: !!preEmploymentMedical,
      submissionDataKeys: Object.keys(submissionData),
      dedicatedDataKeys: Object.keys(dedicatedTableData)
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
    };

    console.log('🎨 [PDF API] Creating PDF document with dynamic content...');

    // Generate PDF
    const pdfDoc = React.createElement(PreEmploymentMedicalPDF, pdfProps);
    const pdfBuffer = await renderToBuffer(pdfDoc);

    console.log('✅ [PDF API] PDF generated successfully, size:', pdfBuffer.length, 'bytes');

    // Check if request wants to download or view inline
    const { searchParams } = new URL(req.url);
    const download = searchParams.get('download') === 'true';

    const filename = `Pre_Employment_Medical_${staff.firstName}_${staff.surname}.pdf`;

    // Return PDF as inline (for viewing) or attachment (for download)
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': download 
          ? `attachment; filename="${filename}"` 
          : `inline; filename="${filename}"`,
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

