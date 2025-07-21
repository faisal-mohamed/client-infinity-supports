"use client";


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
  iconBg,
  link,
  linkText,
  color = "text-gray-700"
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  link?: string;
  linkText?: string;
  color?: string;
}) => (
  <div className="relative bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between group hover:shadow-xl transition-shadow border border-gray-100">
    <div className="flex items-center">
      <div className={`flex items-center justify-center rounded-xl ${iconBg} text-white shadow-lg w-12 h-12`}>
        {icon}
      </div>
      <div className="ml-4">
        <h2 className={`font-semibold ${color} text-base`}>{title}</h2>
        <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
    {link && linkText && (
      <div className="mt-4 pt-3 border-t border-gray-100">
        <Link href={link} className={`text-sm font-medium flex items-center ${color} hover:underline`}>
          {linkText}
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    )}
  </div>
);

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserWelcome from './user-welcome';
import { FaUsers, FaCheckCircle, FaClock, FaShieldAlt, FaFileAlt, FaEdit, FaUserPlus, FaChartBar, FaCalendarAlt, FaClipboardList } from 'react-icons/fa';
import useRequireAuth from '../../hooks/useRequireAuth';


export const DashboardClient = () => {
  const { session, status } = useRequireAuth();
  const pathname = usePathname();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/dashboard-stats');
        if (!res.ok) throw new Error('Failed to fetch dashboard stats');
        const data = await res.json();
        setStats(data);
      } catch (err : any ) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (status === 'loading' || !session) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <UserWelcome />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {loading ? (
            <div className="col-span-4 text-center py-8 text-gray-500">Loading stats...</div>
          ) : error ? (
            <div className="col-span-4 text-center py-8 text-red-500">{error}</div>
          ) : stats && (
            <>
            
              {/* Enhanced Stat Card Example */}
              <StatCard
                title="Total Clients"
                value={stats.totalClients}
                icon={<FaUsers className="h-7 w-7" />}
                iconBg="bg-gradient-to-tr from-indigo-500 to-indigo-300"
                link="/admin/clients"
                linkText="View all clients"
                color="text-indigo-700"
              />
              <StatCard
                title="Completed Forms"
                value={stats.completedForms}
                icon={<FaCheckCircle className="h-7 w-7" />}
                iconBg="bg-gradient-to-tr from-green-500 to-green-300"
             
                color="text-green-700"
              />
              <StatCard
                title="Forms Not Started"
                value={stats.notStarted}
                icon={<FaClock className="h-7 w-7" />}
                iconBg="bg-gradient-to-tr from-grey-500 to-grey-300"
         
                color="text-grey-700"
              />
              <StatCard
                title="New Clients (This Month)"
                value={stats.newClientsThisMonth}
                icon={<FaUserPlus className="h-7 w-7" />}
                iconBg="bg-gradient-to-tr from-blue-500 to-blue-300"
                color="text-blue-700"
              />
              <StatCard
                title="Forms In Progress"
                value={stats.formsInProgress}
                icon={<FaEdit className="h-7 w-7" />}
                iconBg="bg-gradient-to-tr from-yellow-500 to-yellow-300"
                color="text-yellow-700"
              />
              <StatCard
                title="Pending Signatures"
                value={stats.signatureRequests}
                icon={<FaFileAlt className="h-7 w-7" />}
                iconBg="bg-gradient-to-tr from-purple-500 to-purple-300"
                color="text-purple-700"
              />
              <StatCard
                title="Completed Signatures"
                value={stats.completedSignatures}
                icon={<FaCheckCircle className="h-7 w-7" />}
                iconBg="bg-gradient-to-tr from-green-500 to-green-300"
                color="text-green-700"
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          {/* <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-md mr-3">
                    <FaCalendarAlt className="text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                </div>
              </div>
              <div className="p-6">
                <ul className="divide-y divide-gray-100">
                  <li className="py-4 first:pt-0 last:pb-0 animate-fade-in" style={{ animationDelay: '0ms' }}>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                          <FaCheckCircle className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">John Smith completed Welcome Form</p>
                          <span className="text-xs text-gray-500">10m ago</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Form was submitted successfully</p>
                      </div>
                    </div>
                  </li>
                  <li className="py-4 first:pt-0 last:pb-0 animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <FaEdit className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">You updated Intake Form (v2.3)</p>
                          <span className="text-xs text-gray-500">1h ago</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Form template was modified</p>
                      </div>
                    </div>
                  </li>
                  <li className="py-4 first:pt-0 last:pb-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                          <FaFileAlt className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">New contract created for Sarah Johnson</p>
                          <span className="text-xs text-gray-500">3h ago</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Contract #INF-2023-056</p>
                      </div>
                    </div>
                  </li>
                  <li className="py-4 first:pt-0 last:pb-0 animate-fade-in" style={{ animationDelay: '300ms' }}>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                          <FaUserPlus className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">New client registered: Michael Brown</p>
                          <span className="text-xs text-gray-500">Yesterday</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Client #C-2023-089</p>
                      </div>
                    </div>
                  </li>
                </ul>
                <div className="mt-6 text-center">
                  <Link href="/admin/activity" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    View all activity
                    <svg className="ml-2 -mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div> */}

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            {/* <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-md mr-3">
                    <FaClipboardList className="text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <Link href="/admin/clients/create" className="flex items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition duration-150 group">
                    <div className="p-2 rounded-md bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200">
                      <FaUserPlus className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Add New Client</p>
                      <p className="text-xs text-gray-500 mt-1">Create a new client record</p>
                    </div>
                  </Link>

                  <Link href="/admin/forms/create" className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition duration-150 group">
                    <div className="p-2 rounded-md bg-green-100 text-green-600 group-hover:bg-green-200">
                      <FaFileAlt className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Create New Form</p>
                      <p className="text-xs text-gray-500 mt-1">Design a new form template</p>
                    </div>
                  </Link>

                  <Link href="/admin/reports/generate" className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition duration-150 group">
                    <div className="p-2 rounded-md bg-purple-100 text-purple-600 group-hover:bg-purple-200">
                      <FaChartBar className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Generate Report</p>
                      <p className="text-xs text-gray-500 mt-1">Create custom reports</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div> */}

            {/* Upcoming Deadlines */}
            {/* <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center">
                  <div className="bg-amber-100 p-2 rounded-md mr-3">
                    <FaClock className="text-amber-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Upcoming Deadlines</h2>
                </div>
              </div>
              <div className="p-6">
                <ul className="divide-y divide-gray-100">
                  <li className="py-3 first:pt-0 last:pb-0">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">NDIS Assessment Form</p>
                        <p className="text-xs text-gray-500">Client: Emma Wilson</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Tomorrow
                      </span>
                    </div>
                  </li>
                  <li className="py-3 first:pt-0 last:pb-0">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Support Plan Review</p>
                        <p className="text-xs text-gray-500">Client: James Taylor</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        3 days
                      </span>
                    </div>
                  </li>
                  <li className="py-3 first:pt-0 last:pb-0">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Contract Renewal</p>
                        <p className="text-xs text-gray-500">Client: Robert Davis</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Next week
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}