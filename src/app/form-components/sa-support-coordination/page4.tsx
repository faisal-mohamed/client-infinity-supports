import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { format, parseISO, isValid } from "date-fns";

interface Props  {
    data?: any,
  commonFieldsData?: any,
  settings?: any
}

const Page4: React.FC<Props> = ({data, commonFieldsData, settings}) => {
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
          <p className="mb-4">
            specified in the statement included, under subsection 33(2) of the National Disability Insurance Scheme Act 2013 (NDIS Act), in the Participant's NDIS plan currently in effect under section 37 of the NDIS Act.
          </p>

          <p className="mb-2 font-bold underline">RESPONSIBILITIES OF INFINITY SUPPORTS WA</p>
          <p className="mb-3">
            <span className="text-red-600 font-bold">Infinity Supports WA</span> <span className="font-normal">agrees to:</span>
          </p>

          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Understand and use your NDIS plan to pursue your goals</li>
            <li>Review the provision of supports with the Individual in line with the applicable requirements.</li>
            <li>Connect you with providers, community, mainstream and the government services</li>
            <li>Source information regarding Allied Health processionals</li>
            <li>Build your confidence and skills to use and coordinate your supports</li>
            <li>Communicate openly and honestly in a timely manner</li>
            <li>Treat the Individual with courtesy and respect</li>
            <li>Consult the Individual on decisions about how supports are provided</li>
            <li>
              Give the Individual information about managing any complaints or disagreements and details of{" "}
              <span className="text-red-600 font-bold">Infinity Supports WA</span> cancellation policy (if relevant)
            </li>
            <li>Listen to the Individual's feedback and resolve problems in a timely manner.</li>
            <li>
              Give the Individual the required notice if{" "}
              <span className="text-red-600 font-bold">Infinity Supports WA</span> needs to end the Service
              Agreement
            </li>
            <li>Protect the Individual's privacy and confidential information</li>
            <li>
              Provide supports in a manner consistent with all relevant laws, including but not limited to, the National
              Disability Insurance Scheme Act 2013 and rules, and the Australian Consumer Law; keep accurate records on the
              supports provided to the Individuals.
            </li>
          </ul>

          <p className="mb-2 font-bold underline">RESPONSIBILITIES OF INDIVIDUAL / INDIVIDUAL'S REPRESENTATIVE</p>
          <p className="mb-3">agrees to:</p>

          <ul className="list-disc list-inside space-y-2 flex-1">
            <li>
              Inform <span className="text-red-600 font-bold">Infinity Supports WA</span> about how they wish the
              services to be delivered to meet the Individual's needs.
            </li>
            <li>
              Treat <span className="text-red-600 font-bold">Infinity Supports WA</span> with courtesy and respect.
            </li>
            <li>
              Talk to <span className="text-red-600 font-bold">Infinity Supports WA</span> if the Individual has any
              concerns about the services being provided.
            </li>
            <li>
              Give <span className="text-red-600 font-bold">Infinity Supports WA</span> the required notice if the
              Individual needs to end the Service Agreement.
            </li>
          </ul>
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

export default Page4;
