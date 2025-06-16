// import React from 'react';
// import { Montserrat } from 'next/font/google';
// import { getServerSession } from 'next-auth/next';
// import { redirect } from 'next/navigation';
// import Link from 'next/link';

// const montserrat = Montserrat({ subsets: ['latin'] });

// // Define menu items outside the component
// const menuItems = [
//   {
//     href: '/admin/dashboard',
//     label: 'Dashboard',
//     icon: (
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//       </svg>
//     ),
//   },
//   {
//     href: '/admin/clients',
//     label: 'Clients',
//     icon: (
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//       </svg>
//     ),
//   },
//   {
//     href: '/admin/forms',
//     label: 'Forms',
//     icon: (
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//       </svg>
//     ),
//   },
//   {
//     href: '/admin/reports',
//     label: 'Reports',
//     icon: (
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//       </svg>
//     ),
//   },
//   {
//     href: '/admin/contracts',
//     label: 'Contracts',
//     icon: (
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//       </svg>
//     ),
//   },
//   {
//     href: '/admin/settings',
//     label: 'Settings',
//     icon: (
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//       </svg>
//     ),
//   },
// ];

// export default async function AdminDashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   // Server-side session check
//   const session = await getServerSession();
//   if (!session) {
//     redirect('/admin/login');
//   }

//   return (
//     <div className={`min-h-screen bg-gray-50 ${montserrat.className}`}>
//       <div className="flex min-h-screen">
//         {/* Sidebar */}
//         <aside className="hidden md:flex md:w-64 flex-col fixed inset-y-0 bg-gradient-to-b from-indigo-700 to-indigo-900 text-white shadow-lg">
//           <div className="h-16 flex items-center justify-center border-b border-indigo-600">
//             <div className="flex items-center space-x-2">
//               <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
//                 <span className="text-indigo-700 text-lg font-bold">IS</span>
//               </div>
//               <span className="text-xl font-semibold">Infinity Support</span>
//             </div>
//           </div>

//           <nav className="flex-1 px-2 py-4 space-y-1">
//             {menuItems.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={`group flex items-center px-4 py-3 rounded-lg transition duration-200
//                   ${item.href === '/admin/clients'
//                     ? 'bg-indigo-600 border-l-4 border-white shadow-md font-semibold'
//                     : 'hover:bg-indigo-600'
//                   }`}
//               >
//                 {item.icon}
//                 {item.label}
//               </Link>
//             ))}
//           </nav>

//           <div className="p-4 border-t border-indigo-600">
//             <form action="/api/auth/signout" method="POST">
//               <button
//                 type="submit"
//                 className="flex w-full items-center px-4 py-2 text-white hover:bg-indigo-600 rounded-lg transition duration-150"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5 mr-3"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//                   />
//                 </svg>
//                 Sign Out
//               </button>
//             </form>
//           </div>
//         </aside>

//         {/* Mobile sidebar */}
//         <div className="md:hidden bg-indigo-700 text-white h-16 w-full fixed top-0 z-10 flex items-center justify-between px-4">
//           <div className="flex items-center space-x-2">
//             <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
//               <span className="text-indigo-700 text-lg font-bold">IS</span>
//             </div>
//             <span className="text-xl font-semibold">Infinity Support</span>
//           </div>

//           <button className="text-white focus:outline-none">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           </button>
//         </div>

//         {/* Main content */}
//         <main className="md:ml-64 flex-1 p-6 pt-20 md:pt-6">{children}</main>
//       </div>
//     </div>
//   );
// }


import React from 'react';
import { Montserrat } from 'next/font/google';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';

import Image from 'next/image';

const montserrat = Montserrat({ subsets: ['latin'], weight: '400', display: 'swap' });

// Define menu items outside the component
const menuItems = [
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/admin/clients',
    label: 'Clients',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    href: '/admin/forms',
    label: 'Forms',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    href: '/admin/reports',
    label: 'Reports',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    href: '/admin/contracts',
    label: 'Contracts',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side session check
  const session = await getServerSession();
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${montserrat.className}`}>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex md:w-64 flex-col fixed inset-y-0 bg-gradient-to-b from-indigo-700 to-indigo-900 text-white shadow-lg">
          <div className="h-16 flex items-center justify-center border-b border-indigo-600">
            <div className="flex items-center space-x-2 flex-col">
              {/* <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <span className="text-indigo-700 text-lg font-bold">IS</span>
              </div>
              <span className="text-xl font-semibold">Infinity Support</span> */}
             {/* <div className='flex flex-col'> */}
               <Image
              src={'/client_logo.png'}
              alt='Client Logo'
              width={70}
              height={40}
              />
              <span className="text-sm font-semibold">Infinity Support WA</span> 
             {/* </div> */}
            </div>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center px-4 py-3 rounded-lg transition duration-200
                  ${item.href === '/admin/clients'
                    ? 'bg-indigo-600 border-l-4 border-white shadow-md font-semibold'
                    : 'hover:bg-indigo-600'
                  }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

           <div className="p-4 border-t border-indigo-600">
                      <SignOutButton />
                    </div>
        </aside>

        {/* Mobile sidebar */}
        <div className="md:hidden bg-indigo-700 text-white h-16 w-full fixed top-0 z-10 flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <span className="text-indigo-700 text-lg font-bold">IS</span>
            </div>
            <span className="text-xl font-semibold">Infinity Support</span>
          </div>

          <button className="text-white focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Main content */}
        <main className="md:ml-64 flex-1 p-6 pt-20 md:pt-6">{children}</main>
      </div>
    </div>
  );
}
