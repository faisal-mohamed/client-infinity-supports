// // layout.tsx with #f43f5e accent and white content background
// "use client";
// import React, { useState } from 'react';
// import { Montserrat } from 'next/font/google';
// import Link from 'next/link';
// import SignOutButton from '@/components/SignOutButton';
// import { ConfirmProvider } from '@/components/ui/Confirm';
// import Image from 'next/image';
// import { usePathname } from 'next/navigation';

// const montserrat = Montserrat({ subsets: ['latin'], weight: '400', display: 'swap' });

// const menuItems = [
//   {
//     href: '/admin/dashboard',
//     label: 'Dashboard',
//     icon: (
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//       </svg>
//     )
//   },
//   {
//     href: '/admin/clients',
//     label: 'Clients',
//     icon: (
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M9 20H4v-2a3 3 0 015.356-1.857M15 11a4 4 0 10-8 0 4 4 0 008 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
//       </svg>
//     )
//   },
//   {
//     href: '/admin/forms',
//     label: 'Forms',
//     icon: (
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//       </svg>
//     )
//   },
//   {
//     href: '/admin/settings',
//     label: 'Settings',
//     icon: (
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6.364-4.364a9 9 0 11-12.728 0 9 9 0 0112.728 0z" />
//       </svg>
//     )
//   }
// ];

// export default function AdminClientsLayout({ children }: { children: React.ReactNode }) {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const pathname = usePathname();
//   const isFormEditOrViewPage = pathname.includes('/forms/edit/') || pathname.includes('/forms/view/');
//   const accent = '#f43f5e';

//   return (
//     <div className={`min-h-screen bg-white text-black ${montserrat.className}`}>
//       <div className="flex min-h-screen">
//         {!isFormEditOrViewPage && (
//           <aside className="hidden lg:flex lg:w-72 flex-col fixed inset-y-0 bg-slate-900 text-white border-r border-slate-800 shadow-xl">
//             <div className="h-20 flex items-center justify-center bg-slate-800 border-b border-slate-700">
//               <div className="flex flex-col items-center">
//                 <Image src="/client_logo.png" alt="Client Logo" width={70} height={40} />
//                 <span className="text-sm font-semibold" style={{ color: '#fff' }}>Infinity Support WA</span>
//               </div>
//             </div>
//             <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
//               {menuItems.map((item) => {
//                 const isActive = pathname === item.href;
//                 return (
//                   <Link
//                     key={item.href}
//                     href={item.href}
//                     className={`group flex items-center px-4 py-3 rounded-lg font-medium transition duration-200 ${
//                       isActive
//                         ? `bg-slate-800 text-white border border-[${accent}]`
//                         : 'text-slate-300 hover:text-white hover:bg-slate-800 hover:border hover:border-slate-700'
//                     }`}
//                   >
//                     <div className="p-2 mr-3 rounded bg-white bg-opacity-10 group-hover:bg-opacity-20">
//                       {React.cloneElement(item.icon, {
//                         className: isActive ? `text-[${accent}]` : 'text-slate-400 group-hover:text-white'
//                       })}
//                     </div>
//                     <span>{item.label}</span>
//                   </Link>
//                 );
//               })}
//             </nav>
//             <div className="p-4 border-t border-slate-700 bg-slate-800">
//               <div className={`p-3 rounded-lg`} style={{ backgroundColor: accent }}>
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
//                     <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
//                     </svg>
//                   </div>
//                   <p className="text-white font-semibold text-sm">Admin User</p>
//                 </div>
//               </div>
//               <SignOutButton />
//             </div>
//           </aside>
//         )}

//         <main className={`flex-1 bg-white transition-all duration-300 ${isFormEditOrViewPage ? 'p-0' : 'p-8 pt-28 lg:pt-8 lg:ml-72'}`}>
//           <ConfirmProvider>{children}</ConfirmProvider>
//         </main>
//       </div>
//     </div>
//   );
// }



