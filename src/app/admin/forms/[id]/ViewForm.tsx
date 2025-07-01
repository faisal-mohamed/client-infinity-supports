

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormRenderer from "@/components/clients-intake-form/FormRenderer";
import Link from "next/link";
import { FaArrowLeft, FaFileAlt, FaCode, FaCalendarAlt } from "react-icons/fa";

export default function ViewFormClient({ formId }: { formId: string }) {
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/forms/${formId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch form");
        }
        const data = await response.json();

        console.log("Fetched form data:", data);
        setForm(data);
      } catch (err) {
        console.error("Error fetching form:", err);
        setError("Failed to load form. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (formId) {
      fetchForm();
    }
  }, [formId]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin mx-auto"></div>
              <p className="mt-6 text-gray-600 font-medium">Loading form...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
              <div className="flex justify-center mb-6">
                <div className="bg-red-100 rounded-full p-3">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Error</h1>
              <p className="text-red-600 mb-6 text-center">{error || "Form not found"}</p>
              <Link
                href="/admin/forms"
                className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition text-center font-medium shadow-sm"
              >
                Back to Forms
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header with navigation */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center">
            <Link
              href="/admin/forms"
              className="mr-4 flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition"
            >
              <FaArrowLeft />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
              <p className="text-sm text-gray-500 mt-1">Form preview and details</p>
            </div>
          </div>
        </div>

        {/* Form metadata card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-lg mr-3">
                <FaCode className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Form Key</p>
                <p className="font-medium text-gray-900">{form.formKey}</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-lg mr-3">
                <FaFileAlt className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Version</p>
                <p className="font-medium text-gray-900">{form.version}</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-amber-100 p-3 rounded-lg mr-3">
                <FaCalendarAlt className="text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium text-gray-900">
                  {new Date(form.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form preview */}
        <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-100">Form Preview</h2>

          <div className="form-preview-container max-w-4xl mx-auto">
            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
              {form.formKey === "client_intake_form" ? (
                <FormRenderer formKey={form.formKey} formSchema={form.schema} />
              ) : (
                <div className="text-center py-10">
                  <div className="bg-gray-100 rounded-full p-4 inline-block mb-4">
                    <FaFileAlt className="text-gray-400 text-2xl" />
                  </div>
                  <p className="text-gray-500 font-medium">
                    Preview not available for this form type
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Only client intake forms can be previewed
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}