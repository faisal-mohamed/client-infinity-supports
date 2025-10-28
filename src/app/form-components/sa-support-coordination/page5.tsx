import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { format, parseISO, isValid } from "date-fns";

const Page5 = ({data, commonFieldsData, settings} : any) => {
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
                Will update <span className="text-red-600 font-semibold"  style={{color: 'red'}}>Infinity Supports WA</span> of any changes in circumstances including any changes to living arrangements including addresses, medication, behaviour, contact details or health of the individual which may affect service provision
            </li>
          </ul>

          {/* Plan Note */}
          <p className="mb-6">
The Individual’s plan is expected to remain in effect during the period the services are provided; and will immediately notify <span className="text-red-600 font-semibold"  style={{color: 'red'}}>Infinity Supports WA</span> if the Individual’s Plan is replaced by a new plan or the Individual’s funding ceases.            
          </p>

          {/* Feedback Section */}
          <p className="mb-2 font-bold text-sm uppercase underline">FEEDBACK, COMPLAINTS AND DISPUTES</p>
          <p className="mb-4">
            If the Individual wishes to give <span className="text-red-600 font-semibold">Infinity Supports WA</span> feedback OR is not happy with the provision of supports and wishes to make a complaint, they can talk to <em><u>Sharon Mays</u></em> or <em><u>Anand Sekar</u></em> at 0493282661; Email: <a href="mailto:admin@infinitysupportwa.org" className="text-blue-600 underline">admin@infinitysupportwa.org</a>.
          </p>
          <p className="mb-6">
If the Individual is not satisfied or does not want to talk to this person, the Individual can contact the National Disability Insurance Agency by calling 1800 800 110, visiting one of their offices in person, or visiting www.ndis.gov.au for further information. The Individual can contact Department of Communities, Disability Services on (08) 9426 9200, or visiting one of their offices, or visit www.disability.wa.gov.au          </p>

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
For your peace of mind, all our support workers are trained on how to respond in case of an emergency, and they will receive a copy of your Individual Disaster Management Plan so that they are fully aware of your health condition and the required action plans in case of an emergency. 
Individual Disaster Management Plan and Risk Assessment will be developed and signed by <span className="text-red-600 font-semibold">Infinity Supports WA</span> and the Individual and/or representative. Providers’ Responsibility 
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

export default Page5;
