"use client";

import React, { useState, useEffect, useRef } from 'react';
import FormPage from '@/components/ui/FormPage';

interface VehicleSafetyInspectionFormData {
  // Driver Information
  driver: string;
  licenceNumber: string;
  plantIdNo: string;
  vehicleRegistration: string;
  insurancePolicy: string;
  dateOfInspection: string;

  // Lights Section
  headlights: 'yes' | 'no' | '';
  headlightsAction: string;
  parkingLights: 'yes' | 'no' | '';
  parkingLightsAction: string;

  // Indicators/Blinker Section
  hazardLights: 'yes' | 'no' | '';
  hazardLightsAction: string;
  brakeLights: 'yes' | 'no' | '';
  brakeLightsAction: string;
  reverseLights: 'yes' | 'no' | '';
  reverseLightsAction: string;
  trailerParkingLights: 'yes' | 'no' | '';
  trailerParkingLightsAction: string;

  // Brakes and Warnings Section
  handbrake: 'yes' | 'no' | '';
  handbrakeAction: string;
  brakePedal: 'yes' | 'no' | '';
  brakePedalAction: string;
  horn: 'yes' | 'no' | '';
  hornAction: string;

  // Interior Section
  noSmokingSigns: 'yes' | 'no' | '';
  noSmokingSignsAction: string;

  // Additional Inspection Items
  internalCleanliness: 'yes' | 'no' | '';
  internalCleanlinessAction: string;
  cargoBarrier: 'yes' | 'no' | '';
  cargoBarrierAction: string;
  safetyBelts: 'yes' | 'no' | '';
  safetyBeltsAction: string;

  // Exterior Section
  bodyDamage: 'yes' | 'no' | '';
  bodyDamageAction: string;
  windscreen: 'yes' | 'no' | '';
  windscreenAction: string;
  wipersWashers: 'yes' | 'no' | '';
  wipersWashersAction: string;
  washerReservoir: 'yes' | 'no' | '';
  washerReservoirAction: string;
  tyreTread: 'yes' | 'no' | '';
  tyreTreadAction: string;
  treadMatching: 'yes' | 'no' | '';
  treadMatchingAction: string;
  tyrePressure: 'yes' | 'no' | '';
  tyrePressureAction: string;

  // General Safety Section
  reportingSystem: 'yes' | 'no' | '';
  reportingSystemAction: string;
  servicing: 'yes' | 'no' | '';
  servicingAction: string;

  // First Aid Kit Section
  firstAidContents: 'yes' | 'no' | '';
  firstAidContentsAction: string;
  firstAidClean: 'yes' | 'no' | '';
  firstAidCleanAction: string;
  firstAidReplenish: 'yes' | 'no' | '';
  firstAidReplenishAction: string;
  expiryDatesChecked: 'yes' | 'no' | '';
  expiryDatesCheckedAction: string;
  outOfDateDisposed: 'yes' | 'no' | '';
  outOfDateDisposedAction: string;

  // Transportation of Clients Section
  wheelchairHoist: 'yes' | 'no' | '';
  wheelchairHoistAction: string;
  appropriateForClients: 'yes' | 'no' | '';
  appropriateForClientsAction: string;
  secureClients: 'yes' | 'no' | '';
  secureClientsAction: string;

  // Client Behavior Assessment
  clientBehaviourKnown: 'yes' | 'no' | '';
  clientBehaviourKnownAction: string;

  // Other Issues (up to 5)
  otherIssue1: string;
  otherIssue1Yes: 'yes' | 'no' | '';
  otherIssue1Action: string;
  otherIssue2: string;
  otherIssue2Yes: 'yes' | 'no' | '';
  otherIssue2Action: string;
  otherIssue3: string;
  otherIssue3Yes: 'yes' | 'no' | '';
  otherIssue3Action: string;
  otherIssue4: string;
  otherIssue4Yes: 'yes' | 'no' | '';
  otherIssue4Action: string;
  otherIssue5: string;
  otherIssue5Yes: 'yes' | 'no' | '';
  otherIssue5Action: string;

