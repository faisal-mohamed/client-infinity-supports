"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSignature, FaCheck, FaSpinner, FaEye, FaDownload, FaUser, FaUsers } from 'react-icons/fa';
import { getFormComponent, getFormSignatures, type SignatureRequirement } from '@/app/forms/registry';
import SignatureCanvas, { SignatureCanvasRef } from '@/components/ui/SignatureCanvas';

// Types
interface FormSignatureData {
  formSubmission: {
    id: number;
    data: any;
    clientSignature?: string;
    clientSignedAt?: string;
    form: {
      id: number; // Add form ID
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
  
  // Multi-signature state
  const [requiredSignatures, setRequiredSignatures] = useState<SignatureRequirement[]>([]);
  const [currentSignatureStep, setCurrentSignatureStep] = useState(0);
  const [signatureRefs, setSignatureRefs] = useState<Record<string, SignatureCanvasRef>>({});
  const [completedSignatures, setCompletedSignatures] = useState<Record<string, boolean>>({});

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL LOGIC
  useEffect(() => {
    loadFormData();
  }, [token, formSubmissionId]);

  // Load signature requirements when form data is available
  useEffect(() => {
    if (formData) {
      const signatures = getFormSignatures(formData.formSubmission.form.formKey);
      
      // Filter signatures based on conditions and requirements
      const required = signatures.filter(sig => {
        if (sig.condition) {
          return sig.condition(formData.formSubmission.data);
        }
        return sig.required;
      });
      
      setRequiredSignatures(required);
      
      // Check which signatures are already completed
      const completed: Record<string, boolean> = {};
      required.forEach(sig => {
        const dataKey = sig.dataKey || sig.id;
        completed[sig.id] = !!formData.formSubmission.data[dataKey];
      });
      setCompletedSignatures(completed);
      
      // If there are signatures and some are not completed, show signature pad
      const hasIncompleteSignatures = required.some(sig => !completed[sig.id]);
      if (hasIncompleteSignatures && formData.formSubmission.form.requiresSignature) {
        setShowSignaturePad(true);
        // Find first incomplete signature
        const firstIncomplete = required.findIndex(sig => !completed[sig.id]);
        setCurrentSignatureStep(Math.max(0, firstIncomplete));
      }
    }
  }, [formData]);

  // Effect to handle automatic step progression
  useEffect(() => {
    if (showSignaturePad && requiredSignatures.length > 0) {
      const currentSignature = requiredSignatures[currentSignatureStep];
      if (currentSignature && completedSignatures[currentSignature.id]) {
        // Find next incomplete signature
        const nextIncomplete = requiredSignatures.findIndex(sig => !completedSignatures[sig.id]);
        if (nextIncomplete !== -1 && nextIncomplete !== currentSignatureStep) {
          setCurrentSignatureStep(nextIncomplete);
        }
      }
    }
  }, [completedSignatures, currentSignatureStep, requiredSignatures, showSignaturePad]);

  const loadFormData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/signature/${token}/${formSubmissionId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Form not found or access denied');
        } else if (response.status === 410) {
          throw new Error('This signature link has expired');
        }
        throw new Error('Failed to load form data');
      }
      
      const data = await response.json();
      setFormData(data);
      console.log('Form data loaded:', data);
      
    } catch (error: any) {
      console.error('Error loading form data:', error);
      setError(error.message || 'Failed to load form data');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewComplete = () => {
    const hasIncompleteSignatures = requiredSignatures.some(sig => !completedSignatures[sig.id]);
    if (hasIncompleteSignatures && formData?.formSubmission.form.requiresSignature) {
      setShowSignaturePad(true);
      // Find first incomplete signature
      const firstIncomplete = requiredSignatures.findIndex(sig => !completedSignatures[sig.id]);
      setCurrentSignatureStep(Math.max(0, firstIncomplete));
    }
  };

  const submitSignature = async (signatureId: string) => {
    const signatureRef = signatureRefs[signatureId];
    if (!signatureRef || !formData) return;

    if (signatureRef.isEmpty()) {
      alert('Please provide your signature before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      
      const signatureDataURL = signatureRef.toDataURL();
      
      const response = await fetch(`/api/signature/${token}/${formSubmissionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signature: signatureDataURL,
          signatureId: signatureId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit signature');
      }

      const result = await response.json();
      
      // Update completed signatures
      const updatedCompleted = { ...completedSignatures, [signatureId]: true };
      setCompletedSignatures(updatedCompleted);

      // Check if all signatures are complete
      const allComplete = requiredSignatures.every(sig => updatedCompleted[sig.id]);
      
      if (allComplete || result.allSignaturesComplete) {
        // All signatures complete, redirect back to signature portal
        router.push(`/forms/signature/${token}`);
      } else {
        // Move to next incomplete signature
        const nextIncompleteIndex = requiredSignatures.findIndex(sig => !updatedCompleted[sig.id]);
        if (nextIncompleteIndex !== -1) {
          setCurrentSignatureStep(nextIncompleteIndex);
        }
      }
      
    } catch (error: any) {
      console.error('Error submitting signature:', error);
      alert('Failed to submit signature. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadForm = async () => {
    if (!formData) return;
    
    try {
      const response = await fetch(`/api/generate-pdf/${formSubmissionId}/${formData.formSubmission.form.id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${formData.formSubmission.form.title}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error downloading form:', error);
      alert('Failed to download form. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Form</h3>
          <p className="text-gray-600 font-medium">Please wait...</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-sm">
          <div className="text-red-500 mb-4">
            <FaSignature className="h-16 w-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            href={`/forms/signature/${token}`}
            className="text-indigo-600 hover:text-indigo-800"
          >
            Back to Forms List
          </Link>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600">Form data not found.</p>
        </div>
      </div>
    );
  }

  // Get the appropriate form component from registry
  let FormViewComponent;
  try {
    FormViewComponent = getFormComponent(formData.formSubmission.form.formKey, 'view');
  } catch (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Form Component Not Found</h1>
          <p className="text-gray-600 mb-4">
            Unable to display this form type: {formData.formSubmission.form.formKey}
          </p>
          <Link 
            href={`/forms/signature/${token}`}
            className="text-indigo-600 hover:text-indigo-800"
          >
            Back to Forms List
          </Link>
        </div>
      </div>
    );
  }

  const requiresSignature = formData.formSubmission.form.requiresSignature;
  const allSignaturesComplete = requiredSignatures.length > 0 && requiredSignatures.every(sig => completedSignatures[sig.id]);

  // Render signature requirements overview
  const renderSignatureStatus = () => {
    if (requiredSignatures.length === 0) return null;
    
    const completedCount = requiredSignatures.filter(sig => completedSignatures[sig.id]).length;
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Signature Requirements ({completedCount}/{requiredSignatures.length})
        </h3>
        
        <div className="space-y-3">
          {requiredSignatures.map((sig, index) => {
            const isCompleted = completedSignatures[sig.id];
            
            return (
              <div key={sig.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  {isCompleted ? (
                    <FaCheck className="h-5 w-5 text-green-500 mr-3" />
                  ) : (
                    <FaSignature className="h-5 w-5 text-gray-400 mr-3" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{sig.label}</p>
                    <p className="text-sm text-gray-600">{sig.description}</p>
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isCompleted 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {isCompleted ? 'Completed' : 'Pending'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render current signature step
  const renderSignatureStep = () => {
    if (!showSignaturePad || requiredSignatures.length === 0) return null;
    
    const currentSignature = requiredSignatures[currentSignatureStep];
    if (!currentSignature) return null;
    
    // If current signature is completed, don't render (let useEffect handle step change)
    if (completedSignatures[currentSignature.id]) {
      return null;
    }
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {currentSignature.label} ({currentSignatureStep + 1} of {requiredSignatures.length})
          </h3>
          <p className="text-gray-600">
            {currentSignature.description}
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentSignatureStep + 1) / requiredSignatures.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSignatureStep + 1) / requiredSignatures.length) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
          <SignatureCanvas
            key={`signature-${currentSignature.id}-${currentSignatureStep}`} // Unique key to force re-render
            ref={(ref) => {
              if (ref && currentSignature && !signatureRefs[currentSignature.id]) {
                // Use setTimeout to avoid state update during render
                setTimeout(() => {
                  setSignatureRefs(prev => {
                    if (!prev[currentSignature.id]) {
                      return {
                        ...prev,
                        [currentSignature.id]: ref
                      };
                    }
                    return prev;
                  });
                }, 0);
              }
            }}
            width={600}
            height={200}
            className="w-full"
            placeholder={`Please sign for: ${currentSignature.label}`}
            clearButtonText="Clear Signature"
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              const prevStep = Math.max(0, currentSignatureStep - 1);
              setCurrentSignatureStep(prevStep);
            }}
            disabled={currentSignatureStep === 0}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <button
            onClick={() => submitSignature(currentSignature.id)}
            disabled={submitting}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? (
              <>
                <FaSpinner className="mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <FaCheck className="mr-2" />
                {currentSignatureStep === requiredSignatures.length - 1 ? 'Complete All Signatures' : 'Next Signature'}
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link 
                href={`/forms/signature/${token}`}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {formData.formSubmission.form.title}
                </h1>
                <p className="text-gray-600 mt-1">
                  {formData.client.name} • {formData.client.email}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Download Button */}
              <button
                onClick={handleDownloadForm}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <FaDownload className="mr-2 h-4 w-4" />
                Download PDF
              </button>

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
                      {requiredSignatures.length > 1 
                        ? `${Object.values(completedSignatures).filter(Boolean).length}/${requiredSignatures.length} Signatures`
                        : 'Signature Required'
                      }
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
          <FormViewComponent
            formSchemas={formData.formSubmission.form.schema}
            formData={formData.formSubmission.data}
            showSignature={allSignaturesComplete}
            existingSignature={formData.formSubmission.data?.signature} // Get signature from form data
            isClientView={true}
            commonFieldsData={formData.client.commonFields[0] || {}}
          />
        </div>

        {/* Signature Requirements Overview */}
        {renderSignatureStatus()}

        {/* Action Section - Only show for forms requiring signature */}
        {requiresSignature && !showSignaturePad && !allSignaturesComplete && (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Review Complete
            </h3>
            <p className="text-gray-600 mb-6">
              Please review the information above. If everything looks correct, proceed to sign the document.
              {requiredSignatures.length > 1 && (
                <span className="block mt-2 text-sm">
                  This form requires {requiredSignatures.length} signatures.
                </span>
              )}
            </p>
            <button
              onClick={handleReviewComplete}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FaSignature className="mr-2" />
              Proceed to Sign
            </button>
          </div>
        )}

        {/* Multi-Signature Pad */}
        {requiresSignature && showSignaturePad && !allSignaturesComplete && renderSignatureStep()}

        {/* View Only Message - For forms that don't require signature */}
        {!requiresSignature && (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Review Complete
            </h3>
            <p className="text-gray-600 mb-6">
              This form has been provided for your review. No signature is required.
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              All Signatures Complete
            </h3>
            <p className="text-gray-600 mb-6">
              Thank you! All required signatures have been collected for this form.
              {requiredSignatures.length > 1 && (
                <span className="block mt-2 text-sm">
                  {requiredSignatures.length} signatures were completed successfully.
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
