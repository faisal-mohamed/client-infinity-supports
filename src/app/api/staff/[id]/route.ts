import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const staffId = parseInt(id || "0");

    if (staffId === 0) {
      return NextResponse.json(
        { error: "Invalid staff ID" },
        { status: 400 }
      );
    }

    // Check if staff exists before attempting to delete
    const existingStaff = await prisma.staff.findUnique({
      where: { id: staffId },
    });

    if (!existingStaff) {
      return NextResponse.json(
        { error: "Staff not found" },
        { status: 404 }
      );
    }

    // Start a transaction to delete staff and related data
    await prisma.$transaction(async (tx: any) => {
      console.log(`🗑️ Starting staff deletion for ID: ${staffId}`);
      
      // Step 1: Get all staff batches
      const batches = await tx.staffFormBatch.findMany({
        where: { staffId },
        select: { id: true }
      });
      
      const batchIds = batches.map((batch: any) => batch.id);
      console.log(`📦 Found ${batches.length} batches to delete:`, batchIds);
      
      // Step 2: Delete StaffSignatureBatchForm records first (they reference batches)
      if (batchIds.length > 0) {
        console.log(`🗑️ Deleting StaffSignatureBatchForm records for batches...`);
        await tx.staffSignatureBatchForm.deleteMany({
          where: { batchId: { in: batchIds } },
        });
      }
      
      // Step 3: Delete form assignments linked to batches
      if (batchIds.length > 0) {
        console.log(`🗑️ Deleting StaffFormAssignment records for batches...`);
        await tx.staffFormAssignment.deleteMany({
          where: { batchId: { in: batchIds } },
        });
      }
      
      // Step 4: Delete the batches (now safe to delete)
      console.log(`🗑️ Deleting StaffFormBatch records...`);
      await tx.staffFormBatch.deleteMany({
        where: { staffId },
      });
      
      // Step 5: Delete remaining form assignments not linked to batches
      console.log(`🗑️ Deleting remaining StaffFormAssignment records...`);
      await tx.staffFormAssignment.deleteMany({
        where: { staffId },
      });

      // Step 6: Delete staff submission notifications
      console.log(`🗑️ Deleting StaffSubmissionNotification records...`);
      await tx.staffSubmissionNotification.deleteMany({
        where: { staffId },
      });

      // Step 7: Delete common fields
      console.log(`🗑️ Deleting StaffCommonField records...`);
      await tx.staffCommonField.deleteMany({
        where: { staffId },
      });

      // Step 8: Delete form submissions
      console.log(`🗑️ Deleting StaffFormSubmission records...`);
      await tx.staffFormSubmission.deleteMany({
        where: { staffId },
      });

      // Step 9: Delete form progress
      console.log(`🗑️ Deleting StaffFormProgress records...`);
      await tx.staffFormProgress.deleteMany({
        where: { staffId },
      });

      // Step 10: Delete activity logs
      console.log(`🗑️ Deleting StaffActivityLog records...`);
      await tx.staffActivityLog.deleteMany({
        where: { staffId },
      });

      // Step 11: Delete old dedicated table records (backward compatibility)
      // Delete StaffEmploymentDetails
      await tx.staffEmploymentDetails.deleteMany({
        where: { staffId },
      });

      // Delete StaffEmploymentWelcomeAck
      await tx.staffEmploymentWelcomeAck.deleteMany({
        where: { staffId },
      });

      // Delete StaffSupportWorker
      await tx.staffSupportWorker.deleteMany({
        where: { staffId },
      });

      // Delete StaffPreEmploymentMedical
      await tx.staffPreEmploymentMedical.deleteMany({
        where: { staffId },
      });

      // Delete StaffNdisWorkforceCapability
      await tx.staffNdisWorkforceCapability.deleteMany({
        where: { staffId },
      });

      // Delete StaffBullyingHarassmentTraining
      await tx.staffBullyingHarassmentTraining.deleteMany({
        where: { staffId },
      });

      // Delete StaffBullyingTraining
      await tx.staffBullyingTraining.deleteMany({
        where: { staffId },
      });

      // Delete StaffNdisCodeOfConduct
      await tx.staffNdisCodeOfConduct.deleteMany({
        where: { staffId },
      });

      // Delete StaffConflictOfInterest
      await tx.staffConflictOfInterest.deleteMany({
        where: { staffId },
      });

      // Delete StaffDocumentationAcknowledgement
      await tx.staffDocumentationAcknowledgement.deleteMany({
        where: { staffId },
      });

      // Delete StaffVehicleSafetyInspection
      await tx.staffVehicleSafetyInspection.deleteMany({
        where: { staffId },
      });

      // Delete StaffFormDownload
      await tx.staffFormDownload.deleteMany({
        where: { staffId },
      });

      // Step 12: Finally, delete the staff (hard delete like client)
      console.log(`🗑️ Deleting Staff record...`);
      await tx.staff.delete({
        where: { id: staffId },
      });
      
      console.log(`✅ Staff ${staffId} and all related data deleted successfully`);
    }, { maxWait: 15000, timeout: 120000, isolationLevel: 'ReadCommitted' });

    return NextResponse.json({ 
      success: true, 
      message: "Staff and all related data deleted successfully" 
    });
  } catch (error: any) {
    console.error("Error deleting staff:", error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: "Staff not found" },
        { status: 404 }
      );
    }

    if (error.code === 'P2028') {
      return NextResponse.json(
        { error: "Delete operation timed out or transaction was closed. Please retry." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete staff", details: error.message },
      { status: 500 }
    );
  }
}

