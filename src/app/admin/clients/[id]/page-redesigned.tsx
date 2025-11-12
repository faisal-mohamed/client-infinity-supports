'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FaArrowLeft, FaFileAlt, FaUser, FaIdCard, FaCalendarAlt, 
  FaMapMarkerAlt, FaEnvelope, FaPhone, FaVenusMars, 
  FaClipboardList, FaEdit, FaCopy, FaEye
} from 'react-icons/fa';
import { getClient } from '@/lib/api';

// Responsive text component that handles overflow gracefully
function ResponsiveText({ 
  text, 
  className = '', 
  maxLines = 2 
}: { 
  text: string; 
  className?: string; 
  maxLines?: number; 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <div className="relative">
      <p 
        className={`${className} ${
          !isExpanded && maxLines > 0 
            ? `line-clamp-${maxLines}` 
            : ''
        } transition-all duration-200`}
        style={{
          display: !isExpanded && maxLines > 0 ? '-webkit-box' : 'block',
          WebkitLineClamp: !isExpanded && maxLines > 0 ? maxLines : 'unset',
          WebkitBoxOrient: 'vertical',
          overflow: !isExpanded && maxLines > 0 ? 'hidden' : 'visible'
        }}
      >
        {text}
      </p>
      {text.length > 50 && (
        <button
          onClick={toggleExpanded}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1 transition-colors"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}

// Info card component for consistent styling
function InfoCard({ 
  icon: Icon, 
  title, 
  value, 
  color = 'blue',
  copyable = false 
}: {
  icon: any;
  title: string;
  value: string;
  color?: 'blue' | 'green' | 'purple' | 'amber' | 'rose' | 'indigo';
  copyable?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    rose: 'bg-rose-50 border-rose-200 text-rose-700',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700'
  };

  const iconColorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    amber: 'bg-amber-100 text-amber-600',
    rose: 'bg-rose-100 text-rose-600',
    indigo: 'bg-indigo-100 text-indigo-600'
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md ${colorClasses[color]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`p-2 rounded-lg ${iconColorClasses[color]} flex-shrink-0`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-600 mb-1">{title}</p>
            <ResponsiveText 
              text={value || 'Not provided'} 
              className="font-semibold text-gray-900 break-words"
              maxLines={2}
            />
          </div>
        </div>
        {copyable && value && (
          <button
            onClick={copyToClipboard}
            className="p-2 rounded-lg bg-white/50 hover:bg-white/80 transition-colors flex-shrink-0"
            title="Copy to clipboard"
          >
            {copied ? (
              <span className="text-green-600 text-xs font-medium">✓</span>
            ) : (
              <FaCopy className="h-3 w-3 text-gray-500" />
            )}
          </button>
        )}
      </div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-rose-500 border-rose-200 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Loading Client Details</h3>
          <p className="text-slate-600">Please wait while we fetch the information...</p>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUser className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-red-800 mb-2">Client Not Found</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            {/* Left Section - Client Info */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                aria-label="Go back"
              >
                <FaArrowLeft className="h-5 w-5" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-16 w-16 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">
                      {fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white"></div>
                </div>
                
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 break-words">
                    {fullName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                      ID: {client.id}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt className="h-3 w-3" />
                      Created: {new Date(client?.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/admin/clients/${id}/forms`}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FaFileAlt className="h-4 w-4" />
                <span className="hidden sm:inline">Client Forms</span>
                <span className="sm:hidden">Forms</span>
              </Link>
              <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-semibold">
                <FaEdit className="h-4 w-4" />
                <span className="hidden sm:inline">Edit Client</span>
                <span className="sm:hidden">Edit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column - Basic & Personal Info */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Basic Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500 text-white">
                    <FaUser className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Basic Information</h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <InfoCard
                  icon={FaUser}
                  title="Full Name"
                  value={fullName}
                  color="blue"
                  copyable
                />
                <InfoCard
                  icon={FaEnvelope}
                  title="Email Address"
                  value={client?.commonFields?.email || client?.email || ''}
                  color="indigo"
                  copyable
                />
                <InfoCard
                  icon={FaPhone}
                  title="Phone Number"
                  value={client?.commonFields?.phone || client?.phone || ''}
                  color="green"
                  copyable
                />
                <InfoCard
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
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500 text-white">
                    <FaIdCard className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Personal Details</h2>
                </div>
              </div>
              <div className="p-6">
                {client?.commonFields ? (
                  <div className="space-y-4">
                    <InfoCard
                      icon={FaIdCard}
                      title="NDIS Number"
                      value={client?.commonFields?.ndis || ''}
                      color="green"
                      copyable
                    />
                    <InfoCard
                      icon={FaCalendarAlt}
                      title="Date of Birth"
                      value={client?.commonFields?.dob || ''}
                      color="blue"
                    />
                    <InfoCard
                      icon={FaVenusMars}
                      title="Gender"
                      value={client?.commonFields?.sex || ''}
                      color="purple"
                    />
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FaIdCard className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No personal details available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Address & Conditions */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Address Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500 text-white">
                    <FaMapMarkerAlt className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Address Information</h2>
                </div>
              </div>
              <div className="p-6">
                {client?.commonFields ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoCard
                      icon={FaMapMarkerAlt}
                      title="Street Address"
                      value={client?.commonFields?.address || client?.commonFields?.street || ''}
                      color="amber"
                    />
                    <InfoCard
                      icon={FaMapMarkerAlt}
                      title="State"
                      value={client?.commonFields?.state || ''}
                      color="blue"
                    />
                    <InfoCard
                      icon={FaMapMarkerAlt}
                      title="Postcode"
                      value={client?.commonFields?.postCode || ''}
                      color="green"
                    />
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FaMapMarkerAlt className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No address information available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Disability & Conditions */}
            {client?.commonFields?.disability && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500 text-white">
                      <FaClipboardList className="h-5 w-5" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Disability & Conditions</h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="bg-purple-50 rounded-xl border-2 border-purple-200 p-6">
                    <ResponsiveText
                      text={client?.commonFields?.disability}
                      className="text-gray-700 whitespace-pre-line leading-relaxed"
                      maxLines={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-rose-50 to-rose-100 border-b border-rose-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-500 text-white">
                    <FaFileAlt className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link
                    href={`/admin/clients/${id}/forms`}
                    className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-xl transition-colors group"
                  >
                    <div className="p-2 bg-blue-500 text-white rounded-lg group-hover:bg-blue-600 transition-colors">
                      <FaFileAlt className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">View Forms</p>
                      <p className="text-sm text-gray-600">Client documents</p>
                    </div>
                  </Link>
                  
                  <button className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-xl transition-colors group">
                    <div className="p-2 bg-green-500 text-white rounded-lg group-hover:bg-green-600 transition-colors">
                      <FaEdit className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Edit Details</p>
                      <p className="text-sm text-gray-600">Update information</p>
                    </div>
                  </button>
                  
                  <button className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 rounded-xl transition-colors group">
                    <div className="p-2 bg-purple-500 text-white rounded-lg group-hover:bg-purple-600 transition-colors">
                      <FaEye className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">View History</p>
                      <p className="text-sm text-gray-600">Activity log</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
