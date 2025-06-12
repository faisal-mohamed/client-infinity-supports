// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: Promise<{ token: string }> }
// ) {
//   try {
//     const { token } = await params;
//     const passcode = req.nextUrl.searchParams.get('passcode');
    
//     // Find the form batch by batch token
//     const batch = await prisma.formBatch.findUnique({
//       where: { batchToken: token },
//       include: {
//         client: {
//   include: {
//     commonFields: true,
//     logs: {
//       orderBy: {
//         createdAt: 'desc'
//       }
//     }
//   }
// },

//         assignments: {
//           include: {
//             form: true
//           },
//           orderBy: {
//             displayOrder: 'asc'
//           }
//         }
//       }
//     });
    
//     if (!batch) {
//       return NextResponse.json(
//         { error: "Invalid access token" },
//         { status: 404 }
//       );
//     }
    
//     // Check if expired
//     if (new Date() > new Date(batch.expiresAt)) {
//       return NextResponse.json(
//         { error: "Access link has expired" },
//         { status: 403 }
//       );
//     }
    
//     // Check if passcode is required
//     // For batch-level passcode, we'll check the first assignment's passcode
//     // Assuming all assignments in a batch have the same passcode
//     const firstAssignment = batch.assignments[0];
//     if (firstAssignment?.passcode) {
//       // If no passcode provided, return error
//       if (!passcode) {
//         return NextResponse.json(
//           { error: "Passcode required" },
//           { status: 403 }
//         );
//       }
      
//       // If passcode doesn't match, return error
//       if (firstAssignment.passcode !== passcode) {
//         return NextResponse.json(
//           { error: "Invalid passcode" },
//           { status: 403 }
//         );
//       }
//     }
    
//     // Prepare response data
//     const responseData = {
//       batch: {
//         id: batch.id,
//         batchToken: batch.batchToken,
//         expiresAt: batch.expiresAt,
//         createdAt: batch.createdAt
//       },
//       client: {
//         id: batch.client.id,
//         name: batch.client.name,
//         email: batch.client.email,
//         commonFields: batch.client.commonFields,
//         logs: batch.client.logs
//       },
//       forms: batch.assignments.map(assignment => ({
//         id: assignment.id,
//         accessToken: assignment.accessToken,
//         title: assignment.form.title,
//         displayOrder: assignment.displayOrder,
//         isCompleted: assignment.isCompleted
//       }))
//     };



//     console.log("Fetched logs count:", batch.client.logs.length);
// console.log("Sample log metadata:", batch.client.logs[0]?.metadata);

    
//     return NextResponse.json(responseData);
//   } catch (error: any) {
//     console.error("Error accessing form batch:", error);
//     return NextResponse.json(
//       { error: "Failed to access forms", details: error.message },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params; // ✅ FIXED: await params
    const passcode = req.nextUrl.searchParams.get('passcode');

    // Find the form batch by batch token
    const batch = await prisma.formBatch.findUnique({
      where: { batchToken: token },
      include: {
        client: {
          include: {
            commonFields: true,
            logs: {
              orderBy: {
                createdAt: 'desc'
              }
            }
          }
        },
        assignments: {
          include: {
            form: true
          },
          orderBy: {
            displayOrder: 'asc'
          }
        }
      }
    });

    if (!batch) {
      return NextResponse.json(
        { error: "Invalid access token" },
        { status: 404 }
      );
    }

    if (new Date() > new Date(batch.expiresAt)) {
      return NextResponse.json(
        { error: "Access link has expired" },
        { status: 403 }
      );
    }

    const firstAssignment = batch.assignments[0];
    if (firstAssignment?.passcode) {
      if (!passcode) {
        return NextResponse.json(
          { error: "Passcode required" },
          { status: 403 }
        );
      }

      if (firstAssignment.passcode !== passcode) {
        return NextResponse.json(
          { error: "Invalid passcode" },
          { status: 403 }
        );
      }
    }

    // Optional: safely map logs (avoid BigInt/complex data issues)
    const logs = batch.client.logs.map(log => ({
      id: log.id,
      action: log.action,
      createdAt: log.createdAt,
      metadata: log.metadata ?? null,
      logType: log.logType
    }));

    const responseData = {
      batch: {
        id: batch.id,
        batchToken: batch.batchToken,
        expiresAt: batch.expiresAt,
        createdAt: batch.createdAt
      },
      client: {
        id: batch.client.id,
        name: batch.client.name,
        email: batch.client.email,
        commonFields: batch.client.commonFields,
        logs
      },
      forms: batch.assignments.map(assignment => ({
        id: assignment.id,
        accessToken: assignment.accessToken,
        title: assignment.form.title,
        displayOrder: assignment.displayOrder,
        isCompleted: assignment.isCompleted
      }))
    };

    console.log("Fetched logs count:", logs.length);
    console.log("Sample log metadata:", logs[0]?.metadata);

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("Error accessing form batch:", error);
    return NextResponse.json(
      { error: "Failed to access forms", details: error.message },
      { status: 500 }
    );
  }
}
