'use client';

import { useEffect, useState } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isChunkError, setIsChunkError] = useState(false);

  useEffect(() => {
    // Check if this is a chunk load error
    const errorMessage = error?.message || error?.toString() || '';
    const chunkErrorPatterns = [
      'ChunkLoadError',
      'Loading chunk',
      'Failed to fetch dynamically imported module',
      'timeout',
      'chunk',
    ];

    const isChunk = chunkErrorPatterns.some((pattern) =>
      errorMessage.toLowerCase().includes(pattern.toLowerCase())
    );

    setIsChunkError(isChunk);

    // Log error for debugging
    console.error('Error boundary caught:', error);
  }, [error]);

  const handleReload = () => {
    // Clear cache before reload
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
    // Force reload
    window.location.reload();
  };

  // Show user-friendly UI for chunk errors
  if (isChunkError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Loading Issue Detected
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-2 leading-relaxed">
            The application is taking longer than expected to load. This can happen due to network issues or a slow connection.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Please try reloading the page to resolve this issue.
          </p>

          {/* Reload Button */}
          <button
            onClick={handleReload}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Reload Page</span>
          </button>

          {/* Additional Help */}
          <p className="text-xs text-gray-400 mt-4">
            If the problem persists, please check your internet connection or contact support.
          </p>
        </div>
      </div>
    );
  }

  // For other errors, show standard error UI with reset option
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Something went wrong
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          An unexpected error occurred. Please try again.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
}

