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

  // Mount check to avoid hydration mismatch
  useEffect(() => {
    setHasMounted(true);
    // Generate initial captcha
    setCaptcha(generateCaptcha());
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/admin/dashboard');
    }
  }, [status, router]);

  if (!hasMounted || status === 'loading') return null;

  // Validate email format in real-time
  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('');
      return true;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('Invalid email format');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Validate password requirements in real-time
  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError('');
      return true;
    }
    const errors = [];
    if (value.length < 15) errors.push('Min 15 chars');
    if (!/[A-Z]/.test(value)) errors.push('1 Uppercase');
    if (!/[0-9]/.test(value)) errors.push('1 Number');
    if (!/[!@#$%^&*_\-+=\[\]{}|;:,.<>?]/.test(value)) errors.push('1 Special char');

    if (errors.length > 0) {
      setPasswordError(`Missing: ${errors.join(', ')}`);
      return false;
    }
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

  // Refresh captcha and generate new one
  const handleRefreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaAnswer('');
    setCaptchaError('');
  };

  // Handle captcha answer change
  const handleCaptchaAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCaptchaAnswer(value);
    // Clear error when user starts typing
    if (captchaError) {
      setCaptchaError('');
    }
  };

  // Show toast notification
  const displayToast = (title: string, message: string, type: 'error' | 'warning' | 'success' = 'error') => {
    showToast({
      type,
      title,
      message,
      duration: 3000,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    if (!email) {
      displayToast('Email Required', 'Please enter your email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      displayToast('Invalid Email', 'Please enter a valid email format');
      return;
    }

    // Validate password
    if (!password) {
      displayToast('Password Required', 'Please enter your password');
      return;
    }

    // Validate captcha
    if (!captchaAnswer) {
      displayToast('Captcha Required', 'Please solve the captcha');
      setCaptchaError('Required');
      return;
    }

    if (!captcha || !validateCaptcha(captcha, captchaAnswer)) {
      displayToast('Incorrect Captcha', 'Please solve the captcha correctly and try again');
      setCaptchaError('Incorrect answer');
      setCaptchaAnswer('');
      // Generate new captcha after wrong answer
      setTimeout(() => {
        setCaptcha(generateCaptcha());
        setCaptchaError('');
      }, 1500);
      return;
    }

    try {
      setIsLoading(true);

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        // Provide more specific error messages
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
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white px-4 py-12 font-sans">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-100 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-100 rounded-full filter blur-3xl opacity-40 animate-pulse delay-1000"></div>

      {/* Hide number input spinners globally for this page */}
      <style>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 sm:p-10 z-10">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 rounded-full  flex items-center justify-center">
                <div className="mx-auto mb-4 rounded-full  flex items-center justify-center">
                        {/* <span className="text-indigo-600 text-2xl font-bold">IS</span> */}
                        <Image
                        src={'/client_full_logo.jpg'}
                        alt='Infinity Support WA'
                        width={200}
                        height={60}
                        />
                      </div>
          </div>
        
          <p className="text-sm text-gray-500 mt-1">Login to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zM10 13a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              placeholder="you@example.com"
            />
            {emailError && (
              <p className="text-xs text-red-500 mt-1">{emailError}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                required
                className="mt-1 w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
             <div className="text-right mt-2">
              <Link href="/admin/forgot-password" className="text-sm text-indigo-600 hover:underline">
                Forgot password?
              </Link>
            </div> 
            {passwordError && (
              <p className="text-xs text-red-500 mt-1">{passwordError}</p>
            )}
          </div>

          {/* Ultra Compact Captcha - Question & Answer on One Line */}
          {email && password && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white border border-indigo-200 rounded-lg p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                {/* Single Line: Label + Question + Input + Refresh */}
                <div className="flex items-center justify-between gap-2">
                  {/* Left: Question with Answer Input */}
                  <div className="flex items-center gap-2 flex-1">
                    {/* Question Box */}
                    <div className="bg-indigo-50 rounded-md px-2 py-1.5 border border-indigo-100 whitespace-nowrap">
                      <p className="text-xs font-bold text-indigo-700">{captcha?.question || 'Loading...'}</p>
                    </div>

                    {/* Equals Sign */}
                    <span className="text-sm font-bold text-gray-600">=</span>

                    {/* Input Field */}
                    <div className="relative flex-1 max-w-[80px]">
                      <input
                        type="number"
                        value={captchaAnswer}
                        onChange={handleCaptchaAnswerChange}
                        disabled={isLoading}
                        placeholder="?"
                        className={`w-full px-2 py-1.5 rounded-md border text-xs font-semibold text-center focus:outline-none transition-all ${
                          captchaError
                            ? 'border-red-400 bg-red-50 focus:ring-1 focus:ring-red-300'
                            : captchaAnswer && captcha && validateCaptcha(captcha, captchaAnswer)
                            ? 'border-green-400 bg-green-50 focus:ring-1 focus:ring-green-300'
                            : 'border-gray-300 bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200'
                        }`}
                        autoComplete="off"
                      />
                      {captchaAnswer && captcha && validateCaptcha(captcha, captchaAnswer) && !captchaError && (
                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-600 font-bold text-xs">✓</span>
                      )}
                    </div>
                  </div>

                  {/* Right: Refresh Button */}
                  <button
                    type="button"
                    onClick={handleRefreshCaptcha}
                    disabled={isLoading}
                    className="p-1 text-indigo-600 hover:bg-indigo-100 rounded transition-colors disabled:opacity-50 hover:scale-110 flex-shrink-0"
                    title="Refresh captcha"
                  >
                    <FaRedo size={14} />
                  </button>
                </div>

                {/* Error Message - Below on new line if needed */}
                {captchaError && (
                  <p className="text-xs text-red-600 mt-2">{captchaError}</p>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition duration-150 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
  );
}
