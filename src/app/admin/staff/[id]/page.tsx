"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FaArrowLeft, FaUser, FaEnvelope, FaPhone,
  FaCalendarAlt, FaCheckCircle, FaClock, FaTimesCircle, FaClipboardList, FaFileAlt, FaSpinner, FaTimes, FaSave
} from 'react-icons/fa';
import LoadingView from '@/components/ui/LoadingView';
import { useToast } from '@/components/ui/Toast';
import StaffCommonFieldsWarningModal from '@/components/StaffCommonFieldsWarningModal';

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
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    email: '',
    phone: ''
  });

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
        setFormData({
          firstName: data.staff.firstName || '',
          surname: data.staff.surname || '',
          email: data.staff.email || '',
          phone: data.staff.phone || ''
        });
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

  useEffect(() => {
    console.log('🔍 [State Change] showWarningModal:', showWarningModal);
    console.log('🔍 [State Change] showUpdateModal:', showUpdateModal);
  }, [showWarningModal, showUpdateModal]);

  // Check if we should open update modal from URL parameter
  useEffect(() => {
    if (typeof window !== 'undefined' && staff && !showUpdateModal && !showWarningModal) {
      const urlParams = new URLSearchParams(window.location.search);
      const openUpdate = urlParams.get('openUpdate');
      if (openUpdate === 'true') {
        // Open update modal directly
        setShowUpdateModal(true);
        // Clean up URL parameter
        router.replace(`/admin/staff/${id}`, { scroll: false });
      }
    }
  }, [staff, showUpdateModal, showWarningModal, id, router]);

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

      {/* Warning Modal - Shows forms list with download options */}
      <StaffCommonFieldsWarningModal
        isOpen={showWarningModal}
        onClose={() => {
          console.log('🔍 [Modal] onClose called');
          setShowWarningModal(false);
        }}
        onProceed={() => {
          console.log('🔍 [Modal] onProceed called');
          setShowWarningModal(false);
          setShowUpdateModal(true);
        }}
        staffName={staff ? `${staff.firstName} ${staff.surname}` : ''}
        assignments={assignments.map((a: any) => ({
          id: a.id,
          form: {
            id: a.form.id,
            formKey: a.form.formKey,
            title: a.form.title,
            version: a.form.version,
          },
          hasSubmission: a.hasSubmission || false,
          submissionId: a.submissionId,
          filledByAdmin: a.filledByAdmin || false,
          staffSignature: a.staffSignature || null,
        }))}
        onDownloadForm={async (assignmentId: number, formTitle: string) => {
          const assignment = assignments.find((a: any) => a.id === assignmentId);
          if (!assignment) {
            throw new Error('Assignment not found');
    }

    try {
      const formKey = assignment.form.formKey;
      const formType = formKey.replace(/_/g, '-');
            const staffId = parseInt(id as string);
      let response;
      
      if (formKey === 'ndis_workforce_capability' || formKey === 'bullying_harassment_training') {
        response = await fetch(`/api/staff/${staffId}/forms/${formType}/pdf?merge=true`);
        if (!response.ok) {
          response = await fetch(`/api/staff/${staffId}/forms/${formType}/pdf`);
        }
      } else {
        response = await fetch(`/api/staff/${staffId}/forms/${formType}/pdf`);
        if (!response.ok) {
          response = await fetch(`/api/generate-pdf/${assignment.submissionId}/${assignment.form.id}`);
        }
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      const staffName = `${staff?.firstName || ''}_${staff?.surname || ''}`.replace(/[^a-zA-Z0-9]/g, '_');
            a.download = `${formTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${staffName}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showToast({
        type: 'success',
        title: 'PDF Downloaded',
              message: `${formTitle} downloaded successfully`,
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Error downloading PDF:', error);
      showToast({
        type: 'error',
        title: 'Download Failed',
        message: error.message || 'Failed to download PDF. Please try again.',
        duration: 5000,
      });
            throw error;
          }
        }}
      />

      {/* Update Details Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-300 flex flex-col">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 via-purple-600/90 to-pink-600/90"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                    <FaUser className="h-6 w-6 text-white" />
                  </div>
          <div>
                    <h3 className="text-2xl font-bold text-white">
                      Update Common Details
                    </h3>
                    <div className="flex items-center mt-2 space-x-2">
                      <FaUser className="h-4 w-4 text-white/80" />
                      <p className="text-white/90 font-medium">{staff ? `${staff.firstName} ${staff.surname}` : ''}</p>
                    </div>
                    <p className="text-white/80 text-sm mt-1">
                      Update the common fields shared across all forms for this staff member
                    </p>
                  </div>
          </div>
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="p-3 hover:bg-white/20 rounded-xl transition-all duration-200 hover:rotate-90 border border-white/30 backdrop-blur-sm"
                >
                  <FaTimes className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-gray-50 to-white">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information Section */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                        <FaUser className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">
                        Personal Information
                      </h4>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                          <FaUser className="h-4 w-4 text-blue-500" />
                          <span>First Name</span>
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                          placeholder="Enter First name"
                        />
                      </div>

                      <div>
                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                          <FaUser className="h-4 w-4 text-blue-500" />
                          <span>Surname</span>
                        </label>
                        <input
                          type="text"
                          value={formData.surname}
                          onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                          placeholder="Enter Surname"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact & Address Section */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                        <FaEnvelope className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">
                        Contact & Address
                      </h4>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                          <FaEnvelope className="h-4 w-4 text-emerald-500" />
                          <span>Email Address</span>
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                          placeholder="Enter email address"
                        />
                      </div>

                      <div>
                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                          <FaPhone className="h-4 w-4 text-emerald-500" />
                          <span>Phone Number</span>
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                  </div>
          </div>
        </div>
      </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                    <FaUser className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Shared Information</p>
                    <p className="text-xs text-gray-600">These details will be shared across all forms for this staff member.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowUpdateModal(false)}
                    disabled={updating}
                    className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold shadow-sm hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
            <button
                type="button"
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  console.log('🔄 [Update Details] Update button clicked');
                  console.log('📋 [Update Details] Form data:', formData);
                  console.log('🆔 [Update Details] Staff ID:', id);
                  console.log('🆔 [Update Details] Staff ID type:', typeof id);
                  
                  if (!formData.firstName || !formData.surname || !formData.email) {
                    console.log('❌ [Update Details] Validation failed');
                    showToast({
                      type: 'error',
                      title: 'Validation Error',
                      message: 'Please fill in all required fields (First Name, Surname, Email)',
                      duration: 3000,
                    });
                    return;
                  }

                  try {
                    setUpdating(true);
                    console.log('📡 [Update Details] Making API call to:', `/api/staff/${id}`);
                    
                    const requestBody = {
                      firstName: formData.firstName,
                      surname: formData.surname,
                      email: formData.email,
                      phone: formData.phone || null,
                    };
                    console.log('📦 [Update Details] Request body:', requestBody);
                    
                    const response = await fetch(`/api/staff/${id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(requestBody),
                    });
                    
                    console.log('📥 [Update Details] Response status:', response.status);
                    console.log('📥 [Update Details] Response ok:', response.ok);

                    if (!response.ok) {
                      const errorData = await response.json().catch(() => ({}));
                      console.error('❌ [Update Details] API error:', errorData);
                      throw new Error(errorData.error || 'Failed to update staff details');
                    }

                    const result = await response.json();
                    console.log('✅ [Update Details] Update successful:', result);

                    showToast({
                      type: 'success',
                      title: 'Success',
                      message: 'Staff details updated successfully',
                      duration: 3000,
                    });

                    setShowUpdateModal(false);
                    
                    // Reload staff data
                    console.log('🔄 [Update Details] Reloading staff data...');
                    const loadResponse = await fetch(`/api/staff/${id}/form-assignments`);
                    if (loadResponse.ok) {
                      const data = await loadResponse.json();
                      console.log('✅ [Update Details] Staff data reloaded:', data.staff);
                      setStaff(data.staff);
                      setFormData({
                        firstName: data.staff.firstName || '',
                        surname: data.staff.surname || '',
                        email: data.staff.email || '',
                        phone: data.staff.phone || ''
                      });
                    } else {
                      console.error('❌ [Update Details] Failed to reload staff data');
                    }
                  } catch (err: any) {
                    console.error('❌ [Update Details] Error updating staff:', err);
                    showToast({
                      type: 'error',
                      title: 'Error',
                      message: err.message || 'Failed to update staff details',
                      duration: 5000,
                    });
                  } finally {
                    setUpdating(false);
                    console.log('🏁 [Update Details] Update process finished');
                  }
                }}
                disabled={updating}
                className="px-8 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                {updating ? (
                  <>
                    <FaSpinner className="h-4 w-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <FaSave className="h-4 w-4" />
                    <span>Update Details</span>
                  </>
                )}
            </button>
          </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
