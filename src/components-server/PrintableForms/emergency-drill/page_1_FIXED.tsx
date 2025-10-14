import React from 'react';
import { format, parseISO, isValid } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

// ===== A4 PAGE WRAPPER (Same as individual-risk-assessment) =====
const A4PageWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}> = ({ children, className = '', footer }) => {
  return (
    <div
      className={`
        a4-page
        w-[210mm] min-h-[297mm]
        mx-auto
        bg-white
        border border-gray-300
        shadow-lg
        flex flex-col
        p-[20mm]
        print:shadow-none
        print:border-none
        print:p-[15mm]
        print:break-after-page
        print:break-inside-avoid
        font-montserrat
        ${className}
      `}
      style={{
        boxSizing: 'border-box',
      }}
    >
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      {footer && (
        <div className="mt-auto pt-[10mm] border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

const Page1_FIXED: React.FC<any> = ({ schema, data, commonFieldsData, settings, images }) => {
  const commonFieldMapping: Record<string, string> = {
    clientName: 'name',
    address: 'street',
    dob: 'dob',
    disability: 'disability',
    phoneNumber: 'phone',
    ndisNumber: 'ndis',
    state: 'state',
    street: 'street',
    postcode: 'postCode',
    email: 'email',
    homePhone: 'phone',
    sex: 'sex'
  };

  const getValue = (key: string) => {
    if (commonFieldMapping?.[key]) {
      return commonFieldsData?.[commonFieldMapping?.[key]] ?? '';
    }
    return data?.[key] ?? '';
  };

  const isChecked = (key: string) => data?.[key] === 'Yes';

  const renderRadioGroup = (key: string, options: string[]) => (
    <div className="flex gap-4 flex-wrap ml-2">
      {options?.map((opt) => (
        <label key={opt} className={`inline-flex items-center ${A4_PDF_TYPOGRAPHY.body}`}>
          <input type="checkbox" checked={getValue(key) === opt} readOnly className="mr-1" />
          {opt}
        </label>
      ))}
    </div>
  );

  const formatDate = (value: string) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }
    return value || 'N/A';
  };

  const footer = (
    <div className={`flex justify-between ${A4_PDF_TYPOGRAPHY.footer} px-2 text-gray-600`}>
      <span>Website: {settings?.company_website || 'https://www.infinitysupportswa.org'}</span>
      <span>{settings?.emergency_drill || 'ED001'}</span>
      <span>Review Date: {formatDate(settings?.review_date)}</span>
    </div>
  );

  return (
    <A4PageWrapper footer={footer}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-center mb-4">
          <img
            src={images?.infinityLogo}
            alt="Infinity Supports WA logo"
            width={STANDARD_LOGO.width}
            height={STANDARD_LOGO.height}
            className={STANDARD_LOGO.className}
          />
        </div>
 <br /><br />
        <div className={`text-center mb-2 ${A4_PDF_TYPOGRAPHY.title}`}>
          Emergency Drill Reporting Form 
        </div> <br /><br />
        <div className={`text-center mb-6 italic ${A4_PDF_TYPOGRAPHY.body}`}>
          (For Disability Support Workers in a Client's Home)
        </div> <br /><br />

        <hr className="border-gray-400 mb-6" />

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Section 1 */}
          <div>
            <div className={`mb-3 ${A4_PDF_TYPOGRAPHY.sectionHeader}`}>1. General Information:</div> <br /><br />
            <div className="space-y-3">
              {schema?.generalInfo?.map((field: any) => (
                <div key={field?.key} className="flex items-start">
                  <span className={`min-w-[220px] ${A4_PDF_TYPOGRAPHY.body} font-medium`}>
                    ● {field?.label}:
                  </span>
                  {field?.type === 'radio' ? (
                    renderRadioGroup(field?.key, field?.options ?? [])
                  ) : (
                    <span className={`flex-1 ml-2 min-w-[150px] ${A4_PDF_TYPOGRAPHY.body}`}>
                      {getValue(field?.key)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div> <br /><br />

          {/* Section 2 */}
          <div>
            <div className={`mb-3 ${A4_PDF_TYPOGRAPHY.sectionHeader}`}>2. Type of Emergency Drill Conducted:</div> <br /><br />
            <div className="space-y-3">
              {schema?.drillTypes?.type === 'select' ? (
                <div>
                  {/* Show dropdown with selected value */}
                  <div className="flex items-start">
                    <span className={`min-w-[220px] ${A4_PDF_TYPOGRAPHY.body} font-medium`}>
                      ● {schema?.drillTypes?.label}:
                    </span>
                    <span className={`flex-1 ml-2 min-w-[150px] ${A4_PDF_TYPOGRAPHY.body}`}>
                      {getValue('selectedDrillType') || 'No selection made'}
                    </span>
                  </div>
                  
                  {/* Show "Other" text field if "Other" is selected */}
                  {getValue('selectedDrillType') === 'Other (specify)' && (
                    <div className="mt-3">
                      <div className="flex items-start">
                        <span className={`min-w-[220px] ${A4_PDF_TYPOGRAPHY.body} font-medium`}>
                          ● {schema?.drillTypes?.otherField?.label}:
                        </span>
                        <span className={`flex-1 ml-2 min-w-[150px] ${A4_PDF_TYPOGRAPHY.body}`}>
                          {getValue(schema?.drillTypes?.otherField?.key)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Fallback for old structure
                schema?.drillTypes?.map((field: any) => (
                  <div key={field?.key} className="flex items-start">
                    {field?.type === 'checkbox' ? (
                      <>
                        <input type="checkbox" checked={isChecked(field?.key)} readOnly className="mr-2 mt-1" />
                        <span className={A4_PDF_TYPOGRAPHY.body}>{field?.label}</span>
                      </>
                    ) : (
                      <>
                        <span className={`min-w-[220px] ${A4_PDF_TYPOGRAPHY.body} font-medium`}>
                          ● {field?.label}:
                        </span>
                        <span className={`flex-1 ml-2 min-w-[150px] ${A4_PDF_TYPOGRAPHY.body}`}>
                          {getValue(field?.key)}
                        </span>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div> <br /><br />

          {/* Section 3 */}
          <div>
            <div className={`mb-3 ${A4_PDF_TYPOGRAPHY.sectionHeader}`}>3. Drill Execution Details:</div> <br /><br />
            <div className="space-y-3">
              {schema?.executionDetails?.map((field: any) => (
                <div key={field?.key} className="flex items-start">
                  <span className={`min-w-[220px] ${A4_PDF_TYPOGRAPHY.body} font-medium`}>
                    ● {field?.label}:
                  </span>
                  {field?.type === 'radio' ? (
                    renderRadioGroup(field?.key, field?.options ?? [])
                  ) : (
                    <span className={`flex-1 ml-2 min-w-[150px] ${A4_PDF_TYPOGRAPHY.body}`}>
                      {getValue(field?.key)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page1_FIXED;
