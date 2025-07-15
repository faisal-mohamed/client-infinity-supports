import React from "react";
import A4PageWrapper from "./A4PageWrapper";

const Page10: React.FC = () => {
  return (
    <A4PageWrapper>
      <div className="w-full px-6 pt-6 pb-12 text-[11px] font-sans">
        {/* Header */}
        <div className="flex justify-center mb-6">
          <img
            src="https://storage.googleapis.com/a1aa/image/f06e5f4c-fd8a-4161-dafc-779432110e6e.jpg"
            alt="Infinity Supports WA Logo"
            className="h-16 object-contain"
          />
        </div>

        {/* Contacts Table */}
        <table className="w-full border-collapse border border-black text-[10px]">
          <tbody>
            <tr>
              <td className="border border-black px-2 py-1">Gas Authority</td>
              <td className="border border-black px-2 py-1">Gas Corp</td>
              <td className="border border-black px-2 py-1">13 13 52</td>
            </tr>
            <tr>
              <td className="border border-black px-2 py-1">State Emergency</td>
              <td className="border border-black px-2 py-1">SES</td>
              <td className="border border-black px-2 py-1">13 25 00</td>
            </tr>
            <tr className="bg-gray-400 font-bold">
              <td className="border border-black px-2 py-1" colSpan={3}>
                Other Key Contacts
              </td>
            </tr>
            <tr>
              <td className="border border-black px-2 py-1">Health Direct</td>
              <td className="border border-black px-2 py-1" colSpan={2}>
                1800 022 222
              </td>
            </tr>
            <tr>
              <td className="border border-black px-2 py-1">Poisons Line</td>
              <td className="border border-black px-2 py-1" colSpan={2}>
                13 11 26
              </td>
            </tr>
            <tr>
              <td className="border border-black px-2 py-1">
                Lifeline (24 hours crisis counselling)
              </td>
              <td className="border border-black px-2 py-1" colSpan={2}>
                13 11 14
              </td>
            </tr>
            <tr>
              <td className="border border-black px-2 py-1">Beyond Blue</td>
              <td className="border border-black px-2 py-1" colSpan={2}>
                1300 22 4636
              </td>
            </tr>
            <tr>
              <td className="border border-black px-2 py-1">Crisis Care</td>
              <td className="border border-black px-2 py-1" colSpan={2}>
                1800 199 008
              </td>
            </tr>
            <tr>
              <td className="border border-black px-2 py-1">NDIS</td>
              <td className="border border-black px-2 py-1" colSpan={2}>
                1800 800 110
              </td>
            </tr>
            <tr>
              <td className="border border-black px-2 py-1">
                Mental health Emergency Response Line
              </td>
              <td className="border border-black px-2 py-1" colSpan={2}>
                1300 555 788 (Perth)
                <br />
                1300 676 822 (Peel)
              </td>
            </tr>
            <tr className="bg-gray-400 font-bold text-xs">
              <td className="border border-black px-2 py-1" colSpan={3}>
                Type of support to be put in place in the event of an emergency
                or disaster and how we will support the participant (based on
                the Service agreement)
              </td>
            </tr>
            <tr className="font-bold text-xs">
              <td className="border border-black px-2 py-1">Emergency</td>
              <td className="border border-black px-2 py-1" colSpan={2}>
                Support provided to the participants in the event of an
                emergency
              </td>
            </tr>
            <tr className="text-xs align-top">
              <td className="border border-black px-2 py-1">
                Infinity is unable to support for extended period
              </td>
              <td className="border border-black px-2 py-1" colSpan={2}>
                Infinity will assist the client/family to source alternative
                providers
              </td>
            </tr>
            <tr className="text-xs align-top">
              <td className="border border-black px-2 py-1">
                Client taken ill during support.
              </td>
              <td className="border border-black px-2 py-1" colSpan={2}>
                Call 000, Call family, take to nearest ED
              </td>
            </tr>
            <tr className="text-xs align-top">
              <td className="border border-black px-2 py-1">
                Closure of business
              </td>
              <td className="border border-black px-2 py-1" colSpan={2}>
                Infinity will assist the client/family to source alternative
                providers
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex justify-between text-xs mt-12 px-2">
          <div>Website: infinitysupportswa.org</div>
          <div>CF013</div>
          <div>Review Date: 13/02/2025</div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page10;