// layout.tsx with #f43f5e accent and white content background, using react-icons and hamburger for mobile
"use client";
import React, { useState } from 'react';
import { Montserrat } from 'next/font/google';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';
import { ConfirmProvider } from '@/components/ui/Confirm';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaTachometerAlt, FaUsers, FaFileAlt, FaCog, FaBars, FaTimes, FaUserTie, FaClipboardList } from 'react-icons/fa';

const montserrat = Montserrat({ subsets: ['latin'], weight: '400', display: 'swap' });

const accent = '#f43f5e';
const white = '#fff';

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: <FaTachometerAlt className="w-5 h-5 text-white" /> },
  { href: '/admin/clients', label: 'Clients', icon: <FaUsers className="w-5 h-5 text-white" /> },
  { href: '/admin/forms', label: 'Client Forms', icon: <FaFileAlt className="w-5 h-5 text-white" /> },
  { href: '/admin/staff', label: 'Staff', icon: <FaUserTie className="w-5 h-5 text-white" /> },
  { href: '/admin/staff-forms', label: 'Staff Forms', icon: <FaClipboardList className="w-5 h-5 text-white" /> },
  { href: '/admin/settings', label: 'Settings', icon: <FaCog className="w-5 h-5 text-white" /> }
];

export default function AdminClientsLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isFormEditOrViewPage = pathname.includes('/forms/edit/') || pathname.includes('/forms/view/');

  return (
    <div className={`min-h-screen bg-white text-black ${montserrat.className}`}>
      {!isFormEditOrViewPage && (
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white flex items-center justify-between px-4 shadow z-30">
          <div className="flex items-center gap-3">
            <Image src="/client_logo.png" alt="Logo" width={40} height={30} />
            <span className="font-semibold text-sm" style={{ color: white }}>Infinity Support WA</span>
          </div>
          <button onClick={() => setMobileMenuOpen(true)} aria-label="Open menu" title="Open menu">
            <FaBars className="w-6 h-6 text-white" />
          </button>
        </div>
      )}

      {mobileMenuOpen && !isFormEditOrViewPage && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative w-64 bg-slate-900 text-white h-full shadow-xl z-50 flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Image src="/client_logo.png" alt="Client Logo" width={40} height={30} />
                <span className="font-semibold text-sm" style={{ color: white }}>Infinity Support WA</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" title="Close menu">
                <FaTimes className="w-5 h-5 text-white" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition duration-200 ${
                      isActive
                        ? `bg-slate-800 text-white border border-[${accent}]`
                        : 'text-slate-300 hover:text-white hover:bg-slate-800 hover:border hover:border-slate-700'
                    }`}
                  >
                    <div className="text-white w-5 h-5 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-slate-700 bg-slate-800">
              <div className="p-3 rounded-lg" style={{ backgroundColor: accent }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold text-sm">Admin User</p>
                </div>
              </div>
              <SignOutButton />
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-h-screen pt-16 lg:pt-0">
        {!isFormEditOrViewPage && (
          <aside className="hidden lg:flex lg:w-72 flex-col fixed inset-y-0 bg-slate-900 text-white border-r border-slate-800 shadow-xl">
            <div className="h-20 flex items-center justify-center bg-slate-800 border-b border-slate-700">
              <div className="flex flex-col items-center">
                <Image src="/client_logo.png" alt="Client Logo" width={70} height={40} />
                <span className="text-sm font-semibold" style={{ color: white }}>Infinity Support WA</span>
              </div>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition duration-200 ${
                      isActive
                        ? `bg-slate-800 text-white border border-[${accent}]`
                        : 'text-slate-300 hover:text-white hover:bg-slate-800 hover:border hover:border-slate-700'
                    }`}
                  >
                    <div className="text-white w-5 h-5 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-slate-700 bg-slate-800">
              <div className="p-3 rounded-lg" style={{ backgroundColor: accent }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold text-sm">Admin User</p>
                </div>
              </div>
              <SignOutButton />
            </div>
          </aside>
        )}

        <main className={`flex-1 bg-white transition-all duration-300 ${isFormEditOrViewPage ? 'p-0' : 'p-8 pt-28 lg:pt-8 lg:ml-72'}`}>
          <ConfirmProvider>{children}</ConfirmProvider>
        </main>
      </div>
    </div>
  );
}
