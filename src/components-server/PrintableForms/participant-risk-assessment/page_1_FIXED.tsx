import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { parseISO, isValid, format } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

interface Page1Props {
  schema: any;
  formData: Record<string, string>;
  commonFieldsData: Record<string, string>;
  settings: any;
  images?: any;
}

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
  homePhone: "phone",
  sex: "sex",
  familyName: 'surname'
};

// --- Standardized Header Component ---
const StandardHeader = ({ images, title }: { images?: any, title?: string }) => (
  <div className="flex flex-col gap-[2px]">
    <div className="flex justify-center">
      <img
        src={images?.infinityLogo || "/infinity_logo.png"}
        alt="Logo"
        width={STANDARD_LOGO.width}
        height={STANDARD_LOGO.height}
        className={STANDARD_LOGO.className}
      />
    </div>
    <div className={`text-center ${A4_PDF_TYPOGRAPHY.title} mt-1 uppercase`}>
      Participant Risk Assessment and Disaster Management Plan
    </div>
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

const Page1: React.FC<Page1Props> = ({
  formData,
  schema,
  commonFieldsData,
  settings,
  images,
}) => {
  const getValue = (key: string) => {
    if (commonFieldMapping?.[key]) {
      return commonFieldsData?.[commonFieldMapping[key]] ?? "";
    }
    return formData?.[key] ?? "";
  };

  const cellClass = `border border-black px-1 py-0.5 leading-none ${A4_PDF_TYPOGRAPHY.tableCell}`;

  return (
    <A4PageWrapper>
      <div className="flex flex-col w-full h-full px-1 pt-[1mm] pb-[1mm] font-montserrat justify-between" style={{ minHeight: "100%", height: "100%" }}>
        
        <StandardHeader images={images} />

        {/* Table content */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ maxHeight: "210mm", pageBreakInside: "avoid", breakInside: "avoid" }}>
          <table className={`table-fixed border border-black w-full border-collapse ${A4_PDF_TYPOGRAPHY.tableCell}`} style={{ pageBreakInside: "avoid", breakInside: "avoid", height: "100%" }}>
            
            {/* Participant Details */}
            <thead>
              <tr className="bg-gray-300">
                <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left w-[40%]`}>
                  PARTICIPANT DETAILS
                </th>
                <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left`} colSpan={2}>
                  NDIS Number: {getValue("ndisNumber")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.label}`}>
                  Given name/s:
                </td>
                <td className={cellClass}>
                  {getValue("givenNames")}
                </td>
                <td className={cellClass}>
                  <span className={A4_PDF_TYPOGRAPHY.label}>Family name:</span> {getValue("familyName")}
                </td>
              </tr>
              <tr>
                <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.label}`}>
                  Preferred name:
                </td>
                <td className={cellClass}>
                  {getValue("preferredName")}
                </td>
                <td className={cellClass}>
                  <span className={A4_PDF_TYPOGRAPHY.label}>Date of birth:</span> {getValue("dob")}
                </td>
              </tr>
              <tr>
                <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.label}`}>
                  Address:
                </td>
                <td className={cellClass}>
                  {getValue("address")}
                </td>
                <td className={cellClass}>
                  <span className={A4_PDF_TYPOGRAPHY.label}>Phone No:</span> {getValue("phoneNumber")}
                </td>
              </tr>
              <tr>
                <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.label}`}>
                  Preferred contact method:
                </td>
                <td className={cellClass}>
                  {getValue("preferredContact")}
                </td>
                <td className={cellClass}>
                  <span className={A4_PDF_TYPOGRAPHY.label}>Email:</span> {getValue("email")}
                </td>
              </tr>
            </tbody>

            {/* Medical Conditions */}
            <thead>
              <tr className="bg-gray-300">
                <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left`} colSpan={3}>
                  KNOWN MEDICAL CONDITIONS OR ALLERGIES
                </th>
              </tr>
              <tr className="bg-gray-200">
                <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left w-1/3`}>
                  Specify
                </th>
                <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left w-1/3`}>
                  Effect
                </th>
                <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left w-1/3`}>
                  Treatment
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((num) => (
                <tr key={num}>
                  <td className={`${cellClass} w-1/3`} style={{ minHeight: '30px', height: '30px' }}>
{getValue(`medicalSpecify${num}`)}                  </td>
                  <td className={`${cellClass} w-1/3`} style={{ minHeight: '30px', height: '30px' }}>
                    {getValue(`medicalEffect${num}`)}
                  </td>
                  <td className={`${cellClass} w-1/3`} style={{ minHeight: '30px', height: '30px' }}>
                    {getValue(`medicalTreatment${num}`)}
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Emergency Contact */}
            <thead>
              <tr className="bg-gray-300">
                <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left`} colSpan={3}>
                  EMERGENCY CONTACT
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.label}`}>
                  Name/s:
                </td>
                <td className={cellClass}>
                  {getValue("emergencyContactName")}
                </td>
                <td className={cellClass}>
                  <span className={A4_PDF_TYPOGRAPHY.label}>Phone:</span> {getValue("emergencyContactPhone")}
                </td>
              </tr>
              <tr>
                <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.label}`}>
                  Email:
                </td>
                <td className={cellClass} colSpan={2}>
                  {getValue("emergencyContactEmail")}
                </td>
              </tr>
            </tbody>

            {/* Persons Involved */}
            <thead>
              <tr className="bg-gray-300">
                <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left`} colSpan={3}>
                  PERSONS INVOLVED IN DEVELOPING THIS PLAN
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.label}`}>
                  Was participant involved?
                </td>
                <td className={cellClass}>
                  {getValue("participantInvolved")}
                </td>
                <td className={cellClass}>
                  <span className={A4_PDF_TYPOGRAPHY.label}>Reason:</span> {getValue("participantInvolvedReason")}
                </td>
              </tr>
              <tr>
                <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.label}`}>
                  Staff involved:
                </td>
                <td className={cellClass} colSpan={2}>
                  {getValue("staffInvolved")}
                </td>
              </tr>
              <tr>
                <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.label}`}>
                  Others involved:
                </td>
                <td className={cellClass} colSpan={2}>
                  {getValue("othersInvolved")}
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

export default Page1;
