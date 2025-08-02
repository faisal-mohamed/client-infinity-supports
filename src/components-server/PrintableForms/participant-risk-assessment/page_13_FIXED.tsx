import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { parseISO, isValid, format } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

interface Page13Props {
  data: any;
  commonFieldsData?: any;
  settings: any;
  schema?: any;
  images: any;
}

// --- Standardized Header Component ---
const StandardHeader = ({ images }: { images?: any }) => (
  <div className="flex justify-center">
    <img
      src={images?.infinityLogo || "/infinity_logo.png"}
      alt="Logo"
      width={STANDARD_LOGO.width}
      height={STANDARD_LOGO.height}
      className={STANDARD_LOGO.className}
    />
  </div>
);

// --- Standardized Footer Component ---
const Footer = ({ settings }: { settings: any }) => {
  const formatDate = (value: string) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }
    return value;
  };

  return (
    <div className={`flex justify-between ${A4_PDF_TYPOGRAPHY.footer} px-1 text-gray-600`}>
      <span>Website: {settings?.company_website}</span>
      <span>{settings?.participant_risk_assessment}</span>
      <span>Review Date: {formatDate(settings?.review_date)}</span>
    </div>
  );
};

const Page13: React.FC<Page13Props> = ({ data, commonFieldsData, settings, schema, images }) => {
  const getValue = (key: string) => {
    const rawValue = data?.[key] ?? '';

    if (typeof rawValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
      const parsed = parseISO(rawValue);
      if (isValid(parsed)) {
        return format(parsed, 'dd-MM-yyyy');
      }
    }

    return rawValue;
  };

  const renderSignature = (signatureData: string, altText: string) => {
    if (!signatureData) return '';
    
    if (signatureData.startsWith('data:image')) {
      return (
        <img 
          src={signatureData} 
          alt={altText} 
          className="h-10 object-contain mx-auto max-w-full" 
          style={{ maxHeight: '40px', maxWidth: '200px' }}
        />
      );
    }
    
    return <div className={A4_PDF_TYPOGRAPHY.body}>{signatureData}</div>;
  };

  const cellClass = `border border-black px-2 py-2 ${A4_PDF_TYPOGRAPHY.tableCell}`;

  return (
    <A4PageWrapper>
      <div className="flex flex-col w-full h-full px-6 pt-[1mm] pb-[1mm] font-montserrat justify-between" style={{ minHeight: "100%", height: "100%" }}>
        
        <StandardHeader images={images} /> 

        {/* Authorization and Signatures Table */}
        <div className="flex-1 flex flex-col justify-center" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
          <table className={`table-auto border border-black w-full border-collapse ${A4_PDF_TYPOGRAPHY.tableCell}`}>
            <thead>
              <tr className="bg-gray-300">
                <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-center`} colSpan={3}>
                  Authorisation
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Authorization Row */}
              <tr>
                <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.label} text-left`} style={{ width: "25%" }}>
                  Authorised by:
                </td>
                <td className={`${cellClass} text-center`} style={{ width: "50%" }}>
                  <div className={A4_PDF_TYPOGRAPHY.body}>{getValue('authorisedBy')}</div>
                </td>
                <td className={`${cellClass} text-left`} style={{ width: "25%" }}>
                  <span className={A4_PDF_TYPOGRAPHY.label}>Role:</span> <br />
                  <div className={A4_PDF_TYPOGRAPHY.body}>{getValue('role')}</div>
                </td>
              </tr>

              {/* Signature Row */}
              <tr>
                <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.label} text-left`}>
                  Signature:
                </td>
                <td className={`${cellClass} text-center`} style={{ verticalAlign: 'middle', height: '60px' }}>
                  {renderSignature(getValue('signature'), 'Authorized Signature')}
                </td>
                <td className={`${cellClass} text-left`}>
                  <span className={A4_PDF_TYPOGRAPHY.label}>Date:</span> <br />
                  <div className={A4_PDF_TYPOGRAPHY.body}>{getValue('signatureDate')}</div>
                </td>
              </tr>

              {/* Participant/Guardian Signature Row */}
              <tr>
                <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.label} text-left`}>
                  Participant / Guardian Signature:
                </td>
                <td className={`${cellClass} text-center`} style={{ verticalAlign: 'middle', height: '60px' }}>
                  {renderSignature(getValue('guardianSignature'), 'Participant/Guardian Signature')}
                </td>
                <td className={`${cellClass} text-left`}>
                  <span className={A4_PDF_TYPOGRAPHY.label}>Date:</span> <br />
                  <div className={A4_PDF_TYPOGRAPHY.body}>{getValue('guardianDate')}</div>
                </td>
              </tr>

              {/* Copy and Review Row */}
              <tr>
                <td className={`${cellClass} text-left`}>
                  <div className={`${A4_PDF_TYPOGRAPHY.label} mb-2`}>Is a copy supplied to the participant?</div>
                  <div className="flex flex-col gap-1">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={getValue('copySupplied') === 'Yes'}
                        readOnly
                        className="w-3 h-3"
                      />
                      <span className={A4_PDF_TYPOGRAPHY.body}>YES</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={getValue('copySupplied') === 'No'}
                        readOnly
                        className="w-3 h-3"
                      />
                      <span className={A4_PDF_TYPOGRAPHY.body}>NO</span>
                    </label>
                  </div>
                </td>
                <td className={`${cellClass} text-left`}>
                  <div className={`${A4_PDF_TYPOGRAPHY.label} mb-2`}>Copy placed on file?</div>
                  <div className="flex flex-col gap-1">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={getValue('copyOnFile') === 'Yes'}
                        readOnly
                        className="w-3 h-3"
                      />
                      <span className={A4_PDF_TYPOGRAPHY.body}>YES</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={getValue('copyOnFile') === 'No'}
                        readOnly
                        className="w-3 h-3"
                      />
                      <span className={A4_PDF_TYPOGRAPHY.body}>NO</span>
                    </label>
                  </div>
                </td>
                <td className={`${cellClass} text-left`}>
                  <div className={A4_PDF_TYPOGRAPHY.label}>Date for Review:</div>
                  <div className={A4_PDF_TYPOGRAPHY.body}>{getValue('reviewDate')}</div>
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

export default Page13;
