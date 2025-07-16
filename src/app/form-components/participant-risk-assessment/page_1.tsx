

import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface Page1Props {
  schema: any;
  formData: Record<string, string>;
}

const Page1: React.FC<Page1Props> = ({ formData }) => {
  const getValue = (key: string) => formData[key] || '';

  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full text-sm font-sans">
        {/* Logo */}
        <div className="flex justify-center pt-6 pb-4">
          <img
            src='/infinity_logo.png'
            alt="Infinity Supports WA logo"
            className="h-[60px] w-[150px] object-contain"
          />
        </div>

        {/* Title */}
        <h2 className="text-center text-lg font-semibold mb-4 leading-tight uppercase">
          Participant Risk Assessment and Disaster Management Plan
        </h2>

        {/* Participant Details */}
<div className="flex-1 flex flex-col px-6">
      <table className="w-full border border-black border-collapse text-sm flex-1">          <thead>
            <tr className="bg-gray-300 font-bold text-left">
              <th className="border border-black p-2 w-[40%]">PARTICIPANT DETAILS</th>
              <th className="border border-black p-2" colSpan={2}>
                NDIS Number: {getValue('ndisNumber')}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2">Given name/s: {getValue('givenNames')}</td>
              <td className="border border-black p-2">Family name: {getValue('familyName')}</td>
              <td className="border border-black p-2"></td>
            </tr>
            <tr>
              <td className="border border-black p-2">Preferred name: {getValue('preferredName')}</td>
              <td className="border border-black p-2">Date of birth: {getValue('dob')}</td>
              <td className="border border-black p-2"></td>
            </tr>
            <tr>
              <td className="border border-black p-2">Address: {getValue('address')}</td>
              <td className="border border-black p-2">Phone No: {getValue('phoneNumber')}</td>
              <td className="border border-black p-2"></td>
            </tr>
            <tr>
              <td className="border border-black p-2">
                Preferred contact method: {getValue('preferredContact')}
              </td>
              <td className="border border-black p-2">Email: {getValue('email')}</td>
              <td className="border border-black p-2"></td>
            </tr>
          </tbody>

          {/* Medical Conditions */}
          <thead>
            <tr className="bg-gray-300 font-bold text-left">
              <th className="border border-black p-2" colSpan={3}>
                KNOWN MEDICAL CONDITIONS OR ALLERGIES
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2">Specify: {getValue('medicalSpecify')}</td>
              <td className="border border-black p-2">Effect: {getValue('medicalEffect')}</td>
              <td className="border border-black p-2">Treatment: {getValue('medicalTreatment')}</td>
            </tr>
          </tbody>

          {/* Emergency Contact */}
          <thead>
            <tr className="bg-gray-300 font-bold text-left">
              <th className="border border-black p-2" colSpan={3}>
                EMERGENCY CONTACTS / CARER / GUARDIAN
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2">
                Name/s: {getValue('emergencyContactName')}
              </td>
              <td className="border border-black p-2">
                Phone: {getValue('emergencyContactPhone')}
              </td>
              <td className="border border-black p-2"></td>
            </tr>
            <tr>
              <td className="border border-black p-2" colSpan={3}>
                Email: {getValue('emergencyContactEmail')}
              </td>
            </tr>
          </tbody>

          {/* Persons Involved */}
          <thead>
            <tr className="bg-gray-300 font-bold text-left">
              <th className="border border-black p-2" colSpan={3}>
                PERSONS INVOLVED IN RISK ASSESSMENT
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2">
                Was the participant involved in the assessment?
              </td>
              <td className="border border-black p-2">
                <div className="flex flex-col gap-1">
                  <label className="inline-flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={formData.participantInvolved === 'Yes'}
                      readOnly
                    />
                    <span className="text-sm">Yes</span>
                  </label>
                  <label className="inline-flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={formData.participantInvolved === 'No'}
                      readOnly
                    />
                    <span className="text-sm">No</span>
                  </label>
                </div>
              </td>
              <td className="border border-black p-2">
                Reason: {getValue('participantInvolvedReason')}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2" colSpan={3}>
                Staff Involved: {getValue('staffInvolved')}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2" colSpan={3}>
                Others Involved: {getValue('othersInvolved')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

          <div className="pt-4">
      <div className="flex justify-between text-xs px-2">
            <div>Website: infinitysupportswa.org</div>
            <div>CF013</div>
            <div>Review Date: 13/02/2025</div>
          </div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page1;
