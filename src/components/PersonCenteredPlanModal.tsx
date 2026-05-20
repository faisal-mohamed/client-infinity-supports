"use client";

import React from 'react';

interface PersonCenteredPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  commonFieldsData: any;
  onDownload: () => void;
  downloading: boolean;
}

const PersonCenteredPlanModal: React.FC<PersonCenteredPlanModalProps> = ({
  isOpen,
  onClose,
  formData,
  commonFieldsData,
  onDownload,
  downloading
}) => {
  console.log('🔍 PersonCenteredPlanModal rendered:', { isOpen, formData, commonFieldsData });
  
  if (!isOpen) return null;

  // Helper to get field value
  const getValue = (key: string) => {
    return formData?.[key] || commonFieldsData?.[key] || '';
  };

  // Get all goals (dynamically check up to 20 goals)
  const goals = [];
  for (let i = 1; i <= 20; i++) {
    const goal = getValue(`goal${i}`);
    const rating = getValue(`rating${i}`);
    const actions = getValue(`actions${i}`);
    const byWhom = getValue(`byWhom${i}`);
    const byWhen = getValue(`byWhen${i}`);
    const reviewDate = getValue(`reviewDate${i}`);
    
    if (goal || rating || actions || byWhom || byWhen || reviewDate) {
      goals.push({
        number: i,
        goal,
        rating,
        actions,
        byWhom,
        byWhen,
        reviewDate
      });
    }
  }

  // Get informal supports
  const informalSupports = [];
  for (let i = 1; i <= 4; i++) {
    const support = getValue(`support${i}`);
    const role = getValue(`role${i}`);
    const frequency = getValue(`frequency${i}`);
    
    if (support || role || frequency) {
      informalSupports.push({
        number: i,
        support,
        role,
        frequency
      });
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-azure-500 to-azure-600 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Person Centered Plan Details</h2>
            <p className="text-azure-200 text-sm">Goals, Support Information & Informal Supports</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-azure-200 transition-colors p-2 hover:bg-white hover:bg-opacity-10 rounded-lg"
            title="Close"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Goals Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-azure-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-azure-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-azure-700">Goals & Outcomes</h3>
            </div>
            
            {goals.length > 0 ? (
              <div className="space-y-6">
                {goals.map((goal) => (
                  <div key={goal.number} className="bg-white border border-azure-100 rounded-lg p-6 shadow-sm">
                    {/* Goal Header */}
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-lg font-semibold text-azure-700">Goal {goal.number}</h4>
                      {goal.rating && (
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          goal.rating.toLowerCase().includes('completely achieved') 
                            ? 'bg-green-100 text-green-700 border border-green-300' 
                            : goal.rating.toLowerCase().includes('new') 
                            ? 'bg-azure-100 text-azure-700 border border-azure-200'
                            : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                        }`}>
                          {goal.rating}
                        </span>
                      )}
                    </div>
                    
                    {/* Horizontal Line */}
                    <div className="border-t border-azure-100 mb-4"></div>
                    
                    {/* Goal Description */}
                    {goal.goal && (
                      <div className="mb-4">
                        <p className="text-azure-600 leading-relaxed whitespace-pre-wrap">{goal.goal}</p>
                      </div>
                    )}
                    
                    {/* Actions & Resources */}
                    {goal.actions && (
                      <div className="mb-4">
                        <p className="text-azure-600 leading-relaxed whitespace-pre-wrap">{goal.actions}</p>
                      </div>
                    )}
                    
                    {/* Metadata Row */}
                    <div className="flex justify-between items-center text-sm text-azure-500 mt-4 pt-2 border-t border-azure-50">
                      {goal.byWhom && (
                        <span><strong>By Whom:</strong> {goal.byWhom}</span>
                      )}
                      {goal.byWhen && (
                        <span><strong>By When:</strong> {goal.byWhen}</span>
                      )}
                      {goal.reviewDate && (
                        <span><strong>Review Date:</strong> {goal.reviewDate}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-azure-50 rounded-xl p-6 text-center">
                <p className="text-azure-400">No goals have been set yet.</p>
              </div>
            )}
          </div>

          {/* Support Information Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-azure-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-azure-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-azure-700">Support Information</h3>
            </div>
            
            <div className="bg-white border border-azure-100 rounded-lg overflow-hidden">
              <div className="space-y-0">
                {getValue('restrictivePractices') && (
                  <div className="flex justify-between items-center p-4 border-b border-azure-100">
                    <span className="font-semibold text-azure-700">Any Restrictive Practices?</span>
                    <span className="text-azure-600">{getValue('restrictivePractices')}</span>
                  </div>
                )}
                {getValue('organizationName') && (
                  <div className="flex justify-between items-center p-4 border-b border-azure-100">
                    <span className="font-semibold text-azure-700">Name of organization</span>
                    <span className="text-azure-600">{getValue('organizationName')}</span>
                  </div>
                )}
                {getValue('contactPersonOrg') && (
                  <div className="flex justify-between items-center p-4 border-b border-azure-100">
                    <span className="font-semibold text-azure-700">Contact person</span>
                    <span className="text-azure-600">{getValue('contactPersonOrg')}</span>
                  </div>
                )}
                {getValue('contactNumberOrg') && (
                  <div className="flex justify-between items-center p-4">
                    <span className="font-semibold text-azure-700">Contact number</span>
                    <span className="text-azure-600">{getValue('contactNumberOrg')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Informal Supports Section */}
          <div className="mb-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-azure-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-azure-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-azure-700">6. Informal Supports</h3>
            </div>
            
            {informalSupports.length > 0 ? (
              <div className="bg-white border border-azure-100 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-azure-500 text-white">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Informal Support</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Frequency</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-azure-100">
                      {informalSupports.map((support, index) => (
                        <tr key={support.number}>
                          <td className="px-6 py-4 text-sm text-azure-700">{support.support}</td>
                          <td className="px-6 py-4 text-sm text-azure-600">{support.role}</td>
                          <td className="px-6 py-4 text-sm text-azure-600">{support.frequency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-azure-50 rounded-xl p-6 text-center">
                <p className="text-azure-400">No informal supports have been added yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-azure-50 px-8 py-6 flex items-center justify-between border-t border-azure-100">
          <p className="text-sm text-azure-500">
            Review the details above before downloading
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white border-2 border-azure-200 text-azure-600 font-medium rounded-lg hover:bg-azure-50 hover:border-azure-300 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onDownload();
                onClose();
              }}
              disabled={downloading}
              className="px-6 py-2.5 bg-gradient-to-r from-azure-500 to-azure-600 text-white font-medium rounded-lg hover:from-azure-600 hover:to-azure-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-azure-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center"
            >
              {downloading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonCenteredPlanModal;

