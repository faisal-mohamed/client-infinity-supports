"use client";

import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import {
    FaEye,
    FaTrash,
    FaFileAlt,
    FaSearch,
    FaDownload,
    FaArrowLeft,
    FaChevronLeft,
    FaChevronRight,
    FaEllipsisV,
    FaChevronDown,
    FaClipboardCheck,
    FaClock,
    FaCheckCircle,
    FaUserFriends
} from "react-icons/fa";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/components/ui/Confirm";
import useRequireAuth from "../../hooks/useRequireAuth";

// Define client type based on API response
type Client = {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    createdAt: string;
    commonFields?: {
        name?: string;
        surname?: string;
        ndis?: string;
        state?: string;
        disability?: string;
        sex?: string;
    };
    pendingForms: {
        id: number;
        title: string;
        formKey: string;
        currentStatus: string;
    }[];
};

type Pagination = {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

export default function AdminReviewPageClient({
    initialData
}: {
    initialData?: {
        clients: Client[];
        pagination: Pagination;
    };
}) {
    const { session, status } = useRequireAuth();
    const router = useRouter();
    const confirm = useConfirm();

    const [clients, setClients] = useState<Client[]>(initialData?.clients || []);
    const [loading, setLoading] = useState(!initialData);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [reviewStatus, setReviewStatus] = useState<"pending_admin_review" | "completed">("pending_admin_review");

    // Pagination state
    const [pagination, setPagination] = useState<Pagination>(initialData?.pagination || {
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });

    const stateMapping = {
        "ACT": "Australian Capital Territory",
        "NSW": "New South Wales",
        "NT": "Northern Territory",
        "QLD": "Queensland",
        "SA": "South Australia",
        "TAS": "Tasmania",
        "VIC": "Victoria",
        "WA": "Western Australia"
    };

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setPagination(prev => ({ ...prev, page: 1 }));
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        if (!session) return;

        // Skip the first fetch if we have initial data and haven't changed filters
        const isFirstLoadWithInitialData = initialData &&
            reviewStatus === "pending_admin_review" &&
            !debouncedSearchTerm &&
            pagination.page === 1 &&
            initialData.clients.length === clients.length; // Simple heuristic to check if we've already rendered it

        if (isFirstLoadWithInitialData && loading === false) {
            // We already have the data, but we might want to refresh it once to stay in sync
            // For now, let's just return to avoid the "flash"
            return;
        }

        const fetchPendingActions = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                params.append("status", reviewStatus);
                if (debouncedSearchTerm) params.append("search", debouncedSearchTerm);
                params.append("page", pagination.page.toString());
                params.append("pageSize", pagination.pageSize.toString());

                const response = await fetch(`/api/admin/pending-actions?${params.toString()}`);
                if (!response.ok) throw new Error("Failed to fetch pending actions");

                const data = await response.json();
                setClients(data.clients);
                setPagination(data.pagination);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPendingActions();
    }, [reviewStatus, debouncedSearchTerm, pagination.page, pagination.pageSize, session]);

    const handleDeleteClient = async (id: number) => {
        const confirmed = await confirm.confirm({
            title: "Delete Client",
            message: "Are you sure you want to delete this client? This will also delete all associated forms and data.",
            confirmText: "Delete",
            cancelText: "Cancel",
            type: "danger",
        });

        if (!confirmed) return;

        try {
            const response = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error("Failed to delete client");
            setPagination(prev => ({ ...prev }));
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handlePageChange = (newPage: number) => {
        setPagination({ ...pagination, page: newPage });
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = parseInt(e.target.value);
        setPagination({ ...pagination, page: 1, pageSize: newPageSize });
    };

    if (status === "loading" || !session) return null;

    const activeTabClass = "inline-flex items-center px-6 py-4 border-b-2 border-gold-500 text-sm font-bold text-gold-600 transition-all duration-200";
    const inactiveTabClass = "inline-flex items-center px-6 py-4 border-b-2 border-transparent text-sm font-medium text-azure-400 hover:text-azure-600 hover:border-azure-200 transition-all duration-200";

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-azure-50 p-6 sm:p-8 mb-6 sm:mb-8 hover:shadow-xl transition-shadow duration-300 animate-[fadeIn_0.5s_ease-out]">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
                        <div className="flex items-center gap-6">
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-400 text-white shadow-lg">
                                <FaClipboardCheck className="text-2xl sm:text-3xl" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-azure-700 mb-2 font-[Montserrat]">
                                    Admin Review Dashboard
                                </h1>
                                <p className="text-sm sm:text-base text-azure-500">
                                    {reviewStatus === "pending_admin_review"
                                        ? "Review and sign forms awaiting administrator approval"
                                        : "View historical forms completed by administrators"}
                                </p>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-2 text-sm text-azure-400">
                                        <div className={`w-2 h-2 ${reviewStatus === "pending_admin_review" ? "bg-amber-500" : "bg-green-500"} rounded-full`}></div>
                                        <span className="font-medium">
                                            {pagination.totalCount} {reviewStatus === "pending_admin_review" ? "Pending" : "Completed"} Reviews
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <Link
                                href="/admin/dashboard"
                                className="flex items-center gap-2 text-sm text-azure-500 hover:text-gold-600 transition-all duration-200 px-4 py-3 border border-azure-100 rounded-xl hover:border-gold-200 hover:bg-gold-50 justify-center shadow-md hover:shadow-lg transform hover:scale-105"
                            >
                                <FaArrowLeft className="h-4 w-4" />
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Search & Tabs Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-azure-50 p-6 sm:p-8 mb-6 sm:mb-8 hover:shadow-xl transition-shadow duration-300 animate-[fadeInUp_0.5s_ease-out]">
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-end">
                        <div className="flex-grow w-full relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FaSearch className="text-azure-300 h-5 w-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search clients by name, email, phone, NDIS number, state..."
                                className="w-full pl-12 pr-4 py-4 border border-azure-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm sm:text-base shadow-sm hover:shadow-md transition-shadow duration-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="border-b border-azure-100 w-full md:w-auto">
                            <nav className="-mb-px flex space-x-8">
                                <button
                                    onClick={() => { setReviewStatus("pending_admin_review"); setPagination(p => ({ ...p, page: 1 })); }}
                                    className={reviewStatus === "pending_admin_review" ? activeTabClass : inactiveTabClass}
                                >
                                    <FaClock className="mr-2" />
                                    Pending Review
                                    {reviewStatus === "pending_admin_review" && pagination.totalCount > 0 && (
                                        <span className="ml-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-md">
                                            {pagination.totalCount}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => { setReviewStatus("completed"); setPagination(p => ({ ...p, page: 1 })); }}
                                    className={reviewStatus === "completed" ? activeTabClass : inactiveTabClass}
                                >
                                    <FaCheckCircle className="mr-2" />
                                    Completed
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-azure-50 overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-[fadeInUp_0.6s_ease-out]">
                    <div className="overflow-hidden bg-white shadow">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-azure-100 text-sm">
                                <thead className="bg-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-azure-500 uppercase tracking-wider border-b-2 border-azure-700">
                                            <input type="checkbox" className="accent-gold-500 rounded border-azure-200" />
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-azure-500 uppercase tracking-wider border-b-2 border-azure-700">
                                            NAME
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-azure-500 uppercase tracking-wider border-b-2 border-azure-700">
                                            PHONE
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-azure-500 uppercase tracking-wider border-b-2 border-azure-700">
                                            STATE
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-azure-500 uppercase tracking-wider border-b-2 border-azure-700">
                                            {reviewStatus === "pending_admin_review" ? "AWAITING REVIEW" : "REVIEWED FORMS"}
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-azure-500 uppercase tracking-wider border-b-2 border-azure-700">
                                            ACTIONS
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-azure-50 bg-white border-t border-azure-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-16 h-16 border-4 border-t-gold-500 border-gold-200 rounded-full animate-spin mb-4"></div>
                                                    <p className="text-azure-400 font-medium">Loading review dashboard...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : clients.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-16 text-center text-azure-400 font-medium italic">
                                                No clients found awaiting review.
                                            </td>
                                        </tr>
                                    ) : (
                                        clients.map((client) => {
                                            const fullName = client?.commonFields?.name && client?.commonFields?.surname
                                                ? `${client.commonFields.name} ${client.commonFields.surname}`.trim()
                                                : client?.name || 'Unknown Client';
                                            const firstLetter = fullName.charAt(0).toUpperCase();
                                            const state = client?.commonFields?.state;

                                            return (
                                                <tr key={client.id} className="hover:bg-gold-50 transition-all duration-200">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input type="checkbox" className="accent-gold-500 rounded border-azure-200" />
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-azure-700">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 flex items-center justify-center bg-gold-100 text-gold-600 rounded-lg font-bold border border-gold-200 shadow-sm">
                                                                {firstLetter}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-bold text-azure-700 font-[Montserrat]">{fullName}</div>
                                                                <div className="text-xs text-azure-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                                                                    NDIS: {client.commonFields?.ndis || "N/A"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-azure-600 whitespace-nowrap">
                                                        {client.phone || (
                                                            <span className="text-azure-300 italic font-normal">N/A</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-azure-600 whitespace-nowrap">
                                                        {state ? (
                                                            <span className="inline-block text-xs font-bold bg-gold-100 text-gold-700 px-3 py-1 rounded-full border border-gold-200">
                                                                {stateMapping[state as keyof typeof stateMapping] || state}
                                                            </span>
                                                        ) : (
                                                            <span className="text-sm text-azure-300 italic">N/A</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-wrap gap-2">
                                                            {client.pendingForms.map((form) => (
                                                                <span
                                                                    key={form.id}
                                                                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${reviewStatus === "pending_admin_review"
                                                                        ? "bg-amber-100 text-amber-800 border border-amber-200 shadow-sm"
                                                                        : "bg-green-100 text-green-800 border border-green-200 shadow-sm"
                                                                        }`}
                                                                >
                                                                    {form.title}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Menu as="div" className="relative inline-block text-left">
                                                            <MenuButton className="text-azure-400 hover:text-gold-600 transition p-2 hover:bg-gold-50 rounded-lg">
                                                                <FaEllipsisV className="w-5 h-5" />
                                                            </MenuButton>
                                                            <Transition
                                                                as={Fragment}
                                                                enter="transition ease-out duration-100"
                                                                enterFrom="transform opacity-0 scale-95"
                                                                enterTo="transform opacity-100 scale-100"
                                                                leave="transition ease-in duration-75"
                                                                leaveFrom="transform opacity-100 scale-100"
                                                                leaveTo="transform opacity-0 scale-95"
                                                            >
                                                                <MenuItems
                                                                    anchor="bottom end"
                                                                    className="w-44 origin-top-right bg-white border border-azure-100 rounded-xl shadow-xl focus:outline-none z-50 p-1 mt-2 [--anchor-gap:8px]"
                                                                >
                                                                    <div className="py-1">
                                                                        <MenuItem>
                                                                            {({ active }) => (
                                                                                <Link
                                                                                    href={`/admin/clients/${client.id}`}
                                                                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${active ? 'bg-gold-50 text-gold-600' : 'text-azure-600'}`}
                                                                                >
                                                                                    <FaEye className="w-4 h-4" />
                                                                                    <span className="font-semibold text-sm">View</span>
                                                                                </Link>
                                                                            )}
                                                                        </MenuItem>
                                                                        <MenuItem>
                                                                            {({ active }) => (
                                                                                <Link
                                                                                    href={`/admin/clients/${client.id}/forms`}
                                                                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${active ? 'bg-green-50 text-green-600' : 'text-azure-600'}`}
                                                                                >
                                                                                    <FaFileAlt className="w-4 h-4" />
                                                                                    <span className="font-semibold text-sm">Forms</span>
                                                                                </Link>
                                                                            )}
                                                                        </MenuItem>
                                                                        <MenuItem>
                                                                            {({ active }) => (
                                                                                <button
                                                                                    onClick={() => handleDeleteClient(client.id)}
                                                                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors w-full text-left ${active ? 'bg-red-50 text-red-600' : 'text-red-500'}`}
                                                                                >
                                                                                    <FaTrash className="w-4 h-4" />
                                                                                    <span className="font-semibold text-sm">Delete</span>
                                                                                </button>
                                                                            )}
                                                                        </MenuItem>
                                                                    </div>
                                                                </MenuItems>
                                                            </Transition>
                                                        </Menu>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination Controls */}
                    {!loading && pagination.totalCount > 0 && (
                        <div className="px-6 sm:px-8 py-6 bg-white border-t border-azure-100">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-0">
                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <p className="text-sm font-medium text-azure-600">
                                        Showing{" "}
                                        <span className="font-bold text-gold-600">
                                            {clients.length}
                                        </span>{" "}
                                        of{" "}
                                        <span className="font-bold text-gold-600">
                                            {pagination.totalCount}
                                        </span>{" "}
                                        clients
                                    </p>

                                    <div className="relative inline-block">
                                        <label htmlFor="pageSize" className="text-sm font-medium text-azure-500 mr-2">Show:</label>
                                        <select
                                            id="pageSize"
                                            value={pagination.pageSize}
                                            onChange={handlePageSizeChange}
                                            className="cursor-pointer appearance-none border border-gold-300 text-sm text-gold-700 font-bold bg-white py-2 pl-4 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 hover:shadow-md transition-all duration-200"
                                        >
                                            <option value="5">5</option>
                                            <option value="10">10</option>
                                            <option value="25">25</option>
                                            <option value="50">50</option>
                                        </select>
                                        <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gold-500">
                                            <FaChevronDown className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={!pagination.hasPreviousPage}
                                        className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 shadow-md transform hover:scale-105 ${pagination.hasPreviousPage
                                            ? "bg-white text-gold-600 border border-gold-200 hover:bg-gold-50"
                                            : "bg-azure-100 text-azure-300 cursor-not-allowed border border-azure-100"
                                            }`}
                                    >
                                        ‹ Prev
                                    </button>

                                    <span className="text-sm text-azure-600 font-bold bg-gold-50 px-4 py-2 rounded-xl border border-gold-100">
                                        Page{" "}
                                        <span className="text-gold-600 font-black">{pagination.page}</span>
                                        {" "}of{" "}
                                        <span className="text-gold-600 font-black">{pagination.totalPages}</span>
                                    </span>

                                    <button
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={!pagination.hasNextPage}
                                        className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 shadow-md transform hover:scale-105 ${pagination.hasNextPage
                                            ? "bg-white text-gold-600 border border-gold-200 hover:bg-gold-50"
                                            : "bg-azure-100 text-azure-300 cursor-not-allowed border border-azure-100"
                                            }`}
                                    >
                                        Next ›
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
