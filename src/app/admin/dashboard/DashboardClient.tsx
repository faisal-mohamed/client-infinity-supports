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
  FaUserTie,
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

type StaffStats = {
  totalStaff: number;
  pendingStaff: number;
  completedForms: number;
  formsInProgress: number;
  awaitingAdmin: number;
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
  <div className="bg-white rounded-2xl border border-azure-100/60 p-5 hover:shadow-card transition-all duration-200 group">
    <div className="flex items-center gap-3.5">
      <div className={`flex items-center justify-center rounded-xl w-11 h-11 ${color}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-azure-400 truncate">{title}</p>
        <p className="text-2xl font-bold text-azure-700">{value}</p>
      </div>
    </div>
    {link && linkText && (
      <div className="mt-4 pt-3 border-t border-azure-50">
        <Link href={link} className="text-xs font-semibold text-gold-600 hover:text-gold-700 flex items-center gap-1 transition-colors group-hover:gap-2">
          {linkText}
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </Link>
      </div>
    )}
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-azure-100/60 p-5">
    <div className="flex items-center gap-3.5">
      <div className="rounded-xl bg-azure-50 w-11 h-11 animate-shimmer" />
      <div className="flex-1">
        <div className="h-3 bg-azure-50 rounded w-20 mb-2 animate-shimmer"></div>
        <div className="h-7 bg-azure-50 rounded w-14 animate-shimmer"></div>
      </div>
    </div>
  </div>
);

export const DashboardClient = () => {
  const { session, status } = useRequireAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [staffStats, setStaffStats] = useState<StaffStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'client' | 'staff'>('client');

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const [clientRes, staffRes] = await Promise.all([
          fetch("/api/admin/dashboard-stats"),
          fetch("/api/staff?page=1&pageSize=1"),
        ]);
        if (clientRes.ok) setStats(await clientRes.json());
        if (staffRes.ok) {
          const staffData = await staffRes.json();
          // Fetch staff form stats
          const totalStaff = staffData.pagination?.totalCount || 0;
          setStaffStats({
            totalStaff,
            pendingStaff: staffData.staff?.filter((s: any) => s.status === 'pending').length || 0,
            completedForms: 0,
            formsInProgress: 0,
            awaitingAdmin: 0,
          });
        }
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
      <div className="bg-white rounded-2xl border border-azure-100/60 p-6 mb-6 shadow-soft">
        <UserWelcome />
      </div>

      {/* Client/Staff Toggle */}
      <div className="flex gap-1 mb-6 bg-azure-50 rounded-xl p-1 w-fit">
        <button onClick={() => setViewType('client')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewType === 'client' ? 'bg-white text-azure-700 shadow-soft' : 'text-azure-400'}`}>
          Clients
        </button>
        <button onClick={() => setViewType('staff')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewType === 'staff' ? 'bg-white text-azure-700 shadow-soft' : 'text-azure-400'}`}>
          Staff
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        {error ? (
          <div className="text-center py-8 bg-red-50 rounded-2xl border border-red-100">
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : viewType === 'client' && stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard title="Total Clients" value={stats.totalClients} icon={<FaUsers className="h-4.5 w-4.5 text-azure-700" />} link="/admin/clients" linkText="View all clients" color="bg-azure-50" />
            <StatCard title="Completed Forms" value={stats.completedForms} icon={<FaCheckCircle className="h-4.5 w-4.5 text-emerald-600" />} color="bg-emerald-50" />
            <StatCard title="Forms Not Started" value={stats.notStarted} icon={<FaClock className="h-4.5 w-4.5 text-azure-400" />} color="bg-azure-50/50" />
            <StatCard title="New Clients (This Month)" value={stats.newClientsThisMonth} icon={<FaUserPlus className="h-4.5 w-4.5 text-gold-600" />} color="bg-gold-50" />
            <StatCard title="Forms In Progress" value={stats.formsInProgress} icon={<FaEdit className="h-4.5 w-4.5 text-gold-600" />} color="bg-gold-50" />
            <StatCard title="Pending Signatures" value={stats.signatureRequests} icon={<FaFileAlt className="h-4.5 w-4.5 text-azure-600" />} color="bg-azure-50" />
          </div>
        ) : viewType === 'staff' && staffStats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard title="Total Staff" value={staffStats.totalStaff} icon={<FaUserTie className="h-4.5 w-4.5 text-azure-700" />} link="/admin/staff" linkText="View all staff" color="bg-azure-50" />
            <StatCard title="Pending Onboarding" value={staffStats.pendingStaff} icon={<FaClock className="h-4.5 w-4.5 text-gold-600" />} color="bg-gold-50" />
            <StatCard title="Forms Completed" value={staffStats.completedForms} icon={<FaCheckCircle className="h-4.5 w-4.5 text-emerald-600" />} color="bg-emerald-50" />
            <StatCard title="Forms In Progress" value={staffStats.formsInProgress} icon={<FaEdit className="h-4.5 w-4.5 text-gold-600" />} color="bg-gold-50" />
            <StatCard title="Awaiting Admin Review" value={staffStats.awaitingAdmin} icon={<FaFileAlt className="h-4.5 w-4.5 text-azure-600" />} color="bg-azure-50" />
            <StatCard title="Staff Forms" value={11} icon={<FaFileAlt className="h-4.5 w-4.5 text-azure-600" />} link="/admin/staff-forms" linkText="View staff forms" color="bg-azure-50" />
          </div>
        ) : null}
      </div>
    </div>
  );
};
