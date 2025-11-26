"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { getStaffFormComponent } from '@/app/forms/staff-registry';
import { useToast } from '@/components/ui/Toast';
import LoadingView from '@/components/ui/LoadingView';

export default function NdisWorkforceCapabilityFormPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [staff, setStaff] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    fullName: '',
    readAcknowledgement: false,
    signature: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      console.log('🔵 [NDIS Workforce Capability Page] Loading data for token:', token);
      console.log('🔵 [NDIS Workforce Capability Page] Current pathname:', window.location.pathname);
      try {
        // Always use signature link API (onboard flow removed)
        console.log('🔵 [NDIS Workforce Capability Page] Using signature link API');
        
        // Use the form-specific endpoint to get the actual form data
        const apiEndpoint = `/api/staff/signature/${token}/forms/ndis_workforce_capability`;
        console.log('🔵 [NDIS Workforce Capability Page] Using API endpoint:', apiEndpoint);
        
        // Add cache-busting parameter to ensure fresh data
        const res = await fetch(`${apiEndpoint}?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          }
        });
        const data = await res.json();
        console.log('🔵 [NDIS Workforce Capability Page] API Response:', data);
        
        if (!res.ok) throw new Error(data.error);
        
        setStaff(data.staff);
        
        // Load saved form data - always use signature link structure
        let ndisData: any = {};
        {
          console.log('🔵 [NDIS Workforce Capability Page] Processing signature link data');
          console.log('🔵 [NDIS Workforce Capability Page] API Response structure:', {
            hasSubmissions: !!data.submissions,
            hasSignatureForms: !!data.signatureForms,
            hasStaff: !!data.staff,
            dataKeys: Object.keys(data)
          });
          
          // The form-specific endpoint returns { staff, submissions: { formKey: formData } }
          if (data.submissions && data.submissions['ndis_workforce_capability']) {
            ndisData = { ...(data.submissions['ndis_workforce_capability'] || {}) };
            console.log('🔵 [NDIS Workforce Capability Page] Loaded from submissions object:', {
              keys: Object.keys(ndisData),
              hasSignature: !!ndisData.signature,
              hasStaffSignature: !!ndisData.staffSignature,
              signatureValue: ndisData.signature ? 'EXISTS' : 'NULL/EMPTY'
            });
          } else {
            // Fallback to batch endpoint structure (for backward compatibility)
          const ndisForm = data.signatureForms?.find(
            (f: any) => f.formSubmission?.form?.formKey === 'ndis_workforce_capability'
          );
            console.log('🔵 [NDIS Workforce Capability Page] Found NDIS form in batch:', {
              found: !!ndisForm,
              staffSignature: ndisForm?.formSubmission?.staffSignature ? 'EXISTS' : 'NULL',
              staffSignedAt: ndisForm?.formSubmission?.staffSignedAt,
              dataKeys: Object.keys(ndisForm?.formSubmission?.data || {}),
              dataHasSignature: !!(ndisForm?.formSubmission?.data as any)?.signature
            });
            
          if (ndisForm) {
              ndisData = { ...(ndisForm.formSubmission?.data || {}) };
              console.log('🔵 [NDIS Workforce Capability Page] Initial ndisData:', {
                keys: Object.keys(ndisData),
                hasSignature: !!ndisData.signature,
                hasStaffSignature: !!ndisData.staffSignature
              });
              
            // Only set signature from staffSignature column if it exists (not cleared)
              // If staffSignature is null, explicitly remove signature fields
            if (ndisForm.formSubmission?.staffSignature) {
              ndisData.signature = ndisForm.formSubmission.staffSignature;
                console.log('✅ [NDIS Workforce Capability Page] Added signature from staffSignature column');
            } else {
                // Signature was cleared - explicitly remove all signature fields
                delete ndisData.signature;
                delete ndisData.staffSignature;
                delete ndisData.orientationSignature;
                console.log('🗑️ [NDIS Workforce Capability Page] Removed ALL signature fields (staffSignature is null)');
            }
            if (ndisForm.formSubmission?.staffSignedAt) {
              ndisData.date = new Date(ndisForm.formSubmission.staffSignedAt).toISOString().split('T')[0];
            } else {
                // Date was cleared - remove date fields and set to today
                delete ndisData.date;
                delete ndisData.acknowledgedAt;
                delete ndisData.staffSignedAt;
              ndisData.date = new Date().toISOString().split('T')[0];
              }
            }
          }
          
          console.log('🔵 [NDIS Workforce Capability Page] After processing signature link:', {
            keys: Object.keys(ndisData),
            hasSignature: !!ndisData.signature,
            signatureValue: ndisData.signature ? 'EXISTS' : 'NULL/EMPTY'
          });
        }

        const defaultData = {
          fullName: `${data.staff?.firstName ?? ''} ${data.staff?.surname ?? ''}`.trim(),
          readAcknowledgement: false,
          signature: '',
          date: new Date().toISOString().split('T')[0],
        };
        
        // Merge with explicit signature handling
        const mergedData = {
          ...defaultData,
          ...ndisData,
        };
        
        console.log('🔵 [NDIS Workforce Capability Page] Before final signature check:', {
          keys: Object.keys(mergedData),
          hasSignature: !!mergedData.signature,
          hasStaffSignature: !!mergedData.staffSignature,
          signatureValue: mergedData.signature ? 'EXISTS' : 'NULL/EMPTY'
        });
        
        // If signature was cleared, ensure it's empty string (not undefined)
        if (!mergedData.signature && !mergedData.staffSignature) {
          mergedData.signature = '';
          console.log('🗑️ [NDIS Workforce Capability Page] Set signature to empty string (final cleanup)');
        }
        
        console.log('✅ [NDIS Workforce Capability Page] Final loaded form data:', {
          keys: Object.keys(mergedData),
          hasSignature: !!mergedData.signature,
          signatureValue: mergedData.signature ? 'EXISTS' : 'NULL/EMPTY',
          signatureLength: mergedData.signature?.length || 0,
          fullData: mergedData
        });
        setFormData(mergedData);
      } catch (error: any) {
        console.error('❌ [NDIS Workforce Capability Page] Error loading data:', error);
        showToast({
          type: 'error',
          title: 'Error Loading Form',
          message: error.message || 'Failed to load form data',
          duration: 4000,
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) loadData();
  }, [token]);
  
  // Reload data when URL changes (e.g., when reload query param is added)
  useEffect(() => {
    const handleLocationChange = () => {
      if (token && !loading) {
        const loadData = async () => {
          try {
            // Always use signature link API (onboard flow removed)
            const apiEndpoint = `/api/staff/signature/${token}`;
            
            const res = await fetch(`${apiEndpoint}?t=${Date.now()}`, {
              cache: 'no-store',
              headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
              }
            });
            const data = await res.json();
            
            if (res.ok) {
              let ndisData: any = {};
              const ndisForm = data.signatureForms?.find(
                (f: any) => f.formSubmission?.form?.formKey === 'ndis_workforce_capability'
              );
              if (ndisForm) {
                ndisData = { ...(ndisForm.formSubmission?.data || {}) };
                if (ndisForm.formSubmission?.staffSignature) {
                  ndisData.signature = ndisForm.formSubmission.staffSignature;
                } else {
                  // Signature was cleared - explicitly remove all signature fields
                  delete ndisData.signature;
                  delete ndisData.staffSignature;
                  delete ndisData.orientationSignature;
                }
                if (ndisForm.formSubmission?.staffSignedAt) {
                  ndisData.date = new Date(ndisForm.formSubmission.staffSignedAt).toISOString().split('T')[0];
                } else {
                  // Date was cleared - remove date fields and set to today
                  delete ndisData.date;
                  delete ndisData.acknowledgedAt;
                  delete ndisData.staffSignedAt;
                  ndisData.date = new Date().toISOString().split('T')[0];
                }
              } else {
                ndisData = { ...(data.submissions['ndis_workforce_capability'] || {}) };
                // Ensure signature fields are properly cleared if they don't exist
                const hasSignature = ndisData.signature || ndisData.staffSignature;
                if (!hasSignature) {
                  delete ndisData.signature;
                  delete ndisData.staffSignature;
                  delete ndisData.orientationSignature;
                }
              }

              const defaultData = {
                fullName: `${data.staff?.firstName ?? ''} ${data.staff?.surname ?? ''}`.trim(),
                readAcknowledgement: false,
                signature: '',
                date: new Date().toISOString().split('T')[0],
              };
              
              const mergedData = {
                ...defaultData,
                ...ndisData,
              };
              
              // If signature was cleared, ensure it's empty string (not undefined)
              if (!mergedData.signature && !mergedData.staffSignature) {
                mergedData.signature = '';
              }
              
              setFormData(mergedData);
            }
          } catch (error) {
            console.error('Error reloading data:', error);
          }
        };
        loadData();
      }
    };

    // Listen for popstate (back/forward navigation) and focus events
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('focus', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('focus', handleLocationChange);
    };
  }, [token, loading]);

  const derivedAcknowledged = useMemo(() => formData?.readAcknowledgement || false, [formData]);
  const derivedSignature = useMemo(() => formData?.signature || '', [formData]);
  const derivedDate = useMemo(() => formData?.date || '', [formData]);
  const derivedStaffName = useMemo(() => formData?.fullName || '', [formData]);

  const handleAcknowledgementChange = (updates: Record<string, any>) => {
    console.log('🔵 [NDIS Workforce Capability Page] Acknowledgement changed:', updates);
    setFormData((prev: any) => {
      const updated = { ...prev, ...updates };
      console.log('🔵 [NDIS Workforce Capability Page] FormData updated:', {
        keys: Object.keys(updated),
        hasSignature: !!updated.signature,
        signatureLength: updated.signature?.length || 0,
        hasDate: !!updated.date,
        hasFullName: !!updated.fullName
      });
      return updated;
    });
  };

  const handleSave = async (isSubmit: boolean) => {
    console.log('🔵 [NDIS Workforce Capability Page] Saving form:', {
      isSubmit,
      formDataKeys: Object.keys(formData),
      hasSignature: !!formData.signature,
      signatureLength: formData.signature?.length || 0,
      hasDate: !!formData.date,
      hasFullName: !!formData.fullName,
      derivedSignature: derivedSignature,
      derivedDate: derivedDate,
      derivedStaffName: derivedStaffName
    });
    
    setSaving(true);
    try {
      if (isSubmit) {
        const nameFilled = !!derivedStaffName?.trim();
        const signatureFilled = !!derivedSignature;
        const dateFilled = !!derivedDate;

        // Build specific validation message for missing fields
        const missingFields: string[] = [];
        if (!nameFilled) missingFields.push('Name');
        if (!signatureFilled) missingFields.push('Signature');
        if (!dateFilled) missingFields.push('Date');

        if (missingFields.length > 0) {
          const fieldList = missingFields.length === 1 
            ? missingFields[0]
            : missingFields.length === 2
            ? `${missingFields[0]} and ${missingFields[1]}`
            : `${missingFields.slice(0, -1).join(', ')}, and ${missingFields[missingFields.length - 1]}`;
          
          showToast({
            type: 'warning',
            title: 'Incomplete Form',
            message: `Please complete the following required ${missingFields.length === 1 ? 'field' : 'fields'}: ${fieldList}.`,
            duration: 5000,
          });
          setSaving(false);
          return;
        }
      }

      // Always use signature link API (onboard flow removed)
      const apiEndpoint = `/api/staff/signature/${token}/forms/ndis_workforce_capability`;

      // Use derived values to ensure we're sending the latest signature
      const dataToSend = {
        ...formData,
        signature: derivedSignature || formData.signature || '',
        date: derivedDate || formData.date || '',
        fullName: derivedStaffName || formData.fullName || '',
      };
      
      console.log('🔵 [NDIS Workforce Capability Page] Sending data to API:', {
        keys: Object.keys(dataToSend),
        hasSignature: !!dataToSend.signature,
        signatureLength: dataToSend.signature?.length || 0,
        hasDate: !!dataToSend.date,
        hasFullName: !!dataToSend.fullName
      });

      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formKey: 'ndis_workforce_capability', data: dataToSend, submit: isSubmit }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Failed to save');

      if (isSubmit) {
        showToast({
          type: 'success',
          title: 'Form Submitted',
          message: 'Form submitted successfully!',
          duration: 3000,
        });
        router.push(`/staff/signature/${token}`);
      } else {
        showToast({
          type: 'success',
          title: 'Draft Saved',
          message: 'Draft saved successfully!',
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error('❌ [NDIS Workforce Capability Page] Error saving:', error);
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: error.message || 'Failed to save form',
        duration: 4000,
      });
    } finally {
      setSaving(false);
    }
  };

  const NdisWorkforceCapabilityView = getStaffFormComponent('ndis_workforce_capability', 'view');

  if (loading) {
    return <LoadingView title="Loading NDIS Workforce Capability Form" message="Please wait..." />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-4 md:py-8">
      <style jsx>{`
        .view-component-wrapper .text-gray-700 { color: #374151 !important; }
        .view-component-wrapper .text-gray-600 { color: #4b5563 !important; }
        .view-component-wrapper .text-gray-800 { color: #1f2937 !important; }
        .view-component-wrapper .text-xs { font-size: 0.875rem !important; }
        .view-component-wrapper { 
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
      <div className="w-full max-w-7xl mx-auto px-2 md:px-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-4 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">NDIS Workforce Capability Framework</h1>
              <p className="text-gray-600">{staff?.firstName} {staff?.surname}</p>
            </div>
            <button
              onClick={() => {
                router.push(`/staff/signature/${token}`);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 self-start sm:self-auto"
            >
              ← Back to Forms
            </button>
          </div>
        </div>

        {/* View Component */}
        <div className="bg-white rounded-lg shadow-lg p-2 md:p-6">
          <div className="view-component-wrapper w-full">
            <NdisWorkforceCapabilityView
              data={formData}
              acknowledgementMode="editable"
              onAcknowledgementChange={handleAcknowledgementChange}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-8 pt-4 md:pt-6 border-t">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 w-full sm:w-auto"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 w-full sm:w-auto"
            >
              {saving ? 'Submitting...' : 'Submit & Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

