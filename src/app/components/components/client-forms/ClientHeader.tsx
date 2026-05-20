// "use client";

// import Link from 'next/link';
// import { FaArrowLeft, FaUser, FaCheckCircle, FaClock, FaCircle, FaChartPie } from 'react-icons/fa';
// import { ClientInfo } from '@/app/admin/clients/[id]/forms/types';

// interface ClientHeaderProps {
//   clientId: string | number;
//   client: ClientInfo | null;
//   stats: {
//     total: number;
//     completed: number;
//     inProgress: number;
//     notStarted: number;
//   };
// }

// export default function ClientHeader({ clientId, client, stats }: ClientHeaderProps) {
//   const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

//   return (
//     <div className="mb-6">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-white rounded-2xl border border-azure-100/60 p-5 shadow-soft">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
//             <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
//               <Link 
//                 href="/admin/clients"
//                 className="inline-flex items-center gap-2 px-4 py-3 text-azure-500 hover:text-gold-600 hover:bg-gold-50 rounded-xl transition-all duration-200 group self-start border border-azure-100 hover:border-gold-300 shadow-soft"
//               >
//                 <FaArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
//                 <span className="font-semibold">Back to Clients</span>
//               </Link>
//               <div className="hidden sm:block h-8 w-px bg-azure-200"></div>
//               <div className="flex items-center gap-4">
//                 <div className="relative">
//                   <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
//                     <FaUser className="h-8 w-8 text-white" />
//                   </div>
//                   <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gold-500 rounded-full border-4 border-white shadow-soft"></div>
//                 </div>
//                 <div className="min-w-0 flex-1">
//                   <h1 className="text-2xl sm:text-xl font-bold text-azure-800 mb-1">{client?.name}</h1>
//                   <p className="text-azure-500 text-base sm:text-lg mb-2">{client?.email}</p>
//                   <div className="flex items-center gap-2">
//                     <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
//                     <span className="text-sm font-medium text-azure-400">Active Client</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="flex-shrink-0">
//               <div className="bg-azure-50 rounded-xl p-4 border border-azure-100">
//                 <div className="text-center">
//                   <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
//                     <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
//                       <path
//                         className="text-azure-200"
//                         stroke="currentColor"
//                         strokeWidth="3"
//                         fill="none"
//                         d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                       />
//                       <path
//                         className="text-gold-500"
//                         stroke="currentColor"
//                         strokeWidth="3"
//                         strokeDasharray={`${completionPercentage}, 100`}
//                         strokeLinecap="round"
//                         fill="none"
//                         d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                       />
//                     </svg>
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <span className="text-2xl font-bold text-azure-800">{completionPercentage}%</span>
//                     </div>
//                   </div>
//                   <div className="text-lg font-bold text-azure-800 mb-1">
//                     {stats.completed}/{stats.total}
//                   </div>
//                   <div className="text-sm text-azure-500 font-medium">Forms Completed</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//             <div className="bg-white rounded-xl p-4 sm:p-6 border border-azure-100 shadow-soft hover:border-azure-200 transition-all duration-200">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 rounded-lg bg-green-500 text-white shadow-soft">
//                   <FaCheckCircle className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <div className="text-2xl font-bold text-gold-600">{stats.completed}</div>
//                   <div className="text-sm font-medium text-azure-500">Completed</div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl p-4 sm:p-6 border border-azure-100 shadow-soft hover:border-azure-200 transition-all duration-200">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 rounded-lg bg-amber-500 text-white shadow-soft">
//                   <FaClock className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <div className="text-2xl font-bold text-gold-600">{stats.inProgress}</div>
//                   <div className="text-sm font-medium text-azure-500">In Progress</div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl p-4 sm:p-6 border border-azure-100 shadow-soft hover:border-azure-200 transition-all duration-200">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 rounded-lg bg-azure-500 text-white shadow-soft">
//                   <FaCircle className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <div className="text-2xl font-bold text-gold-600">{stats.notStarted}</div>
//                   <div className="text-sm font-medium text-azure-500">Not Started</div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl p-4 sm:p-6 border border-azure-100 shadow-soft hover:border-azure-200 transition-all duration-200">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 rounded-lg bg-azure-500 text-white shadow-soft">
//                   <FaChartPie className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <div className="text-2xl font-bold text-gold-600">{stats.total}</div>
//                   <div className="text-sm font-medium text-azure-500">Total Forms</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import Link from 'next/link';
import {
  FaArrowLeft,
  FaUser,
  FaCheckCircle,
  FaClock,
  FaCircle,
  FaChartPie,
} from 'react-icons/fa';
import { ClientInfo } from '@/app/admin/clients/[id]/forms/types';

