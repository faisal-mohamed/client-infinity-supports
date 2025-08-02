import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { format, parseISO, isValid } from "date-fns";

interface Page4Props {
  formKey?: string;
  data?: any;
  commonFieldsData?: any;
  settings?: any;
  formSchema: any;
}

const commonFieldMapping: Record<string, string> = {
  name: "name",
  address: "street",
  dob: "dob",
  disability: "disability",
  ndisNumber: "ndis",
};



export const formatDate = (value: string): string => {
  if (!value || typeof value !== 'string') return '';

  try {
    const parsed = parseISO(value);
    if (isValid(parsed)) {
      return format(parsed, 'dd-MM-yyyy');
    }
  } catch (e) {
    // fallback
  }

  return value; // fallback
};


const Page4: React.FC<Page4Props> = ({
  formSchema: schema,
  data,
  commonFieldsData,
  settings,
}) => {
  const { columns, defaultRowCount = 3 } = schema.goals;

  // Always show at least `defaultRowCount` rows
  const rowIndexes = Array.from({ length: defaultRowCount }, (_, i) => i + 1);

  return (
    <A4PageWrapper>
      {/* Header with Logo */}
      <div className="flex justify-center pt-6 pb-4">
        <img
          src="/infinity_logo.png"
          alt="Infinity Supports WA logo"
          className="object-contain h-16"
        />
      </div>

      {/* Title */}
      <h2 className="text-center font-extrabold text-lg mb-4 px-6">MY GOALS</h2>

      {/* Goals Table */}
      <div className="flex-1 px-6 py-4 flex flex-col">
        <table className="w-full border border-black border-collapse text-sm flex-1">
          <thead>
            <tr className="bg-gray-200">
              {columns.map((col: any) => (
                <th
                  key={col.key}
                  className="border border-black px-2 py-3 text-left align-top font-bold text-sm leading-tight"
                >
                  <strong>{col.label}</strong> <br />
                  {col?.subLabel && (
                    <>
                      <span style={{ fontStyle: "italic" }}>
                        {col.subLabel}
                      </span>{" "}
                      <br />
                    </>
                  )}
                  {col?.subRating?.length > 0 && (
                    <>
                      <br />
                      <span style={{ fontStyle: "italic" }}>
                        {col.subRating.map((r: any, index: number) => (
                          <div key={index}>
                            - {r} <br />
                          </div>
                        ))}
                      </span>
                    </>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="h-full">
            {rowIndexes.map((rowIndex) => (
              <tr key={rowIndex} className="align-top">
                {columns.map((col: any) => {
                  const dataKey = `${col.key}${rowIndex}`;

                  const isFromCommon = dataKey in commonFieldMapping;
                  const mappedKey = isFromCommon
                    ? commonFieldMapping[dataKey]
                    : dataKey;

                  const value = isFromCommon
                    ? commonFieldsData?.[mappedKey] ?? ""
                    : data?.[mappedKey] ?? "";

                  return (
                    <td
                      key={dataKey}
                      className="border border-black px-2 py-3 align-top text-sm leading-relaxed"
                    >
                      <div className="whitespace-pre-wrap min-h-[60px]">
{typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
  ? formatDate(value)
  : value || "\u00A0"}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs font-bold px-6 py-3 mt-auto border-t border-gray-200">
        <div>
          Website: {settings?.company_website || "infinitysupportswa.org"}
        </div>
        <div>{settings?.person_centre_plan_form_id || "CF014"}</div>
        <div>
          Review Date:{" "}
          {settings?.review_date &&
          /^\d{4}-\d{2}-\d{2}$/.test(settings.review_date)
            ? format(parseISO(settings.review_date), "dd-MM-yyyy")
            : "N/A"}
        </div>{" "}
      </div>
    </A4PageWrapper>
  );
};

export default Page4;
