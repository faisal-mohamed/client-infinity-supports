


'use client';

import { useSession } from 'next-auth/react';
import { FaUserCircle, FaBell, FaSun, FaMoon, FaCalendarAlt, FaClock, FaChevronRight, FaStar } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function UserWelcome() {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Get current time of day with icon and enhanced messaging
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return {
        text: 'Good morning',
        icon: FaSun,
        message: 'Ready to start a productive day?',
        gradient: 'from-amber-400 to-orange-500'
      };
    }
    if (hour < 18) {
      return {
        text: 'Good afternoon',
        icon: FaSun,
        message: 'Hope your day is going well!',
        gradient: 'from-blue-400 to-indigo-500'
      };
    }
    return {
      text: 'Good evening',
      icon: FaMoon,
      message: 'Time to wrap up the day!',
      gradient: 'from-purple-400 to-pink-500'
    };
  };

  // Get current date and time in a nice format
  const getCurrentDate = () => {
    const now = new Date();
    return {
      date: now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
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

  const greeting = getGreeting();
  const dateTime = getCurrentDate();
  const GreetingIcon = greeting.icon;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
        {/* Left Section - User Info */}
        <div className="flex items-center space-x-6">
          {/* Enhanced Avatar */}
          <div className="relative">
            {session?.user?.image ? (
              <div className="relative">
                <img
                  src={session.user.image}
                  alt={session?.user?.name || 'User'}
                  className="h-20 w-20 rounded-2xl border-4 border-white shadow-lg object-cover"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent to-white/20"></div>
              </div>
            ) : (
              <div className="h-20 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <FaUserCircle className="h-12 w-12" />
              </div>
            )}
            {/* Online Status Indicator */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className={`p-2 bg-gradient-to-r ${greeting.gradient} rounded-xl shadow-lg`}>
                <GreetingIcon className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {greeting.text}, {session?.user?.name || 'Admin'}!
              </h1>
            </div>
          
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-4">
          {/* Quick Stats Card */}
          {/* <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                <FaStar className="h-4 w-4 text-white" />
              </div>
            </div>
          </div> */}

          {/* Enhanced Notification Bell */}
          <Link href="/admin/notifications">
            <div className="relative cursor-pointer group">
              <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl shadow-lg border-2 border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                <FaBell className={`h-6 w-6 ${unreadCount > 0 ? 'text-indigo-600' : 'text-gray-400'} group-hover:text-indigo-600 transition-colors`} />
              </div>
              {unreadCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-7 w-7 flex items-center justify-center animate-bounce shadow-lg">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </div>
              )}
              {!loading && unreadCount === 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full border-2 border-white"></div>
              )}
            </div>
          </Link>

          {/* Quick Action Button */}
          {/* <Link href="/admin/clients">
            <div className="group cursor-pointer">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center space-x-3">
                <span className="font-semibold">Quick Access</span>
                <FaChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </Link> */}
        </div>
      </div>

     
    </div>
  );
}