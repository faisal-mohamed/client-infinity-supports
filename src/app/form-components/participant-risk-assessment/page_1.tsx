import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { format, parseISO, isValid } from "date-fns";

interface Page1Props {
  schema: any;
  formData: Record<string, string>;
  commonFieldsData: Record<string, string>;
  settings: any;
}

const Page1: React.FC<Page1Props> = ({
  formData,
  schema,
  commonFieldsData,
  settings,
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
  };

  const getValue = (key: string) => {
    if (commonFieldMapping?.[key]) {
      return commonFieldsData?.[commonFieldMapping?.[key]] ?? "";
    }
    return formData?.[key] ?? "";
  };

  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full text-xs font-sans">
        {/* Logo */}
        <div className="flex justify-center pb-4">
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA logo"
            className="h-[60px] w-[150px] object-contain"
          />
        </div>

        {/* Title */}
        <h2 className="text-center text-lg font-semibold mb-4 leading-tight uppercase">
          Participant Risk Assessment and Disaster Management Plan
        </h2>

        {/* Participant Details */}
        <div className="flex-1 flex flex-col px-6">
          <table className="w-full border border-black border-collapse text-xs flex-1">
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
                <td className="border border-black p-1 font-bold">
                  Given name/s: 
                </td>
                <td className="border border-black p-1">
                  {getValue("givenNames")}
                </td>
                <td className="border border-black p-1"><strong>Family name:</strong> {getValue("familyName")}</td>
              </tr>
              <tr>
                <td className="border border-black p-1 font-bold">
                  Preferred name: 
                </td>
                <td className="border border-black p-1">
                  {getValue("preferredName")}
                </td>
                <td className="border border-black p-1"><strong>Date of birth:</strong> {getValue("dob")}</td>
              </tr>
              <tr>
                <td className="border border-black p-1 font-bold">
                  Address: 
                </td>
                <td className="border border-black p-1">
                  {getValue("address")}
                </td>
                <td className="border border-black p-1"><strong>Phone No:</strong> {getValue("phoneNumber")}</td>
              </tr>
              <tr>
                <td className="border border-black p-1 font-bold">
                  Preferred contact method: 
                </td>
                <td className="border border-black p-1">
                  {getValue("preferredContact")}
                </td>
                <td className="border border-black p-1"><strong>Email:</strong> {getValue("email")}</td>
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
                <td className="border border-black p-2 font-bold">
                  Name/s: 
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
                <td className="border border-black p-2 font-bold">
                  Was the participant involved in the assessment?
                </td>
                <td className="border border-black p-2">
                  <div className="flex flex-col gap-1">
                    <label className="inline-flex items-center space-x-1">
                      <input
                        type="checkbox"
                        checked={formData?.participantInvolved === "Yes"}
                        readOnly
                      />
                      <span className="text-xs">Yes</span>
                    </label>
                    <label className="inline-flex items-center space-x-1">
                      <input
                        type="checkbox"
                        checked={formData?.participantInvolved === "No"}
                        readOnly
                      />
                      <span className="text-xs">No</span>
                    </label>
                  </div>
                </td>
                <td className="border border-black p-2">
                  <strong>Reason:</strong>{" "}
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

        {/* Footer */}
        <div className="pt-4">
          <div className="flex justify-between text-xs px-2">
            <div>Website: {settings?.company_website}</div>
            <div>{settings?.participant_risk_assessment}</div>
            <div>
              Review Date:{" "}
              {settings?.review_date &&
              /^\d{4}-\d{2}-\d{2}$/.test(settings.review_date)
                ? format(parseISO(settings.review_date), "dd-MM-yyyy")
                : "N/A"}
            </div>
          </div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page1;
