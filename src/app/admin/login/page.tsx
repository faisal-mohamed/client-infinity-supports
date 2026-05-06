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
    <div className="min-h-screen flex">
      {/* Hide number input spinners */}
      <style>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
      `}</style>

      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-azure-700 relative overflow-hidden items-center justify-center">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gold-500 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gold-500 rounded-full translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative z-10 text-center px-12">
          <div className="mb-8">
            <Image src="/client_full_logo.jpg" alt="Infinity Support WA" width={220} height={66} className="mx-auto brightness-0 invert" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Welcome Back</h1>
          <p className="text-white/70 text-base leading-relaxed max-w-md mx-auto">
            Manage your NDIS forms, clients, and support services with our comprehensive portal.
          </p>
          <div className="mt-10 flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gold-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-gold-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/></svg>
              </div>
              <p className="text-xs text-white/60">Forms</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gold-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-gold-400" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/></svg>
              </div>
              <p className="text-xs text-white/60">Clients</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gold-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-gold-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              </div>
              <p className="text-xs text-white/60">Compliance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center bg-white px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="text-center mb-8 lg:hidden">
            <div className="flex justify-center mb-4">
              <Image src="/client_full_logo.jpg" alt="Infinity Support WA" width={180} height={54} />
            </div>
          </div>

          {/* Desktop heading */}
          <div className="hidden lg:block mb-8">
            <h2 className="text-2xl font-bold text-azure-700">Sign in</h2>
            <p className="text-sm text-azure-400 mt-1">Access your admin dashboard</p>
          </div>

          {/* Form card */}
          <div className="lg:bg-transparent lg:border-0 lg:shadow-none lg:p-0 bg-white rounded-2xl border border-azure-100 shadow-card p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3.5 py-2.5 rounded-xl text-sm border border-red-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zM10 13a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-azure-700 mb-1.5">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-azure-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all duration-200 bg-azure-50/30"
                  placeholder="you@example.com"
                />
                {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-azure-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-azure-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all duration-200 bg-azure-50/30"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-azure-300 hover:text-azure-500 transition-colors"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
                {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
                <div className="text-right mt-1.5">
                  <Link href="/admin/forgot-password" className="text-xs text-gold-600 hover:text-gold-700 font-semibold">
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Captcha */}
              {email && password && (
                <div className="border border-azure-100 rounded-xl p-3.5 bg-azure-50/30">
                  <div className="flex items-center gap-2">
                    <div className="bg-white rounded-lg px-3 py-2 border border-azure-100 text-xs font-bold text-azure-700 whitespace-nowrap">
                      {captcha?.question || 'Loading...'}
                    </div>
                    <span className="text-sm font-bold text-azure-300">=</span>
                    <input
                      type="number"
                      value={captchaAnswer}
                      onChange={handleCaptchaAnswerChange}
                      disabled={isLoading}
                      placeholder="?"
                      className={`w-16 px-2.5 py-2 rounded-lg border text-xs font-bold text-center focus:outline-none transition-all duration-200 ${
                        captchaError
                          ? 'border-red-300 bg-red-50'
                          : captchaAnswer && captcha && validateCaptcha(captcha, captchaAnswer)
                          ? 'border-emerald-300 bg-emerald-50'
                          : 'border-azure-100 bg-white focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30'
                      }`}
                      autoComplete="off"
                    />
                    {captchaAnswer && captcha && validateCaptcha(captcha, captchaAnswer) && !captchaError && (
                      <span className="text-emerald-600 text-xs font-bold">✓</span>
                    )}
                    <button
                      type="button"
                      onClick={handleRefreshCaptcha}
                      disabled={isLoading}
                      className="ml-auto p-2 text-azure-300 hover:text-azure-500 hover:bg-azure-50 rounded-lg transition-colors"
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
                className="w-full bg-azure-700 hover:bg-azure-600 text-white font-bold py-3 rounded-xl text-sm transition-all duration-200 flex items-center justify-center disabled:opacity-60 shadow-soft hover:shadow-elevated"
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
    </div>
  );
}
