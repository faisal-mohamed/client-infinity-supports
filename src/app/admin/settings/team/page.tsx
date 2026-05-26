'use client';

import { useEffect, useState } from 'react';
import { FaUsers, FaPlus, FaSpinner, FaEnvelope } from 'react-icons/fa';

interface TeamMember { id: string; name: string; email: string; createdAt: string; }

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/admin/team').then((r) => r.json()).then((d) => setMembers(d.members || [])).finally(() => setLoading(false));
  }, []);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviting(true);
    setError('');
    setSuccess('');

    const res = await fetch('/api/admin/team/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: inviteName, email: inviteEmail }),
    });

    const data = await res.json();
    if (!res.ok) { setError(data.error); setInviting(false); return; }

    setSuccess(`Invite sent to ${inviteEmail}`);
    setMembers((prev) => [...prev, { id: data.id, name: data.name, email: data.email, createdAt: new Date().toISOString() }]);
    setInviteName('');
    setInviteEmail('');
    setShowInvite(false);
    setInviting(false);
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-azure-700">Team Members</h1>
          <p className="text-sm text-azure-400 mt-1">Manage admin users in your organization</p>
        </div>
        <button onClick={() => setShowInvite(true)} className="btn btn-gold">
          <FaPlus className="w-3.5 h-3.5 mr-2" />Invite Member
        </button>
      </div>

      {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">{error}</div>}
      {success && <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-sm text-emerald-700">{success}</div>}

      {loading ? (
        <div className="flex items-center justify-center h-40"><FaSpinner className="w-5 h-5 text-azure-400 animate-spin" /></div>
      ) : members.length === 0 ? (
        <div className="card"><div className="card-body text-center py-12"><FaUsers className="w-10 h-10 text-azure-200 mx-auto mb-3" /><p className="text-azure-400 text-sm">No team members yet</p></div></div>
      ) : (
        <div className="card table-container">
          <table className="table">
            <thead><tr><th>Name</th><th>Email</th><th>Joined</th></tr></thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td className="font-medium text-azure-700">{m.name}</td>
                  <td className="text-sm">{m.email}</td>
                  <td className="text-xs text-azure-400">{new Date(m.createdAt).toLocaleDateString('en-AU')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-azure-900/40 backdrop-blur-sm">
          <form onSubmit={handleInvite} className="bg-white rounded-2xl shadow-elevated p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-azure-700 mb-4">Invite Team Member</h3>
            <div className="space-y-4">
              <div className="form-field">
                <label>Name *</label>
                <input type="text" value={inviteName} onChange={(e) => setInviteName(e.target.value)} required />
              </div>
              <div className="form-field">
                <label>Email *</label>
                <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} required />
              </div>
            </div>
            <p className="text-xs text-azure-400 mt-3">They'll receive an email with login credentials.</p>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setShowInvite(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" disabled={inviting || !inviteName || !inviteEmail} className="btn btn-primary">
                {inviting ? <FaSpinner className="w-4 h-4 animate-spin mr-2" /> : <FaEnvelope className="w-3.5 h-3.5 mr-2" />}
                Send Invite
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
