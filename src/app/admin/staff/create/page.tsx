"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createStaff } from '@/lib/api';

export default function StaffCreatePage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!firstName.trim() || !surname.trim() || !email.trim()) {
      setError('First name, Surname and Email are required');
      return;
    }
    setLoading(true);
    try {
      await createStaff({ firstName, surname, email, phone: phone || undefined });
      router.push('/admin/staff');
    } catch (err: any) {
      setError(err.message || 'Failed to create staff');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Add New Staff</h1>
          <Link href="/admin/staff" className="text-sm text-rose-600 hover:underline">Back to Staff</Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">First Name *</label>
              <input value={firstName} onChange={(e)=>setFirstName(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="Enter staff first name" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Surname *</label>
              <input value={surname} onChange={(e)=>setSurname(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="Enter staff surname" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="staff@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
              <input value={phone} onChange={(e)=>setPhone(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="0412 345 678" />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Link href="/admin/staff" className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50">Cancel</Link>
            <button type="submit" disabled={loading} className="px-8 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl disabled:opacity-50">{loading ? 'Creating…' : 'Create Staff'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}


