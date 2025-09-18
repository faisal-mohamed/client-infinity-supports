"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

// Overlay Components
const CharacterInput = ({ 
  value, 
  onChange, 
  length, 
  top, 
  left, 
  gap = 2, 
  boxWidth = 20, 
  boxHeight = 25,
  readOnly = false,
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
  readOnly?: boolean;
  onUpArrow?: () => void;
  onDownArrow?: () => void;
  inputRefs?: React.MutableRefObject<(HTMLInputElement | null)[]>;
}) => {
  const localRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const refs = inputRefs || localRefs;

  const handleChange = (index: number, char: string) => {
    if (readOnly) return;
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
    const pastedText = e.clipboardData.getData('text').slice(0, length);
    const newValue = pastedText.padEnd(length, ' ').split('');
    onChange(newValue.join('').trimEnd());
    
    // Focus the next empty box or the last box
    const nextEmptyIndex = Math.min(pastedText.length, length - 1);
    refs.current[nextEmptyIndex]?.focus();
  };

  return (
    <div className="absolute" style={{ top, left }}>
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="border border-black text-center bg-white text-black"
          style={{
            width: boxWidth,
            height: boxHeight,
            marginRight: i < length - 1 ? (
              length === 9 ? (i === 2 ? 20 : i === 5 ? 24 : gap) : // TFN: 3-3-3 grouping
              gap // All other fields (including employee number) use normal gap
            ) : 0,
            fontSize: '12px',
            padding: 0,
            color: 'black'
          }}
          readOnly={readOnly}
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
      className="absolute border border-black bg-white px-1 text-black"
      style={{ 
        top, 
        left, 
        width, 
        height, 
        fontSize: '15px',
        color: 'black'
      }}
      readOnly={readOnly}
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
    style={{ top, left, width, height }}
    readOnly={readOnly}
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
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
      if (value && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const img = new (window as any).Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0, width, height);
          };
          img.src = value;
        }
      }
  }, [value, width, height]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readOnly) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || readOnly) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    if (readOnly) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onChange(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    if (readOnly) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        onChange('');
      }
    }
  };

  return (
    <div className="absolute" style={{ top, left }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-300 bg-white cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ cursor: readOnly ? 'default' : 'crosshair' }}
      />
      {!readOnly && (
        <button
          type="button"
          onClick={clearSignature}
          className="absolute -top-6 left-0 text-xs text-blue-600 hover:text-blue-800"
        >
          Clear
        </button>
      )}
    </div>
  );
};

