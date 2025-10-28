
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
const Page7: React.FC<any> = ({settings}: any ) => {
  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full font-[Times_New_Roman] text-black text-sm leading-relaxed">
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
          <p className="mb-4">
            We are also available to assist you should you encounter any problems with your service providers. This may
            be something small, but you don’t feel comfortable approaching it or maybe questions you don’t feel like
            you’re getting answered. We are there to be the middleman so you can maintain your relationships while
            ensuring your voice is being heard.
          </p>

          <p className="mb-1 font-bold">Management of Budgets, Statements and Fees</p>
          <p className="mb-4">
            You receive a NDIS funding package to pay for your disability support and support management. Your package
            lets you decide the type of disability supports you need, who provides it and where it is provided. Thank
            you for choosing Infinity Supports WA as part of your support team. Our team will never offer you financial
            advice or information.
          </p>

          <p className="mb-4">
            Infinity Supports WA will regularly inform you of the cost of the services being provided. We are
            transparent with our fee structure. When starting your service with us, we will provide you with a statement
            that clearly outlines your fees. We then will provide you with a statement each month that outlines your
            fees.
          </p>

          <p className="mb-4">
            Fees may be changed during your service delivery as per NDIS price guide, but you will be informed of this
            increase two weeks in advance.
          </p>

          <p className="mb-4">
            <span className="font-bold">Please note</span>: There are annual changes in the NDIS Price Guide; these will
            automatically adjust your fees.
          </p>

          <p className="mb-4">Before services are provided, we will inform you of:</p>

          <ul className="list-disc list-inside space-y-1 mb-10">
            <li>chargeable fees</li>
            <li>
              payment methods, i.e. direct debit, cheque, money order (please never pay a Staff directly)
            </li>
            <li>your budget (or the amount of money you can spend)</li>
            <li>methods for payment of fees.</li>
          </ul>
        </div>

        {/* Bottom: Footer (consistent with all pages) */}
        <footer className="w-full border-t border-gray-300 py-4">
          <div className="max-w-3xl mx-auto px-6 flex justify-between text-xs text-gray-500">
            <span>Website: {settings?.company_website}</span>
            <span>{settings?.welcome_form}</span>
<div>Review Date: {formatDate(settings?.review_date)}</div>
          </div>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page7;
