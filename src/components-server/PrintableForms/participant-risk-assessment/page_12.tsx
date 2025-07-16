

import React from "react";
import A4PageWrapper from "./A4PageWrapper";

const Page12: React.FC<any> = ({data, commonFieldsData, settings, schema} : any) => {
  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full w-full px-6 pt-6 pb-4 font-sans text-[11px]">
        {/* Header */}
       <div className="flex justify-center pt-6 pb-4">
          <img
            src='/infinity_logo.png'
            alt="Infinity Supports WA logo"
            className="h-[60px] w-[150px] object-contain"
          />
        </div>

        {/* Main Content - Takes up full height */}
        <div className="flex-1 flex flex-col">
          <section className="border border-black flex-1 flex flex-col">
            {/* Evacuation Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-black flex-grow">
              <ul className="list-disc list-inside p-4 border-r border-black">
                <li>Leave the building via the nearest safe route.</li>
                <li>Obey all directions from emergency services.</li>
                <li>Move calmly to assembly point</li>
                <li>
                  Follow closely the instructions of emergency services personnel and campus wardens.
                </li>
                <li>Wait for the OK to re-enter the building.</li>
              </ul>
              <ul className="list-disc list-inside p-4">
                <li>
                  Move to the evacuation location in plan and stay there until all clear has been
                  given.
                </li>
                <li>
                  Follow closely the instructions of emergency services personnel and campus warden.
                </li>
              </ul>
            </div>

            {/* Headings */}
            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-black">
              <div className="border-r border-black p-2 font-semibold text-sm bg-gray-200">
                Medical Emergency
              </div>
              <div className="p-2 font-semibold text-sm bg-gray-200">Civil Disturbance</div>
            </div>

            {/* Medical Emergency & Civil Disturbance */}
            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-black flex-grow">
              <div className="p-4 border-r border-black text-sm">
                <p className="mb-2">Assess the situation:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Do not move a participant unless they 
are exposed to a life-threatening 
situation.</li>
                  <li>In emergency situations contact the 
ambulance service by dialling 000 then 
ring supervisor.  </li>
                  <li>Arrange for the ambulance to be met. </li>
                  <li>Remain with the participant and 
administer first aid as appropriate until 
assistance arrives. </li>
                  <li>Follow closely the instructions of 
emergency services personnel.</li>
                </ul>
              </div>
              <div className="p-4 text-sm">
                <ul className="list-disc list-inside space-y-1">
                  <li>Keep well clear of the disturbance and 
do not say or do anything that may 
encourage irrational behaviour. </li>
                  <li>Consider locking down the building to 
prevent unauthorised entry. </li>
                  <li>Follow closely the instructions of 
emergency services personnel and 
campus wardens. .</li>
                  <li>Evacuate the building only if instructed 
to do so by emergency services 
personnel or campus warden </li>
                </ul>
              </div>
            </div>

            {/* Headings */}
            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-black">
              <div className="border-r border-black p-2 font-semibold text-sm bg-gray-200">
                Extreme Weather
              </div>
              <div className="p-2 font-semibold text-sm bg-gray-200">Personal Preparation</div>
            </div>

            {/* Extreme Weather & Personal Preparation */}
            <div className="grid grid-cols-1 md:grid-cols-2 flex-grow">
              <div className="p-4 border-r border-black text-sm">
                <ul className="list-disc list-inside space-y-1">
                  <li>Keep participant informed of situation. </li>
                  <li> Move around premises and turn off 
electrical appliances to ensure safety.</li>
                  <li>Follow closely the instructions of 
emergency services personnel  </li>
                  <li>Evacuate the building only if instructed 
to do so by emergency personnel. </li>
                  <li>Keep in contact with supervisor and 
follow their instructions. </li>
                </ul>
              </div>
              <div className="p-4 text-sm">
                <ul className="list-disc list-inside space-y-1">
                  <li>Know the location of emergency exits in 
your building. </li>
                  <li>Plan an escape route from the premises 
to safe environment.  </li>
                  <li>Identify and familiarise yourself 
evacuation point or a safe location. </li>
                  <li>Familiarise yourself with location of any 
break glass fire alarms.</li>
                  <li>Note location of fire extinguishers.</li>
                  <li>Familiarise yourself with the identity 
and location of the first aid kits. </li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="pt-4 mt-4 flex justify-between text-xs text-black">
          <div  className="flex justify-between text-xs px-2">
            <div>Website: {settings?.company_website}</div>
            <div>{settings?.participant_risk_assessment}</div>
            <div>Review Date: {settings?.review_date}</div>
          </div>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page12;
