"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import SignatureCanvas from '@/components/ui/SignatureCanvas';
import { fetchFormSpecificSettings } from '@/lib/settings';

export interface PositionDescriptionFormRef { 
  save: (submit?: boolean) => Promise<boolean>; 
  validate: () => boolean; 
  validateDetailed: () => { isValid: boolean; missing: string[]; invalid: string[] }; 
  getData: () => any 
}

export default forwardRef<PositionDescriptionFormRef, { token: string; onValidityChange?: (v: boolean)=>void }>(function PositionDescriptionForm({ token, onValidityChange }, ref) {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState<{ website: string; formId: string; reviewDate: string }>({ 
    website: 'infinitysupportswa.org', 
    formId: 'PD-Support Worker Form', 
    reviewDate: '01/03/2025' 
  });
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

  // Prefill from staff token endpoint (skip for demo tokens)
  useEffect(() => {
    if (token.startsWith('demo-')) {
      // For demo tokens, set some sample data
      setData({
        employeeName: 'Demo Employee',
        businessUnit: 'Sample Business Unit',
        reportsTo: 'Sample Manager'
      });
      return;
    }
    
    (async () => {
      try {
        const res = await fetch(`/api/staff/onboard/${token}`);
        if (!res.ok) return;
        const json = await res.json();
        const s = json.staff || {};
        const saved = (json.submissions && json.submissions['positionDescription']) || {};
        setData((d: any) => ({
          ...d,
          ...saved,
          employeeName: saved.employeeName ?? d.employeeName ?? `${s.firstName || ''} ${s.surname || ''}`.trim(),
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
          formId: getSettingValue('position_description_form_id') || 'PD-Support Worker Form',
          reviewDate: getSettingValue('review_date') || '01/03/2025',
        });
      } catch {}
    })();
  }, []);

  const validate = (d: any) => {
    // Basic required checks
    const required = ['employeeName', 'employeeSignature', 'employeeSignatureDate'];
    
    for (const k of required) { 
      if (!d[k]) return false; 
    }
    
    // Signature validation
    if (!d.employeeSignature || typeof d.employeeSignature !== 'string' || !d.employeeSignature.startsWith('data:image/')) return false;
    
    return true;
  };

  const validateDetailed = () => {
    const missing: string[] = [];
    const invalid: string[] = [];
    
    const requiredFields = [
      { key: 'employeeName', label: 'Employee Name' },
      { key: 'employeeSignature', label: 'Employee Signature' },
      { key: 'employeeSignatureDate', label: 'Employee Signature Date' },
    ];
    
    for (const field of requiredFields) {
      if (!data[field.key]) {
        missing.push(field.label);
      }
    }
    
    // Signature validation
    if (data.employeeSignature && typeof data.employeeSignature !== 'string' || !data.employeeSignature?.startsWith('data:image/')) {
      invalid.push('Employee Signature');
    }
    
    return {
      isValid: missing.length === 0 && invalid.length === 0,
      missing,
      invalid
    };
  };

  const save = async (submit = false) => {
    // For demo tokens, just simulate success
    if (token.startsWith('demo-')) {
      return true;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`/api/staff/onboard/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: 'positionDescription',
          data,
          submit
        })
      });
      
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to save');
      }
      
      return true;
    } catch (e: any) {
      console.error('Save error:', e);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getData = () => data;

  useImperativeHandle(ref, () => ({
    save,
    validate: () => validate(data),
    validateDetailed,
    getData
  }));

  return (
    <div className=" p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Logo and Company Name */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">∞</span>
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-azure-700">Infinity Supports WA</h1>
              <p className="text-sm text-azure-400 uppercase tracking-wider">Achieving Goals and Beyond</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-azure-700">Position Description</h2>
        </div>

        {/* Position Description Section */}
        <div className="mb-8">
          <div className="bg-azure-700 text-white px-4 sm:px-6 py-3 rounded-t-lg">
            <h3 className="text-lg sm:text-xl font-semibold">Position Description</h3>
          </div>
          <div className="border border-azure-300 rounded-b-lg p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-azure-600 mb-2">Position Title:</label>
                <input
                  type="text"
                  value="Support Worker"
                  readOnly
                  className="w-full px-3 py-2 border border-azure-300 rounded-md bg-azure-50"
                  aria-label="Position Title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-azure-600 mb-2">Business Unit:</label>
                <input
                  type="text"
                  value={data.businessUnit || ''}
                  onChange={(e) => setData({...data, businessUnit: e.target.value})}
                  className="w-full px-3 py-2 border border-azure-300 rounded-md"
                  placeholder="Enter business unit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-azure-600 mb-2">Reports To:</label>
                <input
                  type="text"
                  value={data.reportsTo || ''}
                  onChange={(e) => setData({...data, reportsTo: e.target.value})}
                  className="w-full px-3 py-2 border border-azure-300 rounded-md"
                  placeholder="Enter supervisor name"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Purpose Section */}
        <div className="mb-8">
          <div className="bg-azure-700 text-white px-4 sm:px-6 py-3 rounded-t-lg">
            <h3 className="text-lg sm:text-xl font-semibold">Purpose</h3>
          </div>
          <div className="border border-azure-300 rounded-b-lg p-6">
            <textarea
              value="The purpose of a Support Worker is to support clients to live their lives more independently and help them to reach their potential by providing both physical and emotional support."
              readOnly
              rows={3}
              className="w-full px-3 py-2 border border-azure-300 rounded-md bg-azure-50 resize-none"
              aria-label="Purpose of Support Worker role"
            />
          </div>
        </div>

        {/* Responsibilities and Accountabilities - for the Workplace */}
        <div className="mb-8">
          <div className="bg-azure-700 text-white px-4 sm:px-6 py-3 rounded-t-lg">
            <h3 className="text-lg sm:text-xl font-semibold">Responsibilities and Accountabilities – for the Workplace</h3>
          </div>
          <div className="border border-azure-300 rounded-b-lg p-6">
            <ul className="space-y-2 text-azure-600">
              <li className="flex items-start">
                <span className="text-azure-600 mr-2">•</span>
                Follow company policies including Code of Conduct, Anti-Discrimination, Harassment/Victimisation policies.
              </li>
              <li className="flex items-start">
                <span className="text-azure-600 mr-2">•</span>
                Adhere to Workplace Health and Safety.
              </li>
              <li className="flex items-start">
                <span className="text-azure-600 mr-2">•</span>
                Ensure all Company Standard Operating Procedures are adhered too.
              </li>
              <li className="flex items-start">
                <span className="text-azure-600 mr-2">•</span>
                Display a positive attitude and be an active, dependable member of the team.
              </li>
              <li className="flex items-start">
                <span className="text-azure-600 mr-2">•</span>
                Lead by example in everything you do.
              </li>
              <li className="flex items-start">
                <span className="text-azure-600 mr-2">•</span>
                Support and treat others with respect.
              </li>
              <li className="flex items-start">
                <span className="text-azure-600 mr-2">•</span>
                Always provide constructive feedback in a way that does not blame.
              </li>
              <li className="flex items-start">
                <span className="text-azure-600 mr-2">•</span>
                Be accountable for your actions and results.
              </li>
              <li className="flex items-start">
                <span className="text-azure-600 mr-2">•</span>
                Be consistent and speak the truth.
              </li>
            </ul>
          </div>
        </div>

        {/* Responsibilities and Accountabilities - for the Position */}
        <div className="mb-8">
          <div className="bg-azure-700 text-white px-4 sm:px-6 py-3 rounded-t-lg">
            <h3 className="text-lg sm:text-xl font-semibold">Responsibilities and Accountabilities – for the Position</h3>
          </div>
          <div className="border border-azure-300 rounded-b-lg p-6">
            <div className="space-y-4 text-azure-600">
              <p>
                The specific duties that you will undertake as a Support Worker will be set and agreed by the person you support or their family. Please refer to the "Support Plan" section of each person's profile for an overview of the duties required by each person you support.
              </p>
              <p>
                You are invited to reach out to people seeking support where the job description, as detailed in the "Support Plan" section, appeals to you.
              </p>
              <p>
                Further verbal and/or written instructions will be provided by the person seeking support or their family at the time of meeting. It is the responsibility of the person seeking support or their family to explain to you exactly what tasks need to be performed daily.
              </p>
              <p>
                As a rule, Infinity Supports WA requires Support Workers to perform all tasks within the following guidelines:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="text-azure-600 mr-2">•</span>
                  Perform all duties with professionalism and care.
                </li>
                <li className="flex items-start">
                  <span className="text-azure-600 mr-2">•</span>
                  You must only work with one individual at a time unless agreed with your Line Manager and you are working in a 'Group Setting'.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Employee Acknowledgement Section */}
        <div className="mb-8">
          <div className="bg-azure-700 text-white px-4 sm:px-6 py-3 rounded-t-lg">
            <h3 className="text-lg sm:text-xl font-semibold">Employee Acknowledgement</h3>
          </div>
          <div className="border border-azure-300 rounded-b-lg p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-azure-600 mb-2">Employee Name:</label>
                <input
                  type="text"
                  value={data.employeeName || ''}
                  onChange={(e) => setData({...data, employeeName: e.target.value})}
                  className="w-full px-3 py-2 border border-azure-300 rounded-md"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-azure-600 mb-2">Date:</label>
                <input
                  type="date"
                  value={data.employeeSignatureDate || ''}
                  onChange={(e) => setData({...data, employeeSignatureDate: e.target.value})}
                  className="w-full px-3 py-2 border border-azure-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-azure-600 mb-2">Employee Signature:</label>
                                 <div ref={sigWrapRef} className="border border-azure-300 rounded-md">
                   <SignatureCanvas
                     width={sigWidth}
                     height={120}
                     onSignatureEnd={(signature) => setData({...data, employeeSignature: signature})}
                     existingSignature={data.employeeSignature}
                     aria-label="Employee signature canvas"
                   />
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-azure-300">
          <div className="flex justify-between items-center text-sm text-azure-400">
            <span>Website: {meta.website}</span>
            <span>{meta.formId}</span>
            <span>Review Date: {meta.reviewDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
});
