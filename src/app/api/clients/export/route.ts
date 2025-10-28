import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const state = url.searchParams.get("state") || "";
    const sex = url.searchParams.get("sex") || "";
    const hasNdis = url.searchParams.get("hasNdis") || "";
    const hasDisability = url.searchParams.get("hasDisability") || "";

    const whereClause: any = {};
    const commonFieldsFilter: any = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }
    if (state) commonFieldsFilter.state = state;
    if (sex) commonFieldsFilter.sex = sex;
    if (hasNdis === "true") commonFieldsFilter.ndis = { not: null };
    else if (hasNdis === "false") commonFieldsFilter.ndis = null;
    if (hasDisability === "true") commonFieldsFilter.disability = { not: null };
    else if (hasDisability === "false") commonFieldsFilter.disability = null;

    if (Object.keys(commonFieldsFilter).length > 0) {
      whereClause.commonFields = { some: commonFieldsFilter };
    }

    const clients = await prisma.client.findMany({
      where: whereClause,
      include: { commonFields: true },
      orderBy: { createdAt: "desc" },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Clients");

    // === Title Row ===
    worksheet.mergeCells("A1", "G1");
    worksheet.getCell("A1").value = "Infinity Supports WA - Client Details Report";
    worksheet.getCell("A1").font = { size: 16, bold: true, color: { argb: "FFFFFFFF" } };
    worksheet.getCell("A1").alignment = { horizontal: "center" };
    worksheet.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4F46E5" } };

    // === Subtitle / Date Row ===
    worksheet.mergeCells("A2", "G2");
    worksheet.getCell("A2").value = `Generated on: ${new Date().toLocaleDateString()}`;
    worksheet.getCell("A2").font = { bold: true, color: { argb: "FFFFFFFF" } };
    worksheet.getCell("A2").alignment = { horizontal: "center" };
    worksheet.getCell("A2").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF6366F1" } };

    // === Empty Row ===
    worksheet.addRow([]);

    // === Column Headers (Manual) ===
    const headerRow = worksheet.addRow([
      "Name",
      "Email",
      "Phone",
      "NDIS Number",
      "State",
      "Sex",
      "Created Date",
    ]);

    // Header Styling
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.alignment = { horizontal: "center" };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF818CF8" } };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // === Data Rows ===
    clients.forEach((client, index) => {
      const row = worksheet.addRow([
        client.name || "",
        client.email || "",
        client.phone || "",
        client.commonFields?.ndis || "",
        client.commonFields?.state || "",
        client.commonFields?.sex || "",
        new Date(client.createdAt).toLocaleDateString(),
      ]);

      // Alternate row coloring
      if (index % 2 === 0) {
        row.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF3F4F6" },
          };
        });
      }
    });

    // Auto-fit columns (optional)
    worksheet.columns.forEach((column : any) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell : any) => {
        const length = cell.value ? cell.value.toString().length : 0;
        if (length > maxLength) maxLength = length;
      });
      column.width = maxLength < 10 ? 10 : maxLength + 5;
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="infinity_support_clients_${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Excel export error:", error);
    return NextResponse.json({ error: "Failed to export Excel" }, { status: 500 });
  }
}
