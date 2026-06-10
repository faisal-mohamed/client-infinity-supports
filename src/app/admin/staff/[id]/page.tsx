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
          className="text-gold-600 hover:text-gold-800 text-sm font-medium mt-1 transition-colors"
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
    blue: 'bg-azure-50 border-azure-100 text-azure-700',
    green: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    purple: 'bg-azure-50 border-azure-100 text-azure-700',
    amber: 'bg-gold-50 border-gold-200 text-gold-700',
    rose: 'bg-gold-50 border-gold-200 text-gold-700',
    indigo: 'bg-azure-50 border-azure-100 text-azure-700',
    gray: 'bg-azure-50 border-azure-200 text-azure-600',
    ash: 'bg-azure-50 border-azure-200 text-azure-600'
  };

  const iconColorClasses = {
    blue: 'bg-azure-100 text-azure-600',
    green: 'bg-emerald-100 text-emerald-600',
    purple: 'bg-azure-100 text-azure-600',
    amber: 'bg-gold-100 text-gold-600',
    rose: 'bg-gold-100 text-gold-600',
    indigo: 'bg-azure-100 text-azure-600',
    gray: 'bg-azure-100 text-azure-400',
    ash: 'bg-azure-100 text-azure-400'
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
    <div className={`rounded-xl border-2 p-4 transition-all duration-200  ${colorClasses[color]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`p-2 rounded-lg ${iconColorClasses[color]} flex-shrink-0`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-azure-400 mb-1">{title}</p>
            <ResponsiveText 
              text={value || 'Not provided'} 
              className="font-semibold text-azure-700 break-words"
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
              <span className="text-emerald-600 text-xs font-medium">✓</span>
            ) : (
              <span className="text-azure-400 text-xs">📋</span>
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
    if (!id || typeof id !== 'string') {
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
      <div className=" flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-soft p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUser className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-red-800 mb-2">Staff Not Found</h1>
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
      success: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Active' },
      pending: { bg: 'bg-gold-100', text: 'text-gold-700', label: 'Pending' },
      deleted: { bg: 'bg-azure-100', text: 'text-azure-600', label: 'Deleted' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`inline-block text-xs font-medium ${config.bg} ${config.text} px-3 py-1 rounded-full`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="">
      <div className="">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-soft border border-azure-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            {/* Left Section - Staff Info */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin/staff')}
                className="p-3 rounded-xl bg-azure-100 hover:bg-azure-200 text-azure-600 transition-colors"
                aria-label="Go back"
              >
                <FaArrowLeft className="h-5 w-5" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-16 w-16 bg-azure-700 rounded-xl flex items-center justify-center shadow-soft">
                    <span className="text-2xl font-bold text-white">
                      {initials}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-3 border-white"></div>
                </div>
                
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl lg:text-xl font-bold text-azure-700 mb-1 break-words">
                    {fullName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-azure-400">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
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
              className={`flex items-center gap-2 px-6 py-3 bg-azure-700 hover:bg-azure-600 text-white rounded-xl transition-all duration-200 font-semibold shadow-soft   ${navigatingToForms ? 'opacity-50 cursor-not-allowed' : ''}`}
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
            <div className="bg-white rounded-2xl shadow-soft border border-azure-200 overflow-hidden">
              <div className="px-6 py-4 bg-azure-50 to-azure-100 border-b border-azure-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-azure-500 text-white">
                    <FaUser className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-azure-700">Basic Information</h2>
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
            <div className="bg-white rounded-2xl shadow-soft border border-azure-200 overflow-hidden">
              <div className="px-6 py-4 bg-azure-50 to-azure-100 border-b border-azure-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-azure-500 text-white">
                    <FaClipboardList className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-azure-700">Form Statistics</h2>
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
          filledByAdmin: false,
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
            const staffId = id as string;
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
          <div className="bg-white rounded-2xl shadow-soft max-w-6xl w-full max-h-[90vh] overflow-hidden border border-azure-200 animate-in zoom-in-95 duration-300 flex flex-col">
            {/* Header */}
            <div className="relative bg-azure-600 via-azure-600 to-gold-600 p-8 text-white">
              <div className="absolute inset-0 bg-azure-600 via-azure-600/90 to-gold-600/90"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                    <FaUser className="h-6 w-6 text-white" />
                  </div>
          <div>
                    <h3 className="text-base font-semibold text-white">
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
            <div className="flex-1 p-8 overflow-y-auto bg-azure-50 to-white">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information Section */}
                <div className="space-y-6">
                  <div className="bg-azure-50 to-azure-50 rounded-2xl p-6 border border-azure-100">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-azure-600 to-azure-500 rounded-xl shadow-soft">
                        <FaUser className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-azure-700">
                        Personal Information
                      </h4>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="flex items-center space-x-2 text-sm font-semibold text-azure-600 mb-3">
                          <FaUser className="h-4 w-4 text-azure-500" />
                          <span>First Name</span>
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-azure-200 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm "
                          placeholder="Enter First name"
                        />
                      </div>

                      <div>
                        <label className="flex items-center space-x-2 text-sm font-semibold text-azure-600 mb-3">
                          <FaUser className="h-4 w-4 text-azure-500" />
                          <span>Surname</span>
                        </label>
                        <input
                          type="text"
                          value={formData.surname}
                          onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-azure-200 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm "
                          placeholder="Enter Surname"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact & Address Section */}
                <div className="space-y-6">
                  <div className="bg-emerald-50 to-azure-50 rounded-2xl p-6 border border-emerald-100">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-emerald-600 to-azure-500 rounded-xl shadow-soft">
                        <FaEnvelope className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-azure-700">
                        Contact & Address
                      </h4>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="flex items-center space-x-2 text-sm font-semibold text-azure-600 mb-3">
                          <FaEnvelope className="h-4 w-4 text-emerald-500" />
                          <span>Email Address</span>
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-azure-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm "
                          placeholder="Enter email address"
                        />
                      </div>

                      <div>
                        <label className="flex items-center space-x-2 text-sm font-semibold text-azure-600 mb-3">
                          <FaPhone className="h-4 w-4 text-emerald-500" />
                          <span>Phone Number</span>
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-azure-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm "
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                  </div>
          </div>
        </div>
      </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-azure-50 to-azure-100 border-t border-azure-200 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gold-100 text-gold-600">
                    <FaUser className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-azure-700">Shared Information</p>
                    <p className="text-xs text-azure-400">These details will be shared across all forms for this staff member.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowUpdateModal(false)}
                    disabled={updating}
                    className="px-6 py-3 text-azure-600 bg-white border-2 border-azure-300 rounded-xl hover:bg-azure-50 hover:border-azure-400 transition-all duration-200 font-semibold shadow-sm   disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="px-8 py-3 bg-azure-700 hover:bg-azure-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-semibold shadow-soft   disabled:transform-none"
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
