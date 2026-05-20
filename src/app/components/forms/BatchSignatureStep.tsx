import React, { useState } from "react";
import SignaturePad from "./SignaturePad";
import { FaCheck } from "react-icons/fa";

interface BatchSignatureStepProps {
  onSubmit: (signature: string) => void;
  readOnly?: boolean;
  initialSignature?: string;
  submitting?: boolean;
}

const BatchSignatureStep: React.FC<BatchSignatureStepProps> = ({
  onSubmit,
  readOnly = false,
  initialSignature = "",
  submitting = false,
}) => {
  const [signature, setSignature] = useState(initialSignature);
  const [touched, setTouched] = useState(false);

  const handleSignature = (sig: string) => {
    setSignature(sig);
    setTouched(true);
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl border border-azure-50 px-6 py-8 md:px-12 md:py-10 flex flex-col gap-8 transition-all duration-300 mt-8">
      <h2 className="text-2xl font-bold text-azure-700 mb-2">Final Step: Signature</h2>
      <p className="text-azure-500 mb-4">Please sign below to confirm all forms in this batch are complete and accurate.</p>
      <SignaturePad
        onEnd={handleSignature}
        readOnly={readOnly}
        initialValue={initialSignature}
      />
      {signature && (
        <div className="mt-2 text-green-600 text-sm font-semibold flex items-center gap-2">
          <FaCheck /> Signature captured
        </div>
      )}
      <button
        className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-semibold text-base bg-gradient-to-r from-azure-600 to-green-400 text-white hover:from-azure-700 hover:to-green-500 shadow-xl transition"
        onClick={() => onSubmit(signature)}
        disabled={!signature || readOnly || submitting}
      >
        <FaCheck className="w-5 h-5" />
        Confirm & Submit Batch
      </button>
    </div>
  );
};

export default BatchSignatureStep;
