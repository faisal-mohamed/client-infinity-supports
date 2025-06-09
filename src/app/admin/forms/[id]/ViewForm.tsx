"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormRenderer from "@/components/clients-intake-form/FormRenderer";
import Link from "next/link";

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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading form...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Error</h1>
            <p className="text-red-600 mb-4">{error || "Form not found"}</p>
            <Link
              href="/admin/forms"
              className="block w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 text-center"
            >
              Back to Forms
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/admin/forms"
        className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-800"
      >
        <span>← Back to Forms</span>
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold">{form.title}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Form Key: {form.formKey}
            </span>
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
              Version: {form.version}
            </span>
            <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
              Created: {new Date(form.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        {form.formKey === "client_intake_form" ? 
    <FormRenderer formKey={form.formKey} formSchema={form.schema} /> : null }
      </div>
    </div>
  );
}
