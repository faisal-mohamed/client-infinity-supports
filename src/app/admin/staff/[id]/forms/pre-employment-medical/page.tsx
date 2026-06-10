"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminPDFCanvasViewer from '@/app/admin/components/AdminPDFCanvasViewer';
import StaffFormHeader from '@/app/admin/components/StaffFormHeader';
import { useToast } from '@/components/ui/Toast';
import LoadingView from '@/components/ui/LoadingView';

export default function AdminPreEmploymentMedicalViewPage() {
  const params = useParams();
  const router = useRouter();
  const staffId = params.id as string;
  
  const [staff, setStaff] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔵 [Admin View] Loading Pre-Employment Medical data for staff:', staffId);
        
        // Fetch form data - this is only for checking if signature exists (for download button)
        // The PDF viewer will always show the generated PDF regardless of data
        const formRes = await fetch(`/api/staff/${staffId}/forms/pre-employment-medical`);
        
        if (formRes.ok) {
          const formSubmission = await formRes.json();
          console.log('✅ [Admin View] Form submission:', formSubmission);
          
          // Extract staff and form data (for header and download button logic)
          setStaff(formSubmission.staff || {});
          setFormData(formSubmission || {});
        } else {
          // If form doesn't exist, just load staff info for header
          const staffRes = await fetch(`/api/admin/staff/${staffId}`);
          if (staffRes.ok) {
            const staffData = await staffRes.json();
            setStaff(staffData);
            setFormData({});
          }
        }
        
      } catch (error: any) {
        console.error('❌ [Admin View] Error loading data:', error);
        // Don't block PDF view on error - PDF will still generate with empty data
        setFormData({});
      } finally {
        setLoading(false);
      }
    };

    if (staffId) loadData();
  }, [staffId]);

  const { showToast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    let url: string | null = null;
    let link: HTMLAnchorElement | null = null;
    
    try {
      // Add download=true parameter to trigger download
      const pdfUrl = `/api/staff/${staffId}/forms/pre-employment-medical/pdf?download=true`;
      
      // Fetch the PDF
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error('Failed to generate PDF');
      
      const blob = await response.blob();
      
      // Create a download link
      url = window.URL.createObjectURL(blob);
      link = document.createElement('a');
      link.href = url;
      link.download = `Pre_Employment_Medical_${staff?.firstName}_${staff?.surname}.pdf`;
      link.style.position = 'fixed';
      link.style.left = '-9999px';
      link.style.top = '-9999px';
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup with requestAnimationFrame to ensure click completes
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (link && link.parentNode === document.body) {
            try {
              document.body.removeChild(link);
            } catch (e) {
              console.error('Error removing link:', e);
            }
          }
          
          setTimeout(() => {
            if (url) {
              window.URL.revokeObjectURL(url);
            }
          }, 1000);
        });
      });
      
      showToast({
        type: 'success',
        title: 'PDF Downloaded',
        message: 'PDF has been downloaded successfully.',
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Error downloading PDF:', error);
      
      // Cleanup on error
      if (link && link.parentNode === document.body) {
        try {
          document.body.removeChild(link);
        } catch (e) {
          console.error('Error removing link:', e);
        }
      }
      
      if (url) {
        window.URL.revokeObjectURL(url);
      }
      
      showToast({
        type: 'error',
        title: 'Download Failed',
        message: 'Failed to download PDF. Please try again.',
        duration: 5000,
      });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <LoadingView title="Loading Pre-Employment Medical Form" message="Please wait..." />;
  }

  const staffName = staff ? `${staff.firstName || ''} ${staff.surname || ''}`.trim() : '';
  const staffEmail = staff?.email || '';
  const hasSignature = formData?.signature || formData?.staffSignature || formData?.declarationSignature;

  return (
    <div className="">
      {/* Universal Header */}
      <StaffFormHeader
        staffId={staffId.toString()}
        formTitle="Pre-Employment Medical"
        staffName={staffName}
        staffEmail={staffEmail}
        onDownload={handleDownloadPDF}
        downloading={downloading}
        showDownload={!!hasSignature}
      />

      {/* Always show generated PDF - PDF route generates PDF even with empty data */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <AdminPDFCanvasViewer 
          pdfUrl={`/api/staff/${staffId}/forms/pre-employment-medical/pdf`} 
        />
      </div>
    </div>
  );
}
