"use client";

import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

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
  width = 400,
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
        const canvas = sigCanvasRef.current.getTrimmedCanvas?.() ?? sigCanvasRef.current.getCanvas();
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

  // Load existing signature when component mounts or signature value changes
  useEffect(() => {
    if (!existingSignature || !sigCanvasRef.current) return;

    const canvasInstance = sigCanvasRef.current;
    if (!canvasInstance.isEmpty()) {
      return;
    }

    const img = new window.Image();
    img.src = existingSignature;
    img.onload = () => {
      const ctx = canvasInstance.getCanvas()?.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
      }
    };
  }, [existingSignature, width, height]);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="border-2 border-gray-300 rounded-lg bg-white">
        <ReactSignatureCanvas
          ref={sigCanvasRef}
          penColor={penColor}
          backgroundColor={backgroundColor}
          canvasProps={{ 
            width, 
            height, 
            className: "rounded-lg",
            style: disabled ? { pointerEvents: 'none', opacity: 0.6 } : {}
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
        <p className="text-xs text-gray-500 text-center">
          {placeholder}
        </p>
      )}
    </div>
  );
});

SignatureCanvas.displayName = 'SignatureCanvas';

export default SignatureCanvas;
