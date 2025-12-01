// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { getStaffPDFComponent } from "@/components-server/staff/staffPDFRegistry";
import { getStaffSettingsForForm } from "@/lib/settings-server";
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

    console.log('🔵 [PDF API] ========== PDF Generation Request ==========');
    console.log('🔵 [PDF API] Request received:', { staffId, formType, url: req.url });

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
      case 'super-choice-form':
      case 'super_choice_form': {
        // Super Choice Form uses a special Playwright-based PDF generation
        // Redirect to the special endpoint
        const superChoiceSubmission = await prisma.staffFormSubmission.findUnique({
          where: {
            staffId_formKey: {
              staffId,
              formKey: 'super_choice_form',
            },
          },
        });
        if (!superChoiceSubmission) {
          return new NextResponse("Super Choice Form submission not found", { status: 404 });
        }
        
        const formDataObj = (superChoiceSubmission.data as any) || {};
        
        // Call the special super-choice-form PDF endpoint
        const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000';
        const pdfUrl = `${baseUrl}/api/generate-pdf/super-choice-form`;
        
        console.log(`📄 [PDF API] Redirecting super_choice_form to special endpoint: ${pdfUrl}`);
        
        try {
          const pdfResponse = await fetch(pdfUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataObj)
          });
          
          if (!pdfResponse.ok) {
            throw new Error(`Super choice form PDF generation failed: ${pdfResponse.status}`);
          }
          
          const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());
          const filename = `Superannuation_Standard_Choice_Form_${staff.firstName || ''}_${staff.surname || ''}.pdf`.replace(/\s+/g, '_');
          
          return new NextResponse(pdfBuffer, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="${filename}"`
            }
          });
        } catch (error) {
          console.error('❌ [PDF API] Super choice form PDF generation error:', error);
          return new NextResponse(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
        }
      }
      case 'govt-tax':
      case 'govt_tax': {
        // TFN Declaration Form uses a special Playwright-based PDF generation
        // Redirect to the special endpoint
        const taxSubmission = await prisma.staffFormSubmission.findUnique({
          where: {
            staffId_formKey: {
              staffId,
              formKey: 'govt_tax',
            },
          },
        });
        if (!taxSubmission) {
          return new NextResponse("TFN Declaration Form submission not found", { status: 404 });
        }
        
        const formDataObj = (taxSubmission.data as any) || {};
        
        // Call the special tax-form PDF endpoint
        const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000';
        const pdfUrl = `${baseUrl}/api/generate-pdf/tax-form`;
        
        console.log(`📄 [PDF API] Redirecting govt_tax to special endpoint: ${pdfUrl}`);
        
        try {
          const pdfResponse = await fetch(pdfUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataObj)
          });
          
          if (!pdfResponse.ok) {
            throw new Error(`TFN Declaration PDF generation failed: ${pdfResponse.status}`);
          }
          
          const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());
          const filename = `TFN_Declaration_Form_${staff.firstName || ''}_${staff.surname || ''}.pdf`.replace(/\s+/g, '_');
          
          return new NextResponse(pdfBuffer, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="${filename}"`
            }
          });
        } catch (error) {
          console.error('❌ [PDF API] TFN Declaration PDF generation error:', error);
          return new NextResponse(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
        }
      }
      case 'ndis-workforce-capability':
      case 'ndis_workforce_capability': {
        // NDIS Workforce Capability uses a special Playwright-based PDF generation
        // Redirect to the special endpoint
        const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000';
        const pdfUrl = `${baseUrl}/api/staff/${staffId}/forms/ndis-workforce-capability/pdf`;
        
        console.log(`📄 [PDF API] Redirecting ndis_workforce_capability to special endpoint: ${pdfUrl}`);
        
        try {
          const pdfResponse = await fetch(pdfUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (!pdfResponse.ok) {
            throw new Error(`NDIS Workforce Capability PDF generation failed: ${pdfResponse.status}`);
          }
          
          const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());
          const filename = `NDIS_Workforce_Capability_${staff.firstName || ''}_${staff.surname || ''}.pdf`.replace(/\s+/g, '_');
          
          return new NextResponse(pdfBuffer, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="${filename}"`
            }
          });
        } catch (error) {
          console.error('❌ [PDF API] NDIS Workforce Capability PDF generation error:', error);
          return new NextResponse(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
        }
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

      // Prioritize date from formData.data over staffSignedAt
      // This ensures the user-entered date is used, not the submission timestamp
      const baseDate =
        formData.data.date ||
        formData.data.acknowledgedAt ||
        (formData.staffSignedAt ? dateToDateString(formData.staffSignedAt) : undefined) ||
        '';
      
      formDataObj = {
        ...formData.data,
        staffSignature: formData.staffSignature,
        staffSignedAt: formData.staffSignedAt,
        // Use the date from formData.data if available, otherwise derive from staffSignedAt using UTC
        date: formData.data.date || (formData.staffSignedAt ? dateToDateString(formData.staffSignedAt) : baseDate),
      };
    }

    // Add staff info to form data
    const dataWithStaff = { ...formDataObj, staff };

    // Convert logo to base64 for React PDF
    // Use client_full_logo.jpg for employee-welcome form to match view component
    // Use client_full_logo-bg-removed.png for NDIS Code of Conduct form
    let logoFilename = 'infinity_logo.png';
    if (formType === 'employee-welcome' || formType === 'employment-welcome') {
      logoFilename = 'client_full_logo.jpg';
    } else if (formType === 'ndis-code-of-conduct' || formType === 'ndis_code_of_conduct') {
      logoFilename = 'client_full_logo-bg-removed.png';
    }
    
    const logoPath = path.resolve(process.cwd(), 'public', logoFilename);
    let logoDataUrl = '';
    try {
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        const mimeType = logoFilename.endsWith('.jpg') || logoFilename.endsWith('.jpeg') 
          ? 'image/jpeg' 
          : 'image/png';
        logoDataUrl = `data:${mimeType};base64,${logoBuffer.toString('base64')}`;
        console.log(`✅ [PDF API] Logo loaded: ${logoFilename}, size: ${logoBuffer.length} bytes`);
      } else {
        console.warn(`⚠️ [PDF API] Logo file not found: ${logoPath}`);
      }
    } catch (error) {
      console.warn('❌ [PDF API] Error loading logo:', error);
    }

    // Get app settings for footer (like other staff forms)
    // For fair-work-information and ndis-code-of-conduct, use getStaffSettingsForForm to get admin-specific settings
    let settings: Record<string, any> = {};
    
    if (formType === 'fair-work-information' || formType === 'fair_work_information') {
      // Use staff-specific settings for fair-work-information
      const staffSettings = await getStaffSettingsForForm(staffId, 'fair_work_information');
      settings = {
        ...staffSettings,
      };
      console.log('🔍 [PDF API] Staff settings for Fairwork Information Statements:', {
        staffId,
        settingsKeys: Object.keys(settings),
        website: settings?.website,
        formId: settings?.fair_work_information_form_id,
        reviewDate: settings?.fair_work_information_review_date,
      });
    } else if (formType === 'ndis-code-of-conduct' || formType === 'ndis_code_of_conduct') {
      // Use staff-specific settings for ndis-code-of-conduct
      const staffSettings = await getStaffSettingsForForm(staffId, 'ndis_code_of_conduct');
      settings = {
        ...staffSettings,
      };
      console.log('🔍 [PDF API] Staff settings for NDIS Code of Conduct:', {
        staffId,
        settingsKeys: Object.keys(settings),
        website: settings?.website || settings?.company_website,
        formId: settings?.ndis_code_of_conduct_form_id,
        reviewDate: settings?.ndis_code_of_conduct_review_date || settings?.review_date,
        hasWebsite: !!(settings?.website || settings?.company_website),
        hasFormId: !!settings?.ndis_code_of_conduct_form_id,
        hasReviewDate: !!(settings?.ndis_code_of_conduct_review_date || settings?.review_date),
        allSettings: settings,
      });
      console.log('🔍 [PDF API] Settings object details:', JSON.stringify(settings, null, 2));
    } else if (formType === 'pre-employment-medical') {
      // Use staff-specific settings for pre-employment-medical
      const staffSettings = await getStaffSettingsForForm(staffId, 'pre_employment_medical');
      settings = {
        ...staffSettings,
      };
      console.log('🔍 [PDF API] Staff settings for Pre-Employment Medical:', {
        staffId,
        settingsKeys: Object.keys(settings),
        website: settings?.website || settings?.company_website,
        formId: settings?.pre_employment_medical_form_id,
        reviewDate: settings?.pre_employment_medical_review_date || settings?.review_date,
        hasWebsite: !!(settings?.website || settings?.company_website),
        hasFormId: !!settings?.pre_employment_medical_form_id,
        hasReviewDate: !!(settings?.pre_employment_medical_review_date || settings?.review_date),
        allSettings: settings,
      });
    } else if (formType === 'bullying-training') {
      // Use staff-specific settings for bullying-training
      const staffSettings = await getStaffSettingsForForm(staffId, 'bullying_training');
      settings = {
        ...staffSettings,
      };
      console.log('🔍 [PDF API] Staff settings for Bullying Training:', {
        staffId,
        settingsKeys: Object.keys(settings),
        website: settings?.website || settings?.company_website,
        formId: settings?.bullying_training_form_id,
        reviewDate: settings?.bullying_training_review_date || settings?.review_date,
        hasWebsite: !!(settings?.website || settings?.company_website),
        hasFormId: !!settings?.bullying_training_form_id,
        hasReviewDate: !!(settings?.bullying_training_review_date || settings?.review_date),
        allSettings: settings,
      });
    } else if (formType === 'orientation') {
      // Use staff-specific settings for orientation
      const staffSettings = await getStaffSettingsForForm(staffId, 'orientation');
      settings = {
        ...staffSettings,
      };
      console.log('🔍 [PDF API] Staff settings for Orientation:', {
        staffId,
        settingsKeys: Object.keys(settings),
        website: settings?.website || settings?.company_website,
        formId: settings?.orientation_form_id,
        reviewDate: settings?.orientation_review_date || settings?.review_date,
        hasWebsite: !!(settings?.website || settings?.company_website),
        hasFormId: !!settings?.orientation_form_id,
        hasReviewDate: !!(settings?.orientation_review_date || settings?.review_date),
        allSettings: settings,
      });
    } else {
      // For other forms, use the generic approach (backward compatibility)
    const rawSettings = await (prisma as any).appSettings.findMany({
      where: { isActive: true },
      select: { key: true, value: true },
    });

    rawSettings.forEach((setting: any) => {
      if (setting.value && setting.value.trim() !== '') {
        settings[setting.key] = setting.value;
      }
    });
    }

    // Add logoDataUrl to settings so the PDF component can access it
    if (logoDataUrl) {
      settings.logoDataUrl = logoDataUrl;
      console.log(`✅ [PDF API] Added logoDataUrl to settings, length: ${logoDataUrl.length}`);
    }

    // Add logo and settings to data
    const dataWithLogo = { 
      data: dataWithStaff,
      logoDataUrl, // Also keep at top level for backward compatibility
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
      formType,
      acknowledgmentOnly,
      acknowledgmentOnlyType: typeof acknowledgmentOnly,
      acknowledgmentOnlyValue: acknowledgmentOnly,
      showBlank,
      hasDataWithLogo: !!dataWithLogo,
      dataWithLogoKeys: Object.keys(dataWithLogo || {}),
      dataKeys: Object.keys(dataWithLogo?.data || {}),
      hasSettings: !!dataWithLogo?.settings,
      hasLogoDataUrl: !!dataWithLogo?.settings?.logoDataUrl,
      logoDataUrlLength: dataWithLogo?.settings?.logoDataUrl ? String(dataWithLogo.settings.logoDataUrl).length : 0,
      hasAcknowledgmentData: !!(dataWithLogo?.data?.acknowledgmentData || (dataWithLogo as any)?.acknowledgmentData),
      acknowledgmentDataKeys: dataWithLogo?.data?.acknowledgmentData ? Object.keys(dataWithLogo.data.acknowledgmentData) : []
    });
    
    // Log settings being passed for NDIS Code of Conduct
    if (formType === 'ndis-code-of-conduct' || formType === 'ndis_code_of_conduct') {
      console.log('🔍 [PDF API] About to create PDF element with settings:', {
        settingsKeys: Object.keys(settings || {}),
        website: settings?.website,
        company_website: settings?.company_website,
        ndis_code_of_conduct_form_id: settings?.ndis_code_of_conduct_form_id,
        ndis_code_of_conduct_review_date: settings?.ndis_code_of_conduct_review_date,
        review_date: settings?.review_date,
        fullSettings: settings,
      });
    }
    
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
    
    // Additional logging for NDIS Code of Conduct
    if (formType === 'ndis-code-of-conduct' || formType === 'ndis_code_of_conduct') {
      console.log('🔍 [PDF API] Settings passed to PDF component:', {
        settingsObject: settings,
        settingsStringified: JSON.stringify(settings),
      });
    }

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
