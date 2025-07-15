import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface Page6Props {
  settings?: any;
}

const Page6: React.FC<Page6Props> = ({ settings }) => {
  return (
    <A4PageWrapper>
      <div className="h-full flex flex-col p-6">
        {/* Header with Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={'/infinity_logo.png'}
            alt="Infinity Supports WA Logo"
            className="h-16 object-contain"
          />
        </div>

        {/* Content area - takes up remaining space */}
        <div className="flex-1 text-sm leading-loose text-black font-sans space-y-6">
          {/* Bullet Point */}
          <ul className="list-disc list-inside">
            <li className="leading-loose">
              The Individual's plan is expected to remain in effect during the period the supports are provided and will immediately notify the{" "}
              <span className="text-red-600 font-semibold">Infinity Supports WA</span> if the Individual's plan is replaced by a new plan or the Individual's funding ceases.
            </li>
          </ul>

          {/* Changes Section */}
          <div>
            <p className="mb-3 font-bold leading-loose">Changes to this Schedule of Supports</p>
            <p className="leading-loose">
              If changes to the supports or their delivery are required, the Parties agree to discuss and review the Schedule of Supports. The Parties agree that any changes to the Schedule of Supports will be in writing, signed, and dated by both Parties.
            </p>
          </div>

          {/* Ending Section */}
          <div>
            <p className="mb-3 font-bold leading-loose">Ending this Service Agreement</p>
            <p className="leading-loose">
              Should either Party wishes to end this Service Agreement before the cease date they must give 2 weeks' notice in writing.
              <br />
              If either Party seriously breaches this Service Agreement the requirement of notice will be waived.
            </p>
          </div>

          {/* Feedback Section */}
          <div>
            <p className="mb-3 font-bold leading-loose">Feedback, Complaints, and Disputes</p>
            <p className="mb-4 leading-loose">
              If the Individual wishes to give <span className="text-red-600 font-semibold">Infinity Supports WA</span> feedback or If the Individual is not happy with the provision of supports and wishes to make a complaint, the Individual can talk to <em>Sharon Mays</em> Director or{" "}
              <em>
                <u>Anand Sekar</u>
              </em>{" "}
              Director 0493282661
            </p>
            <p className="mb-4 leading-loose">
              Email:{" "}
              <a href="mailto:admin@infinitysupportswa.org" className="text-blue-700 underline">
                admin@infinitysupportswa.org
              </a>
              . Alternatively, the individual can lodge their complaint or feedback on{" "}
              <a href="http://www.infinitysupportswa.org" className="text-blue-700 underline" target="_blank" rel="noopener noreferrer">
                www.infinitysupportswa.org
              </a>
              .
            </p>
            <p className="leading-loose">
              If the Individual is not satisfied or does not want to talk to this person, the Individual can contact the National Disability Insurance Agency by calling 1800 800 110, visiting one of their offices in person, or visiting{" "}
              <a href="http://www.ndis.gov.au" className="text-blue-700 underline" target="_blank" rel="noopener noreferrer">
                www.ndis.gov.au
              </a>{" "}
              for further information. The Individual can contact Department of Communities, Disability Services on (08) 9426 9200, or visiting one of their offices, or visit{" "}
              <a href="http://www.disability.wa.gov.au" className="text-blue-700 underline" target="_blank" rel="noopener noreferrer">
                www.disability.wa.gov.au
              </a>
              .
            </p>
          </div>
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

export default Page6;
