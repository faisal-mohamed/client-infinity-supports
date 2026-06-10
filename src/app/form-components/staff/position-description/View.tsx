"use client";

import PositionDescriptionForm from '@/app/staff/onboard/[token]/components/PositionDescriptionForm';

export default function PositionDescriptionView({ meta }: { meta?: any }) {
  // For admin view, we'll use a demo token
  const demoToken = 'demo-position-description';
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Position Description Form</h1>
          <p className="text-gray-600">Support Worker position description and requirements</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <PositionDescriptionForm 
            token={demoToken} 
            onValidityChange={() => {}} 
          />
        </div>
      </div>
    </div>
  );
}
