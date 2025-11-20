"use client";

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { employeeDetailsSchema as employeeSchema } from './schema';

type Field = any;

const employeeDetailsSchema = /** form schema provided by user **/ {
  schemaVersion: 1,
  formKey: 'employeeDetails',
  title: 'Employee Details Form',
  layout: { columns: 2 },
  sections: [] as any[],
} as any;

employeeDetailsSchema.sections = [/* schema truncated in code for brevity at runtime – we’ll fetch it below */];

export default function OnboardClient() {
  const { token } = useParams<{ token: string }>();
  const [prefill, setPrefill] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});
  const formSchema = useMemo(()=>employeeSchema,[]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/staff/onboard/${token}`);
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to load');
        const json = await res.json();
        setPrefill(json.staff);
        setData((d: any) => ({ ...d, firstName: json.staff.firstName, lastName: json.staff.surname, email: json.staff.email, mobile: json.staff.phone }));
      } catch (e: any) {
        setError(e.message || 'Failed');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const handleChange = (key: string, value: any) => setData((d: any)=>({ ...d, [key]: value }));

  const handleSubmit = async (submit: boolean) => {
    const res = await fetch(`/api/staff/onboard/${token}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ formKey: 'employeeDetails', data, submit }) });
    if (!res.ok) {
      const j = await res.json().catch(()=>({}));
      alert(j.error || 'Failed to save');
      return;
    }
    if (submit) alert('Submitted successfully'); else alert('Saved');
  };

  if (loading) return <LoadingView title="Loading Staff Forms" message="Please wait..." />;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Employee Details Form</h1>
        <p className="text-gray-600 mb-6">Please complete your employment details below.</p>

        {formSchema.sections.map((section: any) => (
          <div key={section.id} className="mb-6">
            <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
            <div className={`grid grid-cols-1 md:grid-cols-${section.columns || 2} gap-4`}>
              {section.fields.map((f: Field) => (
                <FieldRenderer key={f.key} field={f} value={data[f.key]} onChange={handleChange} />
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end gap-3">
          <button className="px-6 py-3 border rounded-lg" onClick={() => handleSubmit(false)}>Save</button>
          <button className="px-6 py-3 bg-rose-600 text-white rounded-lg" onClick={() => handleSubmit(true)}>Submit</button>
        </div>
      </div>
    </div>
  );
}

function FieldRenderer({ field, value, onChange }: { field: any; value: any; onChange: (k: string, v: any)=>void }) {
  const common = { className: 'w-full border rounded-lg px-3 py-2', value: value || '', onChange: (e: any)=>onChange(field.key, e.target.value) } as any;
  if (field.type === 'textarea') return <div className={`md:col-span-${field.columns===2?2:1}`}><label className="block text-sm font-semibold mb-1">{field.label}</label><textarea {...common} rows={4} /></div>;
  if (field.type === 'date') return <div><label className="block text-sm font-semibold mb-1">{field.label}</label><input type="date" {...common} /></div>;
  if (field.type === 'radio') return (
    <div>
      <label className="block text-sm font-semibold mb-1">{field.label}</label>
      <div className="flex items-center gap-4">
        {field.options?.map((opt: any)=>(
          <label key={opt.value} className="flex items-center gap-2"><input type="radio" checked={value===opt.value} onChange={()=>onChange(field.key,opt.value)} />{opt.label}</label>
        ))}
      </div>
    </div>
  );
  if (field.type === 'boolean') return (
    <div>
      <label className="block text-sm font-semibold mb-1" htmlFor={`fld-${field.key}`}>{field.label}</label>
      <input id={`fld-${field.key}`} type="checkbox" checked={!!value} onChange={(e)=>onChange(field.key, e.target.checked)} title={field.label} />
    </div>
  );
  if (field.type === 'select') return (
    <div>
      <label className="block text-sm font-semibold mb-1" htmlFor={`fld-${field.key}`}>{field.label}</label>
      <select id={`fld-${field.key}`} className="w-full border rounded-lg px-3 py-2" value={value || ''} onChange={(e)=>onChange(field.key,e.target.value)} title={field.label}>
        <option value="">Select…</option>
        {field.options?.map((o: any)=>(<option key={o.value} value={o.value}>{o.label}</option>))}
      </select>
    </div>
  );
  if (field.type === 'signature') return (
    <div className={`md:col-span-${field.columns===2?2:1}`}>
      <label className="block text-sm font-semibold mb-1" htmlFor={`fld-${field.key}`}>{field.label}</label>
      <input id={`fld-${field.key}`} type="text" placeholder="Sign here (placeholder)" className="w-full border rounded-lg px-3 py-2" value={value || ''} onChange={(e)=>onChange(field.key,e.target.value)} title={field.label} />
    </div>
  );
  return (
    <div>
      <label className="block text-sm font-semibold mb-1" htmlFor={`fld-${field.key}`}>{field.label}</label>
      <input id={`fld-${field.key}`} type={field.type==='number'?'number':'text'} className="w-full border rounded-lg px-3 py-2" value={value || ''} onChange={(e)=>onChange(field.key,e.target.value)} placeholder={field.label} title={field.label} />
    </div>
  );
}

// schema imported from schema.ts


