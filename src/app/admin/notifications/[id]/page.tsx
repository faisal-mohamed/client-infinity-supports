'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  FaArrowLeft, 
  FaUser, 
  FaFileAlt, 
  FaClock, 
  FaDownload, 
  FaCheck, 
  FaEnvelope, 
  FaPhone,
  FaCalendarAlt,
  FaSignature,
  FaBell
} from 'react-icons/fa';

interface NotificationDetail {
  id: number;
  isRead: boolean;
  createdAt: string;
  client: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  formSubmission: {
    id: number;
    submittedAt: string;
    clientSignedAt: string;
    form: {
      id: number;
      title: string;
      formKey: string;
      version: number;
    };
    formId: string;
  };
}

export default function NotificationDetailPage() {
  const params = useParams();
  const notificationId = params.id as string;
  
  const [notification, setNotification] = useState<NotificationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // Fetch notification details
  const fetchNotificationDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/notifications/${notificationId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch notification details');
      }

      const data = await response.json();
      console.log("notification: ", data);
      setNotification(data.notification);
      
      // Mark as read when viewing details
      if (!data.notification.isRead) {
        markAsRead();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async () => {
    try {
      await fetch(`/api/admin/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: true }),
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Download PDF
  const downloadPdf = async () => {
    if (!notification) return;
    
    try {
      setDownloadingPdf(true);
      const response = await fetch(`/api/generate-pdf/${notification.formSubmission.id}/${notification.formSubmission.formId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${notification.formSubmission.form.title}_${notification.client.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  useEffect(() => {
    if (notificationId) {
      fetchNotificationDetail();
    }
  }, [notificationId]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
              <div className="space-y-2">
                <div className="h-8 bg-gray-300 rounded w-64"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-16 bg-gray-200 rounded"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !notification) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8 text-center">
            <div className="p-6 rounded-full bg-red-100 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <FaBell className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-3">Error Loading Notification</h2>
            <p className="text-red-600 mb-6 max-w-md mx-auto">{error || 'Notification not found'}</p>
            <Link href="/admin/notifications">
              <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                Back to Notifications
              </button>
            </Link>
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
          <div className="flex items-center gap-4 mb-6">
            <Link href="/admin/notifications">
              <button className="p-3 rounded-xl bg-white shadow-lg border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-200">
                <FaArrowLeft className="h-4 w-4 text-gray-600" />
              </button>
            </Link>
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                <FaFileAlt className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Notification Details</h1>
                <p className="text-gray-600">Form submission information and client details</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enhanced Notification Summary */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg">
                  <FaSignature className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Form Signed & Submitted</h2>
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md">
                      <FaCheck className="h-3 w-3 mr-2" />
                      Completed
                    </span>
                  </div>
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    <span className="font-bold text-indigo-700">{notification.client.name}</span> has successfully signed and submitted{' '}
                    <span className="font-semibold text-gray-900">{notification.formSubmission.form.title}</span>
                  </p>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                    <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                      <FaClock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Received</p>
                      <p className="text-gray-900 font-semibold">{formatRelativeTime(notification.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Form Details */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
                  <FaFileAlt className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Form Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-500 mb-2">Form Title</label>
                  <p className="text-gray-900 font-bold text-lg">{notification.formSubmission.form.title}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-500 mb-2">Form Version</label>
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
                      v{notification.formSubmission.form.version}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-500 mb-2">Submitted At</label>
                  <p className="text-gray-900 font-semibold">{formatDate(notification.formSubmission.submittedAt)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-500 mb-2">Signed At</label>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 text-green-600">
                      <FaSignature className="h-4 w-4" />
                    </div>
                    <p className="text-gray-900 font-semibold">{formatDate(notification.formSubmission.clientSignedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Enhanced Download Section */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Download Form PDF</h4>
                    <p className="text-gray-600">Get a complete PDF copy of the submitted form with signature</p>
                  </div>
                  <br />
                  <button
                    onClick={downloadPdf}
                    disabled={downloadingPdf}
                    className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FaDownload className="h-5 w-5" />
                    {downloadingPdf ? 'Generating PDF...' : 'Download PDF'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enhanced Client Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
                  <FaUser className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Client Details</h3>
              </div>
              
              <div className="space-y-5">
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-500 mb-2">Full Name</label>
                  <p className="text-gray-900 font-bold text-lg">{notification.client.name}</p>
                </div>
                
                {notification.client.email && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-gray-500 mb-2">Email Address</label>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                        <FaEnvelope className="h-4 w-4" />
                      </div>
                      <a 
                        href={`mailto:${notification.client.email}`}
                        className="text-indigo-600 hover:text-indigo-800 transition-colors font-semibold hover:underline"
                      >
                        {notification.client.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {notification.client.phone && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-gray-500 mb-2">Phone Number</label>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100 text-green-600">
                        <FaPhone className="h-4 w-4" />
                      </div>
                      <a 
                        href={`tel:${notification.client.phone}`}
                        className="text-green-600 hover:text-green-800 transition-colors font-semibold hover:underline"
                      >
                        {notification.client.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced View Client Button */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link href={`/admin/clients/${notification.client.id}`}>
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105">
                    View Complete Client Profile
                  </button>
                </Link>
              </div>
            </div>

            {/* Enhanced Timeline */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md">
                  <FaCalendarAlt className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Activity Timeline</h3>
              </div>
              
              <div className="space-y-6">
                <div className="relative">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-lg"></div>
                      <div className="absolute left-2 top-6 w-0.5 h-8 bg-gradient-to-b from-green-300 to-blue-200"></div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 flex-1 border border-green-100">
                      <p className="text-sm font-bold text-green-800 mb-1">Form Signed & Submitted</p>
                      <p className="text-xs text-green-600 font-medium">{formatDate(notification.formSubmission.clientSignedAt)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-lg"></div>
                      <div className="absolute left-2 top-6 w-0.5 h-8 bg-gradient-to-b from-blue-300 to-gray-200"></div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 flex-1 border border-blue-100">
                      <p className="text-sm font-bold text-blue-800 mb-1">Notification Created</p>
                      <p className="text-xs text-blue-600 font-medium">{formatDate(notification.createdAt)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="flex items-start gap-4">
                    <div className="w-4 h-4 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full shadow-lg animate-pulse"></div>
                    <div className="bg-indigo-50 rounded-xl p-4 flex-1 border border-indigo-100">
                      <p className="text-sm font-bold text-indigo-800 mb-1">Notification Viewed</p>
                      <p className="text-xs text-indigo-600 font-medium">Just now</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
