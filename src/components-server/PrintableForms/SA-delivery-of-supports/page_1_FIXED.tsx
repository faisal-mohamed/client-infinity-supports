import React from 'react';
import A4PageWrapper from "./A4PageWrapper";
import { format, parseISO, isValid } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

// --- Standardized Header Component ---
const StandardHeader = ({ images, title }: { images?: any, title?: string }) => (
  <div className="flex flex-col items-center gap-2">
    <img
      src={images?.infinityLogo || "/infinity_logo.png"}
      alt="Logo"
      width={STANDARD_LOGO.width}
      height={STANDARD_LOGO.height}
      className={STANDARD_LOGO.className}
    /> <br /><br />
    {title && (
      <h2 className={`${A4_PDF_TYPOGRAPHY.title} text-center underline`}>
        {title}
      </h2>
    )}
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
      <span>{settings?.sa_delivery_of_supports}</span>
      <span>Review Date: {formatDate(settings?.review_date)}</span>
    </div>
  );
};

const Page1: React.FC<any> = ({
  schema,
  data,
  settings,
  commonFieldsData,
  images,
}) => {
  const commonFieldMapping: Record<string, string> = {
    givenNames: 'name',
    address: 'street',
    dob: 'dob',
    disability: 'disability',
    ndisNumber: 'ndis',
    state: 'state',
    street: 'street',
    postcode: 'postCode',
    email: 'email',
    phone: 'phone',
    sex: 'sex'
  };

  const getValue = (key: string): string => {
    const rawValue = commonFieldMapping[key]
      ? commonFieldsData?.[commonFieldMapping[key]]
      : data?.[key];

    // Convert YYYY-MM-DD to DD-MM-YYYY if valid
    if (typeof rawValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
      const parsed = parseISO(rawValue);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }

    return rawValue ?? "";
  };

  const cellClass = `border border-black px-2 py-2 ${A4_PDF_TYPOGRAPHY.tableCell}`;

  return (
    <A4PageWrapper>
      <div className="flex flex-col w-full h-full px-6 pt-[1mm] pb-[1mm] font-montserrat justify-between" style={{ minHeight: "100%", height: "100%" }}>
        
        <StandardHeader 
          images={images} 
          title="SERVICE AGREEMENT FOR SERVICE DELIVERY" 
        /> 

        {/* Content Area */}
        <div className="flex-1 flex flex-col" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
          
          {/* Section Header */}
          <div className="mb-4">
            <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} underline`}>Section 1</p>
          </div>

          {/* Main Form Table */}
          <div className="mb-4">
            <table className={`table-auto border border-black w-full border-collapse ${A4_PDF_TYPOGRAPHY.tableCell}`}>
              <tbody>
                {/* Date Row */}
                <tr>
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.label} align-top w-1/5`}>
                    Date:
                  </td>
                  <td className={`${cellClass} align-top`} colSpan={3}>
                    <div className={A4_PDF_TYPOGRAPHY.body}>{getValue('agreementDate')}</div>
                  </td>
                </tr>
                
                {/* Participant Details Header */}
                <tr className="bg-gray-300">
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} align-top`} colSpan={3}>
                    Participant Details
                  </td>
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-right align-top`}>
                    NDIS Number: <span className={A4_PDF_TYPOGRAPHY.body}>{getValue('ndisNumber')}</span>
                  </td>
                </tr>
                
                {/* Name and Sex Row */}
                <tr>
                  <td className={`${cellClass} align-top`}>
                    <div className={A4_PDF_TYPOGRAPHY.label}>Surname:</div>
                    <div className={A4_PDF_TYPOGRAPHY.body}>{getValue('surname')}</div>
                  </td>
                  <td className={`${cellClass} align-top`}>
                    <div className={A4_PDF_TYPOGRAPHY.label}>Given name(s):</div>
                    <div className={A4_PDF_TYPOGRAPHY.body}>{getValue('givenNames')}</div>
                  </td>
                  <td className={`${cellClass} align-top`} colSpan={2}>
                    <div className={`${A4_PDF_TYPOGRAPHY.label} mb-2`}>Sex:</div>
                    <div className="space-y-1">
                      {['Male', 'Female', 'Prefer not to say', 'Others'].map(option => (
                        <label key={option} className={`flex items-center gap-2 ${A4_PDF_TYPOGRAPHY.body}`}>
                          <input
                            type="checkbox"
                            readOnly
                            checked={getValue('sex') === option}
                            className="w-3 h-3"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
                
                {/* Pronoun Row */}
                <tr>
                  <td className={`${cellClass} align-top`} colSpan={4}>
                    <div className={A4_PDF_TYPOGRAPHY.label}>Pronoun:</div>
                    <div className={A4_PDF_TYPOGRAPHY.body}>{getValue('pronoun')}</div>
                  </td>
                </tr>
                
                {/* Indigenous Status Row */}
                <tr>
                  <td className={`${cellClass} align-top`} colSpan={3}>
                    <div className={A4_PDF_TYPOGRAPHY.label}>Are you an Aboriginal or Torres Strait Islander descent?</div>
                  </td>
                  <td className={`${cellClass} align-top`}>
                    <div className="space-y-1">
                      <label className={`flex items-center gap-2 ${A4_PDF_TYPOGRAPHY.body}`}>
                        <input
                          type="checkbox"
                          readOnly
                          checked={getValue('indigenousStatus') === 'Yes'}
                          className="w-3 h-3"
                        />
                        Yes
                      </label>
                      <label className={`flex items-center gap-2 ${A4_PDF_TYPOGRAPHY.body}`}>
                        <input
                          type="checkbox"
                          readOnly
                          checked={getValue('indigenousStatus') === 'No'}
                          className="w-3 h-3"
                        />
                        No
                      </label>
                    </div>
                  </td>
                </tr>
                
                {/* Preferred Name and DOB Row */}
                <tr>
                  <td className={`${cellClass} align-top`} colSpan={2}>
                    <div className={A4_PDF_TYPOGRAPHY.label}>Preferred name:</div>
                    <div className={A4_PDF_TYPOGRAPHY.body}>{getValue('preferredName')}</div>
                  </td>
                  <td className={`${cellClass} align-top`} colSpan={2}>
                    <div className={A4_PDF_TYPOGRAPHY.label}>Date of Birth:</div>
                    <div className={A4_PDF_TYPOGRAPHY.body}>{getValue('dob')}</div>
                  </td>
                </tr>
                
                {/* Address Header */}
                <tr className="bg-gray-300">
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} align-top`} colSpan={4}>
                    Residential Address Details
                  </td>
                </tr>
                
                {/* Street Address Row */}
                <tr>
                  <td className={`${cellClass} align-top`} colSpan={4}>
                    <div className={A4_PDF_TYPOGRAPHY.label}>Number / Street:</div>
                    <div className={A4_PDF_TYPOGRAPHY.body}>{getValue('street')}</div>
                  </td>
                </tr>
                
                {/* State and Postcode Row */}
                <tr>
                  <td className={`${cellClass} align-top`} colSpan={2}>
                    <div className={A4_PDF_TYPOGRAPHY.label}>State:</div>
                    <div className={A4_PDF_TYPOGRAPHY.body}>{getValue('state')}</div>
                  </td>
                  <td className={`${cellClass} align-top`} colSpan={2}>
                    <div className={A4_PDF_TYPOGRAPHY.label}>Postcode:</div>
                    <div className={A4_PDF_TYPOGRAPHY.body}>{getValue('postcode')}</div>
                  </td>
                </tr>
                
                {/* Contact Details Header */}
                <tr className="bg-gray-300">
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} align-top`} colSpan={4}>
                    Participant Contact Details
                  </td>
                </tr>
                
                {/* Email Row */}
                <tr>
                  <td className={`${cellClass} align-top`} colSpan={4}>
                    <div className={A4_PDF_TYPOGRAPHY.label}>Email address:</div>
                    <div className={A4_PDF_TYPOGRAPHY.body}>{getValue('email')}</div>
                  </td>
                </tr>
                
                {/* Phone Numbers Row */}
                <tr>
                  <td className={`${cellClass} align-top`} colSpan={2}>
                    <div className={A4_PDF_TYPOGRAPHY.label}>Home Phone No:</div>
                    <div className={A4_PDF_TYPOGRAPHY.body}>{getValue('homePhone')}</div>
                  </td>
                  <td className={`${cellClass} align-top`} colSpan={2}>
                    <div className={A4_PDF_TYPOGRAPHY.label}>Mobile No:</div>
                    <div className={A4_PDF_TYPOGRAPHY.body}>{getValue('phone')}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bottom Text - Immediately after table */}
          <div>
            <p className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify`}>
              All figures quoted are based on NDIS price guide. This Service Agreement is made for the purpose
              of providing supports in accordance with the Individual's plan, it outlines key responsibilities required
              to enable <span className="text-red-600 font-semibold">Infinity Supports WA</span> to deliver quality support to
              individuals with disabilities.
            </p>
          </div>
        </div>

        <Footer settings={settings} />
      </div>
    </A4PageWrapper>
  );
};

export default Page1;
