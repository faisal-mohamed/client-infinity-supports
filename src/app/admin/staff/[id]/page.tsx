"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FaArrowLeft, FaUser, FaEnvelope, FaPhone,
  FaCalendarAlt, FaCheckCircle, FaClock, FaTimesCircle, FaClipboardList, FaFileAlt, FaSpinner
} from 'react-icons/fa';
import LoadingView from '@/components/ui/LoadingView';
import { useToast } from '@/components/ui/Toast';

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
      {text && text.length > 50 && (
        <button
          onClick={toggleExpanded}
          className="text-rose-600 hover:text-rose-800 text-sm font-medium mt-1 transition-colors"
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
  color?: 'blue' | 'green' | 'purple' | 'amber' | 'rose' | 'indigo' | 'gray' | 'ash';
  copyable?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    rose: 'bg-rose-50 border-rose-200 text-rose-700',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700',
    ash: 'bg-gray-50 border-gray-200 text-gray-700'
  };

  const iconColorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    amber: 'bg-amber-100 text-amber-600',
    rose: 'bg-rose-100 text-rose-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    gray: 'bg-gray-100 text-gray-600',
    ash: 'bg-gray-100 text-gray-600'
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
              <span className="text-gray-500 text-xs">📋</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function StaffDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { showToast } = useToast();
  const [staff, setStaff] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [navigatingToForms, setNavigatingToForms] = useState(false);

  useEffect(() => {
    if (!id || typeof id !== 'string' || isNaN(Number(id))) {
      setError('Invalid staff ID');
      setLoading(false);
      return;
    }

    const loadStaff = async () => {
    try {
      setLoading(true);
      
        // Fetch staff and form assignments
      const response = await fetch(`/api/staff/${id}/form-assignments`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to load staff details');
      }
      
      const data = await response.json();
      
      if (!data.staff) {
        throw new Error('Staff not found');
      }
      
      setStaff(data.staff);
      setAssignments(data.assignments || []);
        setError('');
      } catch (err: any) {
        setError(err.message || 'Failed to load staff details');
        console.error(err);
      showToast({
        type: 'error',
        title: 'Error',
          message: err.message || 'Failed to load staff details',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

    loadStaff();
  }, [id, showToast]);

  if (loading) {
    return <LoadingView title="Loading Staff Details" message="Please wait while we fetch the information..." />;
  }

  if (error || !staff) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUser className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-red-800 mb-2">Staff Not Found</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/admin/staff')}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
          >
            Back to Staff List
          </button>
        </div>
      </div>
    );
  }

  const fullName = `${staff.firstName || ''} ${staff.surname || ''}`.trim() || 'Unknown Staff';
  const initials = `${staff.firstName?.charAt(0) || ''}${staff.surname?.charAt(0) || ''}`.toUpperCase();

  // Calculate statistics
  const stats = {
    total: assignments.length,
    completed: assignments.filter(a => a.currentStatus === 'completed').length,
    inProgress: assignments.filter(a => a.currentStatus === 'in_progress').length,
    notStarted: assignments.filter(a => a.currentStatus === 'not_started').length,
    pending: assignments.filter(a => a.currentStatus === 'pending' || (!a.currentStatus && !a.hasSubmission)).length
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      success: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
      deleted: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Deleted' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`inline-block text-xs font-medium ${config.bg} ${config.text} px-3 py-1 rounded-full`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            {/* Left Section - Staff Info */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin/staff')}
                className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                aria-label="Go back"
              >
                <FaArrowLeft className="h-5 w-5" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-16 w-16 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">
                      {initials}
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
                      ID: {staff.id}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt className="h-3 w-3" />
                      Created: {new Date(staff.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                    {staff.status && (
                      <span className="flex items-center gap-2">
                        {getStatusBadge(staff.status)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
          </div>

            {/* Right Section - Actions */}
            <div className="flex flex-wrap gap-3">
            <Link 
              href={`/admin/staff/${id}/forms`} 
              onClick={() => setNavigatingToForms(true)}
              className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${navigatingToForms ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {navigatingToForms ? (
                <FaSpinner className="h-4 w-4 animate-spin" />
              ) : (
                <FaFileAlt className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">{navigatingToForms ? 'Loading...' : 'View Forms'}</span>
              <span className="sm:hidden">{navigatingToForms ? 'Loading...' : 'Forms'}</span>
            </Link>
          </div>
        </div>
      </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column - Basic Information */}
          <div className="lg:col-span-6 space-y-6">
            
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
                  value={staff.email || ''}
                  color="indigo"
                  copyable
                />
                <InfoCard
                  icon={FaPhone}
                  title="Phone Number"
                  value={staff.phone || ''}
                  color="green"
                  copyable
                />
                <InfoCard
                  icon={FaCalendarAlt}
                  title="Account Created"
                  value={new Date(staff.createdAt || Date.now()).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  color="purple"
                />
                {staff.status && (
                  <InfoCard
                    icon={FaUser}
                    title="Status"
                    value={staff.status === 'success' ? 'Active' : staff.status === 'pending' ? 'Pending' : 'Deleted'}
                    color={staff.status === 'success' ? 'green' : staff.status === 'pending' ? 'amber' : 'rose'}
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column - Form Statistics */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Form Statistics */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500 text-white">
                    <FaClipboardList className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Form Statistics</h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <InfoCard
                  icon={FaClipboardList}
                  title="Total Assigned Forms"
                  value={stats.total.toString()}
                  color="indigo"
                />
                <InfoCard
                  icon={FaCheckCircle}
                  title="Completed Forms"
                  value={stats.completed.toString()}
                  color="green"
                />
                <InfoCard
                  icon={FaClock}
                  title="In Progress"
                  value={stats.inProgress.toString()}
                  color="amber"
                />
                <InfoCard
                  icon={FaClipboardList}
                  title="Not Started"
                  value={stats.notStarted.toString()}
                  color="ash"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
