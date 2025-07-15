import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface Page7Props {
  settings?: any;
}

const Page7: React.FC<Page7Props> = ({ settings }) => {
  return (
    <A4PageWrapper>
      <div className="h-full flex flex-col p-6">
        {/* Header with Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={'/infinity_logo.png'}
            alt="Infinity Supports WA logo"
            className="h-16 object-contain"
          />
        </div>

        {/* Content area - takes up remaining space */}
        <div className="flex-1 text-sm leading-loose space-y-6">
          {/* Heading */}
          <p className="font-bold leading-loose">Emergency Preparedness</p>

          {/* Description */}
          <p className="leading-loose">
            <span className="text-red-600 font-semibold">Infinity Supports WA</span>, will develop a plan to respond to any unplanned event that can cause:
          </p>

          {/* Bullet List 1 */}
          <ul className="list-disc list-inside space-y-2 leading-loose">
            <li className="leading-loose">Deaths; or</li>
            <li className="leading-loose">Significant injuries to employees or occupants; and/or</li>
            <li className="leading-loose">Shut down the business; and/or</li>
            <li className="leading-loose">Disruption to operations; and/or</li>
            <li className="leading-loose">Physical or environmental damage</li>
          </ul>

          {/* Description Paragraphs */}
          <p className="leading-loose">
            For your peace of mind, all our support workers are trained on how to respond in case of an emergency, and they will receive a copy of your Individual Disaster Management Plan so that they are fully aware of your health condition and the required action plans in case of an emergency.
          </p>

          <p className="leading-loose">
            Individual Disaster Management Plan and Risk Assessment will be developed and signed by <span className="text-red-600 font-semibold">Infinity Supports WA</span> and the Individual and/or representative. Providers' Responsibility related to participants Individual Disaster Management Plan and Risk Assessment is subject to 73G requirements.
          </p>

          <p className="leading-loose">
            It is the provider's responsibility to document the assessment of the participant's risk factors using Intake Form, Support Plan, and Participant, Home, and Community Risk Assessment forms.
          </p>

          {/* Bullet List 2 */}
          <ul className="list-disc list-inside space-y-3 leading-loose">
            <li className="leading-loose">
              A copy of the Individual Disaster Management Plan and Risk Assessment will be provided to the participant and another copy should be kept in their file.
            </li>
            <li className="leading-loose">
              The Individual Disaster Management Plan and Risk Assessment will be reviewed every year or when the participant's circumstances change. If there is any update on
            </li>
          </ul>
        </div>

        {/* Footer - at bottom */}
        <div className="flex justify-between items-center text-xs font-bold mt-6 pt-3 border-t border-gray-200">
          <div>Website: infinitysupportswa.org</div>
          <div>CF008A</div>
          <div>Review Date: 14/03/2026</div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page7;
