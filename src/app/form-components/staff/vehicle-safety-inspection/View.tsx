"use client";

import React from 'react';
import FormPage from '@/components/ui/FormPage';

export default function VehicleSafetyInspectionView({ excludeLastPage = false, children, data = {} }: { excludeLastPage?: boolean; children?: React.ReactNode; data?: any }) {
  return (
    <div className="bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Page 1 - Driver Information and Initial Inspection */}
        <FormPage 
          title="Vehicle Safety Inspection Checklist"
          meta={{
            website: 'infinitysupportswa.org',
            version: 'VEH-SAFETY-001',
            reviewDate: '01/01/2025'
          }}
        >

          {/* Driver Information Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Driver Information</h2>
            <div className="border border-gray-300">
              <div className="grid grid-cols-2">
                {/* Left Column - Labels */}
                <div className="bg-gray-100 border-r border-gray-300">
                  <div className="p-3 border-b border-gray-300 font-semibold text-gray-800">Driver</div>
                  <div className="p-3 border-b border-gray-300 font-semibold text-gray-800">Licence number</div>
                  <div className="p-3 border-b border-gray-300 font-semibold text-gray-800">Plant ID No</div>
                  <div className="p-3 border-b border-gray-300 font-semibold text-gray-800">Vehicle registration</div>
                  <div className="p-3 border-b border-gray-300 font-semibold text-gray-800">Insurance policy</div>
                  <div className="p-3 font-semibold text-gray-800">Date of inspection</div>
                </div>
                {/* Right Column - Input Fields */}
                <div>
                  <div className="p-3 border-b border-gray-300">
                    <div className="w-full h-8 border border-gray-300 bg-white"></div>
                  </div>
                  <div className="p-3 border-b border-gray-300">
                    <div className="w-full h-8 border border-gray-300 bg-white"></div>
                  </div>
                  <div className="p-3 border-b border-gray-300">
                    <div className="w-full h-8 border border-gray-300 bg-white"></div>
                  </div>
                  <div className="p-3 border-b border-gray-300">
                    <div className="w-full h-8 border border-gray-300 bg-white"></div>
                  </div>
                  <div className="p-3 border-b border-gray-300">
                    <div className="w-full h-8 border border-gray-300 bg-white"></div>
                  </div>
                  <div className="p-3">
                    <div className="w-full h-8 border border-gray-300 bg-white"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inspection Checklist Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Vehicle Safety Inspection Checklist</h2>
            <div className="border border-gray-300">
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 bg-gray-100 border-r border-gray-300 font-semibold text-gray-800">Item</div>
                <div className="p-3 bg-gray-100 border-r border-gray-300 font-semibold text-gray-800 text-center">Yes</div>
                <div className="p-3 bg-gray-100 border-r border-gray-300 font-semibold text-gray-800 text-center">No</div>
                <div className="p-3 bg-gray-100 font-semibold text-gray-800">Action To Be Taken</div>
              </div>

              {/* Lights Section */}
              <div className="border-b border-gray-300">
                <div className="bg-gray-100 p-3 border-b border-gray-300">
                  <h4 className="font-semibold text-gray-800">Lights</h4>
                  <p className="text-sm text-gray-600 mt-1">Check operation and visibility of:</p>
                </div>
                <div className="grid grid-cols-4 border-b border-gray-300">
                  <div className="p-3 border-r border-gray-300">Headlights</div>
                  <div className="p-3 border-r border-gray-300 text-center">
                    <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                  </div>
                  <div className="p-3 border-r border-gray-300 text-center">
                    <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                  </div>
                  <div className="p-3">
                    <div className="w-full h-8 border border-gray-300 bg-white"></div>
                  </div>
                </div>
                <div className="grid grid-cols-4">
                  <div className="p-3 border-r border-gray-300">Parking lights</div>
                  <div className="p-3 border-r border-gray-300 text-center">
                    <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                  </div>
                  <div className="p-3 border-r border-gray-300 text-center">
                    <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                  </div>
                  <div className="p-3">
                    <div className="w-full h-8 border border-gray-300 bg-white"></div>
                  </div>
                </div>
              </div>

              {/* Indicators/Blinker Section */}
              <div className="border-b border-gray-300">
                <div className="bg-gray-100 p-3 border-b border-gray-300">
                  <h4 className="font-semibold text-gray-800">Indicators/blinker</h4>
                </div>
                <div className="grid grid-cols-4 border-b border-gray-300">
                  <div className="p-3 border-r border-gray-300">Hazard lights</div>
                  <div className="p-3 border-r border-gray-300 text-center">
                    <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                  </div>
                  <div className="p-3 border-r border-gray-300 text-center">
                    <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                  </div>
                  <div className="p-3">
                    <div className="w-full h-8 border border-gray-300 bg-white"></div>
                  </div>
                </div>
                <div className="grid grid-cols-4 border-b border-gray-300">
                  <div className="p-3 border-r border-gray-300">Brake lights</div>
                  <div className="p-3 border-r border-gray-300 text-center">
                    <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                  </div>
                  <div className="p-3 border-r border-gray-300 text-center">
                    <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                  </div>
                  <div className="p-3">
                    <div className="w-full h-8 border border-gray-300 bg-white"></div>
                  </div>
                </div>
                <div className="grid grid-cols-4 border-b border-gray-300">
                  <div className="p-3 border-r border-gray-300">Reverse lights</div>
                  <div className="p-3 border-r border-gray-300 text-center">
                    <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                  </div>
                  <div className="p-3 border-r border-gray-300 text-center">
                    <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                  </div>
                  <div className="p-3">
                    <div className="w-full h-8 border border-gray-300 bg-white"></div>
                  </div>
                </div>
                <div className="bg-gray-50 p-2 border-b border-gray-300">
                  <p className="text-sm font-medium text-gray-700">If trailer attached:</p>
                </div>
                <div className="grid grid-cols-4">
                  <div className="p-3 border-r border-gray-300 pl-6">Parking lights</div>
                  <div className="p-3 border-r border-gray-300 text-center">
                    <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                  </div>
                  <div className="p-3 border-r border-gray-300 text-center">
                    <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                  </div>
                  <div className="p-3">
                    <div className="w-full h-8 border border-gray-300 bg-white"></div>
                  </div>
                </div>
              </div>

              {/* Brakes and Warnings Section */}
              <div className="border-b border-gray-300">
                <div className="bg-gray-100 p-3 border-b border-gray-300">
                  <h4 className="font-semibold text-gray-800">Brakes and Warnings</h4>
                </div>
                <div className="grid grid-cols-4 border-b border-gray-300">
                  <div className="p-3 border-r border-gray-300">Check operation of handbrake</div>
                  <div className="p-3 border-r border-gray-300 text-center">
                    <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                  </div>
                  <div className="p-3 border-r border-gray-300 text-center">
                    <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                  </div>
                  <div className="p-3">
                    <div className="w-full h-8 border border-gray-300 bg-white"></div>
                  </div>
                </div>
                <div className="grid grid-cols-4 border-b border-gray-300">
                  <div className="p-3 border-r border-gray-300">Check for firm brake pedal</div>
                  <div className="p-3 border-r border-gray-300 text-center">
                    <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                  </div>
                  <div className="p-3 border-r border-gray-300 text-center">
                    <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                  </div>
                  <div className="p-3">
                    <div className="w-full h-8 border border-gray-300 bg-white"></div>
                  </div>
                </div>
                <div className="grid grid-cols-4">
                  <div className="p-3 border-r border-gray-300">Check operation of horn</div>
                  <div className="p-3 border-r border-gray-300 text-center">
                    <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                  </div>
                  <div className="p-3 border-r border-gray-300 text-center">
                    <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                  </div>
                  <div className="p-3">
                    <div className="w-full h-8 border border-gray-300 bg-white"></div>
                  </div>
                </div>
              </div>

              {/* Interior Section */}
              <div>
                <div className="bg-gray-100 p-3 border-b border-gray-300">
                  <h4 className="font-semibold text-gray-800">Interior</h4>
                </div>
                <div className="grid grid-cols-4">
                  <div className="p-3 border-r border-gray-300">'No Smoking' signs displayed prominently</div>
                  <div className="p-3 border-r border-gray-300 text-center">
                    <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                  </div>
                  <div className="p-3 border-r border-gray-300 text-center">
                    <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                  </div>
                  <div className="p-3">
                    <div className="w-full h-8 border border-gray-300 bg-white"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FormPage>

        {/* Page 2 - Additional Inspection Items */}
        <FormPage 
          title="Vehicle Safety Inspection Checklist"
          meta={{
            website: 'infinitysupportswa.org',
            version: 'VEH-SAFETY-001',
            reviewDate: '01/01/2025'
          }}
        >
          {/* Additional Inspection Checklist Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Vehicle Safety Inspection Checklist (Continued)</h2>
            <div className="border border-gray-300">
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 bg-gray-100 border-r border-gray-300 font-semibold text-gray-800">Item</div>
                <div className="p-3 bg-gray-100 border-r border-gray-300 font-semibold text-gray-800 text-center">Yes</div>
                <div className="p-3 bg-gray-100 border-r border-gray-300 font-semibold text-gray-800 text-center">No</div>
                <div className="p-3 bg-gray-100 font-semibold text-gray-800">Action To Be Taken</div>
              </div>

              {/* General Vehicle Interior/Safety Section */}
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Internal cleanliness maintained, including upholstery</div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Cargo barrier in place, where appropriate</div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Safety belts in good order</div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>

              {/* Exterior Section */}
              <div className="bg-gray-100 p-3 border-b border-gray-300">
                <h4 className="font-semibold text-gray-800">Exterior</h4>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Any damage to body work noted</div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Windscreen in good order and clean</div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Windscreen wipers and washers operating</div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Water in windscreen washer reservoir</div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Tyre tread checked for wear</div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Treads matching for front and rear tyres</div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Tyre pressure checked</div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>

              {/* General Safety Section */}
              <div className="bg-gray-100 p-3 border-b border-gray-300">
                <h4 className="font-semibold text-gray-800">General Safety</h4>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">System in place for reporting problems</div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Servicing as required</div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>

              {/* First Aid Kit, Sunscreen, Insect Repellent Section */}
              <div className="bg-gray-100 p-3 border-b border-gray-300">
                <h4 className="font-semibold text-gray-800">First Aid Kit, Sunscreen, Insect Repellent</h4>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Contents assessed in compliance with first aid requirements</div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Container and contents clean and orderly</div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">System in place to replenish kit items</div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Expiry dates checked</div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Out of date items disposed of</div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>

              {/* Transportation of Clients Section */}
              <div className="bg-gray-100 p-3 border-b border-gray-300">
                <h4 className="font-semibold text-gray-800">Transportation of Clients</h4>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Wheelchair hoist fitted, if required</div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Appropriate for the transport of clients</div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-4">
                <div className="p-3 border-r border-gray-300">Facility to secure clients appropriately</div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>
            </div>
          </div>
        </FormPage>

        {/* Page 3 - Client Behavior Assessment and Review */}
        <FormPage 
          title="Vehicle Safety Inspection Checklist"
          meta={{
            website: 'infinitysupportswa.org',
            version: 'VEH-SAFETY-001',
            reviewDate: '01/01/2025'
          }}
        >
          {/* Client Behavior Assessment Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Client Behavior Assessment</h2>
            <div className="border border-gray-300">
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 bg-gray-100 border-r border-gray-300 font-semibold text-gray-800">Item</div>
                <div className="p-3 bg-gray-100 border-r border-gray-300 font-semibold text-gray-800 text-center">Yes</div>
                <div className="p-3 bg-gray-100 border-r border-gray-300 font-semibold text-gray-800 text-center">No</div>
                <div className="p-3 bg-gray-100 font-semibold text-gray-800">Action To Be Taken</div>
              </div>

              {/* Client Behavior Item */}
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Client behaviour while travelling in a vehicle is known</div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>

              {/* Other Issues Section */}
              <div className="bg-gray-100 p-3 border-b border-gray-300">
                <h4 className="font-semibold text-gray-800">Other Issues</h4>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-4">
                <div className="p-3 border-r border-gray-300">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3 border-r border-gray-300 text-center">
                  <div className="w-4 h-4 border border-gray-400 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Submission and Review Section */}
          <div className="space-y-6">
            {/* Return Form Section */}
            <div>
              <p className="text-gray-800 mb-2">Return completed form to:</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 border-b border-gray-400 border-dotted h-6"></div>
                <span className="text-gray-800">Position</span>
              </div>
            </div>

            {/* Review Section */}
            <div className="border border-gray-300">
              <div className="grid grid-cols-2 border-b border-gray-300">
                <div className="p-3 bg-gray-100 border-r border-gray-300 font-semibold text-gray-800">Reviewed by [name]:</div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-gray-300">
                <div className="p-3 bg-gray-100 border-r border-gray-300 font-semibold text-gray-800">Position:</div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="p-3 bg-gray-100 border-r border-gray-300 font-semibold text-gray-800">Date:</div>
                <div className="p-3">
                  <div className="w-full h-8 border border-gray-300 bg-white"></div>
                </div>
              </div>
            </div>

            {/* Next Inspection Date */}
            <div className="flex items-center gap-2">
              <span className="text-gray-800">Date for next inspection:</span>
              <div className="flex-1 border-b border-gray-400 border-dotted h-6"></div>
            </div>
          </div>
        </FormPage>

        {children}
      </div>
    </div>
  );
}
