import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { format, parseISO, isValid } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

interface Page2Props {
  schema: any;
  data: Record<string, any>;
  commonFieldsData: Record<string, any>;
  settings: Record<string, any>;
  images?: Record<string, string>;
}

const TOTAL_ROWS = 6;

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
      <span>{settings?.company_website || ''}</span>
      <span>Date of Review: {formatDate(settings?.review_date) || 'N/A'}</span>
    </div>
  );
};

const Page2: React.FC<Page2Props> = ({
  schema,
  data,
  commonFieldsData,
  settings,
  images = {},
}) => {
  const commonFieldMapping: Record<string, string> = {
    personName: 'name',
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
    sex: 'sex',
  };

  const getValue = (key: string) => {
    // For personName field, combine first name and surname to show full name
    if (key === 'personName') {
      const firstName = commonFieldsData?.name || '';
      const surname = commonFieldsData?.surname || '';
      const fullName = [firstName, surname].filter(Boolean).join(' ').trim();
      if (fullName) {
        return fullName;
      }
      // Fallback to data.personName if it exists
      if (data?.[key]) {
        return String(data[key]);
      }
      // Last fallback: try to get just the first name from commonFieldsData
      if (firstName) {
        return firstName;
      }
      return '';
    }
    
    if (commonFieldMapping[key]) {
      return commonFieldsData?.[commonFieldMapping[key]] ?? '';
    }
    return data?.[key] ?? '';
  };

  const dataRows = schema?.riskTable || [];
  const displayRows = [...dataRows];
  while (displayRows.length < TOTAL_ROWS) displayRows.push({});

  const cellClass = `border border-black px-2 py-2 ${A4_PDF_TYPOGRAPHY.tableCell}`;

  const footer = (
    <div className={`flex justify-between ${A4_PDF_TYPOGRAPHY.footer} px-2 text-gray-600`}>
      <span>{settings?.company_website || ''}</span>
      <span>Date of Review: {settings?.review_date && /^\d{4}-\d{2}-\d{2}$/.test(settings.review_date) ? format(parseISO(settings.review_date), 'dd-MM-yyyy') : 'N/A'}</span>
    </div>
  );

  return (
    <A4PageWrapper footer={footer}>
      <div className="flex flex-col h-full font-montserrat">
        
        <StandardHeader images={images} /> <br /><br />

        {/* Guideline Section */}
        <div className="px-6 mb-4">
          <div className="space-y-4">
            <div>
              <div className={`${A4_PDF_TYPOGRAPHY.body} mb-2`}>
                <span className="underline font-medium">MODERATE</span>{' '}
                <span style={{ color: '#f97316', fontWeight: 'bold' }}>ORANGE</span>
              </div>
              <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify`}>
                Visit should only proceed after consultation with Director. The risks should be reviewed to consider all the hazards involved. The risks must be reduced prior to the visit – if in doubt, re-classify as High Risk.
              </div>
            </div>
            
            <div>
              <div className={`${A4_PDF_TYPOGRAPHY.body} mb-2`}>
                <span className="underline font-medium">HIGH</span>{' '}
                <span style={{ color: '#dc2626', fontWeight: 'bold' }}>RED</span>
              </div>
              <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify`}>
                Visit must only proceed with Director approval. The risks associated with the visit must be re-assessed & other options considered.
              </div>
            </div>
          </div>
        </div>

        {/* Risk Assessment Table */}
        <div className="flex-1 flex flex-col px-6">
          {/* Title Bar */}
          <div className="bg-gray-400 border border-black px-2 py-2 text-center font-bold mb-0">
            POTENTIAL RISK & CONTROL MEASURES
          </div>
          <table className={`table-fixed border border-black border-t-0 w-full border-collapse ${A4_PDF_TYPOGRAPHY.tableCell} h-full`}>
            <thead className="bg-gray-200">
              <tr>
                <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-center w-1/4`}>
                  Risk Identified
                </th>
                <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-center w-1/6`}>
                  Likelihood
                </th>
                <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-center w-1/6`}>
                  Severity
                </th>
                <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-center w-1/3`}>
                  Control Measures
                </th>
              </tr>
            </thead>
            <tbody>
              {displayRows.map((_, idx) => (
                <tr key={idx} className="align-top" style={{ height: '30mm' }}>
                  <td className={`${cellClass} align-top`}>
                    <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose break-words whitespace-pre-wrap`}>
                      {getValue(`riskIdentified_${idx + 1}`)}
                    </div>
                  </td>
                  <td className={`${cellClass} align-top`}>
                    <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose break-words whitespace-pre-wrap`}>
                      {getValue(`likelihood_${idx + 1}`)}
                    </div>
                  </td>
                  <td className={`${cellClass} align-top`}>
                    <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose break-words whitespace-pre-wrap`}>
                      {getValue(`severity_${idx + 1}`)}
                    </div>
                  </td>
                  <td className={`${cellClass} align-top`}>
                    <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose break-words whitespace-pre-wrap`}>
                      {getValue(`controls_${idx + 1}`)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page2;
