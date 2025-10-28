'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();
  
  const handleSignOut = async () => {
    // Get the current origin (includes protocol, domain, and port)
    const origin = window.location.origin;
    
    // Sign out and then redirect to the login page on the same origin
    await signOut({ redirect: false });
    router.push(`${origin}/admin/login`);
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex w-full items-center px-4 py-2 text-white hover:bg-indigo-600 rounded-lg transition duration-150"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-3"
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
