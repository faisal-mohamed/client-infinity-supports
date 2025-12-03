'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaBell, FaUser, FaFileAlt, FaClock, FaCheck, FaArrowLeft, FaCircle, FaSignature, FaCalendarDay, FaUserClock, FaCheckCircle } from 'react-icons/fa';
import useRequireAuth from '../../hooks/useRequireAuth';

interface Notification {
  id: number;
  isRead: boolean;
  createdAt: string;
  formAssignmentStatus?: string; // New: form assignment status
  client: {
    id: number;
    name: string;
    email: string;
  };
  formSubmission: {
    id: number;
    form: {
      id: number;
      title: string;
      formKey: string;
    };
  };
}

interface NotificationResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface GroupedNotifications {
  [key: string]: Notification[];
}

export default function NotificationsPage() {
  const { session, status } = useRequireAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Group notifications by date
  const groupNotificationsByDate = (notifications: Notification[]): GroupedNotifications => {
    const groups: GroupedNotifications = {};
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    notifications.forEach(notification => {
      const notificationDate = new Date(notification.createdAt);
      let groupKey: string;

      if (notificationDate.toDateString() === today.toDateString()) {
        groupKey = 'Today';
      } else if (notificationDate.toDateString() === yesterday.toDateString()) {
        groupKey = 'Yesterday';
      } else if (notificationDate.getTime() > today.getTime() - 7 * 24 * 60 * 60 * 1000) {
        groupKey = notificationDate.toLocaleDateString('en-US', { weekday: 'long' });
      } else {
        groupKey = notificationDate.toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric',
          year: notificationDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(notification);
    });

    return groups;
  };

  // Fetch notifications
  const fetchNotifications = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/notifications?page=${page}&limit=10`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data: NotificationResponse = await response.json();
      console.log("data: ", data)
      setNotifications(data.notifications);
      setPagination(data.pagination);
      setCurrentPage(page);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: number) => {
    try {
      const response = await fetch(`/api/admin/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: true }),
      });

      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, isRead: true }
              : notification
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (status === 'loading' || !session) return null;


  if (loading && notifications.length === 0) {
    return (
       <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
        <div className="flex justify-center items-center h-80">
              <div className="text-center">
                {/* Spinner */}
                <div className="w-20 h-20 border-4 border-t-rose-500 border-rose-200 rounded-full animate-spin mx-auto mb-6"></div>

                {/* Text */}
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Loading Notifications
                </h3>
                <p className="text-slate-600 font-medium">
                  Please wait...
                </p>

                {/* Bouncing dots */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="mb-8">
  {/* Header Section */}
  <div className="flex items-center gap-4 mb-6">
    <Link href="/admin/dashboard">
      <button className="p-3 rounded-xl bg-white shadow-lg border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-200">
        <FaArrowLeft className="h-4 w-4 text-slate-600" />
      </button>
    </Link>
    <div className="flex items-center gap-4">
      <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg">
        <FaBell className="h-7 w-7" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Notifications</h1>
        <p className="text-slate-600">Stay updated with client form submissions</p>
      </div>
    </div>
  </div>

  {/* Stats Cards */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">Total Notifications</p>
          <p className="text-2xl font-bold text-rose-600">{pagination.total}</p>
        </div>
        <div className="p-3 rounded-xl bg-rose-100 text-rose-600">
          <FaBell className="h-5 w-5" />
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">Unread</p>
          <p className="text-2xl font-bold text-rose-600">
            {notifications.filter(n => !n.isRead).length}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-rose-100 text-rose-600">
          <FaCircle className="h-5 w-5" />
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">Today</p>
          <p className="text-2xl font-bold text-rose-600">
            {notifications.filter(n => {
              const today = new Date().toDateString();
              return new Date(n.createdAt).toDateString() === today;
            }).length}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-rose-100 text-rose-600">
          <FaCalendarDay className="h-5 w-5" />
        </div>
      </div>
    </div>
  </div>
</div>


        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 shadow-lg">
            <p className="text-red-800 font-medium">Error: {error}</p>
            <button 
              onClick={() => fetchNotifications(currentPage)}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Try again
            </button>
          </div>
        )}

        {/* Timeline-Style Notifications List */}
      <div className="space-y-8">
  {notifications.length === 0 ? (
    <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
      <div className="p-6 rounded-full bg-gray-100 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
        <FaBell className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-3">No notifications yet</h3>
      <p className="text-slate-500 max-w-md mx-auto">
        You'll see notifications here when clients submit and sign their forms.
        Stay tuned for updates!
      </p>
    </div>
  ) : (
    Object.entries(groupNotificationsByDate(notifications)).map(([dateGroup, groupNotifications]) => (
      <div key={dateGroup} className="space-y-4">
        {/* Date Group Header */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md border border-gray-200">
            <FaCalendarDay className="h-4 w-4 text-rose-600" />
            <span className="font-semibold text-slate-900">{dateGroup}</span>
            <span className="bg-rose-100 text-rose-700 text-xs font-medium px-2 py-1 rounded-full">
              {groupNotifications.length}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
        </div>

        {/* Notifications in this group */}
        <div className="space-y-4 ml-4">
          {groupNotifications.map((notification, index) => (
            <div key={notification.id} className="relative">
              {index < groupNotifications.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-8 bg-gradient-to-b from-rose-300 to-gray-200"></div>
              )}

              <div className={`relative bg-white rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                notification.isRead
                  ? 'border-gray-200'
                  : 'border-rose-200 bg-gradient-to-r from-rose-50 to-white ring-2 ring-rose-100'
              }`}>
                {!notification.isRead && (
                  <div className="absolute -left-2 top-6">
                    <div className="w-4 h-4 bg-rose-500 rounded-full animate-pulse shadow-lg"></div>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon - Different based on status */}
                    <div className={`p-3 rounded-xl shadow-md ${
                      notification.formAssignmentStatus === 'pending_admin_review'
                        ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white'
                        : notification.formAssignmentStatus === 'completed'
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white'
                        : notification.isRead
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-gradient-to-br from-rose-500 to-rose-600 text-white'
                    }`}>
                      {notification.formAssignmentStatus === 'pending_admin_review' ? (
                        <FaUserClock className="h-5 w-5" />
                      ) : notification.formAssignmentStatus === 'completed' ? (
                        <FaCheckCircle className="h-5 w-5" />
                      ) : (
                        <FaSignature className="h-5 w-5" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-lg text-slate-900">
                          {notification.formAssignmentStatus === 'pending_admin_review' 
                            ? '⚠️ Staff Submitted - Your Review Required'
                            : notification.formAssignmentStatus === 'completed'
                            ? '✅ Form Fully Completed'
                            : 'Form Signed & Submitted'
                          }
                        </h3>
                        {!notification.isRead && (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                            notification.formAssignmentStatus === 'pending_admin_review'
                              ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
                              : 'bg-gradient-to-r from-rose-500 to-rose-600 text-white'
                          }`}>
                            {notification.formAssignmentStatus === 'pending_admin_review' ? 'Action Required' : 'New'}
                          </span>
                        )}
                      </div>

                      <p className="text-slate-700 mb-4 leading-relaxed">
                        {notification.formAssignmentStatus === 'pending_admin_review' ? (
                          <>
                            Staff has completed their section of{' '}
                            <span className="font-medium text-slate-900">{notification.formSubmission.form.title}</span>
                            {' '}for client <span className="font-semibold text-yellow-700">{notification.client.name}</span>.
                            <span className="block mt-1 text-yellow-700 font-medium">Please complete the Follow-up section and add your signature.</span>
                          </>
                        ) : notification.formAssignmentStatus === 'completed' ? (
                          <>
                            <span className="font-semibold text-emerald-700">{notification.client.name}</span>'s{' '}
                            <span className="font-medium text-slate-900">{notification.formSubmission.form.title}</span>
                            {' '}has been fully completed with all signatures.
                          </>
                        ) : (
                          <>
                            <span className="font-semibold text-rose-700">{notification.client.name}</span> has successfully signed and submitted{' '}
                            <span className="font-medium text-slate-900">{notification.formSubmission.form.title}</span>
                          </>
                        )}
                      </p>

                      <div className="flex items-center gap-6 text-sm text-slate-500 mb-4">
                        <div className="flex items-center gap-2">
                          <FaUser className="h-4 w-4 text-rose-500" />
                          <span>{notification.client.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaClock className="h-4 w-4 text-gray-400" />
                          <span>{formatDate(notification.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link href={`/admin/clients/${notification.client.id}/forms`}>
                          <button
                            className={`px-6 py-2 text-white rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105 ${
                              notification.formAssignmentStatus === 'pending_admin_review'
                                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
                                : 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700'
                            }`}
                            onClick={() => !notification.isRead && markAsRead(notification.id)}
                          >
                            {notification.formAssignmentStatus === 'pending_admin_review' ? 'Complete Review' : 'View Details'}
                          </button>
                        </Link>
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-gray-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                            title="Mark as read"
                          >
                            <FaCheck className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))
  )}
</div>


        {/* Enhanced Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">{((currentPage - 1) * pagination.limit) + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * pagination.limit, pagination.total)}</span> of{' '}
                <span className="font-medium">{pagination.total}</span> notifications
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchNotifications(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
                >
                  Previous
                </button>
                
                <span className="px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-xl">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => fetchNotifications(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
