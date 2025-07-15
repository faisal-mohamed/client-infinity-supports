import React from 'react';
import A4PageWrapper from './A4PageWrapper'; // Reuse your wrapper for layout consistency

interface Page1Props {
  schema: any;
  formData: Record<string, string>;
}

const Page1: React.FC<Page1Props> = ({  formData }) => {


  const getValue = (key: string) => formData[key] || '';

  return (
    <A4PageWrapper>
      <div className="w-full max-w-[794px] mx-auto px-6 pt-6 pb-12 text-[12px]">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://storage.googleapis.com/a1aa/image/3cc5a17e-0b79-4a77-8f71-ea9c7343300e.jpg"
            alt="Infinity Supports WA logo"
            className="h-[60px] w-[150px] object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-center font-bold text-[12px] mb-6 leading-tight uppercase">
          Participant Risk Assessment and Disaster Management Plan
        </h1>

        {/* Participant Details */}
        <table className="w-full border border-black border-collapse text-[10px] mb-4">
          <thead>
            <tr className="bg-gray-300 font-bold">
              <th className="border border-black px-1 py-1 text-left w-[40%]">PARTICIPANT DETAILS</th>
              <th className="border border-black px-1 py-1 text-left" colSpan={2}>
                NDIS Number: {getValue('ndisNumber')}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black px-1 py-1">Given name/s: {getValue('givenNames')}</td>
              <td className="border border-black px-1 py-1">Family name: {getValue('familyName')}</td>
              <td className="border border-black px-1 py-1"></td>
            </tr>
            <tr>
              <td className="border border-black px-1 py-1">Preferred name: {getValue('preferredName')}</td>
              <td className="border border-black px-1 py-1">Date of birth: {getValue('dob')}</td>
              <td className="border border-black px-1 py-1"></td>
            </tr>
            <tr>
              <td className="border border-black px-1 py-1">Address: {getValue('address')}</td>
              <td className="border border-black px-1 py-1">Phone No: {getValue('phoneNumber')}</td>
              <td className="border border-black px-1 py-1"></td>
            </tr>
            <tr>
              <td className="border border-black px-1 py-1">
                Preferred contact method: {getValue('preferredContact')}
              </td>
              <td className="border border-black px-1 py-1">Email: {getValue('email')}</td>
              <td className="border border-black px-1 py-1"></td>
            </tr>
          </tbody>

          {/* Medical Conditions */}
          <thead>
            <tr className="bg-gray-300 font-bold">
              <th className="border border-black px-1 py-1 text-left" colSpan={3}>
                KNOWN MEDICAL CONDITIONS OR ALLERGIES
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black px-1 py-1">Specify: {getValue('medicalSpecify')}</td>
              <td className="border border-black px-1 py-1">Effect: {getValue('medicalEffect')}</td>
              <td className="border border-black px-1 py-1">Treatment: {getValue('medicalTreatment')}</td>
            </tr>
          </tbody>

          {/* Emergency Contact */}
          <thead>
            <tr className="bg-gray-300 font-bold">
              <th className="border border-black px-1 py-1 text-left" colSpan={3}>
                EMERGENCY CONTACTS / CARER / GUARDIAN
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black px-1 py-1">
                Name/s: {getValue('emergencyContactName')}
              </td>
              <td className="border border-black px-1 py-1">
                Phone: {getValue('emergencyContactPhone')}
              </td>
              <td className="border border-black px-1 py-1"></td>
            </tr>
            <tr>
              <td className="border border-black px-1 py-1" colSpan={3}>
                Email: {getValue('emergencyContactEmail')}
              </td>
            </tr>
          </tbody>

          {/* Persons Involved */}
          <thead>
            <tr className="bg-gray-300 font-bold">
              <th className="border border-black px-1 py-1 text-left" colSpan={3}>
                PERSONS INVOLVED IN RISK ASSESSMENT
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black px-1 py-1">
                Was the participant involved in the assessment?
              </td>
              <td className="border border-black px-1 py-1">
                <div className="flex flex-col gap-1">
                  <label className="inline-flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={formData.participantInvolved === 'Yes'}
                      readOnly
                    />
                    <span>Yes</span>
                  </label>
                  <label className="inline-flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={formData.participantInvolved === 'No'}
                      readOnly
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
              <td className="border border-black px-1 py-1">
                Reason: {getValue('participantInvolvedReason')}
              </td>
            </tr>
            <tr>
              <td className="border border-black px-1 py-1" colSpan={3}>
                Staff Involved: {getValue('staffInvolved')}
              </td>
            </tr>
            <tr>
              <td className="border border-black px-1 py-1" colSpan={3}>
                Others Involved: {getValue('othersInvolved')}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex justify-between text-[9px] mt-6 px-1">
          <div>Website: infinitysupportswa.org</div>
          <div>CF013</div>
          <div>Review Date: 13/02/2025</div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page1;
