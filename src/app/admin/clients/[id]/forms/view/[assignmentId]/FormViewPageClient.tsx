"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaEdit, FaSignature } from 'react-icons/fa';
import { useToast } from '@/components/ui/Toast';
import { getFormComponent } from '@/app/forms/registry';

// Types
interface FormAssignmentData {
  id: number;
  clientId: number;
  formId: number;
  formVersion: number;
  form: {
    formKey: string;
    title: string;
    schema: any;
  };
  client: {
    name: string;
    email: string;
  };
  submissionData?: any; // FormSubmission data
  clientSignature?: string;
  clientSignedAt?: string;
}

export default function FormViewPageClient() {
  const params = useParams();
  const { showToast } = useToast();
  
  const clientId = parseInt(params.id as string);
  const assignmentId = parseInt(params.assignmentId as string);
  
  const [assignment, setAssignment] = useState<FormAssignmentData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load assignment and submission data
  useEffect(() => {
    loadAssignmentData();
  }, [assignmentId]);

  const loadAssignmentData = async () => {
    try {
      setLoading(true);
      
      // Get assignment details and submission data
      const response = await fetch(`/api/form-assignments/${assignmentId}`);
      if (!response.ok) throw new Error('Failed to load assignment data');
      
      const data = await response.json();
      setAssignment(data.assignment);
      
    } catch (error) {
      console.error('Error loading assignment data:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load form data',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!assignment || !assignment.submissionData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {!assignment ? 'Form Not Found' : 'Form Not Filled Yet'}
          </h1>
          <p className="text-gray-600 mb-4">
            {!assignment 
              ? 'The requested form assignment could not be found.'
              : 'This form has not been filled by admin yet.'
            }
          </p>
          <div className="space-x-4">
            <Link 
              href={`/admin/clients/${clientId}/forms`}
              className="text-indigo-600 hover:text-indigo-800"
            >
              Back to Forms List
            </Link>
            {assignment && (
              <Link 
                href={`/admin/clients/${clientId}/forms/edit/${assignmentId}`}
                className="text-green-600 hover:text-green-800"
              >
                Fill This Form
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Get the appropriate form component from registry
  let FormViewComponent;
  try {
    FormViewComponent = getFormComponent(assignment.form.formKey, 'view');
  } catch (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Form Component Not Found</h1>
          <p className="text-gray-600 mb-4">
            No view component found for form: {assignment.form.formKey}
          </p>
          <Link 
            href={`/admin/clients/${clientId}/forms`}
            className="text-indigo-600 hover:text-indigo-800"
          >
            Back to Forms List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Minimal Header Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link 
                href={`/admin/clients/${clientId}/forms`}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors mr-4"
              >
                <FaArrowLeft className="h-4 w-4 mr-2" />
                Back to Forms
              </Link>
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-xl font-semibold text-gray-900">
                  {assignment.form.title}
                </h1>
                <p className="text-sm text-gray-600">
                  {assignment.client.name} • {assignment.client.email}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {assignment.clientSignature && (
                <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <FaSignature className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Client Signed</span>
                </div>
              )}
              <Link
                href={`/admin/clients/${clientId}/forms/edit/${assignmentId}`}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FaEdit className="mr-2 h-4 w-4" />
                Edit Form
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Form Content */}
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow-sm rounded-lg">
          <FormViewComponent
            formSchemas={assignment.form.schema}
            formData={assignment.submissionData}
            showSignature={!!assignment.clientSignature}
            existingSignature={assignment.clientSignature}
            isAdminView={true}
          />
        </div>
      </div>
    </>
  );
}
