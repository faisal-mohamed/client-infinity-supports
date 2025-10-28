

import { format, parseISO, isValid } from "date-fns";

import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface Page8Props {
  settings?: any;
  images: any;
}

const Page8: React.FC<Page8Props> = ({ settings, images }) => {
  return (
    <A4PageWrapper>
      <div
        className="flex flex-col justify-between flex-1 h-full px-6 pt-6 pb-3 text-base text-justify"
        style={{ lineHeight: '2' }}
      >
        {/* Header */}
        <div className="flex justify-center shrink-0 mb-6">
          <img
            src={images?.infinityLogo || '/infinity_logo.png'}
            alt="Infinity Supports WA Logo"
            className="h-16 object-contain"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Opening Paragraph */}
          <p>
            The Individual Disaster Management Plan and Risk Assessment, a copy of the new Individual Disaster Management Plan and Risk Assessment will be provided to the client and a copy will be kept in their folder.
          </p>

          {/* First List */}
          <ul className="pl-5 space-y-4">
            <li>• It is the provider's responsibility to mention the rights and responsibilities of the participant and the provider on the service agreement.</li>
            <li>• Using the Human Resource Management process will assist the provider to ensure that the participant's support worker has been screened.</li>
            <li>• Participants who are subject to this requirement will be registered on the High-Risk Participant Register and some specific support workers will be delegated to those who are registered on this form.</li>
          </ul>

          {/* Section Title */}
          <p className="font-bold">Participant Risk Level Communication</p>

          {/* Second List */}
          <ul className="pl-5 space-y-4">
            <li>• For participants who are subject to this requirement, the implementation of the services mentioned in their services will be reviewed every three months by the Service Operations and should be by someone other than the support workers.</li>
            <li>• The Service Operations will supervise and monitor the performance of the support workers through a face-to-face interview at the participant's home when the support worker is not at home to ensure their performance is consistent with the agreement and the participant's safety and well-being at least every 3 months or when suspicious of any harm to the participant.</li>
            <li>• The Service Operations will provide a report to every key personnel regarding the care and skill with which personal support is being provided to the participant by the support worker after every visit to the participant's home or if there is any complication in service provision.</li>
          </ul>

          {/* Red Notice */}
          <p>
            <span className="text-red-600 font-semibold">Infinity Supports WA PTY Ltd</span> will be required to complete an audit with NDIS. As a participant, you may be asked to provide comments and feedback regarding your service. This is an OPT IN or OUT option to be completed on the consent form.
          </p>
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

export default Page8;
