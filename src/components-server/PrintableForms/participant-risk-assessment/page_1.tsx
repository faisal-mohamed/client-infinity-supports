import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { format, parseISO, isValid } from "date-fns";

interface Page1Props {
  schema: any;
  formData: Record<string, string>;
  commonFieldsData: Record<string, string>;
  settings: any;
  images?: any;
}

const Page1: React.FC<Page1Props> = ({
  formData,
  schema,
  commonFieldsData,
  settings,
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
    homePhone: "phone",
    sex: "sex",
        familyName: 'surname'

  };

  const getValue = (key: string) => {
    if (commonFieldMapping?.[key]) {
      return commonFieldsData?.[commonFieldMapping[key]] ?? "";
    }
    return formData?.[key] ?? "";
  };

  const footer = (
    <div className="flex justify-between text-xs px-2">
      <div>Website: {settings?.company_website}</div>
      <div>{settings?.participant_risk_assessment}</div>
      <div>
        Review Date:{" "}
        {settings?.review_date &&
        /^\d{4}-\d{2}-\d{2}$/.test(settings.review_date)
          ? format(parseISO(settings.review_date), "dd-MM-yyyy")
          : "N/A"}
      </div>{" "}
    </div>
  );

  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full text-sm font-sans">
        {/* Logo */}
        <div className="flex justify-center pt-6">
          <img
            src={images?.infinityLogo || "/infinity_logo.png"}
            alt="Infinity Supports WA logo"
            className="h-[60px] w-[150px] object-contain mb-4"
          />
        </div>

        {/* Title */}
        <h2 className="text-center text-lg font-semibold mb-4 leading-tight uppercase">
          Participant Risk Assessment and Disaster Management Plan
        </h2>

        {/* Table content with vertical stretch */}
        <div className="flex-1 flex flex-col px-6">
          <table className="w-full border border-black border-collapse text-sm flex-1">
            {/* Participant Details */}
            <thead>
              <tr className="bg-gray-300 font-bold text-left">
                <th className="border border-black p-2 w-[40%]">
                  PARTICIPANT DETAILS
                </th>
                <th className="border border-black p-2" colSpan={2}>
                  NDIS Number: {getValue("ndisNumber")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-2">
                  <strong>Given name/s:</strong> 
                </td>
                <td className="border border-black p-2">
                  {getValue("givenNames")}
                </td>
                <td className="border border-black p-2"><strong>Family name:</strong> {getValue("familyName")}</td>
              </tr>
              <tr>
                <td className="border border-black p-2">
                  <strong>Preferred name:</strong> 
                </td>
                <td className="border border-black p-2">
                  {getValue("preferredName")}
                </td>
                <td className="border border-black p-2"><strong>Date of birth:</strong> {getValue("dob")}</td>
              </tr>
              <tr>
                <td className="border border-black p-2">
                  <strong>Address: </strong>
                </td>
                <td className="border border-black p-2">
                  {getValue("address")}
                </td>
                <td className="border border-black p-2"><strong>Phone No:</strong> {getValue("phoneNumber")}</td>
              </tr>
              <tr>
                <td className="border border-black p-2">
                  <strong>Preferred contact method:</strong> 
                </td>
                <td className="border border-black p-2">
                  {getValue("preferredContact")}
                </td>
                <td className="border border-black p-2"><strong>Email:</strong> {getValue("email")}</td>
              </tr>
            </tbody>

            {/* Medical Conditions */}
            <thead>
              <tr className="bg-gray-300 font-bold text-left">
                <th className="border border-black p-2" colSpan={3}>
                  KNOWN MEDICAL CONDITIONS OR ALLERGIES
                </th>
              </tr>
              <tr className="bg-gray-200 font-semibold text-left">
                <th className="border border-black p-2 w-1/3 break-words">
                  Specify
                </th>
                <th className="border border-black p-2 w-1/3 break-words">
                  Effect
                </th>
                <th className="border border-black p-2 w-1/3 break-words">
                  Treatment
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((num) => (
                <tr key={num}>
                  <td className="border border-black p-1 w-1/3 break-words">
                    {getValue(`medicalSpecify${num}`)}
                  </td>
                  <td className="border border-black p-1 w-1/3 break-words">
                    {getValue(`medicalEffect${num}`)}
                  </td>
                  <td className="border border-black p-1 w-1/3 break-words">
                    {getValue(`medicalTreatment${num}`)}
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Emergency Contact */}
            <thead>
              <tr className="bg-gray-300 font-bold text-left">
                <th className="border border-black p-2" colSpan={3}>
                  EMERGENCY CONTACTS / CARER / GUARDIAN
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-2">
                  <strong>Name/s:</strong> 
                </td>
                <td className="border border-black p-2">
                  {getValue("emergencyContactName")}
                </td>
                <td className="border border-black p-2"><strong>Phone:</strong> {getValue("emergencyContactPhone")}</td>
              </tr>
              <tr>
                <td className="border border-black p-2" colSpan={3}>
                  <strong>Email:</strong> {getValue("emergencyContactEmail")}
                </td>
              </tr>
            </tbody>

            {/* Persons Involved */}
            <thead>
              <tr className="bg-gray-300 font-bold text-left">
                <th className="border border-black p-2" colSpan={3}>
                  PERSONS INVOLVED IN RISK ASSESSMENT
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-2">
                  <strong>Was the participant involved in the assessment?</strong>
                </td>
                <td className="border border-black p-2">
                  <div className="flex flex-col gap-1">
                    <label className="inline-flex items-center space-x-1">
                      <input
                        type="checkbox"
                        checked={formData?.participantInvolved === "Yes"}
                        readOnly
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                    <label className="inline-flex items-center space-x-1">
                      <input
                        type="checkbox"
                        checked={formData?.participantInvolved === "No"}
                        readOnly
                      />
                      <span className="text-sm">No</span>
                    </label>
                  </div>
                </td>
                <td className="border border-black p-2">
                  Reason:{" "}
                  {getValue("participantInvolved") === "No"
                    ? getValue("participantInvolvedReason")
                    : ""}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2" colSpan={3}>
                  <strong>Staff Involved:</strong> {getValue("staffInvolved")}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2" colSpan={3}>
                  <strong>Others Involved:</strong> {getValue("othersInvolved")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page1;
