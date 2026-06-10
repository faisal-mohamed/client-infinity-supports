"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getStaff, deleteStaff } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/components/ui/Confirm';
import {
  FaUserFriends,
  FaArrowLeft,
  FaUserPlus,
  FaEllipsisV,
  FaEye,
  FaSearch,
  FaFileAlt,
  FaTrash,
  FaSpinner,
} from "react-icons/fa";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

export default function StaffListPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const confirm = useConfirm();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [deletingStaffId, setDeletingStaffId] = useState<string | number | null>(null);
  const [viewingStaffId, setViewingStaffId] = useState<string | number | null>(null);
  const [viewingFormsId, setViewingFormsId] = useState<string | number | null>(null);

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

  const handleDeleteStaff = async (staff: any) => {
    if (deletingStaffId) return;

    const confirmed = await confirm.confirm({
      title: "Delete Staff Member",
      message: `Are you sure you want to delete ${staff.firstName} ${staff.surname}? This will permanently remove all associated forms, submissions, and data.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
    });

    if (!confirmed) return;

    try {
      setDeletingStaffId(staff.id);
      
      await deleteStaff(staff.id);

      showToast({
        type: 'success',
        title: 'Staff Deleted',
        message: `${staff.firstName} ${staff.surname} has been deleted successfully`,
        duration: 3000,
      });

      // Reload the staff list
      await load();
    } catch (error: any) {
      console.error('Error deleting staff:', error);
      showToast({
        type: 'error',
        title: 'Delete Failed',
        message: error.message || 'Failed to delete staff. Please try again.',
        duration: 5000,
      });
    } finally {
      setDeletingStaffId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-2xl border border-azure-100/60 p-6 mb-6 shadow-soft">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-azure-700 text-gold-400 shadow-soft">
              <FaUserFriends className="text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-azure-700">Staff Management</h1>
              <p className="text-sm text-azure-400 mt-0.5">Manage your staff and their information efficiently</p>
              <div className="flex items-center gap-2 mt-1 text-sm text-azure-400">
                <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                <span className="font-medium">{rows.length} Total Staff</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Link href="/admin/dashboard" className="flex items-center gap-2 text-sm text-azure-600 hover:text-azure-700 px-3 py-2.5 border border-azure-100 rounded-xl hover:bg-azure-50 justify-center transition-all duration-200">
              <FaArrowLeft className="h-3.5 w-3.5" />
              Back to Dashboard
            </Link>
            <Link href="/admin/staff/create" className="flex items-center gap-2 text-sm text-white bg-azure-700 hover:bg-azure-600 px-4 py-2.5 rounded-xl font-semibold justify-center transition-all duration-200 shadow-soft">
              <FaUserPlus className="h-3.5 w-3.5" />
              Add New Staff
            </Link>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-azure-100/60 p-4 mb-4 shadow-soft">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-azure-300 w-3.5 h-3.5" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search staff by name, email, phone..."
              className="w-full pl-10 pr-4 py-2.5 border border-azure-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all duration-200"
            />
          </div>
          <button
            onClick={load}
            className="px-4 py-2.5 bg-azure-700 hover:bg-azure-600 text-white rounded-xl text-sm font-semibold transition-all duration-200"
          >
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-azure-100/60 overflow-visible shadow-soft">
        {loading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-azure-700 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm text-azure-400">Loading staff...</p>
            </div>
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-azure-300 text-4xl mb-4">📋</div>
            <p className="text-sm text-azure-400 mb-4">No staff found. Get started by adding your first staff member.</p>
            <Link
              href="/admin/staff/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-azure-700 hover:bg-azure-600 text-white rounded-xl text-sm font-semibold transition-all duration-200"
            >
              <FaUserPlus className="h-3.5 w-3.5" />
              Add New Staff
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-azure-100 text-sm">
              <thead className="bg-azure-50/50">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-azure-700 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="accent-gold-500 rounded border-azure-200"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-azure-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-azure-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-azure-700 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-azure-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-azure-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-azure-50">
                {rows.map((s) => (
                  <tr key={s.id} className="hover:bg-azure-50/30 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="accent-gold-500 rounded border-azure-200"
                        checked={selectedStaff.includes(s.id)}
                        onChange={() => handleSelectStaff(s.id)}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center bg-azure-50 text-azure-700 rounded-lg text-xs font-semibold border border-azure-100">
                          {s.firstName?.charAt(0)}{s.surname?.charAt(0)}
                        </div>
                        <span className="font-semibold text-azure-700">{s.firstName} {s.surname}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-azure-500">
                      {s.email || <span className="text-azure-300">—</span>}
                    </td>
                    <td className="px-5 py-4 text-azure-500">
                      {s.phone || <span className="text-azure-300">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      {s.status === 'success' ? (
                        <span className="inline-flex items-center text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-100">Success</span>
                      ) : s.status === 'deleted' ? (
                        <span className="inline-flex items-center text-xs font-semibold bg-azure-50 text-azure-600 px-2.5 py-1 rounded-lg border border-azure-100">Deleted</span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-semibold bg-gold-50 text-gold-700 px-2.5 py-1 rounded-lg border border-gold-100">Pending</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Menu as="div" className="relative inline-block text-left">
                        <MenuButton className="p-1.5 rounded-lg text-azure-400 hover:text-azure-600 hover:bg-azure-100 transition-colors">
                          <FaEllipsisV className="w-3.5 h-3.5" />
                        </MenuButton>
                        <MenuItems anchor="bottom end" className="w-36 bg-white border border-azure-100 rounded-xl shadow-soft focus:outline-none z-50 py-1 [--anchor-gap:4px]">
                          <MenuItem>
                            {({ close }: any) => (
                              <Link
                                href={`/admin/staff/${s.id}`}
                                onClick={() => { setViewingStaffId(s.id); setTimeout(() => close(), 100); }}
                                className={`flex items-center gap-2 px-3 py-2 text-sm text-azure-600 hover:bg-azure-50 rounded-lg mx-1 ${viewingStaffId === s.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                {viewingStaffId === s.id ? <FaSpinner className="w-3.5 h-3.5 animate-spin" /> : <FaEye className="w-3.5 h-3.5" />}
                                {viewingStaffId === s.id ? "Loading..." : "View"}
                              </Link>
                            )}
                          </MenuItem>
                          <MenuItem>
                            {({ close }: any) => (
                              <Link
                                href={`/admin/staff/${s.id}/forms`}
                                onClick={() => { setViewingFormsId(s.id); setTimeout(() => close(), 100); }}
                                className={`flex items-center gap-2 px-3 py-2 text-sm text-azure-600 hover:bg-azure-50 rounded-lg mx-1 ${viewingFormsId === s.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                {viewingFormsId === s.id ? <FaSpinner className="w-3.5 h-3.5 animate-spin" /> : <FaFileAlt className="w-3.5 h-3.5" />}
                                {viewingFormsId === s.id ? "Loading..." : "Forms"}
                              </Link>
                            )}
                          </MenuItem>
                          <MenuItem>
                            {({ close }: any) => (
                              <button
                                onClick={async () => { await handleDeleteStaff(s); setTimeout(() => close(), 100); }}
                                disabled={deletingStaffId === s.id}
                                className={`flex items-center gap-2 px-3 py-2 text-sm w-full text-left text-red-600 hover:bg-red-50 rounded-lg mx-1 disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                {deletingStaffId === s.id ? <FaSpinner className="w-3.5 h-3.5 animate-spin" /> : <FaTrash className="w-3.5 h-3.5" />}
                                {deletingStaffId === s.id ? "Deleting..." : "Delete"}
                              </button>
                            )}
                          </MenuItem>
                        </MenuItems>
                      </Menu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


