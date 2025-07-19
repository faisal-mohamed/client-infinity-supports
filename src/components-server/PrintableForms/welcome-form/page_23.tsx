

// import React from 'react';
// import A4PageWrapper from './A4PageWrapper';

// const Page23  = ({settings, images}: any ) => {
//   return (
//     <A4PageWrapper>
//       <div className="flex flex-col h-full font-[Times_New_Roman] text-black text-[14px] leading-relaxed">
//         {/* Logo Header */}
//          <div className="flex justify-center pt-6 pb-4">
//            <img
//             src={images?.infinityLogo}
//             alt="Infinity Supports WA logo"
//             className="mb-8 w-[200px] h-[80px] object-contain"
//           />
//         </div>

//         {/* Main Content */}
//         <div className="w-full max-w-3xl mx-auto px-6 flex-grow space-y-4 leading-[22px]">
//           <h1 className="font-bold text-[14px] leading-[18px]">
//             Elimination Of Restrictive Practices
//           </h1>
//           <p>
//             Infinity Supports WA is dedicated to actively working towards reducing and ultimately
//             eliminating the use of restrictive practices.
//           </p>
//           <p>
//             Infinity Supports WA pledges to ensure that restrictive practices are employed only
//             under extremely limited and specific circumstances, as a final resort, utilizing the
//             least intrusive methods and for the shortest duration necessary. Such practices should
//             be proportionate and justified, serving to safeguard the rights and safety of the
//             individual or others.
//           </p>
//           <p>
//             Infinity Supports WA is committed to providing suitable support and monitoring in an
//             environment tailored to the unique needs of participants exhibiting cognitive or
//             intellectual disabilities or behaviours that pose, or have the potential to pose, harm.
//           </p>
//           <p>
//             Infinity Supports WA is dedicated to upholding the rights, safety, and well-being of
//             individuals within our Organisation. We firmly believe in recognizing the purpose behind
//             every behaviour and responding appropriately to resolve issues, including those
//             exhibited by individuals posing potential harm and those diagnosed with mental illnesses.
//           </p>
//           <p>
//             Infinity Supports WA will adhere to the regulations outlined in the National Disability
//             Insurance Scheme (Restrictive Practices and Behaviour Support) Rules 2018, and the
//             Disability (NDIS Transition) Amendment Act 2019.
//           </p>
//           <p>
//             Infinity Supports WA is committed to ensuring that our services consistently meet
//             established standards, with a primary focus on safeguarding and advancing the human
//             rights of all participants.
//           </p>
//         </div>

//         {/* Footer */}
//          <footer className="w-full border-t border-gray-300 py-4">
//           <div className="max-w-3xl mx-auto px-6 flex justify-between text-xs text-gray-500">
//             <span>Website: {settings?.company_website}</span>
//             <span>{settings?.welcome_form}</span>
//             <span>Review Date: {settings?.review_date}</span>
//           </div>
//         </footer>
//       </div>
//     </A4PageWrapper>
//   );
// };

// export default Page23;


import React from 'react';
import A4PageWrapper from './A4PageWrapper';

const Page23 = ({ settings, images }: any) => (
  <A4PageWrapper>
    <div className="a4-inner font-[Times_New_Roman] text-black text-[14px] leading-relaxed">
      {/* Logo Header */}
      <div className="flex justify-center pt-6 pb-2">
        <img
          src={images?.infinityLogo}
          alt="Infinity Supports WA logo"
          className="mb-4 w-[140px] h-[56px] object-contain"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-3xl mx-auto px-6 flex flex-col space-y-4 leading-[22px]">
        <h1 className="font-bold text-[14px] leading-[18px]">
          Elimination Of Restrictive Practices
        </h1>
        <p>
          Infinity Supports WA is dedicated to actively working towards reducing and ultimately
          eliminating the use of restrictive practices.
        </p>
        <p>
          Infinity Supports WA pledges to ensure that restrictive practices are employed only
          under extremely limited and specific circumstances, as a final resort, utilizing the
          least intrusive methods and for the shortest duration necessary. Such practices should
          be proportionate and justified, serving to safeguard the rights and safety of the
          individual or others.
        </p>
        <p>
          Infinity Supports WA is committed to providing suitable support and monitoring in an
          environment tailored to the unique needs of participants exhibiting cognitive or
          intellectual disabilities or behaviours that pose, or have the potential to pose, harm.
        </p>
        <p>
          Infinity Supports WA is dedicated to upholding the rights, safety, and well-being of
          individuals within our Organisation. We firmly believe in recognizing the purpose behind
          every behaviour and responding appropriately to resolve issues, including those
          exhibited by individuals posing potential harm and those diagnosed with mental illnesses.
        </p>
        <p>
          Infinity Supports WA will adhere to the regulations outlined in the National Disability
          Insurance Scheme (Restrictive Practices and Behaviour Support) Rules 2018, and the
          Disability (NDIS Transition) Amendment Act 2019.
        </p>
        <p>
          Infinity Supports WA is committed to ensuring that our services consistently meet
          established standards, with a primary focus on safeguarding and advancing the human
          rights of all participants.
        </p>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-gray-300 py-3">
        <div className="max-w-3xl mx-auto px-6 flex justify-between text-xs text-gray-500">
          <span>Website: {settings?.company_website}</span>
          <span>{settings?.welcome_form}</span>
          <span>Review Date: {settings?.review_date}</span>
        </div>
      </footer>
    </div>
  </A4PageWrapper>
);

export default Page23;
