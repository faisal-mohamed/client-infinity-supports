

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

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
          const requiredSignatures = signatures;
          
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
               if (updatedData.signature) {
                console.log(`🗑️ Clearing designation field from ${formKey}`);
                updatedData.signature = null;
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

            case 'schedule_of_supports':
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
              if (updatedData.representativeSignature) {
                console.log(`🗑️ Clearing providerName field from ${formKey}`);
                updatedData.representativeSignature = null;
              }
              if (updatedData.representativeSignatureDate) {
                console.log(`🗑️ Clearing providerSignatureDate field from ${formKey}`);
                updatedData.representativeSignatureDate = null;
              }
                if (updatedData.representativeName) {
                console.log(`🗑️ Clearing providerSignatureDate field from ${formKey}`);
                updatedData.representativeName = null;
              }
              break;

            case 'participant_risk_assessment':
              if (updatedData.signature) {
                console.log(`🗑️ Clearing designation field from ${formKey}`);
                updatedData.signature = null;
              }
               if (updatedData.signatureDate) {
                console.log(`🗑️ Clearing designation field from ${formKey}`);
                updatedData.signatureDate = null;
              }
              if (updatedData.guardianSignature) {
                console.log(`🗑️ Clearing designation field from ${formKey}`);
                updatedData.guardianSignature = null;
              }
               if (updatedData.guardianDate) {
                console.log(`🗑️ Clearing designation field from ${formKey}`);
                updatedData.guardianDate = null;
              }

              
              break;

            case 'emergency_drill': 
             if (updatedData?.supportWorkerSignature) {
                console.log(`🗑️ Clearing designation field from ${formKey}`);
                updatedData.supportWorkerSignature = null;
              }
               if (updatedData.signatureDate) {
                console.log(`🗑️ Clearing designation field from ${formKey}`);
                updatedData.signatureDate = null;
              }
              if (updatedData.supervisorSignature) {
                console.log(`🗑️ Clearing designation field from ${formKey}`);
                updatedData.supervisorSignature = null;
              }
               if (updatedData?.supervisorSignatureDate) {
                console.log(`🗑️ Clearing designation field from ${formKey}`);
                updatedData.supervisorSignatureDate = null;
              }
              break;


            case 'individual_risk_assessment': 
              if (updatedData?.assessorSignature) {
                console.log(`🗑️ Clearing designation field from ${formKey}`);
                updatedData.assessorSignature = null;
              }
               if (updatedData.assessorSignatureDate) {
                console.log(`🗑️ Clearing designation field from ${formKey}`);
                updatedData.assessorSignatureDate = null;
              }
              if (updatedData.assessorName) {
                console.log(`🗑️ Clearing designation field from ${formKey}`);
                updatedData.assessorName = null;
              }

            break;


            case 'welcome_form': 
            if (updatedData?.signature) {
                console.log(`🗑️ Clearing designation field from ${formKey}`);
                updatedData.signature = null;
              }
               if (updatedData.date) {
                console.log(`🗑️ Clearing designation field from ${formKey}`);
                updatedData.date = null;
              }

              break;

            case 'support_action_plan': 
            if (updatedData?.authorSignature) {
                console.log(`🗑️ Clearing designation field from ${formKey}`);
                updatedData.authorSignature = null;
              }
               if (updatedData.authorDate) {
                console.log(`🗑️ Clearing designation field from ${formKey}`);
                updatedData.authorDate = null;
              }
              if (updatedData.participantSignature) {
                console.log(`🗑️ Clearing designation field from ${formKey}`);
                updatedData.participantSignature = null;
              }
              if (updatedData.participantDate) {
                console.log(`🗑️ Clearing designation field from ${formKey}`);
                updatedData.participantDate = null;
              }


              break;


            default:
              console.log(`ℹ️ No specific data clearing rules defined for form: ${formKey}`);
              break;
          }
          
          // Update the submission

          console.log("----------UPDATED DATA: ", updatedData);
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

    // Get admin session for audit trail
    const session = await getServerSession(authOptions);
    const adminId = session?.user?.id ? parseInt(session.user.id) : null;

    // Check if client exists and is not already archived
    const existingClient = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!existingClient) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    if (existingClient.archivedAt) {
      return NextResponse.json(
        { error: "Client is already archived" },
        { status: 409 }
      );
    }

    // Soft delete: set archivedAt timestamp
    await prisma.client.update({
      where: { id: clientId },
      data: {
        archivedAt: new Date(),
        archivedBy: adminId,
      },
    });

    console.log(`📦 Client ${clientId} archived by admin ${adminId}`);

    return NextResponse.json({ 
      success: true, 
      message: "Client and all related data deleted successfully" 
    });
  } catch (error: any) {
    console.error("Error archiving client:", error);

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

