"use client";

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import EmployeeWelcomeAckForm, { EmployeeWelcomeAckFormRef } from './components/EmployeeWelcomeAckForm';
import EmployeeDetailsStep, { EmployeeDetailsStepRef } from './components/EmployeeDetailsStep';
import SupportWorkerForm, { SupportWorkerFormRef } from './components/SupportWorkerForm';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import './components/styles.css';

const EmployeeWelcomeView = dynamic(async () => (await import('@/app/form-components/staff/employee-welcome/View')).default, { ssr: false });

function InnerPage() {
  const { token } = useParams<{ token: string }>();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [canContinue, setCanContinue] = useState(false);
  const ackRef = useRef<EmployeeWelcomeAckFormRef | null>(null);
  const detailsRef = useRef<EmployeeDetailsStepRef | null>(null);
  const supportWorkerRef = useRef<SupportWorkerFormRef | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    // No-op for now; could load progress to resume at correct step
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Staff Onboarding</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className={`px-2 py-1 rounded ${step===1?'bg-rose-600 text-white':'bg-gray-100'}`}>1. Employee Details</span>
            <span className={`px-2 py-1 rounded ${step===2?'bg-rose-600 text-white':'bg-gray-100'}`}>2. Employee Welcome</span>
            <span className={`px-2 py-1 rounded ${step===3?'bg-rose-600 text-white':'bg-gray-100'}`}>3. Support Worker</span>
          </div>
        </div>

        {/* Sticky header with progress */}
        <div className="sticky top-0 z-20 bg-white py-3 border-b mb-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/client_logo.png" alt="Logo" className="h-8" />
              <span className="font-semibold text-rose-600">Staff Onboarding</span>
            </div>
            <div className="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full bg-rose-600 ${step===1 ? 'w-1/3' : step===2 ? 'w-2/3' : 'w-full'}`} />
            </div>
          </div>
        </div>

        {step === 2 && (
          <>
            <div className="mb-6 border rounded-xl overflow-hidden">
              <EmployeeWelcomeView excludeLastPage={true}>
                <EmployeeWelcomeAckForm ref={ackRef as any} token={token} onValidityChange={setCanContinue} onSubmitted={()=>setStep(2)} />
              </EmployeeWelcomeView>
            </div>
            <div className="flex justify-end">
              <button className="px-6 py-3 bg-rose-600 text-white rounded-lg" disabled={!canContinue} onClick={async()=>{
                if (!canContinue) {
                  showToast({ type: 'warning', title: 'Incomplete', message: 'Please complete all required fields before continuing.' });
                  return;
                }
                const ok = await (ackRef.current as any)?.submit?.();
                if (ok) setStep(3); else showToast({ type: 'error', title: 'Save failed', message: 'Please try again.' });
              }}>Next</button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="mb-6 border rounded-xl overflow-hidden">
              <SupportWorkerForm ref={supportWorkerRef as any} token={token} onValidityChange={setCanContinue} />
            </div>
            <div className="flex justify-end gap-3">
              <button className="px-6 py-3 border rounded-lg text-rose-600 border-rose-200 hover:bg-rose-50" onClick={async()=>{
                try {
                  const ok = await (supportWorkerRef.current as any)?.save?.(false);
                  if (ok) showToast({ type: 'success', title: 'Draft saved', message: 'You can continue later using the same link.' });
                  else showToast({ type: 'error', title: 'Draft save failed', message: 'Please try again.' });
                } catch (e: any) {
                  showToast({ type: 'error', title: 'Draft save failed', message: e?.message || 'Unexpected error' });
                }
              }}>Save Draft</button>
              <button className="px-6 py-3 bg-rose-600 text-white rounded-lg" onClick={async()=>{
                const result = (supportWorkerRef.current as any)?.validateDetailed?.();
                if (result && !result.isValid) {
                  const parts = [] as string[];
                  if (result.missing?.length) parts.push(`Missing: ${result.missing.join(', ')}`);
                  if (result.invalid?.length) parts.push(`Invalid: ${result.invalid.join(', ')}`);
                  showToast({ type: 'warning', title: 'Please correct the form', message: parts.join(' | ') });
                  return;
                }
                try {
                  const ok = await (supportWorkerRef.current as any)?.save?.(true);
                  if (ok) {
                    showToast({ type: 'success', title: 'Completed!', message: 'All forms have been submitted successfully.' });
                    // Could redirect to a completion page or dashboard
                  } else {
                    showToast({ type: 'error', title: 'Save failed', message: 'Please try again.' });
                  }
                } catch (e: any) {
                  showToast({ type: 'error', title: 'Save failed', message: e?.message || 'Unexpected error' });
                }
              }}>Complete</button>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="mb-6 border rounded-xl overflow-hidden">
              <EmployeeDetailsStep ref={detailsRef as any} token={token} onValidityChange={setCanContinue} />
            </div>
            <div className="flex justify-end gap-3">
              <button className="px-6 py-3 border rounded-lg text-rose-600 border-rose-200 hover:bg-rose-50" onClick={async()=>{
                try {
                  const ok = await (detailsRef.current as any)?.save?.(false);
                  if (ok) showToast({ type: 'success', title: 'Draft saved', message: 'You can continue later using the same link.' });
                  else showToast({ type: 'error', title: 'Draft save failed', message: 'Please try again.' });
                } catch (e: any) {
                  showToast({ type: 'error', title: 'Draft save failed', message: e?.message || 'Unexpected error' });
                }
              }}>Save Draft</button>
              <button className="px-6 py-3 bg-rose-600 text-white rounded-lg" onClick={async()=>{
                const result = (detailsRef.current as any)?.validateDetailed?.();
                if (result && !result.isValid) {
                  const parts = [] as string[];
                  if (result.missing?.length) parts.push(`Missing: ${result.missing.join(', ')}`);
                  if (result.invalid?.length) parts.push(`Invalid: ${result.invalid.join(', ')}`);
                  showToast({ type: 'warning', title: 'Please correct the form', message: parts.join(' | ') });
                  return;
                }
                try {
                  const ok = await (detailsRef.current as any)?.save?.(true);
                  if (ok) setStep(2); else showToast({ type: 'error', title: 'Save failed', message: 'Please try again.' });
                } catch (e: any) {
                  showToast({ type: 'error', title: 'Save failed', message: e?.message || 'Unexpected error' });
                }
              }}>Next</button>
            </div>
          </>
        )}


      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ToastProvider>
      <InnerPage />
    </ToastProvider>
  );
}
