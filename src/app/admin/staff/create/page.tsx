"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserPlus, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { createStaff } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';

export default function StaffCreatePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [creating, setCreating] = useState(false); // Loading state for Create Staff button
  const [cancelling, setCancelling] = useState(false); // Loading state for Cancel button
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle phone input - only allow numbers and spaces
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers, spaces, and common phone formatting characters
    const cleaned = value.replace(/[^\d\s\-\(\)]/g, '');
    setPhone(cleaned);
    // Clear phone error when user starts typing
    if (errors.phone) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  };

  // Clear field error when user starts typing
  const clearFieldError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    const missingFields: string[] = [];

    // First Name validation
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
      missingFields.push('First Name');
    }

    // Surname validation
    if (!surname.trim()) {
      newErrors.surname = 'Surname is required';
      missingFields.push('Surname');
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      missingFields.push('Email');
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional but must be numbers only if provided)
    if (phone.trim() && !/^[\d\s\-\(\)]+$/.test(phone)) {
      newErrors.phone = 'Phone number can only contain numbers, spaces, hyphens, and parentheses';
    } else if (phone.trim()) {
      // Remove formatting and check if it's a reasonable length (8-15 digits)
      const digitsOnly = phone.replace(/\D/g, '');
      if (digitsOnly.length < 8 || digitsOnly.length > 15) {
        newErrors.phone = 'Phone number must be between 8 and 15 digits';
      }
    }

    setErrors(newErrors);
    
    // Show toast notification for validation errors
    if (Object.keys(newErrors).length > 0) {
      if (missingFields.length > 0) {
        showToast({
          type: 'error',
          title: 'Validation Error',
          message: `Please fill in the required fields: ${missingFields.join(', ')}`,
          duration: 5000,
        });
      } else {
        // Show first validation error
        const firstError = Object.values(newErrors)[0];
        showToast({
          type: 'error',
          title: 'Validation Error',
          message: firstError,
          duration: 5000,
        });
      }
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setCreating(true);
    try {
      // Clean phone number (remove formatting)
      const cleanedPhone = phone.trim() ? phone.replace(/\D/g, '') : undefined;
      await createStaff({ firstName: firstName.trim(), surname: surname.trim(), email: email.trim(), phone: cleanedPhone });
      
      // Show success message
      showToast({
        type: 'success',
        title: 'Staff Created Successfully',
        message: `${firstName.trim()} ${surname.trim()} has been added to the staff list.`,
        duration: 4000,
      });
      
      // Navigate after a short delay to allow user to see success message
      setTimeout(() => {
        router.push('/admin/staff');
      }, 500);
    } catch (err: any) {
      console.error('Error creating staff:', err);
      
      // Parse error message for user-friendly display
      let errorMessage = 'Failed to create staff. Please try again.';
      let errorTitle = 'Creation Failed';
      
      if (err.message) {
        const errorMsg = err.message.toLowerCase();
        
        // Check for Prisma unique constraint errors (email already exists)
        if (errorMsg.includes('unique constraint') && errorMsg.includes('email')) {
          errorTitle = 'Email Already Exists';
          errorMessage = 'This email address is already registered. Please use a different email address.';
        } 
        // Check for other unique constraint errors
        else if (errorMsg.includes('unique constraint')) {
          errorTitle = 'Duplicate Entry';
          errorMessage = 'This information already exists in the system. Please check your input and try again.';
        }
        // Check for Prisma validation errors
        else if (errorMsg.includes('prisma') && errorMsg.includes('validation')) {
          errorTitle = 'Invalid Data';
          errorMessage = 'The provided information is invalid. Please check all fields and try again.';
        }
        // Check for email already exists (other formats)
        else if (errorMsg.includes('email') && (errorMsg.includes('already') || errorMsg.includes('duplicate') || errorMsg.includes('exists'))) {
          errorTitle = 'Email Already Exists';
          errorMessage = 'This email address is already registered. Please use a different email address.';
        } 
        // Check for network/connection errors
        else if (errorMsg.includes('network') || errorMsg.includes('fetch') || errorMsg.includes('connection') || errorMsg.includes('failed to fetch')) {
          errorTitle = 'Connection Error';
          errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
        } 
        // Check for timeout errors
        else if (errorMsg.includes('timeout')) {
          errorTitle = 'Request Timeout';
          errorMessage = 'The request took too long. Please try again.';
        } 
        // Check for HTTP status codes
        else if (errorMsg.includes('400') || errorMsg.includes('bad request')) {
          errorTitle = 'Invalid Data';
          errorMessage = 'The provided information is invalid. Please check all fields and try again.';
        } 
        else if (errorMsg.includes('401') || errorMsg.includes('unauthorized')) {
          errorTitle = 'Authentication Error';
          errorMessage = 'You are not authorized to perform this action. Please log in again.';
        }
        else if (errorMsg.includes('403') || errorMsg.includes('forbidden')) {
          errorTitle = 'Access Denied';
          errorMessage = 'You do not have permission to create staff members.';
        }
        else if (errorMsg.includes('404') || errorMsg.includes('not found')) {
          errorTitle = 'Resource Not Found';
          errorMessage = 'The requested resource could not be found. Please try again.';
        }
        else if (errorMsg.includes('500') || errorMsg.includes('server error') || errorMsg.includes('internal server')) {
          errorTitle = 'Server Error';
          errorMessage = 'An error occurred on the server. Please try again later or contact support.';
        }
        // Check for Prisma errors (generic)
        else if (errorMsg.includes('prisma')) {
          errorTitle = 'Database Error';
          errorMessage = 'An error occurred while saving the data. Please try again or contact support if the problem persists.';
        }
        // If error message is short and user-friendly, use it
        else if (err.message.length < 100 && !err.message.includes('prisma') && !err.message.includes('invocation')) {
          errorMessage = err.message;
        }
        // Otherwise use default user-friendly message
      }
      
      showToast({
        type: 'error',
        title: errorTitle,
        message: errorMessage,
        duration: 6000,
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Consistent Header - matches other admin pages */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button */}
          <div className="flex items-center mb-4">
            <Link 
              href="/admin/staff"
              className="flex items-center px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200 group"
            >
              <FaArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Staff
            </Link>
          </div>

          {/* Main Header */}
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg">
              <FaUserPlus className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">Add New Staff</h1>
              <p className="text-slate-600">Create a new staff member account</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                value={firstName} 
                onChange={(e) => {
                  setFirstName(e.target.value);
                  clearFieldError('firstName');
                }}
                className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                  errors.firstName 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-rose-500'
                }`}
                placeholder="Enter staff first name"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <span>•</span>
                  <span>{errors.firstName}</span>
                </p>
              )}
            </div>

            {/* Surname */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Surname <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                value={surname} 
                onChange={(e) => {
                  setSurname(e.target.value);
                  clearFieldError('surname');
                }}
                className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                  errors.surname 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-rose-500'
                }`}
                placeholder="Enter staff surname"
              />
              {errors.surname && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <span>•</span>
                  <span>{errors.surname}</span>
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input 
                type="email"
                value={email} 
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError('email');
                }}
                className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-rose-500'
                }`}
                placeholder="staff@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <span>•</span>
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Phone
              </label>
              <input 
                type="tel"
                value={phone} 
                onChange={handlePhoneChange}
                className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                  errors.phone 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-rose-500'
                }`}
                placeholder="0412 345 678"
                inputMode="numeric"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <span>•</span>
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <Link 
              href="/admin/staff" 
              className={`px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium flex items-center gap-2 ${
                creating || cancelling ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
              }`}
              onClick={(e) => {
                if (creating || cancelling) {
                  e.preventDefault();
                  return;
                }
                // Set cancelling state when cancel is clicked
                setCancelling(true);
                // Navigation will happen automatically via Link
              }}
            >
              {cancelling && <FaSpinner className="h-4 w-4 animate-spin" />}
              <span>{cancelling ? 'Cancelling...' : 'Cancel'}</span>
            </Link>
            <button 
              type="submit" 
              disabled={creating || cancelling} 
              className="px-8 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {creating ? (
                <>
                  <FaSpinner className="h-4 w-4 animate-spin" />
                  <span>Creating Staff...</span>
                </>
              ) : (
                <>
                  <FaUserPlus className="h-4 w-4" />
                  <span>Create Staff</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


