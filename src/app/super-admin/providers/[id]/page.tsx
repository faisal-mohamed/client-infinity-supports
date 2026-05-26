'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaCheck, FaBan, FaPlay, FaTrash, FaSpinner, FaBuilding } from 'react-icons/fa';

interface Organization {
  id: string;
  name: string;
  tradingName?: string;
  abn: string;
  status: string;
  registrationType: string;
  ndisRegistrationNumber?: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  address: { street: string; suburb: string; state: string; postcode: string };
  insuranceExpiry?: string;
  workerCompExpiry?: string;
  ndisRegistrationExpiry?: string;
  onboardedAt?: string;
  suspendedAt?: string;
  suspendedReason?: string;
  notes?: string;
  createdAt: string;
}

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'Pending', className: 'badge badge-yellow' },
  VERIFYING: { label: 'Verifying', className: 'badge badge-blue' },
  ACTIVE: { label: 'Active', className: 'badge badge-green' },
  SUSPENDED: { label: 'Suspended', className: 'badge badge-red' },
  DEACTIVATED: { label: 'Deactivated', className: 'badge badge-gray' },
};

export default function ProviderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [showReasonModal, setShowReasonModal] = useState<'suspend' | 'deactivate' | null>(null);

  useEffect(() => {
    fetch(`/api/super-admin/providers/${id}`)
      .then((r) => r.json())
      .then(setOrg)
      .finally(() => setLoading(false));
  }, [id]);

  async function performAction(action: string, extraBody?: Record<string, string>) {
    setActionLoading(true);

    let res;
    if (action === 'approve') {
      // Use dedicated approve endpoint that creates admin user + sends email
      res = await fetch(`/api/super-admin/providers/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      res = await fetch(`/api/super-admin/providers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...extraBody }),
      });
    }

    if (res.ok) {
      // Re-fetch org to get updated status
      const orgRes = await fetch(`/api/super-admin/providers/${id}`);
      if (orgRes.ok) setOrg(await orgRes.json());
    }
    setActionLoading(false);
    setShowReasonModal(null);
    setReason('');
  }

  if (loading) return <div className="flex items-center justify-center h-64"><FaSpinner className="w-5 h-5 text-azure-400 animate-spin" /></div>;
  if (!org) return <div className="text-center py-12 text-azure-400">Provider not found</div>;

  const badge = STATUS_BADGES[org.status] || STATUS_BADGES.PENDING;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push('/super-admin/providers')} className="p-2 rounded-lg hover:bg-azure-100 text-azure-400">
          <FaArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-azure-700">{org.name}</h1>
            <span className={badge.className}>{badge.label}</span>
          </div>
          {org.tradingName && <p className="text-sm text-azure-400">Trading as: {org.tradingName}</p>}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(org.status === 'PENDING' || org.status === 'VERIFYING') && (
          <button onClick={() => performAction('approve')} disabled={actionLoading} className="btn btn-success">
            <FaCheck className="w-3.5 h-3.5 mr-2" />Approve
          </button>
        )}
        {org.status === 'ACTIVE' && (
          <button onClick={() => setShowReasonModal('suspend')} disabled={actionLoading} className="btn btn-danger">
            <FaBan className="w-3.5 h-3.5 mr-2" />Suspend
          </button>
        )}
        {org.status === 'SUSPENDED' && (
          <button onClick={() => performAction('reactivate')} disabled={actionLoading} className="btn btn-success">
            <FaPlay className="w-3.5 h-3.5 mr-2" />Reactivate
          </button>
        )}
        {org.status !== 'DEACTIVATED' && (
          <button onClick={() => setShowReasonModal('deactivate')} disabled={actionLoading} className="btn btn-secondary text-red-600 border-red-200 hover:bg-red-50">
            <FaTrash className="w-3.5 h-3.5 mr-2" />Deactivate
          </button>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header"><h3 className="text-sm font-semibold text-azure-700">Business Information</h3></div>
          <div className="card-body space-y-3 text-sm">
            <Row label="ABN" value={org.abn} mono />
            <Row label="Registration" value={org.registrationType} />
            {org.ndisRegistrationNumber && <Row label="NDIS Number" value={org.ndisRegistrationNumber} />}
            <Row label="Created" value={new Date(org.createdAt).toLocaleDateString('en-AU')} />
            {org.onboardedAt && <Row label="Approved" value={new Date(org.onboardedAt).toLocaleDateString('en-AU')} />}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3 className="text-sm font-semibold text-azure-700">Contact</h3></div>
          <div className="card-body space-y-3 text-sm">
            <Row label="Name" value={org.primaryContactName} />
            <Row label="Email" value={org.primaryContactEmail} />
            <Row label="Phone" value={org.primaryContactPhone} />
            <Row label="Address" value={`${org.address.street}, ${org.address.suburb} ${org.address.state} ${org.address.postcode}`} />
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3 className="text-sm font-semibold text-azure-700">Compliance Documents</h3></div>
          <div className="card-body space-y-3 text-sm">
            <Row label="Insurance Expiry" value={org.insuranceExpiry ? new Date(org.insuranceExpiry).toLocaleDateString('en-AU') : 'Not set'} warn={isExpiringSoon(org.insuranceExpiry)} />
            <Row label="Workers Comp Expiry" value={org.workerCompExpiry ? new Date(org.workerCompExpiry).toLocaleDateString('en-AU') : 'Not set'} warn={isExpiringSoon(org.workerCompExpiry)} />
            {org.ndisRegistrationExpiry && <Row label="NDIS Reg Expiry" value={new Date(org.ndisRegistrationExpiry).toLocaleDateString('en-AU')} warn={isExpiringSoon(org.ndisRegistrationExpiry)} />}
          </div>
        </div>

        {(org.suspendedReason || org.notes) && (() => {
          const details = org.notes ? (() => { try { return JSON.parse(org.notes); } catch { return null; } })() : null;
          return (
            <>
              {org.suspendedReason && (
                <div className="card">
                  <div className="card-header"><h3 className="text-sm font-semibold text-red-700">Suspension</h3></div>
                  <div className="card-body text-sm"><p className="text-red-600">{org.suspendedReason}</p></div>
                </div>
              )}
              {details && (
                <div className="card">
                  <div className="card-header"><h3 className="text-sm font-semibold text-azure-700">Registration Details</h3></div>
                  <div className="card-body space-y-3 text-sm">
                    <Row label="Account Type" value={details.accountType?.replace(/_/g, ' ')} />
                    {details.companyStructure && <Row label="Company Structure" value={details.companyStructure.replace(/_/g, ' ')} />}
                    {details.practitionerType && <Row label="Practitioner Type" value={details.practitionerType.replace(/_/g, ' ')} />}
                    {details.workerType && <Row label="Worker Type" value={details.workerType.replace(/_/g, ' ')} />}
                    {details.yearsOfExperience && <Row label="Experience" value={`${details.yearsOfExperience} years`} />}
                    {details.areasOfExpertise && <Row label="Areas of Expertise" value={details.areasOfExpertise} />}
                    {details.skillsCategories && <Row label="Skills / Categories" value={details.skillsCategories} />}
                    {details.website && <Row label="Website" value={details.website} />}
                    {details.classesOfSupport?.length > 0 && <Row label="Classes of Support" value={details.classesOfSupport.join(', ')} />}
                    {details.supportMode?.length > 0 && <Row label="Support Mode" value={details.supportMode.join(', ')} />}
                    {details.servicesOffered?.length > 0 && <Row label="Services Offered" value={details.servicesOffered.join(', ')} />}
                    {details.availability?.length > 0 && <Row label="Availability" value={details.availability.join(', ')} />}
                    {details.hasOwnVehicle && <Row label="Own Vehicle" value={details.hasOwnVehicle} />}
                    {details.travelRadius && <Row label="Travel Radius" value={`${details.travelRadius} km`} />}
                    {details.membershipNumber && <Row label="Membership Number" value={details.membershipNumber} />}
                    {details.contactPersonName && <Row label="Contact Person" value={`${details.contactPersonName} (${details.contactPersonDesignation || ''})`} />}
                    {details.contactPersonEmail && <Row label="Contact Email" value={details.contactPersonEmail} />}
                    {details.contactPersonPhone && <Row label="Contact Phone" value={details.contactPersonPhone} />}
                  </div>
                </div>
              )}
              {details && (details.policeCheckId || details.ndisWorkerScreeningId || details.wwccNumber || details.driverLicenseNumber || details.firstAidExpiry) && (
                <div className="card">
                  <div className="card-header"><h3 className="text-sm font-semibold text-azure-700">Screening & Compliance</h3></div>
                  <div className="card-body space-y-3 text-sm">
                    {details.policeCheckId && <Row label="Police Check ID" value={details.policeCheckId} />}
                    {details.policeCheckExpiry && <Row label="Police Check Expiry" value={details.policeCheckExpiry} />}
                    {details.ndisWorkerScreeningId && <Row label="NDIS Worker Screening ID" value={details.ndisWorkerScreeningId} />}
                    {details.wwccNumber && <Row label="WWCC Number" value={details.wwccNumber} />}
                    {details.wwccExpiry && <Row label="WWCC Expiry" value={details.wwccExpiry} />}
                    {details.firstAidExpiry && <Row label="First Aid Expiry" value={details.firstAidExpiry} />}
                    {details.ndisOrientationModule && <Row label="NDIS Orientation Module" value="Completed" />}
                    {details.driverLicenseNumber && <Row label="Driver License" value={details.driverLicenseNumber} />}
                    {details.driverLicenseExpiry && <Row label="License Expiry" value={details.driverLicenseExpiry} />}
                  </div>
                </div>
              )}
              {details?.bankBsb && (
                <div className="card">
                  <div className="card-header"><h3 className="text-sm font-semibold text-azure-700">Payment Details</h3></div>
                  <div className="card-body space-y-3 text-sm">
                    {details.bankBsb && <Row label="BSB" value={details.bankBsb} />}
                    {details.bankAccountNumber && <Row label="Account Number" value={details.bankAccountNumber} />}
                    {details.bankAccountName && <Row label="Account Name" value={details.bankAccountName} />}
                  </div>
                </div>
              )}
              {details?.uploadedFiles && Object.keys(details.uploadedFiles).length > 0 && (
                <div className="card">
                  <div className="card-header"><h3 className="text-sm font-semibold text-azure-700">Uploaded Documents</h3></div>
                  <div className="card-body space-y-2 text-sm">
                    {Object.entries(details.uploadedFiles).map(([id, file]: [string, any]) => (
                      <div key={id} className="flex items-center justify-between">
                        <span className="text-azure-400 capitalize">{id.replace(/_/g, ' ')}</span>
                        <a
                          href={`/api/upload/download?key=${encodeURIComponent(file.key)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-gold-600 hover:text-gold-700 hover:underline"
                        >
                          {file.filename} ↓
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </div>

      {/* Reason Modal */}
      {showReasonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-azure-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-elevated p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-azure-700 mb-4">
              {showReasonModal === 'suspend' ? 'Suspend Provider' : 'Deactivate Provider'}
            </h3>
            <div className="form-field">
              <label>Reason *</label>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="Provide a reason..." />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => { setShowReasonModal(null); setReason(''); }} className="btn btn-secondary">Cancel</button>
              <button
                onClick={() => performAction(showReasonModal, { reason })}
                disabled={!reason.trim() || actionLoading}
                className="btn btn-danger"
              >
                {actionLoading ? <FaSpinner className="w-4 h-4 animate-spin" /> : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, mono, warn }: { label: string; value: string; mono?: boolean; warn?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-azure-400">{label}</span>
      <span className={`font-medium ${mono ? 'font-mono' : ''} ${warn ? 'text-red-600' : 'text-azure-700'}`}>{value}</span>
    </div>
  );
}

function isExpiringSoon(date?: string): boolean {
  if (!date) return false;
  const d = new Date(date);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  return diff < 30 * 24 * 60 * 60 * 1000 && diff > 0; // Within 30 days
}
