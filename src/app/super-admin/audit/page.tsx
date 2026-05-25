'use client';

import { useCallback, useState } from 'react';
import { FaHistory, FaSearch, FaSpinner } from 'react-icons/fa';

const CATEGORIES = ['AUTH', 'PROVIDER', 'SUBSCRIPTION', 'COMPLIANCE', 'FORM_TEMPLATE', 'SETTINGS', 'SYSTEM'];

interface AuditLog {
  id: string;
  createdAt: string;
  actorEmail: string;
  category: string;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchLogs = useCallback(async (nextCursor?: string) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    if (nextCursor) params.set('cursor', nextCursor);
    params.set('limit', '50');

    const res = await fetch(`/api/super-admin/audit?${params}`);
    const data = await res.json();
    setLogs((prev) => (nextCursor ? [...prev, ...data.items] : data.items));
    setCursor(data.nextCursor ?? null);
    setLoading(false);
  }, [category, startDate, endDate]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azure-700">Audit Logs</h1>
        <p className="text-sm text-azure-400 mt-1">Immutable record of all platform actions</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="card-body flex flex-col sm:flex-row gap-3 items-end">
          <div className="form-field mb-0 flex-1">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="filter-dropdown w-full">
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-field mb-0">
            <label>Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="form-field mb-0">
            <label>End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <button onClick={() => fetchLogs()} disabled={loading} className="btn btn-primary">
            <FaSearch className="w-3.5 h-3.5 mr-2" />
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      {logs.length === 0 && !loading ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <FaHistory className="w-10 h-10 text-azure-200 mx-auto mb-3" />
            <p className="text-azure-400 text-sm">No audit logs found. Apply filters and search.</p>
          </div>
        </div>
      ) : (
        <div className="card table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Category</th>
                <th>Action</th>
                <th>Target</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="whitespace-nowrap text-xs">
                    {new Date(log.createdAt).toLocaleString('en-AU', { dateStyle: 'short', timeStyle: 'medium' })}
                  </td>
                  <td className="text-sm">{log.actorEmail}</td>
                  <td><span className="badge badge-blue">{log.category}</span></td>
                  <td className="text-sm">{log.action}</td>
                  <td className="text-xs text-azure-400">{log.targetType ? `${log.targetType}:${log.targetId?.slice(0, 8)}` : '—'}</td>
                  <td className="text-xs text-azure-400 max-w-[200px] truncate">{log.metadata ? JSON.stringify(log.metadata) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {loading && (
            <div className="flex justify-center py-4">
              <FaSpinner className="w-5 h-5 text-azure-400 animate-spin" />
            </div>
          )}

          {cursor && !loading && (
            <div className="card-footer text-center">
              <button onClick={() => fetchLogs(cursor)} className="btn btn-secondary">
                Load More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
