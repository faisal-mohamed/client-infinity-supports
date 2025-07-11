


'use client';

import { useSession } from 'next-auth/react';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function UserWelcome() {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

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

  // Fetch notification count
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

  // Fetch notification count on component mount and set up polling
  useEffect(() => {
    if (session) {
      fetchNotificationCount();
      
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotificationCount, 30000);
      
      return () => clearInterval(interval);
    }
  }, [session]);

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
      <div className="mt-4 md:mt-0 flex items-center gap-4">
        {/* Notification Bell */}
        <Link href="/admin/notifications">
          <div className="relative cursor-pointer group">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group-hover:border-indigo-300">
              <FaBell className={`h-5 w-5 ${unreadCount > 0 ? 'text-indigo-600' : 'text-gray-400'} group-hover:text-indigo-600 transition-colors`} />
            </div>
            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                {unreadCount > 99 ? '99+' : unreadCount}
              </div>
            )}
          </div>
        </Link>
        
        {/* Date Display */}
        {/* <div className="bg-indigo-50 px-4 py-2 rounded-lg">
          <p className="text-sm text-indigo-700 font-medium">
            {getCurrentDate()}
          </p>
        </div> */}
      </div>
    </div>
  );
}