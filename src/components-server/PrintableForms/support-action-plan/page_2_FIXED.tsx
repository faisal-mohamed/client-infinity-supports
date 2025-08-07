import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { parseISO, isValid, format } from 'date-fns';
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

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

const Page2: React.FC<any> = ({ data, settings, images }) => {

  const renderYesNoCheckbox = (value: string) => (
    <div className={`flex gap-6 ${A4_PDF_TYPOGRAPHY.tableCell}`}>
      <label className="flex items-center gap-1">
        <span className={A4_PDF_TYPOGRAPHY.label}>Yes</span>
        <input type="checkbox" checked={value === 'Yes'} readOnly />
      </label>
      <label className="flex items-center gap-1">
        <span className={A4_PDF_TYPOGRAPHY.label}>No</span>
        <input type="checkbox" checked={value === 'No'} readOnly />
      </label>
    </div>
  );

  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full min-h-full box-border font-montserrat" style={{ height: '100%', minHeight: '100%', paddingLeft: '40px', paddingRight: '40px', paddingTop: '24px', paddingBottom: '24px' }}>
        
        <StandardHeader images={images} />

        {/* Main Content */}
        <div className={`flex-1 min-h-0 leading-relaxed ${A4_PDF_TYPOGRAPHY.tableCell}`}>
          <table className="w-full border border-black border-collapse">
            <tbody>
              <tr>
                <td className={`border border-black ${A4_PDF_TYPOGRAPHY.sectionHeader} p-3 uppercase`} style={{backgroundColor: '#a9c1e0'}}>
                  4.	Consider, what support is required to assist you to achieve your goals? Are there any barriers preventing you from achieving your goals?
                </td>
              </tr>
              <tr>
                <td className={`border border-black ${A4_PDF_TYPOGRAPHY.sectionHeader} p-3 uppercase`} style={{backgroundColor: '#a9c1e0'}}>
                  Core Supports
                </td>
              </tr>
              <tr>
                <td className={`border border-black p-3 ${A4_PDF_TYPOGRAPHY.tableCell}`}>
                                    <span className={A4_PDF_TYPOGRAPHY.label}>Support Required  &nbsp;</span>

                  {data?.coreSupportText}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-3">
                  <span className={A4_PDF_TYPOGRAPHY.label}>Preferred providers</span>
                  <br />
                  <span className={A4_PDF_TYPOGRAPHY.tableCell}>
                    1. {data?.corePreferredProviders} <br />
                    2. {data?.corePreferredProviders2}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-3">
                  <span className={A4_PDF_TYPOGRAPHY.label}>Alternative providers</span>
                  <br />
                  <span className={A4_PDF_TYPOGRAPHY.tableCell}>
                    1. {data?.coreAlternativeProviders} <br />
                    2. {data?.coreAlternativeProviders2}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-3">
                  <span className={A4_PDF_TYPOGRAPHY.label}>Service Agreement developed/signed?</span>
                  <br />
                  {renderYesNoCheckbox(data?.coreAgreementSigned)}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-3">
                  <span className={A4_PDF_TYPOGRAPHY.label}>Supports have commenced</span>
                  <br />
                  <span className={A4_PDF_TYPOGRAPHY.tableCell}>{data?.coreSupportsCommenced}</span>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-3">
                  <span className={A4_PDF_TYPOGRAPHY.label}>Discussion held with Plan Manager and budget approved?</span>
                  <br />
                  {renderYesNoCheckbox(data?.coreBudgetApproved)}
                </td>
              </tr>

              <tr>
                <td className={`border border-black ${A4_PDF_TYPOGRAPHY.sectionHeader} p-3 uppercase`} style={{backgroundColor: '#a9c1e0'}}>
                  Capacity Building
                </td>
              </tr>
              <tr>
                <td className={`border border-black p-3 ${A4_PDF_TYPOGRAPHY.tableCell}`}>
                                                      <span className={A4_PDF_TYPOGRAPHY.label}>Support Required &nbsp; </span>

                  {data?.capacitySupportText}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-3">
                  <span className={A4_PDF_TYPOGRAPHY.label}>Preferred providers</span>
                  <br />
                  <span className={A4_PDF_TYPOGRAPHY.tableCell}>
                    1. {data?.capacityPreferredProviders} <br />
                    2. {data?.capacityPreferredProviders2}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-3">
                  <span className={A4_PDF_TYPOGRAPHY.label}>Alternative providers</span>
                  <br />
                  <span className={A4_PDF_TYPOGRAPHY.tableCell}>
                    1. {data?.capacityAlternativeProviders} <br />
                    2. {data?.capacityAlternativeProviders2}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-3">
                  <span className={A4_PDF_TYPOGRAPHY.label}>Service Agreement developed/signed?</span>
                  <br />
                  {renderYesNoCheckbox(data?.capacityAgreementSigned)}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-3">
                  <span className={A4_PDF_TYPOGRAPHY.label}>Supports in place at start of plan</span>
                  <br />
                  <span className={A4_PDF_TYPOGRAPHY.tableCell}>{data?.capacitySupportsInPlace}</span>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-3">
                  <span className={A4_PDF_TYPOGRAPHY.label}>Are additional assessments required to access this support type?</span>
                  <br />
                  {renderYesNoCheckbox(data?.capacityAssessmentRequired)}
                </td>
              </tr>
              {data?.capacityAssessmentRequired === 'Yes' && (
                <tr>
                  <td className="border border-black p-3">
                    <span className={A4_PDF_TYPOGRAPHY.label}>If Yes - Actions</span>
                    <br />
                    <span className={A4_PDF_TYPOGRAPHY.tableCell}>{data?.capacityActions}</span>
                  </td>
                </tr>
              )}
              <tr>
                <td className="border border-black p-3">
                  <span className={A4_PDF_TYPOGRAPHY.label}>Discussion held with Plan Manager and budget approved?</span>
                  <br />
                  {renderYesNoCheckbox(data?.capacityBudgetApproved)}
                </td>
              </tr>

              <tr>
                <td className={`border border-black ${A4_PDF_TYPOGRAPHY.sectionHeader} p-3 uppercase`} style={{backgroundColor: '#a9c1e0'}}>
                  Capital
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

export default Page2;
