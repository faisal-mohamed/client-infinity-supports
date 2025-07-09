"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaEdit, FaEye, FaArrowLeft, FaPlus, FaSignature, FaCheck, FaClock, 
  FaFileAlt, FaTimes, FaLink, FaCopy, FaDownload, FaEllipsisV, 
  FaUser, FaCalendarAlt, FaChartLine, FaExclamationTriangle,
  FaCheckCircle, FaTimesCircle, FaSpinner, FaUserEdit
} from 'react-icons/fa';
import { useToast } from '@/components/ui/Toast';
import { getAllForms } from '@/app/forms/registry';
import { validateFormSignatures, getSignatureStatusText, formRequiresSignatures } from '@/lib/signatureValidation';
import CommonFieldsModal, { CommonField } from '@/components/CommonFieldsModal';
import CommonFieldsWarningModal from '@/components/CommonFieldsWarningModal';

import {FormAssignmentWithDetails, ClientInfo, AvailableForm} from './types'

export default function ClientFormsPageClient() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  
  const clientId = parseInt(params.id as string);
  
  const [client, setClient] = useState<ClientInfo | null>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForms, setSelectedForms] = useState<number[]>([]);
  const [generatingLink, setGeneratingLink] = useState(false);
  
  // Form assignment modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [availableForms, setAvailableForms] = useState<AvailableForm[]>([]);
  const [selectedFormsToAssign, setSelectedFormsToAssign] = useState<number[]>([]);
  const [assigning, setAssigning] = useState(false);

  // Download state
  const [downloadingPDF, setDownloadingPDF] = useState<number | null>(null);

  // Action menu state
  const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);

  // Signature link modal state
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<{
    url: string;
    token: string;
    formsCount: number;
    forms: { formTitle: string; formKey: string; }[];
    expiresAt: string;
  } | null>(null);

  // Common fields modal state
  const [showCommonFieldsModal, setShowCommonFieldsModal] = useState(false);
  const [showCommonFieldsWarning, setShowCommonFieldsWarning] = useState(false);
  const [commonFields, setCommonFields] = useState<CommonField | null>(null);
  const [updatingCommonFields, setUpdatingCommonFields] = useState(false);

  // Load client and form assignments
  useEffect(() => {
    loadClientForms();
    loadAvailableForms();
  }, [clientId]);

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // Don't close if clicking on the dropdown button or dropdown content
      if (!target.closest('.action-menu-container')) {
        setActiveActionMenu(null);
      }
    };
    
    // Use setTimeout to avoid immediate closure when button is clicked
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeActionMenu]);

  const loadClientForms = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/clients/${clientId}/form-assignments`);
      if (!response.ok) throw new Error('Failed to load client forms');
      
      const data = await response.json();
      console.log("DATA: ", data);
      console.log("Client common fields: ", data.client?.commonFields);
      setClient(data.client);
      setAssignments(data.assignments);
      
    } catch (error) {
      console.error('Error loading client forms:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load client forms',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableForms = async () => {
    try {
      const response = await fetch('/api/forms');
      if (!response.ok) throw new Error('Failed to load available forms');
      
      const data = await response.json();
      // API returns forms directly, not wrapped in { forms: [] }
      setAvailableForms(Array.isArray(data) ? data : []);
      
    } catch (error) {
      console.error('Error loading available forms:', error);
    }
  };

  const handleFormAssignmentSelection = (formId: number) => {
    setSelectedFormsToAssign(prev => 
      prev.includes(formId) 
        ? prev.filter(id => id !== formId)
        : [...prev, formId]
    );
  };

  const assignFormsToClient = async () => {
    if (selectedFormsToAssign.length === 0) {
      showToast({
        type: 'error',
        title: 'No Forms Selected',
        message: 'Please select at least one form to assign',
        duration: 3000,
      });
      return;
    }

    try {
      setAssigning(true);
      
      const response = await fetch(`/api/clients/${clientId}/assign-forms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          formIds: selectedFormsToAssign 
        }),
      });

      if (!response.ok) throw new Error('Failed to assign forms');
      
      showToast({
        type: 'success',
        title: 'Forms Assigned',
        message: `Successfully assigned ${selectedFormsToAssign.length} form(s) to client`,
        duration: 3000,
      });

      // Reset and reload
      setSelectedFormsToAssign([]);
      setShowAssignModal(false);
      loadClientForms();
      
    } catch (error) {
      console.error('Error assigning forms:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to assign forms to client',
        duration: 3000,
      });
    } finally {
      setAssigning(false);
    }
  };

  const copyLinkToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      showToast({
        type: 'success',
        title: 'Link Copied',
        message: 'Signature link copied to clipboard',
        duration: 2000,
      });
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      showToast({
        type: 'success',
        title: 'Link Copied',
        message: 'Signature link copied to clipboard',
        duration: 2000,
      });
    }
  };

  // Download PDF function
  const handleDownloadPDF = async (assignment: FormAssignmentWithDetails) => {
    if (!assignment.hasSubmission || !assignment.submissionId) {
      showToast({
        type: 'error',
        title: 'Cannot Download',
        message: 'Form must be filled before downloading PDF',
        duration: 3000,
      });
      return;
    }

    try {
      setDownloadingPDF(assignment.id);
      setActiveActionMenu(null); // Close action menu
      
      const response = await fetch(`/api/generate-pdf/${assignment.submissionId}/${assignment.form.id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${assignment.form.title.replace(/[^a-zA-Z0-9]/g, '_')}_${client?.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'client'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showToast({
        type: 'success',
        title: 'PDF Downloaded',
        message: 'Form PDF downloaded successfully',
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
    } finally {
      setDownloadingPDF(null);
    }
  };

  const generateSignatureLink = async () => {
    if (selectedForms.length === 0) {
      showToast({
        type: 'error',
        title: 'No Forms Selected',
        message: 'Please select at least one admin-filled form to generate client link',
        duration: 3000,
      });
      return;
    }

    try {
      setGeneratingLink(true);
      
      const response = await fetch(`/api/clients/${clientId}/generate-signature-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          formAssignmentIds: selectedForms 
        }),
      });

      if (!response.ok) throw new Error('Failed to generate signature link');
      
      const data = await response.json();
      
      // Show modal with option to view all links
      setGeneratedLink({
        url: data.signatureUrl,
        token: data.token,
        formsCount: data.formsCount,
        forms: data.forms,
        expiresAt: data.expiresAt,
      });
      setShowLinkModal(true);
      
      // Clear selection
      setSelectedForms([]);
      
      // Optionally reload the page to show updated data
      setTimeout(() => {
        loadClientForms();
      }, 1000);
      
    } catch (error) {
      console.error('Error generating signature link:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to generate signature link',
        duration: 3000,
      });
    } finally {
      setGeneratingLink(false);
    }
  };

  // Wrapper function for warning modal downloads
  const downloadFormForWarningModal = async (assignmentId: number, formTitle: string) => {
    console.log("Downloading form from warning modal:", assignmentId, formTitle);
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
      console.log("Found assignment:", assignment);
      await handleDownloadPDF(assignment);
    } else {
      console.error("Assignment not found for ID:", assignmentId);
    }
  };

  // Common Fields Functions
  const handleProceedToEditCommonFields = () => {
    setShowCommonFieldsWarning(false);
    openCommonFieldsModal();
  };

  const openCommonFieldsModal = () => {
    console.log("Opening common fields modal, client:", client);
    console.log("Client common fields:", client?.commonFields);
    
    if (client) {
      // Use commonFields if available, otherwise initialize with basic client info
      const commonFieldsData = client.commonFields[0] || {};
      
      setCommonFields({
        clientId: clientId,
        name: commonFieldsData.name || client.name || '',
        age: commonFieldsData.age || null,
        email: commonFieldsData.email || client.email || '',
        sex: commonFieldsData.sex || '',
        street: commonFieldsData.street || '',
        state: commonFieldsData.state || '',
        postCode: commonFieldsData.postCode || '',
        dob: commonFieldsData.dob || '',
        ndis: commonFieldsData.ndis || '',
        disability: commonFieldsData.disability || '',
        address: commonFieldsData.address || '',
        phone: commonFieldsData.phone || client.phone || '',
      });
    } else {
      // Fallback if no client data
      setCommonFields({
        clientId: clientId,
        name: '',
        email: '',
        phone: '',
        age: null,
        sex: '',
        street: '',
      });
    }
    setShowCommonFieldsModal(true);
  };

  const handleCommonFieldsChange = (field: keyof CommonField, value: string | number | null) => {
    if (!commonFields) return;
    
    setCommonFields(prev => ({
      ...prev!,
    }));
  };

  const updateCommonFields = async () => {
    if (!commonFields) return;

    try {
      setUpdatingCommonFields(true);
      
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: commonFields?.name,
          email: commonFields?.email,
          phone: commonFields?.phone,
          commonFields: {
            name: commonFields.name,
            age: commonFields.age,
            email: commonFields.email,
            sex: commonFields.sex,
            street: commonFields.street,
            state: commonFields.state,
            postCode: commonFields.postCode,
            dob: commonFields.dob,
            ndis: commonFields.ndis,
            disability: commonFields.disability,
            address: commonFields.address,
            phone: commonFields.phone
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to update common fields');
      
      showToast({
        type: 'success',
        title: 'Success',
        message: 'Client details updated successfully',
        duration: 3000,
      });

      setShowCommonFieldsModal(false);
      
      // Reload client data to get updated info
      loadClientForms();
      
    } catch (error) {
      console.error('Error updating common fields:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update client details',
        duration: 3000,
      });
    } finally {
      setUpdatingCommonFields(false);
    }
  };

  const getFormStatus = (assignment: FormAssignmentWithDetails) => {
    const requiresSignature = formRequiresSignatures(assignment.form.formKey);
    
    // If form has been filled by admin and requires signatures, validate them
    if (assignment.filledByAdmin && requiresSignature && assignment.formData) {
      const signatureValidation = validateFormSignatures(assignment.form.formKey, assignment.formData);
      
      if (signatureValidation.isComplete) {
        return {
          status: getSignatureStatusText(signatureValidation),
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: FaCheckCircle,
          bgColor: 'bg-green-50',
          iconColor: 'text-green-500'
        };
      } else if (signatureValidation.completedCount > 0) {
        return {
          status: getSignatureStatusText(signatureValidation),
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: FaSignature,
          bgColor: 'bg-yellow-50',
          iconColor: 'text-yellow-500'
        };
      } else {
        return {
          status: 'Ready for Signatures',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: FaSignature,
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-500'
        };
      }
    }
    
    // Fallback to legacy logic for backward compatibility
    if (assignment.clientSignature === "true") {
      return {
        status: 'All Signatures Complete',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: FaCheckCircle,
        bgColor: 'bg-green-50',
        iconColor: 'text-green-500'
      };
    }
    
    if (assignment.filledByAdmin && !requiresSignature) {
      return {
        status: 'Admin Completed',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: FaCheckCircle,
        bgColor: 'bg-green-50',
        iconColor: 'text-green-500'
      };
    } else if (assignment.hasSubmission) {
      return {
        status: 'In Progress',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: FaClock,
        bgColor: 'bg-yellow-50',
        iconColor: 'text-yellow-500'
      };
    } else {
      return {
        status: 'Not Started',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: FaTimesCircle,
        bgColor: 'bg-gray-50',
        iconColor: 'text-gray-400'
      };
    }
  };

  // Calculate statistics
  const stats = {
    total: assignments.length,
    completed: assignments.filter(a => {
      const requiresSignature = formRequiresSignatures(a.form.formKey);
      
      if (requiresSignature && a.filledByAdmin && a.formData) {
        // Use signature validation for forms requiring signatures
        const signatureValidation = validateFormSignatures(a.form.formKey, a.formData);
        return signatureValidation.isComplete;
      }
      
      // Fallback to legacy logic
      if (a.clientSignature === "true") {
        return true; // Completion flag indicates all signatures complete
      }
      
      // Form is completed if admin-filled and doesn't require signature
      return a.filledByAdmin && !requiresSignature;
    }).length,
    inProgress: assignments.filter(a => {
      const requiresSignature = formRequiresSignatures(a.form.formKey);
      
      if (requiresSignature && a.filledByAdmin && a.formData) {
        // Use signature validation for forms requiring signatures
        const signatureValidation = validateFormSignatures(a.form.formKey, a.formData);
        return signatureValidation.completedCount > 0 && !signatureValidation.isComplete;
      }
      
      // Form is in progress if it has submission but not admin-filled yet
      return a.hasSubmission && !a.filledByAdmin;
    }).length,
    notStarted: assignments.filter(a => !a.hasSubmission).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading client forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Clean Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button & Client Info Row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <Link 
                href="/admin/clients"
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 group"
              >
                <FaArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-medium">Back to Clients</span>
              </Link>
              
              <div className="h-8 w-px bg-gray-300"></div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FaUser className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{client?.name}</h1>
                  <p className="text-gray-600">{client?.email}</p>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {stats.completed}/{stats.total}
              </div>
              <div className="text-sm text-gray-600">Forms Completed</div>
            </div>
          </div>
          
          {/* Action Buttons Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAssignModal(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FaPlus className="mr-2 h-4 w-4" />
                Assign Forms
              </button>

              <button
                onClick={() => setShowCommonFieldsWarning(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium rounded-lg hover:from-orange-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FaUserEdit className="mr-2 h-4 w-4" />
                Update Common Details
              </button>
              
              <Link
                href={`/admin/clients/${clientId}/signature-links`}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FaLink className="mr-2 h-4 w-4" />
                Manage Links
              </Link>
              
              {selectedForms.length > 0 && (
                <button
                  onClick={generateSignatureLink}
                  disabled={generatingLink}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generatingLink ? (
                    <>
                      <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FaLink className="mr-2 h-4 w-4" />
                      Generate Link ({selectedForms.length})
                    </>
                  )}
                </button>
              )}
            </div>
            
            <div className="text-sm text-gray-500">
              {selectedForms.length > 0 ? (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                  {selectedForms.length} form{selectedForms.length > 1 ? 's' : ''} selected
                </span>
              ) : (
                <span>Select forms below to generate signature links</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-indigo-100">
                <FaFileAlt className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Forms</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <FaCheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <FaClock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gray-100">
                <FaExclamationTriangle className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Not Started</p>
                <p className="text-2xl font-bold text-gray-900">{stats.notStarted}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Forms List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-visible">{/* Changed from overflow-hidden to overflow-visible */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Assigned Forms</h2>
              {assignments.length > 0 && (
                <div className="text-sm text-gray-600">
                  {selectedForms.length > 0 ? (
                    <p className="font-medium text-indigo-600">{selectedForms.length} selected for link generation</p>
                  ) : (
                    <div>
                      <p>{assignments.length} total forms</p>
                      <p className="text-xs text-gray-500 mt-1">Select admin-filled forms to generate client links</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {assignments.length === 0 ? (
            <div className="text-center py-12">
              <FaFileAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Forms Assigned</h3>
              <p className="text-gray-600 mb-6">Get started by assigning some forms to this client.</p>
              <button
                onClick={() => setShowAssignModal(true)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FaPlus className="mr-2 h-4 w-4" />
                Assign Forms
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {assignments.map((assignment) => {
                const statusInfo = getFormStatus(assignment);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <div key={assignment.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        {/* Checkbox for signature link generation - show for admin-filled forms */}
                        {assignment.filledByAdmin && (
                          <input
                            type="checkbox"
                            checked={selectedForms.includes(assignment.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedForms(prev => [...prev, assignment.id]);
                              } else {
                                setSelectedForms(prev => prev.filter(id => id !== assignment.id));
                              }
                            }}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                        )}
                        
                        {/* Placeholder space for forms that are not completed */}
                        {!assignment.isCompleted && (
                          <div className="w-4 h-4"></div>
                        )}

                        {/* Form Icon */}
                        <div className={`p-3 rounded-lg ${statusInfo.bgColor}`}>
                          <StatusIcon className={`h-6 w-6 ${statusInfo.iconColor}`} />
                        </div>

                        {/* Form Details */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {assignment.form.title}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                              {statusInfo.status}
                            </span>
                            {/* Signature requirement indicator */}
                            {assignment.form.requiresSignature === true && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                <FaSignature className="mr-1 h-2 w-2" />
                                Signature Required
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Version {assignment.form.version}</span>
                            <span>•</span>
                            <span className="flex items-center">
                              <FaCalendarAlt className="h-3 w-3 mr-1" />
                              Assigned {new Date(assignment.assignedAt).toLocaleDateString()}
                            </span>
                            {assignment.adminFilledAt && (
                              <>
                                <span>•</span>
                                <span>Filled {new Date(assignment.adminFilledAt).toLocaleDateString()}</span>
                              </>
                            )}
                            {assignment.clientSignedAt && (
                              <>
                                <span>•</span>
                                <span className="text-green-600 font-medium">
                                  Signed {new Date(assignment.clientSignedAt).toLocaleDateString()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Action Menu */}
                        <div className="relative action-menu-container">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveActionMenu(activeActionMenu === assignment.id ? null : assignment.id);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                          >
                            <FaEllipsisV className="h-4 w-4" />
                          </button>

                          {/* Action Menu Dropdown */}
                          {activeActionMenu === assignment.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">{/* Increased z-index from z-10 to z-50 and shadow-lg to shadow-xl */}
                              <Link
                                href={`/admin/clients/${clientId}/forms/edit/${assignment.id}`}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setActiveActionMenu(null)}
                              >
                                <FaEdit className="mr-3 h-4 w-4 text-indigo-500" />
                                Edit Form
                              </Link>
                              
                              {assignment.hasSubmission && (
                                <>
                                  <Link
                                    href={`/admin/clients/${clientId}/forms/view/${assignment.id}`}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => setActiveActionMenu(null)}
                                  >
                                    <FaEye className="mr-3 h-4 w-4 text-green-500" />
                                    View Form
                                  </Link>
                                  
                                  <button
                                    onClick={() => handleDownloadPDF(assignment)}
                                    disabled={downloadingPDF === assignment.id}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                  >
                                    {downloadingPDF === assignment.id ? (
                                      <FaSpinner className="mr-3 h-4 w-4 text-orange-500 animate-spin" />
                                    ) : (
                                      <FaDownload className="mr-3 h-4 w-4 text-orange-500" />
                                    )}
                                    {downloadingPDF === assignment.id ? 'Generating PDF...' : 'Download PDF'}
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* Form Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Assign Forms to {client?.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Select forms to assign to this client
                </p>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              {availableForms.length === 0 ? (
                <div className="text-center py-8">
                  <FaFileAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">No forms available to assign</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableForms.map((form) => {
                    // Check if this form is already assigned
                    const isAlreadyAssigned = assignments.some(
                      assignment => assignment.formId === form.id && assignment.formVersion === form.version
                    );
                    
                    return (
                      <div
                        key={`${form.id}-${form.version}`}
                        className={`flex items-center p-4 border rounded-xl transition-all duration-200 ${
                          isAlreadyAssigned 
                            ? 'bg-gray-50 border-gray-200 opacity-50' 
                            : selectedFormsToAssign.includes(form.id)
                            ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                            : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedFormsToAssign.includes(form.id)}
                          onChange={() => handleFormAssignmentSelection(form.id)}
                          disabled={isAlreadyAssigned}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
                        />
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">
                                {form.title}
                              </h4>
                              <p className="text-sm text-gray-500">
                                Version {form.version} • Key: {form.formKey}
                              </p>
                            </div>
                            {isAlreadyAssigned && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Already Assigned
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600">
                {selectedFormsToAssign.length} form(s) selected
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={assignFormsToClient}
                  disabled={selectedFormsToAssign.length === 0 || assigning}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {assigning ? (
                    <>
                      <FaSpinner className="inline mr-2 h-4 w-4 animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    `Assign ${selectedFormsToAssign.length} Form(s)`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signature Link Modal */}
      {showLinkModal && generatedLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Signature Link Generated
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Share this link with {client?.name} to collect signatures
                </p>
              </div>
              <button
                onClick={() => setShowLinkModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Signature Link:</p>
                    <p className="text-sm text-gray-600 bg-white p-3 rounded border break-all">
                      {generatedLink.url}
                    </p>
                  </div>
                  <button
                    onClick={() => copyLinkToClipboard(generatedLink.url)}
                    className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <FaCopy className="mr-2 h-4 w-4" />
                    Copy
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-900">Forms Included</p>
                  <p className="text-2xl font-bold text-blue-600">{generatedLink.formsCount}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-orange-900">Expires</p>
                  <p className="text-sm font-semibold text-orange-600">
                    {new Date(generatedLink.expiresAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Forms in this link:</p>
                <div className="space-y-2">
                  {generatedLink.forms.map((form, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <FaFileAlt className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-700">{form.formTitle}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <Link
                href={`/admin/clients/${clientId}/signature-links`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setShowLinkModal(false)}
              >
                <FaLink className="mr-2 h-4 w-4" />
                Manage All Links
              </Link>
              
              <button
                onClick={() => setShowLinkModal(false)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Common Fields Warning Modal */}
      <CommonFieldsWarningModal
        isOpen={showCommonFieldsWarning}
        onClose={() => setShowCommonFieldsWarning(false)}
        onProceed={handleProceedToEditCommonFields}
        clientName={client?.name}
        assignments={assignments}
        onDownloadForm={downloadFormForWarningModal}
      />

      {/* Common Fields Modal */}
      <CommonFieldsModal
        isOpen={showCommonFieldsModal}
        onClose={() => setShowCommonFieldsModal(false)}
        commonFields={commonFields}
        onFieldChange={handleCommonFieldsChange}
        onSave={updateCommonFields}
        isUpdating={updatingCommonFields}
        clientName={client?.name}
      />
    </div>
  );
}
