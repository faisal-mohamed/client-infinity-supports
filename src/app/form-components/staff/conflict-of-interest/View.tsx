"use client";

import React, { useEffect, useState, useRef } from 'react';
import FormPage from '@/components/ui/FormPage';

interface ConflictOfInterestViewProps {
  excludeLastPage?: boolean;
  children?: React.ReactNode;
  data?: any;
  staffId?: number;
  showPDF?: boolean;
  hideHRSection?: boolean; // Hide HR section when viewing from admin
}

export default function ConflictOfInterestView({ 
  excludeLastPage = false, 
  children, 
  data = {},
  staffId,
  showPDF = false,
  hideHRSection = false
}: ConflictOfInterestViewProps) {
  const [showPDFView, setShowPDFView] = useState(showPDF);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasRenderedRef = useRef(false);
  // Extract form data - handle both direct data and nested data.data
  const formData = (data && data.data) ? data.data : data || {};

  // Helper functions
  const getValue = (key: string): string => {
    return formData[key] || '';
  };

  const getYesNo = (key: string): 'yes' | 'no' | '' => {
    const value = formData[key];
    if (value === 'yes' || value === true) return 'yes';
    if (value === 'no' || value === false) return 'no';
    return '';
  };

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-AU');
    } catch {
      return dateStr;
    }
  };

  const renderCheckbox = (checked: boolean) => {
    return (
      <div className={`w-4 h-4 border border-gray-400 mx-auto flex items-center justify-center ${checked ? 'bg-blue-600' : 'bg-white'}`}>
        {checked && <span className="text-white text-xs font-bold">✓</span>}
      </div>
    );
  };

  const renderSignature = (signature: string) => {
    if (!signature) {
      return <div className="w-full h-24 border border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400 text-sm">No signature</div>;
    }
    return (
      <div className="w-full border border-gray-300 bg-white p-2">
        <img src={signature} alt="Signature" className="max-h-24 w-auto" />
      </div>
    );
  };

  const injectScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    if (!showPDFView || !staffId || hasRenderedRef.current) return;

    const renderPdf = async () => {
      hasRenderedRef.current = true;
      setIsRendering(true);
      setError(null);
      try {
        await injectScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
        await injectScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js');
        
        const w: any = window as any;
        if (!w['pdfjsLib']) throw new Error('pdfjsLib not available');
        w['pdfjsLib'].GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const pdfUrl = `/api/staff/${staffId}/forms/conflict-of-interest/pdf`;
        const loadingTask = w['pdfjsLib'].getDocument(pdfUrl);
        const pdf = await loadingTask.promise;

        const container = pdfContainerRef.current;
        if (!container) return;
        container.innerHTML = '';

        const containerWidth = container.clientWidth || 794;
        const devicePixelRatioValue = Math.max(window.devicePixelRatio || 1, 1);
        
        let maxWidth: number;
        let qualityMultiplier: number;
        if (window.innerWidth < 480) {
          maxWidth = 350;
          qualityMultiplier = 2;
        } else if (window.innerWidth < 768) {
          maxWidth = 450;
          qualityMultiplier = 2.5;
        } else if (window.innerWidth < 1024) {
          maxWidth = 650;
          qualityMultiplier = 3;
        } else {
          maxWidth = 850;
          qualityMultiplier = 3.5;
        }

        const displayWidth = Math.min(containerWidth * 0.9, maxWidth);
        const fragment = document.createDocumentFragment();

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: qualityMultiplier });
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d', { 
            alpha: false,
            desynchronized: false,
            willReadFrequently: false
          });
          if (!context) continue;

          canvas.width = Math.floor(viewport.width * devicePixelRatioValue);
          canvas.height = Math.floor(viewport.height * devicePixelRatioValue);
          
          canvas.style.width = `${displayWidth}px`;
          canvas.style.height = 'auto';
          canvas.style.display = 'block';
          canvas.style.margin = '0 auto 20px';
          canvas.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          canvas.style.border = '1px solid #e5e7eb';
          canvas.style.borderRadius = '4px';
          canvas.style.maxWidth = '100%';

          const transform = devicePixelRatioValue !== 1
            ? [devicePixelRatioValue, 0, 0, devicePixelRatioValue, 0, 0]
            : null;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
            transform: transform,
          };

          await page.render(renderContext).promise;
          fragment.appendChild(canvas);
        }

        container.appendChild(fragment);
        setIsRendering(false);
      } catch (err: any) {
        console.error('Error rendering PDF:', err);
        setError(err.message || 'Failed to load PDF');
        setIsRendering(false);
      }
    };

    renderPdf();
  }, [showPDFView, staffId]);

  // If showing PDF, render PDF viewer
  if (showPDFView && staffId) {
    const pdfUrl = `/api/staff/${staffId}/forms/conflict-of-interest/pdf`;
    return (
      <div className="bg-slate-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Conflict of Interest Disclosure Form - PDF View</h2>
            <button
              onClick={() => setShowPDFView(false)}
              className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              View Form
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <iframe
              src={pdfUrl}
              className="w-full border border-gray-300 rounded"
              style={{ minHeight: '800px', height: '90vh' }}
              title="Conflict of Interest PDF"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Page 1 - Employee Information and Section 1 */}
        <FormPage 
          title="Conflict of Interest Disclosure Form"
          meta={{
            website: '',
            version: '',
            reviewDate: ''
          }}
        >
          {/* Employee Information Section */}
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-800 mb-2">Employee Information</h2>
            <div className="border border-gray-300">
              <div className="grid grid-cols-2">
                <div className="bg-gray-100 border-r border-gray-300 p-3 text-sm font-medium text-gray-800">Name</div>
                <div className="p-3">
                  <div className="w-full min-h-8 px-2 py-1 border border-gray-300 bg-white text-gray-900">
                    {getValue('name')}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 border-t border-gray-300">
                <div className="bg-gray-100 border-r border-gray-300 p-3 text-sm font-medium text-gray-800">Position</div>
                <div className="p-3">
                  <div className="w-full min-h-8 px-2 py-1 border border-gray-300 bg-white text-gray-900">
                    {getValue('position')}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 border-t border-gray-300">
                <div className="bg-gray-100 border-r border-gray-300 p-3 text-sm font-medium text-gray-800">Department</div>
                <div className="p-3">
                  <div className="w-full min-h-8 px-2 py-1 border border-gray-300 bg-white text-gray-900">
                    {getValue('department')}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 border-t border-gray-300">
                <div className="bg-gray-100 border-r border-gray-300 p-3 text-sm font-medium text-gray-800">Date</div>
                <div className="p-3">
                  <div className="w-full min-h-8 px-2 py-1 border border-gray-300 bg-white text-gray-900">
                    {formatDate(getValue('date'))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Disclosure of Potential Conflict of Interest */}
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-800 mb-2">Section 1: Disclosure of Potential Conflict of Interest</h2>
            <p className="text-sm text-gray-700 mb-3">
              Do you have any financial, personal, or professional interests that may conflict, or appear to conflict, with your duties at Infinity Supports WA Pty Ltd?
            </p>
            <div className="mb-3 flex gap-6">
              <div className="flex items-center gap-2">
                {renderCheckbox(getYesNo('hasConflict') === 'yes')}
                <span>Yes, I have a potential conflict to disclose. (Please provide details below.)</span>
              </div>
              <div className="flex items-center gap-2">
                {renderCheckbox(getYesNo('hasConflict') === 'no')}
                <span>No, I do not have any conflicts to disclose.</span>
              </div>
            </div>
            <div className="mb-3">
                <p className="text-sm font-medium text-gray-800 mb-2">Description of the potential conflict of interest:</p>
              <div className="w-full min-h-[3rem] px-2 py-1 border border-gray-300 bg-white text-gray-900">
                {getValue('conflictDescription')}
              </div>
            </div>
          </div>

          {/* Section 2: Relationships with Vendors, Clients, or Competitors */}
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-800 mb-2">Section 2: Relationships with Vendors, Clients, or Competitors</h2>
            <p className="text-sm text-gray-700 mb-3">
              Do you or any immediate family members have any financial interest, employment, or any other relationship with any vendors, clients, or competitors of Infinity Supports WA?
            </p>
            <div className="mb-3 flex gap-6">
              <div className="flex items-center gap-2">
                {renderCheckbox(getYesNo('hasVendorRelationship') === 'yes')}
                <span>Yes (If yes, please describe the relationship below.)</span>
              </div>
              <div className="flex items-center gap-2">
                {renderCheckbox(getYesNo('hasVendorRelationship') === 'no')}
                <span>No</span>
              </div>
            </div>
            <div className="mb-3">
              <div className="w-full min-h-[3rem] px-2 py-1 border border-gray-300 bg-white text-gray-900">
                {getValue('vendorDetails')}
              </div>
            </div>
          </div>

          {/* Section 3: Outside Employment or Business Activities */}
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-800 mb-2">Section 3: Outside Employment or Business Activities</h2>
            <p className="text-sm text-gray-700 mb-3">
              Are you engaged in any outside employment, consulting, or business activities that may impact your role at Infinity Supports WA?
            </p>
            <div className="mb-3 flex gap-6">
              <div className="flex items-center gap-2">
                {renderCheckbox(getYesNo('hasOutsideEmployment') === 'yes')}
                <span>Yes (If yes, please describe below.)</span>
              </div>
              <div className="flex items-center gap-2">
                {renderCheckbox(getYesNo('hasOutsideEmployment') === 'no')}
                <span>No</span>
              </div>
            </div>
            <div className="mb-3">
              <div className="w-full min-h-[3rem] px-2 py-1 border border-gray-300 bg-white text-gray-900">
                {getValue('employmentDetails')}
              </div>
            </div>
          </div>
        </FormPage>

        {/* Page 2 - Section 4: Acknowledgment and HR Review */}
        <FormPage 
          title="Conflict of Interest Disclosure Form"
          meta={{
            website: '',
            version: '',
            reviewDate: ''
          }}
        >
          {/* Section 4: Acknowledgment and Certification */}
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-800 mb-2">Section 4: Acknowledgment and Certification</h2>
            <p className="text-sm text-gray-700 mb-4">
              I certify that the information provided above is complete and accurate to the best of my knowledge. I understand that failure to disclose a potential conflict of interest may result in disciplinary action, up to and including termination of employment. If a potential conflict arises after signing this form, I will promptly notify Infinity Supports WA in writing.
            </p>
            <div className="border border-gray-300 p-3 mb-4">
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-800 mb-2">Employee Signature:</p>
                {renderSignature(getValue('employeeSignature'))}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 mb-2">Date:</p>
                <div className="w-full min-h-8 px-2 py-1 border border-gray-300 bg-white text-gray-900">
                  {formatDate(getValue('employeeDate'))}
                </div>
              </div>
            </div>
          </div>

          {/* For HR/Management Use Only - Hide if viewing from admin */}
          {!hideHRSection && (
            <div className="mb-4">
              <h2 className="text-base font-semibold text-gray-800 mb-3">For HR/Management Use Only</h2>
              <div className="border border-gray-300 p-3 mb-4">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800 mb-2">Reviewed by:</p>
                    <div className="w-full min-h-8 px-2 py-1 border border-gray-300 bg-white text-gray-900">
                      {getValue('reviewedBy')}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 mb-2">Title:</p>
                    <div className="w-full min-h-8 px-2 py-1 border border-gray-300 bg-white text-gray-900">
                      {getValue('reviewerTitle')}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-800 mb-2">Date:</p>
                  <div className="w-full min-h-8 px-2 py-1 border border-gray-300 bg-white text-gray-900">
                    {formatDate(getValue('reviewDate'))}
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-800 mb-2">Action Taken (if applicable):</p>
                  <div className="w-full min-h-[2.5rem] px-2 py-1 border border-gray-300 bg-white text-gray-900">
                    {getValue('actionTaken')}
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-800 mb-2">HR Decision:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {renderCheckbox(getValue('hrDecision') === 'noConflict')}
                      <span>No conflict found</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderCheckbox(getValue('hrDecision') === 'mitigation')}
                      <span>Conflict identified and mitigation plan implemented</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderCheckbox(getValue('hrDecision') === 'furtherReview')}
                      <span>Further review required</span>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-800 mb-2">Signature of Reviewer:</p>
                  {renderSignature(getValue('reviewerSignature'))}
                </div>
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-800 mb-2">Date:</p>
                  <div className="w-full min-h-8 px-2 py-1 border border-gray-300 bg-white text-gray-900">
                    {formatDate(getValue('reviewerDate'))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </FormPage>
        {staffId && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowPDFView(true)}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
            >
              View PDF
            </button>
            <a
              href={`/api/staff/${staffId}/forms/conflict-of-interest/pdf`}
              download
              className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 inline-block"
            >
              Download PDF
            </a>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

