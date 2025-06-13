// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const {id} = await params;
//     const clientId = parseInt(id || "0");

//     const client = await prisma.client.findUnique({
//       where: { id: clientId },
//       include: {
//         commonFields: true,
//         createdBy: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//       },
//     });

//     if (!client) {
//       return NextResponse.json(
//         { error: "Client not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(client);
//   } catch (error: any) {
//     console.error("Error fetching client:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch client", details: error.message },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const {id} = await params;
//     const clientId = parseInt(id || "0");
//     const body = await req.json();
//     const { name, email, phone, commonFields } = body;

//     // Update client
//     const updatedClient = await prisma.client.update({
//       where: { id: clientId },
//       data: {
//         name,
//         email,
//         phone,
//       },
//       include: {
//         commonFields: true,
//       },
//     });

//     // Update or create common fields if provided
//     if (commonFields) {
//       if (updatedClient.commonFields.length > 0) {
//         // Update existing common fields
//         await prisma.commonField.update({
//           where: { clientId },
//           data: {
//             ...commonFields,
//             updatedAt: new Date(),
//           },
//         });
//       } else {
//         // Create new common fields
//         await prisma.commonField.create({
//           data: {
//             clientId,
//             ...commonFields,
//           },
//         });
//       }
//     }

//     // Get the updated client with common fields
//     const clientWithCommonFields = await prisma.client.findUnique({
//       where: { id: clientId },
//       include: {
//         commonFields: true,
//       },
//     });

//     return NextResponse.json(clientWithCommonFields);
//   } catch (error: any) {
//     console.error("Error updating client:", error);
//     return NextResponse.json(
//       { error: "Failed to update client", details: error.message },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {

//         const {id} = await params;

//     const clientId = parseInt(id || "0");

//     // Start a transaction to delete client and related data
//     await prisma.$transaction(async (tx) => {
//       // Delete form batches first (this was missing)
//       // We need to delete FormAssignments linked to batches first
//       const batches = await tx.formBatch.findMany({
//         where: { clientId },
//         select: { id: true }
//       });
      
//       const batchIds = batches.map(batch => batch.id);
      
//       // Delete form assignments linked to batches
//       if (batchIds.length > 0) {
//         await tx.formAssignment.deleteMany({
//           where: { batchId: { in: batchIds } },
//         });
//       }
      
//       // Now delete the batches
//       await tx.formBatch.deleteMany({
//         where: { clientId },
//       });
      
//       // Delete remaining form assignments not linked to batches
//       await tx.formAssignment.deleteMany({
//         where: { clientId },
//       });

//       // Delete common fields
//       await tx.commonField.deleteMany({
//         where: { clientId },
//       });

//       // Delete form submissions
//       await tx.formSubmission.deleteMany({
//         where: { clientId },
//       });

//       // Delete form progress
//       await tx.formProgress.deleteMany({
//         where: { clientId },
//       });

//       // Delete form signatures
//       await tx.formSignature.deleteMany({
//         where: { clientId },
//       });

//       // Delete insights
//       await tx.insight.deleteMany({
//         where: { clientId },
//       });

//       // Delete activity logs
//       await tx.formActivityLog.deleteMany({
//         where: { clientId },
//       });

//       // Delete the client
//       await tx.client.delete({
//         where: { id: clientId },
//       });
//     });

//     return NextResponse.json({ success: true });
//   } catch (error: any) {
//     console.error("Error deleting client:", error);
//     return NextResponse.json(
//       { error: "Failed to delete client", details: error.message },
//       { status: 500 }
//     );
//   }
// }



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
      // Delete form batches and related assignments
      const batches = await tx.formBatch.findMany({
        where: { clientId },
        select: { id: true }
      });
      
      const batchIds = batches.map(batch => batch.id);
      
      // Delete form assignments linked to batches
      if (batchIds.length > 0) {
        await tx.formAssignment.deleteMany({
          where: { batchId: { in: batchIds } },
        });
      }
      
      // Delete the batches
      await tx.formBatch.deleteMany({
        where: { clientId },
      });
      
      // Delete remaining form assignments not linked to batches
      await tx.formAssignment.deleteMany({
        where: { clientId },
      });

      // Delete common fields
      await tx.commonField.deleteMany({
        where: { clientId },
      });

      // Delete form submissions
      await tx.formSubmission.deleteMany({
        where: { clientId },
      });

      // Delete form progress
      await tx.formProgress.deleteMany({
        where: { clientId },
      });

      // Delete form signatures
      await tx.formSignature.deleteMany({
        where: { clientId },
      });

      // Delete insights
      await tx.insight.deleteMany({
        where: { clientId },
      });

      // Delete activity logs
      await tx.formActivityLog.deleteMany({
        where: { clientId },
      });

      // Finally, delete the client
      await tx.client.delete({
        where: { id: clientId },
      });
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

