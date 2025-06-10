// "use client";

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { FaEdit, FaArrowLeft, FaFileAlt } from 'react-icons/fa';
// import { getClient } from '@/lib/api';

// export default function ClientDetailPage({ params }) {
//   const router = useRouter();
//   const { id } = params;
  
//   const [client, setClient] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const loadClient = async () => {
//       try {
//         setLoading(true);
//         const data = await getClient(parseInt(id));
//         setClient(data);
//         setError('');
//       } catch (err) {
//         setError('Failed to load client details');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadClient();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error || !client) {
//     return (
//       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//         {error || 'Client not found'}
//         <div className="mt-4">
//           <button
//             onClick={() => router.back()}
//             className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center">
//           <button
//             onClick={() => router.back()}
//             className="mr-4 text-gray-600 hover:text-gray-900"
//           >
//             <FaArrowLeft size={20} />
//           </button>
//           <h1 className="text-2xl font-bold">{client.name}</h1>
//         </div>
//         <div className="flex space-x-3">
//           <Link 
//             href={`/admin/clients/${id}/forms`}
//             className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center"
//           >
//             <FaFileAlt className="mr-2" /> Client Forms
//           </Link>
//           <Link 
//             href={`/admin/clients/${id}/edit`}
//             className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md flex items-center"
//           >
//             <FaEdit className="mr-2" /> Edit Client
//           </Link>
//         </div>
//       </div>

//       <div className="bg-white shadow-md rounded-lg overflow-hidden">
//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
//               <div className="space-y-3">
//                 <div>
//                   <span className="text-gray-500">Name:</span>
//                   <span className="ml-2 font-medium">{client.name}</span>
//                 </div>
//                 <div>
//                   <span className="text-gray-500">Email:</span>
//                   <span className="ml-2">{client.email || 'Not provided'}</span>
//                 </div>
//                 <div>
//                   <span className="text-gray-500">Phone:</span>
//                   <span className="ml-2">{client.phone || 'Not provided'}</span>
//                 </div>
//                 <div>
//                   <span className="text-gray-500">Created:</span>
//                   <span className="ml-2">{new Date(client.createdAt).toLocaleDateString()}</span>
//                 </div>
//               </div>
//             </div>

