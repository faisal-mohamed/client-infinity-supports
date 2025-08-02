import React from "react";
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

const Page2_FIXED: React.FC<any> = ({
  schema,
  data,
  commonFieldsData,
  settings,
  images,
}) => {
  const commonFieldMapping: Record<string, string> = {
    clientName: "name",
    address: "street",
    dob: "dob",
    disability: "disability",
    phoneNumber: "phone",
    ndisNumber: "ndis",
    state: "state",
    street: "street",
    postcode: "postCode",
    email: "email",
    homePhone: "phone",
    sex: "sex",
  };

  const getValue = (key: string) =>
    commonFieldMapping?.[key]
      ? commonFieldsData?.[commonFieldMapping?.[key]] ?? ""
      : data?.[key] ?? "";

  const renderRadio = (key: string, options: string[]) => (
    <div className="flex flex-wrap gap-4 ml-2">
      {options?.map?.((opt) => (
        <label key={opt} className={`inline-flex items-center ${A4_PDF_TYPOGRAPHY.body}`}>
          <input
            type="checkbox"
            readOnly
            checked={getValue(key) === opt}
            className="mr-1"
          />
          <span>{opt}</span>
        </label>
      )) ?? null}
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
        <div className="flex justify-center mb-6">
          <img
            src={images?.infinityLogo}
            alt="Infinity Supports WA logo"
            width={STANDARD_LOGO.width}
            height={STANDARD_LOGO.height}
            className={STANDARD_LOGO.className}
          />
        </div> <br /><br />

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Section 4 */}
          <div>
            <div className={`mb-3 ${A4_PDF_TYPOGRAPHY.sectionHeader}`}>4. Observations & Challenges:</div> <br /><br />
            <div className="space-y-3">
              {schema?.observations?.map?.((field: any) => (
                <div key={field?.key} className="flex items-start">
                  <span className={`min-w-[220px] ${A4_PDF_TYPOGRAPHY.body} font-medium`}>
                    ● {field?.label}:
                  </span>
                  <span className={`ml-2 flex-1 break-words ${A4_PDF_TYPOGRAPHY.body}`}>
                    {getValue(field?.key)}
                  </span>
                </div>
              )) ?? null}
            </div>
          </div> <br /><br />

          {/* Section 5 */}
          <div>
            <div className={`mb-3 ${A4_PDF_TYPOGRAPHY.sectionHeader}`}>5. Recommendations & Improvements:</div> <br /><br />
            <div className="space-y-3">
              {schema?.recommendations?.map?.((field: any) => (
                <div key={field?.key} className="flex flex-col">
                  <span className={`${A4_PDF_TYPOGRAPHY.body} font-medium mb-1`}>
                    ● {field?.label}:
                  </span>
                  {field?.type === "radio"
                    ? renderRadio(field?.key, field?.options ?? [])
                    : (
                      <span className={`ml-2 break-words ${A4_PDF_TYPOGRAPHY.body}`}>
                        {getValue(field?.key)}
                      </span>
                    )}
                </div>
              )) ?? null}
            </div>
          </div> <br /><br />

          {/* Section 6 */}
          <div>
            <div className={`mb-3 ${A4_PDF_TYPOGRAPHY.sectionHeader}`}>6. Follow-Up Actions:</div> <br /><br />
            <div className="space-y-3">
              {schema?.followup?.map?.((field: any) => (
                <div key={field?.key} className="flex flex-col">
                  <span className={`${A4_PDF_TYPOGRAPHY.body} font-medium mb-1`}>
                    ● {field?.label}:
                  </span>
                  {field?.type === "radio"
                    ? renderRadio(field?.key, field?.options ?? [])
                    : (
                      <span className={`ml-2 break-words ${A4_PDF_TYPOGRAPHY.body}`}>
                        {getValue(field?.key)}
                      </span>
                    )}
                </div>
              )) ?? null}
            </div>
          </div> <br /><br />

          {/* Section 7 */}
          <div>
            <div className={`mb-3 ${A4_PDF_TYPOGRAPHY.sectionHeader}`}>7. Signatures:</div> <br /><br />
            <div className="space-y-3">
              {schema?.signatures?.map?.((field: any) => {
                const value = getValue(field?.key);
                const isSignatureImage = [
                  "supportWorkerSignature",
                  "supervisorSignature",
                ].includes(field?.key);

                return (
                  <div key={field?.key} className="flex items-start gap-3">
                    <span className={`min-w-[220px] ${A4_PDF_TYPOGRAPHY.body} font-medium`}>
                      ● {field?.label}:
                    </span>
                    {isSignatureImage && value?.startsWith?.('data:image') ? (
                      
  <img
  src={value}
  alt={`${field?.label} Signature`}
  className="w-[80px] h-[20px] object-contain border border-gray-300 rounded"
  style={{width: '100px', height: '80px'}}
/>


                    ) : (
                      <span className={`ml-2 border-b border-black flex-1 min-h-[18px] break-words pb-1 ${A4_PDF_TYPOGRAPHY.body}`}>
                        {value}
                      </span>
                    )}
                  </div>
                );
              }) ?? null}
            </div>
          </div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page2_FIXED;
