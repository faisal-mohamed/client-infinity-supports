"use client";

import React from 'react';
import FormPage from '@/components/ui/FormPage';

export default function NdisWorkforceCapabilityView({ data: rawData, meta: metaProp }: { data?: any; meta?: { website?: string; version?: string; reviewDate?: string } }) {
  const data = (rawData as any)?.data ? (rawData as any).data : rawData;
  const staffSignature = (rawData as any)?.staffSignature;
  const staffSignedAt = (rawData as any)?.staffSignedAt;

  const meta = metaProp || { website: 'infinitysupportswa.org', version: 'NDIS Workforce Capability Framework', reviewDate: '01/03/2025' };

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
      {/* Page 1 - Framework Overview */}
      <FormPage meta={meta}>
        <div className="space-y-4 text-sm w-full">
          <div className="w-full">
            <div className="border border-gray-300 rounded-lg p-6 w-full">
              <div className="space-y-6">
                {/* Header Section */}
                <div>
                  <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
                    <h3 className="text-xl font-semibold">NDIS Workforce Capability Framework</h3>
                  </div>
                  <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
                    <p className="text-gray-900 mb-4">
                      This form documents the NDIS Workforce Capability Framework understanding and compliance for staff members.
                    </p>
                  </div>
                </div>

                {/* Staff Information */}
                <div>
                  <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
                    <h3 className="text-xl font-semibold">Staff Information</h3>
                  </div>
                  <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
                    <div className="space-y-3">
                      <Field label="Name" value={data.name || `${rawData.staff?.firstName || ''} ${rawData.staff?.surname || ''}`.trim()} />
                      <Field label="Position" value={data.position} />
                      <Field label="Date" value={formatDateValue(data.date)} />
                    </div>
                  </div>
                </div>

                {/* Framework Understanding */}
                {data.frameworkUnderstanding && (
                  <div>
                    <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
                      <h3 className="text-xl font-semibold">Framework Understanding</h3>
                    </div>
                    <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
                      <p className="text-gray-900 whitespace-pre-wrap">{data.frameworkUnderstanding}</p>
                    </div>
                  </div>
                )}

                {/* Competency Areas */}
                {data.competencyAreas && Array.isArray(data.competencyAreas) && data.competencyAreas.length > 0 && (
                  <div>
                    <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
                      <h3 className="text-xl font-semibold">Competency Areas</h3>
                    </div>
                    <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
                      <div className="space-y-3">
                        {data.competencyAreas.map((area: any, index: number) => (
                          <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
                            <div className="font-semibold text-gray-900 mb-2">{area.area || `Area ${index + 1}`}</div>
                            <div className="text-gray-700 text-sm">{area.description || ''}</div>
                            {area.status && (
                              <div className="mt-2">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                  area.status === 'Competent' ? 'bg-green-100 text-green-800' :
                                  area.status === 'Developing' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {area.status}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Training Completed */}
                {data.trainingCompleted && (
                  <div>
                    <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
                      <h3 className="text-xl font-semibold">Training Completed</h3>
                    </div>
                    <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
                      <p className="text-gray-900 whitespace-pre-wrap">{data.trainingCompleted}</p>
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
                    <h3 className="text-xl font-semibold">Staff Acknowledgement</h3>
                  </div>
                  <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
                    <div className="space-y-4">
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
