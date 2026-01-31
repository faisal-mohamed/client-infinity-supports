"use client";

import React, { useRef, useEffect } from "react";
// In a client component with "use client";
const SignatureCanvas = require('react-signature-canvas').default;

interface SignaturePadProps {
  onEnd: (dataUrl: string) => void;
  readOnly?: boolean;
  initialValue?: string;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onEnd, readOnly = false, initialValue }) => {
  const sigCanvasRef = useRef<any | null>(null);

  useEffect(() => {
    if (initialValue && sigCanvasRef.current && sigCanvasRef.current.isEmpty()) {
      const img = new window.Image();
      img.src = initialValue;
      img.onload = () => {
        const ctx = sigCanvasRef.current?.getCanvas().getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, 400, 150);
          ctx.drawImage(img, 0, 0, 400, 150);
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
    <div className="flex flex-col items-center space-y-2 w-full">
      <div className="border border-gray-200 rounded-lg bg-white w-full h-[200px] shadow-inner overflow-hidden">
        <SignatureCanvas
          ref={sigCanvasRef}
          penColor="black"
          backgroundColor="white"
          canvasProps={{
            width: 800,
            height: 200,
            className: "w-full h-full"
          }}
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
