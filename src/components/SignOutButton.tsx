'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();
  
  const handleSignOut = async () => {
    const origin = window.location.origin;
    await signOut({ redirect: false });
    router.push(`${origin}/admin/login`);
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex w-full items-center px-4 py-2.5 text-azure-400 hover:bg-azure-50 hover:text-azure-700 rounded-xl transition-all duration-200 text-sm font-medium"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 mr-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      Sign Out
    </button>
  );
}
