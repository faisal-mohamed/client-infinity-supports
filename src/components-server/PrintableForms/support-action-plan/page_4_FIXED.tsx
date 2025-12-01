import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { parseISO, isValid, format } from 'date-fns';
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

const commonFieldMapping: Record<string, string> = {
  ndisNumber: "ndis",
  gender: "sex",
  participantName: "name",
  dob: "dob",
  address: "street",
  state: "state",
  postcode: "postCode",
  email: "email",
  phone: "phone",
};

// --- Standardized Header Component ---
const StandardHeader = ({ images, title }: { images?: any, title?: string }) => (
  <div className="flex flex-col items-center pt-6 pb-4">
    <img
      src={images?.infinityLogo || "/infinity_logo.png"}
      alt="Logo"
      width={STANDARD_LOGO.width}
      height={STANDARD_LOGO.height}
      className={STANDARD_LOGO.className}
    /> <br /><br />
    {title && (
      <h2 className={`${A4_PDF_TYPOGRAPHY.title} text-center mt-2`}>
        {title}
      </h2>
    )}
  </div>
);

// --- Standardized Footer Component ---
const Footer = ({ settings }: { settings: any }) => {
  const formatDate = (value: string): string => {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        return format(parsed, 'dd-MM-yyyy');
      }
    }
    return value;
  };

  return (
    <footer className={`flex-shrink-0 mt-auto flex justify-between ${A4_PDF_TYPOGRAPHY.footer} text-gray-500 pt-4 border-t border-gray-300`}>
      <div>Website: {settings?.company_website}</div>
      <div>{settings?.support_action_plan}</div>
      <div>Review Date: {formatDate(settings?.review_date)}</div>
    </footer>
  );
};

const Page4: React.FC<any> = ({
  schema,
  data,
  settings,
  commonFieldsData,
  images,
}) => {
  const isChecked = (value: string, option: string) =>
    value?.toLowerCase?.() === option.toLowerCase();

  const formatDate = (value: string): string => {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        return format(parsed, 'dd-MM-yyyy');
      }
    }
    return value;
  };
    
  const getValue = (key: string): string => {
    const raw = commonFieldMapping[key]
      ? commonFieldsData?.[commonFieldMapping[key]]
      : data?.[key];
  
    return formatDate(raw ?? '');
  };
    
  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full min-h-full box-border text-gray-800 font-montserrat leading-[1.75]" style={{ height: "100%", minHeight: "100%", padding: "24px" }}>
        
        {/* Main Content */}
        <div className="flex-1 min-h-0 flex flex-col">
          
          <StandardHeader images={images} />

          {/* Table 1 - Goals Section (Budget Approval question removed - it's already in Mainstream Supports section) */}
          <table className={`w-full border border-black border-collapse ${A4_PDF_TYPOGRAPHY.tableCell} mb-6`}>
            <tbody>
              <tr>
                <td
                  colSpan={2}
                  className={`border border-black ${A4_PDF_TYPOGRAPHY.sectionHeader} p-1`}
                  style={{ backgroundColor: "#bfdbfe" }}
                >
                  {schema?.goalsSection?.title}
                </td>
              </tr>
              <tr>
                <td
                  colSpan={2}
                  className={`border border-black p-4 h-48 whitespace-pre-wrap align-top ${A4_PDF_TYPOGRAPHY.tableCell}`}
                >
                  {data?.goalsText || ""}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Table 2 - Signatures */}
          <table className={`w-full border border-black border-collapse ${A4_PDF_TYPOGRAPHY.tableCell}`}>
            <tbody>
              {/* Participant Signature Row */}
              <tr>
                <td
                  colSpan={2}
                  className={`border border-black ${A4_PDF_TYPOGRAPHY.sectionHeader} p-1 text-left bg-[#bfdbfe]`}
                  style={{ backgroundColor: "#bfdbfe" }}
                >
                  {schema?.signatures?.participant?.label}
                </td>
              </tr>
              <tr className="h-[60px]">
                {/* Signature image */}
                <td className="border border-black p-2 w-1/2">
                  {data?.participantSignature ? (
                    <div className="w-full h-full flex items-center justify-start overflow-hidden">
                      <img
                        src={data?.participantSignature}
                        alt="Participant Signature"
                        className="h-[50px] object-contain"
                      />
                    </div>
                  ) : (
                    <span className={`italic text-gray-400 ${A4_PDF_TYPOGRAPHY.small}`}>No signature</span>
                  )}
                </td>
                {/* Signature date */}
                <td className="border border-black p-2 w-1/2 align-top">
                  <span className={A4_PDF_TYPOGRAPHY.label}>Date:</span> 
                  <span className={A4_PDF_TYPOGRAPHY.tableCell}> {formatDate(data?.participantSignatureDate || '')}</span>
                </td>
              </tr>

              {/* Author Signature Row */}
              <tr>
                <td
                  colSpan={2}
                  className={`border border-black ${A4_PDF_TYPOGRAPHY.sectionHeader} p-1 text-left bg-[#bfdbfe]`}
                  style={{ backgroundColor: "#bfdbfe" }}
                >
                  {schema?.signatures?.author?.label}
                </td>
              </tr>
              <tr className="h-[60px]">
                {/* Signature image */}
                <td className="border border-black p-2 w-1/2">
                  {data?.authorSignature ? (
                    <div className="w-full h-full flex items-center justify-start overflow-hidden">
                      <img
                        src={data?.authorSignature}
                        alt="Author Signature"
                        className="h-[50px] object-contain"
                      />
                    </div>
                  ) : (
                    <span className={`italic text-gray-400 ${A4_PDF_TYPOGRAPHY.small}`}>No signature</span>
                  )}
                </td>
                {/* Signature date */}
                <td className="border border-black p-2 w-1/2 align-top">
                  <span className={A4_PDF_TYPOGRAPHY.label}>Date:</span> 
                  <span className={A4_PDF_TYPOGRAPHY.tableCell}> {formatDate(data?.providerSignatureDate || '')}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <Footer settings={settings} />
      </div>
    </A4PageWrapper>
  );
};

export default Page4;
