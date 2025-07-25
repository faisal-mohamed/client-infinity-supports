// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import UserWelcome from "./user-welcome";
// import {
//   FaUsers,
//   FaCheckCircle,
//   FaClock,
//   FaFileAlt,
//   FaEdit,
//   FaUserPlus,
// } from "react-icons/fa";
// import useRequireAuth from "../../hooks/useRequireAuth";

// type DashboardStats = {
//   totalClients: number;
//   newClientsThisMonth: number;
//   completedForms: number;
//   notStarted: number;
//   formsInProgress: number;
//   signatureRequests: number;
//   completedSignatures: number;
// };

// const StatCard = ({
//   title,
//   value,
//   icon,
//   link,
//   linkText,
//   iconGradient
// }: {
//   title: string;
//   value: number;
//   icon: React.ReactNode;
//   link?: string;
//   linkText?: string;
//   iconGradient: string;
// }) => (
//   <div className="relative rounded-2xl shadow-md p-6 flex flex-col justify-between group hover:shadow-lg transition-shadow border border-slate-200 bg-white">
//     <div className="flex items-center">
//       <div className={`flex items-center justify-center rounded-xl shadow w-12 h-12 text-white ${iconGradient}`}>
//         {icon}
//       </div>
//       <div className="ml-4">
//         <h2 className="font-semibold text-slate-700 text-base">{title}</h2>
//         <p className="text-3xl font-extrabold text-rose-500 mt-1">{value}</p>
//       </div>
//     </div>
//     {link && linkText && (
//       <div className="mt-4 pt-3 border-t border-slate-100">
//         <Link
//           href={link}
//           className="text-sm font-medium flex items-center text-slate-600 hover:text-rose-500 transition-colors"
//         >
//           {linkText}
//           <svg
//             className="ml-1 w-4 h-4"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M9 5l7 7-7 7"
//             />
//           </svg>
//         </Link>
//       </div>
//     )}
//   </div>
// );

// const SkeletonCard = () => (
//   <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200 animate-pulse">
//     <div className="flex items-center">
//       <div className="rounded-xl bg-slate-200 w-12 h-12" />
//       <div className="ml-4 flex-1">
//         <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
//         <div className="h-6 bg-slate-300 rounded w-20"></div>
//       </div>
//     </div>
//     <div className="mt-4 pt-3 border-t border-slate-100">
//       <div className="h-4 bg-slate-200 rounded w-32"></div>
//     </div>
//   </div>
// );

// export const DashboardClient = () => {
//   const { session, status } = useRequireAuth();
//   const pathname = usePathname();
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchStats() {
//       try {
//         setLoading(true);
//         const res = await fetch("/api/admin/dashboard-stats");
//         if (!res.ok) throw new Error("Failed to fetch dashboard stats");
//         const data = await res.json();
//         setStats(data);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchStats();
//   }, []);

//   if (status === "loading" || !session) return null;

//   return (
//     <div className="bg-white-50 min-h-screen">
//       <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//         <UserWelcome />
//       </div>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {error ? (
//           <div className="text-center py-8 text-red-500">{error}</div>
//         ) : loading ? (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//               {[...Array(4)].map((_, i) => (
//                 <SkeletonCard key={`skeleton-1-${i}`} />
//               ))}
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
//               {[...Array(3)].map((_, i) => (
//                 <SkeletonCard key={`skeleton-2-${i}`} />
//               ))}
//             </div>
//           </>
//         ) : stats && (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//               <StatCard
//                 title="Total Clients"
//                 value={stats.totalClients}
//                 icon={<FaUsers className="h-7 w-7" />}
//                 link="/admin/clients"
//                 linkText="View all clients"
//                 iconGradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
//               />
//               <StatCard
//                 title="Completed Forms"
//                 value={stats.completedForms}
//                 icon={<FaCheckCircle className="h-7 w-7" />}
//                 iconGradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
//               />
//               <StatCard
//                 title="Forms Not Started"
//                 value={stats.notStarted}
//                 icon={<FaClock className="h-7 w-7" />}
//                 iconGradient="bg-gradient-to-br from-slate-400 to-slate-600"
//               />
//               <StatCard
//                 title="New Clients (This Month)"
//                 value={stats.newClientsThisMonth}
//                 icon={<FaUserPlus className="h-7 w-7" />}
//                 iconGradient="bg-gradient-to-br from-sky-500 to-sky-600"
//               />
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
//               <StatCard
//                 title="Forms In Progress"
//                 value={stats.formsInProgress}
//                 icon={<FaEdit className="h-7 w-7" />}
//                 iconGradient="bg-gradient-to-br from-yellow-400 to-yellow-600"
//               />
//               <StatCard
//                 title="Pending Signatures"
//                 value={stats.signatureRequests}
//                 icon={<FaFileAlt className="h-7 w-7" />}
//                 iconGradient="bg-gradient-to-br from-amber-500 to-amber-600"
//               />
//               <StatCard
//                 title="Completed Signatures"
//                 value={stats.completedSignatures}
//                 icon={<FaCheckCircle className="h-7 w-7" />}
//                 iconGradient="bg-gradient-to-br from-rose-500 to-rose-600"
//               />
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };




