// import React from "react";
// import A4PageWrapper from "./A4PageWrapper";

// interface Field {
//   key: string;
//   type: string;
//   label: string;
// }

// interface Page3Props {
//   schema: { fields: Field[] };
//   data: Record<string, any>;
//   settings: any;
//   commonFieldsData: any;
//   images: any;
// }

// const Page3: React.FC<Page3Props> = ({ schema, data, settings, commonFieldsData, images }) => {
//   const getValue = (key: string) => data?.[key] ?? "";

//   const isChecked = (key: string) =>
//     getValue(key)?.toString().toLowerCase() === "yes";

//   return (
//     <A4PageWrapper>
//       <div className="h-full flex flex-col px-6 py-10 text-sm font-sans">
//         {/* Logo */}
//         <div className="flex justify-center mb-10">
//             <img
//             src={images?.infinityLogo}
//             alt="Infinity Supports WA Logo"
//             className="w-[150px] h-[70px] object-contain"
//           />
//         </div>

//         {/* Content */}
//         <div className="flex-1 space-y-6">
//           {/* Provider Travel */}
//           <div>
//             <p className="font-bold mb-1">Provider Travel</p>
//             <p>
//               <input
//                 type="checkbox"
//                 className="mr-2"
//                 checked={isChecked("providerTravelAgreement")}
//                 readOnly
//               />
//               I agree to Infinity Supports WA charging 15 minutes Provider Travel per day.
//             </p>
//           </div>

//           {/* Short Notice Cancellation */}
//           <div>
//             <p className="font-bold mb-1">Short Notice Cancelation Charges</p>
//             <p className="text-[13px] leading-relaxed">
//               A short notice cancellation is defined by the NDIS Pricing Arrangements
//               and Price Limits as: Has given less than seven (7) clear days’ notice for
//               a support. When claiming a cancellation, providers can request a claim of
//               up to 100 per cent of the price.
//             </p>
//           </div>

//           {/* Schedule of Support Price */}
//           <div>
//             <p className="font-bold mb-1">Schedule of Support price structure</p>
//             <p className="text-[13px] leading-relaxed">
//               The prices for Service Delivery are set in accordance with NDIS pricing
//               guide and can change in response to the Annual Price Review conducted by
//               NDIS with the new prices outlined by NDIA, effective 1 July every year.
//               NDIA increases the participant's funding supports to accommodate for this
//               price change and hence should not impact on the level of support received.
//             </p>
//           </div>

//           {/* Signature Boxes */}
//           <div className="border border-black p-4 space-y-4">
//             {/* Participant */}
//             <div>
//               <div className="flex justify-between items-start gap-4">
//                 <div className="flex flex-col">
//                   <p className="mb-1 font-medium">Signature of participant:</p>
//                   {getValue("participantSignature") && (
//                     <img
//                       src={getValue("participantSignature")}
//                       alt="Signature of the Participant"
//                       className="h-[60px] w-auto max-w-[200px] object-contain border border-gray-300"
//                     />
//                   )}
//                 </div>
//                 <div>
//                   <p className="mb-1 font-medium">Date:</p>
//                   <p>{getValue("participantSignatureDate")}</p>
//                 </div>
//               </div>
//               <p className="mt-2 font-medium">Name: {getValue("participantName")}</p>
//             </div>

//             <p>
//               I confirm that this agreement has been explained to the person
//               receiving the services (participant) and that they agree to this:
//               [If signed by a Nominee:]
//             </p>

//             {/* Nominee */}
//             <div>
//               <div className="flex justify-between items-start gap-4">
//                 <div className="flex flex-col">
//                   <p className="mb-1 font-medium">Signature of Nominee:</p>
//                   {getValue("nomineeSignature") && (
//                     <img
//                       src={getValue("nomineeSignature")}
//                       alt="Nominee Signature"
//                       className="h-[60px] w-auto max-w-[200px] object-contain border border-gray-300"
//                     />
//                   )}
//                 </div>
//                 <div>
//                   <p className="mb-1 font-medium">Date:</p>
//                   <p>{getValue("nomineeSignatureDate")}</p>
//                 </div>
//               </div>
//               <p className="mt-2 font-medium">Name: {getValue("nomineeName")}</p>
//             </div>

//             {/* Representative */}
//             <div className="border border-black p-4 mt-6">
//               <div className="flex justify-between items-start gap-4">
//                 <div className="flex flex-col">
//                   <p className="mb-1 font-medium">Signature on behalf of Infinity Support WA:</p>
//                   {getValue("representativeSignature") && (
//                     <img
//                       src={getValue("representativeSignature")}
//                       alt="Representative Signature"
//                       className="h-[60px] w-auto max-w-[200px] object-contain border border-gray-300"
//                     />
//                   )}
//                 </div>
//                 <div>
//                   <p className="mb-1 font-medium">Date:</p>
//                   <p>{getValue("representativeSignatureDate")}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <footer className="flex justify-between text-[10px] mt-auto px-1 pt-6">
//            <span>Website: {settings?.company_website}</span>
//           <span>{settings?.schedule_of_supports}</span>
//           <span>Review Date: {settings?.review_date}</span>
//         </footer>
//       </div>
//     </A4PageWrapper>
//   );
// };

