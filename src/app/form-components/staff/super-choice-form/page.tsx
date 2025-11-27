"use client";

import React, { useState, useEffect, useRef } from "react";
import SignatureCanvas, { SignatureCanvasRef } from "@/components/ui/SignatureCanvas";

// Overlay Components - Updated to match Tax form approach for better alignment
const CharacterInput = ({ 
  value, 
  onChange, 
  length, 
  top, 
  left, 
  gap = 2, 
  boxWidth, 
  boxHeight = 25,
  totalWidth, // Auto-fit width for all boxes combined (like Tax form)
  readOnly = false,
  numbersOnly = false, // New: restrict to numbers only
  onUpArrow,
  onDownArrow,
  inputRefs
}: {
  value: string;
  onChange: (value: string) => void;
  length: number;
  top: number;
  left: number;
  gap?: number;
  boxWidth?: number;
  boxHeight?: number;
  totalWidth?: number; // New: auto-fit option
  readOnly?: boolean;
  numbersOnly?: boolean; // New: numbers only option
  onUpArrow?: () => void;
  onDownArrow?: () => void;
  inputRefs?: React.MutableRefObject<(HTMLInputElement | null)[]>;
}) => {
  const localRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const refs = inputRefs || localRefs;

  // Calculate effective box width (use totalWidth if provided, otherwise use boxWidth)
  const effectiveBoxWidth = totalWidth
    ? Math.floor(totalWidth / length)
    : boxWidth || 20;

  const handleChange = (index: number, char: string) => {
    if (readOnly) return;
    
    // Filter to numbers only if numbersOnly is true
    if (numbersOnly && char && !/^\d$/.test(char)) {
      return; // Ignore non-numeric input
    }
    
    const newValue = value.padEnd(length, ' ').split('');
    newValue[index] = char;
    onChange(newValue.join('').trimEnd());
    
    // Auto-focus next input if character is entered
    if (char && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (readOnly) return;
    
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // If current box is empty, move to previous box
        refs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      refs.current[index + 1]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      onUpArrow?.();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      onDownArrow?.();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (readOnly) return;
    e.preventDefault();
    let pastedText = e.clipboardData.getData('text').slice(0, length);
    
    // Filter to numbers only if numbersOnly is true
    if (numbersOnly) {
      pastedText = pastedText.replace(/\D/g, '').slice(0, length);
    }
    
    const newValue = pastedText.padEnd(length, ' ').split('');
    onChange(newValue.join('').trimEnd());
    
    // Focus the next empty box or the last box
    const nextEmptyIndex = Math.min(pastedText.length, length - 1);
    refs.current[nextEmptyIndex]?.focus();
  };

  // Special handling for TFN (9 digits with 3-3-3 grouping) and ABN (11 digits with 2-3-3-3 grouping)
  const getMarginRight = (i: number) => {
    if (i >= length - 1) return 0;
    if (length === 9) {
      // TFN: 3-3-3 grouping with larger gaps
      if (i === 2 || i === 5) return 20;
      return gap;
    }
    if (length === 11) {
      // ABN: 2-3-3-3 grouping with larger gaps after positions 1, 4, and 7
      if (i === 1 || i === 4 || i === 7) return 18; // Larger gap for clear visual separation (2-3-3-3 pattern)
      return gap;
    }
    return gap;
  };

  // Check if we need custom spacing (for TFN or ABN grouping)
  const needsCustomSpacing = (length === 9 || length === 11) && !totalWidth;
  
  return (
    <div 
      className="absolute flex" 
      style={{ 
        top, 
        left, 
        gap: (totalWidth || needsCustomSpacing) ? 0 : gap, // Don't use flex gap if we need custom spacing
        pointerEvents: readOnly ? 'none' : 'auto' // Allow clicks to pass through when readOnly
      }}
    >
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type={numbersOnly ? "tel" : "text"}
          inputMode={numbersOnly ? "numeric" : "text"}
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={`border border-gray-400 text-center text-sm text-black ${
            readOnly ? 'bg-white cursor-pointer' : 'bg-white'
          }`}
          style={{
            width: effectiveBoxWidth,
            height: boxHeight,
            marginRight: (totalWidth || !needsCustomSpacing) ? 0 : getMarginRight(i), // Use margin for custom spacing
            fontSize: '12px',
            padding: 0,
            color: 'black',
            pointerEvents: readOnly ? 'none' : 'auto' // Block pointer events when readOnly
          }}
          readOnly={readOnly}
          disabled={readOnly}
        />
      ))}
    </div>
  );
};


