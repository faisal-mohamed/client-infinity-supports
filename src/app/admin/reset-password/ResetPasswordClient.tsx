"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get('email') || '';

  const [step, setStep] = useState<'verify' | 'reset'>('verify');
  const [email, setEmail] = useState(emailFromQuery);
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [emailFromQuery]);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !verificationCode) {
      setError('Please enter both email and verification code');
      return;
    }

    if (verificationCode.length !== 6) {
      setError('Verification code must be 6 digits');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setMessage('');

      const response = await fetch('/api/auth/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Code verified successfully! Please enter your new password.');
        setStep('reset');
      } else {
        setError(data.error || 'Invalid verification code');
      }
    } catch (err) {
      console.error('Verify code error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError('Please enter both password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 15) {
      setError('Password must be at least 15 characters long');
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setError('Password must contain at least one number');
      return;
    }

    if (!/[!@#$%^&*_\-+=\[\]{}|;:,.<>?]/.test(newPassword)) {
      setError('Password must contain at least one special character (!@#$%^&*_-+=[]{}|;:,.<>?)');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setMessage('');

      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/admin/login');
        }, 2000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('New verification code sent to your email');
        setVerificationCode('');
      } else {
        setError(data.error || 'Failed to resend code');
      }
    } catch (err) {
      console.error('Resend code error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-azure-50 to-white px-4 py-12 font-sans">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-azure-100 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-azure-100 rounded-full filter blur-3xl opacity-40 animate-pulse delay-1000"></div>

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-azure-50 p-8 sm:p-10 z-10">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 rounded-full flex items-center justify-center">
            <Image
              src={'/client_full_logo.jpg'}
              alt='Infinity Support WA'
              width={200}
              height={60}
            />
          </div>
          <h1 className="text-xl font-bold text-azure-700 mb-2">
            {step === 'verify' ? 'Verify Code' : 'Reset Password'}
          </h1>
          <p className="text-sm text-azure-400">
            {step === 'verify'
              ? 'Enter the 6-digit code sent to your email'
              : 'Enter your new password'}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zM10 13a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {message && (
          <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-md text-sm mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L8.23 10.661a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
            {message}
          </div>
        )}

        {step === 'verify' ? (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-azure-600">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full px-4 py-3 rounded-xl border border-azure-200 focus:ring-2 focus:ring-gold-500 focus:outline-none transition"
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-azure-600">Verification Code</label>
              <input
                id="code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                maxLength={6}
                className="mt-1 w-full px-4 py-3 rounded-xl border border-azure-200 focus:ring-2 focus:ring-gold-500 focus:outline-none transition text-center text-2xl tracking-widest"
                placeholder="xxxxxx"
                disabled={isLoading}
              />
              <p className="text-xs text-azure-400 mt-1">Enter the 6-digit code sent to your email</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-azure-700 hover:bg-azure-800 disabled:bg-azure-500 text-white font-semibold py-3 rounded-xl shadow-md transition duration-150 flex items-center justify-center"
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-azure-600">New Password</label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={15}
                  className="mt-1 w-full px-4 py-3 pr-12 rounded-xl border border-azure-200 focus:ring-2 focus:ring-gold-500 focus:outline-none transition"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-azure-400 hover:text-azure-600 focus:outline-none transition-colors duration-200"
                  title={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              <div className="mt-2 text-xs text-azure-500 space-y-1">
                <p>Password must contain:</p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                  <li>At least 15 characters</li>
                  <li>At least one uppercase letter (A-Z)</li>
                  <li>At least one number (0-9)</li>
                  <li>At least one special character: !@#$%^&amp;*_-+=[]{}|;:,.</li>
                </ul>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-azure-600">Confirm New Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={15}
                  className="mt-1 w-full px-4 py-3 pr-12 rounded-xl border border-azure-200 focus:ring-2 focus:ring-gold-500 focus:outline-none transition"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-azure-400 hover:text-azure-600 focus:outline-none transition-colors duration-200"
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-azure-700 hover:bg-azure-800 disabled:bg-azure-500 text-white font-semibold py-3 rounded-xl shadow-md transition duration-150 flex items-center justify-center"
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-azure-400">
          Remember your password?{' '}
          <Link href="/admin/login" className="text-azure-700 font-medium hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
