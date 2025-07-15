import React from "react";
import A4PageWrapper from "./A4PageWrapper";

const Page9: React.FC = () => {
  return (
    <A4PageWrapper>
      <div className="w-full px-6 pt-6 pb-12 text-[9px] font-sans">
        {/* Header */}
        <div className="flex flex-col items-center mb-4">
          <img
            src="https://storage.googleapis.com/a1aa/image/ed0f7ec8-290e-4620-f97e-1ccbaf15ebd2.jpg"
            alt="Infinity Supports WA Logo"
            className="h-12 mb-1"
          />
          <p className="text-xs uppercase tracking-widest text-red-700 font-semibold">
            ACHIEVING GOALS AND BEYOND
          </p>
        </div>

        {/* Risk Assessment Matrix Placeholder */}
        <div className="text-center font-semibold border border-black p-4 mb-2">
          <p>[Risk Assessment Matrix Image Will Be Placed Here]</p>
        </div>

        {/* Summary Paragraph */}
        <div className="mt-2 font-semibold">
          <p>
            Visit should only proceed after consultation with{" "}
            <span className="underline">Manager</span>. The risks should be
            reviewed to consider all the hazards involved. The risks must be
            reduced prior to the visit.
          </p>
        </div>

        {/* Emergency Contact Numbers */}
        <div className="mt-4 border border-black">
          <table className="w-full border-collapse text-[9px]">
            <thead>
              <tr>
                <th
                  colSpan={3}
                  className="border border-black text-left px-2 py-1 font-bold bg-gray-300"
                >
                  Emergency Contact Numbers
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black px-2 py-1 w-1/3">Police</td>
                <td
                  colSpan={2}
                  className="border border-black px-2 py-1 flex justify-center items-center"
                >
                  <img
                    src="https://storage.googleapis.com/a1aa/image/88a6173e-b666-4c17-36ba-82dd80a3fe61.jpg"
                    alt="000 Emergency"
                    className="max-h-[60px]"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1">Fire</td>
                <td className="border border-black px-2 py-1"></td>
                <td className="border border-black px-2 py-1"></td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1">Ambulance</td>
                <td className="border border-black px-2 py-1"></td>
                <td className="border border-black px-2 py-1"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Utilities Table */}
        <div className="mt-4 border border-black">
          <table className="w-full border-collapse text-[9px]">
            <thead>
              <tr>
                <th
                  colSpan={3}
                  className="border border-black text-left px-2 py-1 font-bold bg-gray-300"
                >
                  Utilities
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black px-2 py-1 w-1/3">
                  Electricity Authority
                </td>
                <td className="border border-black px-2 py-1">Western Power</td>
                <td className="border border-black px-2 py-1">13 13 51</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1">
                  Water Authority
                </td>
                <td className="border border-black px-2 py-1">Water Corp</td>
                <td className="border border-black px-2 py-1">13 13 75</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <footer className="mt-8 flex justify-between text-[9px]">
          <span>Website: infinitysupportswa.org</span>
          <span>CF013</span>
          <span>Review Date: 13/02/2025</span>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page9;
