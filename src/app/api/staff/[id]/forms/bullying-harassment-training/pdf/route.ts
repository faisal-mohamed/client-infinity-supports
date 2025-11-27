import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import BullyingHarassmentTrainingPDF from '@/components-server/PrintableForms/staff/bullying-harassment-training/page';
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
    const mergeWithFramework = searchParams.get('merge') === 'true'; // Only merge if explicitly requested

    console.log('📥 [Bullying Harassment Training PDF API] Starting PDF generation');
    console.log('  - Staff ID:', staffId);
    console.log('  - Show Blank:', showBlank);
    console.log('  - Merge with Training PDF:', mergeWithFramework);

    // Fetch staff data
    const db: any = prisma as any;
    const staff = await db.staff.findUnique({
      where: { id: staffId },
      select: { id: true, firstName: true, surname: true, email: true },
    });

    if (!staff) {
      console.error('❌ [Bullying Harassment Training PDF API] Staff not found:', staffId);
      return NextResponse.json(
        { 
          error: 'Staff not found',
          message: 'The staff member could not be found. Please verify the staff ID.',
          details: `Staff ID: ${staffId}`
        },
        { status: 404 }
      );
    }

    // Get form submission data - check both StaffFormSubmission table and dedicated table
    const submission = await db.staffFormSubmission.findFirst({
      where: {
        staffId: staffId,
        formKey: 'bullying_harassment_training'
      }
    });

    // Also check dedicated table
    const bullyingHarassmentTraining = await db.staffBullyingHarassmentTraining.findUnique({
      where: { staffId }
    });

    // Merge data from both sources
    const submissionData = submission?.data || {};
    const dedicatedTableData = (bullyingHarassmentTraining?.data as any) || {};
    
    // Helper to convert Date object to YYYY-MM-DD string (preserves date without timezone shift)
    const dateToDateString = (date: Date | null | undefined): string | undefined => {
      if (!date) return undefined;
      const d = new Date(date);
      if (isNaN(d.getTime())) return undefined;
      // Use UTC methods to avoid timezone issues - extract the date part as stored
      const year = d.getUTCFullYear();
      const month = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Merge form data - dedicated table takes priority
    const formData = {
      ...submissionData,
      ...dedicatedTableData,
      // Handle signature fields - prefer dedicated table top-level fields, fallback to submission
      signature: bullyingHarassmentTraining?.staffSignature || submission?.staffSignature || dedicatedTableData?.signature || submissionData?.signature,
      // Convert Date objects to YYYY-MM-DD format to avoid timezone issues
      date: bullyingHarassmentTraining?.staffSignedAt 
        ? dateToDateString(bullyingHarassmentTraining.staffSignedAt) 
        : (submission?.staffSignedAt 
          ? dateToDateString(submission.staffSignedAt) 
          : (dedicatedTableData?.date || submissionData?.date)),
      staffSignature: bullyingHarassmentTraining?.staffSignature || submission?.staffSignature,
      staffSignedAt: bullyingHarassmentTraining?.staffSignedAt || submission?.staffSignedAt,
    };

    console.log('📊 [PDF API] Staff data:', { 
      id: staff.id, 
      name: `${staff.firstName} ${staff.surname}`,
      hasSubmission: !!submission,
      hasDedicatedRecord: !!bullyingHarassmentTraining,
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
    const pdfDoc = React.createElement(BullyingHarassmentTrainingPDF as any, pdfProps);
    // @ts-ignore - renderToBuffer type definition may be strict
    const pdfBuffer = await renderToBuffer(pdfDoc);

    console.log('✅ [Bullying Harassment Training PDF API] Acknowledgement form PDF generated successfully');
    console.log('  - PDF Size:', pdfBuffer.length, 'bytes');
    console.log('  - Pages: 1 (acknowledgement form only)');

    // If mergeWithFramework is true, merge with the static framework PDF
    // NOTE: By default, we return ONLY the acknowledgement form PDF (not merged)
    let finalPdfBuffer = pdfBuffer;
    if (mergeWithFramework && !showBlank) {
      try {
        console.log('📄 [Bullying Harassment Training PDF API] Merging with training PDF (merge=true requested)...');
        
        // Read the static training PDF
        const trainingPdfPath = path.join(process.cwd(), 'public', 'stafForms', 'Bullying and Harassment Training 2023.pdf');
        
        if (!fs.existsSync(trainingPdfPath)) {
          console.warn('⚠️ [Bullying Harassment Training PDF API] Training PDF not found at:', trainingPdfPath);
          console.log('  - Returning acknowledgement form PDF only');
        } else {
          const trainingPdfBytes = fs.readFileSync(trainingPdfPath);
          console.log('  - Training PDF loaded, size:', trainingPdfBytes.length, 'bytes');
          
          // Create a new PDF document
          const mergedPdf = await PDFDocument.create();
          
          // Load the training PDF
          const trainingPdf = await PDFDocument.load(trainingPdfBytes);
          const trainingPages = await mergedPdf.copyPages(trainingPdf, trainingPdf.getPageIndices());
          trainingPages.forEach((page: any) => {
            mergedPdf.addPage(page);
          });
          console.log('  - Training PDF pages added:', trainingPages.length);
          
          // Load the acknowledgement PDF
          const acknowledgementPdf = await PDFDocument.load(pdfBuffer);
          const acknowledgementPages = await mergedPdf.copyPages(acknowledgementPdf, acknowledgementPdf.getPageIndices());
          acknowledgementPages.forEach((page: any) => {
            mergedPdf.addPage(page);
          });
          console.log('  - Acknowledgement form pages added:', acknowledgementPages.length);
          
          // Generate the merged PDF
          finalPdfBuffer = Buffer.from(await mergedPdf.save());
          console.log('✅ [Bullying Harassment Training PDF API] PDFs merged successfully');
          console.log('  - Final merged PDF size:', finalPdfBuffer.length, 'bytes');
          console.log('  - Total pages:', trainingPages.length + acknowledgementPages.length);
        }
      } catch (mergeError) {
        console.error('❌ [Bullying Harassment Training PDF API] Error merging PDFs:', mergeError);
        console.log('⚠️ [Bullying Harassment Training PDF API] Falling back to acknowledgement PDF only');
        // Fall back to just the acknowledgement PDF if merge fails
      }
    } else {
      console.log('ℹ️ [Bullying Harassment Training PDF API] Returning acknowledgement form PDF only (no merge)');
      console.log('  - To merge with training PDF, add ?merge=true to the URL');
    }

    // Return PDF as inline (for iframe viewing in admin) or attachment (for download)
    const download = searchParams.get('download') === 'true';
    const contentDisposition = download ? 'attachment' : 'inline';
    
    console.log('📤 [Bullying Harassment Training PDF API] Returning PDF');
    console.log('  - Content Disposition:', contentDisposition);
    console.log('  - Filename: Bullying_Harassment_Training_Acknowledgement_' + staff.firstName + '_' + staff.surname + '.pdf');
    
    return new NextResponse(finalPdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${contentDisposition}; filename="Bullying_Harassment_Training_Acknowledgement_${staff.firstName}_${staff.surname}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error('❌ [Bullying Harassment Training PDF API] Error generating PDF:', error);
    console.error('  - Error message:', error.message);
    console.error('  - Error stack:', error.stack);
    
    // Provide user-friendly error messages
    let errorMessage = 'Failed to generate PDF';
    let errorDetails = error.message || 'An unexpected error occurred';
    
    if (error.message?.includes('prisma') || error.message?.includes('database')) {
      errorMessage = 'Database error occurred';
      errorDetails = 'Unable to retrieve form data from database. Please try again or contact support.';
    } else if (error.message?.includes('render') || error.message?.includes('PDF')) {
      errorMessage = 'PDF generation error';
      errorDetails = 'Failed to generate the PDF document. Please try again or contact support.';
    } else if (error.message?.includes('not found') || error.message?.includes('missing')) {
      errorMessage = 'Required data not found';
      errorDetails = 'Some required form data is missing. Please ensure the form has been submitted.';
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        message: errorDetails,
        details: error.message
      },
      { status: 500 }
    );
  }
}





