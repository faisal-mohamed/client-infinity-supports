import React from "react";
import A4PageWrapper from "./A4PageWrapper";

const Page11: React.FC = () => {
  return (
    <A4PageWrapper>
      <div className="w-full px-6 pt-6 pb-12 font-sans text-[11px]">
        {/* Header */}
        <div className="flex justify-center mb-6">
          <img
            src="https://storage.googleapis.com/a1aa/image/d684d4de-a488-4727-5980-1b5f4e74e525.jpg"
            alt="Infinity Supports WA Logo"
            className="h-20 object-contain"
          />
        </div>

        {/* Pandemic and Communication Table */}
        <table className="w-full border border-black border-collapse mb-12">
          <tbody>
            <tr>
              <td className="border border-black p-2 align-top">Pandemic</td>
              <td className="border border-black p-2 align-top">
                Client will reside with family, have essential supports and
                daily phone check ins
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
              <td className="border border-black p-2">Mode of communication</td>
            </tr>
            <tr>
              <td className="border border-black p-2">&nbsp;</td>
              <td className="border border-black p-2">&nbsp;</td>
            </tr>
            <tr>
              <td className="border border-black p-2">&nbsp;</td>
              <td className="border border-black p-2">&nbsp;</td>
            </tr>
          </tbody>
        </table>

        {/* Emergency Procedures */}
        <div className="text-center font-bold text-sm mb-2">
          What to do in an Emergency?
        </div>
        <table className="w-full border border-black border-collapse text-[10px] mb-12">
          <thead>
            <tr className="bg-gray-300 font-bold text-black">
              <th className="border border-black p-1 text-left w-1/2">
                Evacuation Procedures
              </th>
              <th className="border border-black p-1 text-left w-1/2">FIRE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-1 align-top">
                Upon hearing the alarm or when the situation requires the
                participant to leave the premises:
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Prepare to evacuate.</li>
                  <li>
                    Get your environment ready to be left unattended. Shut down
                    electrical/electronic devices; turn off gas if safe to do
                    so.
                  </li>
                  <li>
                    For fire, close the doors as you go – do not lock them. In
                    the case of a bomb threat, leave doors open.
                  </li>
                  <li>Assist participant in immediate danger.</li>
                </ul>
              </td>
              <td className="border border-black p-1 align-top">
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    Ring 000 and provide details of the fire then ring
                    supervisor.
                  </li>
                  <li>
                    Assist any person in immediate danger only if safe to do so.
                  </li>
                  <li>
                    If safe to do so, close doors to minimise spread of fire.
                  </li>
                  <li>Attack the fire only if safe to do so.</li>
                  <li>
                    Contact the nearest warden and follow their instructions (if
                    applicable)
                  </li>
                  <li>
                    Assist with evacuation of participants with mobility issues.
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex justify-between text-xs mt-8">
          <div>Website: infinitysupportswa.org</div>
          <div>CF013</div>
          <div>Review Date: 13/02/2025</div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page11;
