"use client";

import React, { useEffect, useRef, useState } from 'react';
import SignatureCanvas, { SignatureCanvasRef } from '@/components/ui/SignatureCanvas';
import LoadingView from '@/components/ui/LoadingView';

interface OverlayTextInputProps {
  top: number;
  left: number;
  width: number;
  height?: number;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

function OverlayTextInput({
  top,
  left,
  width,
  height = 35,
  value,
  onChange,
  placeholder,
  readOnly = false,
}: OverlayTextInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      disabled={readOnly}
      maxLength={35}
      className={`absolute border-none border-b-2 border-gray-900 bg-transparent px-1 py-0 focus:outline-none focus:border-blue-500 ${
        readOnly ? 'cursor-not-allowed opacity-70' : ''
      }`}
      style={{ 
        top, 
        left, 
        width, 
        height,
        maxWidth: `${width}px`,
        fontSize: '18px',
        lineHeight: '1.4',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontWeight: '400',
        letterSpacing: '0.2px',
        borderBottomWidth: '1.5px',
        borderBottomColor: '#111827',
        textDecoration: 'underline',
        textUnderlineOffset: '2px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
      }}
    />
  );
}

interface OverlayDateInputProps {
  top: number;
  left: number;
  width: number;
  height?: number;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

function OverlayDateInput({
  top,
  left,
  width,
  height = 35,
  value,
  onChange,
  readOnly = false,
}: OverlayDateInputProps) {
  // Convert date to DD-MM-YYYY format for display if needed
  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <input
      type="date"
      value={formatDateForInput(value)}
      onChange={(e) => onChange(e.target.value)}
      readOnly={readOnly}
      disabled={readOnly}
      className={`absolute border-b-2 border-gray-800 bg-transparent px-1 text-base focus:outline-none focus:border-blue-500 ${
        readOnly ? 'cursor-not-allowed opacity-70' : ''
      }`}
      style={{ 
        top, 
        left, 
        width, 
        height,
        fontSize: '14px',
        lineHeight: '1.5',
        fontFamily: 'inherit',
      }}
    />
  );
}

interface OverlaySignatureBoxProps {
  top: number;
  left: number;
  width: number;
  height: number;
  value: string | null;
  onChange: (value: string | null) => void;
  readOnly?: boolean;
}

