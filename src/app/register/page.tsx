'use client';

import { useState } from 'react';
import { FaBuilding, FaUserTie, FaUser, FaArrowLeft, FaArrowRight, FaCheck, FaSpinner } from 'react-icons/fa';
import Image from 'next/image';
import FileUpload from '@/components/ui/FileUpload';
import Link from 'next/link';

const STEPS = ['Account Type', 'Details', 'Compliance', 'Review'];
const STATES = ['WA', 'NSW', 'VIC', 'QLD', 'SA', 'TAS', 'NT', 'ACT'];

const ACCOUNT_TYPES = [
  { value: 'registered_provider', label: 'Registered Provider', icon: FaBuilding, desc: 'NDIS registered or unregistered provider organisation' },
  { value: 'support_coordinator', label: 'Support Coordinator', icon: FaUserTie, desc: 'Level 1, 2, or 3 support coordination practitioner' },
  { value: 'independent_worker', label: 'Independent Support Worker', icon: FaUser, desc: 'Sole trader or independent disability support worker' },
] as const;

const CLASSES_OF_SUPPORT = ['Support Coordination', 'Plan Management', 'Personal Care', 'Community Participation', 'SIL', 'SDA', 'Therapy Services', 'Transport', 'Nursing', 'Respite', 'Other'];
const SERVICES_OFFERED = ['Personal Care', 'Domestic Assistance', 'Transport', 'Community Access', 'Overnight Support'];

type AccountType = 'registered_provider' | 'support_coordinator' | 'independent_worker' | '';

interface FormData {
  accountType: AccountType;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  street: string;
  suburb: string;
  state: string;
  postcode: string;
  // Provider
  organisationName: string;
  abn: string;
  providerType: string;
  companyStructure: string;
  ndisRegistrationNumber: string;
  website: string;
  yearsOfExperience: string;
  classesOfSupport: string[];
  contactPersonName: string;
  contactPersonDesignation: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
  // Coordinator
  practitionerType: string;
  areasOfExpertise: string;
  supportMode: string[];
  membershipNumber: string;
  policeCheckId: string;
  policeCheckExpiry: string;
  // Worker
  workerType: string;
  skillsCategories: string;
  servicesOffered: string[];
  availability: string[];
  ndisWorkerScreeningId: string;
  firstAidExpiry: string;
  ndisOrientationModule: boolean;
  wwccNumber: string;
  wwccExpiry: string;
  hasOwnVehicle: string;
  driverLicenseNumber: string;
  driverLicenseExpiry: string;
  travelRadius: string;
  bankBsb: string;
  bankAccountNumber: string;
  bankAccountName: string;
  // Common
  profilePhoto: string;
  // Declaration
  declaration: boolean;
}

