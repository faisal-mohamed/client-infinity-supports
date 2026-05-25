'use client';

import { useEffect, useState } from 'react';
import { FaClipboardCheck, FaSpinner } from 'react-icons/fa';

interface ComplianceCheck {
  id: string;
  organizationId: string;
  checkType: string;
  status: string;
  dueDate: string | null;
  createdAt: string;
}

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  compliant: { label: 'Compliant', className: 'badge badge-green' },
  warning: { label: 'Warning', className: 'badge badge-yellow' },
  non_compliant: { label: 'Non-Compliant', className: 'badge badge-red' },
  pending: { label: 'Pending', className: 'badge badge-gray' },
};

export default function CompliancePage() {
  const [checks, setChecks] = useState<ComplianceCheck[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter) params.set('status', filter);
    fetch(`/api/super-admin/compliance?${params}`)
      .then((r) => r.json())
      .then((d) => setChecks(d.items ?? []))
      .finally(() => setLoading(false));
  }, [filter]);

  const counts = checks.reduce<Record<string, number>>((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azure-700">Compliance Monitoring</h1>
        <p className="text-sm text-azure-400 mt-1">Track provider compliance status and document expiry</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(STATUS_BADGES).map(([key, { label, className }]) => (
          <div key={key} className="card">
            <div className="card-body flex items-center gap-3">
              <span className={className}>{label}</span>
              <p className="text-xl font-bold text-azure-700 ml-auto">{counts[key] || 0}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="card mb-6">
        <div className="card-body flex flex-col sm:flex-row gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-dropdown"
          >
            <option value="">All Statuses</option>
            <option value="compliant">Compliant</option>
            <option value="warning">Warning</option>
            <option value="non_compliant">Non-Compliant</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <FaSpinner className="w-5 h-5 text-azure-400 animate-spin" />
        </div>
      ) : checks.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <FaClipboardCheck className="w-10 h-10 text-azure-200 mx-auto mb-3" />
            <p className="text-azure-400 text-sm">No compliance checks found</p>
          </div>
        </div>
      ) : (
        <div className="card table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Organization</th>
                <th>Check Type</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {checks.map((c) => {
                const badge = STATUS_BADGES[c.status] || STATUS_BADGES.pending;
                return (
                  <tr key={c.id}>
                    <td className="font-mono text-xs">{c.organizationId.slice(0, 12)}...</td>
                    <td className="capitalize">{c.checkType.replace(/_/g, ' ')}</td>
                    <td><span className={badge.className}>{badge.label}</span></td>
                    <td>{c.dueDate ? new Date(c.dueDate).toLocaleDateString('en-AU') : '—'}</td>
                    <td className="text-xs">{new Date(c.createdAt).toLocaleDateString('en-AU')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
