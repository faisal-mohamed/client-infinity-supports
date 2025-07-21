


import React from 'react';
import A4PageWrapper from './A4PageWrapper';

const Page11: React.FC<any> = ({settings}: any ) => {
  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full font-[Times_New_Roman] text-black text-base leading-relaxed">
        {/* Top: Logo */}
         <div className="flex justify-center pt-6 pb-4">
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA logo"
            className="h-[60px] w-[150px] object-contain"
          />
        </div>

        {/* Middle: Content */}
        <div className="flex-grow w-full max-w-3xl mx-auto px-6">
          {/* Expectations of Participants */}
          <p className="font-bold mb-2">Expectations of Participants</p>
          <p className="mb-4">
            In accordance with the legislation, Infinity Supports WA expects its participants to:
          </p>
          <ul className="list-disc list-inside space-y-1 mb-8">
            <li>Advise Infinity Supports WA if assistance or support is no longer needed.</li>
            <li>Notify workers of any developments with the participant’s conditions and desires.</li>
            <li>Be courteous and respectful to workers as well as other participants.</li>
            <li>Regard others' freedoms like their privacy rights and confidentiality.</li>
            <li>Value the integrity and human morality of its workers and other participants.</li>
            <li>Notify workers of any developmental, welfare, or physical condition concerns that may affect assistance provided to you.</li>
            <li>Engage constructively in the creation, delivery, and analysis of support services targeting people.</li>
            <li>Take accountability for any selections and the consequences of any choices made.</li>
            <li>Make any payments and expenses related to the delivery of your service urgently or when requested.</li>
          </ul>

          {/* Worker Responsibilities */}
          <p className="font-bold mb-2">Worker Responsibilities</p>
          <ul className="list-disc list-inside space-y-1 mb-6">
            <li>To adhere to and enforce the concept of human rights.</li>
            <li>To support and aid all participants in times of need.</li>
            <li>To recognise and implement the necessary measures to ensure that all participants are receiving quality care.</li>
            <li>Ensure that the interests of the participants are considered and upheld.</li>
            <li>Ensure all rights and responsibilities are effectively enforced within the framework of Infinity Supports WA.</li>
            <li>Notify Management or the Director of any breaches or violations of human rights—whether of their own or the participant's.</li>
          </ul>
        </div>

        {/* Bottom: Footer */}
         <footer className="w-full border-t border-gray-300 py-4">
          <div className="max-w-3xl mx-auto px-6 flex justify-between text-xs text-gray-500">
            <span>Website: {settings?.company_website}</span>
            <span>{settings?.welcome_form}</span>
            <span>Review Date: {settings?.review_date}</span>
          </div>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page11;