const initialForm: FormData = {
  accountType: '', firstName: '', lastName: '', email: '', phone: '',
  password: '', confirmPassword: '', street: '', suburb: '', state: 'WA', postcode: '',
  organisationName: '', abn: '', providerType: '', companyStructure: '',
  ndisRegistrationNumber: '', website: '', yearsOfExperience: '', classesOfSupport: [],
  contactPersonName: '', contactPersonDesignation: '', contactPersonEmail: '', contactPersonPhone: '',
  practitionerType: '', areasOfExpertise: '', supportMode: [], membershipNumber: '',
  policeCheckId: '', policeCheckExpiry: '',
  workerType: '', skillsCategories: '', servicesOffered: [], availability: [],
  ndisWorkerScreeningId: '', firstAidExpiry: '', ndisOrientationModule: false,
  wwccNumber: '', wwccExpiry: '', hasOwnVehicle: '', driverLicenseNumber: '', driverLicenseExpiry: '',
  travelRadius: '', bankBsb: '', bankAccountNumber: '', bankAccountName: '',
  profilePhoto: '', declaration: false,
};

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, { key: string; filename: string }>>({});
  const [abnLookupStatus, setAbnLookupStatus] = useState<'idle' | 'loading' | 'found' | 'not_found'>('idle');
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  async function sendOtp() {
    setOtpLoading(true);
    setOtpError('');
    const res = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email }),
    });
    const data = await res.json();
    if (!res.ok) { setOtpError(data.error); setOtpLoading(false); return; }
    setOtpSent(true);
    setOtpLoading(false);
  }

  async function verifyOtp() {
    setOtpLoading(true);
    setOtpError('');
    const res = await fetch('/api/auth/verify-email', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, code: otpCode }),
    });
    const data = await res.json();
    if (!res.ok) { setOtpError(data.error); setOtpLoading(false); return; }
    setEmailVerified(true);
    setOtpLoading(false);
  }

  async function handleAbnBlur() {
    const abn = form.abn.replace(/\s/g, '');
    if (abn.length !== 11) return;

    setAbnLookupStatus('loading');
    try {
      const res = await fetch(`/api/auth/abn-lookup?abn=${abn}`);
      const data = await res.json();
      if (data.valid && data.name) {
        // Auto-fill org name if empty
        if (!form.organisationName && form.accountType === 'registered_provider') {
          update('organisationName', data.name);
        }
        setAbnLookupStatus('found');
      } else {
        setAbnLookupStatus(data.valid ? 'not_found' : 'idle');
      }
    } catch {
      setAbnLookupStatus('idle');
    }
  }

  function update(field: keyof FormData, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  }

  function toggleArray(field: keyof FormData, value: string) {
    setForm((prev) => {
      const arr = prev[field] as string[];
      return { ...prev, [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  }

  function canProceed(): boolean {
    switch (step) {
      case 0: return !!form.accountType;
      case 1: {
        const base = !!(form.firstName && form.lastName && form.email && form.phone && form.password && form.confirmPassword && form.street && form.suburb && form.postcode && emailVerified);
        if (!base) return false;
        if (form.password !== form.confirmPassword) return false;
        if (form.password.length < 15) return false;
        if (form.accountType === 'registered_provider') return !!(form.organisationName && form.abn && form.providerType && form.companyStructure);
        if (form.accountType === 'support_coordinator') return !!(form.practitionerType && form.yearsOfExperience);
        if (form.accountType === 'independent_worker') return !!(form.workerType && form.yearsOfExperience);
        return true;
      }
      case 2: return true;
      default: return form.declaration;
    }
  }

  function handleNext() {
    const errors: Record<string, string> = {};

    if (step === 0) {
      if (!form.accountType) errors.accountType = 'Please select an account type';
    }

    if (step === 1) {
      if (!form.firstName) errors.firstName = 'Required';
      if (!form.lastName) errors.lastName = 'Required';
      if (!form.email) errors.email = 'Required';
      else if (!emailVerified) errors.email = 'Email must be verified';
      if (!form.phone) errors.phone = 'Required';
      else if (!/^0\d{9}$/.test(form.phone.replace(/\s/g, ''))) errors.phone = '10 digits starting with 0';
      if (!form.password) errors.password = 'Required';
      else if (form.password.length < 15) errors.password = 'Min 15 characters';
      if (!form.confirmPassword) errors.confirmPassword = 'Required';
      else if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match';
      if (!form.street) errors.street = 'Required';
      if (!form.suburb) errors.suburb = 'Required';
      if (!form.postcode) errors.postcode = 'Required';
      else if (!/^\d{4}$/.test(form.postcode)) errors.postcode = 'Must be 4 digits';

      if (form.accountType === 'registered_provider') {
        if (!form.organisationName) errors.organisationName = 'Required';
        if (!form.abn) errors.abn = 'Required';
        else {
          const abnClean = form.abn.replace(/\s/g, '');
          if (!/^\d{11}$/.test(abnClean)) errors.abn = 'Must be exactly 11 digits';
          else {
            // ATO checksum validation
            const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
            const digits = abnClean.split('').map(Number);
            digits[0] -= 1;
            const sum = digits.reduce((acc, d, i) => acc + d * weights[i], 0);
            if (sum % 89 !== 0) errors.abn = 'Invalid ABN — please verify the number';
          }
        }
        if (!form.providerType) errors.providerType = 'Required';
        if (!form.companyStructure) errors.companyStructure = 'Required';
      }
      if (form.accountType === 'support_coordinator') {
        if (!form.practitionerType) errors.practitionerType = 'Required';
        if (!form.yearsOfExperience) errors.yearsOfExperience = 'Required';
      }
      if (form.accountType === 'independent_worker') {
        if (!form.workerType) errors.workerType = 'Required';
        if (!form.yearsOfExperience) errors.yearsOfExperience = 'Required';
        if (form.abn) {
          const abnClean = form.abn.replace(/\s/g, '');
          if (!/^\d{11}$/.test(abnClean)) errors.abn = 'Must be exactly 11 digits';
          else {
            const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
            const digits = abnClean.split('').map(Number);
            digits[0] -= 1;
            const sum = digits.reduce((acc, d, i) => acc + d * weights[i], 0);
            if (sum % 89 !== 0) errors.abn = 'Invalid ABN — please verify the number';
          }
        }
      }
    }

    if (step === 3) {
      if (!form.declaration) errors.declaration = 'You must accept the declaration';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setStep((s) => s + 1);
  }

  function fieldError(field: string) {
    return fieldErrors[field] ? <p className="text-xs text-red-500 mt-1">{fieldErrors[field]}</p> : null;
  }

  async function handleSubmit() {
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, uploadedFiles: files }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Registration failed');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-azure-50/30 px-4">
        <div className="card max-w-md w-full">
          <div className="card-body text-center py-12">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheck className="w-7 h-7 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-azure-700 mb-2">Registration Submitted!</h2>
            <p className="text-sm text-azure-400 mb-6">Your application is under review. You'll receive an email once approved.</p>
            <Link href="/admin/login" className="btn btn-primary">Go to Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-azure-50/30 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Image src="/client_logo.png" alt="Logo" width={48} height={36} className="mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-azure-700">Register Your Account</h1>
          <p className="text-sm text-azure-400 mt-1">Join the Infinity Supports Platform</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                i < step ? 'bg-azure-700 text-white' : i === step ? 'bg-gold-500 text-azure-700' : 'bg-azure-100 text-azure-300'
              }`}>
                {i < step ? <FaCheck className="w-3 h-3" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && <div className={`w-8 sm:w-16 h-0.5 mx-1 ${i < step ? 'bg-azure-700' : 'bg-azure-100'}`} />}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">{error}</div>}

        {/* Step Content */}
        <div className="card">
          <div className="card-body">
            {/* Step 0: Account Type */}
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-azure-700 mb-4">Select Account Type</h2>
                <div className="grid gap-3">
                  {ACCOUNT_TYPES.map(({ value, label, icon: Icon, desc }) => (
                    <button key={value} onClick={() => update('accountType', value)}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                        form.accountType === value ? 'border-gold-500 bg-gold-50' : 'border-azure-100 hover:border-azure-200'
                      }`}>
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${form.accountType === value ? 'bg-gold-500 text-azure-700' : 'bg-azure-50 text-azure-400'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-azure-700">{label}</p>
                        <p className="text-xs text-azure-400">{desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Details */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-azure-700 mb-4">
                  {form.accountType === 'registered_provider' ? 'Organisation & Contact Details' : 'Personal & Business Details'}
                </h2>

                {/* Provider-specific fields */}
                {form.accountType === 'registered_provider' && (
                  <>
                    <div className="form-field">
                      <label>Organisation Name *</label>
                      <input type="text" value={form.organisationName} onChange={(e) => update('organisationName', e.target.value)} />
                      {fieldError('organisationName')}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="form-field">
                        <label>ABN *</label>
                        <input type="text" value={form.abn} onChange={(e) => update('abn', e.target.value)} onBlur={handleAbnBlur} placeholder="11 digits" maxLength={14} />
                        {fieldError("abn")}
                        {abnLookupStatus === 'loading' && <p className="text-xs text-azure-400 mt-1">Looking up ABN...</p>}
                        {abnLookupStatus === 'found' && <p className="text-xs text-emerald-600 mt-1">✓ ABN verified</p>}
                      </div>
                      <div className="form-field">
                        <label>NDIS Registration Number</label>
                        <input type="text" value={form.ndisRegistrationNumber} onChange={(e) => update('ndisRegistrationNumber', e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="form-field">
                        <label>Provider Type *</label>
                        <select value={form.providerType} onChange={(e) => update('providerType', e.target.value)} className="filter-dropdown w-full">
                          <option value="">Select...</option>
                          <option value="registered">Registered NDIS Provider</option>
                          <option value="unregistered">Unregistered Provider</option>
                          <option value="in_progress">Registration In-Progress</option>
                        </select>
                        {fieldError("providerType")}
                      </div>
                      <div className="form-field">
                        <label>Company Structure *</label>
                        <select value={form.companyStructure} onChange={(e) => update('companyStructure', e.target.value)} className="filter-dropdown w-full">
                          <option value="">Select...</option>
                          <option value="pty_ltd">Pty Ltd</option>
                          <option value="sole_trader">Sole Trader</option>
                          <option value="partnership">Partnership</option>
                          <option value="trust">Trust</option>
                        </select>
                        {fieldError("companyStructure")}
                      </div>
                    </div>
                    <div className="form-field">
                      <label>Classes of Support</label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {CLASSES_OF_SUPPORT.map((cls) => (
                          <label key={cls} className="flex items-center gap-2 text-sm text-azure-600 cursor-pointer">
                            <input type="checkbox" checked={form.classesOfSupport.includes(cls)} onChange={() => toggleArray('classesOfSupport', cls)} className="rounded border-azure-200" />
                            {cls}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="form-field">
                        <label>Website</label>
                        <input type="text" value={form.website} onChange={(e) => update('website', e.target.value)} placeholder="https://" />
                      </div>
                      <div className="form-field">
                        <label>Years of Experience</label>
                        <input type="text" value={form.yearsOfExperience} onChange={(e) => update('yearsOfExperience', e.target.value)} />
                        {fieldError("yearsOfExperience")}
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-azure-700 mt-4">Contact Person</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="form-field">
                        <label>Contact Person Name</label>
                        <input type="text" value={form.contactPersonName} onChange={(e) => update('contactPersonName', e.target.value)} />
                      </div>
                      <div className="form-field">
                        <label>Designation</label>
                        <input type="text" value={form.contactPersonDesignation} onChange={(e) => update('contactPersonDesignation', e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="form-field">
                        <label>Contact Email</label>
                        <input type="email" value={form.contactPersonEmail} onChange={(e) => update('contactPersonEmail', e.target.value)} />
                      </div>
                      <div className="form-field">
                        <label>Contact Phone</label>
                        <input type="tel" value={form.contactPersonPhone} onChange={(e) => update('contactPersonPhone', e.target.value)} />
                      </div>
                    </div>
                    <hr className="border-azure-50" />
                  </>
                )}

                {/* Coordinator-specific fields */}
                {form.accountType === 'support_coordinator' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="form-field">
                        <label>Practitioner Type *</label>
                        <select value={form.practitionerType} onChange={(e) => update('practitionerType', e.target.value)} className="filter-dropdown w-full">
                          <option value="">Select...</option>
                          <option value="level_1">Level 1: Support Connection</option>
                          <option value="level_2">Level 2: Coordination of Supports</option>
                          <option value="level_3">Level 3: Specialist Support Coordination</option>
                        </select>
                        {fieldError("practitionerType")}
                      </div>
                      <div className="form-field">
                        <label>Years of Experience *</label>
                        <input type="text" value={form.yearsOfExperience} onChange={(e) => update('yearsOfExperience', e.target.value)} />
                        {fieldError("yearsOfExperience")}
                      </div>
                    </div>
                    <div className="form-field">
                      <label>Available Support Mode</label>
                      <div className="flex gap-4 mt-1">
                        {['In-person', 'Telehealth', 'Remote'].map((mode) => (
                          <label key={mode} className="flex items-center gap-2 text-sm text-azure-600 cursor-pointer">
                            <input type="checkbox" checked={form.supportMode.includes(mode)} onChange={() => toggleArray('supportMode', mode)} className="rounded border-azure-200" />
                            {mode}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="form-field">
                      <label>Areas of Expertise</label>
                      <input type="text" value={form.areasOfExpertise} onChange={(e) => update('areasOfExpertise', e.target.value)} placeholder="e.g., Mental health, Complex needs, CALD communities" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="form-field">
                        <label>Membership / Accreditation Number</label>
                        <input type="text" value={form.membershipNumber} onChange={(e) => update('membershipNumber', e.target.value)} />
                      </div>
                      <div className="form-field">
                        <label>ABN (if applicable)</label>
                        <input type="text" value={form.abn} onChange={(e) => update('abn', e.target.value)} placeholder="11 digits" maxLength={14} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="form-field">
                        <label>Police Check / NDIS Worker Screening ID</label>
                        <input type="text" value={form.policeCheckId} onChange={(e) => update('policeCheckId', e.target.value)} />
                      </div>
                      <div className="form-field">
                        <label>Expiry Date</label>
                        <input type="date" value={form.policeCheckExpiry} onChange={(e) => update('policeCheckExpiry', e.target.value)} />
                      </div>
                    </div>
                    <hr className="border-azure-50" />
                  </>
                )}

                {/* Worker-specific fields */}
                {form.accountType === 'independent_worker' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="form-field">
                        <label>Worker Type *</label>
                        <select value={form.workerType} onChange={(e) => update('workerType', e.target.value)} className="filter-dropdown w-full">
                          <option value="">Select...</option>
                          <option value="sole_trader">Sole Trader</option>
                          <option value="independent">Independent Worker</option>
                        </select>
                        {fieldError("workerType")}
                      </div>
                      <div className="form-field">
                        <label>Years of Experience *</label>
                        <input type="text" value={form.yearsOfExperience} onChange={(e) => update('yearsOfExperience', e.target.value)} />
                        {fieldError("yearsOfExperience")}
                      </div>
                    </div>
                    <div className="form-field">
                      <label>Skills / Support Categories</label>
                      <input type="text" value={form.skillsCategories} onChange={(e) => update('skillsCategories', e.target.value)} placeholder="e.g., Autism, Mental health, Physical disability" />
                    </div>
                    <div className="form-field">
                      <label>Services Offered</label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {SERVICES_OFFERED.map((svc) => (
                          <label key={svc} className="flex items-center gap-2 text-sm text-azure-600 cursor-pointer">
                            <input type="checkbox" checked={form.servicesOffered.includes(svc)} onChange={() => toggleArray('servicesOffered', svc)} className="rounded border-azure-200" />
                            {svc}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="form-field">
                      <label>Availability</label>
                      <div className="flex flex-wrap gap-4 mt-1">
                        {['Weekdays', 'Weekends', 'Day Shift', 'Night Shift'].map((a) => (
                          <label key={a} className="flex items-center gap-2 text-sm text-azure-600 cursor-pointer">
                            <input type="checkbox" checked={form.availability.includes(a)} onChange={() => toggleArray('availability', a)} className="rounded border-azure-200" />
                            {a}
                          </label>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-azure-700 mt-4">Screening & Compliance</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="form-field">
                        <label>NDIS Worker Screening Check ID</label>
                        <input type="text" value={form.ndisWorkerScreeningId} onChange={(e) => update('ndisWorkerScreeningId', e.target.value)} />
                      </div>
                      <div className="form-field">
                        <label>First Aid & CPR Expiry</label>
                        <input type="date" value={form.firstAidExpiry} onChange={(e) => update('firstAidExpiry', e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="form-field">
                        <label>WWCC Number</label>
                        <input type="text" value={form.wwccNumber} onChange={(e) => update('wwccNumber', e.target.value)} />
                      </div>
                      <div className="form-field">
                        <label>WWCC Expiry</label>
                        <input type="date" value={form.wwccExpiry} onChange={(e) => update('wwccExpiry', e.target.value)} />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-azure-600 cursor-pointer">
                      <input type="checkbox" checked={form.ndisOrientationModule} onChange={(e) => update('ndisOrientationModule', e.target.checked)} className="rounded border-azure-200" />
                      I have completed the NDIS Worker Orientation Module
                    </label>
                    <h3 className="text-sm font-semibold text-azure-700 mt-4">Vehicle & Travel</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="form-field">
                        <label>Own Vehicle?</label>
                        <select value={form.hasOwnVehicle} onChange={(e) => update('hasOwnVehicle', e.target.value)} className="filter-dropdown w-full">
                          <option value="">Select...</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                      <div className="form-field">
                        <label>Driver License Number</label>
                        <input type="text" value={form.driverLicenseNumber} onChange={(e) => update('driverLicenseNumber', e.target.value)} />
                      </div>
                      <div className="form-field">
                        <label>License Expiry</label>
                        <input type="date" value={form.driverLicenseExpiry} onChange={(e) => update('driverLicenseExpiry', e.target.value)} />
                      </div>
                    </div>
                    <div className="form-field">
                      <label>Willing to Travel (km)</label>
                      <input type="text" value={form.travelRadius} onChange={(e) => update('travelRadius', e.target.value)} placeholder="e.g., 25" />
                    </div>
                    <h3 className="text-sm font-semibold text-azure-700 mt-4">Payment Details</h3>
                    <div className="form-field">
                      <label>ABN *</label>
                      <input type="text" value={form.abn} onChange={(e) => update('abn', e.target.value)} placeholder="11 digits" maxLength={14} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="form-field">
                        <label>Bank BSB (optional)</label>
                        <input type="text" value={form.bankBsb} onChange={(e) => update('bankBsb', e.target.value)} placeholder="000-000" maxLength={7} />
                      </div>
                      <div className="form-field">
                        <label>Account Number (optional)</label>
                        <input type="text" value={form.bankAccountNumber} onChange={(e) => update('bankAccountNumber', e.target.value)} />
                      </div>
                      <div className="form-field">
                        <label>Account Name (optional)</label>
                        <input type="text" value={form.bankAccountName} onChange={(e) => update('bankAccountName', e.target.value)} />
                      </div>
                    </div>
                    <hr className="border-azure-50" />
                  </>
                )}

                {/* Common fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-field">
                    <label>First Name *</label>
                    <input type="text" value={form.firstName} onChange={(e) => { update('firstName', e.target.value); setFieldErrors((p) => { const n = {...p}; delete n.firstName; return n; }); }} />
                    {fieldError('firstName')}
                  </div>
                  <div className="form-field">
                    <label>Last Name *</label>
                    <input type="text" value={form.lastName} onChange={(e) => { update('lastName', e.target.value); setFieldErrors((p) => { const n = {...p}; delete n.lastName; return n; }); }} />
                    {fieldError('lastName')}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-field">
                    <label>Email *</label>
                    <input type="email" value={form.email} onChange={(e) => { update('email', e.target.value); setEmailVerified(false); setOtpSent(false); setFieldErrors((p) => { const n = {...p}; delete n.email; return n; }); }} />
                    {/* Email Verification */}
                    {form.email && !emailVerified && (
                      <div className="mt-2">
                        {!otpSent ? (
                          <button type="button" onClick={sendOtp} disabled={otpLoading || !form.email.includes('@')} className="text-xs font-medium text-gold-600 hover:text-gold-700">
                            {otpLoading ? 'Sending...' : 'Verify email →'}
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <input type="text" value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Enter 6-digit code" maxLength={6} className="w-36 px-3 py-1.5 border border-azure-200 rounded-lg text-sm" />
                            <button type="button" onClick={verifyOtp} disabled={otpLoading || otpCode.length !== 6} className="text-xs font-medium bg-gold-500 text-azure-700 px-3 py-1.5 rounded-lg hover:bg-gold-400">
                              {otpLoading ? '...' : 'Verify'}
                            </button>
                          </div>
                        )}
                        {otpError && <p className="text-xs text-red-500 mt-1">{otpError}</p>}
                      </div>
                    )}
                    {emailVerified && <p className="text-xs text-emerald-600 mt-1">✓ Email verified</p>}
                    {fieldError('email')}
                  </div>
                  <div className="form-field">
                    <label>Phone *</label>
                    <input type="tel" value={form.phone} onChange={(e) => { update('phone', e.target.value); setFieldErrors((p) => { const n = {...p}; delete n.phone; return n; }); }} placeholder="0412 345 678" />
                    {fieldError('phone')}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-field">
                    <label>Password *</label>
                    <input type="password" value={form.password} onChange={(e) => { update('password', e.target.value); setFieldErrors((p) => { const n = {...p}; delete n.password; return n; }); }} />
                    {fieldError('password')}
                  </div>
                  <div className="form-field">
                    <label>Confirm Password *</label>
                    <input type="password" value={form.confirmPassword} onChange={(e) => { update('confirmPassword', e.target.value); setFieldErrors((p) => { const n = {...p}; delete n.confirmPassword; return n; }); }} />
                    {fieldError('confirmPassword')}
                  </div>
                </div>
                <div className="form-field">
                  <label>Profile Photo (optional)</label>
                  <ManagedUpload id="profile_photo" label="Upload profile photo" files={files} setFiles={setFiles} accept=".jpg,.jpeg,.png,.webp" />
                </div>
                <hr className="border-azure-50" />
                <div className="form-field">
                  <label>Street Address *</label>
                  <input type="text" value={form.street} onChange={(e) => { update('street', e.target.value); setFieldErrors((p) => { const n = {...p}; delete n.street; return n; }); }} />
                  {fieldError('street')}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="form-field">
                    <label>Suburb *</label>
                    <input type="text" value={form.suburb} onChange={(e) => { update('suburb', e.target.value); setFieldErrors((p) => { const n = {...p}; delete n.suburb; return n; }); }} />
                    {fieldError('suburb')}
                  </div>
                  <div className="form-field">
                    <label>State *</label>
                    <select value={form.state} onChange={(e) => update('state', e.target.value)} className="filter-dropdown w-full">
                      {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Postcode *</label>
                    <input type="text" value={form.postcode} onChange={(e) => { update('postcode', e.target.value); setFieldErrors((p) => { const n = {...p}; delete n.postcode; return n; }); }} maxLength={4} />
                    {fieldError('postcode')}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Compliance Documents */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-azure-700 mb-2">Compliance Documents</h2>
                <p className="text-sm text-azure-400 mb-4">Upload your compliance documents. You can also upload these later from your dashboard.</p>

                <div className="space-y-3">
                  {form.accountType === 'registered_provider' && (
                    <>
                      <ManagedUpload id="abn_cert" label="ABN Certificate" files={files} setFiles={setFiles} />
                      <ManagedUpload id="logo" label="Company Logo" files={files} setFiles={setFiles} />
                      <ManagedUpload id="insurance" label="Public Liability Insurance" files={files} setFiles={setFiles} />
                      <ManagedUpload id="workers_comp" label="Workers Compensation Certificate" files={files} setFiles={setFiles} />
                    </>
                  )}
                  {form.accountType === 'support_coordinator' && (
                    <>
                      <ManagedUpload id="police_check" label="Police Check / NDIS Worker Screening" files={files} setFiles={setFiles} />
                      <ManagedUpload id="accreditation" label="Membership / Accreditation Certificate" files={files} setFiles={setFiles} />
                    </>
                  )}
                  {form.accountType === 'independent_worker' && (
                    <>
                      <ManagedUpload id="police_check" label="Police Check" files={files} setFiles={setFiles} />
                      <ManagedUpload id="ndis_screening" label="NDIS Worker Screening Check" files={files} setFiles={setFiles} />
                      <ManagedUpload id="wwcc" label="Working With Children Check (WWCC)" files={files} setFiles={setFiles} />
                      <ManagedUpload id="first_aid" label="First Aid & CPR Certificate" files={files} setFiles={setFiles} />
                      <ManagedUpload id="drivers_licence" label="Driver's Licence" files={files} setFiles={setFiles} />
                      <ManagedUpload id="car_insurance" label="Car Insurance (if transporting participants)" files={files} setFiles={setFiles} />
                      <ManagedUpload id="resume" label="Resume" files={files} setFiles={setFiles} />
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-azure-700 mb-4">Review & Submit</h2>
                <div className="bg-azure-50/50 rounded-xl p-4 space-y-2 text-sm">
                  <Row label="Account Type" value={ACCOUNT_TYPES.find((t) => t.value === form.accountType)?.label || ''} />
                  <Row label="Name" value={`${form.firstName} ${form.lastName}`} />
                  <Row label="Email" value={form.email} />
                  <Row label="Phone" value={form.phone} />
                  <Row label="Address" value={`${form.street}, ${form.suburb} ${form.state} ${form.postcode}`} />

                  {/* Provider fields */}
                  {form.accountType === 'registered_provider' && (
                    <>
                      <hr className="border-azure-100 my-2" />
                      <Row label="Organisation" value={form.organisationName} />
                      <Row label="ABN" value={form.abn} />
                      <Row label="Provider Type" value={form.providerType} />
                      <Row label="Company Structure" value={form.companyStructure} />
                      {form.ndisRegistrationNumber && <Row label="NDIS Reg Number" value={form.ndisRegistrationNumber} />}
                      {form.website && <Row label="Website" value={form.website} />}
                      {form.yearsOfExperience && <Row label="Experience" value={`${form.yearsOfExperience} years`} />}
                      {form.classesOfSupport.length > 0 && <Row label="Classes of Support" value={form.classesOfSupport.join(', ')} />}
                      {form.contactPersonName && <Row label="Contact Person" value={`${form.contactPersonName} (${form.contactPersonDesignation})`} />}
                    </>
                  )}

                  {/* Coordinator fields */}
                  {form.accountType === 'support_coordinator' && (
                    <>
                      <hr className="border-azure-100 my-2" />
                      {form.abn && <Row label="ABN" value={form.abn} />}
                      <Row label="Practitioner Type" value={form.practitionerType} />
                      <Row label="Experience" value={`${form.yearsOfExperience} years`} />
                      {form.areasOfExpertise && <Row label="Areas of Expertise" value={form.areasOfExpertise} />}
                      {form.supportMode.length > 0 && <Row label="Support Mode" value={form.supportMode.join(', ')} />}
                      {form.membershipNumber && <Row label="Membership Number" value={form.membershipNumber} />}
                    </>
                  )}

                  {/* Worker fields */}
                  {form.accountType === 'independent_worker' && (
                    <>
                      <hr className="border-azure-100 my-2" />
                      <Row label="ABN" value={form.abn} />
                      <Row label="Worker Type" value={form.workerType} />
                      <Row label="Experience" value={`${form.yearsOfExperience} years`} />
                      {form.skillsCategories && <Row label="Skills" value={form.skillsCategories} />}
                      {form.servicesOffered.length > 0 && <Row label="Services" value={form.servicesOffered.join(', ')} />}
                      {form.availability.length > 0 && <Row label="Availability" value={form.availability.join(', ')} />}
                      {form.hasOwnVehicle && <Row label="Own Vehicle" value={form.hasOwnVehicle} />}
                      {form.travelRadius && <Row label="Travel Radius" value={`${form.travelRadius} km`} />}
                    </>
                  )}

                  {/* Uploaded files */}
                  {Object.keys(files).length > 0 && (
                    <>
                      <hr className="border-azure-100 my-2" />
                      <p className="text-azure-500 font-medium">Uploaded Documents</p>
                      {Object.entries(files).map(([id, f]) => (
                        <Row key={id} label={id.replace(/_/g, ' ')} value={f.filename} />
                      ))}
                    </>
                  )}
                </div>
                <p className="text-xs text-azure-400">By submitting, you confirm all information is accurate. Your application will be reviewed and you'll receive an email once approved.</p>
                <label className="flex items-start gap-2 text-sm text-azure-600 cursor-pointer mt-3">
                  <input type="checkbox" checked={form.declaration} onChange={(e) => update('declaration', e.target.checked)} className="rounded border-azure-200 mt-0.5" />
                  <span>I declare that the information provided is true and correct. I understand that providing false information may result in rejection or termination of my account.</span>
                </label>
                {fieldError('declaration')}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="card-footer flex justify-between">
            {step > 0 ? (
              <button onClick={() => { setFieldErrors({}); setStep((s) => s - 1); }} className="btn btn-secondary">
                <FaArrowLeft className="w-3.5 h-3.5 mr-2" />Back
              </button>
            ) : (
              <div></div>
            )}
            {step < STEPS.length - 1 ? (
              <button onClick={handleNext} className="btn btn-primary">
                Next<FaArrowRight className="w-3.5 h-3.5 ml-2" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="btn btn-gold">
                {loading ? <FaSpinner className="w-4 h-4 animate-spin mr-2" /> : <FaCheck className="w-3.5 h-3.5 mr-2" />}
                {loading ? 'Submitting...' : 'Submit Registration'}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-azure-400 mt-6">
          Already have an account? <Link href="/admin/login" className="text-gold-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-azure-400">{label}</span>
      <span className="font-medium text-azure-700 text-right">{value}</span>
    </div>
  );
}

function ManagedUpload({ id, label, files, setFiles, accept }: {
  id: string;
  label: string;
  files: Record<string, { key: string; filename: string }>;
  setFiles: React.Dispatch<React.SetStateAction<Record<string, { key: string; filename: string }>>>;
  accept?: string;
}) {
  return (
    <FileUpload
      label={label}
      folder="registration"
      subfolder="compliance"
      accept={accept}
      value={files[id] || null}
      onUploaded={(f) => setFiles((prev) => ({ ...prev, [id]: { key: f.key, filename: f.filename } }))}
      onRemove={() => setFiles((prev) => { const next = { ...prev }; delete next[id]; return next; })}
    />
  );
}
