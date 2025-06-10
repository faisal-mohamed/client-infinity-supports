// 'use client';

// import { useSession } from 'next-auth/react';

// export default function UserWelcome() {
//   const { data: session } = useSession();
  
//   return (
//     <div className="mb-8">
//       <h1 className="text-2xl font-bold text-gray-900">
//         Welcome, {session?.user?.name || 'Admin'}
//       </h1>
//       <p className="text-gray-600 mt-1">Here's an overview of your system</p>
//     </div>
//   );
// }


'use client';

import { useSession } from 'next-auth/react';
import { FaUserCircle } from 'react-icons/fa';

export default function UserWelcome() {
  const { data: session } = useSession();

  // Get current time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Get current date in a nice format
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
      <div className="flex items-center">
        <div className="hidden md:block">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={session?.user?.name || 'User'}
              className="h-14 w-14 rounded-full border-2 border-indigo-100"
            />
          ) : (
            <div className="h-14 w-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
              <FaUserCircle className="h-10 w-10" />
            </div>
          )}
        </div>
        <div className="md:ml-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {getGreeting()}, {session?.user?.name || 'Admin'}
          </h1>
          <p className="text-gray-500 mt-1">
            Here's an overview of your system
          </p>
        </div>
      </div>
      <div className="mt-4 md:mt-0 flex items-center">
        <div className="bg-indigo-50 px-4 py-2 rounded-lg">
          <p className="text-sm text-indigo-700 font-medium">
            {getCurrentDate()}
          </p>
        </div>
      </div>
    </div>
  );
}