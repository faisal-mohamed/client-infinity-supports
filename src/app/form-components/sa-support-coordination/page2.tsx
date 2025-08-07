import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { format, parseISO, isValid } from "date-fns";


interface Page2Props {
    data?: any,
  commonFieldsData?: any,
  settings?: any
}

const supportCategories = [
  "07_001_0106_8_3 Level 1 Support Connection",
  "07_002_0106_8_3 Level 2 Support Coordination",
  "07_101_0106_6_3 Psychosocial Recovery Coaching"
];

const costPerHr = ["$74.63", "$100.14", "$98.30"]


const Page2: React.FC<Page2Props> = ({ data, commonFieldsData, settings }) => {
   const getValue = (key: string): string => {
      const rawValue = data?.[key as keyof NonNullable<typeof data>];
  
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

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {/* Intro List */}
          <ol className="list-decimal list-inside mb-6 text-sm leading-relaxed">
            <li className="mb-2">
              Support the independence and social and economic participation of people
              with disability and enable people with a disability to exercise choice
              and control in the pursuit of their goals and the planning and delivery
              of their supports.
            </li>
          </ol>

          {/* Schedule of Support Table */}
          <p className="font-bold text-sm mb-2 underline">SCHEDULE OF SUPPORT</p>
          <table className="w-full border border-black border-collapse text-sm mb-6">
            <thead>
              <tr>
                <th className="border border-black p-2 text-left font-semibold bg-gray-100">
                  Support Category
                </th>
                <th className="border border-black p-2 font-semibold text-center bg-gray-100">
                  Weeks
                </th>
                <th className="border border-black p-2 font-semibold text-center bg-gray-100">
                  Total Hours
                </th>
                <th className="border border-black p-2 font-semibold text-center bg-gray-100">
                  Cost per hr
                </th>
                <th className="border border-black p-2 font-semibold text-center bg-gray-100">
                  Total Cost
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i}>
                  <td className="border border-black p-2 align-top">
{supportCategories[i-1]}                  </td>
                  <td className="border border-black p-2 text-center align-top">
                    {data?.[`row${i}_weeks` as keyof typeof data] ?? ""}
                  </td>
                  <td className="border border-black p-2 text-center align-top">
                    {data?.[`row${i}_totalHours` as keyof typeof data] ?? ""}
                  </td>
                  <td className="border border-black p-2 text-center align-top">
                  {costPerHr[i-1]}
                  </td>
                  <td className="border border-black p-2 text-center align-top">
                    ${data?.[`row${i}_totalCost` as keyof typeof data] ?? ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Schedule paragraph */}
          <p className="font-bold text-sm mb-2 underline">SCHEDULE OF SUPPORTS</p>
          <p className="text-sm mb-6 leading-relaxed">
            All figures quoted below! Should read all figures quoted above are based on
            NDIS. <span className="text-red-600 font-semibold">Infinity Supports WA</span> agrees to provide the individual
            named in Section 1 with the following Support Coordination. The supports and
            their prices are set out in the Schedule of Supports below (if NDIS). All supports
            are as per the NDIS Price Guide and are GST inclusive (if applicable)... Prices,
            funding totals and hours will be adjusted periodically to reflect changes to
            NDIS pricing and the individual's NDIS plan.
          </p>
          
          <p className="text-sm mb-6 leading-relaxed">
            If changes to the services or their delivery are required, the Parties agree
            to discuss and review this Service Agreement. The Parties agree that any changes
            to this Service Agreement will be in writing, signed, and dated by the Parties.
          </p>

          {/* Conflict of Interest */}
          <p className="font-bold text-sm mb-2 underline">CONFLICT OF INTEREST</p>
          <p className="text-sm mb-4 leading-relaxed">
            I <u>{getValue("isConflictOfInterest") == 'Yes' && data?.conflictDeclaration || "______________________"}</u> have discussed my Support Coordination requirements
            and have been given options and full choice and control over the provider I have
            chosen. I have been given information on the following companies.
          </p>

          {/* Provider list */}
          <ol className="list-decimal list-inside text-sm leading-relaxed mb-6 flex-1">
            {[1, 2, 3].map((i) => (
              <li key={i} className="mb-4">
                {
                  getValue("isConflictOfInterest") == 'Yes' && data?.[`conflictOption${i}` as keyof typeof data] ||
                  <span className="text-gray-400">_________________________________</span>
                }
              </li>
            ))}
          </ol>
        </div>

        {/* Footer */}
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

export default Page2;
