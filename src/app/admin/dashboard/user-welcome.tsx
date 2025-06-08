'use client';

import { useSession } from 'next-auth/react';

export default function UserWelcome() {
  const { data: session } = useSession();
  
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome, {session?.user?.name || 'Admin'}
      </h1>
      <p className="text-gray-600 mt-1">Here's an overview of your system</p>
    </div>
  );
}
