import React from "react";
import A4PageWrapper from "./A4PageWrapper";

const Page2: React.FC<any> = ({
  schema,
  data,
  commonFieldsData,
  settings,
  images,
}) => {
  const commonFieldMapping: Record<string, string> = {
    clientName: "name",
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

  const getValue = (key: string) =>
    commonFieldMapping?.[key]
      ? commonFieldsData?.[commonFieldMapping?.[key]] ?? ""
      : data?.[key] ?? "";

  const renderRadio = (key: string, options: string[]) => (
    <div className="flex flex-wrap gap-4 ml-2">
      {options?.map?.((opt) => (
        <label key={opt} className="inline-flex items-center">
          <input
            type="checkbox"
            readOnly
            checked={getValue(key) === opt}
            className="mr-1"
          />
          <span className="text-xs">{opt}</span>
        </label>
      )) ?? null}
    </div>
  );

  return (
    <A4PageWrapper>
      <div
        className="print-page flex flex-col justify-between w-full h-[1122px] overflow-hidden text-black text-xs font-sans"
        style={{ breakAfter: "page", fontSize: "12px", lineHeight: "2.2" }}
      >
        {/* Header */}
        <div>
          <div className="flex justify-center mb-4">
            <img
              src={`${images?.infinityLogo || "/infinity_logo.png"}`}
              alt="Infinity Supports WA logo"
              className="object-contain h-[60px] w-[150px]"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow space-y-6">
          {/* Section 4 */}
          <div>
            <div className="mb-2 font-semibold">4. Observations & Challenges:</div>
            <div className="space-y-4">
              {schema?.observations?.map?.((field: any) => (
                <div key={field?.key} className="flex items-start">
                  <span className="min-w-[220px] font-medium">
                    <strong>● {field?.label}:</strong>
                  </span>
                  <span className="ml-2 flex-1 break-words">{getValue(field?.key)}</span>
                </div>
              )) ?? null}
            </div>
          </div>

          {/* Section 5 */}
          <div>
            <div className="mb-2 font-semibold">5. Recommendations & Improvements:</div>
            <div className="space-y-4">
              {schema?.recommendations?.map?.((field: any) => (
                <div key={field?.key} className="flex flex-col">
                  <span className="font-medium mb-1">
                    <strong>● {field?.label}:</strong>
                  </span>
                  {field?.type === "radio"
                    ? renderRadio(field?.key, field?.options ?? [])
                    : (
                      <span className="ml-2 break-words">{getValue(field?.key)}</span>
                    )}
                </div>
              )) ?? null}
            </div>
          </div>

          {/* Section 6 */}
          <div>
            <div className="mb-2 font-semibold">6. Follow-Up Actions:</div>
            <div className="space-y-4">
              {schema?.followup?.map?.((field: any) => (
                <div key={field?.key} className="flex flex-col">
                  <span className="font-medium mb-1">
                    <strong>● {field?.label}:</strong>
                  </span>
                  {field?.type === "radio"
                    ? renderRadio(field?.key, field?.options ?? [])
                    : (
                      <span className="ml-2 break-words">{getValue(field?.key)}</span>
                    )}
                </div>
              )) ?? null}
            </div>
          </div>

          {/* Section 7 */}
          <div>
            <div className="mb-2 font-semibold">7. Signatures:</div>
            <div className="space-y-4">
              {schema?.signatures?.map?.((field: any) => {
                const value = getValue(field?.key);
                const isSignatureImage = [
                  "supportWorkerSignature",
                  "supervisorSignature",
                ].includes(field?.key);

                return (
                  <div key={field?.key} className="flex items-start gap-3">
                    <span className="min-w-[220px] font-medium">
                      <strong>● {field?.label}:</strong>
                    </span>
                    {isSignatureImage && value ? (
                      <img
                        src={value}
                        alt={`${field?.label} Signature`}
                        className="h-12 object-contain border-b border-black max-w-[180px]"
                      />
                    ) : (
                      <span className="ml-2 border-b border-black flex-1 min-h-[18px] break-words pb-1">
                        {value}
                      </span>
                    )}
                  </div>
                );
              }) ?? null}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-300 flex justify-between text-xs text-blue-700 font-normal">
          <a
            className="underline"
            href={settings?.company_website || "https://www.infinitysupportswa.org"}
            target="_blank"
            rel="noopener noreferrer"
          >
            {settings?.company_website || "www.infinitysupportswa.org"}
          </a>
          <div>{settings?.emergency_drill}</div>
          <div>DOR: {settings?.review_date}</div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page2;
