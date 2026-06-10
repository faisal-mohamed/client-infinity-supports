"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FaArrowLeft, FaLink, FaCopy, FaEye, FaCalendarAlt, FaCheck, 
  FaClock, FaExclamationTriangle, FaPlus, FaTrash, FaEdit, 
  FaSave, FaTimes, FaUser, FaFileAlt, FaCheckCircle, FaSpinner,
  FaShare, FaDownload, FaHistory, FaShieldAlt, FaInfoCircle
} from 'react-icons/fa';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/components/ui/Confirm';

// Types
interface SignatureBatch {
  id: number;
  batchToken: string;
  expiresAt: string;
  createdAt: string;
  staff: {
    firstName: string;
    surname: string;
    email: string;
  };
  signatureForms: {
    id: number;
    formSubmission: {
      id: number;
      staffSignature?: string;
      staffSignedAt?: string;
      form: {
        title: string;
        formKey: string;
      };
    };
  }[];
}

interface StaffInfo {
  id: number;
  name: string;
  email: string;
}

export default function StaffSignatureLinksPageClient() {
  const params = useParams();
  const { showToast } = useToast();
  const confirm  = useConfirm();
  
  const staffId = params.id as string;
  
  const [staff, setStaff] = useState<StaffInfo | null>(null);
  const [signatureBatches, setSignatureBatches] = useState<SignatureBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExpiry, setEditingExpiry] = useState<number | null>(null);
  const [newExpiryDate, setNewExpiryDate] = useState<string>('');

  useEffect(() => {
    loadSignatureLinks();
  }, [staffId]);

  const loadSignatureLinks = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/staff/${staffId}/signature-links`);
      if (!response.ok) throw new Error('Failed to load signature links');
      
      const data = await response.json();
      setStaff(data.staff);
      setSignatureBatches(data.signatureBatches || []);
      
    } catch (error) {
      console.error('Error loading signature links:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load signature links',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const copyLinkToClipboard = async (token: string) => {
    const link = `${window.location.origin}/staff/signature/${token}`;
    try {
      await navigator.clipboard.writeText(link);
      showToast({
        type: 'success',
        title: 'Link Copied',
        message: 'Signature link copied to clipboard',
        duration: 2000,
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Copy Failed',
        message: 'Failed to copy link to clipboard',
        duration: 3000,
      });
    }
  };

  const deleteBatch = async (batchId: number) => {

    const confirmed = await confirm.confirm({
      title: 'Delete Signature Link',
      message: 'Are you sure you want to delete this signature link? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/staff-signature-batches/${batchId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete signature link');

      showToast({
        type: 'success',
        title: 'Link Deleted',
        message: 'Signature link has been deleted',
        duration: 3000,
      });

      loadSignatureLinks();
    } catch (error) {
      console.error('Error deleting signature link:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete signature link',
        duration: 3000,
      });
    }
  };

  const startEditingExpiry = (batchId: number, currentExpiry: string) => {
    setEditingExpiry(batchId);
    const date = new Date(currentExpiry);
    
    // Convert to local timezone for datetime-local input
    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    const formattedDate = localDate.toISOString().slice(0, 16);
    
    setNewExpiryDate(formattedDate);
  };

  const cancelEditingExpiry = () => {
    setEditingExpiry(null);
    setNewExpiryDate('');
  };

  const updateExpiry = async (batchId: number) => {
    if (!newExpiryDate) {
      showToast({
        type: 'error',
        title: 'Invalid Date',
        message: 'Please select a valid expiry date',
        duration: 3000,
      });
      return;
    }

    try {
      const localDateTime = new Date(newExpiryDate);
      
      const response = await fetch(`/api/staff-signature-batches/${batchId}/update-expiry`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          expiresAt: localDateTime.toISOString()
        }),
      });

      if (!response.ok) throw new Error('Failed to update expiry date');

      showToast({
        type: 'success',
        title: 'Expiry Updated',
        message: 'Link expiry date has been updated',
        duration: 3000,
      });

      setEditingExpiry(null);
      setNewExpiryDate('');
      loadSignatureLinks();
    } catch (error) {
      console.error('Error updating expiry:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update expiry date',
        duration: 3000,
      });
    }
  };

  const getStatusInfo = (batch: SignatureBatch) => {
    const now = new Date();
    const expiryDate = new Date(batch.expiresAt);
    const isExpired = now > expiryDate;
    
    const totalForms = batch.signatureForms.length;
    const signedForms = batch.signatureForms.filter(
      sf => sf.formSubmission.staffSignature
    ).length;
    const allSigned = signedForms === totalForms && totalForms > 0;

    if (allSigned) {
      return {
        label: 'Completed',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        icon: FaCheckCircle,
        iconColor: 'text-emerald-600'
      };
    }

    if (isExpired) {
      return {
        label: 'Expired',
        color: 'text-red-700 bg-red-50 border-red-200',
        icon: FaExclamationTriangle,
        iconColor: 'text-red-600'
      };
    }

    return {
      label: 'Active',
      color: 'text-azure-700 bg-azure-50 border-azure-100',
      icon: FaClock,
      iconColor: 'text-azure-600'
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeRemaining = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry.getTime() - now.getTime();

    if (diff < 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h remaining`;
    return 'Less than 1h remaining';
  };

  if (loading) {
    return (
      <div className=" flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="h-12 w-12 text-gold-500 animate-spin mx-auto mb-3" />
          <p className="text-azure-600 text-lg">Loading signature links...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <div className="mb-8">
  <div className="bg-white rounded-2xl border border-azure-100/60 p-5 shadow-soft">
    <div className="flex items-center mb-6">
      <Link 
        href={`/admin/staff/${staffId}/forms`}
        className="mr-4 p-2.5 bg-azure-100 hover:bg-azure-200 rounded-lg transition-colors "
      >
        <FaArrowLeft className="h-5 w-5 text-azure-600" />
      </Link>
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-3 rounded-xl bg-azure-700 text-gold-400 shadow-soft">
            <FaLink className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-azure-700">
            Staff Signature Links Management
          </h1>
        </div>
        <div className="flex items-center text-azure-600 space-x-4">
          <div className="flex items-center">
            <FaUser className="h-4 w-4 mr-2 text-gold-500" />
            <span className="font-semibold">{staff?.name}</span>
          </div>
          <span className="text-azure-400">•</span>
          <div className="flex items-center">
            <FaShieldAlt className="h-4 w-4 mr-2 text-gold-500" />
            <span>{staff?.email}</span>
          </div>
        </div>
        <p className="text-azure-600 text-sm mt-2">
          Manage and monitor signature links for staff form completion
        </p>
      </div>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-azure-50 rounded-xl p-4 border border-azure-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-azure-600 text-sm font-semibold mb-1">Total Links</p>
            <p className="text-2xl font-bold text-azure-700">{signatureBatches.length}</p>
          </div>
          <div className="p-3 bg-azure-600 rounded-lg">
            <FaLink className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-600 text-sm font-semibold mb-1">Active Links</p>
            <p className="text-2xl font-bold text-emerald-700">
              {signatureBatches.filter(b => {
                const now = new Date();
                const expiry = new Date(b.expiresAt);
                return now < expiry;
              }).length}
            </p>
          </div>
          <div className="p-3 bg-emerald-600 rounded-lg">
            <FaCheckCircle className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-gold-50 rounded-xl p-4 border border-gold-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gold-600 text-sm font-semibold mb-1">Expired Links</p>
            <p className="text-2xl font-bold text-gold-700">
              {signatureBatches.filter(b => {
                const now = new Date();
                const expiry = new Date(b.expiresAt);
                return now >= expiry;
              }).length}
            </p>
          </div>
          <div className="p-3 bg-gold-500 rounded-lg">
            <FaClock className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

        {/* Signature Links List */}
        <div className="space-y-6">
          {signatureBatches.length === 0 ? (
            <div className="bg-white rounded-2xl border border-azure-100/60 p-12 text-center shadow-soft">
              <FaInfoCircle className="h-10 w-10 text-azure-300 mx-auto mb-4" />
              <h3 className="text-base font-semibold text-azure-700 mb-2">No Signature Links</h3>
              <p className="text-azure-500">
                No signature links have been generated for this staff member yet.
              </p>
              <Link
                href={`/admin/staff/${staffId}/forms`}
                className="inline-flex items-center gap-2 mt-6 px-4 py-2.5 bg-azure-700 text-white rounded-xl font-semibold hover:bg-azure-600 transition-all duration-200"
              >
                <FaArrowLeft className="h-4 w-4" />
                Back to Forms
              </Link>
            </div>
          ) : (
            signatureBatches.map((batch) => {
              const statusInfo = getStatusInfo(batch);
              const isEditing = editingExpiry === batch.id;
              const totalForms = batch.signatureForms.length;
              const signedForms = batch.signatureForms.filter(
                sf => sf.formSubmission.staffSignature
              ).length;

              return (
                <div
                  key={batch.id}
                  className="bg-white rounded-2xl border border-azure-100/60 overflow-hidden shadow-soft transition-all duration-200"
                >
                  {/* Header */}
                  <div className="bg-azure-50/50 px-5 py-3.5 border-b border-azure-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`px-3 py-1.5 rounded-lg border ${statusInfo.color} flex items-center gap-2`}>
                          <statusInfo.icon className={`h-4 w-4 ${statusInfo.iconColor}`} />
                          <span className="font-semibold text-sm">{statusInfo.label}</span>
                        </div>
                        <div className="text-sm text-azure-600">
                          <span className="font-semibold">{signedForms}/{totalForms}</span> forms signed
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyLinkToClipboard(batch.batchToken)}
                          className="p-2 bg-azure-100 hover:bg-azure-200 text-azure-600 rounded-lg transition-colors"
                          title="Copy Link"
                        >
                          <FaCopy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteBatch(batch.id)}
                          className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                          title="Delete Link"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    {/* Link Info */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <FaLink className="h-4 w-4 text-azure-400" />
                        <span className="text-sm font-semibold text-azure-700">Signature Link</span>
                      </div>
                      <div className="bg-azure-50 rounded-lg p-3 border border-azure-200 font-mono text-sm text-azure-600 break-all">
                        {`${typeof window !== 'undefined' ? window.location.origin : ''}/staff/signature/${batch.batchToken}`}
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <FaCalendarAlt className="h-4 w-4 text-azure-400" />
                          <span className="text-sm font-semibold text-azure-700">Created</span>
                        </div>
                        <p className="text-sm text-azure-600">{formatDate(batch.createdAt)}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <FaClock className="h-4 w-4 text-azure-400" />
                          <span className="text-sm font-semibold text-azure-700">Expires</span>
                        </div>
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="datetime-local"
                              value={newExpiryDate}
                              onChange={(e) => setNewExpiryDate(e.target.value)}
                              className="flex-1 px-3 py-2 border border-azure-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                            />
                            <button
                              onClick={() => updateExpiry(batch.id)}
                              className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                              title="Save"
                            >
                              <FaSave className="h-4 w-4" />
                            </button>
                            <button
                              onClick={cancelEditingExpiry}
                              className="p-2 bg-azure-300 hover:bg-azure-400 text-azure-700 rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <FaTimes className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-azure-600">{formatDate(batch.expiresAt)}</p>
                            <button
                              onClick={() => startEditingExpiry(batch.id, batch.expiresAt)}
                              className="p-1 hover:bg-azure-100 rounded transition-colors"
                              title="Edit Expiry"
                            >
                              <FaEdit className="h-3 w-3 text-azure-400" />
                            </button>
                          </div>
                        )}
                        <p className="text-xs text-azure-500 mt-1">{getTimeRemaining(batch.expiresAt)}</p>
                      </div>
                    </div>

                    {/* Forms List */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <FaFileAlt className="h-4 w-4 text-azure-400" />
                        <span className="text-sm font-semibold text-azure-700">Forms ({totalForms})</span>
                      </div>
                      <div className="space-y-2">
                        {batch.signatureForms.map((sf) => (
                          <div
                            key={sf.id}
                            className="flex items-center justify-between p-3 bg-azure-50 rounded-lg border border-azure-200"
                          >
                            <div className="flex items-center gap-3">
                              {sf.formSubmission.staffSignature ? (
                                <FaCheckCircle className="h-5 w-5 text-emerald-500" />
                              ) : (
                                <FaClock className="h-5 w-5 text-azure-400" />
                              )}
                              <span className="text-sm font-medium text-azure-700">
                                {sf.formSubmission.form.title}
                              </span>
                            </div>
                            {sf.formSubmission.staffSignedAt && (
                              <span className="text-xs text-azure-500">
                                Signed {formatDate(sf.formSubmission.staffSignedAt)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

