"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminPDFCanvasViewer from '@/app/admin/components/AdminPDFCanvasViewer';
import StaffFormHeader from '@/app/admin/components/StaffFormHeader';
import { useToast } from '@/components/ui/Toast';
import LoadingView from '@/components/ui/LoadingView';

export default function AdminVehicleSafetyInspectionViewPage() {
  const params = useParams();
  const router = useRouter();
  const staffId = params.id as string;
  
  const [staff, setStaff] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔵 [Admin View] Loading Vehicle Safety Inspection data for staff:', staffId);
        
        // Fetch form data
        const formRes = await fetch(`/api/staff/${staffId}/forms/vehicle-safety-inspection`);
        
        if (!formRes.ok) {
          const errorData = await formRes.json();
          throw new Error(errorData.error || 'Failed to load form');
        }
        
        const formSubmission = await formRes.json();
        console.log('✅ [Admin View] Form submission:', formSubmission);
        
        // Extract staff and form data
        setStaff(formSubmission.staff || {});
        setFormData(formSubmission || {});
        
      } catch (error: any) {
        console.error('❌ [Admin View] Error loading data:', error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (staffId) loadData();
  }, [staffId]);

  const { showToast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    console.log('🔵 [Admin Download] Starting PDF download...');
    setDownloading(true);
    let url: string | null = null;
    let link: HTMLAnchorElement | null = null;
    
    try {
      // Download only the acknowledgment form PDF (not the full checklist)
      const pdfUrl = `/api/staff/${staffId}/forms/vehicle-safety-inspection/pdf?acknowledgmentOnly=true&download=true`;
      console.log('🔵 [Admin Download] PDF URL:', pdfUrl);
      
      // Use window.open or createObjectURL with direct download
      // This avoids DOM manipulation issues
      const response = await fetch(pdfUrl);
      console.log('🔵 [Admin Download] Response status:', response.status, response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [Admin Download] Response error:', errorText);
        throw new Error('Failed to generate PDF');
      }
      
      const blob = await response.blob();
      console.log('🔵 [Admin Download] Blob received, size:', blob.size, 'bytes');
      
      url = window.URL.createObjectURL(blob);
      console.log('🔵 [Admin Download] Object URL created:', url.substring(0, 50) + '...');
      
      // Create a temporary link element
      link = document.createElement('a');
      link.href = url;
      link.download = `Vehicle_Safety_Inspection_Acknowledgment_${staff?.firstName}_${staff?.surname}.pdf`;
      link.style.position = 'fixed';
      link.style.left = '-9999px';
      link.style.top = '-9999px';
      
      console.log('🔵 [Admin Download] Link element created, appending to body...');
      console.log('🔵 [Admin Download] document.body exists:', !!document.body);
      console.log('🔵 [Admin Download] document.body children count before:', document.body.children.length);
      
      // Append to body
      document.body.appendChild(link);
      console.log('🔵 [Admin Download] Link appended, document.body children count after:', document.body.children.length);
      console.log('🔵 [Admin Download] Link parentNode:', link.parentNode === document.body ? 'document.body' : 'other');
      
      // Trigger download
      console.log('🔵 [Admin Download] Triggering click...');
      link.click();
      console.log('🔵 [Admin Download] Click triggered');
      
      // Use requestAnimationFrame to ensure click completes before cleanup
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          console.log('🔵 [Admin Download] Cleanup frame 1 - checking link state...');
          console.log('🔵 [Admin Download] Link exists:', !!link);
          console.log('🔵 [Admin Download] Link parentNode:', link?.parentNode);
          console.log('🔵 [Admin Download] Link parentNode === document.body:', link?.parentNode === document.body);
          
          // Check if element still exists and has parent before removing
          if (link && link.parentNode === document.body) {
            try {
              console.log('🔵 [Admin Download] Attempting to remove link from body...');
              document.body.removeChild(link);
              console.log('✅ [Admin Download] Link removed successfully');
            } catch (e: any) {
              console.error('❌ [Admin Download] Error removing link:', e);
              console.error('❌ [Admin Download] Error details:', {
                message: e.message,
                name: e.name,
                linkExists: !!link,
                linkParent: link?.parentNode,
                bodyChildren: document.body.children.length
              });
            }
          } else {
            console.warn('⚠️ [Admin Download] Link not removed - parentNode check failed:', {
              linkExists: !!link,
              hasParent: !!link?.parentNode,
              isBodyChild: link?.parentNode === document.body
            });
          }
          
          // Revoke URL after a delay to ensure download completes
          setTimeout(() => {
            if (url) {
              console.log('🔵 [Admin Download] Revoking object URL...');
              window.URL.revokeObjectURL(url);
              console.log('✅ [Admin Download] Object URL revoked');
            }
          }, 1000);
        });
      });
      
      showToast({
        type: 'success',
        title: 'PDF Downloaded',
        message: 'Acknowledgment form PDF has been downloaded successfully.',
        duration: 3000,
      });
    } catch (error: any) {
      console.error('❌ [Admin Download] Error downloading PDF:', error);
      console.error('❌ [Admin Download] Error stack:', error.stack);
      
      // Cleanup on error
      if (link && link.parentNode === document.body) {
        try {
          console.log('🔵 [Admin Download] Error cleanup - removing link...');
          document.body.removeChild(link);
          console.log('✅ [Admin Download] Link removed in error handler');
        } catch (e: any) {
          console.error('❌ [Admin Download] Error removing link in error handler:', e);
        }
      }
      
      if (url) {
        console.log('🔵 [Admin Download] Error cleanup - revoking URL...');
        window.URL.revokeObjectURL(url);
      }
      
      showToast({
        type: 'error',
        title: 'Download Failed',
        message: 'Failed to download PDF. Please try again.',
        duration: 5000,
      });
    } finally {
      console.log('🔵 [Admin Download] Setting downloading to false');
      setDownloading(false);
    }
  };

  if (loading) {
    return <LoadingView title="Loading Vehicle Safety Inspection Form" message="Please wait..." />;
  }

  const staffName = staff ? `${staff.firstName || ''} ${staff.surname || ''}`.trim() : '';
  const staffEmail = staff?.email || '';
  const acknowledgmentData = formData?.acknowledgmentData || {};
  const hasAcknowledgment = acknowledgmentData.acknowledged || acknowledgmentData.signature;

  if (!hasAcknowledgment) {
    return (
      <div className="">
        <StaffFormHeader
          staffId={staffId.toString()}
          formTitle="Vehicle Safety Inspection Checklist - Acknowledgment"
          staffName={staffName}
          staffEmail={staffEmail}
          onDownload={handleDownloadPDF}
          downloading={downloading}
          showDownload={false}
        />
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-soft border border-azure-200 p-6 md:p-8 text-center">
            <p className="text-azure-400 text-lg">Acknowledgment form has not been completed yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Universal Header */}
      <StaffFormHeader
        staffId={staffId.toString()}
        formTitle="Vehicle Safety Inspection Checklist - Acknowledgment"
        staffName={staffName}
        staffEmail={staffEmail}
        onDownload={handleDownloadPDF}
        downloading={downloading}
        showDownload={true}
      />

      {/* Acknowledgment Form PDF Viewer - Only shows acknowledgment form */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <AdminPDFCanvasViewer pdfUrl={`/api/staff/${staffId}/forms/vehicle-safety-inspection/pdf?acknowledgmentOnly=true`} />
      </div>
    </div>
  );
}

