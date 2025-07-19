

import React from 'react';
import A4PageWrapper from './A4PageWrapper';

const Page19: React.FC = ({settings}: any ) => {
  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full font-[Times_New_Roman] text-black text-base leading-relaxed">
        {/* Header: Logo */}
         <div className="flex justify-center pt-6 pb-4">
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA logo"
            className="h-[60px] w-[150px] object-contain"
          />
        </div>

        {/* Content */}
        <div className="flex-grow w-full max-w-3xl mx-auto px-6">
          {/* Table */}
          <table className="w-full border border-gray-300 text-sm mb-10 table-fixed">
            <tbody>
              <tr>
                <td className="border border-gray-300 p-3 align-top leading-[1.5]">
                  Unlawful sexual or physical contact with, or assault of, a person with disability
                </td>
                <td className="border border-gray-300 p-3 font-bold text-center w-36 align-top">
                  24 hours
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-3 align-top leading-[1.5]">
                  Sexual misconduct committed against, or in the presence of, a person with disability,
                  including grooming of the person for sexual activity
                </td>
                <td className="border border-gray-300 p-3 font-bold text-center w-36 align-top">
                  24 hours
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 align-top leading-[1.5]">
                  The use of a restrictive practice in relation to a person with disability if the use
                  is not in accordance with a required state or territory authorisation and/or not in
                  accordance with a behaviour support plan.
                </td>
                <td className="border border-gray-300 p-3 font-bold text-center w-36 align-top">
                  Five business days
                </td>
              </tr>
            </tbody>
          </table>

          {/* Feedback Section */}
          <p className="text-center font-bold mb-4">Complaints and Feedback</p>
          <p className="text-justify mb-4">
            Your feedback allows us to provide you with high-quality services; we actively seek your
            input. Feedback can be provided using our feedback form which is available as an online
            form on our website. Alternatively, a physical copy can be provided on request to your
            support worker, manager or our management team. We would like your feedback on:
          </p>

          <ul className="list-disc list-inside space-y-1 mb-10">
            <li>Quality of care received</li>
            <li>Consistency of services provided</li>
            <li>Support worker performance</li>
            <li>Supports that work for you</li>
            <li>Changes you want made to assist you</li>
            <li>What you like and dislike about our services</li>
          </ul>
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

export default Page19;
