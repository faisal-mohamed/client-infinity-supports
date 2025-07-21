

import React from 'react';
import A4PageWrapper from './A4PageWrapper';

const Page21: React.FC<any> = ({settings}: any ) => {
  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full font-[Times_New_Roman] text-black text-sm leading-relaxed">
        {/* Logo */}
         <div className="flex justify-center pt-6 pb-4">
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA logo"
            className="h-[60px] w-[150px] object-contain"
          />
        </div>

        {/* Content */}
        <div className="flex-grow w-full max-w-3xl mx-auto px-6">
          <p className="mb-4">
            Please send your complaints addressed to the Complaint Manager via any of the below means:
          </p>

          {/* Contact Table */}
          <table className="w-full border border-black border-collapse mb-8 text-sm">
            <tbody>
              <tr>
                <th className="border border-black p-2 text-left align-top w-[110px] font-semibold">
                  Email:
                </th>
                <td className="border border-black p-2">
                  <a href="mailto:admin@infinitysupportswa.org" className="text-blue-700 underline">
                    admin@infinitysupportswa.org
                  </a>
                </td>
              </tr>
              <tr>
                <th className="border border-black p-2 text-left align-top font-semibold">
                  Postal address:
                </th>
                <td className="border border-black p-2">
                  <ul className="pl-4 list-disc list-inside">
                    <li>
                      Complete Form02 Complaint Report Form. Should you wish to remain anonymous, do not
                      fill in the participant details and mail it to PO BOX 4275, Baldivis 6171.
                    </li>
                  </ul>
                </td>
              </tr>
              <tr>
                <th className="border border-black p-2 text-left align-top font-semibold">
                  Phone
                </th>
                <td className="border border-black p-2">
                  <ul className="pl-4 list-disc list-inside">
                    <li>Speak to your support worker or coordinator</li>
                    <li>
                      Call us on 0493282661 or 0493141688 <br />
                      (Monday to Friday 8.30 am to 4.30pm)
                    </li>
                  </ul>
                </td>
              </tr>
              <tr>
                <th className="border border-black p-2 text-left align-top font-semibold">
                  Website
                </th>
                <td className="border border-black p-2">
                  <ul className="pl-4 list-disc list-inside">
                    <li>Visit our website and complete an online complaint/feedback form.</li>
                    <li>
                      <a
                        href="https://infinitysupportswa.org/feedback-and-complaints/"
                        className="text-blue-700 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        https://infinitysupportswa.org/feedback-and-complaints/
                      </a>
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>

          <p className="mb-6">
            Once a complaint has been received, Infinity Supports WA will investigate the complaint
            and find a resolution. The Managing Director will write a letter to confirm that your
            complaint has been received. This letter will provide you with the expected date Infinity
            Supports WA aims to resolve the complaint.
          </p>

          <p className="mb-10">
            The complaint will then be investigated, and a plan to resolve it created. You will be
            informed of this plan, and we will ask you to provide your opinion on our recommended
            solution. You can advise if you are happy with the proposed solution or unhappy with the
            outcome and feel the matter is not resolved. Any ongoing issue could be identified by
            tracking and analysing feedback and complaint data. As part of the continuous
            improvement process, the feedback, complaints and dispute resolution will be discussed in
            management team meetings regularly.
          </p>
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

export default Page21;
