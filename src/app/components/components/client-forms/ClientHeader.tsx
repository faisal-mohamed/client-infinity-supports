"use client";

import Link from 'next/link';
import { FaArrowLeft, FaUser, FaCheckCircle, FaClock, FaCircle, FaChartPie } from 'react-icons/fa';
import { ClientInfo } from '@/app/admin/clients/[id]/forms/types';

interface ClientHeaderProps {
  clientId: number;
  client: ClientInfo | null;
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    notStarted: number;
  };
}

export default function ClientHeader({ clientId, client, stats }: ClientHeaderProps) {
  const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8 hover:shadow-xl hover:border-rose-500 transition-shadow duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <Link 
                href="/admin/clients"
                className="inline-flex items-center gap-2 px-4 py-3 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 group self-start border border-slate-200 hover:border-rose-300 shadow-sm hover:shadow-md transform hover:scale-105"
              >
                <FaArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-semibold">Back to Clients</span>
              </Link>
              <div className="hidden sm:block h-8 w-px bg-slate-300"></div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <FaUser className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-rose-500 rounded-full border-4 border-white shadow-md"></div>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{client?.name}</h1>
                  <p className="text-slate-600 text-base sm:text-lg mb-2">{client?.email}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-500">Active Client</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-200">
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-200"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-rose-500"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${completionPercentage}, 100`}
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-slate-900">{completionPercentage}%</span>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-slate-900 mb-1">
                    {stats.completed}/{stats.total}
                  </div>
                  <div className="text-sm text-slate-600 font-medium">Forms Completed</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm hover:border-rose-500 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500 text-white shadow-md">
                  <FaCheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-rose-600">{stats.completed}</div>
                  <div className="text-sm font-medium text-slate-600">Completed</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm hover:border-rose-500 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500 text-white shadow-md">
                  <FaClock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-rose-600">{stats.inProgress}</div>
                  <div className="text-sm font-medium text-slate-600">In Progress</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm hover:border-rose-500 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-500 text-white shadow-md">
                  <FaCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-rose-600">{stats.notStarted}</div>
                  <div className="text-sm font-medium text-slate-600">Not Started</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm hover:border-rose-500 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-600 text-white shadow-md">
                  <FaChartPie className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-rose-600">{stats.total}</div>
                  <div className="text-sm font-medium text-slate-600">Total Forms</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
