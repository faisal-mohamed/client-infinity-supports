import React from 'react';
import A4PageWrapper from "./A4PageWrapper_FIXED";
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
    />
    {title && (
      <h2 className="text-xs font-bold font-montserrat text-center underline mt-4">
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
    <div className="flex justify-between text-xs font-normal font-montserrat px-1 text-gray-600">
      <span>Website: {settings?.company_website}</span>
      <span>{settings?.sa_support_coordination}</span>
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
    givenNames: "name",
    address: "street",
    dob: "dob",
    disability: "disability",
    phoneNumber: "phone",
    ndisNumber: "ndis",
    state: "state",
    street: "street",
    postcode: "postCode",
    email: "email",
    mobile: "phone",
    sex: "sex",
  };

  const getValue = (key: string): string => {
    const commonKey = commonFieldMapping[key];
    const rawValue =
      commonKey && commonFieldsData?.[commonKey] != null
        ? commonFieldsData[commonKey]
        : data?.[key];

    // Convert YYYY-MM-DD to DD-MM-YYYY if valid
    if (typeof rawValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
      const parsed = parseISO(rawValue);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }

    return rawValue?.toString() ?? "";
  };

  const cellClass = `border border-black px-2 py-3 text-xs font-normal font-montserrat`;
  const headerClass = `border border-black px-2 py-3 text-xs font-bold font-montserrat bg-gray-300`;

  return (
    <A4PageWrapper>
      <div className="flex flex-col w-full h-full px-6 pt-[1mm] pb-[1mm] font-montserrat justify-between" style={{ minHeight: "100%", height: "100%" }}>
        
        <div className="flex-1">
          <StandardHeader 
            images={images} 
            title="SERVICE AGREEMENT SUPPORT COORDINATION" 
          />

          {/* Content Area - No flex-1, content flows naturally */}
          <div style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
            
            {/* Section Header */}
            <div className="mb-4 text-center">
              <p className="text-xs font-bold font-montserrat underline">SECTION 1</p>
            </div>

            {/* Main Form Table - No flex-1, natural height */}
            <div>
              <table className="table-auto border border-black w-full border-collapse text-xs font-montserrat">
                <tbody>
                  {/* Date Row */}
                  <tr style={{ height: "40px" }}>
                    <td className={`${cellClass} font-bold align-top`} style={{ width: "20%" }}>
                      Date:
                    </td>
                    <td className={`${cellClass} align-top`} colSpan={3}>
                      <div>{getValue('date')}</div>
                    </td>
                  </tr>
                  
                  {/* Participant Details Header */}
                  <tr style={{ height: "40px" }}>
                    <td className={`${headerClass} align-top`} colSpan={2} style={{ width: "50%" }}>
                      Participant Details
                    </td>
                    <td className={`${headerClass} align-top text-right`} colSpan={2} style={{ width: "50%" }}>
                      NDIS Number: <span className="font-normal">{getValue('ndisNumber')}</span>
                    </td>
                  </tr>
                  
                  {/* Name and Sex Row */}
                  <tr style={{ height: "60px" }}>
                    <td className={`${cellClass} align-top`}>
                      <div className="font-bold">Surname:</div>
                      <div>{getValue('surname')}</div>
                    </td>
                    <td className={`${cellClass} align-top`}>
                      <div className="font-bold">Given name(s):</div>
                      <div>{getValue('givenNames')}</div>
                    </td>
                    <td className={`${cellClass} align-top`} colSpan={2}>
                      <div className="font-bold mb-2">Sex:</div>
                      <div className="space-y-1">
                        {['Male', 'Female', 'Prefer not to say', 'Others'].map(option => (
                          <label key={option} className="flex items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              readOnly
                              checked={getValue('sex') === option}
                              className="w-3 h-3 scale-75"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </td>
                  </tr>

                  {/* Pronoun Row */}
                  <tr style={{ height: "40px" }}>
                    <td className={`${cellClass} align-top`} colSpan={4}>
                      <span className="font-bold">Pronoun:</span> {getValue('pronoun')}
                    </td>
                  </tr>

                  {/* Indigenous Status Row */}
                  <tr style={{ height: "50px" }}>
                    <td className={`${cellClass} align-top`} colSpan={3}>
                      <div className="font-bold">Are you of Aboriginal or Torres Strait Islander descent?</div>
                    </td>
                    <td className={`${cellClass} align-top`}>
                      <div className="flex gap-4">
                        {['Yes', 'No'].map(option => (
                          <label key={option} className="flex items-center gap-1 text-xs">
                            <input
                              type="checkbox"
                              readOnly
                              checked={getValue('indigenousDescent') === option}
                              className="w-3 h-3 scale-75"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </td>
                  </tr>

                  {/* Preferred Name and DOB Row */}
                  <tr style={{ height: "40px" }}>
                    <td className={`${cellClass} align-top`} colSpan={2}>
                      <span className="font-bold">Preferred name:</span> {getValue('preferredName')}
                    </td>
                    <td className={`${cellClass} align-top`} colSpan={2}>
                      <span className="font-bold">Date of Birth:</span> {getValue('dob')}
                    </td>
                  </tr>

                  {/* Residential Address Header */}
                  <tr style={{ height: "40px" }}>
                    <td className={`${headerClass} align-top`} colSpan={4}>
                      Residential Address Details
                    </td>
                  </tr>

                  {/* Address Row */}
                  <tr style={{ height: "40px" }}>
                    <td className={`${cellClass} align-top`} colSpan={4}>
                      <span className="font-bold">Number / Street:</span> {getValue('address')}
                    </td>
                  </tr>

                  {/* State and Postcode Row */}
                  <tr style={{ height: "40px" }}>
                    <td className={`${cellClass} align-top`} colSpan={2}>
                      <span className="font-bold">State:</span> {getValue('state') || 'WA'}
                    </td>
                    <td className={`${cellClass} align-top`} colSpan={2}>
                      <span className="font-bold">Postcode:</span> {getValue('postcode')}
                    </td>
                  </tr>

                  {/* Contact Details Header */}
                  <tr style={{ height: "40px" }}>
                    <td className={`${headerClass} align-top`} colSpan={4}>
                      Participant Contact Details
                    </td>
                  </tr>

                  {/* Email Row */}
                  <tr style={{ height: "40px" }}>
                    <td className={`${cellClass} align-top`} colSpan={4}>
                      <span className="font-bold">Email address:</span> {getValue('email')}
                    </td>
                  </tr>

                  {/* Phone Numbers Row */}
                  <tr style={{ height: "40px" }}>
                    <td className={`${cellClass} align-top`} colSpan={2}>
                      <span className="font-bold">Home Phone No:</span> {getValue('homePhone')}
                    </td>
                    <td className={`${cellClass} align-top`} colSpan={2}>
                      <span className="font-bold">Mobile No:</span> {getValue('mobile')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <br /><br />

            {/* Checkboxes Section - Starts immediately after table */}
            <div className="mt-4 space-y-2">
              <label className="flex items-start gap-3 text-xs font-normal font-montserrat">
                <input
                  type="checkbox"
                  readOnly
                  checked={!!data?.noCopyRequested}
                  className="w-4 h-4 mt-1 flex-shrink-0 scale-75"
                />
                <span className="leading-relaxed">
                  &nbsp; Participant may wish not to receive a copy of this agreement. In this case, they shall tick the dedicated tick box at the end of the service agreement and sign the document.
                </span>
              </label> <br /><br />
              
              <label className="flex items-start gap-3 text-xs font-normal font-montserrat">
                <input
                  type="checkbox"
                  readOnly
                  checked={!!data?.planAttached}
                  className="w-4 h-4 mt-1 flex-shrink-0 scale-75"
                />
                <span className="leading-relaxed">
                  &nbsp; A copy of the Individual's plan is attached to this Service Agreement.
                </span>
              </label>

              <br /><br />
              
              <label className="flex items-start gap-3 text-xs font-normal font-montserrat">
                <input
                  type="checkbox"
                  readOnly
                  checked={!!data?.planNotAttached}
                  className="w-4 h-4 mt-1 flex-shrink-0 scale-75"
                />
                <span className="leading-relaxed">
                  &nbsp; Individual chooses not to attach their plan.
                </span>
              </label>
            </div>
            <br /><br />

            {/* Static Text - Flows immediately after checkboxes */}
            <div className="mt-4">
              <p className="text-xs font-normal font-montserrat leading-relaxed">
                The Parties agree that this Service Agreement is made in line with the funding body which provides the Individual's funding, which aims to:
              </p>
            </div>
          </div>
        </div>

        {/* Footer - Only this sticks to bottom */}
        <Footer settings={settings} />
      </div>
    </A4PageWrapper>
  );
};

export default Page1;
