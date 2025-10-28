import React from 'react';

interface DynamicTextFieldProps {
  label: string;
  value: string;
  className?: string;
  minLines?: number;
  maxLines?: number;
}

const DynamicTextField: React.FC<DynamicTextFieldProps> = ({ 
  label, 
  value, 
  className = '',
  minLines = 2,
  maxLines = 8
}) => {
  // Better calculation for text height
  const calculateHeight = (text: string) => {
    if (!text) return minLines * 20 + 16; // Base height for empty fields
    
    // Count actual line breaks in text
    const lineBreaks = (text.match(/\n/g) || []).length;
    
    // Estimate lines based on character count (more conservative)
    const avgCharsPerLine = 60; // Reduced for better accuracy
    const estimatedLines = Math.ceil(text.length / avgCharsPerLine);
    
    // Use the higher of line breaks or estimated lines
    const totalLines = Math.max(lineBreaks + 1, estimatedLines);
    
    // Ensure within min/max bounds
    const finalLines = Math.max(minLines, Math.min(maxLines, totalLines));
    
    return finalLines * 20 + 16; // 20px per line + padding
  };

  const fieldHeight = calculateHeight(value);

  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      <span className="font-medium mb-2 text-sm">{label}:</span>
      <div 
        className="border border-gray-400 p-3 bg-gray-50 text-sm leading-5 break-words whitespace-pre-wrap overflow-hidden"
        style={{ 
          minHeight: `${minLines * 20 + 16}px`,
          height: `${fieldHeight}px`
        }}
      >
        {value || ''}
      </div>
    </div>
  );
};

export default DynamicTextField;
