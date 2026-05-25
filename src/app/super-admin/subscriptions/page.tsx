'use client';

import { useEffect, useState, useCallback } from 'react';
import { FaCreditCard, FaPlus, FaSpinner, FaDollarSign, FaUsers, FaChartLine } from 'react-icons/fa';

interface Plan {
  id: string;
  tier: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  limits: { maxClients: number; maxStaff: number; maxAdmins: number; maxFormsPerMonth: number; storageGB: number };
  features: string[];
  isActive: boolean;
}

interface Subscription {
  id: string;
  organizationId: string;
  planTier: string;
  status: string;
  billingEmail: string;
  billingCycle: string;
  pricePerMonth: number;
  usage: { clients: number; staff: number; formsThisMonth: number };
  limits: { maxClients: number; maxStaff: number; maxFormsPerMonth: number };
  currentPeriodEnd: string;
  createdAt: string;
}

interface Stats {
  total: number;
  active: number;
  trial: number;
  pastDue: number;
  monthlyRevenue: number;
}

const STATUS_BADGES: Record<string, string> = {
  ACTIVE: 'badge badge-green',
  TRIAL: 'badge badge-blue',
  PAST_DUE: 'badge badge-red',
  CANCELLED: 'badge badge-gray',
  EXPIRED: 'badge badge-gray',
};

