"use client";

import React, { useEffect, useState } from 'react';
import { fetchFormSpecificSettings } from '@/lib/settings';
import FormPage from '@/components/ui/FormPage';

export default function EmployeeDetailsView({ data, meta: metaProp }: { data?: any; meta?: { website?: string; version?: string; reviewDate?: string } }) {
  const [meta, setMeta] = useState<{ website: string; version: string; reviewDate: string }>({ 
    website: 'infinitysupportswa.org', 
    version: 'SF004', 
    reviewDate: '2025-03-01' 
  });

  useEffect(() => {
    (async () => {
      try {
        const settings = await fetchFormSpecificSettings();
        const getSettingValue = (key: string): string | null => {
          const groups = Object.values(settings || {});
          for (const group of groups) {
            if (Array.isArray(group)) {
              const s = group.find((it: any) => it && it.key === key);
              if (s) return s.value || s.defaultValue || null;
            }
          }
          return null;
        };
        setMeta({
          website: getSettingValue('company_website') || 'infinitysupportswa.org',
          version: getSettingValue('employee_details_form_id') || 'SF004',
          reviewDate: getSettingValue('review_date') || new Date().toISOString().slice(0,10),
        });
      } catch {}
    })();
  }, []);


  useEffect(() => {
    console.log("data: ", data);
  }, [data])

  return (
    <div className="bg-gray-100 py-8">
      {/* Page 1 */}
      <FormPage title="Employee Details Form" meta={meta}>
        <div className="w-full">
          <div className="border border-gray-300 rounded-lg p-6 w-full">
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <Field label="First Name" value={data?.data?.firstName} />
                <Field label="Last Name" value={data?.data?.lastName} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Start Date" value={data?.data?.startDate} />
                <Field label="Position Title" value={data?.data?.positionTitle} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Gender" value={data?.data?.gender} />
                <Field label="Date of Birth" value={data?.data?.dateOfBirth} />
              </div>
              <Field label="Address" value={data?.data?.address} />
              <div className="grid grid-cols-3 gap-4">
                <Field label="Suburb" value={data?.data?.suburb} />
                <Field label="State" value={data?.data?.state} />
                <Field label="Postcode" value={data?.data?.postcode} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Home Phone" value={data?.data?.homePhone} />
                <Field label="Mobile" value={data?.data?.mobile} />
                <Field label="Work" value={data?.data?.workPhone} />
              </div>
              <Field label="Email Address" value={data?.data?.email} />

              <Field label="Employee Tax File" value={data?.data?.employeeTaxFile} />

              <div className="border border-black rounded-lg p-4">
                <div className="font-semibold text-gray-800 mb-3">Bank Details</div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Bank Name" value={data?.data?.bankName} />
                  <Field label="Branch" value={data?.data?.bankBranch} />
                </div>
                <Field label="Account Name" value={data?.data?.accountName} />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="BSB" value={data?.data?.bsb} />
                  <Field label="Account Number" value={data?.data?.accountNumber} />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-xs font-medium text-gray-700 mr-4">Are you an Australian citizen?</span>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={data?.data?.isAustralianCitizen === true} readOnly className="w-4 h-4 border-gray-400" />
                      <span className="text-xs">Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={data?.data?.isAustralianCitizen === false} readOnly className="w-4 h-4 border-gray-400" />
                      <span className="text-xs">No</span>
                    </label>
                  </div>
                </div>
                
                <div className="ml-4 space-y-2">
                  <div className="text-xs text-gray-600">If no,</div>
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-gray-700 mr-4">- Are you a permanent resident?</span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={data?.data?.isPermanentResident === true} readOnly className="w-4 h-4 border-gray-400" />
                        <span className="text-xs">Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={data?.data?.isPermanentResident === false} readOnly className="w-4 h-4 border-gray-400" />
                        <span className="text-xs">No</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-medium text-gray-700">- Do you have a Working Visa?</span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={data?.data?.hasWorkingVisa === true} readOnly className="w-4 h-4 border-gray-400" />
                        <span className="text-xs">Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={data?.data?.hasWorkingVisa === false} readOnly className="w-4 h-4 border-gray-400" />
                        <span className="text-xs">No</span>
                      </label>
                    </div>
                    <span className="text-xs font-medium text-gray-700 ml-4">Expiry date:</span>
                    <div className="flex items-center gap-1">
                      <div className="w-8 h-6 border-b-2 border-gray-400 flex items-center justify-center text-xs">
                        {data?.data?.visaExpiryDate ? data.data.visaExpiryDate.split('-')[2] : ''}
                      </div>
                      <span className="text-xs">/</span>
                      <div className="w-8 h-6 border-b-2 border-gray-400 flex items-center justify-center text-xs">
                        {data?.data?.visaExpiryDate ? data.data.visaExpiryDate.split('-')[1] : ''}
                      </div>
                      <span className="text-xs">/</span>
                      <div className="w-12 h-6 border-b-2 border-gray-400 flex items-center justify-center text-xs">
                        {data?.data?.visaExpiryDate ? data.data.visaExpiryDate.split('-')[0] : ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Field label="Any restrictions?" value={data?.data?.workRestrictions} />

              <Field label="Next of Kin" value={data?.data?.nokName} />
              <Field label="Relationship" value={data?.data?.nokRelationship} />
              <Field label="Address" value={data?.data?.nokAddress} />
              <div className="grid grid-cols-3 gap-4">
                <Field label="Suburb" value={data?.data?.nokSuburb} />
                <Field label="State" value={data?.data?.nokState} />
                <Field label="Postcode" value={data?.data?.nokPostcode} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Home Phone" value={data?.data?.nokHomePhone} />
                <Field label="Mobile" value={data?.data?.nokMobile} />
                <Field label="Work" value={data?.data?.nokWorkPhone} />
              </div>
            </div>
          </div>
        </div>
      </FormPage>

      {/* Page 2 */}
      <FormPage showTitle={false} meta={meta}>
        <div className="w-full">
          <div className="border border-gray-300 rounded-lg p-6 w-full">
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <SignatureField label="Employee Signature" value={data?.staffSignature} />
                <Field label="Date" value={formatSignatureDate(data?.staffSignedAt)} />
              </div>

              <div className="border border-black rounded-lg p-4">
                <div className="font-bold text-lg mb-4">Office Use Only</div>
                <div className="font-bold text-base mb-3">Employee:</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-medium text-gray-700 mb-2">Status:</div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={data?.data?.employmentStatus === 'FullTime'} readOnly className="w-4 h-4 border-gray-400" />
                        <span className="text-xs">Full time</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={data?.data?.employmentStatus === 'PartTime'} readOnly className="w-4 h-4 border-gray-400" />
                        <span className="text-xs">Part time</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={data?.data?.employmentStatus === 'Casual'} readOnly className="w-4 h-4 border-gray-400" />
                        <span className="text-xs">Casual</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Field label="Pay rate" value={data?.data?.payRate} />
                    <Field label="SCHADS Level" value={data?.data?.schadsScore} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormPage>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex items-center">
      <span className="text-xs font-medium text-gray-700 mr-2">{label}:</span>
      <div className="flex-1 border-b-2 border-gray-400 h-6 ml-2">
        {value || ''}
      </div>
    </div>
  );
}
function SignatureField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center">
      <span className="text-xs font-medium text-gray-700 mr-2">{label}:</span>
      <div className="flex-1 border-b-2 border-gray-400 h-16 ml-2 flex items-center justify-center">
        {value ? (
          <img 
            src={value} 
            alt="Signature" 
            className="max-h-12 max-w-full object-contain"
          />
        ) : 'no signature'}
      </div>
    </div>
  );
}

function formatSignatureDate(dateString?: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}
function Section({ title }: { title: string }) {
  return (
    <div className="mt-4 mb-2 font-semibold text-gray-800 border-b border-gray-400 pb-1">{title}</div>
  );
}

function Footer({ meta }: { meta: { website?: string; version?: string; reviewDate?: string } }) {
  return (
    <div className="text-[10px] text-gray-600 grid grid-cols-3">
      <div>Website: {meta.website || 'infinitysupportswa.org'}</div>
      <div className="text-center">{meta.version || 'SF004'}</div>
      <div className="text-right">Review Date: {formatDate(meta.reviewDate) || ''}</div>
    </div>
  );
}

function bool(v: any) { return v === true ? 'Yes' : v === false ? 'No' : ''; }
function formatDate(d?: string) {
  if (!d) return '';
  try {
    // Use deterministic client/server-safe formatting (DD/MM/YYYY)
    const iso = d.split('T')[0];
    const [y, m, day] = iso.split('-');
    if (y && m && day) return `${day}/${m}/${y}`;
    return iso;
  } catch {
    return d;
  }
}