function OverlaySignatureBox({
  top,
  left,
  width,
  height,
  value,
  onChange,
  readOnly = false,
}: OverlaySignatureBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const sigRef = useRef<SignatureCanvasRef | null>(null);

  const handleSave = () => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      const dataUrl = sigRef.current.toDataURL();
      console.log('🔵 [OverlaySignatureBox] Saving signature:', {
        hasDataUrl: !!dataUrl,
        dataUrlLength: dataUrl?.length || 0,
        dataUrlPreview: dataUrl?.substring(0, 50) || 'N/A'
      });
      onChange(dataUrl);
      setIsOpen(false);
    } else {
      console.warn('⚠️ [OverlaySignatureBox] Cannot save: signature is empty or ref is null');
    }
  };

  return (
    <>
      {/* Signature preview box */}
      <div
        className={`absolute border-2 border-gray-800 bg-white flex items-center justify-center ${
          readOnly ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:border-blue-500'
        }`}
        style={{ 
          top, 
          left, 
          width, 
          height,
          borderWidth: '1px',
          minHeight: height,
          padding: '4px',
          boxSizing: 'border-box',
        }}
        onClick={() => {
          if (!readOnly) setIsOpen(true);
        }}
      >
        {value ? (
          <img
            src={value}
            alt="Signature"
            className="object-contain"
            style={{ 
              width: '100%', 
              height: '100%', 
              maxWidth: '100%', 
              maxHeight: '100%',
              objectFit: 'contain',
              padding: '3px',
            }}
          />
        ) : (
          <span className="text-xs text-gray-400 text-center px-2" style={{ fontSize: '12px' }}>
            {readOnly ? 'No signature' : 'Click to sign'}
          </span>
        )}
      </div>

      {/* Modal for drawing signature */}
      {isOpen && !readOnly && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[600px] max-w-[90vw]">
            <h2 className="text-xl font-bold mb-4">Draw Your Signature</h2>
            <SignatureCanvas
              ref={sigRef}
              existingSignature={value || undefined}
              width={550}
              height={200}
              showClearButton={true}
              clearButtonText="Clear"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Signature
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface NdisWorkforceCapabilityAcknowledgementOverlayProps {
  data: {
    fullName?: string;
    signature?: string;
    date?: string;
  };
  onDataChange: (updates: Record<string, any>) => void;
  readOnly?: boolean;
}

export default function NdisWorkforceCapabilityAcknowledgementOverlay({
  data = {},
  onDataChange,
  readOnly = false,
}: NdisWorkforceCapabilityAcknowledgementOverlayProps) {
  const [fullName, setFullName] = useState(data.fullName || '');
  const [signature, setSignature] = useState<string | null>(data.signature || null);
  const [date, setDate] = useState(data.date || '');
  
  // Track if user has set a signature (to prevent overwriting)
  const userSetSignatureRef = useRef<string | null>(null);
  
  // REMOVED: Duplicate sync effect - the one below handles all prop syncing
  // This was causing the signature to be overwritten
  const [coverPageImage, setCoverPageImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load cover page as image
  useEffect(() => {
    const loadCoverPage = async () => {
      try {
        // Load PDF.js via CDN if not already loaded
        const injectScript = (src: string): Promise<void> =>
          new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
              resolve();
              return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.head.appendChild(script);
          });

        await injectScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
        await injectScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js');

        // Wait a bit for the library to be fully available
        const w: any = window as any;
        let retries = 0;
        while (!w.pdfjsLib && retries < 10) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          retries++;
        }

        const pdfjs = w.pdfjsLib;
        if (!pdfjs) {
          throw new Error('PDF.js library not available after loading');
        }
        if (pdfjs.GlobalWorkerOptions) {
          pdfjs.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }

        const url = '/stafForms/NDIS WORKFORCE CAPABILITY FRAMEWORK.pdf';
        const loadingTask = pdfjs.getDocument(url);
        const pdf = await loadingTask.promise;

        // Render only the first page (cover page)
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        setCoverPageImage(canvas.toDataURL('image/png'));
      } catch (error) {
        console.error('Error loading cover page:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCoverPage();
  }, []);

  // Store the callback in a ref to avoid recreating it
  const onDataChangeRef = useRef(onDataChange);
  useEffect(() => {
    onDataChangeRef.current = onDataChange;
  }, [onDataChange]);

  // Track if we're internally updating to avoid loops
  const isInternalUpdateRef = useRef(false);

  // Sync props to state - CRITICAL: Don't overwrite user-set signature
  useEffect(() => {
    console.log('🔵 [AcknowledgementOverlay] Sync props to state:', {
      dataFullName: data.fullName,
      dataSignature: data.signature ? `EXISTS (${data.signature.length} chars)` : 'NULL/EMPTY',
      dataDate: data.date,
      currentSignature: signature ? `EXISTS (${signature.length} chars)` : 'NULL/EMPTY',
      userSetSignature: userSetSignatureRef.current ? `EXISTS` : 'NULL'
    });
    
    // Update fullName if changed
    if (data.fullName !== undefined && data.fullName !== fullName) {
      setFullName(data.fullName || '');
    }
    
    // CRITICAL: Only update signature from props if:
    // 1. User hasn't set a signature yet AND props want to clear it, OR
    // 2. Props have a signature (not null/empty) - this is a real update from parent
    // Don't overwrite user-set signature with null/empty from props
    if (data.signature === '' || data.signature === null || data.signature === undefined) {
      // Props want to clear signature - only do this if user hasn't set one
      if (!userSetSignatureRef.current && signature) {
        console.log('🔵 [AcknowledgementOverlay] Clearing signature from props (user has not set one)');
        isInternalUpdateRef.current = true;
        setSignature(null);
        setTimeout(() => { isInternalUpdateRef.current = false; }, 0);
      } else if (userSetSignatureRef.current) {
        console.log('🔵 [AcknowledgementOverlay] Ignoring signature clear from props (user has set signature)');
      }
    } else if (data.signature && data.signature !== signature) {
      // Props have a signature - update it (this is a real update from parent)
      console.log('🔵 [AcknowledgementOverlay] Setting signature from props');
      isInternalUpdateRef.current = true;
      setSignature(data.signature);
      userSetSignatureRef.current = data.signature; // Mark as set
      setTimeout(() => { isInternalUpdateRef.current = false; }, 0);
    }
    
    // Update date if changed
    if (data.date !== undefined && data.date !== date) {
      isInternalUpdateRef.current = true;
      setDate(data.date || '');
      setTimeout(() => { isInternalUpdateRef.current = false; }, 0);
    }
  }, [data.fullName, data.signature, data.date]); // Only depend on props, not local state

  // Track previous values
  const prevValuesRef = useRef({ fullName, signature, date });

  // Only call onDataChange when user changes values (not from prop updates)
  useEffect(() => {
    // Skip if this is an internal update from props
    if (isInternalUpdateRef.current) {
      prevValuesRef.current = { fullName, signature, date };
      return;
    }

    const changed =
      fullName !== prevValuesRef.current.fullName ||
      signature !== prevValuesRef.current.signature ||
      date !== prevValuesRef.current.date;

    if (changed) {
      console.log('🔵 [AcknowledgementOverlay] Calling onDataChange with:', {
        fullName,
        signature: signature ? `EXISTS (${signature.length} chars)` : 'NULL/EMPTY',
        date,
        signatureType: typeof signature,
        signatureIsNull: signature === null,
        signatureIsEmpty: signature === '',
        changedFrom: {
          fullName: prevValuesRef.current.fullName,
          signature: prevValuesRef.current.signature ? `EXISTS` : 'NULL/EMPTY',
          date: prevValuesRef.current.date
        }
      });
      
      // CRITICAL: Pass the actual signature value, not empty string if it exists
      const signatureToSend = signature || '';
      
      onDataChangeRef.current({
        fullName,
        signature: signatureToSend,
        date,
      });
      prevValuesRef.current = { fullName, signature, date };
    }
  }, [fullName, signature, date]);

  if (loading) {
    return (
      <LoadingView 
        title="Loading NDIS Workforce Capability Framework" 
        message="Preparing the acknowledgement form..." 
      />
    );
  }

  if (!coverPageImage) {
    return (
      <div className="flex items-center justify-center w-full h-[1123px] bg-gray-100">
        <p className="text-red-600">Failed to load cover page</p>
      </div>
    );
  }

  // Position calculations based on A4 size (794x1123 at 72dpi, scaled to 2x = 1588x2246)
  // These are approximate positions - you may need to adjust based on actual PDF layout
  const pageWidth = 794; // A4 width in pixels at 72dpi
  const pageHeight = 1123; // A4 height in pixels at 72dpi

  return (
    <div className="relative w-full flex justify-center" style={{ minHeight: pageHeight }}>
      <div className="relative" style={{ width: pageWidth, height: pageHeight }}>
        {/* Background: Cover page image */}
        <img
          src={coverPageImage}
          alt="NDIS Workforce Capability Framework Cover"
          className="absolute inset-0 w-full h-full object-contain"
        />

        {/* Overlay inputs positioned over the PDF fields */}
        {/* Name field - positioned before "here with agree" - Read-only from DB */}
        <OverlayTextInput
          top={890}
          left={80}
          width={315}
          value={fullName}
          onChange={setFullName}
          placeholder=""
          readOnly={true}
        />

        {/* Signature field - positioned at "Signature :" label */}
        <OverlaySignatureBox
          top={965}
          left={160}
          width={310}
          height={60}
          value={signature}
          onChange={(newSignature) => {
            console.log('🔵 [AcknowledgementOverlay] Signature onChange called:', {
              hasSignature: !!newSignature,
              signatureLength: newSignature?.length || 0,
              currentSignature: signature ? `EXISTS` : 'NULL/EMPTY',
              newSignaturePreview: newSignature?.substring(0, 50) || 'N/A'
            });
            
            // Mark that user has set a signature
            if (newSignature) {
              userSetSignatureRef.current = newSignature;
            }
            
            setSignature(newSignature);
            
            // CRITICAL: Immediately notify parent of signature change
            // Don't wait for useEffect - call onDataChange directly
            console.log('🔵 [AcknowledgementOverlay] Immediately calling onDataChange with signature');
            onDataChangeRef.current({
              fullName,
              signature: newSignature || '', // Convert null to empty string
              date,
            });
            // Update prevValues to prevent duplicate calls
            prevValuesRef.current = { fullName, signature: newSignature, date };
          }}
          readOnly={readOnly}
        />

        {/* Date field - positioned at "Date :" label */}
        <OverlayDateInput
          top={1020}
          left={130}
          width={280}
          value={date}
          onChange={setDate}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
}

