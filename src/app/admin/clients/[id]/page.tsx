"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEdit, FaArrowLeft, FaFileAlt } from 'react-icons/fa';
import { getClient } from '@/lib/api';

export default function ClientDetailPage({ params }) {
  const router = useRouter();
  const { id } = params;
  
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error || 'Client not found'}
        <div className="mt-4">
          <button
            onClick={() => router.back()}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">{client.name}</h1>
        </div>
        <div className="flex space-x-3">
          <Link 
            href={`/admin/clients/${id}/forms`}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center"
          >
            <FaFileAlt className="mr-2" /> Client Forms
          </Link>
          <Link 
            href={`/admin/clients/${id}/edit`}
            className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md flex items-center"
          >
            <FaEdit className="mr-2" /> Edit Client
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500">Name:</span>
                  <span className="ml-2 font-medium">{client.name}</span>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>
                  <span className="ml-2">{client.email || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Phone:</span>
                  <span className="ml-2">{client.phone || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Created:</span>
                  <span className="ml-2">{new Date(client.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {client.commonFields && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-500">NDIS Number:</span>
                    <span className="ml-2">{client.commonFields.ndis || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Date of Birth:</span>
                    <span className="ml-2">{client.commonFields.dob || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Sex:</span>
                    <span className="ml-2">{client.commonFields.sex || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Address:</span>
                    <span className="ml-2">{client.commonFields.address || client.commonFields.street || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">State:</span>
                    <span className="ml-2">{client.commonFields.state || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Postcode:</span>
                    <span className="ml-2">{client.commonFields.postCode || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Disability/Conditions:</span>
                    <p className="mt-1 text-gray-700">{client.commonFields.disability || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        {client.logs && client.logs.length > 0 ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
                {client.logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="px-6 py-4">
                      {log.metadata && typeof log.metadata === 'object' ? 
                        Object.entries(log.metadata).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium">{key}:</span> {String(value)}
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
          <div className="bg-white shadow-md rounded-lg p-6 text-gray-500">
            No recent activity found for this client.
          </div>
        )}
      </div>
    </div>
  );
}