export default function SubscriptionsPage() {
  const [tab, setTab] = useState<'subscriptions' | 'plans'>('subscriptions');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planForm, setPlanForm] = useState({ tier: 'STARTER', name: '', priceMonthly: 0, description: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [subsRes, plansRes, statsRes] = await Promise.all([
      fetch('/api/super-admin/subscriptions?type=subscriptions'),
      fetch('/api/super-admin/subscriptions?type=plans'),
      fetch('/api/super-admin/subscriptions?type=stats'),
    ]);
    const [subsData, plansData, statsData] = await Promise.all([subsRes.json(), plansRes.json(), statsRes.json()]);
    setSubscriptions(subsData.items || []);
    setPlans(plansData || []);
    setStats(statsData);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function createNewPlan() {
    setSaving(true);
    await fetch('/api/super-admin/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'plan', ...planForm }),
    });
    setSaving(false);
    setShowPlanModal(false);
    setPlanForm({ tier: 'STARTER', name: '', priceMonthly: 0, description: '' });
    fetchData();
  }

  if (loading) return <div className="flex items-center justify-center h-64"><FaSpinner className="w-5 h-5 text-azure-400 animate-spin" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azure-700">Subscription & Billing</h1>
        <p className="text-sm text-azure-400 mt-1">Manage plans and provider subscriptions</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatCard icon={FaUsers} label="Active" value={stats.active} color="text-emerald-600" bg="bg-emerald-50" />
          <StatCard icon={FaCreditCard} label="Trial" value={stats.trial} color="text-azure-600" bg="bg-azure-50" />
          <StatCard icon={FaDollarSign} label="Revenue/mo" value={`$${(stats.monthlyRevenue / 100).toLocaleString()}`} color="text-gold-600" bg="bg-gold-50" />
          <StatCard icon={FaChartLine} label="Past Due" value={stats.pastDue} color="text-red-600" bg="bg-red-50" />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-azure-50 rounded-xl p-1 w-fit">
        <button onClick={() => setTab('subscriptions')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'subscriptions' ? 'bg-white text-azure-700 shadow-soft' : 'text-azure-400'}`}>
          Subscriptions
        </button>
        <button onClick={() => setTab('plans')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'plans' ? 'bg-white text-azure-700 shadow-soft' : 'text-azure-400'}`}>
          Plans
        </button>
      </div>

      {/* Subscriptions Tab */}
      {tab === 'subscriptions' && (
        <div className="card table-container">
          {subscriptions.length === 0 ? (
            <div className="card-body text-center py-12">
              <FaCreditCard className="w-10 h-10 text-azure-200 mx-auto mb-3" />
              <p className="text-azure-400 text-sm">No subscriptions yet</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Organization</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Billing</th>
                  <th>Usage</th>
                  <th>Period End</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((s) => (
                  <tr key={s.id}>
                    <td className="font-mono text-xs">{s.organizationId.slice(0, 12)}...</td>
                    <td><span className="text-xs font-semibold uppercase">{s.planTier}</span></td>
                    <td><span className={STATUS_BADGES[s.status] || 'badge badge-gray'}>{s.status}</span></td>
                    <td>
                      <p className="text-sm font-medium">${(s.pricePerMonth / 100).toFixed(0)}/mo</p>
                      <p className="text-xs text-azure-400">{s.billingCycle}</p>
                    </td>
                    <td className="text-xs">
                      {s.usage.clients}/{s.limits.maxClients === -1 ? '∞' : s.limits.maxClients} clients
                    </td>
                    <td className="text-xs">{new Date(s.currentPeriodEnd).toLocaleDateString('en-AU')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Plans Tab */}
      {tab === 'plans' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowPlanModal(true)} className="btn btn-gold">
              <FaPlus className="w-3.5 h-3.5 mr-2" />Create Plan
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((p) => (
              <div key={p.id} className="card">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase text-azure-400">{p.tier}</span>
                    {!p.isActive && <span className="badge badge-gray">Inactive</span>}
                  </div>
                  <h3 className="text-lg font-bold text-azure-700">{p.name}</h3>
                  <p className="text-2xl font-bold text-azure-700 mt-2">
                    ${(p.priceMonthly / 100).toFixed(0)}<span className="text-sm font-normal text-azure-400">/mo</span>
                  </p>
                  <div className="mt-4 space-y-1 text-xs text-azure-500">
                    <p>{p.limits.maxClients === -1 ? 'Unlimited' : p.limits.maxClients} clients</p>
                    <p>{p.limits.maxStaff === -1 ? 'Unlimited' : p.limits.maxStaff} staff</p>
                    <p>{p.limits.maxFormsPerMonth === -1 ? 'Unlimited' : p.limits.maxFormsPerMonth} forms/mo</p>
                    <p>{p.limits.storageGB === -1 ? 'Unlimited' : p.limits.storageGB}GB storage</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-azure-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-elevated p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-azure-700 mb-4">Create Plan</h3>
            <div className="space-y-4">
              <div className="form-field">
                <label>Tier</label>
                <select value={planForm.tier} onChange={(e) => setPlanForm((f) => ({ ...f, tier: e.target.value }))} className="filter-dropdown w-full">
                  <option value="FREE">Free</option>
                  <option value="STARTER">Starter</option>
                  <option value="PROFESSIONAL">Professional</option>
                  <option value="ENTERPRISE">Enterprise</option>
                </select>
              </div>
              <div className="form-field">
                <label>Name</label>
                <input type="text" value={planForm.name} onChange={(e) => setPlanForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g., Starter Plan" />
              </div>
              <div className="form-field">
                <label>Price (cents AUD / month)</label>
                <input type="number" value={planForm.priceMonthly} onChange={(e) => setPlanForm((f) => ({ ...f, priceMonthly: parseInt(e.target.value) || 0 }))} />
                <p className="text-xs text-azure-400 mt-1">${(planForm.priceMonthly / 100).toFixed(2)} AUD/month</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowPlanModal(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={createNewPlan} disabled={!planForm.name || saving} className="btn btn-primary">
                {saving ? <FaSpinner className="w-4 h-4 animate-spin" /> : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bg }: { icon: any; label: string; value: string | number; color: string; bg: string }) {
  return (
    <div className="card">
      <div className="card-body flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <div>
          <p className="text-lg font-bold text-azure-700">{value}</p>
          <p className="text-xs text-azure-400">{label}</p>
        </div>
      </div>
    </div>
  );
}
