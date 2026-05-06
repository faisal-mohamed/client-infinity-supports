"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import UserWelcome from "./user-welcome";
import {
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaFileAlt,
  FaEdit,
  FaUserPlus,
} from "react-icons/fa";
import useRequireAuth from "../../hooks/useRequireAuth";

type DashboardStats = {
  totalClients: number;
  newClientsThisMonth: number;
  completedForms: number;
  notStarted: number;
  formsInProgress: number;
  signatureRequests: number;
  completedSignatures: number;
};

const StatCard = ({
  title,
  value,
  icon,
  link,
  linkText,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  link?: string;
  linkText?: string;
  color: string;
}) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-card transition-shadow">
    <div className="flex items-center gap-3">
      <div className={`flex items-center justify-center rounded-lg w-10 h-10 ${color}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 truncate">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
    {link && linkText && (
      <div className="mt-3 pt-3 border-t border-gray-100">
        <Link
          href={link}
          className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
        >
          {linkText}
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    )}
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="rounded-lg bg-gray-100 w-10 h-10" />
      <div className="flex-1">
        <div className="h-3 bg-gray-100 rounded w-20 mb-2"></div>
        <div className="h-6 bg-gray-100 rounded w-12"></div>
      </div>
    </div>
  </div>
);

export const DashboardClient = () => {
  const { session, status } = useRequireAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/dashboard-stats");
        if (!res.ok) throw new Error("Failed to fetch dashboard stats");
        const data = await res.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (status === "loading" || !session) return null;

  return (
    <div>
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <UserWelcome />
      </div>
      <div className="max-w-7xl mx-auto">
        {error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              title="Total Clients"
              value={stats.totalClients}
              icon={<FaUsers className="h-4 w-4 text-blue-600" />}
              link="/admin/clients"
              linkText="View all clients"
              color="bg-blue-50"
            />
            <StatCard
              title="Completed Forms"
              value={stats.completedForms}
              icon={<FaCheckCircle className="h-4 w-4 text-emerald-600" />}
              color="bg-emerald-50"
            />
            <StatCard
              title="Forms Not Started"
              value={stats.notStarted}
              icon={<FaClock className="h-4 w-4 text-gray-500" />}
              color="bg-gray-100"
            />
            <StatCard
              title="New Clients (This Month)"
              value={stats.newClientsThisMonth}
              icon={<FaUserPlus className="h-4 w-4 text-sky-600" />}
              color="bg-sky-50"
            />
            <StatCard
              title="Forms In Progress"
              value={stats.formsInProgress}
              icon={<FaEdit className="h-4 w-4 text-amber-600" />}
              color="bg-amber-50"
            />
            <StatCard
              title="Pending Signatures"
              value={stats.signatureRequests}
              icon={<FaFileAlt className="h-4 w-4 text-orange-600" />}
              color="bg-orange-50"
            />
          </div>
        )}
      </div>
    </div>
  );
};
