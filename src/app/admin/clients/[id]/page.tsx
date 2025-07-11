'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FaEdit, FaArrowLeft, FaFileAlt, FaUser, FaIdCard,
  FaCalendarAlt, FaMapMarkerAlt, FaHistory, FaEnvelope,
  FaPhone, FaVenusMars, FaGlobe, FaClipboardList
} from 'react-icons/fa';
import { getClient } from '@/lib/api';

export default function ClientDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id || typeof id !== 'string' || isNaN(Number(id))) {
      setError('Invalid client ID');
      setLoading(false);
      return;
    }

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


  useEffect(() => {
    console.log(client, id);
  }, [client])

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            {/* Header Skeleton */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
                <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-8 bg-gray-300 rounded w-48"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
            
            {/* Cards Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Activity Skeleton */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Loading Message */}
          <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm mx-4">
              <div className="w-16 h-16 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Client Details</h3>
              <p className="text-gray-600">Please wait while we fetch the information...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md mx-4 border border-red-200">
              <div className="p-6 rounded-full bg-red-100 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <FaUser className="h-12 w-12 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-red-800 mb-3">Client Not Found</h1>
              <p className="text-red-600 mb-6 leading-relaxed">{error}</p>
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
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
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <button
                onClick={() => router.back()}
                className="p-3 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-600 hover:from-indigo-200 hover:to-indigo-300 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <FaArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-20 w-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold text-white">
                      {client?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-md"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{client?.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span className="font-medium">ID: {client.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="h-3 w-3 text-gray-400" />
                      <span>Created: {new Date(client?.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/admin/clients/${id}/forms`}
                className="flex items-center gap-2 text-sm text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all duration-200 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                <FaFileAlt className="h-4 w-4" /> 
                Client Forms
              </Link>
              {/* <Link
                href={`/admin/clients/${id}/edit`}
                className="flex items-center gap-2 text-sm text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 transition-all duration-200 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                <FaEdit className="h-4 w-4" /> 
                Edit Client
              </Link> */}
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Enhanced Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
                  <FaUser className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                      <FaUser className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-500 mb-1">Full Name</p>
                      <p className="font-bold text-gray-900 text-lg">{client?.name}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                      <FaEnvelope className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-500 mb-1">Email Address</p>
                      <p className="font-semibold text-gray-900">{client?.email || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-green-100 text-green-600">
                      <FaPhone className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-500 mb-1">Phone Number</p>
                      <p className="font-semibold text-gray-900">{client?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                      <FaCalendarAlt className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-500 mb-1">Account Created</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(client?.createdAt).toLocaleDateString('en-US', {
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
          </div>

          {/* Enhanced Personal Details */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="px-8 py-6 bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md">
                  <FaIdCard className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Personal Details</h2>
              </div>
            </div>
            <div className="p-8">
              {client.commonFields ? (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-green-100 text-green-600">
                        <FaIdCard className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-500 mb-1">NDIS Number</p>
                        <p className="font-bold text-gray-900">{client?.commonFields[0].ndis || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                        <FaCalendarAlt className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-500 mb-1">Date of Birth</p>
                        <p className="font-bold text-gray-900">{client?.commonFields[0].dob || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                        <FaVenusMars className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-500 mb-1">Gender</p>
                        <p className="font-bold text-gray-900">{client?.commonFields[0].sex || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="p-6 rounded-full bg-gray-100 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <FaIdCard className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Personal Details</h3>
                  <p className="text-gray-500">Personal information has not been provided yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Address Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="px-8 py-6 bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md">
                  <FaMapMarkerAlt className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Address Information</h2>
              </div>
            </div>
            <div className="p-8">
              {client?.commonFields ? (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                        <FaMapMarkerAlt className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-500 mb-1">Street Address</p>
                        <p className="font-bold text-gray-900">
                          {client.commonFields[0].address || client.commonFields[0].street || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                        <FaGlobe className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-500 mb-1">State</p>
                        <p className="font-bold text-gray-900">{client.commonFields[0].state || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-green-100 text-green-600">
                        <FaMapMarkerAlt className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-500 mb-1">Postcode</p>
                        <p className="font-bold text-gray-900">{client.commonFields[0].postCode || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="p-6 rounded-full bg-gray-100 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <FaMapMarkerAlt className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Address Information</h3>
                  <p className="text-gray-500">Address details have not been provided yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Disability/Conditions */}
        {client.commonFields && client.commonFields[0]?.disability && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8 hover:shadow-xl transition-shadow duration-300">
            <div className="px-8 py-6 bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md">
                  <FaClipboardList className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Disability & Conditions</h2>
              </div>
            </div>
            <div className="p-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base">
                  {client.commonFields[0].disability}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Recent Activity Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="px-8 py-6 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-200">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md">
                <FaHistory className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <p className="text-sm text-gray-600 mt-1">Track all client interactions and form activities</p>
              </div>
            </div>
          </div>

          {client.logs && client.logs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {client.logs.map((log: any, index: any) => (
                    <tr
                      key={log.id}
                      className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200"
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animation: 'fadeInUp 0.6s ease-out forwards'
                      }}
                    >
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {new Date(log.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(log.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-sm">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm text-gray-700">
                          {log.metadata && typeof log.metadata === 'object' ?
                            Object.entries(log.metadata).map(([key, value]) => (
                              <div key={key} className="mb-2 last:mb-0">
                                <span className="font-semibold text-gray-900 capitalize">{key.replace('_', ' ')}:</span>{' '}
                                <span className="text-gray-700">{String(value)}</span>
                              </div>
                            ))
                            : log.metadata || (
                              <span className="text-gray-400 italic">No additional details</span>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="p-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                <FaHistory className="text-gray-400 text-4xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No Activity Yet</h3>
              <p className="text-gray-500 font-medium mb-2">This client hasn't interacted with any forms yet.</p>
              <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
                Activity will appear here when the client fills out forms, signs documents, or when admins make changes to their account.
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </div>
  );
}
