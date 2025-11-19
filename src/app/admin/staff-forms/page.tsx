"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAllStaffForms } from '@/app/forms/staff-registry';
import { FaFileAlt, FaUser } from 'react-icons/fa';

export default function StaffFormsHomePage() {
  const [forms, setForms] = useState<any[]>([]);

  useEffect(() => {
    setForms(getAllStaffForms());
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-6 sm:mb-8 hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Staff Forms</h1>
            <p className="text-sm sm:text-base text-gray-600">View list of all staff forms</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                <tr>
                  <th className="px-4 py-4 text-left text-slate-600 uppercase tracking-wider text-xs font-bold">Title</th>
                  <th className="px-4 py-4 text-left text-slate-600 uppercase tracking-wider text-xs font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {forms.map((f)=> {
                  // Use FaUser icon for Employee Details, FaFileAlt for others
                  const IconComponent = f.key === 'employee_details' ? FaUser : FaFileAlt;
                  return (
                  <tr key={f.key} className="hover:bg-gradient-to-r hover:from-rose-50 hover:to-slate-50 transition-all duration-200">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-500 flex items-center justify-center shadow-md">
                          <IconComponent className="text-white h-5 w-5" />
                        </div>
                        <div className="font-semibold text-slate-800 text-sm sm:text-base">{f.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Link href={`/admin/staff-forms/${f.key}`} className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white px-4 py-2 rounded-xl text-sm shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105">View</Link>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


