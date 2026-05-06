'use client';

import { useSession } from 'next-auth/react';
import { FaUserCircle, FaBell } from 'react-icons/fa';
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
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 w-full">
      <div className="flex items-start gap-4">
        <div className="relative">
          {session?.user?.image ? (
            <div className="relative">
              <img
                src={session.user.image}
                alt={session?.user?.name || 'User'}
                className="h-14 w-14 rounded-xl border-2 border-gray-100 object-cover"
              />
            </div>
          ) : (
            <div className="h-14 w-14 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
              <FaUserCircle className="h-8 w-8" />
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Welcome back, {session?.user?.name || 'Admin'}!
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Here&apos;s a quick look at your latest activity and stats.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Link href="/admin/notifications">
          <div className="relative cursor-pointer group">
            <div className="p-3 rounded-xl border border-gray-200 hover:border-brand-200 hover:bg-brand-50 transition-all duration-200">
              <FaBell
                className={`h-5 w-5 ${
                  unreadCount > 0 ? 'text-brand-600' : 'text-gray-400'
                } group-hover:text-brand-600 transition-colors`}
              />
            </div>
            {unreadCount > 0 && (
              <div className="absolute -top-1.5 -right-1.5 bg-brand-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </div>
            )}
            {!loading && unreadCount === 0 && (
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white"></div>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
