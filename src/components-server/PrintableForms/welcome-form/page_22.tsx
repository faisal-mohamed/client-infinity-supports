
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
const agencyPills = [
  { label: 'Commission for Children and Young People',     bg: '#fb923c', text: 'white' },
  { label: 'NDIS Commissions, Complaints, Integrity and Privacy Unit', bg: '#ea580c', text: 'white' },
  { label: 'Ombudsman',                                   bg: '#fdba74', text: 'white' },
  { label: 'The National Disability Insurance Agency (NDIA)', bg: '#fed7aa', text: '#1f2937' },
  { label: 'Office of the Commissioner for Privacy and Data Protection', bg: '#fde68a', text: '#1f2937' },
  { label: 'Independent Broad-based Anti-Corruption Commission (IBAC)', bg: '#9ca3af', text: 'white' },
  { label: 'Disability Services Commission',               bg: '#6b7280', text: 'white' },
];

const Page22 = ({ settings, images }: any) => (
  <A4PageWrapper>
    <div className="a4-inner font-[Times_New_Roman] text-black text-[14px] leading-relaxed">
      {/* Logo */}
      <div className="flex justify-center pt-6 pb-2">
        <img
          src={images?.infinityLogo}
          alt="Infinity Supports WA logo"
          className="mb-4 w-[140px] h-[56px] object-contain"
        />
      </div>

      {/* Content */}
      <div className="flex-1 w-full max-w-3xl mx-auto px-6 flex flex-col">
        <p className="mb-4">
          If you are not happy with the solution proposed by Infinity Supports WA regarding your
          complaint, you can speak to other organisations, such as:
        </p>

        {/* Commonwealth Ombudsman */}
        <div className="mb-4">
          <p className="font-bold mb-1">Commonwealth Ombudsman – Disability Services</p>
          <p>
            <span className="inline-block w-[90px]">Telephone:</span> 1300 362 072
          </p>
          <p>
            <span className="inline-block w-[90px]">Email:</span> ombudsman@ombudsman.gov.au
          </p>
          <p>
            <span className="inline-block w-[90px]">Website:</span>
            <a
              className="text-blue-700 underline"
              href="https://www.ombudsman.gov.au"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.ombudsman.gov.au
            </a>
          </p>
        </div>

        {/* NDIS Complaints */}
        <div className="mb-4">
          <p className="font-bold mb-1">NDIS Complaints</p>
          <p>
            <span className="inline-block w-[90px]">Telephone:</span> 1800 800 110
          </p>
          <p>
            <span className="inline-block w-[90px]">Email:</span> feedback@ndis.gov.au
          </p>
          <p>
            <span className="inline-block w-[90px]">Website:</span>
            <a
              className="text-blue-700 underline"
              href="https://www.ndis.gov.au/contact/feedback-and-complaints"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.ndis.gov.au/contact/feedback-and-complaints
            </a>
          </p>
        </div>

        <p className="mb-3">
          Individuals can make a complaint directly to the following agencies at any time they wish to:
        </p>

        {/* Agency Pills */}
        <div className="space-y-1 max-w-[400px]">
          {agencyPills.map((pill, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div style={{ width: 20, height: 20, borderRadius: '9999px', border: `2px solid ${pill.bg}` }} />
              <div
                style={{ background: pill.bg, color: pill.text, borderRadius: 4, fontSize: 10, fontWeight: 600, padding: '2px 8px', width: '100%' }}
              >
                {pill.label}
              </div>
            </div>
          ))}
        </div>
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

export default Page22;
