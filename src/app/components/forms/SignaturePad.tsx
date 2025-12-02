"use client";

import React, { useRef, useEffect, useState } from "react";
// In a client component with "use client";
const SignatureCanvas = require('react-signature-canvas').default;

interface SignaturePadProps {
  onEnd: (dataUrl: string) => void;
  readOnly?: boolean;
  initialValue?: string;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onEnd, readOnly = false, initialValue }) => {
  const sigCanvasRef = useRef<any | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(400);

  // Measure container width and update canvas width dynamically
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
  }, []);

  useEffect(() => {
    if (initialValue && sigCanvasRef.current && sigCanvasRef.current.isEmpty()) {
      const img = new window.Image();
      img.src = initialValue;
      img.onload = () => {
        const canvas = sigCanvasRef.current?.getCanvas();
        const ctx = canvas?.getContext("2d");
        if (ctx && canvas) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // Draw at natural size, not stretched
          ctx.drawImage(img, 0, 0);
        }
      };
    }
  }, [initialValue]);

  const handleEnd = () => {
  if (sigCanvasRef.current) {
    try {
      const canvas =
        sigCanvasRef.current.getTrimmedCanvas?.() ??
        sigCanvasRef.current.getCanvas(); // fallback if trimmed fails
      const dataUrl = canvas.toDataURL("image/png");
      onEnd(dataUrl);
    } catch (err) {
      console.error("Signature capture error:", err);
    }
  }
};


  const handleClear = () => {
    sigCanvasRef.current?.clear();
    onEnd("");
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div ref={containerRef} className="border-2 border-gray-300 rounded-lg bg-white w-full">
        <SignatureCanvas
          ref={sigCanvasRef}
          penColor="black"
          backgroundColor="white"
          canvasProps={{ width: canvasWidth, height: 150, className: "rounded-lg block" }}
          onEnd={handleEnd}
        />
      </div>
      {!readOnly && (
        <button
          type="button"
          onClick={handleClear}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default SignaturePad;
