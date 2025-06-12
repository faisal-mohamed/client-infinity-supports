"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getFormSchemaById } from '@/lib/api';
import ClientIntakeForm from '@/app/ClientIntakeFormView/page';
import { FaArrowLeft, FaDownload, FaPrint } from 'react-icons/fa';

export default function FormViewPage({ 
  clientId, 
  formSubmission 
}: { 
  clientId: number, 
  formSubmission: any 
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formSchema, setFormSchema] = useState<any>(null);

  useEffect(() => {
    const loadFormSchema = async () => {
      try {
        setLoading(true);
        // Get the form schema based on the form ID from the submission

        console.log("FORMSUBMISSION: ", formSubmission);
        const schema = await getFormSchemaById(formSubmission.formId);
        setFormSchema(schema);
      } catch (err: any) {
        console.error("Error loading form schema:", err);
        setError(err.message || 'Failed to load form schema');
      } finally {
        setLoading(false);
      }
    };

    loadFormSchema();
  }, [formSubmission.formId]);

  // const handlePrint = () => {
  //   window.print();
  // };

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/generate-pdf/${formSubmission.id}/${formSubmission.formId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `form-${formSubmission.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-2xl mx-auto my-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading form</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="mr-2" /> Back to Forms
        </button>
        
        <div className="flex space-x-4">
          {/* <button
            onClick={handlePrint}
            className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md"
          >
            <FaPrint className="mr-2" /> Print
          </button> */}
          
          <button
            onClick={handleDownload}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
          >
            <FaDownload className="mr-2" /> Download PDF
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h1 className="text-xl font-bold text-gray-900">{formSubmission.form.title}</h1>
          <p className="text-sm text-gray-500">
            Submitted on {new Date(formSubmission.createdAt).toLocaleDateString()} by {formSubmission.client.name}
          </p>
        </div>
        
        <div className="p-6">
         {  formSubmission.form.formKey == "client_intake_form" ?  <ClientIntakeForm formSchemas={formSchema} formData={formSubmission.data} /> : <></>}
        </div>
      </div>
    </div>
  );
}
