
import React from 'react';
import A4PageWrapper from './A4PageWrapper';

const Page25 = ({settings, images}: any ) => {
  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full text-[14px] text-black font-[Times_New_Roman]">
        {/* Logo Header */}
        <div className="flex justify-center pt-6 pb-4">
           <img
            src={images?.infinityLogo}
            alt="Infinity Supports WA logo"
            className="mb-8 w-[200px] h-[80px] object-contain"
          />
        </div>

        {/* Contact Info */}
        <div className="w-full max-w-3xl mx-auto px-6 flex-grow text-base leading-relaxed space-y-4">
          <div>
            <p className="font-bold">Important Contacts</p>
            <p>
              Infinity Supports WA is not an emergency service. We are unable to answer phone calls outside of our normal working hours (8.30 am to 4.30 pm Monday to Friday).
            </p>
          </div>

          <div>
            <p className="font-bold">NDIS</p>
            <p>
              Phone: 1800 800 110<br />
              Email: enquiries@ndis.gov.au
            </p>
          </div>

          <div>
            <p className="font-bold">Emergency</p>
            <p>Dial 000</p>
          </div>

          <div>
            <p className="font-bold">Crisis and Mental Health Support</p>
            <p>
              Beyond Blue: 1300 224 636<br />
              Lifeline Australia: 13 11 14<br />
              Suicide Call Back Service: 1300 659 467<br />
              Mental Health Emergency Response Line: 1300 555 788 (Metro) / 1800 676 822 (Peel)<br />
              Kids Helpline: 1800 55 1800<br />
              Mensline Australia: 130 78 99 78<br />
              Sexual Assault, Family and Domestic Violence Line: 1800 424 017
            </p>
          </div>

          <div>
            <p className="font-bold">Medical</p>
            <p>
              Health Direct (24 hours health advice): 1800 022 222<br />
              Poisons Information Line: 131 126
            </p>
          </div>
        </div>

        {/* Footer */}
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

export default Page25;
