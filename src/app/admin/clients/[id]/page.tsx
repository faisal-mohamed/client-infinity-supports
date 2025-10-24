'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FaArrowLeft, FaFileAlt, FaUser, FaIdCard, FaCalendarAlt, 
  FaMapMarkerAlt, FaEnvelope, FaPhone, FaVenusMars, 
  FaClipboardList, FaEdit
} from 'react-icons/fa';
import { getClient } from '@/lib/api';

// Simple info display component - no truncation, just clean single line
function InfoDisplay({ 
  icon: Icon, 
  title, 
  value, 
  color = 'blue' 
}: {
  icon: any;
  title: string;
  value: string;
  color?: 'blue' | 'green' | 'purple' | 'amber' | 'rose' | 'indigo';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-100',
    green: 'bg-green-50 border-green-100',
    purple: 'bg-purple-50 border-purple-100',
    amber: 'bg-amber-50 border-amber-100',
    rose: 'bg-rose-50 border-rose-100',
    indigo: 'bg-indigo-50 border-indigo-100'
  };

  const iconColors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    amber: 'text-amber-600',
    rose: 'text-rose-600',
    indigo: 'text-indigo-600'
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center gap-3 mb-1">
        <Icon className={`h-4 w-4 ${iconColors[color]} flex-shrink-0`} />
        <p className="text-xs font-medium text-gray-500">{title}</p>
      </div>
      <p
        className="text-sm font-semibold text-gray-900 break-words"
        title={value || 'Not provided'}
      >
        {value || 'Not provided'}
      </p>
    </div>
  );
}

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-rose-500 border-rose-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading client details...</p>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center max-w-md w-full">
          <FaUser className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-red-800 mb-2">Client Not Found</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const fullName = client?.commonFields?.name && client?.commonFields?.surname 
    ? `${client.commonFields.name} ${client.commonFields.surname}`.trim()
    : client?.name || 'Unknown Client';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8 hover:shadow-xl hover:border-rose-300 transition-shadow duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <button
                onClick={() => router.back()}
                className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                aria-label="Go back"
              >
                <FaArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-20 w-20 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold text-white">
                      {client?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-md"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 break-words leading-tight">
                    {client?.commonFields?.name && client?.commonFields?.surname 
                      ? `${client.commonFields.name} ${client.commonFields.surname}`.trim()
                      : client?.name || 'Unknown Client'
                    }
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
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
                className="flex items-center gap-2 text-sm text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 transition-all duration-200 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                <FaFileAlt className="h-4 w-4" /> 
                Client Forms
              </Link>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b bg-blue-50">
              <div className="flex items-center gap-3">
                <FaUser className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold text-gray-900">Basic Information</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <InfoDisplay
                icon={FaUser}
                title="Full Name"
                value={fullName}
                color="blue"
              />
              <InfoDisplay
                icon={FaEnvelope}
                title="Email Address"
                value={client?.commonFields?.email || client?.email || ''}
                color="indigo"
              />
              <InfoDisplay
                icon={FaPhone}
                title="Phone Number"
                value={client?.commonFields?.phone || client?.phone || ''}
                color="green"
              />
              <InfoDisplay
                icon={FaCalendarAlt}
                title="Account Created"
                value={new Date(client?.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                color="purple"
              />
            </div>
          </div>

          {/* Personal Details */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b bg-green-50">
              <div className="flex items-center gap-3">
                <FaIdCard className="h-5 w-5 text-green-600" />
                <h2 className="font-semibold text-gray-900">Personal Details</h2>
              </div>
            </div>
            <div className="p-6">
              {client?.commonFields ? (
                <div className="space-y-4">
                  <InfoDisplay
                    icon={FaIdCard}
                    title="NDIS Number"
                    value={client?.commonFields?.ndis || ''}
                    color="green"
                  />
                  <InfoDisplay
                    icon={FaCalendarAlt}
                    title="Date of Birth"
                    value={client?.commonFields?.dob || ''}
                    color="blue"
                  />
                  <InfoDisplay
                    icon={FaVenusMars}
                    title="Gender"
                    value={client?.commonFields?.sex || ''}
                    color="purple"
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaIdCard className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No personal details available</p>
                </div>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b bg-amber-50">
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="h-5 w-5 text-amber-600" />
                <h2 className="font-semibold text-gray-900">Address Information</h2>
              </div>
            </div>
            <div className="p-6">
              {client?.commonFields ? (
                <div className="space-y-4">
                  <InfoDisplay
                    icon={FaMapMarkerAlt}
                    title="Street Address"
                    value={client?.commonFields?.address || client?.commonFields?.street || ''}
                    color="amber"
                  />
                  <InfoDisplay
                    icon={FaMapMarkerAlt}
                    title="State"
                    value={client?.commonFields?.state || ''}
                    color="blue"
                  />
                  <InfoDisplay
                    icon={FaMapMarkerAlt}
                    title="Postcode"
                    value={client?.commonFields?.postCode || ''}
                    color="green"
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaMapMarkerAlt className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No address information available</p>
                </div>
              )}
            </div>
          </div>

          {/* Disability & Conditions */}
          {client?.commonFields?.disability && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b bg-purple-50">
                <div className="flex items-center gap-3">
                  <FaClipboardList className="h-5 w-5 text-purple-600" />
                  <h2 className="font-semibold text-gray-900">Disability & Conditions</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
                    {client?.commonFields?.disability}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
