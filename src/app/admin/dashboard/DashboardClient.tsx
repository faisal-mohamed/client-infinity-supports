// "use client";

// import React from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import UserWelcome from './user-welcome';

// export default function DashboardClient() {
//   const pathname = usePathname();
  
//   return (
//     <div>
//       <UserWelcome />

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//               </svg>
//             </div>
//             <div className="ml-4">
//               <h2 className="font-semibold text-gray-600">Total Clients</h2>
//               <p className="text-2xl font-bold text-gray-900">24</p>
//             </div>
//           </div>
//           <div className="mt-4">
//             <Link href="/admin/clients" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
//               View all clients →
//             </Link>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-green-100 text-green-600">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <div className="ml-4">
//               <h2 className="font-semibold text-gray-600">Completed Forms</h2>
//               <p className="text-2xl font-bold text-gray-900">18</p>
//             </div>
//           </div>
//           <div className="mt-4">
//             <Link href="/admin/forms?status=completed" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
//               View completed forms →
//             </Link>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <div className="ml-4">
//               <h2 className="font-semibold text-gray-600">Pending Forms</h2>
//               <p className="text-2xl font-bold text-gray-900">7</p>
//             </div>
//           </div>
//           <div className="mt-4">
//             <Link href="/admin/forms?status=pending" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
//               View pending forms →
//             </Link>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-purple-100 text-purple-600">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//               </svg>
//             </div>
//             <div className="ml-4">
//               <h2 className="font-semibold text-gray-600">Active Contracts</h2>
//               <p className="text-2xl font-bold text-gray-900">15</p>
//             </div>
//           </div>
//           <div className="mt-4">
//             <Link href="/admin/contracts" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
//               View all contracts →
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Recent Activity */}
//       <div className="bg-white rounded-lg shadow mb-8">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
//         </div>
//         <div className="p-6">
//           <ul className="divide-y divide-gray-200">
//             <li className="py-4">
//               <div className="flex items-start">
//                 <div className="flex-shrink-0">
//                   <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                   </div>
//                 </div>
//                 <div className="ml-4">
//                   <p className="text-sm font-medium text-gray-900">John Smith completed Welcome Form</p>
//                   <p className="text-sm text-gray-500">10 minutes ago</p>
//                 </div>
//               </div>
//             </li>
//             <li className="py-4">
//               <div className="flex items-start">
//                 <div className="flex-shrink-0">
//                   <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
//                     </svg>
//                   </div>
//                 </div>
//                 <div className="ml-4">
//                   <p className="text-sm font-medium text-gray-900">You updated Intake Form (v2.3)</p>
//                   <p className="text-sm text-gray-500">1 hour ago</p>
//                 </div>
//               </div>
//             </li>
//             <li className="py-4">
//               <div className="flex items-start">
//                 <div className="flex-shrink-0">
//                   <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                     </svg>
//                   </div>
//                 </div>
//                 <div className="ml-4">
//                   <p className="text-sm font-medium text-gray-900">New contract created for Sarah Johnson</p>
//                   <p className="text-sm text-gray-500">3 hours ago</p>
//                 </div>
//               </div>
//             </li>
//             <li className="py-4">
//               <div className="flex items-start">
//                 <div className="flex-shrink-0">
//                   <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
//                     </svg>
//                   </div>
//                 </div>
//                 <div className="ml-4">
//                   <p className="text-sm font-medium text-gray-900">New client registered: Michael Brown</p>
//                   <p className="text-sm text-gray-500">Yesterday at 2:30 PM</p>
//                 </div>
//               </div>
//             </li>
//           </ul>
//           <div className="mt-4 text-center">
//             <Link href="/admin/activity" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
//               View all activity →
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="bg-white rounded-lg shadow">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
//         </div>
//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Link href="/admin/clients/create" className="flex items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition duration-150">
//               <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
//                 </svg>
//               </div>
//               <div className="ml-4">
//                 <p className="font-medium text-gray-900">Add New Client</p>
//               </div>
//             </Link>
            
//             <Link href="/admin/forms/create" className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition duration-150">
//               <div className="p-2 rounded-full bg-green-100 text-green-600">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//               </div>
//               <div className="ml-4">
//                 <p className="font-medium text-gray-900">Create New Form</p>
//               </div>
//             </Link>
            
//             <Link href="/admin/reports/generate" className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition duration-150">
//               <div className="p-2 rounded-full bg-purple-100 text-purple-600">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//               </div>
//               <div className="ml-4">
//                 <p className="font-medium text-gray-900">Generate Report</p>
//               </div>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserWelcome from './user-welcome';
import { FaUsers, FaCheckCircle, FaClock, FaShieldAlt, FaFileAlt, FaEdit, FaUserPlus, FaChartBar, FaCalendarAlt, FaClipboardList } from 'react-icons/fa';

export default function DashboardClient() {
  const pathname = usePathname();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <UserWelcome />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600">
                <FaUsers className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h2 className="font-medium text-gray-500 text-sm">Total Clients</h2>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <Link href="/admin/clients" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                View all clients
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 text-green-600">
                <FaCheckCircle className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h2 className="font-medium text-gray-500 text-sm">Completed Forms</h2>
                <p className="text-2xl font-bold text-gray-900">18</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <Link href="/admin/forms?status=completed" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                View completed forms
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
                <FaClock className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h2 className="font-medium text-gray-500 text-sm">Pending Forms</h2>
                <p className="text-2xl font-bold text-gray-900">7</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <Link href="/admin/forms?status=pending" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                View pending forms
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                <FaShieldAlt className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h2 className="font-medium text-gray-500 text-sm">Active Contracts</h2>
                <p className="text-2xl font-bold text-gray-900">15</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <Link href="/admin/contracts" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                View all contracts
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
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
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
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
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
            </div>
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