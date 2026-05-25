'use client';

import { useEffect, useState } from 'react';
import { FaFileAlt, FaPlus, FaSpinner } from 'react-icons/fa';

interface Template {
  id: string;
  name: string;
  formKey: string;
  category: string;
  status: string;
  version: number;
  pages: unknown[];
}

const STATUS_BADGES: Record<string, string> = {
  published: 'badge badge-green',
  draft: 'badge badge-yellow',
  deprecated: 'badge badge-gray',
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [status, setStatus] = useState('published');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ formKey: '', name: '', description: '', category: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  async function fetchTemplates() {
    setFetching(true);
    const res = await fetch(`/api/super-admin/templates?status=${status}`);
    const data = await res.json();
    setTemplates(data.templates || []);
    setFetching(false);
  }

  useEffect(() => { fetchTemplates(); }, [status]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/super-admin/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, schema: {}, pages: [], requiredSignatures: [] }),
    });
    setLoading(false);
    setShowModal(false);
    setForm({ formKey: '', name: '', description: '', category: '' });
    setStatus('draft');
    fetchTemplates();
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-azure-700">Form Templates</h1>
          <p className="text-sm text-azure-400 mt-1">Manage master form templates for all providers</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-gold">
          <FaPlus className="w-3.5 h-3.5 mr-2" />Create Template
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex gap-1 mb-6 bg-azure-50 rounded-xl p-1 w-fit">
        {['published', 'draft', 'deprecated'].map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${status === s ? 'bg-white text-azure-700 shadow-soft' : 'text-azure-400'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Grid */}
      {fetching ? (
        <div className="flex items-center justify-center h-40">
          <FaSpinner className="w-5 h-5 text-azure-400 animate-spin" />
        </div>
      ) : templates.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <FaFileAlt className="w-10 h-10 text-azure-200 mx-auto mb-3" />
            <p className="text-azure-400 text-sm">No {status} templates found</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t) => (
            <div key={t.id} className="card">
              <div className="card-body">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-azure-700">{t.name}</h3>
                  <span className={STATUS_BADGES[t.status] || 'badge badge-gray'}>{t.status}</span>
                </div>
                <p className="text-xs text-azure-400 mb-3 capitalize">{t.category}</p>
                <div className="flex items-center gap-4 text-xs text-azure-400">
                  <span>v{t.version}</span>
                  <span>{t.pages?.length || 0} pages</span>
                  <span className="font-mono">{t.formKey}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-azure-900/40 backdrop-blur-sm">
          <form onSubmit={handleCreate} className="bg-white rounded-2xl shadow-elevated p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-azure-700 mb-4">Create Template</h3>
            <div className="space-y-4">
              <div className="form-field">
                <label>Form Key *</label>
                <input type="text" value={form.formKey} onChange={(e) => setForm({ ...form, formKey: e.target.value })} placeholder="e.g., welcome_form" required />
              </div>
              <div className="form-field">
                <label>Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Welcome Pack" required />
              </div>
              <div className="form-field">
                <label>Category *</label>
                <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g., participant, staff, compliance" required />
              </div>
              <div className="form-field">
                <label>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? <FaSpinner className="w-4 h-4 animate-spin" /> : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
