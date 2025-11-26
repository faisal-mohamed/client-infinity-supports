"use client";

import { useEffect, useState } from 'react';

export default function ChunkLoadErrorHandler() {
  const [hasError, setHasError] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  useEffect(() => {
    // Handle chunk load errors globally
    const handleChunkError = (event: ErrorEvent) => {
      const error = event.error || event.message || '';
      const isChunkError = 
        error?.toString().includes('ChunkLoadError') ||
        error?.toString().includes('Loading chunk') ||
        error?.toString().includes('Failed to fetch dynamically imported module') ||
        event.message?.includes('Loading chunk') ||
        event.message?.includes('ChunkLoadError');

      if (isChunkError) {
        console.warn('Chunk load error detected, showing reload UI');
        event.preventDefault();
        setHasError(true);
        return false;
      }
    };

    // Handle unhandled promise rejections (chunk errors often come as promise rejections)
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason?.toString() || event.reason?.message || '';
      const isChunkError = 
        error.includes('ChunkLoadError') ||
        error.includes('Loading chunk') ||
        error.includes('Failed to fetch dynamically imported module') ||
        error.includes('timeout') ||
        error.includes('Failed to fetch');

      if (isChunkError) {
        console.warn('Chunk load error in promise rejection, showing reload UI');
        event.preventDefault();
        setHasError(true);
        return false;
      }
    };

    // Handle custom chunk error events from script in layout
    const handleCustomChunkError = (event: CustomEvent) => {
      console.warn('Custom chunk load error event received:', event.detail);
      setHasError(true);
    };

    window.addEventListener('error', handleChunkError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('chunkloaderror', handleCustomChunkError as EventListener);

    return () => {
      window.removeEventListener('error', handleChunkError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('chunkloaderror', handleCustomChunkError as EventListener);
    };
  }, []);

  const handleReload = () => {
    setIsReloading(true);
    // Clear cache and reload
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

  if (!hasError) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
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
          disabled={isReloading}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isReloading ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Reloading...</span>
            </>
          ) : (
            <>
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
            </>
          )}
        </button>

        {/* Additional Help */}
        <p className="text-xs text-gray-400 mt-4">
          If the problem persists, please check your internet connection or contact support.
        </p>
      </div>
    </div>
  );
}

