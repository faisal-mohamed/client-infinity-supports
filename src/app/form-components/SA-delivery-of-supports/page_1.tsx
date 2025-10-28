import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { format, parseISO, isValid } from "date-fns";

interface Page1Props {
  schema?: any;
  data: any;
  settings: any;
  commonFieldsData: any;
}

const Page1: React.FC<Page1Props> = ({
  schema,
  data,
  settings,
  commonFieldsData,
}) => {
  const commonFieldMapping: Record<string, string> = {
    givenNames: "name",
    address: "street",
    dob: "dob",
    disability: "disability",
    ndisNumber: "ndis",
    state: "state",
    street: "street",
    postcode: "postCode",
    email: "email",
    phone: "phone",
    sex: "sex",
  };

  const getValue = (key: string): string => {
    const rawValue = commonFieldMapping[key]
      ? commonFieldsData?.[commonFieldMapping[key]]
      : data?.[key];

    // ✅ Convert YYYY-MM-DD to DD-MM-YYYY if valid
    if (typeof rawValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
      const parsed = parseISO(rawValue);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }

    return rawValue ?? "";
  };

  return (
    <A4PageWrapper>
      <div className="h-full flex flex-col p-6">
        {/* Header with Logo - Fixed desktop sizing */}
        <div className="flex justify-center mb-4">
          <img
            src={"/infinity_logo.png"}
            alt="Infinity Supports WA Logo"
            className="object-contain"
            style={{ height: '64px' }} // Fixed height for consistency
          />
        </div>

        {/* Title - Fixed desktop sizing */}
        <div className="text-center mb-4">
          <p className="font-bold underline" style={{ fontSize: '14px' }}>
            SERVICE AGREEMENT FOR SERVICE DELIVERY
          </p>
        </div>

        {/* Section 1 - Fixed desktop sizing */}
        <div className="mb-3">
          <p className="font-bold underline" style={{ fontSize: '14px' }}>Section 1</p>
        </div>

        {/* Table - Fixed desktop layout for zoom-out */}
        <div className="flex-1 flex flex-col">
          <table className="w-full border border-black border-collapse flex-1" style={{ fontSize: '13px' }}>
            <tbody className="h-full">
              <tr>
                <td
                  className="border border-black p-2 font-bold align-top"
                  style={{ width: "20%" }}
                >
                  Date :
                </td>
                <td className="border border-black p-2 align-top" colSpan={3}>
                  {getValue("agreementDate")}
                </td>
              </tr>

              <tr className="bg-gray-300 font-bold">
                <td
                  className="border border-black p-2 align-top"
                  style={{ width: "60%" }}
                  colSpan={3}
                >
                  Participant Details
                </td>
                <td
                  className="border border-black p-2 align-top text-right whitespace-nowrap"
                  style={{ width: "40%" }}
                >
                  NDIS Number:{" "}
                  <span className="font-normal">{getValue("ndisNumber")}</span>
                </td>
              </tr>

              <tr>
                <td className="border border-black p-2 align-top">
                  <strong>
                    {
                      schema?.fields?.find((f: any) => f.key === "surname")
                        ?.label
                    }
                  </strong>
                  : {getValue("surname")}
                </td>
                <td className="border border-black p-2 align-top">
                  <strong>
                    {
                      schema?.fields?.find((f: any) => f.key === "givenNames")
                        ?.label
                    }
                  </strong>
                  : {getValue("givenNames")}
                </td>
                <td className="border border-black p-2 align-top" colSpan={2}>
                  <div>
                    <p className="font-semibold mb-1" style={{ fontSize: '13px' }}>Sex:</p>
                    {["Male", "Female", "Prefer not to say", "Others"].map(
                      (option) => (
                        <div
                          key={option}
                          className="flex items-center mb-1"
                          style={{ fontSize: '12px' }}
                        >
                          <input
                            type="checkbox"
                            readOnly
                            checked={getValue("sex") === option}
                            className="mr-2"
                            style={{ transform: 'scale(0.8)' }}
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
                    Are you an Aboriginal or Torres Strait Island descent?
                  </strong>
                </td>
                <td className="border border-black p-2 align-top">
                  <label className="inline-flex items-center mr-3 text-sm">
                    <input
                      type="checkbox"
                      readOnly
                      checked={getValue("indigenousStatus") === "Yes"}
                      className="mr-1 scale-75"
                    />
                    Yes
                  </label>
                  <label className="inline-flex items-center text-sm">
                    <input
                      type="checkbox"
                      readOnly
                      checked={getValue("indigenousStatus") === "No"}
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
                  <strong>Number / Street</strong> : {getValue("street")}
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
                  <strong>Mobile No</strong> : {getValue("phone")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Description */}
        <div className="mt-4">
          <p className="leading-relaxed text-sm">
            All figures quoted are based on NDIS price guide. This Service
            Agreement is made for the purpose of providing supports in
            accordance with the Individual's plan, it outlines key
            responsibilities required to enable{" "}
            <span className="text-red-600 font-semibold">
              Infinity Supports WA
            </span>{" "}
            to deliver quality support to
          </p>
        </div>

        {/* Footer - at bottom */}
        <div className="flex justify-between items-center text-xs font-bold mt-4 pt-3 border-t border-gray-200">
          <div>Website: {settings?.company_website}</div>
          <div>{settings?.sa_delivery_of_supports}</div>
          <div>
            Review Date:{" "}
            {settings?.review_date &&
            /^\d{4}-\d{2}-\d{2}$/.test(settings.review_date)
              ? format(parseISO(settings.review_date), "dd-MM-yyyy")
              : "N/A"}
          </div>{" "}
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page1;
