"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getStaff, generateStaffLink } from '@/lib/api';
import StaffLinkModal from '@/app/components/components/staff/StaffLinkModal';
import {
  FaUserFriends,
  FaArrowLeft,
  FaUserPlus,
  FaEllipsisV,
  FaEye,
  FaLink,
  FaSearch,
} from "react-icons/fa";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

export default function StaffListPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{ url: string; expiresAt: string } | null>(null);
  const [modalName, setModalName] = useState('');
  const [modalId, setModalId] = useState<number>(0);
  const [selectedStaff, setSelectedStaff] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getStaff({ search });
      setRows(data.staff || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStaff([]);
    } else {
      setSelectedStaff(rows.map((staff) => staff.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectStaff = (id: number) => {
    if (selectedStaff.includes(id)) {
      setSelectedStaff(selectedStaff.filter((staffId) => staffId !== id));
      setSelectAll(false);
    } else {
      setSelectedStaff([...selectedStaff, id]);
      if (selectedStaff.length + 1 === rows.length) {
        setSelectAll(true);
      }
    }
  };

  const handleGenerateLink = async (staff: any) => {
    const res = await generateStaffLink(staff.id);
    setModalData({ url: res.link, expiresAt: res.expiresAt });
    setModalName(`${staff.firstName} ${staff.surname}`);
    setModalId(staff.id);
    setModalOpen(true);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-6 sm:mb-8 hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
          <div className="flex items-center gap-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-400 text-white shadow-lg">
              <FaUserFriends className="text-2xl sm:text-3xl" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Staff Management</h1>
              <p className="text-sm sm:text-base text-gray-600">Manage your staff and their information efficiently</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">{rows.length} Total Staff</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link 
              href="/admin/dashboard" 
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-rose-600 transition-all duration-200 px-4 py-3 border border-gray-200 rounded-xl hover:border-rose-200 hover:bg-rose-50 justify-center shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <FaArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <Link 
              href="/admin/staff/create" 
              className="flex items-center gap-2 text-sm text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 transition-all duration-200 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold justify-center"
            >
              <FaUserPlus className="h-4 w-4" />
              Add New Staff
            </Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Search Section - Separate Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-6 sm:mb-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 h-5 w-5" />
              </div>
              <input 
                value={search} 
                onChange={(e)=>setSearch(e.target.value)} 
                placeholder="Search staff by name, email, phone..." 
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm sm:text-base shadow-sm hover:shadow-md transition-shadow duration-200" 
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={load} 
                className="px-6 py-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold transition-all duration-200 whitespace-nowrap"
              >
                Search
              </button>
              <Link 
                href="/admin/staff/create" 
                className="px-6 py-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold transition-all duration-200 flex items-center gap-2 justify-center whitespace-nowrap"
              >
                <FaUserPlus className="h-4 w-4" />
                Add New Staff
              </Link>
            </div>
          </div>
        </div>

        {/* Table Section - Separate Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          {loading ? (
            <div className="flex justify-center items-center h-80">
              <div className="text-center">
                <div className="w-20 h-20 border-4 border-t-rose-500 border-rose-200 rounded-full animate-spin mx-auto mb-6"></div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Loading Staff</h3>
                <p className="text-slate-600 font-medium">Please wait while we fetch your staff data...</p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          ) : rows.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Staff Found</h3>
              <p className="text-gray-500 font-medium mb-6">Get started by adding your first staff member.</p>
              <Link 
                href="/admin/staff/create" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold transition-all duration-200"
              >
                <FaUserPlus className="h-4 w-4" />
                Add New Staff
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow hover:shadow-lg transition-shadow duration-300">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-slate-500">
                        <input 
                          type="checkbox" 
                          className="accent-rose-500" 
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-slate-500">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-slate-500">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-slate-500">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-slate-500">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rows.map((s) => (
                      <tr key={s.id} className="hover:bg-rose-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="accent-rose-500"
                            checked={selectedStaff.includes(s.id)}
                            onChange={() => handleSelectStaff(s.id)}
                          />
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 flex items-center justify-center bg-rose-100 text-rose-600 rounded-lg font-bold">
                              {s.firstName?.charAt(0)}{s.surname?.charAt(0)}
                            </div>
                            {s.firstName} {s.surname}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {s.email || (
                            <span className="text-gray-400 italic">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {s.phone || (
                            <span className="text-gray-400 italic">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {s.status === 'success' ? (
                            <span className="inline-block text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">Success</span>
                          ) : s.status === 'deleted' ? (
                            <span className="inline-block text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Deleted</span>
                          ) : (
                            <span className="inline-block text-xs font-medium bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Pending</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Menu as="div" className="relative inline-block text-left">
                            <MenuButton className="text-slate-500 hover:text-rose-600 transition">
                              <FaEllipsisV className="w-5 h-5" />
                            </MenuButton>

                            <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right bg-white border border-gray-200 rounded-xl shadow-lg focus:outline-none z-50">
                              <div className="py-1 text-sm text-slate-700">
                                <MenuItem>
                                  {({ active } : any) => (
                                    <Link
                                      href={`/admin/staff/${s.id}`}
                                      className={`flex items-center gap-2 px-4 py-2 hover:bg-slate-50 ${
                                        active ? "text-slate-600" : ""
                                      }`}
                                    >
                                      <FaEye className="w-4 h-4" />
                                      View More
                                    </Link>
                                  )}
                                </MenuItem>

                                <MenuItem>
                                  {({ active } : any) => (
                                    <button
                                      onClick={() => handleGenerateLink(s)}
                                      className={`flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-green-50 ${
                                        active ? "text-green-600" : ""
                                      }`}
                                    >
                                      <FaLink className="w-4 h-4" />
                                      Generate Link
                                    </button>
                                  )}
                                </MenuItem>
                              </div>
                            </MenuItems>
                          </Menu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      <StaffLinkModal isOpen={modalOpen} onClose={()=>setModalOpen(false)} staffName={modalName} staffId={modalId} link={modalData} />
    </div>
  );
}


