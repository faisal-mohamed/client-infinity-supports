

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
const Page4 = ({ settings, images }: any) => (
  <A4PageWrapper>
    <div className="a4-inner font-sans text-black text-sm">
      {/* Top: Logo */}
      <div className="w-full max-w-3xl mx-auto px-6 pt-8 flex justify-center">
        <img
          src={images?.infinityLogo}
          alt="Infinity Supports WA logo"
          className="w-[160px] h-[64px] object-contain mb-6"
        />
      </div>

      {/* Middle: Values Section */}
      <div className="flex-1 flex flex-col items-center px-6 max-w-3xl mx-auto">
        <img
          src={images?.p4_1}
          alt="Our Values logo"
          className="w-[140px] h-[96px] object-contain mb-6"
        />

        <h1
          className="text-2xl font-bold mb-8 font-[Playfair_Display]"
          style={{ letterSpacing: '-0.02em' }}
        >
          Our Values
        </h1>

        <section className="text-base leading-relaxed max-w-2xl space-y-4 text-justify">
          <p>
            <strong>Individuals</strong> – Giving every individual a voice, choice &amp; control and the
            opportunity to live a fulfilled life.
          </p>
          <p>
            <strong>Passion</strong> – We are passionate to listen and empower people with disabilities to
            achieve their goals.
          </p>
          <p>
            <strong>Integrity</strong> – We protect privacy of those we work with whilst being always honest
            and transparent.
          </p>
          <p>
            <strong>Respect</strong> – We embrace diversity. We believe in inclusiveness and equality.
          </p>
        </section>
      </div>

      {/* Footer at bottom */}
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

export default Page4;