//             {client.commonFields && (
//               <div>
//                 <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
//                 <div className="space-y-3">
//                   <div>
//                     <span className="text-gray-500">NDIS Number:</span>
//                     <span className="ml-2">{client.commonFields.ndis || 'Not provided'}</span>
//                   </div>
//                   <div>
//                     <span className="text-gray-500">Date of Birth:</span>
//                     <span className="ml-2">{client.commonFields.dob || 'Not provided'}</span>
//                   </div>
//                   <div>
//                     <span className="text-gray-500">Sex:</span>
//                     <span className="ml-2">{client.commonFields.sex || 'Not provided'}</span>
//                   </div>
//                   <div>
//                     <span className="text-gray-500">Address:</span>
//                     <span className="ml-2">{client.commonFields.address || client.commonFields.street || 'Not provided'}</span>
//                   </div>
//                   <div>
//                     <span className="text-gray-500">State:</span>
//                     <span className="ml-2">{client.commonFields.state || 'Not provided'}</span>
//                   </div>
//                   <div>
//                     <span className="text-gray-500">Postcode:</span>
//                     <span className="ml-2">{client.commonFields.postCode || 'Not provided'}</span>
//                   </div>
//                   <div>
//                     <span className="text-gray-500">Disability/Conditions:</span>
//                     <p className="mt-1 text-gray-700">{client.commonFields.disability || 'Not provided'}</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Recent Activity Section */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
//         {client.logs && client.logs.length > 0 ? (
//           <div className="bg-white shadow-md rounded-lg overflow-hidden">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Action
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Details
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {client.logs.map((log) => (
//                   <tr key={log.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {new Date(log.createdAt).toLocaleString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {log.action}
//                     </td>
//                     <td className="px-6 py-4">
//                       {log.metadata && typeof log.metadata === 'object' ? 
//                         Object.entries(log.metadata).map(([key, value]) => (
//                           <div key={key}>
//                             <span className="font-medium">{key}:</span> {String(value)}
//                           </div>
//                         ))
//                         : log.metadata || '-'}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="bg-white shadow-md rounded-lg p-6 text-gray-500">
//             No recent activity found for this client.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEdit, FaArrowLeft, FaFileAlt, FaUser, FaIdCard, FaCalendarAlt, FaMapMarkerAlt, FaHistory, FaEnvelope, FaPhone, FaVenusMars, FaGlobe, FaClipboardList } from 'react-icons/fa';
import { getClient } from '@/lib/api';

export default function ClientDetailPage({ params } : any) {
  const router = useRouter();
  const { id } = params;

  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);
  const [error, setError] = useState<any>('');

  useEffect(() => {
    const loadClient = async () => {
      try {
        setLoading(true);
        const data = await getClient(parseInt(id));
        setClient(data);
        setError('');
      } catch (err) {
        setError('Failed to load client details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadClient();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin mx-auto"></div>
              <p className="mt-6 text-gray-600 font-medium">Loading client details...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
              <div className="flex justify-center mb-6">
                <div className="bg-red-100 rounded-full p-3">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Error</h1>
              <p className="text-red-600 mb-6 text-center">{error || 'Client not found'}</p>
              <button
                onClick={() => router.back()}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition text-center font-medium shadow-sm"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition"
              >
                <FaArrowLeft />
              </button>
              <div className="flex items-center">
                <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl font-bold text-indigo-600">
                    {client.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Client ID: {client.id} • Created: {new Date(client.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              <Link
                href={`/admin/clients/${id}/forms`}
                className="flex items-center text-sm text-white bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-lg shadow-sm"
              >
                <FaFileAlt className="mr-2" /> Client Forms
              </Link>
              <Link
                href={`/admin/clients/${id}/edit`}
                className="flex items-center text-sm text-white bg-amber-600 hover:bg-amber-700 transition px-4 py-2 rounded-lg shadow-sm"
              >
                <FaEdit className="mr-2" /> Edit Client
              </Link>
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-blue-50">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-md mr-3">
                  <FaUser className="text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 text-gray-400">
                    <FaUser />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{client.name}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 text-gray-400">
                    <FaEnvelope />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{client.email || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 text-gray-400">
                    <FaPhone />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{client.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 text-gray-400">
                    <FaCalendarAlt />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium text-gray-900">
                      {new Date(client.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-green-50">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-md mr-3">
                  <FaIdCard className="text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Personal Details</h2>
              </div>
            </div>
            <div className="p-6">
              {client.commonFields ? (
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 text-gray-400">
                      <FaIdCard />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">NDIS Number</p>
                      <p className="font-medium text-gray-900">{client.commonFields.ndis || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 text-gray-400">
                      <FaCalendarAlt />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium text-gray-900">{client.commonFields.dob || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 text-gray-400">
                      <FaVenusMars />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Sex</p>
                      <p className="font-medium text-gray-900">{client.commonFields.sex || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <FaIdCard className="mx-auto text-gray-300 text-3xl mb-2" />
                  <p>No personal details available</p>
                </div>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-amber-50">
              <div className="flex items-center">
                <div className="bg-amber-100 p-2 rounded-md mr-3">
                  <FaMapMarkerAlt className="text-amber-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Address Information</h2>
              </div>
            </div>
            <div className="p-6">
              {client.commonFields ? (
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 text-gray-400">
                      <FaMapMarkerAlt />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Street Address</p>
                      <p className="font-medium text-gray-900">
                        {client.commonFields.address || client.commonFields.street || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 text-gray-400">
                      <FaGlobe />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">State</p>
                      <p className="font-medium text-gray-900">{client.commonFields.state || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 text-gray-400">
                      <FaMapMarkerAlt />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Postcode</p>
                      <p className="font-medium text-gray-900">{client.commonFields.postCode || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <FaMapMarkerAlt className="mx-auto text-gray-300 text-3xl mb-2" />
                  <p>No address information available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Disability/Conditions */}
        {client.commonFields && client.commonFields.disability && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-md mr-3">
                  <FaClipboardList className="text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Disability/Conditions</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 whitespace-pre-line">{client.commonFields.disability}</p>
            </div>
          </div>
        )}

        {/* Recent Activity Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-2 rounded-md mr-3">
                <FaHistory className="text-indigo-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
          </div>

          {client.logs && client.logs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {client.logs.map((log : any, index : any) => (
                    <tr
                      key={log.id}
                      className="hover:bg-indigo-50 transition"
                      style={{
                        animationDelay: `${index * 30}ms`,
                        animation: 'fadeIn 0.5s ease-in-out forwards'
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {log.metadata && typeof log.metadata === 'object' ?
                          Object.entries(log.metadata).map(([key, value]) => (
                            <div key={key} className="mb-1">
                              <span className="font-medium text-gray-700">{key}:</span> {String(value)}
                            </div>
                          ))
                          : log.metadata || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="bg-gray-100 rounded-full p-4 inline-block mb-4">
                <FaHistory className="text-gray-400 text-2xl" />
              </div>
              <p className="text-gray-500 font-medium">No recent activity found for this client.</p>
              <p className="text-sm text-gray-400 mt-2">Activity will appear here when the client interacts with forms.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
