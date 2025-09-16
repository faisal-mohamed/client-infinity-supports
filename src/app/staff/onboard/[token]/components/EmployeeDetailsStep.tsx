"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { employeeDetailsSchema as schema } from '../../[token]/schema';
import SignatureCanvas from '@/components/ui/SignatureCanvas';
import { fetchFormSpecificSettings } from '@/lib/settings';

export interface EmployeeDetailsStepRef { 
  save: (submit?: boolean) => Promise<boolean>; 
  validate: () => boolean; 
  validateDetailed: () => { isValid: boolean; missing?: string[]; invalid?: string[] } | null;
  getData: () => any 
}

export default forwardRef<EmployeeDetailsStepRef, { token: string; onValidityChange?: (v: boolean)=>void }>(function EmployeeDetailsStep({ token, onValidityChange }, ref) {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState<{ website: string; formId: string; reviewDate: string }>({ website: 'infinitysupportswa.org', formId: 'SF004', reviewDate: new Date().toISOString().slice(0,10) });
  const sigWrapRef = useRef<HTMLDivElement | null>(null);
  const [sigWidth, setSigWidth] = useState<number>(560);

  useEffect(() => {
    onValidityChange?.(validate(data));
  }, [data, onValidityChange]);

  useEffect(() => {
    const update = () => {
      if (sigWrapRef.current) setSigWidth(sigWrapRef.current.clientWidth - 2);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Prefill from staff token endpoint
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/staff/onboard/${token}`);
        if (!res.ok) return;
        const json = await res.json();
        const s = json.staff || {};
        const saved = (json.submissions && json.submissions['employeeDetails']) || {};
        setData((d: any) => ({
          ...d,
          ...saved,
          firstName: saved.firstName ?? d.firstName ?? s.firstName ?? '',
          lastName: saved.lastName ?? d.lastName ?? s.surname ?? '',
          email: saved.email ?? d.email ?? s.email ?? '',
          mobile: saved.mobile ?? d.mobile ?? s.phone ?? '',
          officeEmployee: saved.officeEmployee ?? d.officeEmployee ?? `${s.firstName || ''} ${s.surname || ''}`.trim(),
          // Handle signature data from new fields
          employeeSignature: saved.employeeSignature || '',
          employeeSignatureDate: saved.employeeSignatureDate || '',
        }));
      } catch (e) {
        // ignore prefill errors
      }
    })();
  }, [token]);

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
          formId: getSettingValue('employee_details_form_id') || 'SF004',
          reviewDate: getSettingValue('review_date') || new Date().toISOString().slice(0,10),
        });
      } catch {}
    })();
  }, []);

  const validate = (d: any) => {
    // Basic required checks based on schema
    const required = new Set<string>();
    schema.sections.forEach((s: any)=>s.fields?.forEach((f: any)=>{ if (f.required) required.add(f.key); }));
    for (const k of required) { if (!d[k]) return false; }
    // Email
    if (d.email && !/^\S+@\S+\.\S+$/.test(d.email)) return false;
    // AU mobile: 10 digits
    if (d.mobile && !/^\d{10}$/.test(d.mobile)) return false;
    // Postcode 4 digits
    if (d.postcode && !/^\d{4}$/.test(d.postcode)) return false;
    // BSB 6 digits
    if (d.bsb && !/^\d{6}$/.test(d.bsb)) return false;
    // Account number 6-10 digits
    if (d.accountNumber && !/^\d{6,10}$/.test(d.accountNumber)) return false;
    // Require signature and date on page 2
    if (!d.employeeSignature || typeof d.employeeSignature !== 'string' || !d.employeeSignature.startsWith('data:image/')) return false;
    if (!d.employeeSignatureDate) return false;
    return true;
  };

  const validateDetailed = () => {
    const missing: string[] = [];
    const invalid: string[] = [];

    // Check required fields
    const required = new Set<string>();
    schema.sections.forEach((s: any) => s.fields?.forEach((f: any) => { 
      if (f.required) required.add(f.key); 
    }));

    for (const fieldKey of required) {
      if (!data[fieldKey]) {
        missing.push(fieldKey);
      }
    }

    // Check format validation
    if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) {
      invalid.push('Email (invalid format)');
    }

    if (data.mobile && !/^\d{10}$/.test(data.mobile)) {
      invalid.push('Mobile (must be exactly 10 digits)');
    }

    if (data.postcode && !/^\d{4}$/.test(data.postcode)) {
      invalid.push('Postcode (must be exactly 4 digits)');
    }

    if (data.bsb && !/^\d{6}$/.test(data.bsb)) {
      invalid.push('BSB (must be exactly 6 digits)');
    }

    if (data.accountNumber && !/^\d{6,10}$/.test(data.accountNumber)) {
      invalid.push('Account Number (must be 6-10 digits)');
    }

    if (data.visaExpiryDate && data.hasWorkingVisa === true && isNaN(Date.parse(data.visaExpiryDate))) {
      invalid.push('Visa Expiry Date (invalid format)');
    }

    // Check signature and date
    if (!data.employeeSignature || typeof data.employeeSignature !== 'string' || !data.employeeSignature.startsWith('data:image/')) {
      missing.push('Employee Signature');
    }

    if (!data.employeeSignatureDate) {
      missing.push('Employee Signature Date');
    }

    return {
      isValid: missing.length === 0 && invalid.length === 0,
      missing: missing.length > 0 ? missing : undefined,
      invalid: invalid.length > 0 ? invalid : undefined
    };
  };

  const save = async (submit: boolean = true) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/staff/onboard/${token}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ formKey: 'employeeDetails', data, submit }) });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Failed');
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({ save, validate: () => validate(data), validateDetailed: () => validateDetailed(), getData: () => data }), [data]);

  const set = (k: string, v: any) => setData((d: any)=>({ ...d, [k]: v }));

  return (<>
    <div className="bg-white w-full max-w-[794px] mx-auto min-h-[1123px] border shadow relative px-[96px] pt-12 pb-[112px] a4-ack">
      <div className="flex justify-center mb-4">
        <img src="/client_full_logo.jpg" alt="Logo" className="h-14" />
      </div>
      <h2 className="text-center font-semibold mb-6">Employee Details Form</h2>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <Field label="First Name" value={data.firstName} onChange={(v)=>set('firstName', v)} readOnly />
        <Field label="Last Name" value={data.lastName} onChange={(v)=>set('lastName', v)} readOnly />
        <Field label="Start Date" type="date" value={data.startDate} onChange={(v)=>set('startDate', v)} />
        <Field label="Position Title" value={data.positionTitle} onChange={(v)=>set('positionTitle', v)} />

        <div className="col-span-2 flex items-center gap-6">
          <div className="flex items-center gap-2 w-1/2">
            <label className="text-xs w-24">Gender</label>
            <select className="flex-1 border-b border-gray-400 px-1 py-1" value={data.gender || ''} onChange={(e)=>set('gender', e.target.value)} title="Gender">
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <Field label="Date of Birth" type="date" value={data.dateOfBirth} onChange={(v)=>set('dateOfBirth', v)} className="!mb-0" />
        </div>

        <Field label="Address" value={data.address} onChange={(v)=>set('address', v)} className="col-span-2" />
        <Field label="Suburb" value={data.suburb} onChange={(v)=>set('suburb', v)} />
        <Field label="State" value={data.state} onChange={(v)=>set('state', v)} />
        <Field label="Postcode" value={data.postcode} onChange={(v)=>set('postcode', v)} />
        <Field label="Home Phone" value={data.homePhone} onChange={(v)=>set('homePhone', v)} />
        <Field label="Mobile" value={data.mobile} onChange={(v)=>set('mobile', v)} readOnly />
        <Field label="Email Address" value={data.email} onChange={(v)=>set('email', v)} className="col-span-2" readOnly />

        <Field label="Employee Tax File" value={data.employeeTaxFile} onChange={(v)=>set('employeeTaxFile', v)} className="col-span-2" />

        {/* Bank Details */}
        <div className="col-span-2 border border-gray-400 rounded-sm p-4 mt-2">
          <div className="text-xs font-semibold mb-2">Bank Details</div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Bank Name" value={data.bankName} onChange={(v)=>set('bankName', v)} />
            <Field label="Branch" value={data.bankBranch} onChange={(v)=>set('bankBranch', v)} />
            <Field label="Account Name" value={data.accountName} onChange={(v)=>set('accountName', v)} className="col-span-2" />
            <NumberLineField label="BSB" value={data.bsb || ''} maxLength={6} onChange={(v)=>set('bsb', v)} />
            <NumberLineField label="Account Number" value={data.accountNumber || ''} maxLength={10} onChange={(v)=>set('accountNumber', v)} />
          </div>
        </div>

        {/* Residency & Work Rights */}
        <div className="col-span-2 mt-4">
          <div className="text-xs font-semibold mb-2">Residency & Work Rights</div>
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Are you an Australian citizen?" value={data.isAustralianCitizen} onChange={(v)=>set('isAustralianCitizen', v)} />
            <SelectField label="Are you a permanent resident?" value={data.isPermanentResident} onChange={(v)=>set('isPermanentResident', v)} />
            <SelectField label="Do you have a Working Visa?" value={data.hasWorkingVisa} onChange={(v)=>{ set('hasWorkingVisa', v); if (v===false) set('visaExpiryDate',''); }} />
            <Field label="Visa Expiry Date" type="date" value={data.visaExpiryDate} onChange={(v)=>set('visaExpiryDate', v)} className={data.hasWorkingVisa===false? 'opacity-50 pointer-events-none' : ''} />
            <div className="col-span-2">
              <label className="block text-xs mb-1" htmlFor="fld-restrictions">Any restrictions?</label>
              <textarea id="fld-restrictions" title="Any restrictions" placeholder="Any restrictions" className="w-full border border-gray-400 rounded px-2 py-2" value={data.workRestrictions || ''} onChange={(e)=>set('workRestrictions', e.target.value)} rows={3} />
            </div>
          </div>
        </div>

        {/* Next of Kin */}
        <div className="col-span-2 mt-4">
          <div className="text-xs font-semibold mb-2">Next of Kin</div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Next of Kin" value={data.nokName} onChange={(v)=>set('nokName', v)} />
            <Field label="Relationship" value={data.nokRelationship} onChange={(v)=>set('nokRelationship', v)} />
            <Field label="Address" value={data.nokAddress} onChange={(v)=>set('nokAddress', v)} className="col-span-2" />
            <Field label="Suburb" value={data.nokSuburb} onChange={(v)=>set('nokSuburb', v)} />
            <Field label="State" value={data.nokState} onChange={(v)=>set('nokState', v)} />
            <Field label="Postcode" value={data.nokPostcode} onChange={(v)=>set('nokPostcode', v)} />
            <Field label="Home Phone" value={data.nokHomePhone} onChange={(v)=>set('nokHomePhone', v)} />
            <Field label="Mobile" value={data.nokMobile} onChange={(v)=>set('nokMobile', v)} />
            <Field label="Work" value={data.nokWorkPhone} onChange={(v)=>set('nokWorkPhone', v)} />
          </div>
        </div>
        {/* Footer */}
        <div className="absolute bottom-6 left-[96px] right-[96px] text-[10pt] text-gray-600 flex items-center justify-between">
          <div>Website: {meta.website}</div>
          <div>{meta.formId}</div>
          <div>Review Date: {meta.reviewDate}</div>
        </div>
      </div>
    </div>
    {/* Page 2: Office Use Only + Signatures */}
    <div className="bg-white w-full max-w-[794px] mx-auto min-h-[1123px] border shadow relative px-[96px] pt-12 pb-[112px] a4-ack mt-6">
      <div className="flex justify-center mb-4">
        <img src="/client_full_logo.jpg" alt="Logo" className="h-14" />
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        {/* Signatures first (top of page) */}
        <div className="col-span-2 mb-8">
          <div className="font-semibold mb-4">Signatures</div>
          <div className="space-y-6">
            <div>
              <div className="text-xs font-semibold mb-3">Employee Signature:</div>
              <SignatureCanvas 
                existingSignature={data.employeeSignature}
                onSignatureEnd={(sig)=>set('employeeSignature', sig)} 
                onSignatureClear={()=>set('employeeSignature','')} 
                width={sigWidth} 
                height={160} 
                className="bg-white w-full" 
              />
            </div>
            <div>
              <Field label="Date" type="date" value={data.employeeSignatureDate} onChange={(v)=>set('employeeSignatureDate', v)} />
            </div>
          </div>
        </div>

        {/* Office Use Only box */}
        <div className="col-span-2 mt-4">
          <div className="font-semibold">Office Use Only</div>
          <div className="border border-gray-400 p-4 mt-2 rounded-sm">
            <div className="text-xs font-semibold mb-3">Employee:</div>
            <div className="grid grid-cols-2 gap-6">
              {/* Status styled as checkboxes to match PDF visuals (exclusive selection logic) */}
              <div>
                <div className="text-xs mb-1">Status:</div>
                <div className="flex flex-col gap-2 pl-1">
                  <label className="inline-flex items-center gap-2"><input type="checkbox" checked={data.employmentStatus==='FullTime'} onChange={()=>set('employmentStatus','FullTime')} /> Full time</label>
                  <label className="inline-flex items-center gap-2"><input type="checkbox" checked={data.employmentStatus==='PartTime'} onChange={()=>set('employmentStatus','PartTime')} /> Part time</label>
                  <label className="inline-flex items-center gap-2"><input type="checkbox" checked={data.employmentStatus==='Casual'} onChange={()=>set('employmentStatus','Casual')} /> Casual</label>
                </div>
              </div>

              <Field label="SCHADS Level" value={data.schadsScore} onChange={(v)=>set('schadsScore', v)} />
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="absolute bottom-6 left-[96px] right-[96px] text-[10pt] text-gray-600 flex items-center justify-between">
        <div>Website: {meta.website}</div>
        <div>{meta.formId}</div>
        <div>Review Date: {meta.reviewDate}</div>
      </div>
    </div>
  </>);
});

function Field({ label, value, onChange, type='text', className='', readOnly=false }: { label: string; value: any; onChange: (v:any)=>void; type?: string; className?: string; readOnly?: boolean }) {
  return (
    <div className={`mb-3 ${className}`}>
      <label className="block text-xs mb-1" htmlFor={`fld-${label}`}>{label}</label>
      <input id={`fld-${label}`} title={label} placeholder={label} className={`w-full border-b px-1 py-1 ${readOnly? 'bg-gray-50 border-gray-300 text-gray-700' : 'border-gray-400'}`} value={value || ''} onChange={(e)=>onChange(e.target.value)} type={type} readOnly={readOnly} />
    </div>
  );
}

function BoxInput({ label, length, value, onChange, groups }: { label: string; length: number; value: string; onChange: (v: string)=>void; groups?: number[] }) {
  const cells = Array.from({ length }).map((_, i) => value?.[i] || '');
  return (
    <div className="mb-3">
      <div className="text-xs font-semibold mb-1">{label}</div>
      <div className="flex flex-wrap gap-1 items-center">
        {cells.map((ch, i) => (
          <input key={i} title={`${label} ${i+1}`} value={ch} maxLength={1} onChange={(e)=>{
            const arr = value.split('').slice(0, length);
            arr[i] = e.target.value.replace(/[^0-9A-Za-z]/g,'');
            const next = (arr.join('') + ' '.repeat(length)).slice(0,length).replace(/\s+$/,'');
            onChange(next);
          }} className="w-8 h-8 border border-gray-400 text-center placeholder-gray-400" placeholder="•" />
        ))}
        {groups && groups.reduce((acc: React.ReactElement[], size, idx) => {
          const upto = groups.slice(0, idx+1).reduce((s, n) => s + n, 0);
          if (upto < length) acc.push(<div key={`sp-${idx}`} className="w-3" />);
          return acc;
        }, [])}
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange }: { label: string; value: any; onChange: (v: boolean|null)=>void }) {
  return (
    <div>
      <label className="block text-xs mb-1">{label}</label>
      <select title={label} className="w-full border-b border-gray-400 px-1 py-1" value={value===true?'Yes':value===false?'No':''} onChange={(e)=>{
        const v = e.target.value;
        onChange(v==='Yes'?true:v==='No'?false:null);
      }}>
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
  );
}

function NumberLineField({ label, value, onChange, maxLength=10 }: { label: string; value: string; onChange: (v: string)=>void; maxLength?: number }) {
  return (
    <div className="mb-3">
      <label className="block text-xs mb-1" htmlFor={`num-${label}`}>{label}</label>
      <input id={`num-${label}`} title={label} placeholder={label} inputMode="numeric" pattern="[0-9]*" maxLength={maxLength} className="w-full border-b border-gray-400 px-1 py-1" value={value} onChange={(e)=>{
        const v = e.target.value.replace(/[^0-9]/g,'');
        onChange(v);
      }} />
    </div>
  );
}


