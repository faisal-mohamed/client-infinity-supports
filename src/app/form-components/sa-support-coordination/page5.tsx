import React from "react";
import A4PageWrapper from "./A4PageWrapper";

const Page5: React.FC = () => {
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
          {/* Participant Notification */}
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>
              Let <span className="text-red-600 font-semibold">Infinity Supports WA</span> know immediately if the Individual's plan/funding is suspended or replaced by a new plan or the Individual's funding ceases.
            </li>
            <li>
              Will update <span className="text-red-600 font-semibold">Infinity Supports WA</span> of any changes in circumstances including changes to living arrangements, medication, behaviour, contact details or health.
            </li>
          </ul>

          {/* Plan Note */}
          <p className="mb-6">
            The Individual's plan is expected to remain in effect during the period the services are provided; and will immediately notify <span className="text-red-600 font-semibold">Infinity Supports WA</span> if the Individual's Plan is replaced or ceases.
          </p>

          {/* Feedback Section */}
          <p className="mb-2 font-bold text-sm uppercase underline">FEEDBACK, COMPLAINTS AND DISPUTES</p>
          <p className="mb-4">
            If the Individual wishes to give <span className="text-red-600 font-semibold">Infinity Supports WA</span> feedback OR is not happy with the provision of supports and wishes to make a complaint, they can talk to <em><u>Sharon Mays</u></em> or <em><u>Anand Sekar</u></em> at 0493282661; Email: <a href="mailto:admin@infinitysupportwa.org" className="text-blue-600 underline">admin@infinitysupportwa.org</a>.
          </p>
          <p className="mb-6">
            If not satisfied or unwilling to talk to the above, the Individual can contact the National Disability Insurance Agency (1800 800 110, www.ndis.gov.au) or Department of Communities, Disability Services ((08) 9426 9200, www.disability.wa.gov.au).
          </p>

          {/* Emergency Section */}
          <p className="mb-2 font-bold text-sm uppercase underline">EMERGENCY PREPAREDNESS</p>
          <p className="mb-3">
            <span className="text-red-600 font-semibold">Infinity Supports WA</span> will develop a plan to respond to any unplanned event that may cause:
          </p>
          <ul className="list-disc list-inside space-y-1 mb-6">
            <li>Deaths</li>
            <li>Significant injuries to employees or occupants</li>
            <li>Shut down the business</li>
            <li>Disruption to operations</li>
            <li>Physical or environmental damage</li>
          </ul>

          <p className="mb-6 flex-1">
            All support workers are trained on emergency response and will receive a copy of the Individual Disaster Management Plan. This plan will be signed by <span className="text-red-600 font-semibold">Infinity Supports WA</span> and the Individual or representative.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs font-bold mt-4 pt-3 border-t border-gray-200">
          <div>Website: infinitysupportwa.org</div>
          <div>CF008</div>
          <div>Review Date: 14/03/2026</div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page5;
