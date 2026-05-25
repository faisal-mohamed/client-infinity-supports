'use client';

import { useEffect, useState } from 'react';
import { FaBuilding, FaCreditCard, FaExclamationTriangle, FaChartLine, FaSpinner } from 'react-icons/fa';

interface DashboardStats {
  totalProviders: number;
  activeProviders: number;
  pendingProviders: number;
  suspendedProviders: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  complianceAlerts: number;
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/super-admin/dashboard-stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="w-6 h-6 text-azure-400 animate-spin" />
      </div>
    );
  }

  const cards = [
    {
      label: 'Active Providers',
      value: stats?.activeProviders || 0,
      total: stats?.totalProviders || 0,
      icon: FaBuilding,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Pending Onboarding',
      value: stats?.pendingProviders || 0,
      icon: FaBuilding,
      color: 'text-gold-600',
      bg: 'bg-gold-50',
    },
    {
      label: 'Active Subscriptions',
      value: stats?.activeSubscriptions || 0,
      icon: FaCreditCard,
      color: 'text-azure-600',
      bg: 'bg-azure-50',
    },
    {
      label: 'Monthly Revenue',
      value: `$${((stats?.monthlyRevenue || 0) / 100).toLocaleString()}`,
      icon: FaChartLine,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Compliance Alerts',
      value: stats?.complianceAlerts || 0,
      icon: FaExclamationTriangle,
      color: stats?.complianceAlerts ? 'text-red-600' : 'text-azure-400',
      bg: stats?.complianceAlerts ? 'bg-red-50' : 'bg-azure-50',
    },
    {
      label: 'Suspended',
      value: stats?.suspendedProviders || 0,
      icon: FaBuilding,
      color: stats?.suspendedProviders ? 'text-red-600' : 'text-azure-400',
      bg: stats?.suspendedProviders ? 'bg-red-50' : 'bg-azure-50',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azure-700">Platform Dashboard</h1>
        <p className="text-sm text-azure-400 mt-1">Overview of all providers and platform health</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card">
              <div className="card-body flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-azure-700">{card.value}</p>
                  <p className="text-xs text-azure-400">{card.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
