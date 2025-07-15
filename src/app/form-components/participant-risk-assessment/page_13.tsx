import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface Page13Props {
  data: any;
}

const Page13: React.FC<Page13Props> = ({ data }) => {
  return (
    <A4PageWrapper>
      <div className="flex justify-center mb-12">
        <img
          src="https://storage.googleapis.com/a1aa/image/95216824-fb3f-43b4-1046-cdf5ed2b2f5a.jpg"
          alt="Infinity Supports WA Logo"
          className="w-[200px] h-[60px] object-contain"
        />
      </div>

      <table className="w-full border border-black border-collapse text-[12px]">
        <thead>
          <tr className="bg-gray-300 font-bold text-center">
            <th className="border border-black py-1" colSpan={5}>
              Authorisation
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black px-2 py-1 w-1/3">Authorised by:</td>
            <td className="border border-black px-2 py-1 w-1/3">{data.authorisedBy}</td>
            <td className="border border-black px-2 py-1 w-1/3">Role:</td>
            <td className="border border-black px-2 py-1" colSpan={2}>{data.authorisedRole}</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1">Signature:</td>
            <td className="border border-black px-2 py-1">{data.authorisedSignature}</td>
            <td className="border border-black px-2 py-1">Date:</td>
            <td className="border border-black px-2 py-1" colSpan={2}>{data.authorisedDate}</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1">
              Participant / Guardian <br /> Signature:
            </td>
            <td className="border border-black px-2 py-1">{data.participantSignature}</td>
            <td className="border border-black px-2 py-1">Date:</td>
            <td className="border border-black px-2 py-1" colSpan={2}>{data.participantDate}</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 text-center align-middle w-1/4">
              Is a copy supplied to the participant?
            </td>
            <td className="border border-black px-2 py-1 w-1/6" colSpan={1}>
              {data.copySuppliedToParticipant}
            </td>
            <td className="border border-black px-2 py-1 text-center align-middle w-1/4">
              Copy placed on file?
            </td>
            <td className="border border-black px-2 py-1 w-1/6">
              {data.copyPlacedOnFile}
            </td>
            <td className="border border-black px-2 py-1 text-center align-middle w-1/4">
              {data.dateForReview}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-between text-[10px] mt-20 px-2">
        <div>Website: infinitysupportswa.org</div>
        <div>CF013</div>
        <div>Review Date: 13/02/2025</div>
      </div>
    </A4PageWrapper>
  );
};

export default Page13;