interface ClientHeaderProps {
  clientId: string | number;
  client: ClientInfo | null;
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    notStarted: number;
  };
}

export default function ClientHeader({ clientId, client, stats }: ClientHeaderProps) {
  const completionPercentage =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white rounded-2xl border border-azure-100/60 p-5 shadow-soft">
          {/* Main Header Section */}
          <div className="flex flex-col gap-6 md:gap-8 lg:flex-row lg:items-center lg:justify-between mb-6">
            {/* Back + Client Info */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <Link
                href="/admin/clients"
                className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 text-azure-500 hover:text-gold-600 hover:bg-gold-50 rounded-xl transition-all duration-200 group self-start border border-azure-100 hover:border-gold-300 shadow-soft text-sm sm:text-base"
              >
                <FaArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-semibold">Back to Clients</span>
              </Link>

              <div className="hidden sm:block h-8 w-px bg-azure-200"></div>

              <div className="flex gap-4 items-center">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-azure-700 rounded-xl flex items-center justify-center shadow-soft">
                    <FaUser className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gold-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl font-bold text-azure-700 mb-1 truncate">
                    {client?.name}
                  </h1>
                  <p className="text-azure-500 text-sm sm:text-base truncate">
                    {client?.email}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-medium text-azure-400">
                      Active Client
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Completion Circle */}
            <div className="self-start sm:self-auto">
              <div className="bg-azure-50 rounded-xl p-4 border border-azure-100 w-full sm:w-auto">
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-4">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-azure-200"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-gold-500"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${completionPercentage}, 100`}
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl sm:text-2xl font-bold text-azure-800">
                        {completionPercentage}%
                      </span>
                    </div>
                  </div>
                  <div className="text-sm sm:text-lg font-bold text-azure-800 mb-1">
                    {stats.completed}/{stats.total}
                  </div>
                  <div className="text-xs sm:text-sm text-azure-500 font-medium">
                    Forms Completed
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          {/* Stats Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
  {[
    {
      icon: <FaCheckCircle className="h-5 w-5" />,
      count: stats.completed,
      label: 'Completed',
      bg: 'bg-green-500',
    },
    {
      icon: <FaClock className="h-5 w-5" />,
      count: stats.inProgress,
      label: 'In Progress',
      bg: 'bg-amber-500',
    },
    {
      icon: <FaCircle className="h-5 w-5" />,
      count: stats.notStarted,
      label: 'Not Started',
      bg: 'bg-azure-500',
    },
    {
      icon: <FaChartPie className="h-5 w-5" />,
      count: stats.total,
      label: 'Total Forms',
      bg: 'bg-azure-500',
    },
  ].map((stat, index) => (
    <div
      key={index}
      className="bg-white rounded-xl p-4 sm:p-6 border border-azure-100 shadow-soft hover:border-azure-200 transition-all duration-200"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${stat.bg} text-white shadow-soft`}>
          {stat.icon}
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold text-gold-600">
            {stat.count}
          </div>
          <div className="text-xs sm:text-sm font-medium text-azure-500">
            {stat.label}
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

        </div>
      </div>
    </div>
  );
}
