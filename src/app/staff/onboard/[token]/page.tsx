"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface FormStatus {
  key: string;
  name: string;
  route: string;
  completed: boolean;
  enabled: boolean;
}

const FORM_SEQUENCE = [
  { key: 'employeeDetails', name: 'Employee Details', route: 'employee-details' },
  { key: 'employee_welcome', name: 'Employee Welcome Pack', route: 'employee-welcome' },
  { key: 'support_worker', name: 'Position Description', route: 'support-worker' },
  { key: 'pre_employment_medical', name: 'Pre-Employment Medical', route: 'pre-employment-medical' },
  { key: 'ndis_workforce_capability', name: 'NDIS Workforce Capability Framework', route: 'ndis-workforce-capability' },
  { key: 'bullying_harassment_training', name: 'Bullying & Harassment Training', route: 'bullying-harassment-training' },
  { key: 'bullying_training', name: 'Bullying Training', route: 'bullying-training' },
  { key: 'ndis_code_of_conduct', name: 'NDIS Code of Conduct', route: 'ndis-code-of-conduct' },
  { key: 'fair_work_information', name: 'Fair Work Information Statement', route: 'fair-work-information' },
  { key: 'casual_employment_information', name: 'Casual Employment Information Statement', route: 'casual-employment-information' },
  { key: 'orientation', name: 'Staff Orientation', route: 'orientation' },
  { key: 'govt_tax', name: 'Government Tax', route: 'govt-tax' },
  { key: 'super_choice_form', name: 'Superannuation Standard Choice Form', route: 'super-choice-form' },
  { key: 'vehicle_safety_inspection', name: 'Vehicle Safety Inspection Checklist', route: 'vehicle-safety-inspection' },
  { key: 'conflict_of_interest', name: 'Conflict of Interest Disclosure', route: 'conflict-of-interest' }
];

export default function StaffOnboardingPage() {
  const { token } = useParams<{ token: string }>();
  const [staff, setStaff] = useState<any>(null);
  const [forms, setForms] = useState<FormStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStaffData = async () => {
      try {
        const res = await fetch(`/api/staff/onboard/${token}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to load staff data');
        }

        setStaff(data.staff);
        
        // Calculate form completion status and enable next form
        const formStatuses = FORM_SEQUENCE.map((form, index) => {
          const isCompleted = !!data.submissions[form.key];
          const isEnabled = index === 0 || forms[index - 1]?.completed || 
                           FORM_SEQUENCE.slice(0, index).every(f => !!data.submissions[f.key]);
          
          return {
            key: form.key,
            name: form.name,
            route: form.route,
            completed: isCompleted,
            enabled: isEnabled
          };
        });

        // Enable first form if none completed, or next form after last completed
        const lastCompletedIndex = formStatuses.findLastIndex(f => f.completed);
        formStatuses.forEach((form, index) => {
          form.enabled = index <= lastCompletedIndex + 1;
        });

        setForms(formStatuses);
      } catch (error: any) {
        console.error('Error loading staff data:', error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) loadStaffData();
  }, [token]);

  // Refresh data when page becomes visible (user returns from form)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && token) {
        const loadStaffData = async () => {
          try {
            const res = await fetch(`/api/staff/onboard/${token}`);
            const data = await res.json();
            
            if (res.ok) {
              const formStatuses = FORM_SEQUENCE.map((form, index) => {
                const isCompleted = !!data.submissions[form.key];
                return {
                  key: form.key,
                  name: form.name,
                  route: form.route,
                  completed: isCompleted,
                  enabled: index === 0 || FORM_SEQUENCE.slice(0, index).every(f => !!data.submissions[f.key])
                };
              });

              const lastCompletedIndex = formStatuses.findLastIndex(f => f.completed);
              formStatuses.forEach((form, index) => {
                form.enabled = index <= lastCompletedIndex + 1;
              });

              setForms(formStatuses);
            }
          } catch (error) {
            console.error('Error refreshing data:', error);
          }
        };
        loadStaffData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-xl font-semibold text-red-600 mb-4">Invalid Link</h1>
          <p className="text-gray-600">This onboarding link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Staff Onboarding</h1>
          <p className="text-gray-600">Welcome {staff.firstName} {staff.surname}</p>
          <p className="text-sm text-gray-500 mt-2">
            Complete all forms in order to finish your onboarding process.
          </p>
        </div>

        {/* Forms List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-6">Onboarding Forms</h2>
          
          <div className="space-y-4">
            {forms.map((form, index) => (
              <div 
                key={form.key}
                className={`flex items-center justify-between p-4 border rounded-lg ${
                  form.completed 
                    ? 'bg-green-50 border-green-200' 
                    : form.enabled 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    form.completed 
                      ? 'bg-green-500 text-white' 
                      : form.enabled 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-300 text-gray-600'
                  }`}>
                    {form.completed ? '✓' : index + 1}
                  </div>
                  
                  <div>
                    <h3 className={`font-medium ${
                      form.enabled ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {form.name}
                    </h3>
                    <p className={`text-sm ${
                      form.completed 
                        ? 'text-green-600' 
                        : form.enabled 
                          ? 'text-blue-600' 
                          : 'text-gray-400'
                    }`}>
                      {form.completed ? 'Completed' : form.enabled ? 'Available' : 'Locked'}
                    </p>
                  </div>
                </div>

                <div>
                  {form.enabled ? (
                    <Link
                      href={`/staff/onboard/${token}/forms/${form.route}`}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        form.completed
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {form.completed ? 'Edit' : 'Start'}
                    </Link>
                  ) : (
                    <button 
                      disabled 
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-300 text-gray-500 cursor-not-allowed"
                    >
                      Locked
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="mt-8 pt-6 border-t">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{forms.filter(f => f.completed).length} of {forms.length} completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(forms.filter(f => f.completed).length / forms.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
