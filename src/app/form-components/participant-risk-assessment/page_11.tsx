import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { format, parseISO, isValid } from "date-fns";

interface Page11Props {
  schema: any;
  data: any;
  commonFieldsData: Record<string, string>;
  settings: any;
}

const Page11: React.FC<Page11Props> = ({
  schema,
  data,
  commonFieldsData,
  settings,
}) => {
  const getValue = (key: string) => data?.[key] ?? "";

  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full font-sans px-6 pt-6 pb-4 text-sm">
        {/* Header */}
        <div className="flex justify-center pt-6 pb-4">
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA logo"
            className="h-[60px] w-[150px] object-contain"
          />
        </div>

        {/* Main content container */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Pandemic and Communication Table */}
          <table className="w-full border border-black border-collapse text-sm">
            <tbody>
              <tr>
                <td className="border border-black p-2 align-top w-1/2">
                  Pandemic
                </td>
                <td className="border border-black p-2 align-top">
                  Client will reside with family, have essential supports and
                  daily phone check-ins.
                </td>
              </tr>
              <tr className="bg-gray-300 font-bold text-black">
                <td className="border border-black p-2" colSpan={2}>
                  Mode of Communication assessment for non-verbal participants
                  (e.g., Sign language, pictures, body movement)
                </td>
              </tr>
              <tr className="font-bold text-black">
                <td className="border border-black p-2">
                  Possible scenarios of concern
                </td>
                <td className="border border-black p-2">
                  Mode of communication
                </td>
              </tr>
              {[1, 2].map((i) => (
                <tr key={i}>
                  <td className="border border-black p-2 h-16 align-top">
                    <div className="w-full h-full">
                      {getValue(`scenario${i}`)}
                    </div>
                  </td>
                  <td className="border border-black p-2 h-16 align-top">
                    <div className="w-full h-full">{getValue(`mode${i}`)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <br />
          <br />
          <br />
          <br />
          <br />

          {/* Emergency Procedures Table */}
          <div className="flex flex-col flex-grow">
            <div className="text-center font-bold text-sm mb-2">
              What to do in an Emergency?
            </div>
            <table className="w-full border border-black border-collapse text-sm">
              <thead>
                <tr className="bg-gray-300 font-bold text-black">
                  <th className="border border-black p-1 text-left w-1/2">
                    Evacuation Procedures
                  </th>
                  <th className="border border-black p-1 text-left w-1/2">
                    FIRE
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-1 align-top">
                    <div className="mt-1 space-y-1">
                      <p>
                        Upon hearing the alarm or when the situation requires
                        the participant to leave the premises:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Prepare to evacuate.</li>
                        <li>
                          Get your environment ready to be left unattended. Shut
                          down electrical/electronic devices; turn off gas if
                          safe to do so.
                        </li>
                        <li>
                          For fire, close the doors as you go – do not lock
                          them. In the case of a bomb threat, leave doors open.
                        </li>
                        <li>Assist participant in immediate danger.</li>
                      </ul>
                    </div>
                  </td>

                  <td className="border border-black p-1 align-top">
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      <li>
                        Ring 000 and provide details of the fire then ring
                        supervisor.
                      </li>
                      <li>
                        Assist any person in immediate danger only if safe to do
                        so.
                      </li>
                      <li>
                        If safe to do so, close doors to minimise spread of
                        fire.
                      </li>
                      <li>Attack the fire only if safe to do so.</li>
                      <li>
                        Contact the nearest warden and follow their instructions
                        (if applicable).
                      </li>
                      <li>
                        Assist with evacuation of participants with mobility
                        issues.
                      </li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4">
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

export default Page11;
