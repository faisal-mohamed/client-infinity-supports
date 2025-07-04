"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEdit, FaEye, FaArrowLeft, FaPlus, FaSignature, FaCheck, FaClock, FaFileAlt, FaTimes, FaLink, FaCopy } from 'react-icons/fa';
import { useToast } from '@/components/ui/Toast';
import { getAllForms } from '@/app/forms/registry';

// Types
interface FormAssignmentWithDetails {
  id: number;
  formId: number;
  formVersion: number;
  assignedAt: string;
  displayOrder: number;
  form: {
    id: number;
    formKey: string;
    title: string;
    version: number;
  };
  // Check if FormSubmission exists
  hasSubmission: boolean;
  submissionId?: number;
  filledByAdmin: boolean;
  adminFilledAt?: string;
  clientSignature?: string;
  clientSignedAt?: string;
}

interface ClientInfo {
  id: number;
  name: string;
  email: string;
}

interface AvailableForm {
  id: number;
  formKey: string;
  title: string;
  version: number;
}

export default function ClientFormsPageClient() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  
  const clientId = parseInt(params.id as string);
  
  const [client, setClient] = useState<ClientInfo | null>(null);
  const [assignments, setAssignments] = useState<FormAssignmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForms, setSelectedForms] = useState<number[]>([]);
  const [generatingLink, setGeneratingLink] = useState(false);
  
  // Form assignment modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [availableForms, setAvailableForms] = useState<AvailableForm[]>([]);
  const [selectedFormsToAssign, setSelectedFormsToAssign] = useState<number[]>([]);
  const [assigning, setAssigning] = useState(false);

  // Signature link modal state
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<{
    url: string;
    token: string;
    formsCount: number;
    forms: { formTitle: string; formKey: string; }[];
    expiresAt: string;
  } | null>(null);

  // Load client and form assignments
  useEffect(() => {
    loadClientForms();
    loadAvailableForms();
  }, [clientId]);

  const loadClientForms = async () => {
    try {
      setLoading(true);
      
      // Get client info and form assignments
      const response = await fetch(`/api/clients/${clientId}/form-assignments`);
      if (!response.ok) throw new Error('Failed to load client forms');
      
      const data = await response.json();
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
      // Get all available forms from the system
      const response = await fetch('/api/forms');
      if (!response.ok) throw new Error('Failed to load available forms');
      
      const data = await response.json();
      console.log('Available forms:', data);
      setAvailableForms(data || []);
      
    } catch (error) {
      console.error('Error loading available forms:', error);
    }
  };

  const handleFormSelection = (assignmentId: number) => {
    setSelectedForms(prev => 
      prev.includes(assignmentId) 
        ? prev.filter(id => id !== assignmentId)
        : [...prev, assignmentId]
    );
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

  const generateSignatureLink = async () => {
    if (selectedForms.length === 0) {
      showToast({
        type: 'error',
        title: 'No Forms Selected',
        message: 'Please select at least one form for signature',
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
      
      // Show modal instead of toast
      setGeneratedLink({
        url: data.signatureUrl,
        token: data.token,
        formsCount: data.formsCount,
        forms: data.forms,
        expiresAt: data.expiresAt,
      });
      setShowLinkModal(true);

      // Reset selection
      setSelectedForms([]);
      
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

  const getFormStatus = (assignment: FormAssignmentWithDetails) => {
    if (assignment.clientSignature) {
      return { status: 'Signed', color: 'text-green-600 bg-green-100', icon: FaCheck };
    } else if (assignment.filledByAdmin) {
      return { status: 'Filled by Admin', color: 'text-blue-600 bg-blue-100', icon: FaFileAlt };
    } else {
      return { status: 'Not Filled', color: 'text-gray-600 bg-gray-100', icon: FaClock };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link 
            href="/admin/clients" 
            className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FaArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Forms for {client?.name}
            </h1>
            <p className="text-gray-600 mt-1">{client?.email}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => setShowAssignModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
          >
            <FaPlus className="mr-2" />
            Assign Forms
          </button>

          <Link
            href={`/admin/clients/${clientId}/signature-links`}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors"
          >
            <FaLink className="mr-2" />
            View Signature Links
          </Link>
          
          <button
            onClick={generateSignatureLink}
            disabled={selectedForms.length === 0 || generatingLink}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedForms.length === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            <FaSignature className="mr-2" />
            {generatingLink ? 'Generating...' : `Generate Signature Link (${selectedForms.length})`}
          </button>
        </div>
      </div>

      {/* Forms List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Assigned Forms</h2>
        </div>

        {assignments.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FaFileAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Forms Assigned</h3>
            <p className="text-gray-600">This client has no forms assigned yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Select
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Form Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignments.map((assignment) => {
                  const statusInfo = getFormStatus(assignment);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedForms.includes(assignment.id)}
                          onChange={() => handleFormSelection(assignment.id)}
                          disabled={!assignment.filledByAdmin}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaFileAlt className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {assignment.form.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              Version {assignment.form.version}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusInfo.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(assignment.assignedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/clients/${clientId}/forms/edit/${assignment.id}`}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <FaEdit className="mr-1 h-3 w-3" />
                            Edit
                          </Link>
                          {assignment.hasSubmission && (
                            <Link
                              href={`/admin/clients/${clientId}/forms/view/${assignment.id}`}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              <FaEye className="mr-1 h-3 w-3" />
                              View
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Assign Forms to {client?.name}
              </h3>
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
                        className={`flex items-center p-4 border rounded-lg transition-colors ${
                          isAlreadyAssigned 
                            ? 'bg-gray-50 border-gray-200 opacity-50' 
                            : selectedFormsToAssign.includes(form.id)
                            ? 'bg-indigo-50 border-indigo-200'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedFormsToAssign.includes(form.id)}
                          onChange={() => handleFormAssignmentSelection(form.id)}
                          disabled={isAlreadyAssigned}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
                        />
                        <div className="ml-3 flex-1">
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

            <div className="flex items-center justify-between p-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {selectedFormsToAssign.length} form(s) selected
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={assignFormsToClient}
                  disabled={selectedFormsToAssign.length === 0 || assigning}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedFormsToAssign.length === 0 || assigning
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {assigning ? 'Assigning...' : `Assign ${selectedFormsToAssign.length} Form(s)`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signature Link Generated Modal */}
      {showLinkModal && generatedLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Signature Link Generated Successfully
              </h3>
              <button
                onClick={() => setShowLinkModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <FaCheck className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">
                      Link Ready for {client?.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {generatedLink.formsCount} form(s) included • Expires {new Date(generatedLink.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Signature Link:
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={generatedLink.url}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-mono"
                    />
                    <button
                      onClick={() => copyLinkToClipboard(generatedLink.url)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <FaCopy className="mr-1 h-3 w-3" />
                      Copy
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Forms included in this link:
                  </h5>
                  <div className="space-y-2">
                    {generatedLink.forms.map((form, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <FaFileAlt className="h-4 w-4 mr-2 text-gray-400" />
                        {form.formTitle}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Next Steps
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Copy the link above and send it to your client</li>
                          <li>Client can access the link without any password</li>
                          <li>You can view all signature links in the "View Signature Links" section</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 border-t border-gray-200">
              <Link
                href={`/admin/clients/${clientId}/signature-links`}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                View All Signature Links
              </Link>
              <div className="flex space-x-3">
                <Link
                  href={generatedLink.url}
                  target="_blank"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FaEye className="mr-2 h-4 w-4" />
                  Preview Link
                </Link>
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
