

import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { parseISO, isValid, format } from 'date-fns';
 const formatDate = (value: string): string => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parsed = parseISO(value);
    if (isValid(parsed)) {
      return format(parsed, 'dd-MM-yyyy');
    }
  }
  return value;
};
const Page11 = ({ settings, images }: any) => (
  <A4PageWrapper>
    <div className="a4-inner font-[Times_New_Roman] text-black text-base leading-relaxed">
      {/* Top: Logo */}
      <div className="flex justify-center pt-6 pb-2">
        <img
          src={images?.infinityLogo}
          alt="Infinity Supports WA logo"
          className="mb-4 w-[140px] h-[56px] object-contain"
        />
      </div>

      {/* Middle: Content */}
      <div className="flex-1 w-full max-w-3xl mx-auto px-6 flex flex-col">
        {/* Expectations of Participants */}
        <p className="font-bold mb-2">Expectations of Participants</p>
        <p className="mb-2">
          In accordance with the legislation, Infinity Supports WA expects its participants to:
        </p>
        <ul className="list-disc list-inside space-y-1 mb-4">
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
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>To adhere to and enforce the concept of human rights.</li>
          <li>To support and aid all participants in times of need.</li>
          <li>To recognise and implement the necessary measures to ensure that all participants are receiving quality care.</li>
          <li>Ensure that the interests of the participants are considered and upheld.</li>
          <li>Ensure all rights and responsibilities are effectively enforced within the framework of Infinity Supports WA.</li>
          <li>Notify Management or the Director of any breaches or violations of human rights—whether of their own or the participant's.</li>
        </ul>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-gray-300 py-3">
        <div className="max-w-3xl mx-auto px-6 flex justify-between text-xs text-gray-500">
          <span>Website: {settings?.company_website}</span>
          <span>{settings?.welcome_form}</span>
<div>Review Date: {formatDate(settings?.review_date)}</div>
        </div>
      </footer>
    </div>
  </A4PageWrapper>
);

export default Page11;