"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  iconGradient
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  link?: string;
  linkText?: string;
  iconGradient: string;
}) => (
  <div className="relative rounded-2xl shadow-md p-6 flex flex-col justify-between group transition-shadow border border-slate-200 bg-white hover:border-rose-400 hover:shadow-lg">
    <div className="flex items-center">
      <div className={`flex items-center justify-center rounded-xl shadow w-12 h-12 text-white ${iconGradient}`}>
        {icon}
      </div>
      <div className="ml-4">
        <h2 className="font-semibold text-slate-700 text-base">{title}</h2>
        <p className="text-3xl font-extrabold text-rose-500 mt-1">{value}</p>
      </div>
    </div>
    {link && linkText && (
      <div className="mt-4 pt-3 border-t border-slate-100">
        <Link
          href={link}
          className="text-sm font-medium flex items-center text-slate-600 hover:text-rose-500 transition-colors"
        >
          {linkText}
          <svg
            className="ml-1 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    )}
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200 animate-pulse">
    <div className="flex items-center">
      <div className="rounded-xl bg-slate-200 w-12 h-12" />
      <div className="ml-4 flex-1">
        <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
        <div className="h-6 bg-slate-300 rounded w-20"></div>
      </div>
    </div>
    <div className="mt-4 pt-3 border-t border-slate-100">
      <div className="h-4 bg-slate-200 rounded w-32"></div>
    </div>
  </div>
);

export const DashboardClient = () => {
  const { session, status } = useRequireAuth();
  const pathname = usePathname();
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
    <div className="bg-white-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <UserWelcome />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : loading ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={`skeleton-${i}`} />
              ))}
            </div>
          </>
        ) : stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <StatCard
                title="Total Clients"
                value={stats.totalClients}
                icon={<FaUsers className="h-7 w-7" />}
                link="/admin/clients"
                linkText="View all clients"
                iconGradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
              />
              <StatCard
                title="Completed Forms"
                value={stats.completedForms}
                icon={<FaCheckCircle className="h-7 w-7" />}
                iconGradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
              />
              <StatCard
                title="Forms Not Started"
                value={stats.notStarted}
                icon={<FaClock className="h-7 w-7" />}
                iconGradient="bg-gradient-to-br from-slate-400 to-slate-600"
              />
              <StatCard
                title="New Clients (This Month)"
                value={stats.newClientsThisMonth}
                icon={<FaUserPlus className="h-7 w-7" />}
                iconGradient="bg-gradient-to-br from-sky-500 to-sky-600"
              />
              <StatCard
                title="Forms In Progress"
                value={stats.formsInProgress}
                icon={<FaEdit className="h-7 w-7" />}
                iconGradient="bg-gradient-to-br from-yellow-400 to-yellow-600"
              />
              <StatCard
                title="Pending Signatures"
                value={stats.signatureRequests}
                icon={<FaFileAlt className="h-7 w-7" />}
                iconGradient="bg-gradient-to-br from-amber-500 to-amber-600"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
