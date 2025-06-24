"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getFormBatchByToken } from "@/lib/api";
import BatchSignatureStep from "@/app/components/forms/BatchSignatureStep";
import { submitBatchSignature } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

export default function BatchSignaturePage({ batchToken }: { batchToken: string }) {
  const searchParams = useSearchParams();
  const passcode = searchParams.get("passcode");
  const router = useRouter();

  const {showToast} = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [batchData, setBatchData] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!passcode) return;
    const loadBatchData = async () => {
      try {
        setLoading(true);
        const data = await getFormBatchByToken(batchToken, passcode);
        setBatchData(data);
      } catch (err: any) {
        setError(err.message || "Failed to load batch");
      } finally {
        setLoading(false);
      }
    };
    loadBatchData();
  }, [batchToken, passcode]);

  const handleSubmitSignature = async (signature: string) => {
    alert('summa')
    console.log("Submitting signature:", signature);
    setSubmitting(true);
    setError("");
    try {
      await submitBatchSignature(batchToken, signature);
      setSuccess(true);
      // Optionally redirect or show a message
      router.push(`/forms/completed/${batchToken}?passcode=${encodeURIComponent(passcode || "")}`);
    } catch (err: any) {
      setError(err.message || "Failed to submit signature");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) {
    showToast({
      type: "error",
      title: "Error",
      message: error,
      duration: 3000,
    });
    return;
  }
  if (success) {
    showToast({
      type: "success",
      title: "Signature submitted",
      message: "Redirecting...",
      duration: 3000,
    });

    return;
  }

  return (
    <BatchSignatureStep
      onSubmit={handleSubmitSignature}
      readOnly={batchData?.isSigned}
      initialSignature={batchData?.signature || ""}
      submitting={submitting}
    />
  );
}
