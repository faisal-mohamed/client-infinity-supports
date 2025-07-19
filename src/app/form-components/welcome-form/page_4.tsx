import React from 'react';
import A4PageWrapper from './A4PageWrapper';

const Page4: React.FC = ({settings} : any ) => {
  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full font-sans text-black text-sm">
        {/* Top: Logo */}
        <div className="w-full max-w-3xl mx-auto px-6 pt-10 flex justify-center">
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA logo"
            className="w-[200px] h-[80px] object-contain mb-10"
          />
        </div>

        {/* Middle: Values Section */}
        <div className="flex-grow flex flex-col items-center px-6 max-w-3xl mx-auto">
          <img
            src="/welcomeimg/p4-1.png"
            alt="Our Values logo"
            className="w-[200px] h-[160px] object-contain mb-8"
          />

          <h1
            className="text-4xl font-bold mb-12 font-[Playfair_Display]"
            style={{ letterSpacing: '-0.02em' }}
          >
            Our Values
          </h1>

          <section className="text-base leading-relaxed max-w-2xl space-y-6 text-justify">
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

        {/* Bottom: Footer (matches Page2 and Page3) */}
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

export default Page4;
