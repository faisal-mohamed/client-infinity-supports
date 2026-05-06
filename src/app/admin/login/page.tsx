'use client';

import React, { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { FaEye, FaEyeSlash, FaRedo } from 'react-icons/fa';
import { generateCaptcha, validateCaptcha } from '@/utils/captcha';
import type { Captcha } from '@/utils/captcha';
import { useToast } from '@/components/ui/Toast';


export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [captcha, setCaptcha] = useState<Captcha | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  useEffect(() => {
    setHasMounted(true);
    setCaptcha(generateCaptcha());
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/admin/dashboard');
    }
  }, [status, router]);

  if (!hasMounted || status === 'loading') return null;

  const validateEmail = (value: string) => {
    if (!value) { setEmailError(''); return true; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) { setEmailError('Invalid email format'); return false; }
    setEmailError('');
    return true;
  };

  const validatePassword = (value: string) => {
    if (!value) { setPasswordError(''); return true; }
    const errors = [];
    if (value.length < 15) errors.push('Min 15 chars');
    if (!/[A-Z]/.test(value)) errors.push('1 Uppercase');
    if (!/[0-9]/.test(value)) errors.push('1 Number');
    if (!/[!@#$%^&*_\-+=\[\]{}|;:,.<>?]/.test(value)) errors.push('1 Special char');
    if (errors.length > 0) { setPasswordError(`Missing: ${errors.join(', ')}`); return false; }
    setPasswordError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleRefreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaAnswer('');
    setCaptchaError('');
  };

  const handleCaptchaAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCaptchaAnswer(value);
    if (captchaError) setCaptchaError('');
  };

  const displayToast = (title: string, message: string, type: 'error' | 'warning' | 'success' = 'error') => {
    showToast({ type, title, message, duration: 3000 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) { displayToast('Email Required', 'Please enter your email'); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { displayToast('Invalid Email', 'Please enter a valid email format'); return; }
    if (!password) { displayToast('Password Required', 'Please enter your password'); return; }

    if (!captchaAnswer) {
      displayToast('Captcha Required', 'Please solve the captcha');
      setCaptchaError('Required');
      return;
    }

    if (!captcha || !validateCaptcha(captcha, captchaAnswer)) {
      displayToast('Incorrect Captcha', 'Please solve the captcha correctly and try again');
      setCaptchaError('Incorrect answer');
      setCaptchaAnswer('');
      setTimeout(() => { setCaptcha(generateCaptcha()); setCaptchaError(''); }, 1500);
      return;
    }

    try {
      setIsLoading(true);
      const result = await signIn('credentials', { redirect: false, email, password });

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          displayToast('Login Failed', 'Invalid email or password. Please check both fields.', 'error');
        } else if (result.error.includes('email')) {
          displayToast('Email Not Found', 'This email is not registered', 'error');
        } else if (result.error.includes('password')) {
          displayToast('Invalid Password', 'The password you entered is incorrect', 'error');
        } else {
          displayToast('Login Failed', 'An error occurred during login. Please try again.', 'error');
        }
        setIsLoading(false);
        return;
      }

      router.push('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      displayToast('Unexpected Error', 'An unexpected error occurred. Please try again.', 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      {/* Hide number input spinners */}
      <style>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
      `}</style>

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Image src="/client_full_logo.jpg" alt="Infinity Support WA" width={180} height={54} />
          </div>
          <p className="text-sm text-gray-500 mt-1">Login to access your dashboard</p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm border border-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zM10 13a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                placeholder="you@example.com"
              />
              {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
              {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
              <div className="text-right mt-1.5">
                <Link href="/admin/forgot-password" className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Captcha */}
            {email && password && (
              <div className="border border-gray-100 rounded-lg p-3 bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <div className="bg-white rounded-md px-2.5 py-1.5 border border-gray-200 text-xs font-semibold text-gray-700 whitespace-nowrap">
                    {captcha?.question || 'Loading...'}
                  </div>
                  <span className="text-sm font-medium text-gray-400">=</span>
                  <input
                    type="number"
                    value={captchaAnswer}
                    onChange={handleCaptchaAnswerChange}
                    disabled={isLoading}
                    placeholder="?"
                    className={`w-16 px-2 py-1.5 rounded-md border text-xs font-semibold text-center focus:outline-none transition-colors ${
                      captchaError
                        ? 'border-red-300 bg-red-50'
                        : captchaAnswer && captcha && validateCaptcha(captcha, captchaAnswer)
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 bg-white focus:border-brand-500'
                    }`}
                    autoComplete="off"
                  />
                  {captchaAnswer && captcha && validateCaptcha(captcha, captchaAnswer) && !captchaError && (
                    <span className="text-green-600 text-xs font-bold">✓</span>
                  )}
                  <button
                    type="button"
                    onClick={handleRefreshCaptcha}
                    disabled={isLoading}
                    className="ml-auto p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title="Refresh captcha"
                  >
                    <FaRedo size={12} />
                  </button>
                </div>
                {captchaError && <p className="text-xs text-red-600 mt-1.5">{captchaError}</p>}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
