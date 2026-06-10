"use client";

import Link from 'next/link';

export default function StaffFormCreatePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">New Staff Form</h1>
        <Link href="/admin/staff-forms" className="text-sm text-gold-600 hover:underline">Back to Staff Forms</Link>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-soft border border-azure-50">
        <div className="text-azure-400 text-sm">Onboarding form builder will be added here following the same pattern as client forms.</div>
      </div>
    </div>
  );
}


