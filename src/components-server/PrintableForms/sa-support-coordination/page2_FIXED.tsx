import React from 'react';
import A4PageWrapper from "./A4PageWrapper_FIXED";
import { format, parseISO, isValid } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

// --- Standardized Header Component ---
const StandardHeader = ({ images }: { images?: any }) => (
  <div className="flex flex-col items-center gap-2">
    <img
      src={images?.infinityLogo || "/infinity_logo.png"}
      alt="Logo"
      width={STANDARD_LOGO.width}
      height={STANDARD_LOGO.height}
      className={STANDARD_LOGO.className}
    />
  </div>
);


const supportCategories = [
  "07_001_0106_8_3 Level 1 Support Connection",
  "07_002_0106_8_3 Level 2 Support Coordination",
  "07_101_0106_6_3 Psychosocial Recovery Coaching"
];

const costPerHr = ["$74.63", "100.14", "$98.30"]

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

const Page2: React.FC<any> = ({
  schema,
  data,
  settings,
  commonFieldsData,
  images,
}) => {
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

  const cellClass = `border border-black px-2 py-2 text-xs font-normal font-montserrat`;
  const headerClass = `border border-black px-2 py-2 text-xs font-bold font-montserrat bg-gray-100`;

  return (
    <A4PageWrapper>
      <div className="flex flex-col w-full h-full px-6 pt-[1mm] pb-[1mm] font-montserrat justify-between" style={{ minHeight: "100%", height: "100%" }}>
        
        <div className="flex-1">
          <StandardHeader images={images} /> <br /><br />

          {/* Content Area - flows naturally */}
          <div style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
            
            {/* Intro List */}
            <ol className="list-decimal list-inside mb-6 text-xs font-normal font-montserrat leading-relaxed">
              <li className="mb-2">
                Support the independence and social and economic participation of people
                with disability and enable people with a disability to exercise choice
                and control in the pursuit of their goals and the planning and delivery
                of their supports.
              </li>
            </ol>
            <br /><br />
            {/* Schedule of Support Table */}
            <p className="text-xs font-bold font-montserrat mb-2 underline">SCHEDULE OF SUPPORT</p>
            <table className="w-full border border-black border-collapse text-xs font-montserrat mb-6">
              <thead>
                <tr>
                  <th className={`${headerClass} text-left`}>
                    Support Category
                  </th>
                  <th className={`${headerClass} text-center`}>
                    Weeks
                  </th>
                  <th className={`${headerClass} text-center`}>
                    Total Hours
                  </th>
                  <th className={`${headerClass} text-center`}>
                    Cost per hr
                  </th>
                  <th className={`${headerClass} text-center`}>
                    Total Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((i) => (
                  <tr key={i}>
                    <td className={`${cellClass} align-top`}>
                      {supportCategories[i-1]}
                    </td>
                    <td className={`${cellClass} text-center align-top`}>
                      {data?.[`row${i}_weeks` as keyof typeof data] ?? ""}
                    </td>
                    <td className={`${cellClass} text-center align-top`}>
                      {data?.[`row${i}_totalHours` as keyof typeof data] ?? ""}
                    </td>
                    <td className={`${cellClass} text-center align-top`}>
                      {costPerHr[i-1]}
                    </td>
                    <td className={`${cellClass} text-center align-top`}>
                      {data?.[`row${i}_totalCost` as keyof typeof data] ?? ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <br /><br />

            {/* Schedule paragraph */}
            <p className="text-xs font-bold font-montserrat mb-2 underline">SCHEDULE OF SUPPORTS</p>  <br />
            <p className="text-xs font-normal font-montserrat mb-6 leading-relaxed">
              All figures quoted below! Should read all figures quoted above are based on NDIS. <span style={{color: 'red'}}>Infinity Supports</span>  WA agrees to provide the individual named in Section 1 with the following Support Coordination. The supports and their prices are set out in the Schedule of Supports below (if NDIS). All supports are as per the NDIS Price Guide and are GST inclusive (if applicable) and include the cost of providing the supports. All figures quoted below are based on NDIS pricing and the individual’s NDIS plan at the time of agreement. Prices, funding totals and hours will be adjusted periodically to reflect changes to NDIS pricing and the individual’s NDIS plan
            </p>
            <br /><br />
            
            <p className="text-xs font-normal font-montserrat mb-6 leading-relaxed">
              If changes to the services or their delivery are required, the Parties agree to discuss and review this Service Agreement. The Parties agree that any changes to this Service Agreement will be in writing, signed, and dated by the Parties.
            </p>
                <br /><br />
            {/* Conflict of Interest */}
            <p className="text-xs font-bold font-montserrat mb-2 underline">CONFLICT OF INTEREST</p> <br />
            <p className="text-xs font-normal font-montserrat mb-4 leading-relaxed">
              I <u>{getValue("isConflictOfInterest") == 'Yes' && data?.conflictDeclaration || "______________________"}</u> have discussed my Support Coordination requirements and have been given options and full choice and control over the provider I have chosen. I have been given information on the following companies
            </p>

            <br /><br />

            {/* Provider list */}
            <ol className="list-decimal list-inside text-xs font-normal font-montserrat leading-relaxed mb-6">
              {[1, 2, 3].map((i) => (
                <li key={i} className="mb-4">
                  {
                    getValue("isConflictOfInterest") == 'Yes' && data?.[`conflictOption${i}` as keyof typeof data] ||
                    <span className="text-gray-400">_________________________________</span>
                  }
                  <br />
                </li> 
              ))}
            </ol>
          </div>
        </div>

        {/* Footer - Only this sticks to bottom */}
        <Footer settings={settings} />
      </div>
    </A4PageWrapper>
  );
};

export default Page2;