const TextInput = ({ 
  value, 
  onChange, 
  top, 
  left, 
  width, 
  height = 25,
  readOnly = false,
  onUpArrow,
  onDownArrow
}: {
  value: string;
  onChange: (value: string) => void;
  top: number;
  left: number;
  width: number;
  height?: number;
  readOnly?: boolean;
  onUpArrow?: () => void;
  onDownArrow?: () => void;
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (readOnly) return;
    
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      onUpArrow?.();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      onDownArrow?.();
    }
  };

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      className={`absolute border border-black px-1 text-black ${
        readOnly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
      }`}
      style={{ 
        top, 
        left, 
        width, 
        height, 
        fontSize: '15px',
        color: 'black'
      }}
      readOnly={readOnly}
      disabled={readOnly}
    />
  );
};

const Checkbox = ({ 
  checked, 
  onChange, 
  top, 
  left, 
  width = 15, 
  height = 15,
  readOnly = false 
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  top: number;
  left: number;
  width?: number;
  height?: number;
  readOnly?: boolean;
}) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={(e) => onChange(e.target.checked)}
    className="absolute"
    style={{ 
      top, 
      left, 
      width, 
      height,
      cursor: readOnly ? 'not-allowed' : 'pointer',
      opacity: readOnly ? 0.5 : 1
    }}
    readOnly={readOnly}
    disabled={readOnly}
  />
);


