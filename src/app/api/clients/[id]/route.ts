

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const clientId = parseInt(id || "0");

    if (clientId === 0) {
      return NextResponse.json(
        { error: "Invalid client ID" },
        { status: 400 }
      );
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        commonFields: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(client);
  } catch (error: any) {
    console.error("Error fetching client:", error);
    return NextResponse.json(
      { error: "Failed to fetch client", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const clientId = parseInt(id || "0");

    if (clientId === 0) {
      return NextResponse.json(
        { error: "Invalid client ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, email, phone, commonFields } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Update client
    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data: {
        name,
        email,
        phone,
      },
      include: {
        commonFields: true,
      },
    });

    // Update or create common fields if provided
    if (commonFields) {
      const existingCommonFields = await prisma.commonField.findUnique({
        where: { clientId },
      });

      if (existingCommonFields) {
        // Update existing common fields
        await prisma.commonField.update({
          where: { clientId },
          data: {
            ...commonFields,
            updatedAt: new Date(),
          },
        });
      } else {
        // Create new common fields
        await prisma.commonField.create({
          data: {
            clientId,
            ...commonFields,
          },
        });
      }

      // 🎯 CLEAR SIGNATURES WHEN COMMON FIELDS ARE UPDATED
      console.log(`🔄 Common fields updated for client ${clientId}, clearing signatures...`);
      
      // Import the registry function
      const { getFormConfig } = await import("@/app/forms/registry");
      
      // Clear signatures from all forms for this client
      const formSubmissions : any = await prisma.formSubmission.findMany({
        where: { clientId },
        include: { form: true }
      });

      console.log(`📋 Found ${formSubmissions.length} form submissions to check for signatures`);

      // Track forms that had signatures cleared
      const clearedFormsWithSignatures = [];
      const statusUpdatedAssignments = [];

      for (const submission of formSubmissions) {
        const formConfig = getFormConfig(submission.form.formKey);
        const signatures = formConfig?.signatures || [];
        
        if (signatures.length > 0) {
          // This form requires signatures
          const requiredSignatures = signatures.filter(sig => sig.required);
          
          // Clear signature data from form data
          const updatedData = { ...submission.data };
          let hadSignatures = false;
          
          signatures.forEach(sig => {
            const dataKey = sig.dataKey || sig.id;
            if (updatedData[dataKey]) {
              console.log(`🗑️ Clearing signature field: ${dataKey} from form ${submission.form.formKey}`);
              updatedData[dataKey] = null;
              hadSignatures = true;
            }
          });

          // 🎯 FORM-SPECIFIC DATA CLEARING LOGIC
          const formKey = submission.form.formKey;
          console.log(`🔄 Applying form-specific data clearing for: ${formKey}`);
          
          switch (formKey) {
            case 'home_visit_risk_assessment':
              // Clear specific fields for home visit risk assessment
              if (updatedData.designation) {
                console.log(`🗑️ Clearing designation field from ${formKey}`);
                updatedData.designation = null;
              }
              // Add any other specific fields to clear for this form
              break;

            case 'sa_delivery_of_supports':
              // Clear specific fields for SA delivery of supports
              if (updatedData.participantName) {
                console.log(`🗑️ Clearing participantName field from ${formKey}`);
                updatedData.participantName = null;
              }
              if (updatedData.participantSignatureDate) {
                console.log(`🗑️ Clearing participantSignatureDate field from ${formKey}`);
                updatedData.participantSignatureDate = null;
              }
              if (updatedData.nomineeName) {
                console.log(`🗑️ Clearing nomineeName field from ${formKey}`);
                updatedData.nomineeName = null;
              }
              if (updatedData.nomineeSignatureDate) {
                console.log(`🗑️ Clearing nomineeSignatureDate field from ${formKey}`);
                updatedData.nomineeSignatureDate = null;
              }
              if (updatedData.providerName) {
                console.log(`🗑️ Clearing providerName field from ${formKey}`);
                updatedData.providerName = null;
              }
              if (updatedData.providerSignatureDate) {
                console.log(`🗑️ Clearing providerSignatureDate field from ${formKey}`);
                updatedData.providerSignatureDate = null;
              }
              // Add any other specific fields to clear for this form
              break;

            case 'person_centred_plan':
              // Clear specific fields for person centred plan
              // Add fields specific to this form that should be cleared
              break;

            case 'client_intake_form':
              // Clear specific fields for client intake form
              // Add fields specific to this form that should be cleared
              break;

            default:
              console.log(`ℹ️ No specific data clearing rules defined for form: ${formKey}`);
              break;
          }
          
          // Update the submission
          await prisma.formSubmission.update({
            where: { id: submission.id },
            data: {
              data: updatedData,
              clientSignature: null,
              clientSignedAt: null
            }
          });

          // Update FormAssignment status to in_progress
          const formAssignment = await prisma.formAssignment.findFirst({
            where: {
              clientId: clientId,
              formId: submission.formId,
              formVersion: submission.formVersion
            }
          });

          if (formAssignment && requiredSignatures.length > 0) {
            await prisma.formAssignment.update({
              where: { id: formAssignment.id },
              data: {
                currentStatus: "in_progress",
                isCompleted: false
              }
            });

            statusUpdatedAssignments.push({
              assignmentId: formAssignment.id,
              formTitle: submission.form.title,
              formKey: submission.form.formKey,
              requiredSignatures: requiredSignatures.length
            });

            console.log(`🎯 Updated FormAssignment ${formAssignment.id} status to "in_progress" (signatures cleared)`);
          }

          clearedFormsWithSignatures.push({
            formId: submission.formId,
            formKey: submission.form.formKey,
            formTitle: submission.form.title,
            formVersion: submission.formVersion,
            requiredSignatures: requiredSignatures.length,
            hadSignatures: hadSignatures
          });
        }
      }

      console.log(`✅ Cleared signatures from ${clearedFormsWithSignatures.length} forms with signatures`);
      console.log(`📊 Updated ${statusUpdatedAssignments.length} form assignments to in_progress status`);
    }

    // Get the updated client with common fields
    const clientWithCommonFields = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        commonFields: true,
      },
    });

    return NextResponse.json(clientWithCommonFields);
  } catch (error: any) {
    console.error("Error updating client:", error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update client", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const clientId = parseInt(id || "0");

    if (clientId === 0) {
      return NextResponse.json(
        { error: "Invalid client ID" },
        { status: 400 }
      );
    }

    // Check if client exists before attempting to delete
    const existingClient = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!existingClient) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    // Start a transaction to delete client and related data
    await prisma.$transaction(async (tx) => {
      console.log(`🗑️ Starting client deletion for ID: ${clientId}`);
      
      // Step 1: Get all batches for this client
      const batches = await tx.formBatch.findMany({
        where: { clientId },
        select: { id: true }
      });
      
      const batchIds = batches.map(batch => batch.id);
      console.log(`📦 Found ${batches.length} batches to delete:`, batchIds);
      
      // Step 2: Delete SignatureBatchForm records first (they reference batches)
      if (batchIds.length > 0) {
        console.log(`🗑️ Deleting SignatureBatchForm records for batches...`);
        await tx.signatureBatchForm.deleteMany({
          where: { batchId: { in: batchIds } },
        });
      }
      
      // Step 3: Delete form assignments linked to batches
      if (batchIds.length > 0) {
        console.log(`🗑️ Deleting FormAssignment records for batches...`);
        await tx.formAssignment.deleteMany({
          where: { batchId: { in: batchIds } },
        });
      }
      
      // Step 4: Delete the batches (now safe to delete)
      console.log(`🗑️ Deleting FormBatch records...`);
      await tx.formBatch.deleteMany({
        where: { clientId },
      });
      
      // Step 5: Delete remaining form assignments not linked to batches
      console.log(`🗑️ Deleting remaining FormAssignment records...`);
      await tx.formAssignment.deleteMany({
        where: { clientId },
      });

      // Step 6: Delete form submission notifications
      console.log(`🗑️ Deleting FormSubmissionNotification records...`);
      await tx.formSubmissionNotification.deleteMany({
        where: { clientId },
      });

      // Step 7: Delete common fields
      console.log(`🗑️ Deleting CommonField records...`);
      await tx.commonField.deleteMany({
        where: { clientId },
      });

      // Step 8: Delete form submissions
      console.log(`🗑️ Deleting FormSubmission records...`);
      await tx.formSubmission.deleteMany({
        where: { clientId },
      });

      // Step 9: Delete form progress
      console.log(`🗑️ Deleting FormProgress records...`);
      await tx.formProgress.deleteMany({
        where: { clientId },
      });

      // Step 10: Delete insights
      console.log(`🗑️ Deleting Insight records...`);
      await tx.insight.deleteMany({
        where: { clientId },
      });

      // Step 11: Delete activity logs
      console.log(`🗑️ Deleting FormActivityLog records...`);
      await tx.formActivityLog.deleteMany({
        where: { clientId },
      });

      // Step 12: Finally, delete the client
      console.log(`🗑️ Deleting Client record...`);
      await tx.client.delete({
        where: { id: clientId },
      });
      
      console.log(`✅ Client ${clientId} and all related data deleted successfully`);
    });

    return NextResponse.json({ 
      success: true, 
      message: "Client and all related data deleted successfully" 
    });
  } catch (error: any) {
    console.error("Error deleting client:", error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete client", details: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/clients/[id]/form-batches/[batchId] - Update batch expiry
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; batchId: string }> }
) {
  try {
    const { id, batchId } = await params;
    // const clientId = parseInt(id || "0");
    // const batchId = parseInt(batchId || "0");
    const clientId = parseInt(id || "0");
    const batchIdInt = parseInt(batchId || "0");
    const body = await req.json();
    const { expiresAt } = body;

    if (!expiresAt) {
      return NextResponse.json(
        { error: "Missing required field: expiresAt" },
        { status: 400 }
      );
    }

    const newExpiresAt = new Date(expiresAt);
    if (isNaN(newExpiresAt.getTime()) || newExpiresAt < new Date()) {
      return NextResponse.json(
        { error: "Invalid or past expiresAt date" },
        { status: 400 }
      );
    }

    // Update the FormBatch's expiresAt
    const updatedBatch = await prisma.formBatch.updateMany({
      where: {
        id: batchIdInt,
        clientId: clientId,
      },
      data: {
        expiresAt: newExpiresAt,
      },
    });

    if (updatedBatch.count === 0) {
      return NextResponse.json(
        { error: "Form batch not found" },
        { status: 404 }
      );
    }

    // Optionally, fetch and return the updated batch
    const batch = await prisma.formBatch.findUnique({
      where: { id: batchIdInt },
    });

    return NextResponse.json({ success: true, batch });
  } catch (error: any) {
    console.error("Error updating form batch expiry:", error);
    return NextResponse.json(
      { error: "Failed to update form batch expiry", details: error.message },
      { status: 500 }
    );
  }
}

