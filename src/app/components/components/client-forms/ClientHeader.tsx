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
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300">
          {/* Back Button & Client Info Row - Enhanced Responsive Layout */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <Link 
                href="/admin/clients"
                className="inline-flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200 group self-start border border-gray-200 hover:border-indigo-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <FaArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-semibold">Back to Clients</span>
              </Link>
              
              <div className="hidden sm:block h-8 w-px bg-gray-300"></div>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <FaUser className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white shadow-md"></div>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{client?.name}</h1>
                  <p className="text-gray-600 text-base sm:text-lg mb-2">{client?.email}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-500">Active Client</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Progress Summary */}
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-indigo-500"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${completionPercentage}, 100`}
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">{completionPercentage}%</span>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-gray-900 mb-1">
                    {stats.completed}/{stats.total}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Forms Completed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Completed Forms */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 sm:p-6 border border-green-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500 text-white shadow-md">
                  <FaCheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
                  <div className="text-sm font-medium text-green-600">Completed</div>
                </div>
              </div>
            </div>

            {/* In Progress Forms */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 sm:p-6 border border-amber-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500 text-white shadow-md">
                  <FaClock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-700">{stats.inProgress}</div>
                  <div className="text-sm font-medium text-amber-600">In Progress</div>
                </div>
              </div>
            </div>

            {/* Not Started Forms */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-500 text-white shadow-md">
                  <FaCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-700">{stats.notStarted}</div>
                  <div className="text-sm font-medium text-gray-600">Not Started</div>
                </div>
              </div>
            </div>

            {/* Total Forms */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 sm:p-6 border border-indigo-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500 text-white shadow-md">
                  <FaChartPie className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-700">{stats.total}</div>
                  <div className="text-sm font-medium text-indigo-600">Total Forms</div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {/* <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
              <span className="text-sm font-bold text-indigo-600">{completionPercentage}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full shadow-md transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>0 forms</span>
              <span>{stats.total} forms</span>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
