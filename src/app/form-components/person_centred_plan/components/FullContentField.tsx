import React from 'react';

interface FullContentFieldProps {
  label: string;
  value: string;
  className?: string;
  type?: 'text' | 'textarea' | 'signature';
}

const FullContentField: React.FC<FullContentFieldProps> = ({ 
  label, 
  value, 
  className = '',
  type = 'text'
}) => {
  // Show clean display for empty fields (no boxes)
  if (!value || value.trim() === '') {
    return (
      <div className={`mb-4 ${className}`}>
        <div className="font-bold mb-2 text-sm text-gray-800">{label}:</div>
        <div className="text-gray-400 italic pl-2 border-l-2 border-gray-200">
          {/* Empty - no placeholder text, no boxes */}
        </div>
      </div>
    );
  }

  // Calculate dynamic height based on content
  const getMinHeight = () => {
    if (type === 'signature') return '60px';
    if (!value) return '32px';
    
    const lineCount = Math.max(1, value.split('\n').length);
    const estimatedLines = Math.max(lineCount, Math.ceil(value.length / 70)); // Reduced from 80 to 70 for better fit
    const minHeight = Math.max(40, estimatedLines * 22 + 20); // Increased line height and padding
    return `${minHeight}px`;
  };

  // No max height - let content expand fully

  // Handle signature display (keep box for signatures only)
  if (type === 'signature') {
    return (
      <div className={`mb-4 ${className}`}>
        <div className="font-bold mb-2 text-sm text-gray-800">{label}:</div>
        <div 
          className="border border-gray-400 p-3 bg-gray-50 flex items-center justify-center ml-2 border-l-4 border-l-blue-300"
          style={{ minHeight: '60px' }}
        >
          {value && value.startsWith('data:image') ? (
            <img 
              src={value} 
              alt={`${label} Signature`} 
              className="max-h-12 object-contain"
            />
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className={`mb-4 ${className}`}>
      <div className="font-bold mb-2 text-sm text-gray-800">{label}:</div>
      <div 
        className="text-sm leading-6 break-words whitespace-pre-wrap text-gray-700 font-medium pl-2 border-l-4 border-l-gray-300 bg-gray-50 py-2 px-3 rounded-r"
        style={{ 
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          hyphens: 'auto'
        }}
      >
        {value}
      </div>
    </div>
  );
};

export default FullContentField;
