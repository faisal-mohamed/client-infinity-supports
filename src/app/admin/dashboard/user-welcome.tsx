'use client';

import { useSession } from 'next-auth/react';
import { FaUserCircle, FaBell, FaSun, FaMoon } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function UserWelcome() {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotificationCount = async () => {
    try {
      const response = await fetch('/api/admin/notifications/count');
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notification count:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchNotificationCount();
      const interval = setInterval(fetchNotificationCount, 30000);
      return () => clearInterval(interval);
    }
  }, [session]);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <div className="flex items-center gap-4">
          <div className="relative">
            {session?.user?.image ? (
              <div className="relative">
                <img
                  src={session.user.image}
                  alt={session?.user?.name || 'User'}
                  className="h-12 w-12 rounded-xl border-2 border-white shadow-md object-cover"
                />
              </div>
            ) : (
              <div className="h-12 w-12 bg-gradient-to-r from-rose-500 to-rose-600 rounded-xl flex items-center justify-center text-white shadow-md">
                <FaUserCircle className="h-6 w-6" />
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full border-2 border-white shadow-md flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="space-y-0.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
              Welcome back, {session?.user?.name || 'Admin'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Here's a quick look at your latest activity and stats.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/admin/notifications">
            <div className="relative cursor-pointer group">
              <div className="bg-gradient-to-r from-slate-100 to-white p-3 rounded-lg shadow-sm border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all duration-200">
                <FaBell
                  className={`h-5 w-5 ${
                    unreadCount > 0 ? 'text-rose-600' : 'text-slate-400'
                  } group-hover:text-rose-600 transition-colors`}
                />
              </div>
              {unreadCount > 0 && (
                <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </div>
              )}
              {!loading && unreadCount === 0 && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full border-2 border-white"></div>
              )}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
