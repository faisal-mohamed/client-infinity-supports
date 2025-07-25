'use client';

import { useSession } from 'next-auth/react';
import { FaUserCircle, FaBell, FaSun, FaMoon } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function UserWelcome() {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return {
        text: 'Good morning',
        icon: FaSun,
        message: 'Ready to start a productive day?',
      };
    }
    if (hour < 18) {
      return {
        text: 'Good afternoon',
        icon: FaSun,
        message: 'Hope your day is going well!',
      };
    }
    return {
      text: 'Good evening',
      icon: FaMoon,
      message: 'Time to wrap up the day!',
    };
  };

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

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  return (
    <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8 mb-6 sm:mb-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 w-full">
        <div className="flex items-start gap-6">
          <div className="relative">
            {session?.user?.image ? (
              <div className="relative">
                <img
                  src={session.user.image}
                  alt={session?.user?.name || 'User'}
                  className="h-20 w-20 rounded-2xl border-4 border-white shadow-lg object-cover"
                />
              </div>
            ) : (
              <div className="h-20 w-20 bg-gradient-to-r from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <FaUserCircle className="h-12 w-12" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-2">
            {/* <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl shadow-lg">
                <GreetingIcon className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800">
                {greeting.text}, {session?.user?.name || 'Admin'}!
              </h1>
            </div> */}
            <h1 className="text-3xl font-bold text-slate-800">
  Welcome back, {session?.user?.name || 'Admin'}! Here's your overview.
</h1>

          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/admin/notifications">
            <div className="relative cursor-pointer group">
              <div className="bg-gradient-to-r from-slate-100 to-white p-4 rounded-xl shadow-lg border-2 border-slate-200 hover:border-rose-300 hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                <FaBell
                  className={`h-6 w-6 ${
                    unreadCount > 0 ? 'text-rose-600' : 'text-slate-400'
                  } group-hover:text-rose-600 transition-colors`}
                />
              </div>
              {unreadCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs font-bold rounded-full h-7 w-7 flex items-center justify-center animate-bounce shadow-lg">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </div>
              )}
              {!loading && unreadCount === 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full border-2 border-white"></div>
              )}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}