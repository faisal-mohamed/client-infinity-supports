import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getStaffSettingsForForm } from '@/lib/settings-server';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import ConflictOfInterestPDF from '@/components-server/PrintableForms/staff/conflict-of-interest/page';
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

    console.log('📥 [PDF API] Generating Conflict of Interest PDF for staff:', staffId);

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

    // Get form submission data
    const submission = await db.staffFormSubmission.findFirst({
      where: {
        staffId: staffId,
        formKey: 'conflict_of_interest'
      }
    });

    const submissionData = submission?.data || {};
    
    // Merge form data - include signature from top-level field if available
    const formData = {
      ...submissionData,
      // Handle signature fields - prefer top-level staffSignature, fallback to data.employeeSignature
      employeeSignature: submission?.staffSignature || submissionData?.employeeSignature || '',
      employeeDate: submission?.staffSignedAt 
        ? new Date(submission.staffSignedAt).toISOString().split('T')[0]
        : (submissionData?.employeeDate || ''),
      // Include HR section data if available
      reviewedBy: submissionData?.reviewedBy || '',
      reviewerTitle: submissionData?.reviewerTitle || '',
      reviewDate: submissionData?.reviewDate || '',
      actionTaken: submissionData?.actionTaken || '',
      hrDecision: submissionData?.hrDecision || '',
      reviewerSignature: submission?.adminSignature || submissionData?.reviewerSignature || '',
      reviewerDate: submission?.adminSignedAt 
        ? new Date(submission.adminSignedAt).toISOString().split('T')[0]
        : (submissionData?.reviewerDate || ''),
    };

    console.log('📊 [PDF API] Staff data:', { 
      id: staff.id, 
      name: `${staff.firstName} ${staff.surname}`,
      hasSubmission: !!submission,
      hasEmployeeSignature: !!formData.employeeSignature,
      hasReviewerSignature: !!formData.reviewerSignature,
      dataKeys: Object.keys(formData),
      // Debug checkbox values
      hasConflict: formData.hasConflict,
      hasVendorRelationship: formData.hasVendorRelationship,
      hasOutsideEmployment: formData.hasOutsideEmployment,
      hrDecision: formData.hrDecision,
    });

    // Encode images to base64
    const images = {
      infinityLogo: await encodeImageToBase64('/infinity_logo.png'),
    };

    // Get staff-specific app settings for footer
    const settings = await getStaffSettingsForForm(staffId, 'conflict_of_interest');

    console.log('🔍 [PDF API] Staff settings for Conflict of Interest:', {
      staffId,
      adminId: (await prisma.staff.findUnique({ where: { id: staffId }, select: { createdById: true } }))?.createdById,
      settingsKeys: Object.keys(settings),
      website: settings?.website || settings?.company_website,
      formId: settings?.conflict_of_interest_form_id,
      reviewDate: settings?.conflict_of_interest_review_date || settings?.review_date,
      hasInfinityLogo: !!images.infinityLogo,
    });

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
    const pdfDoc = React.createElement(ConflictOfInterestPDF, pdfProps);
    const pdfBuffer = await renderToBuffer(pdfDoc as any);

    console.log('✅ [PDF API] PDF generated successfully, size:', pdfBuffer.length, 'bytes');

    // Return PDF as inline (for iframe viewing in admin)
    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Conflict_of_Interest_${staff.firstName}_${staff.surname}.pdf"`,
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