// export default Page3;


import React from "react";
import A4PageWrapper from "./A4PageWrapper";

interface Field {
  key: string;
  type: string;
  label: string;
}

interface Page3Props {
  schema: { fields: Field[] };
  data: Record<string, any>;
  settings: any;
  commonFieldsData: any;
  images: any;
}

const Page3: React.FC<Page3Props> = ({
  schema,
  data,
  settings,
  commonFieldsData,
  images,
}) => {
  const getValue = (key: string) => data?.[key] ?? "";

  const isChecked = (key: string) =>
    getValue(key)?.toString().toLowerCase() === "Yes";

  return (
    <A4PageWrapper>
      <div
        className="flex flex-col h-full w-full px-6 pt-[1mm] pb-[1mm] text-sm font-sans justify-between"
        style={{ height: "100%" }}
      >
        {/* Header */}
        <div className="flex justify-center mb-2">
          <img
            src={images?.infinityLogo}
            alt="Infinity Supports WA Logo"
            className="w-[100px] h-[35px] object-contain"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-4 text-[13px] leading-relaxed">
          {/* Provider Travel */}
          <div>
            <p className="font-bold mb-1">Provider Travel</p>
            <p>
              <input
                type="checkbox"
                className="mr-2"
                checked={isChecked("providerTravelAgreement")}
                readOnly
              />
              I agree to Infinity Supports WA charging 15 minutes Provider Travel per day.
            </p>
          </div>

          {/* Short Notice Cancellation */}
          <div>
            <p className="font-bold mb-1">Short Notice Cancellation Charges</p>
            <p>
              A short notice cancellation is defined by the NDIS Pricing Arrangements
              and Price Limits as: Has given less than seven (7) clear days’ notice for
              a support. When claiming a cancellation, providers can request a claim of
              up to 100 per cent of the price.
            </p>
          </div>

          {/* Support Price Structure */}
          <div>
            <p className="font-bold mb-1">Schedule of Support price structure</p>
            <p>
              The prices for Service Delivery are set in accordance with the NDIS pricing
              guide and can change annually. NDIA increases participant funding to account
              for the price change, so this does not affect the level of support.
            </p>
          </div>

          {/* Signature Boxes */}
          <div className="border border-black p-4 space-y-4 text-[13px] leading-relaxed">
            {/* Participant */}
            <div>
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col">
                  <p className="mb-1 font-medium">Signature of participant:</p>
                  {getValue("participantSignature") && (
                    <img
                      src={getValue("participantSignature")}
                      alt="Signature of the Participant"
                      className="h-[40px] w-auto max-w-[180px] object-contain border border-gray-300"
                    />
                  )}
                </div>
                <div>
                  <p className="mb-1 font-medium">Date:</p>
                  <p>{getValue("participantSignatureDate")}</p>
                </div>
              </div>
              <p className="mt-1 font-medium">Name: {getValue("participantName")}</p>
            </div>

            <p>
              I confirm that this agreement has been explained to the person receiving
              the services (participant) and that they agree to this: [If signed by a Nominee:]
            </p>

            {/* Nominee */}
            <div>
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col">
                  <p className="mb-1 font-medium">Signature of Nominee:</p>
                  {getValue("nomineeSignature") && (
                    <img
                      src={getValue("nomineeSignature")}
                      alt="Nominee Signature"
                      className="h-[40px] w-auto max-w-[180px] object-contain border border-gray-300"
                    />
                  )}
                </div>
                <div>
                  <p className="mb-1 font-medium">Date:</p>
                  <p>{getValue("nomineeSignatureDate")}</p>
                </div>
              </div>
              <p className="mt-1 font-medium">Name: {getValue("nomineeName")}</p>
            </div>

            {/* Representative */}
            <div className="border border-black p-4 mt-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col">
                  <p className="mb-1 font-medium">Signature on behalf of Infinity Support WA:</p>
                  {getValue("representativeSignature") && (
                    <img
                      src={getValue("representativeSignature")}
                      alt="Representative Signature"
                      className="h-[40px] w-auto max-w-[180px] object-contain border border-gray-300"
                    />
                  )}
                </div>
                <div>
                  <p className="mb-1 font-medium">Date:</p>
                  <p>{getValue("representativeSignatureDate")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 text-xs flex justify-between text-gray-600">
          <span>Website: {settings?.company_website}</span>
          <span>{settings?.schedule_of_supports}</span>
          <span>Review Date: {settings?.review_date}</span>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page3;
