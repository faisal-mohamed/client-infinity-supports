'use client';

import { useState } from 'react';
import { FaLock, FaSpinner, FaCheck } from 'react-icons/fa';

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (newPassword.length < 15) { setError('New password must be at least 15 characters'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }

    setLoading(true);
    const res = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error); return; }
    setSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azure-700">Change Password</h1>
        <p className="text-sm text-azure-400 mt-1">Update your account password</p>
      </div>

      {success && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-sm text-emerald-700 flex items-center gap-2">
          <FaCheck className="w-4 h-4" /> Password changed successfully
        </div>
      )}
      {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="card-body space-y-4">
          <div className="form-field">
            <label>Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          </div>
          <div className="form-field">
            <label>New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            {newPassword && newPassword.length < 15 && <p className="text-xs text-red-500 mt-1">Min 15 characters</p>}
          </div>
          <div className="form-field">
            <label>Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            {confirmPassword && newPassword !== confirmPassword && <p className="text-xs text-red-500 mt-1">Passwords do not match</p>}
          </div>
        </div>
        <div className="card-footer">
          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? <FaSpinner className="w-4 h-4 animate-spin mr-2" /> : <FaLock className="w-3.5 h-3.5 mr-2" />}
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );
}