const DateInput = ({ 
  value, 
  onChange, 
  top, 
  left, 
  readOnly = false 
}: {
  value: { day: string; month: string; year: string };
  onChange: (value: { day: string; month: string; year: string }) => void;
  top: number;
  left: number;
  readOnly?: boolean;
}) => {
  const handleChange = (field: 'day' | 'month' | 'year', val: string) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <div className="absolute" style={{ top, left }}>
      <CharacterInput
        value={value.day}
        onChange={(val) => handleChange('day', val)}
        length={2}
        top={0}
        left={0}
        readOnly={readOnly}
      />
      <span className="absolute top-1 left-12 text-sm">/</span>
      <CharacterInput
        value={value.month}
        onChange={(val) => handleChange('month', val)}
        length={2}
        top={0}
        left={20}
        readOnly={readOnly}
      />
      <span className="absolute top-1 left-32 text-sm">/</span>
      <CharacterInput
        value={value.year}
        onChange={(val) => handleChange('year', val)}
        length={4}
        top={0}
        left={40}
        readOnly={readOnly}
      />
    </div>
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
    <div className="relative">
      <Image
        src="/stafForms/super choice form-page1.jpg"
        alt="Superannuation Standard Choice Form - Page 1"
        width={800}
        height={1000}
        className="w-full h-auto"
      />
      
      {/* Section A: Your details */}
      <TextInput
        value={fullName}
        onChange={setFullName}
        top={598}
        left={462}
        width={398}
        readOnly={readOnly}
        onDownArrow={() => employeeNumberRefs.current[0]?.focus()}
      />
      
      <CharacterInput
        value={employeeNumber}
        onChange={setEmployeeNumber}
        length={16}
        top={657}
        left={460}
        readOnly={readOnly}
        onUpArrow={() => fullNameRef.current?.focus()}
        onDownArrow={() => tfnRefs.current[0]?.focus()}
        inputRefs={employeeNumberRefs}
      />
      
      <CharacterInput
        value={tfn}
        onChange={setTfn}
        length={9}
        top={715}
        left={462}
        gap={2}
        boxWidth={20}
        readOnly={readOnly}
        onUpArrow={() => employeeNumberRefs.current[0]?.focus()}
        inputRefs={tfnRefs}
      />
      
      {/* Fund choice selection */}
      <div className="absolute" style={{ top: 892, left: 471 }}>
        <Checkbox
          checked={fundChoice === "existing"}
          onChange={(checked) => setFundChoice(checked ? "existing" : "")}
          top={0}
          left={5}
          width={25}
          height={29}
          readOnly={readOnly}
        />
        <Checkbox
          checked={fundChoice === "default"}
          onChange={(checked) => setFundChoice(checked ? "default" : "")}
          top={109}
          left={5}
          width={25}
          height={29}
          readOnly={readOnly}
        />
        <Checkbox
          checked={fundChoice === "smsf"}
          onChange={(checked) => setFundChoice(checked ? "smsf" : "")}
          top={219}
          left={5}
          width={25}
          height={29}
          readOnly={readOnly}
        />
      </div>
    </div>
  );

  const renderPage2 = () => (
    <div className="relative">
      <Image
        src="/stafForms/super choice form-page2.jpg"
        alt="Superannuation Standard Choice Form - Page 2"
        width={800}
        height={1000}
        className="w-full h-auto"
      />
      
      {/* Section B: My existing super fund */}
      <TextInput
        value={superFundName}
        onChange={setSuperFundName}
        top={250}
        left={300}
        width={400}
        readOnly={readOnly}
      />
      
      <CharacterInput
        value={superFundABN}
        onChange={setSuperFundABN}
        length={11}
        top={300}
        left={300}
        readOnly={readOnly}
      />
      
      <CharacterInput
        value={superFundUSI}
        onChange={setSuperFundUSI}
        length={11}
        top={350}
        left={300}
        readOnly={readOnly}
      />
      
      <CharacterInput
        value={memberAccountNumber}
        onChange={setMemberAccountNumber}
        length={16}
        top={400}
        left={300}
        readOnly={readOnly}
      />
      
      <TextInput
        value={accountName}
        onChange={setAccountName}
        top={450}
        left={300}
        width={400}
        readOnly={readOnly}
      />
      
      <Checkbox
        checked={hasComplianceLetter}
        onChange={setHasComplianceLetter}
        top={550}
        left={50}
        readOnly={readOnly}
      />
      
      <SignaturePad
        value={sectionBSignature}
        onChange={setSectionBSignature}
        top={650}
        left={300}
        width={300}
        height={80}
        readOnly={readOnly}
      />
      
      <DateInput
        value={sectionBDate}
        onChange={setSectionBDate}
        top={750}
        left={300}
        readOnly={readOnly}
      />
    </div>
  );

  const renderPage3 = () => (
    <div className="relative">
      <Image
        src="/stafForms/super choice form-page3.jpg"
        alt="Superannuation Standard Choice Form - Page 3"
        width={800}
        height={1000}
        className="w-full h-auto"
      />
      
      {/* Section C: My employer's default super fund */}
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
      />
    </div>
  );

  const renderPage4 = () => (
    <div className="relative">
      <Image
        src="/stafForms/super choice form-page4.jpg"
        alt="Superannuation Standard Choice Form - Page 4"
        width={800}
        height={1000}
        className="w-full h-auto"
      />
      
      {/* Section D: My private self-managed super fund (SMSF) */}
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
      />
    </div>
  );

  const renderPage5 = () => (
    <div className="relative">
      <Image
        src="/stafForms/super choice form-page5.jpg"
        alt="Superannuation Standard Choice Form - Page 5"
        width={800}
        height={1000}
        className="w-full h-auto"
      />
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1: return renderPage1();
      case 2: return renderPage2();
      case 3: return renderPage3();
      case 4: return renderPage4();
      case 5: return renderPage5();
      default: return renderPage1();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Page Navigation */}
      <div className="flex justify-center mb-4">
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              disabled={readOnly}
            >
              Page {page}
            </button>
          ))}
        </div>
      </div>

      {/* Current Page Content */}
      {renderCurrentPage()}

      {/* Navigation Buttons */}
      {!readOnly && (
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-500 text-white rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(Math.min(5, currentPage + 1))}
            disabled={currentPage === 5}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}

      {/* Action Buttons */}
      {showButtons && (
        <div className="flex gap-4 mt-6 justify-center">
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
