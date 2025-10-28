import React from 'react';
import { format, parseISO, isValid } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

// ===== A4 PAGE WRAPPER (Same as individual-risk-assessment) =====
const A4PageWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}> = ({ children, className = '', footer }) => {
  return (
    <div
      className={`
        a4-page
        w-[210mm] min-h-[297mm]
        mx-auto
        bg-white
        border border-gray-300
        shadow-lg
        flex flex-col
        p-[20mm]
        print:shadow-none
        print:border-none
        print:p-[15mm]
        print:break-after-page
        print:break-inside-avoid
        font-montserrat
        ${className}
      `}
      style={{
        boxSizing: 'border-box',
      }}
    >
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      {footer && (
        <div className="mt-auto pt-[10mm] border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

const Page21 = ({ settings, images }: any) => {
  const formatDate = (value: string) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }
    return value || 'N/A';
  };

  const footer = (
    <div className={`flex justify-between ${A4_PDF_TYPOGRAPHY.footer} px-2 text-gray-600`}>
      <span>Website: {settings?.company_website || 'https://www.infinitysupportswa.org'}</span>
      <span>{settings?.welcome_form || 'WF001'}</span>
      <span>Review Date: {formatDate(settings?.review_date)}</span>
    </div>
  );

  return (
    <A4PageWrapper footer={footer}>
      <div className="flex flex-col h-full">
        {/* Logo Header */}
        <div className="flex justify-center pt-6 pb-4">
          <img
            src={images?.infinityLogo}
            alt="Infinity Supports WA logo"
            width={STANDARD_LOGO.width}
            height={STANDARD_LOGO.height}
            className={STANDARD_LOGO.className}
          />
        </div> <br /><br />

        {/* Content */}
        <div className="flex-1 w-full max-w-3xl mx-auto px-6 space-y-3">
          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify mb-3`}>
            Please send your complaints addressed to the Complaint Manager via any of the below means:
          </p> <br /><br />

          {/* Contact Information Table */}
          <table className={`w-full border border-black border-collapse mb-4 ${A4_PDF_TYPOGRAPHY.body}`}>
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
          </table> <br /><br />

          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify mb-3`}>
            Once a complaint has been received, Infinity Supports WA will investigate the complaint
            and find a resolution. The Managing Director will write a letter to confirm that your
            complaint has been received. This letter will provide you with the expected date Infinity
            Supports WA aims to resolve the complaint.
          </p> <br /><br />

          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify mb-5`}>
            The complaint will then be investigated, and a plan to resolve it created. You will be
            informed of this plan, and we will ask you to provide your opinion on our recommended
            solution. You can advise if you are happy with the proposed solution or unhappy with the
            outcome and feel the matter is not resolved. Any ongoing issue could be identified by
            tracking and analysing feedback and complaint data. As part of the continuous
            improvement process, the feedback, complaints and dispute resolution will be discussed in
            management team meetings regularly.
          </p> <br /><br />
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page21;
