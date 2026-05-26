'use client';

import { useEffect, useState } from 'react';
import { FaCreditCard, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

interface BillingData {
  organization: { id: string; name: string; status: string };
  subscription: { status: string; planTier: string; planName: string; billingCycle: string; currentPeriodEnd: string; trialEndsAt?: string } | null;
  usage: { clients: number; staff: number; admins: number; formsThisMonth: number; storageUsedGB: number };
  limits: { maxClients: number; maxStaff: number; maxAdmins: number; maxFormsPerMonth: number; storageGB: number };
}

export default function BillingPage() {
  const [data, setData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/billing')
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><FaSpinner className="w-5 h-5 text-azure-400 animate-spin" /></div>;
  if (!data?.subscription) return <div className="card"><div className="card-body text-center py-12"><FaCreditCard className="w-10 h-10 text-azure-200 mx-auto mb-3" /><p className="text-azure-400 text-sm">No subscription found. Contact support.</p></div></div>;

  const { subscription: sub, usage, limits } = data;
  const isActive = sub.status === 'ACTIVE' || sub.status === 'TRIAL';

  function formatLimit(val: number) { return val === -1 ? 'Unlimited' : val.toString(); }
  function usagePercent(used: number, max: number) { return max === -1 ? 0 : Math.min((used / max) * 100, 100); }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azure-700">Billing & Plan</h1>
        <p className="text-sm text-azure-400 mt-1">Your current subscription and usage</p>
      </div>

      {/* Plan Card */}
      <div className="card mb-6">
        <div className="card-body flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gold-50 rounded-xl flex items-center justify-center">
              <FaCreditCard className="w-5 h-5 text-gold-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-azure-700">{sub.planName}</h2>
              <p className="text-sm text-azure-400 capitalize">{sub.billingCycle} billing</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isActive ? (
              <span className="badge badge-green flex items-center gap-1"><FaCheckCircle className="w-3 h-3" />{sub.status}</span>
            ) : (
              <span className="badge badge-red flex items-center gap-1"><FaExclamationTriangle className="w-3 h-3" />{sub.status}</span>
            )}
          </div>
        </div>
        {sub.currentPeriodEnd && (
          <div className="card-footer">
            <p className="text-xs text-azure-400">
              {sub.status === 'TRIAL' ? 'Trial ends' : 'Current period ends'}: <span className="font-medium text-azure-700">{new Date(sub.currentPeriodEnd).toLocaleDateString('en-AU')}</span>
            </p>
          </div>
        )}
      </div>

      {/* Usage */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-sm font-semibold text-azure-700">Usage This Period</h3>
        </div>
        <div className="card-body space-y-5">
          <UsageBar label="Clients" used={usage.clients} max={limits.maxClients} />
          <UsageBar label="Staff" used={usage.staff} max={limits.maxStaff} />
          <UsageBar label="Admin Users" used={usage.admins} max={limits.maxAdmins} />
          <UsageBar label="Forms This Month" used={usage.formsThisMonth} max={limits.maxFormsPerMonth} />
          <UsageBar label="Storage (GB)" used={usage.storageUsedGB} max={limits.storageGB} />
        </div>
      </div>

      <p className="text-xs text-azure-400 mt-4 text-center">To upgrade your plan, contact the platform administrator.</p>
    </div>
  );
}

function UsageBar({ label, used, max }: { label: string; used: number; max: number }) {
  const percent = max === -1 ? 0 : Math.min((used / max) * 100, 100);
  const isNearLimit = max !== -1 && percent >= 80;
  const limitText = max === -1 ? 'Unlimited' : max.toString();

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-azure-600 font-medium">{label}</span>
        <span className={`font-semibold ${isNearLimit ? 'text-red-600' : 'text-azure-700'}`}>{used} / {limitText}</span>
      </div>
      {max !== -1 && (
        <div className="w-full h-2 bg-azure-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${isNearLimit ? 'bg-red-500' : 'bg-gold-500'}`} style={{ width: `${percent}%` }} />
        </div>
      )}
    </div>
  );
}
