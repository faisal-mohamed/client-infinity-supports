"use client";

import React from 'react';
import FormPage from '@/components/ui/FormPage';

export default function BullyingHarassmentTrainingView({ data: rawData, meta: metaProp }: { data?: any; meta?: { website?: string; version?: string; reviewDate?: string } }) {
  const data = (rawData as any)?.data ? (rawData as any).data : rawData;
  const staffSignature = (rawData as any)?.staffSignature;
  const staffSignedAt = (rawData as any)?.staffSignedAt;

  const meta = metaProp || { website: 'infinitysupportswa.org', version: 'Bullying and Harassment Training 2023', reviewDate: '01/03/2025' };

  const formatDateValue = (dateString?: string | null) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-AU');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-gray-100 py-8">
      {/* Page 1 - Training Overview */}
      <FormPage meta={meta}>
        <div className="space-y-4 text-sm w-full">
          <div className="w-full">
            <div className="border border-gray-300 rounded-lg p-6 w-full">
              <div className="space-y-6">
                {/* Header Section */}
                <div>
                  <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
                    <h3 className="text-xl font-semibold">Bullying and Harassment Training 2023</h3>
                  </div>
                  <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
                    <p className="text-gray-900 mb-4">
                      This training provides staff with knowledge and understanding of bullying and harassment in the workplace, including prevention, identification, and appropriate response procedures.
                    </p>
                  </div>
                </div>

                {/* Staff Information */}
                <div>
                  <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
                    <h3 className="text-xl font-semibold">Participant Information</h3>
                  </div>
                  <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
                    <div className="space-y-3">
                      <Field label="Name" value={data.name || `${rawData.staff?.firstName || ''} ${rawData.staff?.surname || ''}`.trim()} />
                      <Field label="Position" value={data.position} />
                      <Field label="Department" value={data.department} />
                      <Field label="Training Date" value={formatDateValue(data.trainingDate)} />
                    </div>
                  </div>
                </div>

                {/* Training Modules Completed */}
                {data.modulesCompleted && Array.isArray(data.modulesCompleted) && data.modulesCompleted.length > 0 && (
                  <div>
                    <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
                      <h3 className="text-xl font-semibold">Training Modules Completed</h3>
                    </div>
                    <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
                      <ul className="list-disc list-inside space-y-2 text-gray-900">
                        {data.modulesCompleted.map((module: string, index: number) => (
                          <li key={index}>{module}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Understanding Questions */}
                {data.understandingQuestions && (
                  <div>
                    <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
                      <h3 className="text-xl font-semibold">Understanding Check</h3>
                    </div>
                    <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
                      <div className="space-y-4">
                        {Object.entries(data.understandingQuestions).map(([question, answer], index) => (
                          <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
                            <div className="font-semibold text-gray-900 mb-2">{question}</div>
                            <div className="text-gray-700 text-sm">{String(answer)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Key Learnings */}
                {data.keyLearnings && (
                  <div>
                    <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
                      <h3 className="text-xl font-semibold">Key Learnings</h3>
                    </div>
                    <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
                      <p className="text-gray-900 whitespace-pre-wrap">{data.keyLearnings}</p>
                    </div>
                  </div>
                )}

                {/* Assessment Results */}
                {data.assessmentScore && (
                  <div>
                    <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
                      <h3 className="text-xl font-semibold">Assessment Results</h3>
                    </div>
                    <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
                      <div className="space-y-3">
                        <Field label="Score" value={`${data.assessmentScore}%`} />
                        <Field label="Status" value={data.assessmentStatus} />
                        {data.assessmentDate && (
                          <Field label="Assessment Date" value={formatDateValue(data.assessmentDate)} />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Comments */}
                {data.comments && (
                  <div>
                    <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
                      <h3 className="text-xl font-semibold">Additional Comments</h3>
                    </div>
                    <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
                      <p className="text-gray-900 whitespace-pre-wrap">{data.comments}</p>
                    </div>
                  </div>
                )}

                {/* Signature Section */}
                <div>
                  <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
                    <h3 className="text-xl font-semibold">Training Acknowledgement</h3>
                  </div>
                  <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
                    <div className="space-y-4">
                      <p className="text-gray-900 text-sm">
                        I acknowledge that I have completed the Bullying and Harassment Training and understand the key concepts and procedures covered.
                      </p>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name:</label>
                        <div className="border-b-2 border-gray-400 h-8">
                          {data.name || `${rawData.staff?.firstName || ''} ${rawData.staff?.surname || ''}`.trim()}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Signature:</label>
                          <div className="border-b-2 border-gray-400 h-8">
                            {staffSignature ? (
                              <img src={staffSignature} alt="Staff Signature" className="max-w-full max-h-full" />
                            ) : (
                              <span className="text-gray-400 text-sm"></span>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Date:</label>
                          <div className="border-b-2 border-gray-400 h-8 text-center text-gray-500">
                            {formatDateValue(staffSignedAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormPage>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-medium text-gray-700 mb-1">{label}:</div>
      <div className="border border-gray-400 h-8 rounded-sm px-2 flex items-center text-gray-900 bg-white">
        {value || ''}
      </div>
    </div>
  );
}
