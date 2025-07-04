"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSignature, FaCheck, FaSpinner } from 'react-icons/fa';
import { getFormComponent } from '@/app/forms/registry';
import SignatureCanvas from 'react-signature-canvas';

// Types
interface FormSignatureData {
  formSubmission: {
    id: number;
    data: any;
    clientSignature?: string;
    clientSignedAt?: string;
    form: {
      formKey: string;
      title: string;
      schema: any;
    };
  };
  client: {
    name: string;
    email: string;
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
  const [signatureRef, setSignatureRef] = useState<SignatureCanvas | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadFormData();
  }, [token, formSubmissionId]);

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
      
      // If already signed, show signature pad
      if (data.formSubmission.clientSignature) {
        setShowSignaturePad(true);
      }
      
    } catch (error: any) {
      console.error('Error loading form data:', error);
      setError(error.message || 'Failed to load form data');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewComplete = () => {
    if (!formData?.formSubmission.clientSignature) {
      setShowSignaturePad(true);
    }
  };

  const clearSignature = () => {
    if (signatureRef) {
      signatureRef.clear();
    }
  };

  const submitSignature = async () => {
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
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit signature');
      }

      // Redirect back to signature portal
      router.push(`/forms/signature/${token}`);
      
    } catch (error: any) {
      console.error('Error submitting signature:', error);
      alert('Failed to submit signature. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
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

  const isAlreadySigned = !!formData.formSubmission.clientSignature;

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

            {isAlreadySigned && (
              <div className="flex items-center text-green-600">
                <FaCheck className="h-5 w-5 mr-2" />
                <span className="font-medium">Signed</span>
              </div>
            )}
          </div>

          {isAlreadySigned && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                You signed this form on {new Date(formData.formSubmission.clientSignedAt!).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <FormViewComponent
            formSchemas={formData.formSubmission.form.schema}
            formData={formData.formSubmission.data}
            showSignature={isAlreadySigned}
            existingSignature={formData.formSubmission.clientSignature}
            isClientView={true}
          />
        </div>

        {/* Action Section */}
        {!showSignaturePad && !isAlreadySigned && (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Review Complete
            </h3>
            <p className="text-gray-600 mb-6">
              Please review the information above. If everything looks correct, proceed to sign the document.
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

        {/* Signature Pad */}
        {showSignaturePad && !isAlreadySigned && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Your Signature
            </h3>
            <p className="text-gray-600 mb-6">
              Please sign below to confirm that you have reviewed and agree to the information in this form.
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
              <SignatureCanvas
                ref={(ref) => setSignatureRef(ref)}
                canvasProps={{
                  width: 600,
                  height: 200,
                  className: 'signature-canvas w-full',
                  style: { border: '1px solid #e5e7eb', borderRadius: '0.5rem' }
                }}
              />
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={clearSignature}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Signature
              </button>
              
              <button
                onClick={submitSignature}
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
                    Submit Signature
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
