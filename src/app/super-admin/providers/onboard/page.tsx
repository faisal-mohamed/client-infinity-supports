'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaBuilding, FaArrowLeft, FaArrowRight, FaCheck, FaSpinner } from 'react-icons/fa';

const STEPS = ['Business Details', 'Contact & Address', 'NDIS Registration', 'Review'];

const STATES = ['WA', 'NSW', 'VIC', 'QLD', 'SA', 'TAS', 'NT', 'ACT'];

export default function OnboardProviderPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    tradingName: '',
    abn: '',
    primaryContactName: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    address: { street: '', suburb: '', state: 'WA', postcode: '' },
    registrationType: 'unregistered' as 'registered' | 'unregistered',
    ndisRegistrationNumber: '',
    registrationGroups: [] as string[],
    insuranceExpiry: '',
    workerCompExpiry: '',
    ndisRegistrationExpiry: '',
    notes: '',
  });

  function update(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateAddress(field: string, value: string) {
    setForm((prev) => ({ ...prev, address: { ...prev.address, [field]: value } }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError('');

    const res = await fetch('/api/super-admin/providers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Failed to create provider');
      setLoading(false);
      return;
    }

    const org = await res.json();
    router.push(`/super-admin/providers/${org.id}`);
  }

  function canProceed(): boolean {
    switch (step) {
      case 0: return !!(form.name && form.abn);
      case 1: return !!(form.primaryContactName && form.primaryContactEmail && form.primaryContactPhone && form.address.street && form.address.suburb && form.address.postcode);
      case 2: return true; // Optional step
      default: return true;
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-azure-100 text-azure-400">
          <FaArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-azure-700">Onboard Provider</h1>
          <p className="text-sm text-azure-400">Register a new NDIS provider organization</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center flex-1">
            <div className={`flex items-center gap-2 ${i <= step ? 'text-azure-700' : 'text-azure-300'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                i < step ? 'bg-azure-700 text-white' : i === step ? 'bg-gold-500 text-azure-700' : 'bg-azure-100 text-azure-300'
              }`}>
                {i < step ? <FaCheck className="w-3 h-3" /> : i + 1}
              </div>
              <span className="text-xs font-medium hidden sm:inline">{label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-azure-700' : 'bg-azure-100'}`} />}
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">{error}</div>
      )}

      {/* Step Content */}
      <div className="card">
        <div className="card-body">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-azure-700 mb-4">Business Details</h2>
              <div className="form-field">
                <label>Business Name *</label>
                <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g., Infinity Support Services Pty Ltd" />
              </div>
              <div className="form-field">
                <label>Trading Name</label>
                <input type="text" value={form.tradingName} onChange={(e) => update('tradingName', e.target.value)} placeholder="e.g., Infinity Supports" />
              </div>
              <div className="form-field">
                <label>ABN (Australian Business Number) *</label>
                <input type="text" value={form.abn} onChange={(e) => update('abn', e.target.value)} placeholder="11 digits" maxLength={14} />
                <p className="text-xs text-azure-400 mt-1">11-digit ABN without spaces</p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-azure-700 mb-4">Contact & Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-field">
                  <label>Primary Contact Name *</label>
                  <input type="text" value={form.primaryContactName} onChange={(e) => update('primaryContactName', e.target.value)} />
                </div>
                <div className="form-field">
                  <label>Phone *</label>
                  <input type="tel" value={form.primaryContactPhone} onChange={(e) => update('primaryContactPhone', e.target.value)} placeholder="0412 345 678" />
                </div>
              </div>
              <div className="form-field">
                <label>Email *</label>
                <input type="email" value={form.primaryContactEmail} onChange={(e) => update('primaryContactEmail', e.target.value)} />
              </div>
              <hr className="border-azure-50 my-4" />
              <div className="form-field">
                <label>Street Address *</label>
                <input type="text" value={form.address.street} onChange={(e) => updateAddress('street', e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="form-field">
                  <label>Suburb *</label>
                  <input type="text" value={form.address.suburb} onChange={(e) => updateAddress('suburb', e.target.value)} />
                </div>
                <div className="form-field">
                  <label>State *</label>
                  <select value={form.address.state} onChange={(e) => updateAddress('state', e.target.value)} className="filter-dropdown w-full">
                    {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label>Postcode *</label>
                  <input type="text" value={form.address.postcode} onChange={(e) => updateAddress('postcode', e.target.value)} maxLength={4} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-azure-700 mb-4">NDIS Registration</h2>
              <div className="form-field">
                <label>Registration Type</label>
                <select value={form.registrationType} onChange={(e) => update('registrationType', e.target.value)} className="filter-dropdown w-full">
                  <option value="unregistered">Unregistered Provider</option>
                  <option value="registered">Registered Provider</option>
                </select>
              </div>
              {form.registrationType === 'registered' && (
                <>
                  <div className="form-field">
                    <label>NDIS Registration Number</label>
                    <input type="text" value={form.ndisRegistrationNumber} onChange={(e) => update('ndisRegistrationNumber', e.target.value)} />
                  </div>
                  <div className="form-field">
                    <label>Registration Expiry</label>
                    <input type="date" value={form.ndisRegistrationExpiry} onChange={(e) => update('ndisRegistrationExpiry', e.target.value)} />
                  </div>
                </>
              )}
              <hr className="border-azure-50 my-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-field">
                  <label>Public Liability Insurance Expiry</label>
                  <input type="date" value={form.insuranceExpiry} onChange={(e) => update('insuranceExpiry', e.target.value)} />
                </div>
                <div className="form-field">
                  <label>Workers Compensation Expiry</label>
                  <input type="date" value={form.workerCompExpiry} onChange={(e) => update('workerCompExpiry', e.target.value)} />
                </div>
              </div>
              <div className="form-field">
                <label>Notes</label>
                <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={3} placeholder="Any additional notes about this provider..." />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-azure-700 mb-4">Review & Submit</h2>
              <div className="bg-azure-50/50 rounded-xl p-4 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-azure-400">Business Name</span><span className="font-medium text-azure-700">{form.name}</span></div>
                {form.tradingName && <div className="flex justify-between"><span className="text-azure-400">Trading Name</span><span className="font-medium text-azure-700">{form.tradingName}</span></div>}
                <div className="flex justify-between"><span className="text-azure-400">ABN</span><span className="font-mono text-azure-700">{form.abn}</span></div>
                <hr className="border-azure-100" />
                <div className="flex justify-between"><span className="text-azure-400">Contact</span><span className="font-medium text-azure-700">{form.primaryContactName}</span></div>
                <div className="flex justify-between"><span className="text-azure-400">Email</span><span className="text-azure-700">{form.primaryContactEmail}</span></div>
                <div className="flex justify-between"><span className="text-azure-400">Phone</span><span className="text-azure-700">{form.primaryContactPhone}</span></div>
                <div className="flex justify-between"><span className="text-azure-400">Address</span><span className="text-azure-700 text-right">{form.address.street}, {form.address.suburb} {form.address.state} {form.address.postcode}</span></div>
                <hr className="border-azure-100" />
                <div className="flex justify-between"><span className="text-azure-400">Registration</span><span className="capitalize text-azure-700">{form.registrationType}</span></div>
                {form.ndisRegistrationNumber && <div className="flex justify-between"><span className="text-azure-400">NDIS Number</span><span className="text-azure-700">{form.ndisRegistrationNumber}</span></div>}
              </div>
              <p className="text-xs text-azure-400">Provider will be created with <span className="badge badge-yellow">Pending</span> status. You can approve them after verification.</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="card-footer flex justify-between">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="btn btn-secondary"
          >
            <FaArrowLeft className="w-3.5 h-3.5 mr-2" />
            Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="btn btn-primary"
            >
              Next
              <FaArrowRight className="w-3.5 h-3.5 ml-2" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="btn btn-gold">
              {loading ? <FaSpinner className="w-4 h-4 animate-spin mr-2" /> : <FaCheck className="w-3.5 h-3.5 mr-2" />}
              {loading ? 'Creating...' : 'Create Provider'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
