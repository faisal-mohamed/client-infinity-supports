import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { format, parseISO, isValid } from "date-fns";

interface Page1Props {
  data?: any,
  commonFieldsData?: any,
  settings?: any
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
    mobile: "phone",
    sex: "sex",
  };

const Page1: React.FC<Page1Props> = ({ data, commonFieldsData, settings }) => {
  const getValue = (key: string): string => {
  // Check if the key is mapped to a common field
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


  return (
    <A4PageWrapper>
      <div className="h-full flex flex-col p-6">
        {/* Header with Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={"/infinity_logo.png"}
            alt="Infinity Supports WA Logo"
            className="h-16 object-contain"
          />
        </div>

        {/* Title */}
        <div className="text-center mb-4">
          <p className="font-bold underline text-sm">
            SERVICE AGREEMENT SUPPORT COORDINATION
          </p>
          <p className="font-bold underline text-sm mt-1">
            SECTION 1
          </p>
        </div>

        {/* Table - takes up most of the remaining space */}
        <div className="flex-1 flex flex-col">
          <table className="w-full border border-black border-collapse text-sm flex-1">
            <tbody className="h-full">
              <tr>
                <td
                  className="border border-black p-2 font-bold align-top"
                  style={{ width: "20%" }}
                >
                  Date :
                </td>
                <td className="border border-black p-2 align-top" colSpan={3}>
                  {getValue("date")}
                </td>
              </tr>

              <tr className="bg-gray-300 font-bold">
                <td
                  className="border border-black p-2 align-top"
                  style={{ width: "50%" }}
                  colSpan={2}
                >
                  Participant Details
                </td>
                <td
                  className="border border-black p-2 align-top text-right whitespace-nowrap"
                  style={{ width: "50%" }}
                  colSpan={2}
                >
                  NDIS Number:{" "}
                  <span className="font-normal">{getValue("ndisNumber")}</span>
                </td>
              </tr>

              <tr>
                <td className="border border-black p-2 align-top">
                  <strong>Surname</strong>: {getValue("surname")}
                </td>
                <td className="border border-black p-2 align-top">
                  <strong>Given name(s)</strong>: {getValue("givenNames")}
                </td>
                <td className="border border-black p-2 align-top" colSpan={2}>
                  <div>
                    <p className="font-semibold mb-1">Sex:</p>
                    {["Male", "Female", "Prefer not to say", "Others"].map(
                      (option) => (
                        <div
                          key={option}
                          className="flex items-center text-sm mb-1"
                        >
                          <input
                            type="checkbox"
                            readOnly
                            checked={getValue("sex") === option}
                            className="mr-2 scale-75"
                          />
                          {option}
                        </div>
                      )
                    )}
                  </div>
                </td>
              </tr>

              <tr>
                <td className="border border-black p-2 align-top" colSpan={4}>
                  <strong>Pronoun</strong> : {getValue("pronoun")}
                </td>
              </tr>

              <tr>
                <td className="border border-black p-2 align-top" colSpan={3}>
                  <strong>
                    Are you of Aboriginal or Torres Strait Islander descent?
                  </strong>
                </td>
                <td className="border border-black p-2 align-top">
                  <label className="inline-flex items-center mr-3 text-sm">
                    <input
                      type="checkbox"
                      readOnly
                      checked={getValue("indigenousDescent") === "Yes"}
                      className="mr-1 scale-75"
                    />
                    Yes
                  </label>
                  <label className="inline-flex items-center text-sm">
                    <input
                      type="checkbox"
                      readOnly
                      checked={getValue("indigenousDescent") === "No"}
                      className="mr-1 scale-75"
                    />
                    No
                  </label>
                </td>
              </tr>

              <tr>
                <td className="border border-black p-2 align-top" colSpan={2}>
                  <strong>Preferred name</strong> : {getValue("preferredName")}
                </td>
                <td className="border border-black p-2 align-top" colSpan={2}>
                  <strong>Date of Birth</strong> : {getValue("dob")}
                </td>
              </tr>

              <tr className="bg-gray-300 font-bold">
                <td className="border border-black p-2 align-top" colSpan={4}>
                  Residential Address Details
                </td>
              </tr>

              <tr>
                <td className="border border-black p-2 align-top" colSpan={4}>
                  <strong>Number / Street</strong> : {getValue("address")}
                </td>
              </tr>

              <tr>
                <td className="border border-black p-2 align-top" colSpan={2}>
                  <strong>State</strong> : {getValue("state")}
                </td>
                <td className="border border-black p-2 align-top" colSpan={2}>
                  <strong>Postcode</strong> : {getValue("postcode")}
                </td>
              </tr>

              <tr className="bg-gray-300 font-bold">
                <td className="border border-black p-2 align-top" colSpan={4}>
                  Participant Contact Details
                </td>
              </tr>

              <tr>
                <td className="border border-black p-2 align-top" colSpan={4}>
                  <strong>Email address</strong> : {getValue("email")}
                </td>
              </tr>

              <tr>
                <td className="border border-black p-2 align-top" colSpan={2}>
                  <strong>Home Phone No</strong> : {getValue("homePhone")}
                </td>
                <td className="border border-black p-2 align-top" colSpan={2}>
                  <strong>Mobile No</strong> : {getValue("mobile")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Checkboxes Section */}
        <div className="mt-4 space-y-2">
          <div className="flex items-start text-sm">
            <input
              type="checkbox"
              readOnly
              checked={data?.noCopyRequested || false}
              className="mr-2 mt-1 scale-75"
            />
            <span className="leading-relaxed">
              Participant may wish not to receive a copy of this agreement. In this case, they shall tick the dedicated tick box at the end of the service agreement and sign the document.
            </span>
          </div>

          <div className="flex items-start text-sm">
            <input
              type="checkbox"
              readOnly
              checked={data?.planAttached || false}
              className="mr-2 mt-1 scale-75"
            />
            <span className="leading-relaxed">
              A copy of the Individual's plan is attached to this Service Agreement.
            </span>
          </div>

          <div className="flex items-start text-sm">
            <input
              type="checkbox"
              readOnly
              checked={data?.planNotAttached || false}
              className="mr-2 mt-1 scale-75"
            />
            <span className="leading-relaxed">
              Individual chooses not to attach their plan.
            </span>
          </div>
        </div>

        {/* Footer Description */}
        <div className="mt-4">
          <p className="leading-relaxed text-sm">
            The Parties agree that this Service Agreement is made in line with the funding body which provides the Individual's funding, which aims to:
          </p>
        </div>

        {/* Footer - at bottom */}
        <div className="flex justify-between items-center text-xs font-bold mt-4 pt-3 border-t border-gray-200">
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
    </A4PageWrapper>
  );
};

export default Page1;
