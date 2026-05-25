import { NextRequest, NextResponse } from "next/server";
import { getClientById, getClientBatches, getSignatureBatchForms, getSubmissionById } from "@/lib/db";
import { validateClientOwnership, isOwnershipError } from '@/lib/client-ownership';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const ownership = await validateClientOwnership(id);
    if (isOwnershipError(ownership)) return ownership;

    if (!id) {
      return NextResponse.json(
        { error: "Invalid client ID" },
        { status: 400 }
      );
    }

    const client = await getClientById(id);
    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    // Get all signature batches for this client
    const signatureBatches = await getClientBatches(id, true);

    // Enrich each batch with its signature forms and submission details
    const enrichedBatches = await Promise.all(
      signatureBatches
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map(async (batch) => {
          const sigForms = await getSignatureBatchForms(batch.id);
          const signatureForms = await Promise.all(
            sigForms.map(async (sf) => {
              const submission = await getSubmissionById(sf.formSubmissionId);
              return {
                batchId: sf.batchId,
                formSubmissionId: sf.formSubmissionId,
                createdAt: sf.createdAt,
                formSubmission: submission
                  ? {
                      ...submission,
                      form: {
                        title: submission.formTitle,
                        formKey: submission.formKey,
                      },
                    }
                  : null,
              };
            })
          );
          return {
            ...batch,
            client: { name: client.name, email: client.email },
            signatureForms,
          };
        })
    );

    return NextResponse.json({
      client: { id: client.id, name: client.name, email: client.email },
      signatureBatches: enrichedBatches,
    });
  } catch (error: any) {
    console.error("Error fetching signature links:", error);
    return NextResponse.json(
      { error: "Failed to fetch signature links", details: error.message },
      { status: 500 }
    );
  }
}
