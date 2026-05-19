"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaArrowLeft,
  FaSignature,
  FaCheck,
  FaSpinner,
  FaEye,
  FaDownload,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import {
  getFormComponent,
  getFormSignatures,
  type SignatureRequirement,
} from "@/app/forms/registry";
import { useToast } from "@/components/ui/Toast";
import SignatureCanvas, {
  SignatureCanvasRef,
} from "@/components/ui/SignatureCanvas";
import { fetchFormSpecificSettings } from "@/lib/settings";

// Types
interface FormSignatureData {
  formSubmission: {
    id: string | number;
    data: any;
    clientSignature?: string;
    clientSignedAt?: string;
    form: {
      id: string | number; // Add form ID
      formKey: string;
      title: string;
      schema: any;
      requiresSignature?: boolean;
    };
  };
  client: {
    name: string;
    email: string;
    commonFields: any;
  };
  batchToken: string;
  isExpired: boolean;
}

export default function FormSignaturePageClient() {
  const params = useParams();
  const router = useRouter();

  const token = params.token as string;
  const formSubmissionId = parseInt(params.formSubmissionId as string);

  const [formData, setFormData] = useState<FormSignatureData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const [editedFormValues, setEditedFormValues] = useState<any | null>(null);

  // Button-specific loading states
  const [saving, setSaving] = useState(false); // For Save Progress button
  const [navigatingNext, setNavigatingNext] = useState(false); // For Next button
  const [navigatingPrev, setNavigatingPrev] = useState(false); // For Previous button

  // Multi-signature state
  const [requiredSignatures, setRequiredSignatures] = useState<
    SignatureRequirement[]
  >([]);
  const [currentSignatureStep, setCurrentSignatureStep] = useState(0);
  const [signatureRefs, setSignatureRefs] = useState<
    Record<string, SignatureCanvasRef>
  >({});
  const [completedSignatures, setCompletedSignatures] = useState<
    Record<string, boolean>
  >({});

  const [signatureName, setSignatureName] = useState<string>("");
  const [signatureDate, setSignatureDate] = useState<string>(() => {
    // Initialize with today's date in YYYY-MM-DD format
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });

  const [selectedGroupSignatureId, setSelectedGroupSignatureId] = useState<
    string | null
  >(null);

  const currentSig = requiredSignatures[currentSignatureStep];
  const isGroupAny = currentSig?.groupRequirementType === "any";
  const sameGroupSigs = isGroupAny
    ? requiredSignatures.filter((sig) => sig.groupId === currentSig.groupId)
    : [];

  const activeSignatureId = isGroupAny
    ? selectedGroupSignatureId
    : currentSig?.id;

  const needsName = isGroupAny
    ? !!sameGroupSigs.find((sig) => sig.id === activeSignatureId)?.signerName
    : !!currentSig?.signerName;

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL LOGIC
  useEffect(() => {
    loadFormData();
  }, [token, formSubmissionId]);

  const [formSettings, setFormSettings] = useState({});

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await fetchFormSpecificSettings();
      setFormSettings(settings);
    };

    loadSettings();
  }, []); // Empty dependency array means this runs once on mount

  // Load signature requirements when form data is available
  useEffect(() => {
    if (formData) {
      const allSignatures = getFormSignatures(
        formData.formSubmission.form.formKey
      );
      const completed: Record<string, boolean> = {};
      const filtered: SignatureRequirement[] = [];
      const groupMap = new Map<string, any[]>();

      for (const sig of allSignatures) {
        const dataKey = sig.dataKey || sig.id;
        const isSigned: any = !!formData.formSubmission.data[dataKey];

        // Grouped logic
        if (sig.groupId && sig.groupRequirementType === "any") {
          if (!groupMap.has(sig.groupId)) groupMap.set(sig.groupId, []);
          groupMap.get(sig.groupId)!.push({ ...sig, isSigned });
        } else {
          // Normal signature (required or conditional)
          if (
            sig.required ||
            (sig.condition && sig.condition(formData.formSubmission.data))
          ) {
            completed[sig.id] = isSigned;

            if (!isSigned) {
              filtered.push(sig);
            }
          }
        }
      }

      // Evaluate "any" groups
      for (const [groupId, groupSigs] of groupMap.entries()) {
        const isGroupSigned = groupSigs.some((sig: any) => sig.isSigned);
        if (isGroupSigned) {
          groupSigs.forEach((sig) => (completed[sig.id] = true));
        } else {
          groupSigs.forEach((sig) => {
            filtered.push(sig); // Allow user to choose one
            completed[sig.id] = false;
          });
        }
      }

      setRequiredSignatures(filtered);
      setCompletedSignatures(completed);

      // Determine if any signature is pending
      const hasIncomplete = filtered.some((sig) => !completed[sig.id]);
      if (hasIncomplete && formData.formSubmission.form.requiresSignature) {
        setShowSignaturePad(true);
        const firstIncomplete = filtered.findIndex((sig) => !completed[sig.id]);
        setCurrentSignatureStep(Math.max(0, firstIncomplete));
      }

      console.log("Filtered Signatures:", filtered);
      console.log("Completed Map:", completed);
    }
  }, [formData]);

  // Effect to handle automatic step progression
  useEffect(() => {
    if (showSignaturePad && requiredSignatures.length > 0) {
      const currentSignature = requiredSignatures[currentSignatureStep];
      if (currentSignature && completedSignatures[currentSignature.id]) {
        // Find next incomplete signature
        const nextIncomplete = requiredSignatures.findIndex(
          (sig) => !completedSignatures[sig.id]
        );
        if (nextIncomplete !== -1 && nextIncomplete !== currentSignatureStep) {
          setCurrentSignatureStep(nextIncomplete);
        }
      }
    }
  }, [
    completedSignatures,
    currentSignatureStep,
    requiredSignatures,
    showSignaturePad,
  ]);

  const loadFormData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/signature/${token}/${formSubmissionId}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Form not found or access denied");
        } else if (response.status === 410) {
          throw new Error("This signature link has expired");
        }
        throw new Error("Failed to load form data");
      }

      const data = await response.json();

      // DEBUG: Log form data received from API
      console.group('[Frontend Debug] Form data loaded from API');
      console.log('Full response:', data);
      console.log('Form submission data keys:', data?.formSubmission?.data ? Object.keys(data.formSubmission.data) : 'NO DATA');
      console.log('participantSignature exists:', !!data?.formSubmission?.data?.participantSignature);
      console.log('authorSignature exists:', !!data?.formSubmission?.data?.authorSignature);
      if (data?.formSubmission?.data?.participantSignature) {
        console.log('participantSignature type:', typeof data.formSubmission.data.participantSignature);
        console.log('participantSignature length:', data.formSubmission.data.participantSignature.length);
        console.log('participantSignature preview:', data.formSubmission.data.participantSignature.substring(0, 50) + '...');
      }
      if (data?.formSubmission?.data?.authorSignature) {
        console.log('authorSignature type:', typeof data.formSubmission.data.authorSignature);
        console.log('authorSignature length:', data.formSubmission.data.authorSignature.length);
        console.log('authorSignature preview:', data.formSubmission.data.authorSignature.substring(0, 50) + '...');
      }
      console.log('Are they the same?',
        data?.formSubmission?.data?.participantSignature === data?.formSubmission?.data?.authorSignature);
      console.groupEnd();

      setFormData(data);
      setEditedFormValues(data?.formSubmission?.data || {});
      console.log("Form data loaded:", data);
    } catch (error: any) {
      console.error("Error loading form data:", error);
      setError(error.message || "Failed to load form data");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewComplete = () => {
    const hasIncompleteSignatures = requiredSignatures.some(
      (sig) => !completedSignatures[sig.id]
    );
    if (
      hasIncompleteSignatures &&
      formData?.formSubmission.form.requiresSignature
    ) {
      setShowSignaturePad(true);
      // Find first incomplete signature
      const firstIncomplete = requiredSignatures.findIndex(
        (sig) => !completedSignatures[sig.id]
      );
      setCurrentSignatureStep(Math.max(0, firstIncomplete));
    }
  };

  const submitSignature = async (signatureId: string) => {
    const signatureRef = signatureRefs[signatureId];
    if (!signatureRef || !formData) return;

    if (signatureRef.isEmpty()) {
      alert("Please provide your signature before submitting.");
      return;
    }

    if (needsName && !signatureName.trim()) {
      alert("Please enter your name before submitting.");
      return;
    }

    if (!signatureDate) {
      alert("Please select a signature date before submitting.");
      return;
    }

    try {
      setSubmitting(true);

      const signatureDataURL = signatureRef.toDataURL();

      // Convert date from YYYY-MM-DD to DD-MM-YYYY format
      const [year, month, day] = signatureDate.split('-');
      const formattedDate = `${day}-${month}-${year}`;

      const response = await fetch(
        `/api/signature/${token}/${formSubmissionId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            signature: signatureDataURL,
            signatureId,
            signerName: signatureName,
            signedAt: formattedDate,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit signature");
      }

      const result = await response.json();

      // DEBUG: Log signature submission result
      console.group('[Frontend Debug] Signature submitted');
      console.log('signatureId submitted:', signatureId);
      console.log('result from API:', result);
      console.groupEnd();

      // Reload form data to get updated signatures
      await loadFormData();

      // Update completed signatures based on updated form data
      const updatedCompleted = { ...completedSignatures, [signatureId]: true };
      setCompletedSignatures(updatedCompleted);

      setSignatureName(""); // Reset name after submission
      // Reset date to today for next signature
      const today = new Date();
      setSignatureDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);

      const allComplete = requiredSignatures.every(
        (sig) => updatedCompleted[sig.id]
      );

      if (allComplete || result.allSignaturesComplete) {
        router.push(`/forms/signature/${token}`);
      } else {
        const nextIncompleteIndex = requiredSignatures.findIndex(
          (sig) => !updatedCompleted[sig.id]
        );
        if (nextIncompleteIndex !== -1) {
          setCurrentSignatureStep(nextIncompleteIndex);
          setSelectedGroupSignatureId(null); // reset for next
        }
      }
    } catch (error: any) {
      console.error("Error submitting signature:", error);
      alert("Failed to submit signature. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadForm = async () => {
    if (!formData) return;

    try {
      const response = await fetch(
        `/api/generate-pdf/${formSubmissionId}/${formData.formSubmission.form.id}`
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `${formData.formSubmission.form.title}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error downloading form:", error);
      alert("Failed to download form. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-azure-50 to-azure-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-t-azure-600 border-azure-200 rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-xl font-bold text-azure-700 mb-2">Loading Form</h3>
          <p className="text-azure-500 font-medium">Please wait...</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-azure-600 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-azure-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-azure-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-azure-50 flex justify-center items-center">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-sm">
          <div className="text-red-500 mb-4">
            <FaSignature className="h-16 w-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-azure-700 mb-4">
            Access Error
          </h1>
          <p className="text-azure-500 mb-6">{error}</p>
          <Link
            href={`/forms/signature/${token}`}
            className="text-azure-700 hover:text-azure-800"
          >
            Back to Forms List
          </Link>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-azure-50 flex justify-center items-center">
        <div className="text-center">
          <p className="text-azure-500">Form data not found.</p>
        </div>
      </div>
    );
  }

  // Get the appropriate form component from registry
  let FormViewComponent;
  let FormEditComponent: any = null;
  try {
    FormViewComponent = getFormComponent(
      formData.formSubmission.form.formKey,
      "view"
    );
    if (["emergency_drill", "conflict_of_interest"].includes(formData.formSubmission.form.formKey)) {
      FormEditComponent = getFormComponent(
        formData.formSubmission.form.formKey,
        "edit"
      );
    }
  } catch (error) {
    console.log("error : ", error);
    return (
      <div className="min-h-screen bg-azure-50 flex justify-center items-center">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-azure-700 mb-4">
            Form Component Not Found
          </h1>
          <p className="text-azure-500 mb-4">
            Unable to display this form type:{" "}
            {formData.formSubmission.form.formKey}
          </p>
          <Link
            href={`/forms/signature/${token}`}
            className="text-azure-700 hover:text-azure-800"
          >
            Back to Forms List
          </Link>
        </div>
      </div>
    );
  }

  const requiresSignature = formData.formSubmission.form.requiresSignature;
  const isEditableForm = ["emergency_drill", "conflict_of_interest"].includes(formData.formSubmission.form.formKey);

  const allSignaturesComplete = requiredSignatures.length === 0;

  console.log("Debug - Signature Status:", {
    formKey: formData.formSubmission.form.formKey,
    isConflictOfInterest: formData.formSubmission.data.isConflictOfInterest,
    hasConflictSignature: !!formData.formSubmission.data.signature,
    requiredSignaturesLength: requiredSignatures.length,
    allSignaturesComplete,
    showSignaturePad,
    requiredSignatures: requiredSignatures.map(sig => ({ id: sig.id, label: sig.label }))
  });

  return (
    <div className="min-h-screen bg-azure-50">
      {/* Fixed width container that will zoom out on mobile */}
      <div className="w-[1200px] mx-auto px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href={`/forms/signature/${token}`}
                className="mr-4 p-2 rounded-lg hover:bg-azure-100 transition-colors"
              >
                <FaArrowLeft className="h-5 w-5 text-azure-500" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-azure-700">
                  {formData.formSubmission.form.title}
                </h1>
                <p className="text-azure-500 mt-1">
                  {formData.client.name} • {formData.client.email}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Status Badge */}
              {requiresSignature ? (
                allSignaturesComplete ? (
                  <div className="flex items-center text-green-600">
                    <FaCheck className="h-5 w-5 mr-2" />
                    <span className="font-medium">All Signatures Complete</span>
                  </div>
                ) : (
                  <div className="flex items-center text-amber-600">
                    <FaSignature className="h-5 w-5 mr-2" />
                    <span className="font-medium">
                      {requiredSignatures.length > 1 ? "Signatures Required" : "Signature Required"}
                    </span>
                  </div>
                )
              ) : (
                <div className="flex items-center text-blue-600">
                  <FaEye className="h-5 w-5 mr-2" />
                  <span className="font-medium">View Only</span>
                </div>
              )}
            </div>
          </div>

          {allSignaturesComplete && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                All required signatures have been completed for this form.
              </p>
            </div>
          )}

          {!requiresSignature && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                This form is for review only and does not require a signature.
              </p>
            </div>
          )}
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          {isEditableForm && FormEditComponent ? (
            <FormEditComponent
              formData={editedFormValues}
              commonFieldsData={formData.client.commonFields?.[0] || formData.client || {}}
              onChange={(values: any) => setEditedFormValues(values)}
              readOnly={false}
              isSignatureLink={true}
              handleSaveProgress={async () => {
                try {
                  setSaving(true);
                  const res = await fetch(`/api/signature/${formData.batchToken}/${formData.formSubmission.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ data: editedFormValues }),
                  });
                  if (!res.ok) throw new Error("Failed to save");
                  showToast({ type: "success", title: "Saved", message: "Progress saved", duration: 2000 });
                } catch (e: any) {
                  showToast({ type: "error", title: "Save failed", message: e?.message || "Could not save" });
                } finally {
                  setSaving(false);
                }
              }}
              handleSaveForNext={async () => {
                try {
                  setNavigatingNext(true);
                  const res = await fetch(`/api/signature/${formData.batchToken}/${formData.formSubmission.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ data: editedFormValues }),
                  });
                  if (!res.ok) throw new Error("Failed to save");
                } catch (e: any) {
                  showToast({ type: "error", title: "Save failed", message: e?.message || "Could not save" });
                } finally {
                  setNavigatingNext(false);
                }
              }}
              handleSubmitForm={async () => {
                try {
                  setSaving(true);
                  const res = await fetch(`/api/signature/${formData.batchToken}/${formData.formSubmission.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ data: editedFormValues, isSubmitted: true }),
                  });
                  if (!res.ok) throw new Error("Failed to save");
                  showToast({ type: "success", title: "Submitted", message: "Form submitted successfully", duration: 3000 });
                  // Optionally redirect or show success state
                } catch (e: any) {
                  showToast({ type: "error", title: "Submit failed", message: e?.message || "Could not submit" });
                } finally {
                  setSaving(false);
                }
              }}
            />
          ) : (

            <FormViewComponent
              formSchemas={formData.formSubmission.form.schema}
              formData={formData.formSubmission.data}
              showSignature={allSignaturesComplete}
              existingSignature={formData.formSubmission.data?.signature}
              isClientView={true}
              commonFieldsData={formData.client.commonFields[0] || {}}
              settings={formSettings}
            />
          )}
        </div>

        {/* Signature Requirements Overview */}
        {/* {renderSignatureStatus()} */}

        {/* Action Section - Only show for forms requiring signature (hidden for editable forms) */}
        {requiresSignature && !isEditableForm && !showSignaturePad && !allSignaturesComplete && (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h3 className="text-lg font-medium text-azure-700 mb-4">
              Review Complete
            </h3>
            <p className="text-azure-500 mb-6">
              Please review the information above. If everything looks correct,
              proceed to sign the document.
              {requiredSignatures.length > 1 && (
                <span className="block mt-2 text-sm">
                  This form requires {requiredSignatures.length} signatures.
                </span>
              )}
            </p>
            <button
              onClick={handleReviewComplete}
              className="inline-flex items-center px-6 py-3 bg-azure-700 text-white font-medium rounded-lg hover:bg-azure-800 transition-colors"
            >
              <FaSignature className="mr-2" />
              Proceed to Sign
            </button>
          </div>
        )}

        {requiresSignature &&
          !isEditableForm &&
          showSignaturePad &&
          !allSignaturesComplete &&
          requiredSignatures.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-azure-700 mb-4">
                {currentSig?.label || "Provide Your Signature"}
              </h3>
              {currentSig?.description && (
                <p className="text-azure-500 mb-6">
                  {currentSig.description}
                </p>
              )}

              {/* Optional dropdown for group 'any' */}
              {isGroupAny && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-azure-600 mb-1">
                    Select Signature Type
                  </label>
                  <select
                    title="Select signature type"
                    className="w-full border border-azure-200 rounded px-3 py-2"
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      setSelectedGroupSignatureId(selectedId);
                      setSignatureName(""); // Clear name

                      // Clear signature pad if it already exists
                      const existingRef = signatureRefs[selectedId];
                      if (existingRef) {
                        existingRef.clear();
                      }
                    }}
                    value={selectedGroupSignatureId || ""}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {sameGroupSigs.map((sig) => (
                      <option key={sig.id} value={sig.id}>
                        {sig.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Signature pad and submit */}
              {activeSignatureId && (
                <div className="mb-8">
                  <div className="max-w-2xl mx-auto space-y-6">
                    {/* Name Input (only if required by config) */}
                    {needsName && (
                      <div>
                        <label className="block text-sm font-medium text-azure-600 mb-1">
                          Your Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full border border-azure-200 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                          placeholder="Enter your full name"
                          value={signatureName}
                          onChange={(e) => setSignatureName(e.target.value)}
                        />
                      </div>
                    )}

                    {/* Date Input */}
                    <div>
                      <label className="block text-sm font-medium text-azure-600 mb-1">
                        Signature Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full border border-azure-200 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                        value={signatureDate}
                        onChange={(e) => setSignatureDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    {/* Signature Pad */}
                    <div>
                      <label className="block text-sm font-medium text-azure-600 mb-1">
                        {currentSig?.label || "Your Signature"} <span className="text-red-500">*</span>
                      </label>
                      <div className="border border-azure-200 rounded-md shadow-sm bg-white pb-12 relative">
                        <SignatureCanvas
                          ref={(ref) => {
                            if (
                              ref &&
                              activeSignatureId &&
                              !signatureRefs[activeSignatureId]
                            ) {
                              setSignatureRefs((prev) => ({
                                ...prev,
                                [activeSignatureId]: ref,
                              }));
                            }
                          }}
                          width={700}
                          height={250}
                          className="w-full h-64 rounded-md"
                        />
                      </div>
                      <p className="text-xs text-azure-400 mt-2">
                        Sign above using your finger, stylus, or mouse
                      </p>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                      <button
                        onClick={() => submitSignature(activeSignatureId)}
                        disabled={submitting}
                        className="bg-azure-700 hover:bg-azure-800 text-white font-semibold py-3 px-8 rounded-lg shadow-sm transition-all disabled:opacity-50"
                      >
                        {submitting ? (
                          <span className="flex items-center">
                            <FaSpinner className="animate-spin mr-2" />{" "}
                            Submitting...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <FaCheck className="mr-2" /> Submit Signature
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        {/* View Only Message - For forms that don't require signature */}
        {!requiresSignature && (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h3 className="text-lg font-medium text-azure-700 mb-4">
              Review Complete
            </h3>
            <p className="text-azure-500 mb-6">
              This form has been provided for your review. No signature is
              required.
            </p>
            <Link
              href={`/forms/signature/${token}`}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Forms List
            </Link>
          </div>
        )}

        {/* All Signatures Complete Message */}
        {requiresSignature && allSignaturesComplete && (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheck className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-azure-700 mb-4">
              All Signatures Complete
            </h3>
            <p className="text-azure-500 mb-6">
              Thank you! All required signatures have been collected for this
              form.
              {requiredSignatures.length > 1 && (
                <span className="block mt-2 text-sm">
                  {requiredSignatures.length} signatures were completed
                  successfully.
                </span>
              )}
            </p>
            <Link
              href={`/forms/signature/${token}`}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Forms List
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
