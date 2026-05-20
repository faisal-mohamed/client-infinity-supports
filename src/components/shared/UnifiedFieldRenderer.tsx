import React from 'react';

interface UnifiedFieldRendererProps {
  fieldKey: string;
  label: string;
  value: string;
  type: 'text' | 'textarea' | 'longtext';
  mode: 'interactive' | 'pdf';
  onChange?: (value: string) => void;
  placeholder?: string;
  maxWords?: number;
}

export const UnifiedFieldRenderer: React.FC<UnifiedFieldRendererProps> = ({
  fieldKey,
  label,
  value,
  type,
  mode,
  onChange,
  placeholder,
  maxWords
}) => {
  const processedValue = value || '';
  const wordCount = processedValue.trim().split(/\s+/).filter(word => word.length > 0).length;

  if (mode === 'pdf') {
    return (
      <div className="unified-field page-break-field" style={{ breakInside: 'auto', pageBreakInside: 'auto' }}>
        <div className="bg-azure-200 border border-black px-2 py-1">
          <span className="unified-label font-bold text-sm">{label}</span>
        </div>
        <div 
          className="unified-content long-content border border-black border-t-0 p-3 bg-white"
          style={{
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            overflow: 'visible',
            height: 'auto',
            minHeight: type === 'longtext' ? '120px' : '40px',
            maxHeight: 'none',
            fontSize: '12px',
            lineHeight: '1.4'
          }}
        >
          {processedValue || ' '}
        </div>
      </div>
    );
  }

  return (
    <div className="unified-field mb-4">
      <label className="unified-label block text-sm font-medium text-azure-600 mb-2">
        {label}
      </label>
      {type === 'text' ? (
        <input
          type="text"
          value={processedValue}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="unified-content w-full px-3 py-2 border border-azure-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
      ) : (
        <textarea
          value={processedValue}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          rows={type === 'longtext' ? 6 : 3}
          className="unified-content w-full px-3 py-2 border border-azure-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 resize-vertical"
          style={{ 
            minHeight: type === 'longtext' ? '120px' : '80px',
            height: 'auto',
            maxHeight: 'none'
          }}
        />
      )}
      {maxWords && (
        <div className="text-sm text-azure-400 mt-1">
          {wordCount}/{maxWords} words
        </div>
      )}
    </div>
  );
};
