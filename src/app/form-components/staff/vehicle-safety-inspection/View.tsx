"use client";

import React, { useEffect, useState, useRef } from 'react';
import FormPage from '@/components/ui/FormPage';

interface VehicleSafetyInspectionViewProps {
  excludeLastPage?: boolean;
  children?: React.ReactNode;
  data?: any;
  staffId?: number;
  showPDF?: boolean;
}

export default function VehicleSafetyInspectionView({ 
  excludeLastPage = false, 
  children, 
  data = {},
  staffId,
  showPDF = false
}: VehicleSafetyInspectionViewProps) {
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
      <div className={`w-4 h-4 border border-azure-200 mx-auto ${checked ? 'bg-black' : 'bg-white'}`}>
        {checked && <span className="text-white text-xs">✓</span>}
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

        const pdfUrl = `/api/staff/${staffId}/forms/vehicle-safety-inspection/pdf`;
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
          // Use qualityMultiplier for high-resolution rendering
          const viewport = page.getViewport({ scale: qualityMultiplier });
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d', { 
            alpha: false,
            desynchronized: false,
            willReadFrequently: false
          });
          if (!context) continue;

          // Set canvas size accounting for device pixel ratio for ultra-crisp rendering
          canvas.width = Math.floor(viewport.width * devicePixelRatioValue);
          canvas.height = Math.floor(viewport.height * devicePixelRatioValue);
          
          // Set display size (CSS pixels) - this ensures crisp rendering
          canvas.style.width = `${displayWidth}px`;
          canvas.style.height = 'auto';
          canvas.style.display = 'block';
          canvas.style.margin = '0 auto 20px';
          canvas.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          canvas.style.border = '1px solid #e5e7eb';
          canvas.style.borderRadius = '4px';
          canvas.style.maxWidth = '100%';

          // Use transform array for better quality (like orientation view)
          const transform = devicePixelRatioValue !== 1
            ? [devicePixelRatioValue, 0, 0, devicePixelRatioValue, 0, 0]
            : null;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
            transform: transform,
          };

          await page.render(renderContext).promise;

          // Use canvas directly for maximum quality
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
    return (
      <div className="bg-slate-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Vehicle Safety Inspection Checklist - PDF View</h2>
            <button
              onClick={() => setShowPDFView(false)}
              className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              View Form
            </button>
          </div>
          <div ref={pdfContainerRef} className="bg-white rounded-lg shadow-lg p-4">
            {isRendering && (
              <div className="text-center py-8 text-gray-500">Loading PDF...</div>
            )}
            {error && (
              <div className="text-center py-8 text-red-600">Error: {error}</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Page 1 - Driver Information and Initial Inspection */}
        <FormPage 
          title="Vehicle Safety Inspection Checklist"
          meta={{
            website: '',
            version: '',
            reviewDate: ''
          }}
        >

          {/* Driver Information Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Driver Information</h2>
            <div className="border border-azure-100">
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {/* Left Column - Labels */}
                <div className="bg-gray-100 border-r border-azure-100">
                  <div className="p-3 border-b border-azure-100 font-semibold text-gray-800">Driver</div>
                  <div className="p-3 border-b border-azure-100 font-semibold text-gray-800">Licence number</div>
                  <div className="p-3 border-b border-azure-100 font-semibold text-gray-800">Plant ID No</div>
                  <div className="p-3 border-b border-azure-100 font-semibold text-gray-800">Vehicle registration</div>
                  <div className="p-3 border-b border-azure-100 font-semibold text-gray-800">Insurance policy</div>
                  <div className="p-3 font-semibold text-gray-800">Date of inspection</div>
                </div>
                {/* Right Column - Input Fields */}
                <div>
                  <div className="p-3 border-b border-azure-100">
                    <div className="w-full min-h-8 px-2 py-1 border border-azure-100 bg-white text-gray-900">
                      {getValue('driver')}
                    </div>
                  </div>
                  <div className="p-3 border-b border-azure-100">
                    <div className="w-full min-h-8 px-2 py-1 border border-azure-100 bg-white text-gray-900">
                      {getValue('licenceNumber')}
                    </div>
                  </div>
                  <div className="p-3 border-b border-azure-100">
                    <div className="w-full min-h-8 px-2 py-1 border border-azure-100 bg-white text-gray-900">
                      {getValue('plantIdNo')}
                    </div>
                  </div>
                  <div className="p-3 border-b border-azure-100">
                    <div className="w-full min-h-8 px-2 py-1 border border-azure-100 bg-white text-gray-900">
                      {getValue('vehicleRegistration')}
                    </div>
                  </div>
                  <div className="p-3 border-b border-azure-100">
                    <div className="w-full min-h-8 px-2 py-1 border border-azure-100 bg-white text-gray-900">
                      {getValue('insurancePolicy')}
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="w-full min-h-8 px-2 py-1 border border-azure-100 bg-white text-gray-900">
                      {formatDate(getValue('dateOfInspection'))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inspection Checklist Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Vehicle Safety Inspection Checklist</h2>
            <div className="border border-azure-100">
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                <div className="p-3 bg-gray-100 border-r border-azure-100 font-semibold text-gray-800">Item</div>
                <div className="p-3 bg-gray-100 border-r border-azure-100 font-semibold text-gray-800 text-center">Yes</div>
                <div className="p-3 bg-gray-100 border-r border-azure-100 font-semibold text-gray-800 text-center">No</div>
                <div className="p-3 bg-gray-100 font-semibold text-gray-800">Action To Be Taken</div>
              </div>

              {/* Lights Section */}
              <div className="border-b border-azure-100">
                <div className="bg-gray-100 p-3 border-b border-azure-100">
                  <h4 className="font-semibold text-gray-800">Lights</h4>
                  <p className="text-sm text-gray-600 mt-1">Check operation and visibility of:</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                  <div className="p-3 border-r border-azure-100">Headlights</div>
                  <div className="p-3 border-r border-azure-100 text-center">
                    {renderCheckbox(getYesNo('headlights') === 'yes')}
                  </div>
                  <div className="p-3 border-r border-azure-100 text-center">
                    {renderCheckbox(getYesNo('headlights') === 'no')}
                  </div>
                  <div className="p-3">
                    <div className="w-full min-h-8 px-2 py-1 border border-azure-100 bg-white text-gray-900 text-sm">
                      {getValue('headlightsAction')}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4">
                  <div className="p-3 border-r border-azure-100">Parking lights</div>
                  <div className="p-3 border-r border-azure-100 text-center">
                    {renderCheckbox(getYesNo('parkingLights') === 'yes')}
                  </div>
                  <div className="p-3 border-r border-azure-100 text-center">
                    {renderCheckbox(getYesNo('parkingLights') === 'no')}
                  </div>
                  <div className="p-3">
                    <div className="w-full min-h-8 px-2 py-1 border border-azure-100 bg-white text-gray-900 text-sm">
                      {getValue('parkingLightsAction')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Indicators/Blinker Section */}
              <div className="border-b border-azure-100">
                <div className="bg-gray-100 p-3 border-b border-azure-100">
                  <h4 className="font-semibold text-gray-800">Indicators/blinker</h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                  <div className="p-3 border-r border-azure-100">Hazard lights</div>
                  <div className="p-3 border-r border-azure-100 text-center">
                    <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                  </div>
                  <div className="p-3 border-r border-azure-100 text-center">
                    <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                  </div>
                  <div className="p-3">
                    <div className="w-full h-8 border border-azure-100 bg-white"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                  <div className="p-3 border-r border-azure-100">Brake lights</div>
                  <div className="p-3 border-r border-azure-100 text-center">
                    <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                  </div>
                  <div className="p-3 border-r border-azure-100 text-center">
                    <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                  </div>
                  <div className="p-3">
                    <div className="w-full h-8 border border-azure-100 bg-white"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                  <div className="p-3 border-r border-azure-100">Reverse lights</div>
                  <div className="p-3 border-r border-azure-100 text-center">
                    <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                  </div>
                  <div className="p-3 border-r border-azure-100 text-center">
                    <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                  </div>
                  <div className="p-3">
                    <div className="w-full h-8 border border-azure-100 bg-white"></div>
                  </div>
                </div>
                <div className="bg-gray-50 p-2 border-b border-azure-100">
                  <p className="text-sm font-medium text-gray-700">If trailer attached:</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4">
                  <div className="p-3 border-r border-azure-100 pl-6">Parking lights</div>
                  <div className="p-3 border-r border-azure-100 text-center">
                    <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                  </div>
                  <div className="p-3 border-r border-azure-100 text-center">
                    <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                  </div>
                  <div className="p-3">
                    <div className="w-full h-8 border border-azure-100 bg-white"></div>
                  </div>
                </div>
              </div>

              {/* Brakes and Warnings Section */}
              <div className="border-b border-azure-100">
                <div className="bg-gray-100 p-3 border-b border-azure-100">
                  <h4 className="font-semibold text-gray-800">Brakes and Warnings</h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                  <div className="p-3 border-r border-azure-100">Check operation of handbrake</div>
                  <div className="p-3 border-r border-azure-100 text-center">
                    <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                  </div>
                  <div className="p-3 border-r border-azure-100 text-center">
                    <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                  </div>
                  <div className="p-3">
                    <div className="w-full h-8 border border-azure-100 bg-white"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                  <div className="p-3 border-r border-azure-100">Check for firm brake pedal</div>
                  <div className="p-3 border-r border-azure-100 text-center">
                    <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                  </div>
                  <div className="p-3 border-r border-azure-100 text-center">
                    <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                  </div>
                  <div className="p-3">
                    <div className="w-full h-8 border border-azure-100 bg-white"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4">
                  <div className="p-3 border-r border-azure-100">Check operation of horn</div>
                  <div className="p-3 border-r border-azure-100 text-center">
                    <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                  </div>
                  <div className="p-3 border-r border-azure-100 text-center">
                    <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                  </div>
                  <div className="p-3">
                    <div className="w-full h-8 border border-azure-100 bg-white"></div>
                  </div>
                </div>
              </div>

              {/* Interior Section */}
              <div>
                <div className="bg-gray-100 p-3 border-b border-azure-100">
                  <h4 className="font-semibold text-gray-800">Interior</h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4">
                  <div className="p-3 border-r border-azure-100">'No Smoking' signs displayed prominently</div>
                  <div className="p-3 border-r border-azure-100 text-center">
                    <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                  </div>
                  <div className="p-3 border-r border-azure-100 text-center">
                    <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                  </div>
                  <div className="p-3">
                    <div className="w-full h-8 border border-azure-100 bg-white"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FormPage>

        {/* Page 2 - Additional Inspection Items */}
        <FormPage 
          title="Vehicle Safety Inspection Checklist"
          meta={{
            website: '',
            version: '',
            reviewDate: ''
          }}
        >
          {/* Additional Inspection Checklist Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Vehicle Safety Inspection Checklist (Continued)</h2>
            <div className="border border-azure-100">
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                <div className="p-3 bg-gray-100 border-r border-azure-100 font-semibold text-gray-800">Item</div>
                <div className="p-3 bg-gray-100 border-r border-azure-100 font-semibold text-gray-800 text-center">Yes</div>
                <div className="p-3 bg-gray-100 border-r border-azure-100 font-semibold text-gray-800 text-center">No</div>
                <div className="p-3 bg-gray-100 font-semibold text-gray-800">Action To Be Taken</div>
              </div>

              {/* General Vehicle Interior/Safety Section */}
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                <div className="p-3 border-r border-azure-100">Internal cleanliness maintained, including upholstery</div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                <div className="p-3 border-r border-azure-100">Cargo barrier in place, where appropriate</div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                <div className="p-3 border-r border-azure-100">Safety belts in good order</div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>

              {/* Exterior Section */}
              <div className="bg-gray-100 p-3 border-b border-azure-100">
                <h4 className="font-semibold text-gray-800">Exterior</h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                <div className="p-3 border-r border-azure-100">Any damage to body work noted</div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                <div className="p-3 border-r border-azure-100">Windscreen in good order and clean</div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                <div className="p-3 border-r border-azure-100">Windscreen wipers and washers operating</div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                <div className="p-3 border-r border-azure-100">Water in windscreen washer reservoir</div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                <div className="p-3 border-r border-azure-100">Tyre tread checked for wear</div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                <div className="p-3 border-r border-azure-100">Treads matching for front and rear tyres</div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                <div className="p-3 border-r border-azure-100">Tyre pressure checked</div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>

              {/* General Safety Section */}
              <div className="bg-gray-100 p-3 border-b border-azure-100">
                <h4 className="font-semibold text-gray-800">General Safety</h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                <div className="p-3 border-r border-azure-100">System in place for reporting problems</div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                <div className="p-3 border-r border-azure-100">Servicing as required</div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>

              {/* First Aid Kit, Sunscreen, Insect Repellent Section */}
              <div className="bg-gray-100 p-3 border-b border-azure-100">
                <h4 className="font-semibold text-gray-800">First Aid Kit, Sunscreen, Insect Repellent</h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                <div className="p-3 border-r border-azure-100">Contents assessed in compliance with first aid requirements</div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                <div className="p-3 border-r border-azure-100">Container and contents clean and orderly</div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                <div className="p-3 border-r border-azure-100">System in place to replenish kit items</div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                <div className="p-3 border-r border-azure-100">Expiry dates checked</div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                <div className="p-3 border-r border-azure-100">Out of date items disposed of</div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>

              {/* Transportation of Clients Section */}
              <div className="bg-gray-100 p-3 border-b border-azure-100">
                <h4 className="font-semibold text-gray-800">Transportation of Clients</h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                <div className="p-3 border-r border-azure-100">Wheelchair hoist fitted, if required</div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                <div className="p-3 border-r border-azure-100">Appropriate for the transport of clients</div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4">
                <div className="p-3 border-r border-azure-100">Facility to secure clients appropriately</div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>
            </div>
          </div>
        </FormPage>

        {/* Page 3 - Client Behavior Assessment and Review */}
        <FormPage 
          title="Vehicle Safety Inspection Checklist"
          meta={{
            website: '',
            version: '',
            reviewDate: ''
          }}
        >
          {/* Client Behavior Assessment Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Client Behavior Assessment</h2>
            <div className="border border-azure-100">
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                <div className="p-3 bg-gray-100 border-r border-azure-100 font-semibold text-gray-800">Item</div>
                <div className="p-3 bg-gray-100 border-r border-azure-100 font-semibold text-gray-800 text-center">Yes</div>
                <div className="p-3 bg-gray-100 border-r border-azure-100 font-semibold text-gray-800 text-center">No</div>
                <div className="p-3 bg-gray-100 font-semibold text-gray-800">Action To Be Taken</div>
              </div>

              {/* Client Behavior Item */}
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                <div className="p-3 border-r border-azure-100">Client behaviour while travelling in a vehicle is known</div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>

              {/* Other Issues Section */}
              <div className="bg-gray-100 p-3 border-b border-azure-100">
                <h4 className="font-semibold text-gray-800">Other Issues</h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                <div className="p-3 border-r border-azure-100">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                <div className="p-3 border-r border-azure-100">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                <div className="p-3 border-r border-azure-100">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-azure-100">
                <div className="p-3 border-r border-azure-100">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4">
                <div className="p-3 border-r border-azure-100">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-azure-100 text-center">
                  <div className="w-4 h-4 border border-azure-200 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Submission and Review Section */}
          <div className="space-y-6">
            {/* Return Form Section */}
            <div>
              <p className="text-gray-800 mb-2">Return completed form to:</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 border-b border-azure-200 border-dotted h-6"></div>
                <span className="text-gray-800">Position</span>
              </div>
            </div>

            {/* Review Section */}
            <div className="border border-azure-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-azure-100">
                <div className="p-3 bg-gray-100 border-r border-azure-100 font-semibold text-gray-800">Reviewed by [name]:</div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-azure-100">
                <div className="p-3 bg-gray-100 border-r border-azure-100 font-semibold text-gray-800">Position:</div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="p-3 bg-gray-100 border-r border-azure-100 font-semibold text-gray-800">Date:</div>
                <div className="p-3">
                  <div className="w-full h-8 border border-azure-100 bg-white"></div>
                </div>
              </div>
            </div>

            {/* Next Inspection Date */}
            <div className="flex items-center gap-2">
              <span className="text-gray-800">Date for next inspection:</span>
              <div className="flex-1 border-b border-azure-200 border-dotted h-6"></div>
            </div>
          </div>
        </FormPage>

        {children}
      </div>
      {staffId && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowPDFView(true)}
            className="px-4 py-2 text-sm bg-azure-700 text-white rounded hover:bg-azure-800"
          >
            View PDF
          </button>
        </div>
      )}
    </div>
  );
}
