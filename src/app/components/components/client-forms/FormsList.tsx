"use client";

import { FaFileAlt, FaPlus, FaClipboardList, FaCheckCircle } from 'react-icons/fa';
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
  const completedForms = assignments.filter(a => a.currentStatus === 'completed').length;
  const inProgressForms = assignments.filter(a => a.currentStatus === 'in_progress').length;
  const notStartedForms = assignments.filter(a => a.currentStatus === 'not_started').length;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          {/* Enhanced Header */}
          <div className="px-6 sm:px-8 py-6 bg-gradient-to-r from-gray-50 via-blue-50 to-gray-50 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                  <FaClipboardList className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Assigned Forms</h2>
                  <p className="text-gray-600">Manage and track client form assignments</p>
                </div>
              </div>
              
              {assignments.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Selection Status */}
                  {selectedForms.length > 0 ? (
                    <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl p-4 shadow-md">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-500 text-white shadow-md">
                          <FaCheckCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-indigo-700">
                            {selectedForms.length} Selected
                          </div>
                          <div className="text-sm font-medium text-indigo-600">Ready for link generation</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 shadow-md">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 mb-1">
                          {assignments.length} Total Forms
                        </div>
                        <div className="text-sm text-gray-600">
                          Select admin-filled forms to generate client links
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Enhanced Stats Row */}
            {/* {assignments.length > 0 && (
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">{completedForms}</div>
                    <div className="text-sm font-medium text-green-600">Completed</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-700">{inProgressForms}</div>
                    <div className="text-sm font-medium text-amber-600">In Progress</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-700">{notStartedForms}</div>
                    <div className="text-sm font-medium text-gray-600">Not Started</div>
                  </div>
                </div>
              </div>
            )} */}
          </div>

          {assignments.length === 0 ? (
            /* Enhanced Empty State */
            <div className="text-center py-16 px-6">
              <div className="p-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                <FaFileAlt className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Forms Assigned</h3>
              <p className="text-gray-600 mb-8 text-base max-w-md mx-auto leading-relaxed">
                Get started by assigning some forms to this client. Once assigned, you can track their progress and manage submissions.
              </p>
              <button
                onClick={onShowAssignModal}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <div className="p-1 rounded-lg bg-white bg-opacity-20">
                  <FaPlus className="h-4 w-4" />
                </div>
                <span>Assign Forms</span>
              </button>
            </div>
          ) : (
            /* Enhanced Forms List */
            <div className="divide-y divide-gray-100">
              {assignments.map((assignment, index) => (
                <div
                  key={assignment.id}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  <FormItem
                    assignment={assignment}
                    clientId={clientId}
                    selectedForms={selectedForms}
                    downloadingPDF={downloadingPDF}
                    onFormSelect={onFormSelect}
                    onDownloadPDF={onDownloadPDF}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Help Section */}
        {/* {assignments.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-500 text-white shadow-md flex-shrink-0">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-blue-800 mb-3">Form Management Guide</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                    <div>
                      <h5 className="font-semibold mb-2">Form Actions:</h5>
                      <ul className="space-y-1">
                        <li>• <strong>Edit:</strong> Modify form content and data</li>
                        <li>• <strong>View:</strong> Review completed form submissions</li>
                        <li>• <strong>Download:</strong> Generate PDF copies</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">Status Meanings:</h5>
                      <ul className="space-y-1">
                        <li>• <strong>Completed:</strong> All signatures collected</li>
                        <li>• <strong>In Progress:</strong> Partially filled or awaiting signatures</li>
                        <li>• <strong>Not Started:</strong> Assigned but not yet filled</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )} */}
      </div>

      {/* Enhanced Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </div>
  );
}
