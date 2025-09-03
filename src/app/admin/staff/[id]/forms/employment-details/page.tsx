"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getStaffFormComponent } from '@/app/forms/staff-registry';

export default function StaffEmploymentDetailsView() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const res = await fetch(`/api/staff/${id}/forms/employment-details`);
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error('Error loading form data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadFormData();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!data) return <div className="p-8">Form data not found</div>;

  const EmployeeDetailsView = getStaffFormComponent('employee_details', 'view');

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Employment Details</h1>
            <p className="text-gray-600 mt-1">{data.staff?.firstName} {data.staff?.surname}</p>
          </div>
          <Link href={`/admin/staff/${id}`} className="text-sm text-rose-600 hover:underline">Back to Forms</Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          
          {/* Form Status */}
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg mb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-medium text-green-800">Form Completed</p>
              <p className="text-sm text-green-600">
                Submitted on {new Date(data.createdAt).toLocaleDateString()}
                {data.staffSignature && ' • Digitally Signed'}
              </p>
            </div>
          </div>

          {/* Render the actual form component with data */}
          <div className="view-component-wrapper">
            <EmployeeDetailsView data={data} />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 mt-6 border-t">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Generate PDF
            </button>
            <Link 
              href={`/admin/staff/${id}/forms/employment-details/edit`}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Edit Form
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
