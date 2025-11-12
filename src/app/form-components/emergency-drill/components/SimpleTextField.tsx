import React from 'react';

interface SimpleTextFieldProps {
  label: string;
  value: string;
  className?: string;
}

const SimpleTextField: React.FC<SimpleTextFieldProps> = ({ 
  label, 
  value, 
  className = ''
}) => {
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      <span className="font-medium mb-2 text-sm">{label}:</span>
      <div className="border border-gray-400 p-3 bg-gray-50 text-sm leading-5 break-words whitespace-pre-wrap min-h-[60px]">
        {value || ''}
      </div>
    </div>
  );
};

export default SimpleTextField;
