


import { format, parseISO, isValid } from "date-fns";

import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface Page7Props {
  settings?: any;
  images: any;
}

const Page7: React.FC<Page7Props> = ({ settings, images }) => {
  return (
    <A4PageWrapper>
      <div
        className="flex flex-col justify-between flex-1 h-full px-6 pt-6 pb-3 text-base text-justify"
        style={{ lineHeight: '2.5' }}
      >
        {/* Header with Logo */}
        <div className="flex justify-center shrink-0">
          <img
            src={images?.infinityLogo || '/infinity_logo.png'}
            alt="Infinity Supports WA Logo"
            className="h-16 object-contain"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 mt-6 space-y-6">
          {/* Heading */}
          <p className="font-bold">Emergency Preparedness</p>

          {/* Description */}
          <p>
            <span className="text-red-600 font-semibold">Infinity Supports WA</span> will develop a plan to respond to any unplanned event that can cause:
          </p>

          {/* Bullet List 1 */}
          <ul className="pl-5 space-y-2">
            <li>• Deaths; or</li>
            <li>• Significant injuries to employees or occupants; and/or</li>
            <li>• Shut down the business; and/or</li>
            <li>• Disruption to operations; and/or</li>
            <li>• Physical or environmental damage</li>
          </ul>

          {/* Paragraphs */}
          <p>
            For your peace of mind, all our support workers are trained on how to respond in case of an emergency, and they will receive a copy of your Individual Disaster Management Plan so that they are fully aware of your health condition and the required action plans in case of an emergency.
          </p>

          <p>
            Individual Disaster Management Plan and Risk Assessment will be developed and signed by <span className="text-red-600 font-semibold">Infinity Supports WA</span> and the Individual and/or representative. Providers' responsibility related to participants’ Individual Disaster Management Plan and Risk Assessment is subject to 73G requirements.
          </p>

          <p>
            It is the provider's responsibility to document the assessment of the participant's risk factors using the Intake Form, Support Plan, and Participant, Home, and Community Risk Assessment forms.
          </p>

          {/* Bullet List 2 */}
          <ul className="pl-5 space-y-3">
            <li>
              • A copy of the Individual Disaster Management Plan and Risk Assessment will be provided to the participant and another copy should be kept in their file.
            </li>
            <li>
              • The Individual Disaster Management Plan and Risk Assessment will be reviewed every year or when the participant's circumstances change. If there is any update on
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-200 text-xs font-bold flex justify-between items-center shrink-0">
          <div>Website: {settings?.company_website}</div>
          <div>{settings?.sa_delivery_of_supports}</div>
 <div>
            Review Date:{" "}
            {settings?.review_date &&
            /^\d{4}-\d{2}-\d{2}$/.test(settings.review_date)
              ? format(parseISO(settings.review_date), "dd-MM-yyyy")
              : "N/A"}
          </div>{" "}        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page7;