const SignaturePad = ({ 
  value, 
  onChange, 
  top, 
  left, 
  width, 
  height,
  readOnly = false 
}: {
  value: string;
  onChange: (value: string) => void;
  top: number;
  left: number;
  width: number;
  height: number;
  readOnly?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const sigRef = useRef<SignatureCanvasRef | null>(null);

  // Initialize hasSignature when modal opens
  useEffect(() => {
    if (isOpen) {
      // If there's an existing signature, mark as having signature
      if (value) {
        setHasSignature(true);
      } else {
        setHasSignature(false);
      }
    }
  }, [isOpen, value]);

  const handleSave = () => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      const dataUrl = sigRef.current.toDataURL();
      onChange(dataUrl);
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleClear = () => {
    if (sigRef.current) {
      sigRef.current.clear();
      setHasSignature(false);
    }
  };

  const handleSignatureEnd = () => {
    if (sigRef.current) {
      setHasSignature(!sigRef.current.isEmpty());
    }
  };

  return (
    <>
      {/* Signature preview box */}
      <div
        className={`absolute border border-gray-400 bg-white flex flex-col items-center justify-center ${readOnly ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
        style={{ top, left, width, height }}
        onClick={() => {
          if (!readOnly) setIsOpen(true);
        }}
      >
        {value ? (
          <img
            src={value}
            alt="Signature"
            className="object-contain w-full h-full"
          />
        ) : (
          <span className="text-xs text-gray-400">Click to sign</span>
        )}
      </div>

      {/* Modal for drawing signature */}
      {isOpen && !readOnly && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-4 rounded shadow-lg w-[500px]">
            <h2 className="text-lg font-bold mb-2">Draw Your Signature</h2>

            <SignatureCanvas 
              ref={sigRef} 
              width={450} 
              height={180}
              existingSignature={value || undefined}
              onSignatureEnd={handleSignatureEnd}
            />

            <div className="flex justify-between items-center mt-3">
              <button
                onClick={handleClear}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Clear
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!hasSignature && (!value || value === '')}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const DateInput = ({ 
  value, 
  onChange, 
  top, 
  left, 
  readOnly = false,
  required = false
}: {
  value: { day: string; month: string; year: string };
  onChange: (value: { day: string; month: string; year: string }) => void;
  top: number;
  left: number;
  readOnly?: boolean;
  required?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Convert DD/MM/YYYY to YYYY-MM-DD for date input
  const formatDateForInput = (day: string, month: string, year: string): string => {
    if (!day || !month || !year || day.length !== 2 || month.length !== 2 || year.length !== 4) {
      return '';
    }
    const d = day.padStart(2, '0');
    const m = month.padStart(2, '0');
    const y = year;
    return `${y}-${m}-${d}`;
  };

  // Convert YYYY-MM-DD to DD/MM/YYYY
  const formatDateFromInput = (dateStr: string): { day: string; month: string; year: string } => {
    if (!dateStr) return { day: '', month: '', year: '' };
    const [y, m, d] = dateStr.split('-');
    return {
      day: d || '',
      month: m || '',
      year: y || ''
    };
  };

  // Initialize selectedDate when modal opens
  useEffect(() => {
    if (isOpen) {
      const dateStr = formatDateForInput(value.day, value.month, value.year);
      setSelectedDate(dateStr);
    }
  }, [isOpen, value]);

  const handleSave = () => {
    if (selectedDate) {
      const formatted = formatDateFromInput(selectedDate);
      // Ensure proper formatting with leading zeros
      onChange({
        day: formatted.day.padStart(2, '0'),
        month: formatted.month.padStart(2, '0'),
        year: formatted.year
      });
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  // Calculate positions for each part
  const dayLeft = 0;
  const slash1Left = 50; // After 2 boxes (2 * 22px + gap)
  const monthLeft = 60; // After slash
  const slash2Left = 110; // After month boxes
  const yearLeft = 120; // After second slash
  
  // Calculate total width of the entire date field (Day + slash + Month + slash + Year)
  const totalDateWidth = yearLeft + (22 * 4) + 2; // Year position + 4 boxes + gap
  const totalDateHeight = 22; // Height of date boxes

  // Format display value
  const displayValue = value.day && value.month && value.year 
    ? `${value.day.padStart(2, '0')}/${value.month.padStart(2, '0')}/${value.year}`
    : '';

  return (
    <>
      {/* Date boxes - clickable to open date picker - Single container covering entire date area */}
      <div 
        className="absolute"
        style={{ top, left }}
        onClick={() => {
          if (!readOnly) setIsOpen(true);
        }}
      >
        {/* Single clickable overlay covering ENTIRE date field (Day + Month + Year) */}
        <div 
          className={`absolute ${readOnly ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-blue-50 hover:bg-opacity-30'}`}
          style={{ 
            zIndex: 100,
            top: -5,
            left: -5,
            width: totalDateWidth + 10,
            height: totalDateHeight + 10,
            borderRadius: '4px',
            transition: 'background-color 0.2s',
            pointerEvents: readOnly ? 'none' : 'auto'
          }}
        />
        
        {/* Day - 2 boxes - pointer-events-none so clicks pass through */}
        <div style={{ pointerEvents: 'none', position: 'relative', zIndex: 1 }}>
          <CharacterInput
            value={value.day}
            onChange={() => {}}
            length={2}
            top={0}
            left={dayLeft}
            boxWidth={22}
            boxHeight={22}
            gap={2}
            readOnly={true}
          />
        </div>
        {/* First slash separator */}
        <span className="absolute top-1 pointer-events-none" style={{ left: slash1Left, fontSize: '14px', fontWeight: 'bold', zIndex: 2 }}>/</span>
        {/* Month - 2 boxes - pointer-events-none so clicks pass through */}
        <div style={{ pointerEvents: 'none', position: 'relative', zIndex: 1 }}>
          <CharacterInput
            value={value.month}
            onChange={() => {}}
            length={2}
            top={0}
            left={monthLeft}
            boxWidth={22}
            boxHeight={22}
            gap={2}
            readOnly={true}
          />
        </div>
        {/* Second slash separator */}
        <span className="absolute top-1 pointer-events-none" style={{ left: slash2Left, fontSize: '14px', fontWeight: 'bold', zIndex: 2 }}>/</span>
        {/* Year - 4 boxes - pointer-events-none so clicks pass through */}
        <div style={{ pointerEvents: 'none', position: 'relative', zIndex: 1 }}>
          <CharacterInput
            value={value.year}
            onChange={() => {}}
            length={4}
            top={0}
            left={yearLeft}
            boxWidth={22}
            boxHeight={22}
            gap={2}
            readOnly={true}
          />
        </div>
        {/* Required indicator border - only show red border, not red dot */}
        {required && (!value.day || !value.month || !value.year) && (
          <div className="absolute border-2 border-red-500 rounded pointer-events-none" style={{ zIndex: 50, top: -2, left: -2, width: totalDateWidth + 4, height: totalDateHeight + 4 }} />
        )}
      </div>

      {/* Modal for date picker */}
      {isOpen && !readOnly && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-4 rounded shadow-lg w-[400px]">
            <h2 className="text-lg font-bold mb-4">Select Date</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date (DD/MM/YYYY) {required && <span className="text-red-500">*</span>}
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!selectedDate}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface SuperChoiceFormProps {
  initialData?: any;
  onDataChange?: (data: any) => void;
  readOnly?: boolean;
  showButtons?: boolean;
}

export default function SuperChoiceForm({
  initialData = {},
  onDataChange,
  readOnly = false,
  showButtons = true
}: SuperChoiceFormProps = {}) {
  console.log('📝 [Super Choice Form] Component rendered with initialData:', {
    hasInitialData: !!initialData,
    initialDataKeys: Object.keys(initialData || {}),
    initialDataSample: initialData ? {
      fullName: initialData.fullName,
      tfn: initialData.tfn,
      employeeNumber: initialData.employeeNumber,
      fundChoice: initialData.fundChoice,
      superFundName: initialData.superFundName,
      hasSectionBSignature: !!initialData.sectionBSignature,
      sectionBSignatureType: typeof initialData.sectionBSignature,
      sectionBSignatureLength: initialData.sectionBSignature ? String(initialData.sectionBSignature).length : 0,
      sectionBSignaturePreview: initialData.sectionBSignature ? String(initialData.sectionBSignature).substring(0, 50) + '...' : null,
      sectionBDate: initialData.sectionBDate,
      hasSectionCSignature: !!initialData.sectionCSignature,
      hasSectionDSignature: !!initialData.sectionDSignature,
    } : null,
    readOnly,
    showButtons,
  });
  
  // Refs for all form fields to enable up/down navigation
  const fullNameRef = React.useRef<HTMLInputElement>(null);
  const employeeNumberRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const tfnRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  
  // Page 1 - Section A: Your details
  const [fullName, setFullName] = useState(initialData.fullName || "");
  const [employeeNumber, setEmployeeNumber] = useState(initialData.employeeNumber || "");
  const [tfn, setTfn] = useState(initialData.tfn || "");
  
  // Fund choice selection
  const [fundChoice, setFundChoice] = useState(initialData.fundChoice || "");
  
  // Page 2 - Section B: My existing super fund
  const [superFundName, setSuperFundName] = useState(initialData.superFundName || "");
  const [superFundABN, setSuperFundABN] = useState(initialData.superFundABN || "");
  const [superFundUSI, setSuperFundUSI] = useState(initialData.superFundUSI || "");
  const [memberAccountNumber, setMemberAccountNumber] = useState(initialData.memberAccountNumber || "");
  const [accountName, setAccountName] = useState(initialData.accountName || "");
  const [hasComplianceLetter, setHasComplianceLetter] = useState(initialData.hasComplianceLetter || false);
  const [sectionBSignature, setSectionBSignature] = useState(initialData.sectionBSignature || "");
  const [sectionBDate, setSectionBDate] = useState(initialData.sectionBDate || { day: "", month: "", year: "" });
  
  // Log signature state after initialization
  useEffect(() => {
    console.log('📝 [Super Choice Form] Signature state initialized:', {
      hasSectionBSignature: !!sectionBSignature,
      sectionBSignatureType: typeof sectionBSignature,
      sectionBSignatureLength: sectionBSignature ? String(sectionBSignature).length : 0,
      sectionBSignaturePreview: sectionBSignature ? String(sectionBSignature).substring(0, 50) + '...' : null,
      sectionBDate,
    });
  }, []); // Only run once on mount
  
  // Page 3 - Section C: My employer's default super fund
  const [businessName, setBusinessName] = useState(initialData.businessName || "");
  const [businessABN, setBusinessABN] = useState(initialData.businessABN || "");
  const [defaultSuperFundName, setDefaultSuperFundName] = useState(initialData.defaultSuperFundName || "");
  const [defaultSuperFundABN, setDefaultSuperFundABN] = useState(initialData.defaultSuperFundABN || "");
  const [defaultSuperFundUSI, setDefaultSuperFundUSI] = useState(initialData.defaultSuperFundUSI || "");
  const [chooseDefaultFund, setChooseDefaultFund] = useState(initialData.chooseDefaultFund || false);
  const [sectionCSignature, setSectionCSignature] = useState(initialData.sectionCSignature || "");
  const [sectionCDate, setSectionCDate] = useState(initialData.sectionCDate || { day: "", month: "", year: "" });
  
  // Page 4 - Section D: My private self-managed super fund (SMSF)
  const [smsfName, setSmsfName] = useState(initialData.smsfName || "");
  const [smsfABN, setSmsfABN] = useState(initialData.smsfABN || "");
  const [smsfESA, setSmsfESA] = useState(initialData.smsfESA || "");
  const [smsfAccountName, setSmsfAccountName] = useState(initialData.smsfAccountName || "");
  const [bankAccountName, setBankAccountName] = useState(initialData.bankAccountName || "");
  const [bsbCode, setBsbCode] = useState(initialData.bsbCode || "");
  const [accountNumber, setAccountNumber] = useState(initialData.accountNumber || "");
  const [hasSMSFEvidence, setHasSMSFEvidence] = useState(initialData.hasSMSFEvidence || false);
  const [sectionDSignature, setSectionDSignature] = useState(initialData.sectionDSignature || "");
  const [sectionDDate, setSectionDDate] = useState(initialData.sectionDDate || { day: "", month: "", year: "" });

  // Remove page navigation - we'll show all pages in a scrollable view

  const getFormData = () => ({
    fullName,
    employeeNumber,
    tfn,
    fundChoice,
    superFundName,
    superFundABN,
    superFundUSI,
    memberAccountNumber,
    accountName,
    hasComplianceLetter,
    sectionBSignature,
    sectionBDate,
    businessName,
    businessABN,
    defaultSuperFundName,
    defaultSuperFundABN,
    defaultSuperFundUSI,
    chooseDefaultFund,
    sectionCSignature,
    sectionCDate,
    smsfName,
    smsfABN,
    smsfESA,
    smsfAccountName,
    bankAccountName,
    bsbCode,
    accountNumber,
    hasSMSFEvidence,
    sectionDSignature,
    sectionDDate
  });

  useEffect(() => {
    if (onDataChange) {
      onDataChange(getFormData());
    }
  }, [
    fullName, employeeNumber, tfn, fundChoice,
    superFundName, superFundABN, superFundUSI, memberAccountNumber, accountName, hasComplianceLetter, sectionBSignature, sectionBDate,
    businessName, businessABN, defaultSuperFundName, defaultSuperFundABN, defaultSuperFundUSI, chooseDefaultFund, sectionCSignature, sectionCDate,
    smsfName, smsfABN, smsfESA, smsfAccountName, bankAccountName, bsbCode, accountNumber, hasSMSFEvidence, sectionDSignature, sectionDDate
  ]);

  const renderPage1 = () => (
    <div className="relative w-[800px] h-[1000px] mx-auto border shadow">
      <img 
        src="/stafForms/super choice form-page1.jpg" 
        className="absolute inset-0 w-full h-full" 
        alt="Superannuation Standard Choice Form - Page 1"
      />
      
      {/* Section A: Your details */}
      <TextInput
        value={fullName}
        onChange={setFullName}
        top={470}
        left={400}
        width={398}
        readOnly={readOnly}
        onDownArrow={() => employeeNumberRefs.current[0]?.focus()}
      />
      
      <CharacterInput
        value={employeeNumber}
        onChange={setEmployeeNumber}
        length={16}
        top={514}
        left={410}
        readOnly={readOnly}
        onUpArrow={() => fullNameRef.current?.focus()}
        onDownArrow={() => tfnRefs.current[0]?.focus()}
        inputRefs={employeeNumberRefs}
      />
      
      {/* Tax File Number (TFN) - 9 boxes with 3-3-3 grouping */}
      <CharacterInput
        value={tfn}
        onChange={setTfn}
        length={9}
        top={560}
        left={410}
        gap={0}
        boxWidth={20}
        readOnly={readOnly}
        onUpArrow={() => employeeNumberRefs.current[0]?.focus()}
        inputRefs={tfnRefs}
      />
      
      {/* Fund choice selection - checkboxes positioned directly */}
      {/* Only Section B (existing super fund) is enabled - others are frozen */}
      <Checkbox
        checked={fundChoice === "existing"}
        onChange={(checked) => setFundChoice(checked ? "existing" : "")}
        top={704}
        left={422}
        width={20}
        height={20}
        readOnly={readOnly}
      />
      <Checkbox
        checked={fundChoice === "default"}
        onChange={(checked) => setFundChoice(checked ? "default" : "")}
        top={790}
        left={422}
        width={20}
        height={20}
        readOnly={true}
      />
      <Checkbox
        checked={fundChoice === "smsf"}
        onChange={(checked) => setFundChoice(checked ? "smsf" : "")}
        top={875}
        left={422}
        width={20}
        height={20}
        readOnly={true}
      />
    </div>
  );

  const renderPage2 = () => (
    <div className="relative w-[800px] h-[1000px] mx-auto border shadow">
      <img 
        src="/stafForms/super choice form-page2.jpg" 
        className="absolute inset-0 w-full h-full" 
        alt="Superannuation Standard Choice Form - Page 2"
      />
      
      {/* Section B: My existing super fund */}
      {/* Super fund name - text input field */}
      <TextInput
        value={superFundName}
        onChange={setSuperFundName}
        top={195}
        left={30}
        width={730}
        readOnly={readOnly}
      />
      
      {/* Super fund ABN - 11 character boxes with 2-3-3-3 grouping (numbers only) */}
      <CharacterInput
        value={superFundABN}
        onChange={setSuperFundABN}
        length={11}
        top={242}
        left={38}
        boxWidth={19}
        boxHeight={21}
        gap={0}
        numbersOnly={true}
        readOnly={readOnly}
      />
      
      {/* USI - 11 character boxes */}
      <CharacterInput
        value={superFundUSI}
        onChange={setSuperFundUSI}
        length={11}
        top={287}
        left={30}
        totalWidth={330}
        boxHeight={21}
        readOnly={readOnly}
      />
      
      {/* Member account number - 16 character boxes */}
      <CharacterInput
        value={memberAccountNumber}
        onChange={setMemberAccountNumber}
        length={16}
        top={372}
        left={30}
        totalWidth={480}
        boxHeight={22}
        readOnly={readOnly}
      />
      
      {/* Account name - text input field */}
      <TextInput
        value={accountName}
        onChange={setAccountName}
        top={455}
        left={30}
        width={730}
        readOnly={readOnly}
      />
      
      {/* Compliance letter checkbox */}
      <Checkbox
        checked={hasComplianceLetter}
        onChange={setHasComplianceLetter}
        top={608}
        left={35}
        width={20}
        height={20}
        readOnly={readOnly}
      />
      
      {/* Signature pad in declaration section */}
      <SignaturePad
        value={sectionBSignature}
        onChange={setSectionBSignature}
        top={718}
        left={30}
        width={490}
        height={60}
        readOnly={readOnly}
      />
      
      {/* Date input in declaration section */}
      <DateInput
        value={sectionBDate}
        onChange={setSectionBDate}
        top={760}
        left={565}
        readOnly={readOnly}
        required={true}
      />
    </div>
  );

  const renderPage3 = () => (
    <div className="relative w-[800px] h-[1000px] mx-auto border shadow">
      <img 
        src="/stafForms/super choice form-page3.jpg" 
        className="absolute inset-0 w-full h-full" 
        alt="Superannuation Standard Choice Form - Page 3"
      />
      
      {/* Section C: My employer's default super fund - Layout commented out, showing image only */}
      {/* 
      <TextInput
        value={businessName}
        onChange={setBusinessName}
        top={250}
        left={300}
        width={400}
        readOnly={readOnly}
      />
      
      <CharacterInput
        value={businessABN}
        onChange={setBusinessABN}
        length={11}
        top={300}
        left={300}
        readOnly={readOnly}
      />
      
      <TextInput
        value={defaultSuperFundName}
        onChange={setDefaultSuperFundName}
        top={350}
        left={300}
        width={400}
        readOnly={readOnly}
      />
      
      <CharacterInput
        value={defaultSuperFundABN}
        onChange={setDefaultSuperFundABN}
        length={11}
        top={400}
        left={300}
        readOnly={readOnly}
      />
      
      <CharacterInput
        value={defaultSuperFundUSI}
        onChange={setDefaultSuperFundUSI}
        length={11}
        top={450}
        left={300}
        readOnly={readOnly}
      />
      
      <Checkbox
        checked={chooseDefaultFund}
        onChange={setChooseDefaultFund}
        top={550}
        left={50}
        readOnly={readOnly}
      />
      
      <SignaturePad
        value={sectionCSignature}
        onChange={setSectionCSignature}
        top={650}
        left={300}
        width={300}
        height={80}
        readOnly={readOnly}
      />
      
      <DateInput
        value={sectionCDate}
        onChange={setSectionCDate}
        top={750}
        left={300}
        readOnly={readOnly}
        required={true}
      />
      */}
    </div>
  );

  const renderPage4 = () => (
    <div className="relative w-[800px] h-[1000px] mx-auto border shadow">
      <img 
        src="/stafForms/super choice form-page4.jpg" 
        className="absolute inset-0 w-full h-full" 
        alt="Superannuation Standard Choice Form - Page 4"
      />
      
      {/* Section D: My private self-managed super fund (SMSF) - Layout commented out, showing image only */}
      {/* 
      <TextInput
        value={smsfName}
        onChange={setSmsfName}
        top={250}
        left={300}
        width={400}
        readOnly={readOnly}
      />
      
      <CharacterInput
        value={smsfABN}
        onChange={setSmsfABN}
        length={11}
        top={300}
        left={300}
        readOnly={readOnly}
      />
      
      <TextInput
        value={smsfESA}
        onChange={setSmsfESA}
        top={350}
        left={300}
        width={400}
        readOnly={readOnly}
      />
      
      <TextInput
        value={smsfAccountName}
        onChange={setSmsfAccountName}
        top={400}
        left={300}
        width={400}
        readOnly={readOnly}
      />
      
      <TextInput
        value={bankAccountName}
        onChange={setBankAccountName}
        top={500}
        left={300}
        width={400}
        readOnly={readOnly}
      />
      
      <CharacterInput
        value={bsbCode}
        onChange={setBsbCode}
        length={6}
        top={550}
        left={300}
        readOnly={readOnly}
      />
      
      <CharacterInput
        value={accountNumber}
        onChange={setAccountNumber}
        length={9}
        top={600}
        left={300}
        readOnly={readOnly}
      />
      
      <Checkbox
        checked={hasSMSFEvidence}
        onChange={setHasSMSFEvidence}
        top={700}
        left={50}
        readOnly={readOnly}
      />
      
      <SignaturePad
        value={sectionDSignature}
        onChange={setSectionDSignature}
        top={800}
        left={300}
        width={300}
        height={80}
        readOnly={readOnly}
      />
      
      <DateInput
        value={sectionDDate}
        onChange={setSectionDDate}
        top={900}
        left={300}
        readOnly={readOnly}
        required={true}
      />
      */}
    </div>
  );

  const renderPage5 = () => (
    <div className="relative w-[800px] h-[1000px] mx-auto border shadow">
      <img 
        src="/stafForms/super choice form-page5.jpg" 
        className="absolute inset-0 w-full h-full" 
        alt="Superannuation Standard Choice Form - Page 5"
      />
    </div>
  );

  return (
    <div className="w-full">
      {/* Scrollable container with all pages */}
      <div className="space-y-4 pb-8">
        {renderPage1()}
        {renderPage2()}
        {renderPage3()}
        {renderPage4()}
        {renderPage5()}
      </div>

      {/* Action Buttons */}
      {showButtons && (
        <div className="flex gap-4 mt-6 justify-center sticky bottom-4">
          <button className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            Save Draft
          </button>
          <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Submit Form
          </button>
        </div>
      )}
    </div>
  );
}
