import React from "react";
import A4PageWrapper from "./A4PageWrapper";

const commonFieldMapping: Record<string, string> = {
  ndisNumber: "ndis",
  gender: "sex",
  participantName: "name",
  dob: "dob",
  address: "street",
  state: "state",
  postcode: "postCode",
  email: "email",
  phone: "phone",
};

const Page4: React.FC<any> = ({
  schema,
  data,
  settings,
  commonFieldsData,
  images,
}) => {
  const isChecked = (value: string, option: string) =>
    value?.toLowerCase?.() === option.toLowerCase();

  const getValue = (key: string) => {
    if (commonFieldMapping[key]) {
      return commonFieldsData?.[commonFieldMapping[key]] ?? "";
    }
    return data?.[key] ?? "";
  };

  return (
    <A4PageWrapper>
      <div
        className="flex flex-col h-full min-h-full box-border text-[11px] text-gray-800 font-sans leading-[1.75] p-6"
        style={{
          height: "100%",
          minHeight: "100%",
          padding: "24px",
        }}
      >
        {/* Main Content */}
        <div className="flex-1 min-h-0 flex flex-col">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <img
              src={images?.infinityLogo}
              alt="Infinity Supports WA Logo"
              className="h-[50px] w-[150px] object-contain"
            />
          </div>
          {/* Optionally bring back title */}
          {/* <p className="text-center text-xs font-semibold mb-4">{schema?.title}</p> */}

          {/* Table 1 - Budget Discussion & Goals */}
          <table className="w-full border border-black border-collapse text-xs mb-6">
            <tbody>
              <tr>
                <td className="border border-black p-2 font-bold" colSpan={2}>
                  {schema?.budgetApproval?.label}
                  <input
                    type="checkbox"
                    checked={isChecked(data?.budgetApproval, "Yes")}
                    readOnly
                    className="ml-2 align-middle w-4 h-4 border border-black bg-gray-300"
                  />
                  <span className="ml-1 font-normal align-middle">Yes</span>
                  <input
                    type="checkbox"
                    checked={isChecked(data?.budgetApproval, "No")}
                    readOnly
                    className="ml-4 align-middle w-4 h-4 border border-black bg-gray-300"
                  />
                  <span className="ml-1 font-normal align-middle">No</span>
                </td>
              </tr>
              <tr>
                <td
                  colSpan={2}
                  className="border border-black font-bold p-1"
                  style={{
                    backgroundColor: "#bfdbfe" /* Tailwind's blue-200 */,
                  }}
                >
                  {schema?.goalsSection?.title}
                </td>
              </tr>
              <tr>
                <td
                  colSpan={2}
                  className="border border-black p-4 h-48 whitespace-pre-wrap align-top"
                >
                  {data?.goalsText || ""}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Table 2 - Signatures */}
          {/* Table 2 - Signatures */}
          <table className="w-full border border-black border-collapse text-xs">
            <tbody>
              {/* Participant Signature Row */}
              <tr>
                <td
                  colSpan={2}
                  className="border border-black font-bold p-1 text-left bg-[#bfdbfe]"
                  style={{
                    backgroundColor: "#bfdbfe" /* Tailwind's blue-200 */,
                  }}
                >
                  {schema?.signatures?.participant?.label}
                </td>
              </tr>
              <tr className="h-[60px]">
                {/* Signature image */}
                <td className="border border-black p-2 w-1/2">
                  {data?.participantSignature ? (
                    <div className="w-full h-full flex items-center justify-start overflow-hidden">
                      <img
                        src={data?.participantSignature}
                        alt="Participant Signature"
                        className="h-[50px] object-contain"
                      />
                    </div>
                  ) : (
                    <span className="italic text-gray-400">No signature</span>
                  )}
                </td>
                {/* Signature date */}
                <td className="border border-black p-2 w-1/2 align-top">
                  <span className="font-bold">Date: </span>
                  {data?.participantDate || ""}
                </td>
              </tr>

              {/* Author Signature Row */}
              <tr>
                <td
                  colSpan={2}
                  className="border border-black font-bold p-1 text-left bg-[#bfdbfe]"
                  style={{
                    backgroundColor: "#bfdbfe" /* Tailwind's blue-200 */,
                  }}
                >
                  {schema?.signatures?.author?.label}
                </td>
              </tr>
              <tr className="h-[60px]">
                {/* Signature image */}
                <td className="border border-black p-2 w-1/2">
                  {data?.authorSignature ? (
                    <div className="w-full h-full flex items-center justify-start overflow-hidden">
                      <img
                        src={data?.authorSignature}
                        alt="Author Signature"
                        className="h-[50px] object-contain"
                      />
                    </div>
                  ) : (
                    <span className="italic text-gray-400">No signature</span>
                  )}
                </td>
                {/* Signature date */}
                <td className="border border-black p-2 w-1/2 align-top">
                  <span className="font-bold">Date: </span>
                  {data?.providerSignatureDate || ""}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Sticky Footer */}
        <footer className="flex-shrink-0 mt-auto flex justify-between text-[10px] text-gray-500 pt-4 border-t border-gray-300">
          <div>Website: {settings?.company_website}</div>
          <div>{settings?.support_action_plan}</div>
          <div>Review Date: {settings?.review_date}</div>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page4;