  // Review Section
  returnToPosition: string;
  reviewedByName: string;
  reviewedByPosition: string;
  reviewedByDate: string;
  nextInspectionDate: string;
}

interface VehicleSafetyInspectionEditProps {
  initialData?: Partial<VehicleSafetyInspectionFormData>;
  onDataChange?: (data: VehicleSafetyInspectionFormData) => void;
  showButtons?: boolean;
  readOnly?: boolean;
  fieldErrors?: Record<string, string>;
}

export default function VehicleSafetyInspectionEdit({
  initialData = {},
  onDataChange,
  showButtons = false,
  readOnly = false,
  fieldErrors = {},
}: VehicleSafetyInspectionEditProps) {
  const [formData, setFormData] = useState<VehicleSafetyInspectionFormData>({
    driver: '',
    licenceNumber: '',
    plantIdNo: '',
    vehicleRegistration: '',
    insurancePolicy: '',
    dateOfInspection: '',
    headlights: '',
    headlightsAction: '',
    parkingLights: '',
    parkingLightsAction: '',
    hazardLights: '',
    hazardLightsAction: '',
    brakeLights: '',
    brakeLightsAction: '',
    reverseLights: '',
    reverseLightsAction: '',
    trailerParkingLights: '',
    trailerParkingLightsAction: '',
    handbrake: '',
    handbrakeAction: '',
    brakePedal: '',
    brakePedalAction: '',
    horn: '',
    hornAction: '',
    noSmokingSigns: '',
    noSmokingSignsAction: '',
    internalCleanliness: '',
    internalCleanlinessAction: '',
    cargoBarrier: '',
    cargoBarrierAction: '',
    safetyBelts: '',
    safetyBeltsAction: '',
    bodyDamage: '',
    bodyDamageAction: '',
    windscreen: '',
    windscreenAction: '',
    wipersWashers: '',
    wipersWashersAction: '',
    washerReservoir: '',
    washerReservoirAction: '',
    tyreTread: '',
    tyreTreadAction: '',
    treadMatching: '',
    treadMatchingAction: '',
    tyrePressure: '',
    tyrePressureAction: '',
    reportingSystem: '',
    reportingSystemAction: '',
    servicing: '',
    servicingAction: '',
    firstAidContents: '',
    firstAidContentsAction: '',
    firstAidClean: '',
    firstAidCleanAction: '',
    firstAidReplenish: '',
    firstAidReplenishAction: '',
    expiryDatesChecked: '',
    expiryDatesCheckedAction: '',
    outOfDateDisposed: '',
    outOfDateDisposedAction: '',
    wheelchairHoist: '',
    wheelchairHoistAction: '',
    appropriateForClients: '',
    appropriateForClientsAction: '',
    secureClients: '',
    secureClientsAction: '',
    clientBehaviourKnown: '',
    clientBehaviourKnownAction: '',
    otherIssue1: '',
    otherIssue1Yes: '',
    otherIssue1Action: '',
    otherIssue2: '',
    otherIssue2Yes: '',
    otherIssue2Action: '',
    otherIssue3: '',
    otherIssue3Yes: '',
    otherIssue3Action: '',
    otherIssue4: '',
    otherIssue4Yes: '',
    otherIssue4Action: '',
    otherIssue5: '',
    otherIssue5Yes: '',
    otherIssue5Action: '',
    returnToPosition: '',
    reviewedByName: '',
    reviewedByPosition: '',
    reviewedByDate: '',
    nextInspectionDate: '',
    ...initialData,
  });

  // Use ref to store the callback to avoid infinite loops
  const onDataChangeRef = useRef(onDataChange);
  const isInitialMount = useRef(true);
  const hasInitialized = useRef(false);
  const lastInitialDataRef = useRef<any>(null);
  
  // Update the ref whenever the callback changes
  useEffect(() => {
    onDataChangeRef.current = onDataChange;
  }, [onDataChange]);

  // Sync from initialData when it changes (but only if it's different from what we've already loaded)
  useEffect(() => {
    if (initialData && typeof initialData === 'object') {
      // Check if initialData has changed
      const initialDataStr = JSON.stringify(initialData);
      const lastInitialDataStr = JSON.stringify(lastInitialDataRef.current);
      
      // If initialData has any keys and is different from what we last processed, update the form
      const hasData = Object.keys(initialData).length > 0;
      if (hasData && initialDataStr !== lastInitialDataStr) {
        lastInitialDataRef.current = initialData;
        hasInitialized.current = true;
        setFormData(prev => ({ ...prev, ...initialData }));
      }
    }
  }, [initialData]);

  // Call onDataChange whenever formData changes (after initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // Call onDataChange whenever formData changes (don't wait for initialization)
    // This ensures parent component gets updates immediately when user types
    onDataChangeRef.current?.(formData);
  }, [formData]);

  const handleInputChange = (field: keyof VehicleSafetyInspectionFormData, value: string | 'yes' | 'no') => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderYesCheckbox = (
    field: keyof VehicleSafetyInspectionFormData,
    value: 'yes' | 'no' | ''
  ) => {
    return (
      <div className="flex items-center justify-center">
        <input
          type="radio"
          name={field}
          value="yes"
          checked={value === 'yes'}
          onChange={() => handleInputChange(field, 'yes')}
          disabled={readOnly}
          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
        />
      </div>
    );
  };

  const renderNoCheckbox = (
    field: keyof VehicleSafetyInspectionFormData,
    value: 'yes' | 'no' | ''
  ) => {
    return (
      <div className="flex items-center justify-center">
        <input
          type="radio"
          name={field}
          value="no"
          checked={value === 'no'}
          onChange={() => handleInputChange(field, 'no')}
          disabled={readOnly}
          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
        />
      </div>
    );
  };

  const renderTextField = (field: keyof VehicleSafetyInspectionFormData, className: string = '', required: boolean = false) => {
    const hasError = fieldErrors[field];
    return (
      <div className="w-full">
        <input
          type="text"
          value={formData[field] as string}
          onChange={(e) => handleInputChange(field, e.target.value)}
          disabled={readOnly}
          className={`w-full h-8 px-2 border rounded ${className} ${
            hasError 
              ? 'border-red-500 bg-red-50' 
              : 'border-gray-300 bg-white'
          } ${readOnly ? 'bg-gray-100' : ''}`}
          required={required}
        />
        {hasError && (
          <p className="text-red-500 text-xs mt-1">{hasError}</p>
        )}
      </div>
    );
  };

  const renderTextareaField = (field: keyof VehicleSafetyInspectionFormData, className: string = '') => {
    return (
      <textarea
        value={formData[field] as string}
        onChange={(e) => handleInputChange(field, e.target.value)}
        disabled={readOnly}
        rows={2}
        className={`w-full min-h-[2rem] px-2 py-1 border border-gray-300 bg-white rounded resize-y ${className} ${readOnly ? 'bg-gray-100' : ''}`}
        style={{ 
          minHeight: '2rem',
          maxHeight: '10rem',
          overflowY: 'auto'
        }}
      />
    );
  };

  return (
    <div className="bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Page 1 - Driver Information and Initial Inspection */}
        <FormPage
          title="Vehicle Safety Inspection Checklist"
          meta={{
            website: '',
            version: '',
            reviewDate: ''
          }}
        >
          {/* Driver Information Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Driver Information</h2>
            <div className="border border-gray-300">
              {/* Row 1: Driver */}
              <div className="grid grid-cols-2 border-b border-gray-300">
                <div className="p-3 bg-gray-100 border-r border-gray-300 font-semibold text-gray-800">
                  Driver <span className="text-red-500">*</span>
                </div>
                <div className="p-3">
                  {renderTextField('driver', '', true)}
                </div>
              </div>
              {/* Row 2: Licence number */}
              <div className="grid grid-cols-2 border-b border-gray-300">
                <div className="p-3 bg-gray-100 border-r border-gray-300 font-semibold text-gray-800">
                  Licence number <span className="text-red-500">*</span>
                </div>
                <div className="p-3">
                  {renderTextField('licenceNumber', '', true)}
                </div>
              </div>
              {/* Row 3: Plant ID No */}
              <div className="grid grid-cols-2 border-b border-gray-300">
                <div className="p-3 bg-gray-100 border-r border-gray-300 font-semibold text-gray-800">
                  Plant ID No <span className="text-red-500">*</span>
                </div>
                <div className="p-3">
                  {renderTextField('plantIdNo', '', true)}
                </div>
              </div>
              {/* Row 4: Vehicle registration */}
              <div className="grid grid-cols-2 border-b border-gray-300">
                <div className="p-3 bg-gray-100 border-r border-gray-300 font-semibold text-gray-800">
                  Vehicle registration <span className="text-red-500">*</span>
                </div>
                <div className="p-3">
                  {renderTextField('vehicleRegistration', '', true)}
                </div>
              </div>
              {/* Row 5: Insurance policy */}
              <div className="grid grid-cols-2 border-b border-gray-300">
                <div className="p-3 bg-gray-100 border-r border-gray-300 font-semibold text-gray-800">
                  Insurance policy <span className="text-red-500">*</span>
                </div>
                <div className="p-3">
                  {renderTextField('insurancePolicy', '', true)}
                </div>
              </div>
              {/* Row 6: Date of inspection */}
              <div className="grid grid-cols-2">
                <div className="p-3 bg-gray-100 border-r border-gray-300 font-semibold text-gray-800">
                  Date of inspection <span className="text-red-500">*</span>
                </div>
                <div className="p-3">
                  <div className="w-full">
                    <input
                      type="date"
                      value={formData.dateOfInspection}
                      onChange={(e) => handleInputChange('dateOfInspection', e.target.value)}
                      disabled={readOnly}
                      required
                      className={`w-full h-8 px-2 border rounded ${
                        fieldErrors['dateOfInspection']
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 bg-white'
                      } ${readOnly ? 'bg-gray-100' : ''}`}
                    />
                    {fieldErrors['dateOfInspection'] && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors['dateOfInspection']}</p>
                    )}
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
                  <div className="p-3 border-r border-gray-300">
                    {renderYesCheckbox('headlights', formData.headlights)}
                  </div>
                  <div className="p-3 border-r border-gray-300">
                    {renderNoCheckbox('headlights', formData.headlights)}
                  </div>
                  <div className="p-3">
                    {renderTextareaField('headlightsAction')}
                  </div>
                </div>
                <div className="grid grid-cols-4">
                  <div className="p-3 border-r border-gray-300">Parking lights</div>
                  <div className="p-3 border-r border-gray-300">
                    {renderYesCheckbox('parkingLights', formData.parkingLights)}
                  </div>
                  <div className="p-3 border-r border-gray-300">
                    {renderNoCheckbox('parkingLights', formData.parkingLights)}
                  </div>
                  <div className="p-3">
                    {renderTextareaField('parkingLightsAction')}
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
                  <div className="p-3 border-r border-gray-300">
                    {renderYesCheckbox('hazardLights', formData.hazardLights)}
                  </div>
                  <div className="p-3 border-r border-gray-300">
                    {renderNoCheckbox('hazardLights', formData.hazardLights)}
                  </div>
                  <div className="p-3">
                    {renderTextareaField('hazardLightsAction')}
                  </div>
                </div>
                <div className="grid grid-cols-4 border-b border-gray-300">
                  <div className="p-3 border-r border-gray-300">Brake lights</div>
                  <div className="p-3 border-r border-gray-300">
                    {renderYesCheckbox('brakeLights', formData.brakeLights)}
                  </div>
                  <div className="p-3 border-r border-gray-300">
                    {renderNoCheckbox('brakeLights', formData.brakeLights)}
                  </div>
                  <div className="p-3">
                    {renderTextareaField('brakeLightsAction')}
                  </div>
                </div>
                <div className="grid grid-cols-4 border-b border-gray-300">
                  <div className="p-3 border-r border-gray-300">Reverse lights</div>
                  <div className="p-3 border-r border-gray-300">
                    {renderYesCheckbox('reverseLights', formData.reverseLights)}
                  </div>
                  <div className="p-3 border-r border-gray-300">
                    {renderNoCheckbox('reverseLights', formData.reverseLights)}
                  </div>
                  <div className="p-3">
                    {renderTextareaField('reverseLightsAction')}
                  </div>
                </div>
                <div className="bg-gray-50 p-2 border-b border-gray-300">
                  <p className="text-sm font-medium text-gray-700">If trailer attached:</p>
                </div>
                <div className="grid grid-cols-4">
                  <div className="p-3 border-r border-gray-300 pl-6">Parking lights</div>
                  <div className="p-3 border-r border-gray-300">
                    {renderYesCheckbox('trailerParkingLights', formData.trailerParkingLights)}
                  </div>
                  <div className="p-3 border-r border-gray-300">
                    {renderNoCheckbox('trailerParkingLights', formData.trailerParkingLights)}
                  </div>
                  <div className="p-3">
                    {renderTextareaField('trailerParkingLightsAction')}
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
                  <div className="p-3 border-r border-gray-300">
                    {renderYesCheckbox('handbrake', formData.handbrake)}
                  </div>
                  <div className="p-3 border-r border-gray-300">
                    {renderNoCheckbox('handbrake', formData.handbrake)}
                  </div>
                  <div className="p-3">
                    {renderTextareaField('handbrakeAction')}
                  </div>
                </div>
                <div className="grid grid-cols-4 border-b border-gray-300">
                  <div className="p-3 border-r border-gray-300">Check for firm brake pedal</div>
                  <div className="p-3 border-r border-gray-300">
                    {renderYesCheckbox('brakePedal', formData.brakePedal)}
                  </div>
                  <div className="p-3 border-r border-gray-300">
                    {renderNoCheckbox('brakePedal', formData.brakePedal)}
                  </div>
                  <div className="p-3">
                    {renderTextareaField('brakePedalAction')}
                  </div>
                </div>
                <div className="grid grid-cols-4">
                  <div className="p-3 border-r border-gray-300">Check operation of horn</div>
                  <div className="p-3 border-r border-gray-300">
                    {renderYesCheckbox('horn', formData.horn)}
                  </div>
                  <div className="p-3 border-r border-gray-300">
                    {renderNoCheckbox('horn', formData.horn)}
                  </div>
                  <div className="p-3">
                    {renderTextareaField('hornAction')}
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
                  <div className="p-3 border-r border-gray-300">
                    {renderYesCheckbox('noSmokingSigns', formData.noSmokingSigns)}
                  </div>
                  <div className="p-3 border-r border-gray-300">
                    {renderNoCheckbox('noSmokingSigns', formData.noSmokingSigns)}
                  </div>
                  <div className="p-3">
                    {renderTextareaField('noSmokingSignsAction')}
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
            website: '',
            version: '',
            reviewDate: ''
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
                <div className="p-3 border-r border-gray-300">
                  {renderYesCheckbox('internalCleanliness', formData.internalCleanliness)}
                </div>
                <div className="p-3 border-r border-gray-300">
                  {renderNoCheckbox('internalCleanliness', formData.internalCleanliness)}
                </div>
                <div className="p-3">
                  {renderTextareaField('internalCleanlinessAction')}
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Cargo barrier in place, where appropriate</div>
                <div className="p-3 border-r border-gray-300">
                  {renderYesCheckbox('cargoBarrier', formData.cargoBarrier)}
                </div>
                <div className="p-3 border-r border-gray-300">
                  {renderNoCheckbox('cargoBarrier', formData.cargoBarrier)}
                </div>
                <div className="p-3">
                  {renderTextareaField('cargoBarrierAction')}
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Safety belts in good order</div>
                <div className="p-3 border-r border-gray-300">
                  {renderYesCheckbox('safetyBelts', formData.safetyBelts)}
                </div>
                <div className="p-3 border-r border-gray-300">
                  {renderNoCheckbox('safetyBelts', formData.safetyBelts)}
                </div>
                <div className="p-3">
                  {renderTextareaField('safetyBeltsAction')}
                </div>
              </div>

              {/* Exterior Section */}
              <div className="bg-gray-100 p-3 border-b border-gray-300">
                <h4 className="font-semibold text-gray-800">Exterior</h4>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Any damage to body work noted</div>
                <div className="p-3 border-r border-gray-300">
                  {renderYesCheckbox('bodyDamage', formData.bodyDamage)}
                </div>
                <div className="p-3 border-r border-gray-300">
                  {renderNoCheckbox('bodyDamage', formData.bodyDamage)}
                </div>
                <div className="p-3">
                  {renderTextareaField('bodyDamageAction')}
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Windscreen in good order and clean</div>
                <div className="p-3 border-r border-gray-300">
                  {renderYesCheckbox('windscreen', formData.windscreen)}
                </div>
                <div className="p-3 border-r border-gray-300">
                  {renderNoCheckbox('windscreen', formData.windscreen)}
                </div>
                <div className="p-3">
                  {renderTextareaField('windscreenAction')}
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Windscreen wipers and washers operating</div>
                <div className="p-3 border-r border-gray-300">
                  {renderYesCheckbox('wipersWashers', formData.wipersWashers)}
                </div>
                <div className="p-3 border-r border-gray-300">
                  {renderNoCheckbox('wipersWashers', formData.wipersWashers)}
                </div>
                <div className="p-3">
                  {renderTextareaField('wipersWashersAction')}
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Water in windscreen washer reservoir</div>
                <div className="p-3 border-r border-gray-300">
                  {renderYesCheckbox('washerReservoir', formData.washerReservoir)}
                </div>
                <div className="p-3 border-r border-gray-300">
                  {renderNoCheckbox('washerReservoir', formData.washerReservoir)}
                </div>
                <div className="p-3">
                  {renderTextareaField('washerReservoirAction')}
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Tyre tread checked for wear</div>
                <div className="p-3 border-r border-gray-300">
                  {renderYesCheckbox('tyreTread', formData.tyreTread)}
                </div>
                <div className="p-3 border-r border-gray-300">
                  {renderNoCheckbox('tyreTread', formData.tyreTread)}
                </div>
                <div className="p-3">
                  {renderTextareaField('tyreTreadAction')}
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Treads matching for front and rear tyres</div>
                <div className="p-3 border-r border-gray-300">
                  {renderYesCheckbox('treadMatching', formData.treadMatching)}
                </div>
                <div className="p-3 border-r border-gray-300">
                  {renderNoCheckbox('treadMatching', formData.treadMatching)}
                </div>
                <div className="p-3">
                  {renderTextareaField('treadMatchingAction')}
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Tyre pressure checked</div>
                <div className="p-3 border-r border-gray-300">
                  {renderYesCheckbox('tyrePressure', formData.tyrePressure)}
                </div>
                <div className="p-3 border-r border-gray-300">
                  {renderNoCheckbox('tyrePressure', formData.tyrePressure)}
                </div>
                <div className="p-3">
                  {renderTextareaField('tyrePressureAction')}
                </div>
              </div>

              {/* General Safety Section */}
              <div className="bg-gray-100 p-3 border-b border-gray-300">
                <h4 className="font-semibold text-gray-800">General Safety</h4>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">System in place for reporting problems</div>
                <div className="p-3 border-r border-gray-300">
                  {renderYesCheckbox('reportingSystem', formData.reportingSystem)}
                </div>
                <div className="p-3 border-r border-gray-300">
                  {renderNoCheckbox('reportingSystem', formData.reportingSystem)}
                </div>
                <div className="p-3">
                  {renderTextareaField('reportingSystemAction')}
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Servicing as required</div>
                <div className="p-3 border-r border-gray-300">
                  {renderYesCheckbox('servicing', formData.servicing)}
                </div>
                <div className="p-3 border-r border-gray-300">
                  {renderNoCheckbox('servicing', formData.servicing)}
                </div>
                <div className="p-3">
                  {renderTextareaField('servicingAction')}
                </div>
              </div>

              {/* First Aid Kit, Sunscreen, Insect Repellent Section */}
              <div className="bg-gray-100 p-3 border-b border-gray-300">
                <h4 className="font-semibold text-gray-800">First Aid Kit, Sunscreen, Insect Repellent</h4>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Contents assessed in compliance with first aid requirements</div>
                <div className="p-3 border-r border-gray-300">
                  {renderYesCheckbox('firstAidContents', formData.firstAidContents)}
                </div>
                <div className="p-3 border-r border-gray-300">
                  {renderNoCheckbox('firstAidContents', formData.firstAidContents)}
                </div>
                <div className="p-3">
                  {renderTextareaField('firstAidContentsAction')}
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Container and contents clean and orderly</div>
                <div className="p-3 border-r border-gray-300">
                  {renderYesCheckbox('firstAidClean', formData.firstAidClean)}
                </div>
                <div className="p-3 border-r border-gray-300">
                  {renderNoCheckbox('firstAidClean', formData.firstAidClean)}
                </div>
                <div className="p-3">
                  {renderTextareaField('firstAidCleanAction')}
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">System in place to replenish kit items</div>
                <div className="p-3 border-r border-gray-300">
                  {renderYesCheckbox('firstAidReplenish', formData.firstAidReplenish)}
                </div>
                <div className="p-3 border-r border-gray-300">
                  {renderNoCheckbox('firstAidReplenish', formData.firstAidReplenish)}
                </div>
                <div className="p-3">
                  {renderTextareaField('firstAidReplenishAction')}
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Expiry dates checked</div>
                <div className="p-3 border-r border-gray-300">
                  {renderYesCheckbox('expiryDatesChecked', formData.expiryDatesChecked)}
                </div>
                <div className="p-3 border-r border-gray-300">
                  {renderNoCheckbox('expiryDatesChecked', formData.expiryDatesChecked)}
                </div>
                <div className="p-3">
                  {renderTextareaField('expiryDatesCheckedAction')}
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Out of date items disposed of</div>
                <div className="p-3 border-r border-gray-300">
                  {renderYesCheckbox('outOfDateDisposed', formData.outOfDateDisposed)}
                </div>
                <div className="p-3 border-r border-gray-300">
                  {renderNoCheckbox('outOfDateDisposed', formData.outOfDateDisposed)}
                </div>
                <div className="p-3">
                  {renderTextareaField('outOfDateDisposedAction')}
                </div>
              </div>

              {/* Transportation of Clients Section */}
              <div className="bg-gray-100 p-3 border-b border-gray-300">
                <h4 className="font-semibold text-gray-800">Transportation of Clients</h4>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Wheelchair hoist fitted, if required</div>
                <div className="p-3 border-r border-gray-300">
                  {renderYesCheckbox('wheelchairHoist', formData.wheelchairHoist)}
                </div>
                <div className="p-3 border-r border-gray-300">
                  {renderNoCheckbox('wheelchairHoist', formData.wheelchairHoist)}
                </div>
                <div className="p-3">
                  {renderTextareaField('wheelchairHoistAction')}
                </div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">Appropriate for the transport of clients</div>
                <div className="p-3 border-r border-gray-300">
                  {renderYesCheckbox('appropriateForClients', formData.appropriateForClients)}
                </div>
                <div className="p-3 border-r border-gray-300">
                  {renderNoCheckbox('appropriateForClients', formData.appropriateForClients)}
                </div>
                <div className="p-3">
                  {renderTextareaField('appropriateForClientsAction')}
                </div>
              </div>
              <div className="grid grid-cols-4">
                <div className="p-3 border-r border-gray-300">Facility to secure clients appropriately</div>
                <div className="p-3 border-r border-gray-300">
                  {renderYesCheckbox('secureClients', formData.secureClients)}
                </div>
                <div className="p-3 border-r border-gray-300">
                  {renderNoCheckbox('secureClients', formData.secureClients)}
                </div>
                <div className="p-3">
                  {renderTextareaField('secureClientsAction')}
                </div>
              </div>
            </div>
          </div>
        </FormPage>

        {/* Page 3 - Client Behavior Assessment and Review */}
        <FormPage
          title="Vehicle Safety Inspection Checklist"
          meta={{
            website: '',
            version: '',
            reviewDate: ''
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
                <div className="p-3 border-r border-gray-300">
                  {renderYesCheckbox('clientBehaviourKnown', formData.clientBehaviourKnown)}
                </div>
                <div className="p-3 border-r border-gray-300">
                  {renderNoCheckbox('clientBehaviourKnown', formData.clientBehaviourKnown)}
                </div>
                <div className="p-3">
                  {renderTextareaField('clientBehaviourKnownAction')}
                </div>
              </div>

              {/* Other Issues Section */}
              <div className="bg-gray-100 p-3 border-b border-gray-300">
                <h4 className="font-semibold text-gray-800">Other Issues</h4>
              </div>
              {[1, 2, 3, 4, 5].map((num) => {
                const issueField = `otherIssue${num}` as keyof VehicleSafetyInspectionFormData;
                const yesField = `otherIssue${num}Yes` as keyof VehicleSafetyInspectionFormData;
                const actionField = `otherIssue${num}Action` as keyof VehicleSafetyInspectionFormData;
                return (
                  <div key={num} className="grid grid-cols-4 border-b border-gray-300">
                    <div className="p-3 border-r border-gray-300">
                      {renderTextField(issueField)}
                    </div>
                    <div className="p-3 border-r border-gray-300">
                      {renderYesCheckbox(yesField, formData[yesField] as 'yes' | 'no' | '')}
                    </div>
                    <div className="p-3 border-r border-gray-300">
                      {renderNoCheckbox(yesField, formData[yesField] as 'yes' | 'no' | '')}
                    </div>
                    <div className="p-3">
                      {renderTextareaField(actionField)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submission and Review Section */}
          <div className="space-y-6">
            {/* Return Form Section */}
            <div>
              <p className="text-gray-800 mb-2">Return completed form to:</p>
              <div className="flex items-center gap-2">
                {renderTextField('returnToPosition', 'flex-1')}
                <span className="text-gray-800">Position</span>
              </div>
            </div>

            {/* Review Section */}
            <div className="border border-gray-300">
              <div className="grid grid-cols-2 border-b border-gray-300">
                <div className="p-3 bg-gray-100 border-r border-gray-300 font-semibold text-gray-800">Reviewed by [name]:</div>
                <div className="p-3">
                  {renderTextField('reviewedByName')}
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-gray-300">
                <div className="p-3 bg-gray-100 border-r border-gray-300 font-semibold text-gray-800">Position:</div>
                <div className="p-3">
                  {renderTextField('reviewedByPosition')}
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="p-3 bg-gray-100 border-r border-gray-300 font-semibold text-gray-800">Date:</div>
                <div className="p-3">
                  <input
                    type="date"
                    value={formData.reviewedByDate}
                    onChange={(e) => handleInputChange('reviewedByDate', e.target.value)}
                    disabled={readOnly}
                    className={`w-full h-8 px-2 border border-gray-300 bg-white rounded ${readOnly ? 'bg-gray-100' : ''}`}
                  />
                </div>
              </div>
            </div>

            {/* Next Inspection Date */}
            <div className="flex items-center gap-2">
              <span className="text-gray-800">Date for next inspection:</span>
              <input
                type="date"
                value={formData.nextInspectionDate}
                onChange={(e) => handleInputChange('nextInspectionDate', e.target.value)}
                disabled={readOnly}
                className={`flex-1 h-8 px-2 border border-gray-300 bg-white rounded ${readOnly ? 'bg-gray-100' : ''}`}
              />
            </div>
          </div>
        </FormPage>
      </div>
    </div>
  );
}
