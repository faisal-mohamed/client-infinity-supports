'use client';

import { useEffect, useState, useCallback } from 'react';
import { FaCog, FaSpinner, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { FEATURES } from '@/lib/super-admin/constants';

interface FeatureFlag { featureKey: string; enabled: boolean; }
interface Organization { id: string; name: string; }

const featureEntries = Object.entries(FEATURES) as [string, string][];

export default function SettingsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/super-admin/providers?status=ACTIVE&limit=100')
      .then((r) => r.json())
      .then((data) => setOrgs(data.items || []));
  }, []);

  const fetchFlags = useCallback(async (orgId: string) => {
    if (!orgId) { setFlags({}); return; }
    setLoading(true);
    const res = await fetch(`/api/super-admin/settings?organizationId=${orgId}`);
    const data = await res.json();
    const map: Record<string, boolean> = {};
    (data.items || []).forEach((item: FeatureFlag) => { map[item.featureKey] = item.enabled; });
    setFlags(map);
    setLoading(false);
  }, []);

  useEffect(() => { fetchFlags(selectedOrg); }, [selectedOrg, fetchFlags]);

  async function toggleFeature(featureKey: string, enabled: boolean) {
    setSaving(featureKey);
    await fetch('/api/super-admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organizationId: selectedOrg, featureKey, enabled }),
    });
    setFlags((prev) => ({ ...prev, [featureKey]: enabled }));
    setSaving(null);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azure-700">Provider Global Settings</h1>
        <p className="text-sm text-azure-400 mt-1">Control feature access per provider organization</p>
      </div>

      {/* Org Selector */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="form-field mb-0">
            <label>Select Organization</label>
            <select value={selectedOrg} onChange={(e) => setSelectedOrg(e.target.value)} className="filter-dropdown w-full sm:w-96">
              <option value="">— Select a provider —</option>
              {orgs.map((org) => <option key={org.id} value={org.id}>{org.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Feature Flags */}
      {selectedOrg && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-sm font-semibold text-azure-700">Feature Flags</h3>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <FaSpinner className="w-5 h-5 text-azure-400 animate-spin" />
              </div>
            ) : (
              <div className="divide-y divide-azure-50">
                {featureEntries.map(([label, key]) => {
                  const isEnabled = flags[key] ?? false;
                  const isSaving = saving === key;
                  return (
                    <div key={key} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-azure-700 capitalize">{label.replace(/_/g, ' ').toLowerCase()}</p>
                        <p className="text-xs text-azure-400 font-mono">{key}</p>
                      </div>
                      <button
                        disabled={isSaving}
                        onClick={() => toggleFeature(key, !isEnabled)}
                        aria-label={`Toggle ${label}`}
                        className="text-2xl"
                      >
                        {isSaving ? (
                          <FaSpinner className="w-5 h-5 animate-spin text-azure-400" />
                        ) : isEnabled ? (
                          <FaToggleOn className="text-gold-500" />
                        ) : (
                          <FaToggleOff className="text-azure-200" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {!selectedOrg && (
        <div className="card">
          <div className="card-body text-center py-12">
            <FaCog className="w-10 h-10 text-azure-200 mx-auto mb-3" />
            <p className="text-azure-400 text-sm">Select a provider to manage their feature access</p>
          </div>
        </div>
      )}
    </div>
  );
}
