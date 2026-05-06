"use client";

import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

// Import SignatureCanvas directly
const ReactSignatureCanvas = require('react-signature-canvas').default;

interface SignatureCanvasProps {
  onSignatureEnd?: (signature: string) => void;
  onSignatureClear?: () => void;
  existingSignature?: string;
  width?: number;
  height?: number;
  penColor?: string;
  backgroundColor?: string;
  className?: string;
  disabled?: boolean;
  showClearButton?: boolean;
  clearButtonText?: string;
  placeholder?: string;
}

export interface SignatureCanvasRef {
  clear: () => void;
  isEmpty: () => boolean;
  toDataURL: () => string;
  getCanvas: () => HTMLCanvasElement;
  getTrimmedCanvas: () => HTMLCanvasElement;
}

const SignatureCanvas = forwardRef<SignatureCanvasRef, SignatureCanvasProps>(({
  onSignatureEnd,
  onSignatureClear,
  existingSignature,
  width,
  height = 150,
  penColor = "black",
  backgroundColor = "white",
  className = "",
  disabled = false,
  showClearButton = true,
  clearButtonText = "Clear Signature",
  placeholder = "Draw your signature in the box above"
}, ref) => {
  const sigCanvasRef = useRef<any | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(false);
  const [canvasWidth, setCanvasWidth] = useState(width || 400);

  // Measure container width and update canvas width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // Subtract border width (2px on each side = 4px total)
        const newWidth = containerWidth - 4;
        if (newWidth > 0) {
          setCanvasWidth(newWidth);
        }
      }
    };

    // Small delay to ensure container is rendered
    const timeoutId = setTimeout(updateWidth, 100);

    // Update on window resize with debounce
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateWidth, 100);
    };
    window.addEventListener('resize', handleResize);
    
    // Also observe container size changes
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateWidth, 100);
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, [width]);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    clear: () => {
      if (sigCanvasRef.current) {
        sigCanvasRef.current.clear();
        if (onSignatureClear) {
          onSignatureClear();
        }
      }
    },
    isEmpty: () => {
      return sigCanvasRef.current ? sigCanvasRef.current.isEmpty() : true;
    },
    toDataURL: () => {
      if (sigCanvasRef.current) {
        try {
          const canvas = sigCanvasRef.current.getTrimmedCanvas?.() ?? sigCanvasRef.current.getCanvas();
          return canvas.toDataURL("image/png");
        } catch (err) {
          console.error("Error getting signature data URL:", err);
          return "";
        }
      }
      return "";
    },
    getCanvas: () => {
      return sigCanvasRef.current?.getCanvas();
    },
    getTrimmedCanvas: () => {
      return sigCanvasRef.current?.getTrimmedCanvas?.() ?? sigCanvasRef.current?.getCanvas();
    }
  }));

  // Handle signature end (when user finishes drawing)
  const handleSignatureEnd = () => {
    if (sigCanvasRef.current && onSignatureEnd) {
      try {
        // Mark that we just drew, so we don't reload our own signature
        isDrawingRef.current = true;
        // Use getCanvas() instead of getTrimmedCanvas() to preserve position and avoid stretching
        const canvas = sigCanvasRef.current.getCanvas();
        const dataUrl = canvas.toDataURL("image/png");
        onSignatureEnd(dataUrl);
      } catch (err) {
        console.error("Signature capture error:", err);
      }
    }
  };

  // Handle signature clear
  const handleSignatureClear = () => {
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear();
      if (onSignatureClear) {
        onSignatureClear();
      }
    }
  };

  // Load existing signature when component mounts, signature value changes, or canvas resizes
  useEffect(() => {
    // Skip if user just drew this signature (prevents redraw loop)
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      return;
    }
    
    if (existingSignature && sigCanvasRef.current) {
      // Small delay to ensure canvas is ready after resize
      const loadSignature = () => {
        const img = new window.Image();
        img.src = existingSignature;
        img.onload = () => {
          const canvas = sigCanvasRef.current?.getCanvas();
          const ctx = canvas?.getContext("2d");
          if (ctx && canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Draw at natural size, not stretched
            ctx.drawImage(img, 0, 0);
          }
        };
        img.onerror = () => {
          console.error("Failed to load existing signature image");
        };
      };
      
      // Delay loading slightly to ensure canvas is properly sized
      const timeoutId = setTimeout(loadSignature, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [existingSignature, canvasWidth]); // Added canvasWidth as dependency to redraw after resize

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div ref={containerRef} className="border-2 border-azure-200 rounded-lg bg-white w-full">
        <ReactSignatureCanvas
          ref={sigCanvasRef}
          penColor={penColor}
          backgroundColor={disabled ? "#f9fafb" : backgroundColor}
          canvasProps={{ 
            width: canvasWidth, 
            height, 
            className: "rounded-lg block",
            style: disabled ? { pointerEvents: 'none', cursor: 'not-allowed' } : {}
          }}
          onEnd={handleSignatureEnd}
        />
      </div>
      
      {showClearButton && !disabled && (
        <button
          type="button"
          onClick={handleSignatureClear}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm self-center"
        >
          {clearButtonText}
        </button>
      )}
      
      {placeholder && (
        <p className="text-xs text-azure-400 text-center">
          {placeholder}
        </p>
      )}
    </div>
  );
});

SignatureCanvas.displayName = 'SignatureCanvas';

export default SignatureCanvas;
