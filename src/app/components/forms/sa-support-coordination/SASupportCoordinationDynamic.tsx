"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import { saSupportCoordinationSchema, calculateBlockHeight, SchemaBlock } from './schema';

// Dynamic SA Support Coordination View - Schema-based with content-height pagination
const SASupportCoordinationDynamic: React.FC<any> = ({ formData, commonFieldsData, images, settings, isReadOnly = true }) => {
  
  // Constants for pagination - MATCHES SA Delivery form
  const PAGE_BUDGET = 1000; // Available height per page in pixels (1123px - header - footer - padding)
  const BLOCK_SPACING = 16; // Space between blocks
  const SAFETY_BUFFER = 100; // Safety margin for header + footer
  
  const commonFieldMapping: Record<string, string> = {
    givenNames: "name",
    surname: "name", 
    address: "street",
    dob: "dob",
    disability: "disability",
    ndisNumber: "ndis",
    state: "state",
    street: "street",
    postcode: "postCode",
    email: "email",
    phone: "phone",
    homePhone: "phone",
    mobile: "phone",
    sex: "sex",
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

  const formatDate = (value: string) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }
    return value;
  };

  // Support categories and costs (from reference)
  const supportCategories = [
    "07_001_0106_8_3 Level 1 Support Connection",
    "07_002_0106_8_3 Level 2 Support Coordination", 
    "07_101_0106_6_3 Psychosocial Recovery Coaching"
  ];
  const costPerHr = ["$74.63", "$100.14", "$98.30"];

  // Content blocks for the form - GRANULAR BLOCKS for better page filling
  const contentBlocks = [
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
          
          {/* Date Field */}
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
              checked={getFieldValue('noCopyRequested') === 'yes'} 
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
              checked={getFieldValue('planAttached') === 'yes'} 
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
              checked={getFieldValue('planNotAttached') === 'yes'} 
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
                <th className="border border-black p-2 text-center font-bold">Total Hours</th>
                <th className="border border-black p-2 text-center font-bold">Cost per hr</th>
                <th className="border border-black p-2 text-center font-bold">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i}>
                  <td className="border border-black p-2 align-top">
                    {supportCategories[i-1]}
                  </td>
                  <td className="border border-black p-2 text-center align-top">
                    {getFieldValue(`weeks${i}`) || ''}
                  </td>
                  <td className="border border-black p-2 text-center align-top">
                    {getFieldValue(`totalHours${i}`) || ''}
                  </td>
                  <td className="border border-black p-2 text-center align-top">
                    {costPerHr[i-1]}
                  </td>
                  <td className="border border-black p-2 text-center align-top">
                    ${getFieldValue(`totalCost${i}`) || ''}
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
            All figures quoted below! Should read all figures quoted above are based on NDIS. 
            Infinity Supports WA agrees to provide the individual named in Section 1 with the following Support Coordination. 
            The supports and their prices are set out in the Schedule of Supports below (if NDIS). All supports are as per 
            the NDIS Price Guide and are GST inclusive (if applicable) and include the cost of providing the supports. 
            All figures quoted below are based on NDIS pricing and the individual's NDIS plan at the time of agreement. 
            Prices, funding totals and hours will be adjusted periodically to reflect changes to NDIS pricing and the 
            individual's NDIS plan.
          </p>
          
          <p className="text-xs leading-relaxed mb-4">
            If changes to the services or their delivery are required, the Parties agree to discuss and review this 
            Service Agreement. The Parties agree that any changes to this Service Agreement will be in writing, signed, 
            and dated by the Parties.
          </p>
        </div>
      )
    },

    // Block 12: Conflict of Interest Header + Declaration
    {
      type: 'conflict_declaration',
      height: 100,
      content: () => (
        <div className="mb-4">
          <p className="font-bold text-sm mb-2 mt-4">CONFLICT OF INTEREST</p>
          <p className="font-bold text-xs mb-2">Conflict of Interest Declaration:</p>
            <div className="border border-black p-2 min-h-[60px] text-xs">
              {getFieldValue('conflictDeclaration') || ''}
            </div>
        </div>
      )
    },

    // Block 13: Conflict providers header (only if ANY option has data)
    ...(getFieldValue('conflictOption1') || getFieldValue('conflictOption2') || getFieldValue('conflictOption3') ? [{
      type: 'conflict_providers_header',
      height: 30,
      content: () => (
        <p className="font-bold text-xs mb-2">Conflict of Interest - Providers Considered:</p>
      )
    }] : []),

    // Block 14: Conflict provider option 1 (only if has data)
    ...(getFieldValue('conflictOption1') ? [{
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

    // Block 15: Conflict provider option 2 (only if has data)
    ...(getFieldValue('conflictOption2') ? [{
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

    // Block 16: Conflict provider option 3 (only if has data)
    ...(getFieldValue('conflictOption3') ? [{
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

    // Block 17: Conflict request paragraph
    {
      type: 'conflict_request',
      height: 40,
      content: () => (
        <p className="text-xs leading-relaxed mb-4">
          I request that Infinity Supports WA manage my Support Coordination as well as my Service Delivery. 
          My choice will be recorded on the Conflict-of-Interest Register.
        </p>
      )
    },

    // Block 18: Support Coordination Services
    {
      type: 'support_services',
      height: 200,
      content: () => (
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3">Support Coordination Services Include:</h3>
          <div className="space-y-2">
            <div className="flex items-start">
              <input 
                type="checkbox" 
                checked={getFieldValue('supportCoordinationGeneral') === 'yes'} 
                readOnly 
                className="mr-2 w-4 h-4 accent-blue-600 mt-0.5"
                aria-label="General support coordination"
              />
              <span className="text-xs leading-relaxed">
                General support coordination to help you understand and implement your NDIS plan
              </span>
            </div>
            <div className="flex items-start">
              <input 
                type="checkbox" 
                checked={getFieldValue('providerLiaison') === 'yes'} 
                readOnly 
                className="mr-2 w-4 h-4 accent-blue-600 mt-0.5"
                aria-label="Provider liaison"
              />
              <span className="text-xs leading-relaxed">
                Liaison with service providers to ensure quality service delivery
              </span>
            </div>
            <div className="flex items-start">
              <input 
                type="checkbox" 
                checked={getFieldValue('planReview') === 'yes'} 
                readOnly 
                className="mr-2 w-4 h-4 accent-blue-600 mt-0.5"
                aria-label="Plan review"
              />
              <span className="text-xs leading-relaxed">
                Assistance with plan reviews and goal setting
              </span>
            </div>
            <div className="flex items-start">
              <input 
                type="checkbox" 
                checked={getFieldValue('crisisSupport') === 'yes'} 
                readOnly 
                className="mr-2 w-4 h-4 accent-blue-600 mt-0.5"
                aria-label="Crisis support"
              />
              <span className="text-xs leading-relaxed">
                Crisis support and problem-solving assistance
              </span>
            </div>
            <div className="flex items-start">
              <input 
                type="checkbox" 
                checked={getFieldValue('capacityBuilding') === 'yes'} 
                readOnly 
                className="mr-2 w-4 h-4 accent-blue-600 mt-0.5"
                aria-label="Capacity building"
              />
              <span className="text-xs leading-relaxed">
                Capacity building to help you become more independent
              </span>
            </div>
          </div>
        </div>
      )
    },

    // Block 19: Section 3 - Funding Management
    {
      type: 'section3_funding',
      height: 300,
      content: () => (
        <div className="mb-6">
          <table className="w-full border border-black border-collapse text-xs mb-4">
            <tbody>
              <tr>
                <td className="border border-black p-2 font-bold w-1/3">Signed:</td>
                <td className="border border-black p-2">{getFieldValue('signature') || ''}</td>
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

          <div className="space-y-2">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked={getFieldValue('selfManaged') === 'yes'} 
                readOnly 
                className="mr-2 w-4 h-4 accent-blue-600"
                aria-label="Self-managed funding"
              />
              <span className="text-xs">Self-managed funding</span>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked={getFieldValue('nomineeManaged') === 'yes'} 
                readOnly 
                className="mr-2 w-4 h-4 accent-blue-600"
                aria-label="Nominee managed funding"
              />
              <span className="text-xs">Nominee managed funding</span>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked={getFieldValue('ndiaManaged') === 'yes'} 
                readOnly 
                className="mr-2 w-4 h-4 accent-blue-600"
                aria-label="NDIA managed funding"
              />
              <span className="text-xs">NDIA managed funding</span>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked={getFieldValue('planManagerManaged') === 'yes'} 
                readOnly 
                className="mr-2 w-4 h-4 accent-blue-600"
                aria-label="Plan Manager managed funding"
              />
              <span className="text-xs">Plan Manager managed funding</span>
            </div>
          </div>

          <table className="w-full border border-black border-collapse text-xs mt-4">
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
        </div>
      )
    },

    // Block 20: Service Delivery
    {
      type: 'terms_1',
      height: 200,
      content: () => (
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3">Service Delivery</h3>
          <p className="text-xs leading-relaxed">
            All services will be delivered in accordance with NDIS Practice Standards and Quality Indicators. 
            We are committed to providing safe, effective, and person-centered support coordination services 
            that meet your individual needs and goals.
          </p>
        </div>
      )
    },

    // Block 21: Frequency and Duration
    {
      type: 'frequency_duration',
      height: 150,
      content: () => (
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3">Frequency and Duration</h3>
          <div className="space-y-2">
            <div>
              <p className="font-bold text-xs mb-1">Frequency of support coordination sessions:</p>
              <div className="border-b border-black min-h-[20px] text-xs">
                {getFieldValue('frequency') || ''}
              </div>
            </div>
            <div>
              <p className="font-bold text-xs mb-1">Expected duration of engagement:</p>
              <div className="border-b border-black min-h-[20px] text-xs">
                {getFieldValue('duration') || ''}
              </div>
            </div>
          </div>
        </div>
      )
    },

    {
      type: 'pricing',
      height: 120,
      content: () => (
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3">Pricing</h3>
          <p className="text-xs leading-relaxed">
            All support coordination is charged in accordance with the current NDIS Price Guide. 
            Prices are subject to change in line with NDIS pricing updates. We will notify you of 
            any price changes that may affect your service agreement.
          </p>
        </div>
      )
    },

    {
      type: 'terms_2', 
      height: 150,
      content: () => (
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3">Participant Rights and Responsibilities</h3>
          <p className="text-xs leading-relaxed">
            You have the right to receive services that are safe, respectful, and of high quality. 
            You also have responsibilities including treating staff with respect, providing accurate 
            information, and giving reasonable notice for cancellations.
          </p>
        </div>
      )
    },

    {
      type: 'cancellation',
      height: 120,
      content: () => (
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3">Cancellation Policy</h3>
          <p className="text-xs leading-relaxed">
            We require at least 2 business days notice for cancellations. Cancellations made with 
            less notice may be charged in accordance with NDIS guidelines.
          </p>
        </div>
      )
    },

    {
      type: 'complaints',
      height: 130,
      content: () => (
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3">Complaints and Feedback</h3>
          <p className="text-xs leading-relaxed">
            We welcome feedback and take all complaints seriously. You can raise concerns with your 
            support coordinator, our management team, or external bodies such as the NDIS Quality and 
            Safeguards Commission.
          </p>
        </div>
      )
    },

    {
      type: 'terms_3',
      height: 150, 
      content: () => (
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3">Privacy and Confidentiality</h3>
          <p className="text-xs leading-relaxed">
            We are committed to protecting your privacy and maintaining confidentiality of your personal 
            information in accordance with privacy legislation and NDIS requirements. Information will 
            only be shared with your consent or as required by law.
          </p>
        </div>
      )
    },

    // Block: Consent Table
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
                  Hereby give consent to Infinity Supports WA to obtain and share relevant documented 
                  information with other service providers and professionals involved in my care.
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
                  Hereby give consent to take part in an NDIS audit and document review if required.
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

    // Block: Participant Signature (separate block)
    {
      type: 'signature_participant',
      height: 140,
      content: () => (
        <div className="mb-4">
          <div className="border border-black p-3">
            <h4 className="font-bold text-sm mb-3">Participant Signature</h4>
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <p className="text-xs mb-1">Signature:</p>
                {getFieldValue('participantSignature') ? (
                  <img 
                    src={getFieldValue('participantSignature')} 
                    alt="Participant Signature" 
                    className="h-14 max-w-[200px] border border-gray-300"
                  />
                ) : (
                  <div className="border-b border-black h-14"></div>
                )}
              </div>
              <div>
                <p className="text-xs mb-1">Date:</p>
                <div className="border-b border-black h-8 text-xs pt-1">
                  {formatDate(getFieldValue('participantSignatureDate')) || ''}
                </div>
              </div>
            </div>
            <p className="text-xs">Name: {getFieldValue('participantName') || ''}</p>
          </div>
        </div>
      )
    },

    // Block: Nominee Signature (separate block)
    {
      type: 'signature_nominee',
      height: 150,
      content: () => (
        <div className="mb-4">
          <div className="border border-black p-3">
            <h4 className="font-bold text-sm mb-3">Nominee Signature</h4>
            <p className="text-xs italic mb-2">
              I confirm this agreement was explained and accepted by the participant. [if signed by a Nominee]
            </p>
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <p className="text-xs mb-1">Signature:</p>
                {getFieldValue('nomineeSignature') ? (
                  <img 
                    src={getFieldValue('nomineeSignature')} 
                    alt="Nominee Signature" 
                    className="h-14 max-w-[200px] border border-gray-300"
                  />
                ) : (
                  <div className="border-b border-black h-14"></div>
                )}
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
      )
    },

    // Block: Provider Signature (separate block)
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

  // Measure actual heights after render - wait for all content to be fully rendered
  useEffect(() => {
    const measureHeights = () => {
    const heights = contentBlocks.map((_, i) => {
      const el = measureRefs.current[i];
        if (el) {
          // Get the actual rendered height including all children
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
      setMeasuredHeights(null); // Reset to trigger re-measurement
    };

    // Set initial width
    setWindowWidth(window.innerWidth);

    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Debounced re-measure after resize
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
        width: "794px", // A4 width in pixels
        height: "1123px", // A4 height in pixels
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
        <span>Website: {settings?.company_website || settings?.from_email || ''}</span>
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
      
      {/* Hidden measurement elements - must match page width for accurate measurements */}
      <div style={{ 
        position: 'absolute', 
        left: '-9999px', 
        top: '-9999px',
        width: '794px', // CRITICAL: Match actual page width for accurate text wrapping
        padding: '30px' // Match page padding
      }}>
        {contentBlocks.map((block, index) => (
          <div key={index} ref={el => { measureRefs.current[index] = el; }} style={{ marginBottom: '12px' }}>
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

