"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BullyingHarassmentFormPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [staff, setStaff] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`/api/staff/onboard/${token}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error);
        
        setStaff(data.staff);
      } catch (error: any) {
        console.error('Error loading data:', error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) loadData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bullying & Harassment Training</h1>
              <p className="text-gray-600">{staff?.firstName} {staff?.surname}</p>
            </div>
            <button
              onClick={() => router.push(`/staff/onboard/${token}`)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              ← Back to Forms
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600 mb-4">Bullying & Harassment Training form component will be implemented here.</p>
          
          <div className="flex gap-4 mt-8 pt-6 border-t">
            <button
              onClick={() => router.push(`/staff/onboard/${token}`)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Mark as Complete (Placeholder)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
