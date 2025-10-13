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
  // Show clean empty boxes for unanswered fields (no "No response provided" text)
  if (!value || value.trim() === '') {
    return (
      <div className={`mb-4 ${className}`}>
        <div className="font-medium mb-2 text-sm">{label}:</div>
        <div 
          className="border border-gray-400 p-3 bg-gray-50"
          style={{ 
            minHeight: type === 'textarea' ? '60px' : '40px'
          }}
        >
          {/* Empty - no placeholder text */}
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

  // Handle signature display
  if (type === 'signature') {
    return (
      <div className={`mb-4 ${className}`}>
        <div className="font-medium mb-2 text-sm">{label}:</div>
        <div 
          className="border border-gray-400 p-3 bg-gray-50 flex items-center justify-center"
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
      <div className="font-medium mb-2 text-sm">{label}:</div>
      <div 
        className="border border-gray-400 p-3 bg-gray-50 text-sm leading-6 break-words whitespace-pre-wrap"
        style={{ 
          minHeight: getMinHeight(),
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
