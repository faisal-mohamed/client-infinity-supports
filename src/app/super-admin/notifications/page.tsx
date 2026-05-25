'use client';

import { useEffect, useState } from 'react';
import { FaEnvelope, FaPlus, FaSpinner } from 'react-icons/fa';

type Tab = 'templates' | 'rules';

interface EmailTemplate { id: string; key: string; name: string; subject: string; isActive: boolean; }
interface NotifRule { id: string; event: string; channels: string[]; isActive: boolean; }

export default function NotificationsPage() {
  const [tab, setTab] = useState<Tab>('templates');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [rules, setRules] = useState<NotifRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/super-admin/notifications?type=${tab}`)
      .then((r) => r.json())
      .then((d) => {
        if (tab === 'templates') setTemplates(d.items || []);
        else setRules(d.items || []);
      })
      .finally(() => setLoading(false));
  }, [tab]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-azure-700">Email & Notifications</h1>
          <p className="text-sm text-azure-400 mt-1">Manage platform email templates and notification rules</p>
        </div>
        <button className="btn btn-gold">
          <FaPlus className="w-3.5 h-3.5 mr-2" />
          Create {tab === 'templates' ? 'Template' : 'Rule'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-azure-50 rounded-xl p-1 w-fit">
        <button onClick={() => setTab('templates')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'templates' ? 'bg-white text-azure-700 shadow-soft' : 'text-azure-400'}`}>
          Email Templates
        </button>
        <button onClick={() => setTab('rules')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'rules' ? 'bg-white text-azure-700 shadow-soft' : 'text-azure-400'}`}>
          Notification Rules
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <FaSpinner className="w-5 h-5 text-azure-400 animate-spin" />
        </div>
      ) : tab === 'templates' ? (
        templates.length === 0 ? (
          <div className="card">
            <div className="card-body text-center py-12">
              <FaEnvelope className="w-10 h-10 text-azure-200 mx-auto mb-3" />
              <p className="text-azure-400 text-sm">No email templates configured</p>
            </div>
          </div>
        ) : (
          <div className="card table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Name</th>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((t) => (
                  <tr key={t.id}>
                    <td className="font-mono text-xs">{t.key}</td>
                    <td className="font-medium text-azure-700">{t.name}</td>
                    <td>{t.subject}</td>
                    <td><span className={t.isActive ? 'badge badge-green' : 'badge badge-gray'}>{t.isActive ? 'Active' : 'Inactive'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        rules.length === 0 ? (
          <div className="card">
            <div className="card-body text-center py-12">
              <FaEnvelope className="w-10 h-10 text-azure-200 mx-auto mb-3" />
              <p className="text-azure-400 text-sm">No notification rules configured</p>
            </div>
          </div>
        ) : (
          <div className="card table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Channels</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((r) => (
                  <tr key={r.id}>
                    <td className="font-medium text-azure-700">{r.event}</td>
                    <td>{r.channels.map((c) => <span key={c} className="badge badge-blue mr-1">{c}</span>)}</td>
                    <td><span className={r.isActive ? 'badge badge-green' : 'badge badge-gray'}>{r.isActive ? 'Active' : 'Inactive'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
