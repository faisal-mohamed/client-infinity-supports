"use client";

import { FaFileAlt, FaPlus } from 'react-icons/fa';
import FormItem from './FormItem';
import { FormAssignmentWithDetails } from '@/app/admin/clients/[id]/forms/types';

interface FormsListProps {
  assignments: FormAssignmentWithDetails[];
  selectedForms: number[];
  downloadingPDF: number | null;
  clientId: number;
  onFormSelect: (assignmentId: number, checked: boolean) => void;
  onDownloadPDF: (assignment: FormAssignmentWithDetails) => void;
  onShowAssignModal: () => void;
}

export default function FormsList({
  assignments,
  selectedForms,
  downloadingPDF,
  clientId,
  onFormSelect,
  onDownloadPDF,
  onShowAssignModal
}: FormsListProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-visible">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Assigned Forms</h2>
            {assignments.length > 0 && (
              <div className="text-sm text-gray-600">
                {selectedForms.length > 0 ? (
                  <p className="font-medium text-indigo-600">{selectedForms.length} selected for link generation</p>
                ) : (
                  <div className="text-center sm:text-right">
                    <p>{assignments.length} total forms</p>
                    <p className="text-xs text-gray-500 mt-1 hidden sm:block">Select admin-filled forms to generate client links</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {assignments.length === 0 ? (
          <div className="text-center py-12 px-4">
            <FaFileAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Forms Assigned</h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">Get started by assigning some forms to this client.</p>
            <button
              onClick={onShowAssignModal}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FaPlus className="mr-2 h-4 w-4" />
              Assign Forms
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {assignments.map((assignment) => (
              <FormItem
                key={assignment.id}
                assignment={assignment}
                clientId={clientId}
                selectedForms={selectedForms}
                downloadingPDF={downloadingPDF}
                onFormSelect={onFormSelect}
                onDownloadPDF={onDownloadPDF}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
