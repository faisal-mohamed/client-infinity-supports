'use client';

import { useEffect, useState } from 'react';
import { FaChartBar, FaSpinner, FaDownload } from 'react-icons/fa';

type ReportType = 'overview' | 'providers' | 'subscriptions' | 'compliance';

export default function ReportsPage() {
  const [type, setType] = useState<ReportType>('overview');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/super-admin/reports?type=${type}`)
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [type]);

  const tabs: { key: ReportType; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'providers', label: 'Providers' },
    { key: 'subscriptions', label: 'Subscriptions' },
    { key: 'compliance', label: 'Compliance' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azure-700">Reports</h1>
        <p className="text-sm text-azure-400 mt-1">Platform-wide analytics and reporting</p>
      </div>

      {/* Tab Selector */}
      <div className="flex gap-1 mb-6 bg-azure-50 rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setType(tab.key)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${type === tab.key ? 'bg-white text-azure-700 shadow-soft' : 'text-azure-400'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <FaSpinner className="w-5 h-5 text-azure-400 animate-spin" />
        </div>
      ) : !data ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <FaChartBar className="w-10 h-10 text-azure-200 mx-auto mb-3" />
            <p className="text-azure-400 text-sm">No data available</p>
          </div>
        </div>
      ) : (
        <>
          {type === 'overview' && <OverviewReport data={data} />}
          {type === 'providers' && <ProvidersReport data={data} />}
          {type === 'subscriptions' && <SubscriptionsReport data={data} />}
          {type === 'compliance' && <ComplianceReport data={data} />}
        </>
      )}
    </div>
  );
}

function OverviewReport({ data }: { data: any }) {
  const providerTotal = Object.values(data.providers || {}).reduce((a: number, b: any) => a + b, 0) as number;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card">
        <div className="card-body">
          <p className="text-xs text-azure-400">Total Providers</p>
          <p className="text-2xl font-bold text-azure-700">{providerTotal}</p>
          <p className="text-xs text-azure-400 mt-1">Active: {data.providers?.ACTIVE || 0} · Pending: {data.providers?.PENDING || 0}</p>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <p className="text-xs text-azure-400">Subscriptions</p>
          <p className="text-2xl font-bold text-azure-700">{data.subscriptions?.total || 0}</p>
          <p className="text-xs text-azure-400 mt-1">Active: {data.subscriptions?.active || 0} · Trial: {data.subscriptions?.trial || 0}</p>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <p className="text-xs text-azure-400">Monthly Revenue</p>
          <p className="text-2xl font-bold text-azure-700">${((data.subscriptions?.monthlyRevenue || 0) / 100).toLocaleString()}</p>
          <p className="text-xs text-azure-400 mt-1">Past Due: {data.subscriptions?.pastDue || 0}</p>
        </div>
      </div>
    </div>
  );
}

function ProvidersReport({ data }: { data: any }) {
  const providers = data.items || [];
  return (
    <div>
      <div className="flex justify-end mb-4">
        <button className="btn btn-secondary"><FaDownload className="w-3.5 h-3.5 mr-2" />Export CSV</button>
      </div>
      {providers.length === 0 ? (
        <div className="card"><div className="card-body text-center py-8 text-azure-400 text-sm">No provider data</div></div>
      ) : (
        <div className="card table-container">
          <table className="table">
            <thead><tr><th>Name</th><th>Status</th><th>Type</th><th>Insurance Expiry</th></tr></thead>
            <tbody>
              {providers.map((p: any) => (
                <tr key={p.id}>
                  <td className="font-medium text-azure-700">{p.name}</td>
                  <td><span className={`badge ${p.status === 'ACTIVE' ? 'badge-green' : p.status === 'SUSPENDED' ? 'badge-red' : 'badge-yellow'}`}>{p.status}</span></td>
                  <td className="text-xs capitalize">{p.registrationType}</td>
                  <td className="text-xs">{p.insuranceExpiry ? new Date(p.insuranceExpiry).toLocaleDateString('en-AU') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SubscriptionsReport({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="card"><div className="card-body"><p className="text-xs text-azure-400">Active</p><p className="text-2xl font-bold text-azure-700">{data.active || 0}</p></div></div>
      <div className="card"><div className="card-body"><p className="text-xs text-azure-400">Trial</p><p className="text-2xl font-bold text-azure-700">{data.trial || 0}</p></div></div>
      <div className="card"><div className="card-body"><p className="text-xs text-azure-400">Past Due</p><p className="text-2xl font-bold text-red-600">{data.pastDue || 0}</p></div></div>
      <div className="card"><div className="card-body"><p className="text-xs text-azure-400">Revenue/mo</p><p className="text-2xl font-bold text-azure-700">${((data.monthlyRevenue || 0) / 100).toLocaleString()}</p></div></div>
    </div>
  );
}

function ComplianceReport({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="card"><div className="card-body"><p className="text-xs text-azure-400">Document Expiry</p><p className="text-2xl font-bold text-gold-600">{data.documentExpiry || 0}</p></div></div>
      <div className="card"><div className="card-body"><p className="text-xs text-azure-400">Insurance Lapse</p><p className="text-2xl font-bold text-red-600">{data.insuranceLapse || 0}</p></div></div>
      <div className="card"><div className="card-body"><p className="text-xs text-azure-400">Audit Overdue</p><p className="text-2xl font-bold text-red-600">{data.auditOverdue || 0}</p></div></div>
      <div className="card"><div className="card-body"><p className="text-xs text-azure-400">Incidents Unresolved</p><p className="text-2xl font-bold text-gold-600">{data.incidentUnresolved || 0}</p></div></div>
    </div>
  );
}
