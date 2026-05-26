'use client';

import { useState, useRef } from 'react';
import { FaCloudUploadAlt, FaFile, FaTrash, FaSpinner, FaCheck } from 'react-icons/fa';

interface FileUploadProps {
  label: string;
  folder?: string;
  entityId?: string;
  subfolder?: string;
  accept?: string;
  onUploaded?: (file: { key: string; url: string; filename: string; size: number }) => void;
  value?: { key: string; filename: string } | null;
  onRemove?: () => void;
}

export default function FileUpload({
  label,
  folder = 'clients',
  entityId = '',
  subfolder = 'documents',
  accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx',
  onUploaded,
  value,
  onRemove,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum 10MB.');
      return;
    }

    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    formData.append('entityId', entityId);
    formData.append('subfolder', subfolder);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Upload failed');
        return;
      }

      onUploaded?.(data);
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  if (value) {
    return (
      <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-200 bg-emerald-50/50">
        <div className="flex items-center gap-2">
          <FaCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-sm text-azure-700 font-medium">{label}</span>
          <span className="text-xs text-azure-400 truncate max-w-[200px]">{value.filename}</span>
        </div>
        {onRemove && (
          <button
            onClick={async () => {
              try {
                await fetch('/api/upload/delete', {
                  method: 'DELETE',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ key: value.key }),
                });
              } catch {} // Non-critical if delete fails
              onRemove();
            }}
            className="p-1.5 rounded-lg text-azure-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <FaTrash className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <label
        className={`flex items-center justify-between p-3 rounded-xl border border-dashed cursor-pointer transition-all ${
          uploading ? 'border-gold-300 bg-gold-50/30' : error ? 'border-red-300 bg-red-50/30' : 'border-azure-200 bg-azure-50/30 hover:border-gold-400 hover:bg-gold-50/20'
        }`}
      >
        <div className="flex items-center gap-2">
          {uploading ? (
            <FaSpinner className="w-3.5 h-3.5 text-gold-500 animate-spin" />
          ) : (
            <FaCloudUploadAlt className="w-3.5 h-3.5 text-azure-400" />
          )}
          <span className="text-sm text-azure-600">{label}</span>
        </div>
        <span className="text-xs text-azure-400 bg-azure-100 px-3 py-1 rounded-lg">
          {uploading ? 'Uploading...' : 'Choose file'}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </label>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
