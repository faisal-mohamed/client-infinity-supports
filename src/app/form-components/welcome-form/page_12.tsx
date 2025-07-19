

import React from 'react';
import A4PageWrapper from './A4PageWrapper';

const Page12: React.FC = ({settings}: any ) => {
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
          <p className="font-bold mb-1">Your Privacy</p>
          <p className="mb-3">Privacy and Confidentiality Policy (extract)</p>
          <p className="font-bold mb-1">Full policy available on request and on our website</p>
          <p className="mb-4">
            Infinity Supports WA will only require confidential information to determine potential participants’ suitability for a service and to monitor the services provided.
            <br />
            A participant is entitled to supply, access, update and use any personal information if necessary to ensure correct information is in the system. They may refuse to disclose some information and have the right to revoke their consent to disclose personal information.
            <br />
            Personal participant information that Infinity Supports WA collects involves, but is not limited to:
          </p>

          {/* Data Categories Table */}
          <table className="w-full border-collapse mb-6">
            <tbody>
              {[
                {
                  color: '#e07a5f',
                  text: 'Incident reports | Emergency contact details | Consent forms',
                  maxWidth: 320
                },
                {
                  color: '#d87f5a',
                  text: 'Health status | Contact information | Medical Documents',
                  maxWidth: 280
                },
                {
                  color: '#c97f7a',
                  text: 'Immunisation records | Organisation information',
                  maxWidth: 260
                },
                {
                  color: '#a97a7a',
                  text: 'Development of records, plans, portfolios and observations',
                  maxWidth: 360
                },
                {
                  color: '#9a9a9a',
                  text: 'Intake of delivery services, assessment and data review',
                  maxWidth: 360
                }
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="border border-black p-0">
                    <div
                      className="text-white text-xs font-semibold px-3 py-1 rounded-r-md w-full"
                      style={{
                        backgroundColor: row.color,
                        maxWidth: `${row.maxWidth}px`
                      }}
                    >
                      {row.text}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Closing paragraph */}
          <p className="mb-6">
            Before collecting personal information from participants or their advocates, Infinity Supports WA workers must clarify why the information is being collected, how it will be stored and used, and why Infinity Supports WA requires it. Infinity Supports WA only gathers the necessary personal information of participants for the protected and adequate provision of services. All private and confidential information must be stored securely.
          </p>
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

export default Page12;
