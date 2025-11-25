// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { getStaffPDFComponent } from "@/components-server/staff/staffPDFRegistry";
import fs from "fs";
import path from "path";

/**
 * Generate Staff PDF using @react-pdf/renderer
 * - No browser needed!
 * - Faster generation
 * - Dynamic pages automatically
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; formType: string }> }
) {
  try {
    const { id, formType } = await params;
    const staffId = parseInt(id);

    if (!staffId || !formType) {
      return new NextResponse("Missing staffId or formType", { status: 400 });
    }

    // Get staff info
    const staff = await (prisma as any).staff.findUnique({
      where: { id: staffId },
      select: { id: true, firstName: true, surname: true, email: true }
    });

    if (!staff) {
      return new NextResponse("Staff not found", { status: 404 });
    }

    // Get form data based on form type
    let formData = null;
    switch (formType) {
      case 'employee-details':
        // Try dedicated table first, then fallback to generic table (backward compatible)
        formData = await (prisma as any).staffEmploymentDetails.findUnique({
          where: { staffId }
        }).catch(() => null);
        
        // Fallback to generic table if dedicated table doesn't exist or has no data
        if (!formData) {
          const submission = await prisma.staffFormSubmission.findUnique({
            where: { 
              staffId_formKey: { 
                staffId, 
                formKey: 'employee_details' 
              } 
            }
          });
          
          if (submission) {
            formData = {
              id: submission.id,
              staffId: submission.staffId,
              data: submission.data || {},
              staffSignature: submission.staffSignature,
              staffSignedAt: submission.staffSignedAt,
              adminSignature: submission.adminSignature,
              adminSignedAt: submission.adminSignedAt,
              createdAt: submission.createdAt,
              updatedAt: submission.updatedAt
            };
          }
        }
        break;
      case 'employment-welcome':
        formData = await (prisma as any).staffEmploymentWelcomeAck.findUnique({
          where: { staffId }
        });
        break;
      case 'employee-welcome':
        formData = await (prisma as any).staffEmploymentWelcomeAck.findUnique({
          where: { staffId }
        });
        break;
      case 'support-worker':
        formData = await (prisma as any).staffSupportWorker.findUnique({
          where: { staffId }
        });
        break;
      case 'pre-employment-medical':
        formData = await (prisma as any).staffPreEmploymentMedical.findUnique({
          where: { staffId }
        });
        break;
      case 'ndis-workforce-capability':
        formData = await (prisma as any).staffNdisWorkforceCapability.findUnique({
          where: { staffId }
        });
        break;
      case 'bullying-harassment':
        formData = await (prisma as any).staffBullyingHarassmentTraining.findUnique({
          where: { staffId }
        });
        break;
      case 'bullying-harassment-training':
        formData = await (prisma as any).staffBullyingHarassmentTraining.findUnique({
          where: { staffId }
        });
        break;
      case 'bullying-training':
        // Check generic submissions table first
        const bullyingSubmission = await prisma.staffFormSubmission.findUnique({
          where: {
            staffId_formKey: {
              staffId,
              formKey: 'bullying_training'
            }
          }
        });
        if (bullyingSubmission) {
          formData = {
            data: bullyingSubmission.data || {},
            staffSignature: bullyingSubmission.staffSignature,
            staffSignedAt: bullyingSubmission.staffSignedAt,
            createdAt: bullyingSubmission.createdAt,
            updatedAt: bullyingSubmission.updatedAt,
          };
        } else {
          // Fallback to dedicated table
          try {
            formData = await (prisma as any).staffBullyingTraining.findUnique({
              where: { staffId }
            });
          } catch (e) {
            // Table might not exist
          }
        }
        break;
      case 'ndis-code-of-conduct':
        {
          const ndisSubmission = await prisma.staffFormSubmission.findUnique({
            where: {
              staffId_formKey: {
                staffId,
                formKey: 'ndis_code_of_conduct',
              },
            },
          });
          if (ndisSubmission) {
            formData = {
              data: ndisSubmission.data || {},
              staffSignature: ndisSubmission.staffSignature,
              staffSignedAt: ndisSubmission.staffSignedAt,
              createdAt: ndisSubmission.createdAt,
              updatedAt: ndisSubmission.updatedAt,
            };
          } else {
            formData = await (prisma as any).staffNdisCodeOfConduct.findUnique({
              where: { staffId },
            });
          }
        }
        break;
      case 'fair-work-information':
      case 'fair_work_information': {
        const fairworkSubmission = await prisma.staffFormSubmission.findUnique({
          where: {
            staffId_formKey: {
              staffId,
              formKey: 'fair_work_information',
            },
          },
        });
        if (fairworkSubmission) {
          formData = {
            data: fairworkSubmission.data || {},
            staffSignature: fairworkSubmission.staffSignature,
            staffSignedAt: fairworkSubmission.staffSignedAt,
            createdAt: fairworkSubmission.createdAt,
            updatedAt: fairworkSubmission.updatedAt,
          };
        } else {
          formData = { data: {}, staffSignature: null, staffSignedAt: null };
        }
        break;
      }
      case 'orientation': {
        const orientationSubmission = await prisma.staffFormSubmission.findUnique({
          where: {
            staffId_formKey: {
              staffId,
              formKey: 'orientation',
            },
          },
        });
        if (orientationSubmission) {
          formData = {
            data: orientationSubmission.data || {},
            staffSignature: orientationSubmission.staffSignature,
            staffSignedAt: orientationSubmission.staffSignedAt,
            createdAt: orientationSubmission.createdAt,
            updatedAt: orientationSubmission.updatedAt,
          };
        } else {
          formData = { data: {}, staffSignature: null, staffSignedAt: null };
        }
        break;
      }
      case 'govt-tax':
      case 'govt_tax': {
        const govtTaxSubmission = await prisma.staffFormSubmission.findUnique({
          where: {
            staffId_formKey: {
              staffId,
              formKey: 'govt_tax',
            },
          },
        });
        if (govtTaxSubmission) {
          formData = {
            data: govtTaxSubmission.data || {},
            staffSignature: govtTaxSubmission.staffSignature,
            staffSignedAt: govtTaxSubmission.staffSignedAt,
            createdAt: govtTaxSubmission.createdAt,
            updatedAt: govtTaxSubmission.updatedAt,
          };
        } else {
          formData = { data: {}, staffSignature: null, staffSignedAt: null };
        }
        break;
      }
      case 'vehicle-safety-inspection':
      case 'vehicle_safety_inspection': {
        const vehicleSafetySubmission = await prisma.staffFormSubmission.findUnique({
          where: {
            staffId_formKey: {
              staffId,
              formKey: 'vehicle_safety_inspection',
            },
          },
        });
        if (vehicleSafetySubmission) {
          formData = {
            data: vehicleSafetySubmission.data || {},
            staffSignature: vehicleSafetySubmission.staffSignature,
            staffSignedAt: vehicleSafetySubmission.staffSignedAt,
            createdAt: vehicleSafetySubmission.createdAt,
            updatedAt: vehicleSafetySubmission.updatedAt,
          };
        } else {
          formData = { data: {}, staffSignature: null, staffSignedAt: null };
        }
        break;
      }
      default:
        return new NextResponse("Invalid form type", { status: 400 });
    }

    if (!formData) {
      return new NextResponse("Form data not found", { status: 404 });
    }

    // Extract data from formData (handle both direct data and nested data)
    let formDataObj = formData;
    if (formData?.data && typeof formData.data === 'object') {
      const baseDate =
        formData.data.date ||
        formData.data.acknowledgedAt ||
        formData.data.staffSignedAt ||
        '';
      formDataObj = {
        ...formData.data,
        staffSignature: formData.staffSignature,
        staffSignedAt: formData.staffSignedAt,
        date: formData.staffSignedAt
          ? new Date(formData.staffSignedAt).toISOString().split('T')[0]
          : baseDate,
      };
    }

    // Add staff info to form data
    const dataWithStaff = { ...formDataObj, staff };

    // Convert logo to base64 for React PDF
    // Use client_full_logo.jpg for employee-welcome form to match view component
    const logoFilename = formType === 'employee-welcome' || formType === 'employment-welcome' 
      ? 'client_full_logo.jpg' 
      : 'infinity_logo.png';
    const logoPath = path.resolve(process.cwd(), 'public', logoFilename);
    let logoDataUrl = '';
    try {
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        const mimeType = logoFilename.endsWith('.jpg') || logoFilename.endsWith('.jpeg') 
          ? 'image/jpeg' 
          : 'image/png';
        logoDataUrl = `data:${mimeType};base64,${logoBuffer.toString('base64')}`;
      }
    } catch (error) {
      console.warn('Logo not found, skipping:', error);
    }

    // Get app settings for footer (like other staff forms)
    const rawSettings = await (prisma as any).appSettings.findMany({
      where: { isActive: true },
      select: { key: true, value: true },
    });

    const settings: Record<string, any> = {};
    rawSettings.forEach((setting: any) => {
      if (setting.value && setting.value.trim() !== '') {
        settings[setting.key] = setting.value;
      }
    });

    // Add logo and settings to data
    const dataWithLogo = { 
      data: dataWithStaff,
      logoDataUrl,
      settings,
      staffSignature: formData.staffSignature,
      staffSignedAt: formData.staffSignedAt,
      adminSignature: formData.adminSignature,
      adminSignedAt: formData.adminSignedAt,
    };

    // Create images object for forms that use images prop (like bullying-training, bullying-harassment-training)
    const images = {
      infinityLogo: logoDataUrl,
    };

    // Get React PDF component
    let StaffPDFComponent;
    try {
      StaffPDFComponent = getStaffPDFComponent(formType.replace(/-/g, '_'));
    } catch (error: any) {
      console.error(`PDF component not found for form type: ${formType}`, error);
      return new NextResponse(
        `PDF generation not yet available for this form type (${formType}). Please contact support.`,
        { status: 501 }
      );
    }
    
    // Check if we should show blank acknowledgement form (for staff download)
    // Check if we should show only acknowledgment form (for admin view/download)
    const { searchParams } = new URL(req.url);
    const showBlank = searchParams.get('blank') === 'true';
    const acknowledgmentOnly = searchParams.get('acknowledgmentOnly') === 'true';
    
    console.log('🔵 [PDF API] PDF generation parameters:', {
      formType,
      staffId,
      showBlank,
      acknowledgmentOnly,
      hasFormData: !!formData,
      hasAcknowledgmentData: !!(formData?.data?.acknowledgmentData || (formData as any)?.acknowledgmentData),
      formDataKeys: formData ? Object.keys(formData) : [],
      dataKeys: formData?.data ? Object.keys(formData.data) : []
    });
    
    // Create PDF element - pass both data and images props for consistency with other forms
    console.log('🔵 [PDF API] Creating PDF element with props:', {
      acknowledgmentOnly,
      acknowledgmentOnlyType: typeof acknowledgmentOnly,
      acknowledgmentOnlyValue: acknowledgmentOnly,
      showBlank,
      hasDataWithLogo: !!dataWithLogo,
      dataWithLogoKeys: Object.keys(dataWithLogo || {}),
      dataKeys: Object.keys(dataWithLogo?.data || {}),
      hasAcknowledgmentData: !!(dataWithLogo?.data?.acknowledgmentData || (dataWithLogo as any)?.acknowledgmentData),
      acknowledgmentDataKeys: dataWithLogo?.data?.acknowledgmentData ? Object.keys(dataWithLogo.data.acknowledgmentData) : []
    });
    
    const pdfElement = React.createElement(StaffPDFComponent, { 
      data: {
        ...dataWithLogo,
        showBlankAcknowledgement: showBlank,
      },
      settings,
      images,
      showBlankForm: false,
      acknowledgmentOnly: acknowledgmentOnly,
    });
    
    console.log('🔵 [PDF API] PDF element created successfully:', {
      acknowledgmentOnly,
      acknowledgmentOnlyPassed: acknowledgmentOnly,
      componentName: StaffPDFComponent?.name || 'Unknown',
      hasData: !!dataWithLogo,
      hasSettings: !!settings,
      hasImages: !!images,
      propsPassed: {
        data: !!dataWithLogo,
        settings: !!settings,
        images: !!images,
        showBlankForm: false,
        acknowledgmentOnly: acknowledgmentOnly
      }
    });

    console.log('🔵 [PDF API] Generating PDF for staff:', staff.firstName, staff.surname);
    console.log('🔵 [PDF API] acknowledgmentOnly mode:', acknowledgmentOnly, 'type:', typeof acknowledgmentOnly);
    
    // Generate PDF buffer using React PDF (no browser!)
    // @ts-ignore - renderToBuffer returns a Node Buffer which is compatible at runtime
    console.log('🔵 [PDF API] Calling renderToBuffer...');
    const pdfBuffer: any = await renderToBuffer(pdfElement);
    console.log('✅ [PDF API] PDF buffer generated, size:', pdfBuffer?.length || 0, 'bytes');
    const pdfUint8 = pdfBuffer instanceof Uint8Array ? pdfBuffer : new Uint8Array(pdfBuffer);
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(pdfUint8);
        controller.close();
      },
    });

    const filename = acknowledgmentOnly 
      ? `${staff.firstName}_${staff.surname}_vehicle_safety_inspection_acknowledgment.pdf`
      : `${staff.firstName}_${staff.surname}_${formType}.pdf`;

    console.log('PDF generated successfully:', filename);

    // Check if request wants to download or view inline
    const download = searchParams.get('download') === 'true';

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': download 
          ? `attachment; filename="${filename}"` 
          : `inline; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error("Error generating staff PDF:", error);
    console.error("Error stack:", error.stack);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
