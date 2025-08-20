"use client";

import React from 'react';

function A4Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white w-full max-w-[794px] mx-auto min-h-[1123px] border shadow p-8 print:p-6">
      {children}
    </div>
  );
}

export default function EmployeeDetailsView({ data, meta: metaProp }: { data?: any; meta?: { website?: string; version?: string; reviewDate?: string } }) {
  const meta = metaProp || { website: 'infinitysupportswa.org', version: 'SF004', reviewDate: '2025-03-01' };

  return (
    <div className="bg-gray-100 py-8">
      {/* Page 1 */}
      <A4Page>
        <div className="text-center mb-6">
          <img src="/infinity_logo.png" alt="Infinity Support WA" className="h-10 mx-auto" />
          <h1 className="mt-2 font-semibold">Employee Details Form</h1>
        </div>

        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name" value={data?.firstName} />
            <Field label="Last Name" value={data?.lastName} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Start Date" value={data?.startDate} />
            <Field label="Position Title" value={data?.positionTitle} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Gender" value={data?.gender} />
            <Field label="Date of Birth" value={data?.dateOfBirth} />
          </div>
          <Field label="Address" value={data?.address} />
          <div className="grid grid-cols-3 gap-4">
            <Field label="Suburb" value={data?.suburb} />
            <Field label="State" value={data?.state} />
            <Field label="Postcode" value={data?.postcode} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Home Phone" value={data?.homePhone} />
            <Field label="Mobile" value={data?.mobile} />
          </div>
          <Field label="Email Address" value={data?.email} />

          <Section title="Employee Tax File" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Bank Name" value={data?.bankName} />
            <Field label="Branch" value={data?.bankBranch} />
          </div>
          <Field label="Account Name" value={data?.accountName} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="BSB" value={data?.bsb} />
            <Field label="Account Number" value={data?.accountNumber} />
          </div>

          <Section title="Residency & Work Rights" />
          <Field label="Are you an Australian citizen?" value={bool(data?.isAustralianCitizen)} />
          <Field label="Are you a permanent resident?" value={bool(data?.isPermanentResident)} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Do you have a Working Visa?" value={bool(data?.hasWorkingVisa)} />
            <Field label="Visa Expiry Date" value={data?.visaExpiryDate} />
          </div>
          <Field label="Any restrictions?" value={data?.workRestrictions} />

          <Section title="Next of Kin" />
          <Field label="Next of Kin" value={data?.nokName} />
          <Field label="Relationship" value={data?.nokRelationship} />
          <Field label="Address" value={data?.nokAddress} />
          <div className="grid grid-cols-3 gap-4">
            <Field label="Suburb" value={data?.nokSuburb} />
            <Field label="State" value={data?.nokState} />
            <Field label="Postcode" value={data?.nokPostcode} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Home Phone" value={data?.nokHomePhone} />
            <Field label="Mobile" value={data?.nokMobile} />
            <Field label="Work" value={data?.nokWorkPhone} />
          </div>
        </div>

        <Footer meta={meta} />
      </A4Page>

      {/* Page 2 */}
      <A4Page>
        <div className="text-center mb-6">
          <img src="/infinity_logo.png" alt="Infinity Support WA" className="h-10 mx-auto" />
        </div>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Employee Signature" value={data?.employeeSignature} />
            <Field label="Date" value={data?.employeeSignatureDate} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Manager’s Signature" value={data?.managerSignature} />
            <Field label="Date" value={data?.managerSignatureDate} />
          </div>

          <Section title="Office Use Only" />
          <Field label="Employee" value={data?.officeEmployee} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Status" value={data?.employmentStatus} />
            <Field label="Pay rate" value={data?.payRate} />
          </div>
          <Field label="SCHADS score" value={data?.schadsScore} />
        </div>
        <Footer meta={meta} />
      </A4Page>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-medium text-gray-700 mb-1">{label}:</div>
      <div className="border border-gray-400 h-8 rounded-sm px-2 flex items-center text-gray-900 bg-white">
        {value || ''}
      </div>
    </div>
  );
}

function Section({ title }: { title: string }) {
  return (
    <div className="mt-4 mb-2 font-semibold text-gray-800 border-b border-gray-400 pb-1">{title}</div>
  );
}

function Footer({ meta }: { meta: { website?: string; version?: string; reviewDate?: string } }) {
  return (
    <div className="mt-6 pt-2 text-[10px] text-gray-600 grid grid-cols-3">
      <div>Website: {meta.website || 'infinitysupportswa.org'}</div>
      <div className="text-center">{meta.version || 'SF004'}</div>
      <div className="text-right">Review Date: {formatDate(meta.reviewDate) || ''}</div>
    </div>
  );
}

function bool(v: any) { return v === true ? 'Yes' : v === false ? 'No' : ''; }
function formatDate(d?: string) { if (!d) return ''; try { return new Date(d).toLocaleDateString(); } catch { return d; } }


