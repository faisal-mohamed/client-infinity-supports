import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { format, parseISO, isValid } from "date-fns";

const Page6 = ({ data, commonFieldsData, settings }: any) => {
  return (
    <A4PageWrapper>
      <div className="h-full flex flex-col p-6">
        {/* Header with Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={"/infinity_logo.png"}
            alt="Infinity Supports WA Logo"
            className="h-16 object-contain"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col text-sm leading-relaxed">
          {/* Intro Paragraph */}
          <p className="mb-6">
            Related to participants Individual Disaster Management Plan and Risk
            Assessment is subject to 73G requirements.
            <br />
            It is the provider's responsibility to document the assessment of
            the participant's risk factors using Intake Form, Support Plan, and
            Participant, Home, and Community Risk Assessment forms.
          </p>

          {/* Responsibilities List */}
          <ul className="list-disc list-inside mb-6 space-y-3">
            <li>
              A copy of the Individual Disaster Management Plan and Risk Assessment will be provided to the participant and another copy should be kept in their file.
            </li>
            <li>
              The Individual Disaster Management Plan and Risk Assessment will be reviewed every year or when the participant’s circumstances change. If there is any update on the Individual Disaster Management Plan and Risk Assessment, a copy of the new Individual Disaster Management Plan and Risk Assessment will be provided to the client and a copy will be kept in their folder.
            </li>
            <li>
              It is the provider’s responsibility to mention the rights and responsibilities of the participant and the provider on the service agreement.
            </li>
            <li>
              Using the Human Resource Management process will assist the provider to ensure that the participant’s support worker has been screened.
            </li>
            <li>
              Participants who are subject to this requirement will be registered on the High-Risk Participant Register and some specific support workers will be delegated to those who are registered on this form
            </li>
          </ul>

          {/* Audit Opt-in/Out Note */}
          <p className="text-sm mb-6 flex-1">
            <span className="text-red-600 font-semibold">
              Infinity Supports WA PTY Ltd
            </span>{" "}
            will be required to complete an audit with NDIS, as a participant
            you may be asked to provide comments and feedback regarding your
            service. This is an OPT IN or OUT option to be completed in the
            following section.{" "}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs font-bold mt-4 pt-3 border-t border-gray-200">
          <div>Website: {settings?.company_website}</div>
          <div>{settings?.participant_risk_assessment}</div>
          <div>
            Review Date:{" "}
            {settings?.review_date &&
            /^\d{4}-\d{2}-\d{2}$/.test(settings.review_date)
              ? format(parseISO(settings.review_date), "dd-MM-yyyy")
              : "N/A"}
          </div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page6;
