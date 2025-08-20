"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EmployeeWelcomeFormPage38() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<any>({ readAcknowledgement: false, fullName: '', signature: '', date: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

  const handleSubmit = async (submit: boolean) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/staff/onboard/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formKey: 'employee_welcome', data, submit }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Failed to save');
      alert(submit ? 'Submitted' : 'Saved');
    } catch (e: any) {
      alert(e.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Employee Welcome - Acknowledgement (Page 38)</h1>
        <div className="space-y-4 border rounded-xl p-6">
          <label className="flex items-start gap-3">
            <input type="checkbox" checked={!!data.readAcknowledgement} onChange={(e)=>handleChange('readAcknowledgement', e.target.checked)} />
            <span>I confirm that I have carefully read and understood pages 1–37 of the Employee Welcome Pack.</span>
          </label>

          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="fullName">Full Name</label>
            <input id="fullName" title="Full Name" placeholder="Full Name" className="w-full border rounded-lg px-3 py-2" value={data.fullName} onChange={(e)=>handleChange('fullName', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="signature">Signature (type name for now)</label>
            <input id="signature" title="Signature" placeholder="Signature" className="w-full border rounded-lg px-3 py-2" value={data.signature} onChange={(e)=>handleChange('signature', e.target.value)} />
          </div>
            <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="ackDate">Date</label>
            <input id="ackDate" title="Date" placeholder="YYYY-MM-DD" type="date" className="w-full border rounded-lg px-3 py-2" value={data.date} onChange={(e)=>handleChange('date', e.target.value)} />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button className="px-6 py-3 border rounded-lg" disabled={loading} onClick={()=>handleSubmit(false)}>Save</button>
            <button className="px-6 py-3 bg-rose-600 text-white rounded-lg" disabled={loading || !data.readAcknowledgement} onClick={()=>handleSubmit(true)}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
}


