"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
// Temporarily using placeholder icons to fix build issues
const FaArrowLeft = ({ className }: { className?: string }) => <span className={className}>←</span>;
const FaEdit = ({ className }: { className?: string }) => <span className={className}>✏️</span>;
const FaSignature = ({ className }: { className?: string }) => <span className={className}>✍️</span>;
const FaDownload = ({ className }: { className?: string }) => <span className={className}>⬇️</span>;
const FaUser = ({ className }: { className?: string }) => <span className={className}>👤</span>;
const FaCalendarAlt = ({ className }: { className?: string }) => <span className={className}>📅</span>;
const FaSpinner = ({ className }: { className?: string }) => <span className={className}>⏳</span>;
import { useToast } from '@/components/ui/Toast';
import { getFormComponent } from '@/app/forms/registry';
import { fetchFormSpecificSettings } from '@/lib/settings';

// Types
interface FormAssignmentData {
  id: number;
  clientId: number;
  formId: number;
  formVersion: number;
  form: {
    id: number; // Add form ID for PDF generation
    formKey: string;
    title: string;
    schema: any;
  };
  client: {
    name: string;
    email: string;
  };
  submissionData?: any; // FormSubmission data
  submissionId?: number; // Add submission ID for PDF generation
  clientSignature?: string;
  clientSignedAt?: string;
}

