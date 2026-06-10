'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => router.push('/admin/login'), 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 15) {
      setError('Password must be at least 15 characters long');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number');
      return;
    }
    if (!/[!@#$%^&*_\-+=\[\]{}|;:,.<>?]/.test(password)) {
      setError('Password must contain at least one special character (!@#$%^&*_-+=[]{}|;:,.<>?)');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const response = await fetch('/api/admins/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Registration failed');

      setSuccessMessage('Registration successful! Redirecting to login...');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasMounted) return null;

  // Validate email format in real-time
  const validateEmail = (value: string) => {
    if (!value) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  // Validate password requirements in real-time
  const getPasswordErrors = (value: string) => {
    const errors = [];
    if (value.length < 15) errors.push('Min 15 chars');
    if (!/[A-Z]/.test(value)) errors.push('1 Uppercase');
    if (!/[0-9]/.test(value)) errors.push('1 Number');
    if (!/[!@#$%^&*_\-+=\[\]{}|;:,.<>?]/.test(value)) errors.push('1 Special');
    return errors;
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-azure-50 to-white px-4 py-12 font-sans">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-azure-100 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-azure-100 rounded-full filter blur-3xl opacity-40 animate-pulse delay-1000"></div>

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-azure-50 p-8 sm:p-10 z-10">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 rounded-full  flex items-center justify-center">
            {/* <span className="text-azure-700 text-2xl font-bold">IS</span> */}
            <Image
            src={'/client_full_logo.jpg'}
            alt='Infinity Support WA'
            width={200}
            height={60}
            />
          </div>
          <p className="text-sm text-azure-400 mt-1">Register to access the admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2.5 rounded-xl text-sm border border-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zM10 13a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm border border-emerald-100">
              {successMessage}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-azure-600">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full px-4 py-3 rounded-xl border border-azure-200 focus:ring-2 focus:ring-gold-500 focus:outline-none transition"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-azure-600">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-3 rounded-xl border border-azure-200 focus:ring-2 focus:ring-gold-500 focus:outline-none transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-azure-600">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`mt-1 w-full px-4 py-3 pr-12 rounded-xl border focus:ring-2 focus:outline-none transition ${
                  password && getPasswordErrors(password).length === 0
                    ? 'border-emerald-300 focus:ring-emerald-400'
                    : password
                    ? 'border-gold-300 focus:ring-gold-400'
                    : 'border-azure-200 focus:ring-gold-500'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-azure-400 hover:text-azure-600 focus:outline-none transition-colors duration-200"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
            <div className="mt-2 text-xs text-azure-500 space-y-1">
              <p className="font-medium">Password Requirements:</p>
              <ul className="space-y-1 ml-3">
                <li className={password.length >= 15 ? 'text-emerald-600' : 'text-azure-400'}>
                  {password.length >= 15 ? '✅' : '○'} At least 15 characters ({password.length}/15)
                </li>
                <li className={/[A-Z]/.test(password) ? 'text-emerald-600' : 'text-azure-400'}>
                  {/[A-Z]/.test(password) ? '✅' : '○'} At least one uppercase letter (A-Z)
                </li>
                <li className={/[0-9]/.test(password) ? 'text-emerald-600' : 'text-azure-400'}>
                  {/[0-9]/.test(password) ? '✅' : '○'} At least one number (0-9)
                </li>
                <li className={/[!@#$%^&*_\-+=\[\]{}|;:,.<>?]/.test(password) ? 'text-emerald-600' : 'text-azure-400'}>
                  {/[!@#$%^&*_\-+=\[\]{}|;:,.<>?]/.test(password) ? '✅' : '○'} At least one special character
                </li>
              </ul>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-azure-600">Confirm Password</label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 w-full px-4 py-3 pr-12 rounded-xl border border-azure-200 focus:ring-2 focus:ring-gold-500 focus:outline-none transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-azure-400 hover:text-azure-600 focus:outline-none transition-colors duration-200"
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-azure-700 hover:bg-azure-800 text-white font-semibold py-3 rounded-xl shadow-md transition duration-150 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-azure-400">
          Already have an account?{' '}
          <Link href="/admin/login" className="text-azure-700 font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
