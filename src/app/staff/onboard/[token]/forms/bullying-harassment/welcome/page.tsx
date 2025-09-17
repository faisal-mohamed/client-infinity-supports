"use client";

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Lazy import the PDF viewer used in admin page
const BullyingHarassmentTrainingView = dynamic(() => import('@/app/form-components/staff/bullying-harassment-training/View'), { ssr: false });

export default function BullyingHarassmentTrainingWelcomePage() {
  const { token } = useParams<{ token: string }>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => setLoaded(true), []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Bullying and Harassment Training</h1>
        <p className="text-gray-600 mb-6">Please review the training materials and complete the acknowledgment form in the next step.</p>
        {loaded && <BullyingHarassmentTrainingView data={{}} />}
      </div>
    </div>
  );
}
