"use client";

import Link from 'next/link';
import { FaArrowLeft, FaUser } from 'react-icons/fa';
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
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button & Client Info Row - Responsive Layout */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <Link 
              href="/admin/clients"
              className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 group self-start"
            >
              <FaArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Back to Clients</span>
            </Link>
            
            <div className="hidden sm:block h-8 w-px bg-gray-300"></div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <FaUser className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{client?.name}</h1>
                <p className="text-gray-600 text-sm sm:text-base truncate">{client?.email}</p>
              </div>
            </div>
          </div>
          
          <div className="text-center sm:text-right flex-shrink-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {stats.completed}/{stats.total}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Forms Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
