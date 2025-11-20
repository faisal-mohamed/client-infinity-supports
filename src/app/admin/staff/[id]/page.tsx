"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingView from '@/components/ui/LoadingView';

interface StaffForm {
  formType: string;
  formName: string;
  status: 'pending' | 'in_progress' | 'awaiting_admin' | 'fully_completed' | 'completed';
  completedAt?: string;
  hasSignature: boolean;
  hasAdminSignature?: boolean;
  hasViewPage?: boolean;
  requiresAdmin?: boolean;
}

export default function StaffFormsPage() {
  const { id } = useParams<{ id: string }>();
  const [staff, setStaff] = useState<any>(null);
  const [forms, setForms] = useState<StaffForm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStaffForms = async () => {
      try {
        const res = await fetch(`/api/staff/${id}/forms`);
        const data = await res.json();
        setStaff(data.staff);
        setForms(data.forms);
      } catch (error) {
        console.error('Error loading staff forms:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadStaffForms();
  }, [id]);

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
          <Link href="/admin/staff" className="text-sm text-rose-600 hover:underline">Back to Staff</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-4">Onboarding Forms</h2>
          
          {forms.length === 0 ? (
            <div className="text-gray-500 text-sm">No forms submitted yet.</div>
          ) : (
            <div className="space-y-3">
              {forms.map((form) => {
                // Determine status badge color and text
                const getStatusInfo = () => {
                  switch(form.status) {
                    case 'fully_completed':
                      return { color: 'bg-green-500', text: 'Fully Completed', textColor: 'text-green-700' };
                    case 'awaiting_admin':
                      return { color: 'bg-orange-500 animate-pulse', text: 'Awaiting Admin', textColor: 'text-orange-700' };
                    case 'completed':
                      return { color: 'bg-green-500', text: 'Completed', textColor: 'text-green-700' };
                    case 'in_progress':
                      return { color: 'bg-blue-500', text: 'In Progress', textColor: 'text-blue-700' };
                    default:
                      return { color: 'bg-gray-300', text: 'Not Started', textColor: 'text-gray-500' };
                  }
                };
                
                const statusInfo = getStatusInfo();
                const canView = ['completed', 'awaiting_admin', 'fully_completed'].includes(form.status);
                
                return (
                  <div key={form.formType} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${statusInfo.color}`}></div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium">{form.formName}</h3>
                        <p className={`text-sm ${statusInfo.textColor}`}>
                          {statusInfo.text}
                          {form.completedAt && ` • ${form.completedAt}`}
                          {form.hasSignature && ' • Staff Signed'}
                          {form.hasAdminSignature && ' • Admin Approved'}
                        </p>
                      </div>
                    </div>
                    
                    {canView && form.hasViewPage && (
                      <Link 
                        href={`/admin/staff/${id}/forms/${form.formType}`}
                        className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                          form.status === 'awaiting_admin' 
                            ? 'bg-orange-500 text-white hover:bg-orange-600'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {form.status === 'awaiting_admin' ? 'Review & Approve' : 'View Details'}
                      </Link>
                    )}
                    {canView && !form.hasViewPage && (
                      <span className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg text-sm cursor-not-allowed">
                        View Not Available
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
