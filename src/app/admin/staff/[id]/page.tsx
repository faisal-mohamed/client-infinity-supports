"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingView from '@/components/ui/LoadingView';
import { useToast } from '@/components/ui/Toast';
import FormItem from '@/app/components/components/client-forms/FormItem';
import { FormAssignmentWithDetails } from '@/app/admin/clients/[id]/forms/types';
import { FaSync } from 'react-icons/fa';

export default function StaffFormsPage() {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const [staff, setStaff] = useState<any>(null);
  const [assignments, setAssignments] = useState<FormAssignmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForms, setSelectedForms] = useState<number[]>([]);
  const [downloadingPDF, setDownloadingPDF] = useState<number | null>(null);

  useEffect(() => {
    if (id) loadStaffForms();
  }, [id]);

  // Refresh data when page becomes visible (e.g., when user navigates back from form view)
  // This ensures the status is updated after admin submits or edits a form
  useEffect(() => {
    let lastRefreshTime = Date.now();
    const REFRESH_INTERVAL = 2000; // Refresh if at least 2 seconds have passed (reduced for better UX)

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && id) {
        const now = Date.now();
        // Only refresh if enough time has passed to avoid excessive API calls
        if (now - lastRefreshTime > REFRESH_INTERVAL) {
          console.log('🟢 [Forms List] Page became visible, refreshing forms list...');
          lastRefreshTime = now;
          loadStaffForms();
        }
      }
    };

    // Also listen for focus event (when user switches back to this tab/window)
    const handleFocus = () => {
      if (id) {
        const now = Date.now();
        if (now - lastRefreshTime > REFRESH_INTERVAL) {
          console.log('🟢 [Forms List] Window focused, refreshing forms list...');
          lastRefreshTime = now;
          loadStaffForms();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [id]);

  const loadStaffForms = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/staff/${id}/form-assignments`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || errorData.details || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      if (!data.staff) {
        throw new Error('Staff not found');
      }
      
      setStaff(data.staff);
      setAssignments(data.assignments || []);
      
    } catch (error: any) {
      console.error('Error loading staff forms:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: error?.message || 'Failed to load staff forms',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSelect = (assignmentId: number, checked: boolean) => {
    if (checked) {
      setSelectedForms(prev => [...prev, assignmentId]);
    } else {
      setSelectedForms(prev => prev.filter(id => id !== assignmentId));
    }
  };

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
      
      // Convert formKey from snake_case to kebab-case for API endpoint
      const formKey = assignment.form.formKey;
      const formType = formKey.replace(/_/g, '-');
      const staffId = parseInt(id || '0');
      let response;
      
      // Check if form has a specific PDF route with merge=true (like ndis-workforce-capability, bullying-harassment-training)
      if (formKey === 'ndis_workforce_capability' || formKey === 'bullying_harassment_training') {
        // Try the specific PDF route with merge=true
        response = await fetch(`/api/staff/${staffId}/forms/${formType}/pdf?merge=true`);
        
        // If that fails, try without merge
        if (!response.ok) {
          response = await fetch(`/api/staff/${staffId}/forms/${formType}/pdf`);
        }
      } else {
        // Use the generic staff PDF endpoint for other forms
        response = await fetch(`/api/staff/${staffId}/forms/${formType}/pdf`);
        
        // If generic endpoint fails, try the generic PDF generation endpoint as fallback
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
      a.download = `${assignment.form.title.replace(/[^a-zA-Z0-9]/g, '_')}_${staffName}.pdf`;
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

  if (loading) return <LoadingView title="Loading Staff Forms" message="Please wait..." />;
  if (!staff) return <div className="p-8">Staff not found</div>;

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Staff Forms - {staff.firstName} {staff.surname}</h1>
            <p className="text-gray-600 mt-1">{staff.email}</p>
          </div>
          <div className="flex gap-4">
            <Link 
              href={`/admin/staff/${id}/forms`} 
              className="text-sm text-rose-600 hover:underline"
            >
              Manage Forms
            </Link>
            <Link href="/admin/staff" className="text-sm text-rose-600 hover:underline">
              Back to Staff
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Assigned Forms</h2>
            <button
              onClick={() => loadStaffForms()}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              title="Refresh forms list"
            >
              <FaSync className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
          
          {assignments.length === 0 ? (
            <div className="text-gray-500 text-sm">No forms assigned yet.</div>
          ) : (
            <div className="space-y-3">
              {assignments.map((assignment) => (
                <FormItem
                  key={assignment.id}
                  assignment={assignment}
                  clientId={parseInt(id || '0')}
                  selectedForms={selectedForms}
                  downloadingPDF={downloadingPDF}
                  onFormSelect={handleFormSelect}
                  onDownloadPDF={handleDownloadPDF}
                  isStaff={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
