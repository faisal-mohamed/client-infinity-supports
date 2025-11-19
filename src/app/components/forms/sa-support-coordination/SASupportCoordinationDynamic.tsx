"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { format, parseISO, isValid } from "date-fns";

// Dynamic SA Support Coordination View - Matches Model PDF with Dynamic Pagination
const SASupportCoordinationDynamic: React.FC<any> = ({ formData, commonFieldsData, images, settings, isReadOnly = true }) => {
  
// Constants for pagination
  const PAGE_BUDGET = 1000; // Available height per page in pixels (1123px - header - footer - padding)
const BLOCK_SPACING = 16; // Space between blocks
  const SAFETY_BUFFER = 100; // Safety margin for header + footer
  
  const commonFieldMapping: Record<string, string> = {
    givenNames: "name",
    surname: "surname", 
    address: "street",
    dob: "dob",
    disability: "disability",
    ndisNumber: "ndis",
    state: "state",
    street: "street",
    postcode: "postCode",
    email: "email",
    phone: "phone",
    mobile: "phone",
    sex: "sex",
    // Note: homePhone is intentionally NOT mapped to allow it to use formData.homePhone
  };

  // Get field value helper function
  const getFieldValue = (key: string): string => {
    let rawValue = commonFieldMapping[key]
      ? commonFieldsData?.[commonFieldMapping[key]]
      : formData?.[key];

    // Fallbacks for legacy keys
    if ((rawValue === undefined || rawValue === null || rawValue === "") && key === 'phone') {
      rawValue = formData?.mobile || formData?.homePhone;
    }

    // Convert YYYY-MM-DD to DD-MM-YYYY if valid
    if (typeof rawValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
      const parsed = parseISO(rawValue);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }

    return rawValue ?? "";
  };

  // Helper function to check boolean field values
  const getBooleanFieldValue = (key: string): boolean => {
    const value = getFieldValue(key);
    const rawValue = formData?.[key];
    return value === 'true' || rawValue === true;
  };

  const formatDate = (value: string) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }
    return value;
  };

  // Support categories and costs (from model PDF)
  const supportCategories = [
    "07_001_0106_8_3 Level 1 Support Connection",
    "07_002_0106_8_3 Level 2 Support Coordination", 
    "07_101_0106_6_3 Psychosocial Recovery Coaching"
  ];
  const costPerHr = ["$74.63", "$100.14", "$98.30"];

  // Content blocks for the form - GRANULAR BLOCKS matching Model PDF order
  const contentBlocks = [
    // ===== SECTION 1 =====
    // Block 1: Header + Date
    {
      type: 'header_date',
      height: 100,
      content: () => (
        <div className="mb-4">
          <div className="text-center mb-4">
            <p className="font-bold underline text-sm">SERVICE AGREEMENT SUPPORT COORDINATION</p>
            <p className="font-bold underline text-sm mt-1">SECTION 1</p>
          </div>
          
          <div className="mb-4">
            <span className="font-bold text-xs">Date:</span>
            <div className="border-b border-black inline-block ml-2 min-w-[200px] text-xs">
                  {getFieldValue('date') || ''}
            </div>
          </div>
        </div>
      )
    },

    // Block 2: Participant Details
    {
      type: 'participant_details',
      height: 280,
      content: () => (
        <div className="mb-4">
          <div className="border border-black mb-4">
            <div className="bg-gray-200 border-b border-black p-2 flex justify-between items-center">
              <span className="font-bold text-xs">Participant Details</span>
              <span className="text-xs">
                <span className="font-bold">NDIS Number:</span> {getFieldValue('ndisNumber') || ''}
              </span>
            </div>
            
            <div className="grid grid-cols-2 border-b border-black">
              <div className="border-r border-black p-2">
                <div className="font-bold text-xs mb-1">Surname:</div>
                <div className="border-b border-black min-h-[24px] text-xs">{getFieldValue('surname') || ''}</div>
              </div>
              <div className="p-2">
                <div className="font-bold text-xs mb-1">Given name(s):</div>
                <div className="border-b border-black min-h-[24px] text-xs">{getFieldValue('givenNames') || ''}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 border-b border-black">
              <div className="border-r border-black p-2">
                <div className="font-bold text-xs mb-1">Sex:</div>
                <div className="flex items-center gap-3 flex-wrap">
                  <label className="flex items-center text-xs">
                    <input 
                      type="checkbox" 
                      checked={getFieldValue('sex') === 'Male'} 
                      readOnly 
                      className="mr-1 w-3 h-3 accent-blue-600"
                    />
                    Male
                  </label>
                  <label className="flex items-center text-xs">
                    <input 
                      type="checkbox" 
                      checked={getFieldValue('sex') === 'Female'} 
                      readOnly 
                      className="mr-1 w-3 h-3 accent-blue-600"
                    />
                    Female
                  </label>
                  <label className="flex items-center text-xs">
                    <input 
                      type="checkbox" 
                      checked={getFieldValue('sex') === 'Prefer not to say'} 
                      readOnly 
                      className="mr-1 w-3 h-3 accent-blue-600"
                    />
                    Prefer not to say
                  </label>
                </div>
                <div className="mt-1">
                  <span className="font-bold text-xs">Others:</span>
                  <span className="border-b border-black inline-block ml-1 min-w-[100px] text-xs">
                    {!['Male', 'Female', 'Prefer not to say'].includes(getFieldValue('sex')) ? getFieldValue('sex') : ''}
                  </span>
                </div>
              </div>
              <div className="p-2">
                <div className="font-bold text-xs mb-1">Pronoun:</div>
                <div className="border-b border-black min-h-[24px] text-xs">{getFieldValue('pronoun') || ''}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 border-b border-black">
              <div className="border-r border-black p-2">
                <div className="font-bold text-xs mb-1">Are you of Aboriginal or Torres Strait Islander descent?</div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center text-xs">
                    <input 
                      type="checkbox" 
                      checked={getFieldValue('indigenousDescent') === 'Yes'} 
                      readOnly 
                      className="mr-1 w-3 h-3 accent-blue-600"
                    />
                    Yes
                  </label>
                  <label className="flex items-center text-xs">
                    <input 
                      type="checkbox" 
                      checked={getFieldValue('indigenousDescent') === 'No'} 
                      readOnly 
                      className="mr-1 w-3 h-3 accent-blue-600"
                    />
                    No
                  </label>
                </div>
              </div>
              <div className="p-2">
                <div className="font-bold text-xs mb-1">Preferred name:</div>
                <div className="border-b border-black min-h-[24px] text-xs">{getFieldValue('preferredName') || ''}</div>
              </div>
            </div>

            <div className="p-2">
              <div className="font-bold text-xs mb-1">Date of Birth:</div>
              <div className="border-b border-black inline-block min-w-[200px] text-xs">
                {formatDate(getFieldValue('dob')) || ''}
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Block 3: Residential Address Details
    {
      type: 'residential_address',
      height: 120,
      content: () => (
        <div className="mb-4">
          <div className="border border-black mb-4">
            <div className="bg-gray-200 border-b border-black p-2">
              <span className="font-bold text-xs">Residential Address Details</span>
            </div>
            
            <div className="p-2 border-b border-black">
              <div className="font-bold text-xs mb-1">Number / Street:</div>
              <div className="border-b border-black min-h-[24px] text-xs">{getFieldValue('address') || ''}</div>
            </div>

            <div className="grid grid-cols-2">
              <div className="border-r border-black p-2">
                <div className="font-bold text-xs mb-1">State:</div>
                <div className="border-b border-black min-h-[24px] text-xs">{getFieldValue('state') || 'WA'}</div>
              </div>
              <div className="p-2">
                <div className="font-bold text-xs mb-1">Postcode:</div>
                <div className="border-b border-black min-h-[24px] text-xs">{getFieldValue('postcode') || ''}</div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Block 4: Participant Contact Details
    {
      type: 'contact_details',
      height: 110,
      content: () => (
        <div className="mb-4">
          <div className="border border-black mb-4">
            <div className="bg-gray-200 border-b border-black p-2">
              <span className="font-bold text-xs">Participant Contact Details</span>
            </div>
            
            <div className="p-2 border-b border-black">
              <div className="font-bold text-xs mb-1">Email address:</div>
              <div className="border-b border-black min-h-[24px] text-xs">{getFieldValue('email') || ''}</div>
            </div>

            <div className="grid grid-cols-2">
              <div className="border-r border-black p-2">
                <div className="font-bold text-xs mb-1">Home Phone No:</div>
                <div className="border-b border-black min-h-[24px] text-xs">{getFieldValue('homePhone') || ''}</div>
              </div>
              <div className="p-2">
                <div className="font-bold text-xs mb-1">Mobile No:</div>
                <div className="border-b border-black min-h-[24px] text-xs">{getFieldValue('mobile') || ''}</div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Block 5: Checkbox 1 - No copy requested
    {
      type: 'checkbox_no_copy',
      height: 40,
      content: () => (
        <div className="mb-2">
          <div className="flex items-start">
            <input 
              type="checkbox" 
              checked={getBooleanFieldValue('noCopyRequested')} 
              readOnly 
              className="mr-2 w-4 h-4 accent-blue-600 mt-1"
              aria-label="No copy requested"
            />
            <span className="text-xs leading-relaxed">
              Participant may wish not to receive a copy of this agreement. In this case, they shall tick the dedicated tick box at the end of the service agreement and sign the document.
            </span>
          </div>
        </div>
      )
    },

    // Block 6: Checkbox 2 - Plan attached
    {
      type: 'checkbox_plan_attached',
      height: 30,
      content: () => (
        <div className="mb-2">
          <div className="flex items-start">
            <input 
              type="checkbox" 
              checked={getBooleanFieldValue('planAttached')} 
              readOnly 
              className="mr-2 w-4 h-4 accent-blue-600 mt-1"
              aria-label="Plan attached"
            />
            <span className="text-xs leading-relaxed">
              A copy of the Individual's plan is attached to this Service Agreement.
            </span>
          </div>
        </div>
      )
    },

    // Block 7: Checkbox 3 - Plan not attached
    {
      type: 'checkbox_plan_not_attached',
      height: 30,
      content: () => (
        <div className="mb-2">
          <div className="flex items-start">
            <input 
              type="checkbox" 
              checked={getBooleanFieldValue('planNotAttached')} 
              readOnly 
              className="mr-2 w-4 h-4 accent-blue-600 mt-1"
              aria-label="Plan not attached"
            />
            <span className="text-xs leading-relaxed">
              Individual chooses not to attach their plan.
            </span>
          </div>
        </div>
      )
    },

    // Block 8: Agreement Statement
    {
      type: 'agreement_statement',
      height: 35,
      content: () => (
        <p className="mt-2 mb-4 text-xs leading-relaxed">
          The Parties agree that this Service Agreement is made in line with the funding body which provides the Individual's funding, which aims to:
        </p>
      )
    },

    // Block 9: Numbered list intro
    {
      type: 'intro_list',
      height: 50,
      content: () => (
        <ol className="list-decimal list-inside mb-4 text-xs leading-relaxed">
          <li>
            Support the independence and social and economic participation of people with disability and enable people with a disability to exercise choice and control in the pursuit of their goals and the planning and delivery of their supports.
            </li>
          </ol>
      )
    },

    // Block 10: Schedule of Support Table
    {
      type: 'schedule_table',
      height: 150,
      content: () => (
        <div className="mb-4">
          <p className="font-bold text-sm mb-2 underline">SCHEDULE OF SUPPORT</p>
          <table className="w-full border border-black border-collapse text-xs">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-black p-2 text-left font-bold">Support Category</th>
                <th className="border border-black p-2 text-center font-bold">Weeks</th>
                <th className="border border-black p-2 text-center font-bold">Total<br/>Hours</th>
                <th className="border border-black p-2 text-center font-bold">Cost per<br/>hr</th>
                <th className="border border-black p-2 text-center font-bold">Total<br/>Cost</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i}>
                  <td className="border border-black p-2 align-top">
                    {supportCategories[i-1]}
                  </td>
                  <td className="border border-black p-2 text-center align-top">
                    {getFieldValue(`row${i}_weeks`) || ''}
                  </td>
                  <td className="border border-black p-2 text-center align-top">
                    {getFieldValue(`row${i}_totalHours`) || ''}
                  </td>
                  <td className="border border-black p-2 text-center align-top">
                    {costPerHr[i-1]}
                  </td>
                  <td className="border border-black p-2 text-center align-top">
                    {getFieldValue(`row${i}_totalCost`) ? `$${getFieldValue(`row${i}_totalCost`)}` : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    },

    // Block 11: Schedule explanation paragraphs
    {
      type: 'schedule_explanation',
      height: 140,
      content: () => (
        <div className="mb-4">
          <p className="font-bold text-sm mb-2 underline">SCHEDULE OF SUPPORTS</p>
          <p className="text-xs leading-relaxed mb-2">
            All figures quoted above are based on NDIS pricing. Infinity Supports WA agrees to provide the individual 
            named in Section 1 with the following Support Coordination. The supports and their prices are set out in 
            the Schedule of Supports above. All supports are as per the NDIS Price Guide and are GST inclusive 
            (if applicable) and include the cost of providing the supports. All figures quoted are based on NDIS 
            pricing and the individual's NDIS plan at the time of agreement. Prices, funding totals and hours will 
            be adjusted periodically to reflect changes to NDIS pricing and the individual's NDIS plan.
          </p>
          
          <p className="text-xs leading-relaxed mb-4">
            If changes to the services or their delivery are required, the Parties agree to discuss and review this 
            Service Agreement. The Parties agree that any changes to this Service Agreement will be in writing, signed, 
            and dated by the Parties.
          </p>
            </div>
      )
    },

    // Block 12: Conflict of Interest Question (ALWAYS SHOW)
    {
      type: 'conflict_question',
      height: 50,
      content: () => (
        <div className="mb-4">
          <p className="font-bold text-sm mb-2 underline">CONFLICT OF INTEREST</p>
          <p className="text-xs font-semibold mb-2">Is there a conflict of interest in provider selection?</p>
          <div className="flex items-center gap-4 mt-2">
            {/* YES Option */}
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                formData?.isConflictOfInterest === 'Yes' 
                  ? 'bg-blue-600 border-blue-600' 
                  : 'border-blue-600'
              }`}>
                {formData?.isConflictOfInterest === 'Yes' && (
                  <span className="text-white text-xs font-bold">✓</span>
                )}
              </div>
              <span className="text-xs">Yes</span>
            </div>
            {/* NO Option */}
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                formData?.isConflictOfInterest === 'No' 
                  ? 'bg-blue-600 border-blue-600' 
                  : 'border-blue-600'
              }`}>
                {formData?.isConflictOfInterest === 'No' && (
                  <span className="text-white text-xs font-bold">✓</span>
                )}
              </div>
              <span className="text-xs">No</span>
            </div>
          </div>
        </div>
      )
    },

    // Block 13-14: Conflict details (only show if conflict = "Yes" AND has data)
    ...(formData?.isConflictOfInterest === 'Yes' && getFieldValue('conflictDeclaration') ? [{
      type: 'conflict_declaration',
      height: 60,
      content: () => (
        <div className="mb-4">
          <p className="text-xs leading-relaxed">
            I <span className="border-b-2 border-black px-2 font-semibold">{getFieldValue('conflictDeclaration') || '____________________'}</span> have discussed my Support Coordination requirements and have been given options and full choice and control over the provider I have chosen. I have been given information on the following companies.
          </p>
        </div>
      )
    },
    {
      type: 'conflict_providers_header',
      height: 30,
      content: () => (
        <p className="font-bold text-xs mb-2">Conflict of Interest - Providers Considered:</p>
      )
    }] : []),

    // Block 14-16: Conflict provider options (only if conflict = "Yes" AND has data)
    ...(formData?.isConflictOfInterest === 'Yes' && getFieldValue('conflictOption1') ? [{
      type: 'conflict_provider_1',
      height: 70,
      content: () => (
        <div className="mb-2">
          <p className="font-bold text-xs mb-1">1. Providers Considered:</p>
          <div className="border border-black p-2 min-h-[30px] text-xs">
            {getFieldValue('conflictOption1')}
          </div>
        </div>
      )
    }] : []),

    ...(formData?.isConflictOfInterest === 'Yes' && getFieldValue('conflictOption2') ? [{
      type: 'conflict_provider_2',
      height: 70,
      content: () => (
        <div className="mb-2">
          <p className="font-bold text-xs mb-1">2. Providers Considered:</p>
          <div className="border border-black p-2 min-h-[30px] text-xs">
            {getFieldValue('conflictOption2')}
          </div>
        </div>
      )
    }] : []),

    ...(formData?.isConflictOfInterest === 'Yes' && getFieldValue('conflictOption3') ? [{
      type: 'conflict_provider_3',
      height: 70,
      content: () => (
        <div className="mb-2">
          <p className="font-bold text-xs mb-1">3. Providers Considered:</p>
          <div className="border border-black p-2 min-h-[30px] text-xs">
            {getFieldValue('conflictOption3')}
          </div>
        </div>
      )
    }] : []),

    // Block 17-18: Conflict request and signature (only show if conflict = "Yes" AND has data)
    ...(formData?.isConflictOfInterest === 'Yes' && getFieldValue('conflictDeclaration') ? [{
      type: 'conflict_request',
      height: 40,
      content: () => (
        <p className="text-xs leading-relaxed mb-4">
          I request that Infinity Supports WA manage my Support Coordination as well as my Service Delivery. 
          My choice will be recorded on the Conflict-of-Interest Register.
        </p>
      )
    },
    {
      type: 'conflict_signature_table',
      height: 100,
      content: () => {
        const signature = getFieldValue('signature');
        
        return (
          <table className="w-full border border-black border-collapse text-xs mb-4">
            <tbody>
              <tr>
                <td className="border border-black p-2 font-bold w-1/3">Signed:</td>
                <td className="border border-black p-2">
                  {signature ? (
                    <div className="h-16 flex items-center justify-center py-1">
                      <img 
                        src={signature} 
                        alt="Signature" 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-16"></div>
                  )}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-bold">Print Name:</td>
                <td className="border border-black p-2">{getFieldValue('printName') || ''}</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-bold">Date:</td>
                <td className="border border-black p-2">{formatDate(getFieldValue('signDate')) || ''}</td>
              </tr>
            </tbody>
          </table>
        );
      }
    }] : []),

    // Block 19: ENDING THIS SERVICE AGREEMENT
    {
      type: 'ending_agreement',
      height: 100,
      content: () => (
        <div className="mb-4">
          <h3 className="font-bold text-sm mb-2 underline">ENDING THIS SERVICE AGREEMENT</h3>
          <p className="text-xs leading-relaxed mb-2">
            Should either Party wishes to end this Service Agreement before the cease date they must give 2 weeks' notice in writing.
          </p>
          <p className="text-xs leading-relaxed">
            If either Party seriously breaches this Service Agreement the requirement of notice will be waived.
          </p>
        </div>
      )
    },

    // Block 20: SERVICE PAYMENTS (NDIS)
    {
      type: 'service_payments',
      height: 280,
      content: () => (
        <div className="mb-4">
          <h3 className="font-bold text-sm mb-2 underline">SERVICE PAYMENTS (NDIS)</h3>

          <div className="space-y-2">
            <div className="flex items-start">
              <input 
                type="checkbox" 
                checked={getBooleanFieldValue('selfManaged')} 
                readOnly 
                className="mr-2 w-4 h-4 accent-blue-600 mt-1"
                aria-label="Self-managed funding"
              />
              <span className="text-xs leading-relaxed">
                The Individual has chosen to self-manage the funding for NDIS supports provided under this Service Agreement. After providing those supports, <span className="font-bold text-red-600">Infinity Supports WA</span> will send the Individual an invoice for those supports for the Individual to pay. The Individual will pay the invoice within 7 days.
              </span>
            </div>

            <div className="flex items-start">
              <input 
                type="checkbox" 
                checked={getBooleanFieldValue('nomineeManaged')} 
                readOnly 
                className="mr-2 w-4 h-4 accent-blue-600 mt-1"
                aria-label="Nominee managed funding"
              />
              <span className="text-xs leading-relaxed">
                The Individual's Nominee manages the funding for supports provided under this Service Agreement. After providing those supports, <span className="font-bold text-red-600">Infinity Supports WA</span> will send the Individual's Nominee an invoice for those supports for the Individual's Nominee to pay. The Individual's Nominee will pay the invoice within 7 days.
              </span>
            </div>

            <div className="flex items-start">
              <input 
                type="checkbox" 
                checked={getBooleanFieldValue('ndiaManaged')} 
                readOnly 
                className="mr-2 w-4 h-4 accent-blue-600 mt-1"
                aria-label="NDIA managed funding"
              />
              <span className="text-xs leading-relaxed">
                The Individual has nominated the NDIA to manage the funding for supports provided under this Service Agreement. After providing those supports, <span className="font-bold text-red-600">Infinity Supports WA</span> will claim payment for those supports from the NDIA.
              </span>
            </div>

            <div className="flex items-start">
              <input 
                type="checkbox" 
                checked={getBooleanFieldValue('planManagerManaged')} 
                readOnly 
                className="mr-2 w-4 h-4 accent-blue-600 mt-1"
                aria-label="Plan Manager managed funding"
              />
              <span className="text-xs leading-relaxed">
                The Individual has nominated the Plan Management Provider to manage the funding for NDIS supports provided under this Service Agreement. After providing those services, <span className="font-bold text-red-600">Infinity Supports WA</span> will claim payment for those services from <span className="underline">Registered Plan Management Provider</span>.
              </span>
            </div>
          </div>
        </div>
      )
    },

    // Block 21: Plan Manager Details (only show if planManagerManaged is checked AND has data)
    ...(formData?.planManagerManaged === true && (getFieldValue('planManagerName') || getFieldValue('planManagerEmail')) ? [{
      type: 'plan_manager_details',
      height: 70,
      content: () => (
        <table className="w-full border border-black border-collapse text-xs mb-4">
            <tbody>
              <tr>
                <td className="border border-black p-2 font-bold w-1/3">Plan Manager Name:</td>
                <td className="border border-black p-2">{getFieldValue('planManagerName') || ''}</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-bold">Email:</td>
                <td className="border border-black p-2">{getFieldValue('planManagerEmail') || ''}</td>
              </tr>
            </tbody>
          </table>
      )
    }] : []),

    // Block 22: GOODS AND SERVICES TAX (GST) / NDIS
    {
      type: 'gst_section',
      height: 100,
      content: () => (
        <div className="mb-4">
          <h3 className="font-bold text-sm mb-2 underline">GOODS AND SERVICES TAX (GST) / NDIS</h3>
          <p className="text-xs leading-relaxed">
            For the purposes of GST legislation, the Parties confirm that a supply of supports under this Service Agreement is a supply of one or more of the reasonable and necessary supports specified in the statement included, under subsection 33(2) of the National Disability Insurance Scheme Act 2013 (NDIS Act), in the Participant's NDIS plan currently in effect under section 37 of the NDIS Act.
          </p>
        </div>
      )
    },

    // Block 23: RESPONSIBILITIES OF INFINITY SUPPORTS WA
    {
      type: 'responsibilities_provider',
      height: 300,
      content: () => (
        <div className="mb-4">
          <h3 className="font-bold text-sm mb-2 underline">RESPONSIBILITIES OF INFINITY SUPPORTS WA</h3>
          <p className="text-xs mb-2"><span className="font-bold text-red-600">Infinity Supports WA</span> agrees to:</p>
          <ul className="list-disc list-inside text-xs leading-relaxed space-y-1 ml-2">
            <li>Understand and use your NDIS plan to pursue your goals</li>
            <li>Review the provision of supports with the Individual in line with the applicable requirements</li>
            <li>Connect you with providers, community, mainstream and the government services</li>
            <li>Source information regarding Allied Health professionals</li>
            <li>Build your confidence and skills to use and coordinate your supports</li>
            <li>Communicate openly and honestly in a timely manner</li>
            <li>Treat the Individual with courtesy and respect</li>
            <li>Consult the Individual on decisions about how supports are provided</li>
            <li>Give the Individual information about managing any complaints or disagreements and details of <span className="font-bold text-red-600">Infinity Supports WA</span> cancellation policy (if relevant)</li>
            <li>Listen to the Individual's feedback and resolve problems in a timely manner</li>
            <li>Give the Individual the required notice if <span className="font-bold text-red-600">Infinity Supports WA</span> needs to end the Service Agreement (see 'Ending this Service Agreement' below for more information)</li>
            <li>Protect the Individual's privacy and confidential information</li>
            <li>Provide supports in a manner consistent with all relevant laws, including but not limited to, the National Disability Insurance Scheme Act 2013 and rules, and the Australian Consumer Law; keep accurate records on the supports provided to the Individuals</li>
          </ul>
        </div>
      )
    },

    // Block 24: RESPONSIBILITIES OF INDIVIDUAL
    {
      type: 'responsibilities_individual',
      height: 220,
      content: () => (
        <div className="mb-4">
          <h3 className="font-bold text-sm mb-2 underline">RESPONSIBILITIES OF INDIVIDUAL / INDIVIDUAL'S REPRESENTATIVE</h3>
          <p className="text-xs mb-2">agrees to:</p>
          <ul className="list-disc list-inside text-xs leading-relaxed space-y-1 ml-2">
            <li>Inform <span className="font-bold text-red-600">Infinity Supports WA</span> about how they wish the services to be delivered to meet the Individual's needs</li>
            <li>Treat <span className="font-bold text-red-600">Infinity Supports WA</span> with courtesy and respect</li>
            <li>Talk to <span className="font-bold text-red-600">Infinity Supports WA</span> if the Individual has any concerns about the services being provided</li>
            <li>Give <span className="font-bold text-red-600">Infinity Supports WA</span> the required notice if the Individual needs to end the Service Agreement (see 'Ending this Service Agreement' below for more information), and</li>
            <li>Let the <span className="font-bold text-red-600">Infinity Supports WA</span> know immediately if the Individual's plan/funding is suspended or replaced by a new plan or the Individual's funding ceases</li>
            <li>Will update <span className="font-bold text-red-600">Infinity Supports WA</span> of any changes in circumstances including any changes to living arrangements including addresses, medication, behaviour, contact details or health of the individual which may affect service provision</li>
            <li>The Individual's plan is expected to remain in effect during the period the services are provided; and will immediately notify <span className="font-bold text-red-600">Infinity Supports WA</span> if the Individual's Plan is replaced by a new plan or the Individual's funding ceases</li>
          </ul>
        </div>
      )
    },

    // Block 24b: FEEDBACK, COMPLAINTS AND DISPUTES
    {
      type: 'complaints_disputes',
      height: 150,
      content: () => (
        <div className="mb-4">
          <h3 className="font-bold text-sm mb-2 underline">FEEDBACK, COMPLAINTS AND DISPUTES</h3>
          <p className="text-xs leading-relaxed mb-3">
            If the Individual wishes to give <span className="font-bold text-red-600">Infinity Supports WA</span> feedback OR If the Individual is not happy with the provision of supports and wishes to make a complaint, the Individual can talk to Sharon Mays Director or Anand Sekar Director 0493282661; Email: <a href="mailto:admin@infinitysupportswa.org" className="text-blue-600 underline hover:text-blue-800">admin@infinitysupportswa.org</a>.
          </p>
          <p className="text-xs leading-relaxed">
            If the Individual is not satisfied or does not want to talk to this person, the Individual can contact the National Disability Insurance Agency by calling 1800 800 110, visiting one of their offices in person, or visiting <a href="https://www.ndis.gov.au" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">www.ndis.gov.au</a> for further information. The Individual can contact Department of Communities, Disability Services on (08) 9426 9200, or visiting one of their offices, or visit <a href="https://www.disability.wa.gov.au" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">www.disability.wa.gov.au</a>
          </p>
        </div>
      )
    },

    // Block 24c: EMERGENCY PREPAREDNESS - Part 1 (Header, Intro, Training)
    {
      type: 'emergency_prep_part1',
      height: 240,
      content: () => (
        <div className="mb-4">
          <h3 className="font-bold text-sm mb-2 underline">EMERGENCY PREPAREDNESS</h3>
          
          <p className="text-xs leading-relaxed mb-2">
            <span className="font-bold text-red-600">Infinity Supports WA</span>, will develop a to respond to any unplanned event that can cause:
          </p>
          
          <ul className="list-disc list-inside text-xs leading-relaxed space-y-1 ml-4 mb-3">
            <li>Deaths; or</li>
            <li>Significant injuries to employees or occupants; and/or</li>
            <li>Shut down the business; and/or</li>
            <li>Disruption to operations; and/or</li>
            <li>Physical or environmental damage</li>
          </ul>
          
          <p className="text-xs leading-relaxed mb-3">
            For your peace of mind, all our support workers are trained on how to respond in case of an emergency, and they will receive a copy of your Individual Disaster Management Plan so that they are fully aware of your health condition and the required action plans in case of an emergency.
          </p>
          
          <p className="text-xs leading-relaxed mb-3">
            Individual Disaster Management Plan and Risk Assessment will be developed and signed by <span className="font-bold text-red-600">Infinity Supports WA</span> and the Individual and/or representative. Providers' Responsibility related to participants Individual Disaster Management Plan and Risk Assessment is subject to 73G requirements.
          </p>
          
          <p className="text-xs leading-relaxed">
            It is the provider's responsibility to document the assessment of the participant's risk factors using Intake Form, Support Plan, and Participant, Home, and Community Risk Assessment forms.
          </p>
        </div>
      )
    },

    // Block 24d: EMERGENCY PREP - Bullet 1
    {
      type: 'emergency_prep_bullet1',
      height: 35,
      content: () => (
        <div className="mb-2">
          <ul className="list-disc list-inside text-xs leading-relaxed ml-4">
            <li>A copy of the Individual Disaster Management Plan and Risk Assessment will be provided to the participant and another copy should be kept in their file.</li>
          </ul>
        </div>
      )
    },

    // Block 24e: EMERGENCY PREP - Bullet 2
    {
      type: 'emergency_prep_bullet2',
      height: 60,
      content: () => (
        <div className="mb-2">
          <ul className="list-disc list-inside text-xs leading-relaxed ml-4">
            <li>The Individual Disaster Management Plan and Risk Assessment will be reviewed every year or when the participant's circumstances change. If there is any update on the Individual Disaster Management Plan and Risk Assessment, a copy of the new Individual Disaster Management Plan and Risk Assessment will be provided to the client and a copy will be kept in their folder.</li>
          </ul>
        </div>
      )
    },

    // Block 24f: EMERGENCY PREP - Bullet 3
    {
      type: 'emergency_prep_bullet3',
      height: 35,
      content: () => (
        <div className="mb-2">
          <ul className="list-disc list-inside text-xs leading-relaxed ml-4">
            <li>It is the provider's responsibility to mention the rights and responsibilities of the participant and the provider on the service agreement.</li>
          </ul>
        </div>
      )
    },

    // Block 24g: EMERGENCY PREP - Bullet 4
    {
      type: 'emergency_prep_bullet4',
      height: 35,
      content: () => (
        <div className="mb-2">
          <ul className="list-disc list-inside text-xs leading-relaxed ml-4">
            <li>Using the Human Resource Management process will assist the provider to ensure that the participant's support worker has been screened.</li>
          </ul>
        </div>
      )
    },

    // Block 24h: EMERGENCY PREP - Bullet 5
    {
      type: 'emergency_prep_bullet5',
      height: 40,
      content: () => (
        <div className="mb-2">
          <ul className="list-disc list-inside text-xs leading-relaxed ml-4">
            <li>Participants who are subject to this requirement will be registered on the High-Risk Participant Register and some specific support workers will be delegated to those who are registered on this form.</li>
          </ul>
        </div>
      )
    },

    // Block 24i: EMERGENCY PREP - NDIS Audit
    {
      type: 'emergency_prep_audit',
      height: 50,
      content: () => (
        <div className="mb-4">
          <p className="text-xs leading-relaxed">
            <span className="font-bold text-red-600">Infinity Supports WA PTY Ltd</span> will be required to complete an audit with NDIS, as a participant you may be asked to provide comments and feedback regarding your service. This is an OPT IN or OUT option to be completed in the following section.
          </p>
        </div>
      )
    },

    // Block 27: Consent Table
    {
      type: 'consent_table',
      height: 220,
      content: () => (
        <div className="mb-6">
          <table className="w-full border border-black text-xs mb-6">
            <thead>
              <tr>
                <th className="border border-black text-left p-3 font-bold">Consent</th>
                <th className="border border-black w-32 p-3 font-bold">Response</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-3 align-top">
                  Hereby give consent to Infinity Supports WA to obtain and use images and likeness 
                  of myself on media releases, including social media and promotion.
                </td>
                <td className="border border-black p-3 align-top">
                  <div className="space-y-1">
                    <label className="flex items-center text-xs">
                      <input
                        type="radio"
                        checked={getFieldValue("consentMedia") === "Yes"}
                        readOnly
                        className="mr-2 w-4 h-4 accent-blue-600"
                      />
                      Yes
                    </label>
                    <label className="flex items-center text-xs">
                      <input
                        type="radio"
                        checked={getFieldValue("consentMedia") === "No"}
                        readOnly
                        className="mr-2 w-4 h-4 accent-blue-600"
                      />
                      No
                    </label>
                  </div>
                </td>
              </tr>

              <tr>
                <td className="border border-black p-3 align-top">
                  Hereby give consent to Infinity Supports WA to obtain and use my photograph for the purpose of creating a client profile (and other internal documents).
                </td>
                <td className="border border-black p-3 align-top">
                  <div className="space-y-1">
                    <label className="flex items-center text-xs">
                      <input
                        type="radio"
                        checked={getFieldValue("consentProfile") === "Yes"}
                        readOnly
                        className="mr-2 w-4 h-4 accent-blue-600"
                      />
                      Yes
                    </label>
                    <label className="flex items-center text-xs">
                      <input
                        type="radio"
                        checked={getFieldValue("consentProfile") === "No"}
                        readOnly
                        className="mr-2 w-4 h-4 accent-blue-600"
                      />
                      No
                    </label>
                  </div>
                </td>
              </tr>

              <tr>
                <td className="border border-black p-3 align-top">
                  Hereby give consent to Infinity Supports WA to obtain & share relevant documented 
                  information regarding my service. This may include but not limited to:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Legal Guardian/Next of Kin</li>
                    <li>GP/health care professional</li>
                    <li>Therapy providers</li>
                    <li>Plan Managers</li>
                    <li>Others: <span className="border-b border-black inline-block min-w-[100px]">{getFieldValue('consentInfoShareOthers') || ''}</span></li>
                  </ul>
                </td>
                <td className="border border-black p-3 align-top">
                  <div className="space-y-1">
                    <label className="flex items-center text-xs">
                      <input
                        type="radio"
                        checked={getFieldValue("consentInfoShare") === "Yes"}
                        readOnly
                        className="mr-2 w-4 h-4 accent-blue-600"
                      />
                      Yes
                    </label>
                    <label className="flex items-center text-xs">
                      <input
                        type="radio"
                        checked={getFieldValue("consentInfoShare") === "No"}
                        readOnly
                        className="mr-2 w-4 h-4 accent-blue-600"
                      />
                      No
                    </label>
                  </div>
                </td>
              </tr>

              <tr>
                <td className="border border-black p-3 align-top">
                  I consent to take part in a NDIS audit and my documents be reviewed as required.
                </td>
                <td className="border border-black p-3 align-top">
                  <div className="space-y-1">
                    <label className="flex items-center text-xs">
                      <input
                        type="radio"
                        checked={getFieldValue("consentAudit") === "Yes"}
                        readOnly
                        className="mr-2 w-4 h-4 accent-blue-600"
                      />
                      Yes
                    </label>
                    <label className="flex items-center text-xs">
                      <input
                        type="radio"
                        checked={getFieldValue("consentAudit") === "No"}
                        readOnly
                        className="mr-2 w-4 h-4 accent-blue-600"
                      />
                      No
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    },

    // Block 28: Participant Signature (CONDITIONAL - only if signatureRole = "Participant" AND has signature)
    {
      type: 'signature_participant',
      height: 140,
      content: () => {
        const participantSig = getFieldValue('participantSignature');
        const signatureRole = formData?.signatureRole;
        
        // Only show if signatureRole is "Participant" AND has signature
        if (signatureRole !== 'Participant' || !participantSig) return null;
        
        return (
          <div className="mb-4">
            <div className="border border-black p-3">
              <h4 className="font-bold text-sm mb-3">Participant Signature</h4>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <p className="text-xs mb-1">Signature of participant:</p>
                  <div className="border border-gray-300 p-2 h-16 flex items-center justify-center bg-white">
                    {participantSig ? (
                      <img 
                        src={participantSig} 
                        alt="Participant Signature" 
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No signature</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs mb-1">Date:</p>
                  <div className="border-b border-black h-8 text-xs pt-1">
                    {formatDate(getFieldValue('participantSignatureDate')) || ''}
                  </div>
                </div>
              </div>
              <p className="text-xs">Name: {getFieldValue('participantName') || ''}</p>
              <p className="text-xs italic mt-2">
                I confirm that this agreement has been explained to the person receiving the services (participant) and that they agree to this.
              </p>
            </div>
          </div>
        );
      }
    },

    // Block 29: Nominee Signature (CONDITIONAL - only if signatureRole = "Nominee" AND has signature)
    {
      type: 'signature_nominee',
      height: 150,
      content: () => {
        const nomineeSig = getFieldValue('nomineeSignature');
        const signatureRole = formData?.signatureRole;
        
        // Only show if signatureRole is "Nominee" AND has signature
        if (signatureRole !== 'Nominee' || !nomineeSig) return null;
        
        return (
          <div className="mb-4">
            <div className="border border-black p-3">
              <h4 className="font-bold text-sm mb-3">Nominee Signature</h4>
              <p className="text-xs italic mb-2">
                I confirm this agreement was explained and accepted by the participant. [if signed by a Nominee]
              </p>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <p className="text-xs mb-1">Signature of Nominee:</p>
                  <div className="border border-gray-300 p-2 h-16 flex items-center justify-center bg-white">
                    {nomineeSig ? (
                      <img 
                        src={nomineeSig} 
                        alt="Nominee Signature" 
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No signature</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs mb-1">Date:</p>
                  <div className="border-b border-black h-8 text-xs pt-1">
                    {formatDate(getFieldValue('nomineeSignatureDate')) || ''}
                  </div>
                </div>
              </div>
              <p className="text-xs">Name: {getFieldValue('nomineeName') || ''}</p>
            </div>
          </div>
        );
      }
    },

    // Block 30: Provider Signature
    {
      type: 'signature_provider',
      height: 130,
      content: () => (
        <div className="mb-4">
          <div className="border border-black p-3">
            <h4 className="font-bold text-sm mb-3">Provider Signature</h4>
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <p className="text-xs mb-1">Signature on behalf of Infinity Supports WA:</p>
                {getFieldValue('providerSignature') ? (
                  <img 
                    src={getFieldValue('providerSignature')} 
                    alt="Provider Signature" 
                    className="h-14 max-w-[200px] border border-gray-300"
                  />
                ) : (
                  <div className="border-b border-black h-14"></div>
                )}
              </div>
              <div>
                <p className="text-xs mb-1">Date:</p>
                <div className="border-b border-black h-8 text-xs pt-1">
                  {formatDate(getFieldValue('providerSignatureDate')) || ''}
                </div>
              </div>
            </div>
            <p className="text-xs">Name: {getFieldValue('providerName') || ''}</p>
          </div>
        </div>
      )
    }
  ];

  const measureRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [measuredHeights, setMeasuredHeights] = useState<number[] | null>(null);
  const [windowWidth, setWindowWidth] = useState(0);

  // Build pages using measured heights - smart pagination that fills pages efficiently
  const pages = useMemo(() => {
    const heights = measuredHeights ?? contentBlocks.map(block => block.height);
    
    const pageGroups: number[][] = [];
    let currentPage: number[] = [];
    let currentHeight = 0;
    const effectivePageBudget = PAGE_BUDGET - SAFETY_BUFFER;

    heights.forEach((height, index) => {
      const blockHeight = height + BLOCK_SPACING;
      
      // Check if adding this block would exceed the page budget
      if (currentHeight + blockHeight > effectivePageBudget) {
        // If current page has content, finish it and start a new page
        if (currentPage.length > 0) {
        pageGroups.push(currentPage);
        currentPage = [index];
          currentHeight = blockHeight;
      } else {
          // First block on page is too tall - still add it (will overflow gracefully)
        currentPage.push(index);
          currentHeight = blockHeight;
        }
      } else {
        // Block fits on current page - add it
        currentPage.push(index);
        currentHeight += blockHeight;
      }
    });
    
    // Add the last page if it has content
    if (currentPage.length) {
      pageGroups.push(currentPage);
    }

    return pageGroups;
  }, [measuredHeights, PAGE_BUDGET, SAFETY_BUFFER, BLOCK_SPACING]);

  // Measure actual heights after render
  useEffect(() => {
    const measureHeights = () => {
    const heights = contentBlocks.map((_, i) => {
      const el = measureRefs.current[i];
        if (el) {
          const actualHeight = el.scrollHeight || el.offsetHeight;
          return actualHeight > 0 ? actualHeight : contentBlocks[i].height;
        }
        return contentBlocks[i].height;
    });
    setMeasuredHeights(heights);
    };

    const timer = setTimeout(measureHeights, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Re-measure heights when window is resized
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setMeasuredHeights(null);
    };

    setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    const timer = setTimeout(() => {
      if (windowWidth > 0) {
        const heights = contentBlocks.map((_, i) => {
          const el = measureRefs.current[i];
          if (el) {
            const actualHeight = el.scrollHeight || el.offsetHeight;
            return actualHeight > 0 ? actualHeight : contentBlocks[i].height;
          }
          return contentBlocks[i].height;
        });
        setMeasuredHeights(heights);
      }
    }, 500);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [windowWidth]);

  // A4 Page Component - MATCHES SA Delivery working approach
  const A4Page: React.FC<{ children: React.ReactNode; pageNumber: number; totalPages: number }> = ({ 
    children, 
    pageNumber, 
    totalPages 
  }) => (
    <div
      className="bg-white mx-auto shadow-md"
         style={{ 
        width: "794px",
        height: "1123px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        pageBreakAfter: pageNumber < totalPages ? "always" : "auto",
        boxSizing: 'border-box',
        padding: "30px",
        marginBottom: "20px",
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header with Logo */}
      <div className="flex justify-center mb-0">
        <img
          alt="Infinity Logo"
          src={images?.infinityLogo || "/infinity_logo.png"}
          width={180}
          height={70}
          className="object-contain"
        />
      </div>

      {/* Fixed spacer after header */}
      <div style={{ height: '24px' }} />
      
      {/* Content Area - overflow hidden to prevent scrolling */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>

      {/* Fixed spacer before footer */}
      <div style={{ height: '24px' }} />
      
      {/* Footer - in normal flow like SA Delivery */}
      <div className="flex justify-between text-xs text-gray-600 mt-4 pt-2 border-t">
        <span>Website: {settings?.company_website || ''}</span>
        <span>{settings?.sa_support_coordination || ''}</span>
        <span>Review Date: {settings?.review_date ? formatDate(settings.review_date) : ''}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen print:bg-white">
      <style jsx>{`
        @media print {
          .a4-page {
            box-shadow: none !important;
            margin: 0 !important;
            page-break-after: always;
          }
          .a4-page:last-child {
            page-break-after: auto;
          }
          * {
            box-sizing: border-box;
          }
        }
        
        .a4-page {
          box-sizing: border-box;
          position: relative;
        }
        
        @page {
          size: A4;
          margin: 0;
        }
      `}</style>
      
      {/* Hidden measurement elements */}
      <div style={{ 
        position: 'absolute', 
        left: '-9999px', 
        top: '-9999px',
        width: '794px',
        padding: '30px'
      }}>
        {contentBlocks.map((block, index) => (
          <div key={index} ref={el => { measureRefs.current[index] = el; }} style={{ marginBottom: '16px' }}>
            {block.content()}
          </div>
        ))}
      </div>

      {/* Render paginated content */}
      {pages.map((pageBlockIndices, pageIndex) => (
        <A4Page key={pageIndex} pageNumber={pageIndex + 1} totalPages={pages.length}>
          <div className="space-y-4">
            {pageBlockIndices.map(blockIndex => {
              const block = contentBlocks[blockIndex];
              return (
                <div key={blockIndex}>
                  {block.content()}
                </div>
              );
            })}
          </div>
        </A4Page>
      ))}
    </div>
  );
};

export default SASupportCoordinationDynamic;