export default function FormViewPageClient() {
  const params = useParams();
  const { showToast } = useToast();
  
  const clientId = parseInt(params.id as string);
  const assignmentId = parseInt(params.assignmentId as string);
  
  const [assignment, setAssignment] = useState<FormAssignmentData | null>(null);
  const [commonFields, setCommonFields] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  const [settings, setSettings] = useState({});


  // Load assignment and submission data
  useEffect(() => {
    loadAssignmentData();
  }, [assignmentId]);

  const loadAssignmentData = async () => {
  try {
    setLoading(true);

    // 📦 Fetch both assignment and settings in parallel
    const [assignmentRes, fetchedSettings] = await Promise.all([
      fetch(`/api/form-assignments/${assignmentId}`),
      fetchFormSpecificSettings()
    ]);

    if (!assignmentRes.ok) throw new Error('Failed to load assignment data');
    
    const data = await assignmentRes.json();
    console.log('Loaded assignment data:', data.commonFields);

    setAssignment(data.assignment);
    setCommonFields(data.commonFields || {});
    setSettings(fetchedSettings); // ✅ store settings

  } catch (error) {
    console.error('Error loading assignment or settings:', error);
    showToast({
      type: 'error',
      title: 'Error',
      message: 'Failed to load form data or settings',
      duration: 3000,
    });
  } finally {
    setLoading(false);
  }
};


  // Check if this is a person-centered plan form
  const isPersonCenteredPlan = () => {
    return assignment?.form?.formKey === 'person_centred_plan' || 
           assignment?.form?.title?.toLowerCase().includes('person cent');
  };

  // Handle download button click
  const handleDownloadButtonClick = () => {
    handleDownloadPDF();
  };

  // Download PDF function
  const handleDownloadPDF = async () => {
    if (!assignment || !assignment.submissionId) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Cannot download PDF: Form submission not found',
        duration: 3000,
      });
      return;
    }

    try {
      setDownloadingPDF(true);
      
      const response = await fetch(`/api/generate-pdf/${assignment.submissionId}/${assignment.form.id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${assignment.form.title.replace(/[^a-zA-Z0-9]/g, '_')}_${assignment.client.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showToast({
        type: 'success',
        title: 'Success',
        message: 'PDF downloaded successfully',
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
      setDownloadingPDF(false);
    }
  };

 if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
        <div className="flex justify-center items-center h-80">
              <div className="text-center">
                {/* Spinner */}
                <div className="w-20 h-20 border-4 border-t-rose-500 border-rose-200 rounded-full animate-spin mx-auto mb-6"></div>

                {/* Text */}
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Loading View Form
                </h3>
                <p className="text-slate-600 font-medium">
                  Please wait...
                </p>

                {/* Bouncing dots */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
      </div>
    );
  }

  if (!assignment || !assignment.submissionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center bg-white rounded-xl shadow-sm p-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUser className="h-8 w-8 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {!assignment ? 'Form Not Found' : 'Form Not Filled Yet'}
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {!assignment 
                ? 'The requested form assignment could not be found.'
                : 'This form has not been filled by admin yet.'
              }
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link 
                href={`/admin/clients/${clientId}/forms`}
                className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FaArrowLeft className="mr-2 h-4 w-4" />
                Back to Forms List
              </Link>
              {assignment && (
                <Link 
                  href={`/admin/clients/${clientId}/forms/edit/${assignmentId}`}
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <FaEdit className="mr-2 h-4 w-4" />
                  Fill This Form
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get the appropriate form component from registry
  let FormViewComponent;
  try {
    FormViewComponent = getFormComponent(assignment.form.formKey, 'view');
  } catch (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center bg-white rounded-xl shadow-sm p-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUser className="h-8 w-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Form Component Not Found</h1>
            <p className="text-gray-600 mb-8">
              No view component found for form: {assignment.form.formKey}
            </p>
            <Link 
              href={`/admin/clients/${clientId}/forms`}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FaArrowLeft className="mr-2 h-4 w-4" />
              Back to Forms List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Enhanced Header */}
   <div className="bg-white shadow-sm border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    {/* Back Button */}
    <div className="flex items-center mb-4">
      <Link 
        href={`/admin/clients/${clientId}/forms`}
        className="flex items-center px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200 group"
      >
        <FaArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
        Back to Forms
      </Link>
    </div>

    {/* Main Header */}
    <div className="flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg">
          <FaUser className="h-6 w-6 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-slate-900 truncate">
            {assignment.form.title}
          </h1>
          <div className="flex items-center text-sm text-slate-600 space-x-4 mt-1">
            <span className="font-medium">{assignment.client.name}</span>
            <span className="text-slate-400">•</span>
            <span className="truncate">{assignment.client.email}</span>
            <span className="text-slate-400">•</span>
            <span className="flex items-center whitespace-nowrap">
              <FaCalendarAlt className="h-3 w-3 mr-1" />
              Version {assignment.formVersion}
            </span>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3 flex-shrink-0">
        {/* Signature Status */}
        {assignment.clientSignature && (
          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200 text-emerald-700 min-w-[130px]">
            <FaSignature className="h-4 w-4" />
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-sm">Signed</span>
              <span className="text-xs text-emerald-600">
                {new Date(assignment.clientSignedAt!).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {/* Download PDF Button */}
        <button
          onClick={handleDownloadButtonClick}
          disabled={downloadingPDF}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-medium rounded-lg hover:from-rose-600 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          title="Download PDF"
        >
          {downloadingPDF ? (
            <>
              <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
              <span className="hidden sm:inline">Generating...</span>
            </>
          ) : (
            <>
              <FaDownload className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </>
          )}
        </button>

        {/* Edit Button (Optional - currently commented) */}
        {/* <Link
          href={`/admin/clients/${clientId}/forms/edit/${assignmentId}`}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-900 text-white font-medium rounded-lg hover:from-slate-800 hover:to-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <FaEdit className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Edit</span>
        </Link> */}
      </div>
    </div>
  </div>
</div>


      {/* Form Content with Enhanced Styling */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
          <FormViewComponent
            formSchemas={assignment?.form?.schema}
            formData={assignment?.submissionData}
            showSignature={!!assignment?.clientSignature}
            existingSignature={assignment?.clientSignature}
            isAdminView={true}
            commonFieldsData={commonFields}
            settings={settings}
            mode="pdf"
          />
        </div>
      </div>

      {/* Person Centered Plan - Goals, Support Information & Informal Supports Section */}
      {isPersonCenteredPlan() && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ===== GOALS & OUTCOMES SECTION ===== */}
          <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden mb-8">
            {/* Header with Icon - Like PDF header */}
            <div className="bg-white border-b border-gray-300 px-6 py-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-bold text-gray-800">4. Goals & Outcomes</h3>
              </div>
            </div>

            {/* Content Area - Like PDF content */}
            <div className="px-6 py-6">
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((goalNum) => {
                  const goal = assignment?.submissionData?.[`goal${goalNum}`] || commonFields?.[`goal${goalNum}`] || '';
                  const rating = assignment?.submissionData?.[`rating${goalNum}`] || commonFields?.[`rating${goalNum}`] || '';
                  const actions = assignment?.submissionData?.[`actions${goalNum}`] || commonFields?.[`actions${goalNum}`] || '';
                  const byWhom = assignment?.submissionData?.[`byWhom${goalNum}`] || commonFields?.[`byWhom${goalNum}`] || '';
                  const byWhen = assignment?.submissionData?.[`byWhen${goalNum}`] || commonFields?.[`byWhen${goalNum}`] || '';
                  const reviewDate = assignment?.submissionData?.[`reviewDate${goalNum}`] || commonFields?.[`reviewDate${goalNum}`] || '';
                  
                  if (!goal && !rating && !actions && !byWhom && !byWhen && !reviewDate) return null;
                  
                  return (
                    <div key={goalNum} className="border border-gray-300 rounded">
                      {/* Goal label with badge */}
                      <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex items-center justify-between">
                        <span className="font-semibold text-gray-800 text-sm">Goal {goalNum}</span>
                        {rating && (
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            rating.toLowerCase().includes('completely achieved') 
                              ? 'bg-green-100 text-green-700' 
                              : rating.toLowerCase().includes('new') 
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {rating}
                          </span>
                        )}
                      </div>
                      
                      {/* Content with proper formatting */}
                      <div className="px-4 py-3 bg-white text-sm">
                        {goal && <p className="text-gray-700 mb-2 leading-relaxed">{goal}</p>}
                        {actions && <p className="text-gray-700 mb-2 leading-relaxed">{actions}</p>}
                        
                        {/* Footer with metadata */}
                        <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between text-xs text-gray-600">
                          {byWhom && <span><strong>By Whom:</strong> {byWhom}</span>}
                          {byWhen && <span><strong>By When:</strong> {byWhen}</span>}
                          {reviewDate && <span><strong>Review Date:</strong> {reviewDate}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer bar */}
            <div className="bg-gray-50 border-t border-gray-300 px-6 py-3 text-xs text-gray-600">
              <span>Person Centered Plan</span>
            </div>
          </div>

          {/* ===== SUPPORT INFORMATION SECTION ===== */}
          <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden mb-8">
            {/* Header with Icon */}
            <div className="bg-white border-b border-gray-300 px-6 py-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="text-lg font-bold text-gray-800">5. Support Information</h3>
              </div>
            </div>

            {/* Content Area */}
            <div className="px-6 py-6">
              <div className="space-y-3">
                {(assignment?.submissionData?.restrictivePractices || commonFields?.restrictivePractices) && (
                  <div className="border border-gray-300 rounded">
                    <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
                      <span className="font-semibold text-gray-800 text-sm">Any Restrictive Practices?</span>
                    </div>
                    <div className="px-4 py-3 bg-white text-sm text-gray-700">
                      {assignment?.submissionData?.restrictivePractices || commonFields?.restrictivePractices}
                    </div>
                  </div>
                )}
                
                {(assignment?.submissionData?.organizationName || commonFields?.organizationName) && (
                  <div className="border border-gray-300 rounded">
                    <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
                      <span className="font-semibold text-gray-800 text-sm">Name of organization</span>
                    </div>
                    <div className="px-4 py-3 bg-white text-sm text-gray-700">
                      {assignment?.submissionData?.organizationName || commonFields?.organizationName}
                    </div>
                  </div>
                )}
                
                {(assignment?.submissionData?.contactPersonOrg || commonFields?.contactPersonOrg) && (
                  <div className="border border-gray-300 rounded">
                    <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
                      <span className="font-semibold text-gray-800 text-sm">Contact person</span>
                    </div>
                    <div className="px-4 py-3 bg-white text-sm text-gray-700">
                      {assignment?.submissionData?.contactPersonOrg || commonFields?.contactPersonOrg}
                    </div>
                  </div>
                )}
                
                {(assignment?.submissionData?.contactNumberOrg || commonFields?.contactNumberOrg) && (
                  <div className="border border-gray-300 rounded">
                    <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
                      <span className="font-semibold text-gray-800 text-sm">Contact number</span>
                    </div>
                    <div className="px-4 py-3 bg-white text-sm text-gray-700">
                      {assignment?.submissionData?.contactNumberOrg || commonFields?.contactNumberOrg}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer bar */}
            <div className="bg-gray-50 border-t border-gray-300 px-6 py-3 text-xs text-gray-600">
              <span>Person Centered Plan</span>
            </div>
          </div>

          {/* ===== INFORMAL SUPPORTS SECTION ===== */}
          <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
            {/* Header with Icon */}
            <div className="bg-white border-b border-gray-300 px-6 py-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-lg font-bold text-gray-800">6. Informal Supports</h3>
              </div>
            </div>

            {/* Content Area */}
            <div className="px-6 py-6">
              <div className="border border-gray-300 rounded overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-600 text-white">
                      <th className="px-4 py-2 text-left font-semibold">Informal Support</th>
                      <th className="px-4 py-2 text-left font-semibold">Role</th>
                      <th className="px-4 py-2 text-left font-semibold">Frequency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4].map((supportNum) => {
                      const support = assignment?.submissionData?.[`support${supportNum}`] || commonFields?.[`support${supportNum}`] || '';
                      const role = assignment?.submissionData?.[`role${supportNum}`] || commonFields?.[`role${supportNum}`] || '';
                      const frequency = assignment?.submissionData?.[`frequency${supportNum}`] || commonFields?.[`frequency${supportNum}`] || '';
                      
                      if (!support && !role && !frequency) return null;
                      
                      return (
                        <tr key={supportNum} className="border-b border-gray-300 bg-white">
                          <td className="px-4 py-3 text-gray-800">{support || '-'}</td>
                          <td className="px-4 py-3 text-gray-700">{role || '-'}</td>
                          <td className="px-4 py-3 text-gray-700">{frequency || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer bar */}
            <div className="bg-gray-50 border-t border-gray-300 px-6 py-3 text-xs text-gray-600">
              <span>Person Centered Plan</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
