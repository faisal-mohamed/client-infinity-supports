"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAllStaffForms } from '@/app/forms/staff-registry';
import { FaFileAlt, FaUser, FaEye } from 'react-icons/fa';

export default function StaffFormsHomePage() {
  const [forms, setForms] = useState<any[]>([]);

  useEffect(() => {
    setForms(getAllStaffForms());
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-azure-700 text-gold-400 shadow-soft">
            <FaFileAlt className="text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-azure-700">Staff Forms</h1>
            <p className="text-sm text-azure-400 mt-0.5">View list of all staff forms</p>
          </div>
        </div>
        <span className="text-sm text-azure-500 bg-azure-50 px-3.5 py-1.5 rounded-lg font-medium border border-azure-100">
          Showing <span className="font-bold text-azure-700">{forms.length}</span> forms
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-azure-100/60 overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-azure-100 text-sm">
            <thead className="bg-azure-50/50">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-azure-700 uppercase tracking-wider">Title</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-azure-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-azure-50">
              {forms.map((f) => {
                const IconComponent = f.key === 'employee_details' ? FaUser : FaFileAlt;
                return (
                  <tr key={f.key} className="hover:bg-azure-50/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-azure-50 flex items-center justify-center flex-shrink-0 border border-azure-100">
                          <IconComponent className="text-azure-500 w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-azure-700">{f.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/staff-forms/${f.key}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-azure-700 bg-azure-50 rounded-xl hover:bg-azure-100 border border-azure-100 transition-all duration-200"
                      >
                        <FaEye className="w-3 h-3" />
                        <span className="hidden sm:inline">View</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
