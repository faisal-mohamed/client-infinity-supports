import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // Find the staff signature batch
    const batch = await prisma.staffFormBatch.findUnique({
      where: { 
        batchToken: token,
        isSignatureOnly: true, // Ensure this is a signature-only batch
      },
      include: {
        staff: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            email: true,
          },
        },
        signatureForms: {
          include: {
            formSubmission: {
              include: {
                form: {
                  select: {
                    id: true, // Include form ID for PDF generation
                    formKey: true,
                    title: true,
                    version: true,
                    requiresSignature: true, // Include signature requirement
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'asc', // Maintain consistent order
          },
        },
      },
    });

    if (!batch) {
      return NextResponse.json(
        { error: "Signature link not found" },
        { status: 404 }
      );
    }

    // Check if batch has expired
    if (batch.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "This signature link has expired" },
        { status: 410 } // Gone
      );
    }

    // Separate forms by signature requirement
    // IMPORTANT: Forms with requiresSignature === true should be counted
    // NOTE: fair_work_information has an acknowledgement form with signature, so it should ALWAYS be counted
    const formsRequiringSignature = batch.signatureForms.filter(
      (sf: any) => {
        const formKey = sf.formSubmission.form.formKey;
        const requiresSig = sf.formSubmission.form.requiresSignature === true;
        
        // Fairwork Information has an acknowledgement form with signature - always count it
        if (formKey === 'fair_work_information') {
          return true; // Always include in signature-requiring forms
        }
        
        return requiresSig;
      }
    );
    
    const formsNotRequiringSignature = batch.signatureForms.filter(
      (sf: any) => {
        const formKey = sf.formSubmission.form.formKey;
        
        // Fairwork Information should NOT be in the non-signature-requiring list
        if (formKey === 'fair_work_information') {
          return false; // Always exclude from non-signature-requiring forms
        }
        
        return sf.formSubmission.form.requiresSignature !== true;
      }
    );
    
    // LOG: Which forms require signature and which don't
    console.log(`\n📋 [Signature Portal API] Form Signature Requirements:`);
    batch.signatureForms.forEach((sf: any) => {
      const formKey = sf.formSubmission.form.formKey;
      const dbRequiresSig = sf.formSubmission.form.requiresSignature;
      const isInRequiringList = formsRequiringSignature.some(f => f.formSubmission.form.formKey === formKey);
      const isInNotRequiringList = formsNotRequiringSignature.some(f => f.formSubmission.form.formKey === formKey);
      
      console.log(`  - ${formKey}:`);
      console.log(`    Database requiresSignature: ${dbRequiresSig}`);
      console.log(`    In Requiring Signature list: ${isInRequiringList}`);
      console.log(`    In NOT Requiring Signature list: ${isInNotRequiringList}`);
      if (formKey === 'fair_work_information') {
        console.log(`    ✅ NOTE: This is an acknowledgement form with signature - ALWAYS counted as requiring signature`);
      }
    });
    console.log(`  Total: ${batch.signatureForms.length} forms`);
    console.log(`  Requiring Signature: ${formsRequiringSignature.length} forms`);
    console.log(`  Not Requiring Signature: ${formsNotRequiringSignature.length} forms\n`);

    // Calculate completion status (check staffSignature column AND form-specific signature fields in data)
    const signedForms = formsRequiringSignature.filter((sf: any) => {
      const submission = sf.formSubmission;
      const formKey = submission.form.formKey;
      const data = submission.data || {};
      
      console.log(`\n🔍 [Signature Check] ${formKey} (REQUIRES SIGNATURE):`);
      console.log(`  - staffSignature column: ${submission.staffSignature ? 'EXISTS' : 'NULL/EMPTY'}`);
      console.log(`  - staffSignedAt: ${submission.staffSignedAt || 'NULL'}`);
      
      // Check staffSignature column first
      if (submission.staffSignature !== null && submission.staffSignature !== undefined && submission.staffSignature !== "") {
        console.log(`  ✅ SIGNED (via staffSignature column)`);
        return true;
      }
      
      // Check form-specific signature fields in data JSON
      // Fairwork Information - uses signature (primary) or staffSignature (alias)
      if (formKey === 'fair_work_information') {
        const hasAck = !!(data.signature || data.staffSignature || data.acknowledgementSignature || submission.staffSignature);
        console.log(`  - data.signature: ${!!data.signature}`);
        console.log(`  - data.staffSignature: ${!!data.staffSignature}`);
        console.log(`  - data.acknowledgementSignature: ${!!data.acknowledgementSignature}`);
        console.log(`  - Result: ${hasAck ? '✅ SIGNED' : '❌ NOT SIGNED'}`);
        return hasAck;
      }
      
      // TFN Declaration - uses payeeSignature
      if (formKey === 'govt_tax') {
        const hasPayeeSig = !!(data.payeeSignature || data.staffSignature);
        console.log(`  - data.payeeSignature: ${!!data.payeeSignature}`);
        console.log(`  - data.staffSignature: ${!!data.staffSignature}`);
        console.log(`  - Result: ${hasPayeeSig ? '✅ SIGNED' : '❌ NOT SIGNED'}`);
        return hasPayeeSig;
      }
      
      // Super Choice Form - uses sectionBSignature, sectionCSignature, or sectionDSignature
      if (formKey === 'super_choice_form') {
        const hasSuperSig = !!(data.sectionBSignature || data.sectionCSignature || data.sectionDSignature || data.staffSignature);
        console.log(`  - data.sectionBSignature: ${!!data.sectionBSignature}`);
        console.log(`  - data.sectionCSignature: ${!!data.sectionCSignature}`);
        console.log(`  - data.sectionDSignature: ${!!data.sectionDSignature}`);
        console.log(`  - data.staffSignature: ${!!data.staffSignature}`);
        console.log(`  - Result: ${hasSuperSig ? '✅ SIGNED' : '❌ NOT SIGNED'}`);
        return hasSuperSig;
      }
      
      // For other forms, check staffSignature column or generic signature fields
      const hasGenericSig = !!(data.signature || data.staffSignature);
      console.log(`  - data.signature: ${!!data.signature}`);
      console.log(`  - data.staffSignature: ${!!data.staffSignature}`);
      console.log(`  - Result: ${hasGenericSig ? '✅ SIGNED' : '❌ NOT SIGNED'}`);
      return hasGenericSig;
    });

    // Also check forms that don't require signature but are filled/submitted (like acknowledgement forms)
    const filledFormsNotRequiringSignature = formsNotRequiringSignature.filter((sf: any) => {
      const submission = sf.formSubmission;
      const formKey = submission.form.formKey;
      const data = submission.data || {};
      
      console.log(`\n🔍 [Completion Check] ${formKey} (NO SIGNATURE REQUIRED):`);
      console.log(`  - isSubmitted: ${submission.isSubmitted}`);
      console.log(`  - staffSignature column: ${submission.staffSignature ? 'EXISTS' : 'NULL/EMPTY'}`);
      
      // If form is submitted, consider it completed
      if (submission.isSubmitted === true) {
        console.log(`  ✅ COMPLETED (isSubmitted=true)`);
        return true;
      }
      
      // Check if form has been filled (has data and signature/acknowledgement)
      // Fairwork Information - check for acknowledgement
      if (formKey === 'fair_work_information') {
        const hasAck = !!(data.signature || data.staffSignature || data.acknowledgementSignature || submission.staffSignature);
        const hasName = !!(data.staffName || data.name);
        const hasDate = !!(data.date || data.acknowledgedAt || data.staffSignedAt);
        const hasAcknowledged = !!(data.acknowledged || data.readAcknowledgement || data.fairworkAcknowledged);
        const isFilled = hasAck && hasName && hasDate && hasAcknowledged;
        console.log(`  - data.signature: ${!!data.signature}`);
        console.log(`  - data.staffSignature: ${!!data.staffSignature}`);
        console.log(`  - hasName: ${hasName}`);
        console.log(`  - hasDate: ${hasDate}`);
        console.log(`  - hasAcknowledged: ${hasAcknowledged}`);
        console.log(`  - Result: ${isFilled ? '✅ COMPLETED' : '❌ NOT COMPLETED'}`);
        return isFilled;
      }
      
      // For other forms without signature requirement, check if they have meaningful data
      // If form has staffSignature or is submitted, consider it filled
      if (submission.staffSignature || data.signature || data.staffSignature) {
        console.log(`  ✅ COMPLETED (has signature in data)`);
        return true;
      }
      
      console.log(`  ❌ NOT COMPLETED`);
      return false;
    });

    const totalCompletedForms = signedForms.length + filledFormsNotRequiringSignature.length;
    const totalFormsToComplete = formsRequiringSignature.length + formsNotRequiringSignature.length;

    const completionStatus = {
      totalForms: batch.signatureForms.length,
      formsRequiringSignature: formsRequiringSignature.length,
      formsNotRequiringSignature: formsNotRequiringSignature.length,
      signedForms: signedForms.length,
      filledFormsNotRequiringSignature: filledFormsNotRequiringSignature.length,
      totalCompletedForms: totalCompletedForms,
      isComplete: totalFormsToComplete > 0 && totalCompletedForms === totalFormsToComplete,
    };
    
    // LOG: Final completion status summary
    console.log(`\n📊 [Completion Status Summary]:`);
    console.log(`  Total Forms: ${completionStatus.totalForms}`);
    console.log(`  Forms Requiring Signature: ${completionStatus.formsRequiringSignature}`);
    console.log(`  Forms NOT Requiring Signature: ${completionStatus.formsNotRequiringSignature}`);
    console.log(`  Signed Forms (requiring signature): ${completionStatus.signedForms}`);
    console.log(`  Filled Forms (not requiring signature): ${completionStatus.filledFormsNotRequiringSignature}`);
    console.log(`  Total Completed Forms: ${completionStatus.totalCompletedForms}`);
    console.log(`  Is Complete: ${completionStatus.isComplete}`);
    console.log(`  Progress: ${completionStatus.totalCompletedForms}/${completionStatus.totalForms} forms completed\n`);

    // Format staff name
    const staffName = `${batch.staff.firstName} ${batch.staff.surname}`;

    // Return batch data with enhanced information
    return NextResponse.json({
      id: batch.id,
      batchToken: batch.batchToken,
      expiresAt: batch.expiresAt.toISOString(),
      isCompleted: batch.isCompleted,
      completedAt: batch.completedAt?.toISOString(),
      staff: {
        ...batch.staff,
        name: staffName,
      },
      signatureForms: batch.signatureForms,
      formsRequiringSignature,
      formsNotRequiringSignature,
      completionStatus,
    });

  } catch (error: any) {
    console.error("Error fetching staff signature batch:", error);
    return NextResponse.json(
      { error: "Failed to fetch signature batch", details: error.message },
      { status: 500 }
    );
  }
}

