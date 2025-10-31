"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { supportActionPlanSchema, SchemaBlock } from "./schema";

// Dynamic Support Action Plan view with measured pagination, header/footer, and spacing controls
const SupportActionPlanDynamic: React.FC<any> = ({ formData, commonFieldsData, images, settings }) => {
  try { console.log('[SAP View] Using SupportActionPlanDynamic.tsx'); } catch {}

  const commonFieldMapping: Record<string, string> = {
    participantName: "name",
    ndisNumber: "ndis",
    dob: "dob",
    gender: "sex",
    address: "street",
    state: "state",
    postcode: "postCode",
    email: "email",
    phone: "phone",
  };

  const getFieldValue = (key: string): string => {
    const mapped = commonFieldMapping[key];
    const raw = mapped ? commonFieldsData?.[mapped] : formData?.[key];
    return raw ?? "";
  };

  // Small blue-tick checkbox for read-only selections
  const BlueTick: React.FC<{ checked: boolean }> = ({ checked }) => (
    <span
      className="inline-flex items-center justify-center align-middle"
      style={{ width: '12px', height: '12px', border: '1px solid #000', color: '#2563eb', fontSize: '15px', lineHeight: '10px' }}
    >
      {checked ? '✓' : ''}
    </span>
  );

  // Helper: Check if field has value
  const hasValue = (value: string | null | undefined): boolean => {
    if (!value) return false;
    const trimmed = String(value).trim();
    return trimmed !== '' && trimmed !== 'null' && trimmed !== 'undefined';
  };

  // Helper: Conditionally render field only if it has content (saves space)
  const ConditionalField = ({ label, value, required = false }: { label: string; value: string; required?: boolean }) => {
    if (!hasValue(value) && !required) return null;
    return (
      <>
        <div className="font-bold">{label}</div>
        <div 
          className="mb-2 whitespace-pre-wrap break-words" 
          style={{ 
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto'
          }}
        >
          {hasValue(value) ? value : ''}
        </div>
      </>
    );
  };

  // Renderers
  const renderPreferredContact = () => {
    const get = (k: string) => (formData?.[k] ? String(formData[k]) : '');
    const fundingArray: string[] = Array.isArray(formData?.funding)
      ? formData.funding
      : typeof formData?.funding === 'string'
        ? formData.funding.split(',').map((s: string) => s.trim())
        : [];
    const fundingFlags = {
      plan: !!(formData?.funding_plan_managed || fundingArray.includes('Plan managed')),
      self: !!(formData?.funding_self_managed || fundingArray.includes('Self-managed')),
      ndia: !!(formData?.funding_ndia_managed || fundingArray.includes('NDIA managed')),
      other: !!(formData?.funding_other || fundingArray.includes('Other')),
    };
    return (
      <div className="mb-4">
        <div className="font-bold underline text-sm mb-2">2. Preferred Contact (Plan Nominee / Family Member)</div>
        <table className="w-full border border-black border-collapse text-xs">
          <tbody>
            <tr>
              <td className="border border-black px-2 py-2 align-top w-1/2">
                <div className="font-bold text-xs">Name:</div>
                <div className="text-xs" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{get('contactName')}</div>
              </td>
              <td className="border border-black px-2 py-2 align-top w-1/2">
                <div className="font-bold text-xs">Relationship to participant:</div>
                <div className="text-xs" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{get('relationship')}</div>
              </td>
            </tr>
            <tr>
              <td className="border border-black px-2 py-2 align-top" colSpan={2}>
                <div className="font-bold text-xs">Address:</div>
                <div className="text-xs" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{get('contactAddress')}</div>
              </td>
            </tr>
            <tr>
              <td className="border border-black px-2 py-2 align-top w-1/2">
                <div className="font-bold text-xs">Contact phone number:</div>
                <div className="text-xs" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{get('contactPhone')}</div>
              </td>
              <td className="border border-black px-2 py-2 align-top w-1/2">
                <div className="font-bold text-xs">Email Address:</div>
                <div className="text-xs" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{get('contactEmail')}</div>
              </td>
            </tr>
            <tr>
              <td className="border border-black px-2 py-2 align-top" colSpan={2}>
                <div className="font-bold text-xs mb-1">Funding:</div>
                <div className="flex gap-4 text-xs flex-wrap">
                  <label className={`flex items-center gap-1 ${fundingFlags.plan ? 'font-bold' : ''}`}>
                    <BlueTick checked={fundingFlags.plan} /> Plan managed
                  </label>
                  <label className={`flex items-center gap-1 ${fundingFlags.self ? 'font-bold' : ''}`}>
                    <BlueTick checked={fundingFlags.self} /> Self-managed
                  </label>
                  <label className={`flex items-center gap-1 ${fundingFlags.ndia ? 'font-bold' : ''}`}>
                    <BlueTick checked={fundingFlags.ndia} /> NDIA managed
                  </label>
                  <label className={`flex items-center gap-1 ${fundingFlags.other ? 'font-bold' : ''}`}>
                    <BlueTick checked={fundingFlags.other} /> Other
                  </label>
                </div>
                {fundingFlags.other && hasValue(get('fundingOther')) && (
                  <div className="mt-2 text-xs">
                    <div className="font-bold">Other (please specify):</div>
                    <div className="mt-1 whitespace-pre-wrap break-words" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{get('fundingOther')}</div>
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  // Render individual goal row (for splitting across pages)
  const renderGoalRow = (goalKey: string, goalIndex: number, isFirst: boolean) => {
    const mk = (k: string) => (formData?.[k] ? String(formData[k]) : '');
    const goalValue = mk(goalKey);
    
    // Don't render empty goals
    if (!hasValue(goalValue)) return null;
    
    return (
      <div className={isFirst ? "mb-4" : "mb-0"}>
        {isFirst && (
          <div className="font-bold underline text-sm mb-2">3. NDIS Participant's Goals</div>
        )}
        <table className="w-full border border-black border-collapse text-xs" style={{ tableLayout: 'fixed', width: '100%' }}>
          <tbody>
            <tr>
              <td className="border border-black px-2 py-2 align-top font-bold" style={{ width: '20%', wordWrap: 'break-word', overflowWrap: 'break-word' }}>{`Goal ${goalIndex + 1}`}</td>
              <td className="border border-black px-2 py-2 align-top" style={{ width: '80%', wordWrap: 'break-word', overflowWrap: 'break-word', maxWidth: 0 }}>{goalValue}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  // Legacy renderer for goals section (when rendered as single block)
  const renderGoalsSection = () => {
    const mk = (k: string) => (formData?.[k] ? String(formData[k]) : '');
    const goalKeys = ['goal1','goal2','goal3','goal4','goal5','goal6','goal7'];
    const filledGoals = goalKeys.filter(gk => hasValue(mk(gk)));
    
    if (filledGoals.length === 0) return null;
    
    return (
      <div className="mb-4">
        <div className="font-bold underline text-sm mb-2">3. NDIS Participant's Goals</div>
        <table className="w-full border border-black border-collapse text-xs">
          <tbody>
            {goalKeys.map((gk, i) => {
              const goalValue = mk(gk);
              if (!hasValue(goalValue)) return null;
              return (
              <tr key={gk}>
                <td className="border border-black px-2 py-2 align-top w-1/5 font-bold">{`Goal ${i+1}`}</td>
                  <td className="border border-black px-2 py-2 align-top w-4/5" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{goalValue}</td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // Shared helper: Check if Yes
  const isYes = (k: string) => !!formData?.[k];
  
  // Shared helper: Yes/No display component (shows both options)
  const YesNo = ({ k }: { k: string }) => {
    const checked = isYes(k);
    return (
      <span className="inline-flex items-center gap-4 text-xs ml-2">
        <span className="inline-flex items-center gap-1">
          <BlueTick checked={checked} /> Yes
        </span>
        <span className="inline-flex items-center gap-1">
          <BlueTick checked={!checked} /> No
        </span>
      </span>
    );
  };

  const renderCoreSupports = () => {
    const get = (k: string) => (formData?.[k] ? String(formData[k]) : '');
    return (
      <div className="mb-4">
        <div className="mb-3">
          <div className="bg-gray-300 border border-black px-2 py-1 font-bold text-xs">CORE SUPPORTS</div>
          <div className="border border-black border-t-0 p-2 text-xs">
                  <div className="font-bold">4. Support Requirements</div>
            <ConditionalField label="Support Required" value={get('coreSupportText')} />
            <ConditionalField label="Preferred Providers 1" value={get('corePreferredProviders')} />
            <ConditionalField label="Preferred Providers 2" value={get('corePreferredProviders2')} />
            <ConditionalField label="Alternative Providers 1" value={get('coreAlternativeProviders')} />
            <ConditionalField label="Alternative Providers 2" value={get('coreAlternativeProviders2')} />
            <div className="font-bold mt-1">Service Agreement developed/signed? <YesNo k="coreAgreementSigned" /></div>
            <ConditionalField label="Supports have commenced" value={get('coreSupportsCommenced')} />
            <div className="font-bold mt-1">Discussion held with Plan Manager and budget approved? <YesNo k="coreBudgetApproved" /></div>
          </div>
        </div>
      </div>
    );
  };

  const renderCapacityBuilding = () => {
    const get = (k: string) => (formData?.[k] ? String(formData[k]) : '');
    return (
      <div className="mb-4">
        <div className="bg-gray-300 border border-black px-2 py-1 font-bold text-xs">CAPACITY BUILDING</div>
        <div className="border border-black border-t-0 p-2 text-xs">
          <ConditionalField label="Support Required" value={get('capacitySupportText')} />
          <ConditionalField label="Preferred Providers 1" value={get('capacityPreferredProviders')} />
          <ConditionalField label="Preferred Providers 2" value={get('capacityPreferredProviders2')} />
          <ConditionalField label="Alternative Providers 1" value={get('capacityAlternativeProviders')} />
          <ConditionalField label="Alternative Providers 2" value={get('capacityAlternativeProviders2')} />
          <div className="font-bold mt-1">Service Agreement developed/signed? <YesNo k="capacityAgreementSigned" /></div>
          <ConditionalField label="Supports in place at start of plan" value={get('capacitySupportsInPlace')} />
          <ConditionalField label="Are additional assessments required?" value={get('capacityAssessmentRequired')} />
          <ConditionalField label="If Yes - Actions" value={get('capacityActions')} />
          <div className="font-bold mt-1">Discussion held with Plan Manager and budget approved? <YesNo k="capacityBudgetApproved" /></div>
        </div>
      </div>
    );
  };

  const renderSupportRequirementsQuestion = () => (
    <div className="mb-4">
      <table className="w-full border border-black border-collapse text-xs" style={{ tableLayout: 'fixed', width: '100%' }}>
        <tbody>
          <tr className="bg-blue-200">
            <td 
              className="border border-black px-2 py-2 font-bold"
              style={{ 
                wordWrap: 'break-word', 
                overflowWrap: 'break-word', 
                whiteSpace: 'normal',
                width: '100%',
                maxWidth: 0 // Force table cell to wrap
              }}
            >
              4. Consider, what support is required to assist you to achieve your goals? Are there any barriers preventing you from achieving your goals?
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderCapitalSupports = () => {
    const get = (k: string) => (formData?.[k] ? String(formData[k]) : '');
    return (
      <div className="mb-4">
        <div className="bg-gray-300 border border-black px-2 py-1 font-bold text-xs">CAPITAL</div>
        <div className="border border-black border-t-0 p-2 text-xs">
          <ConditionalField label="Support Required" value={get('supportRequired1')} />
          <ConditionalField label="Preferred Providers 1" value={get('preferredProviders1')} />
          <ConditionalField label="Preferred Providers 2" value={get('preferredProvidersCapital2')} />
          <ConditionalField label="Alternative Providers 1" value={get('alternativeProviders1')} />
          <ConditionalField label="Alternative Providers 2" value={get('alternativeProvidersCapital2')} />
          <div className="font-bold mt-1">Service Agreement developed/signed? <YesNo k="serviceAgreement1" /></div>
          <ConditionalField label="Are additional assessments required to access this support type?" value={get('additionalAssessment1')} />
          <ConditionalField label="If Yes - Actions" value={get('assessmentActions1')} />
          <div className="font-bold mt-1">Discussion held with Plan Manager and budget approved? <YesNo k="planManagerDiscussion1" /></div>
        </div>
      </div>
    );
  };

  const renderMainstreamSupports = () => {
    const get = (k: string) => (formData?.[k] ? String(formData[k]) : '');
    return (
      <div className="mb-4">
        <div className="bg-gray-300 border border-black px-2 py-1 font-bold text-xs">MAINSTREAM SUPPORTS & SERVICES</div>
        <div className="border border-black border-t-0 p-2 text-xs">
          <ConditionalField label="Support Required" value={get('supportRequired2')} />
          <ConditionalField label="Preferred Providers 1" value={get('preferredProviders2')} />
          <ConditionalField label="Preferred Providers 2" value={get('preferredProvidersMainstream2')} />
          <ConditionalField label="Alternative Providers 1" value={get('alternativeProviders2')} />
          <ConditionalField label="Alternative Providers 2" value={get('alternativeProvidersMainstream2')} />
          <div className="font-bold mt-1">Service Agreement developed/signed? <YesNo k="serviceAgreement2" /></div>
          <ConditionalField label="Are additional assessments required to access this support type?" value={get('additionalAssessment2')} />
          <ConditionalField label="If Yes - Actions" value={get('assessmentActions2')} />
          {/* Budget Approval question moved INSIDE MAINSTREAM section */}
          <div className="font-bold mt-1">Discussion held with Plan Manager and budget approved? <YesNo k="budgetApproval" /></div>
        </div>
      </div>
    );
  };

  const renderBudgetApproval = () => {
    return (
      <div className="mb-4">
        <table className="w-full border border-black border-collapse text-xs">
          <tbody>
            <tr>
              <td className="border border-black px-2 py-2 font-bold" colSpan={2}>
                Discussion held with Plan Manager and budget approved?
                <YesNo k="budgetApproval" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderNextPlanGoals = () => {
    const get = (k: string) => (formData?.[k] ? String(formData[k]) : '');
    const goalsText = get('goalsText');
    // Don't render if empty
    if (!goalsText || goalsText.trim() === '') return null;
    return (
      <div className="mb-4">
        <table className="w-full border border-black border-collapse text-xs">
          <tbody>
            <tr className="bg-blue-200">
              <td className="border border-black px-2 py-1 font-bold" colSpan={2}>
                5. Goals and funding required for next plan
              </td>
            </tr>
            <tr>
              <td 
                className="border border-black px-4 py-4 align-top whitespace-pre-wrap break-words" 
                colSpan={2}
                style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
              >
                {goalsText}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderParticipantTable = () => (
    <div className="mb-4">
      <table className="w-full border border-black border-collapse text-xs">
        <tbody>
          <tr className="bg-gray-300">
            <td className="border border-black px-2 py-2 font-bold align-top" colSpan={2}>Participant Details</td>
            <td className="border border-black px-2 py-2 font-bold text-right align-top">NDIS Number: <span className="font-normal">{getFieldValue('ndisNumber') || ''}</span></td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-2 align-top" colSpan={2}>
              <div className="font-bold text-xs">Name:</div>
              <div className="text-xs" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{getFieldValue('participantName') || ''}</div>
            </td>
            <td className="border border-black px-2 py-2 align-top">
              <div className="font-bold text-xs">DOB:</div>
              <div className="text-xs" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{getFieldValue('dob') || ''}</div>
            </td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-2 align-top w-1/2">
              <div className="font-bold text-xs">Address:</div>
              <div className="text-xs" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{getFieldValue('address') || ''}</div>
            </td>
            <td className="border border-black px-2 py-2 align-top w-1/4">
              <div className="font-bold text-xs">Gender:</div>
              <div className="text-xs" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{getFieldValue('gender') || ''}</div>
            </td>
            <td className="border border-black px-2 py-2 align-top w-1/4">
              <div className="font-bold text-xs">Phone:</div>
              <div className="text-xs" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{getFieldValue('phone') || ''}</div>
            </td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-2 align-top">
              <div className="font-bold text-xs">State:</div>
              <div className="text-xs" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{getFieldValue('state') || ''}</div>
            </td>
            <td className="border border-black px-2 py-2 align-top">
              <div className="font-bold text-xs">Postcode:</div>
              <div className="text-xs" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{getFieldValue('postcode') || ''}</div>
            </td>
            <td className="border border-black px-2 py-2 align-top">
              <div className="font-bold text-xs">Email address:</div>
              <div className="text-xs" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{getFieldValue('email') || ''}</div>
            </td>
          </tr>
          {Boolean(formData?.planDates) && (
            <tr>
              <td className="border border-black px-2 py-2 align-top" colSpan={3}>
                <div className="font-bold text-xs">Plan Dates:</div>
                <div className="text-xs" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{String(formData?.planDates)}</div>
              </td>
            </tr>
          )}
          {Boolean(formData?.preferredContactPerson) && (
            <tr>
              <td className="border border-black px-2 py-2 align-top" colSpan={3}>
                <div className="font-bold text-xs">Preferred Contact Person:</div>
                <div className="text-xs" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{String(formData?.preferredContactPerson)}</div>
              </td>
            </tr>
          )}
          {Boolean(formData?.communicationConsiderations) && (
            <tr>
              <td className="border border-black px-2 py-2 align-top" colSpan={3}>
                <div className="font-bold text-xs">Communication considerations:</div>
                <div className="text-xs" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{String(formData?.communicationConsiderations)}</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  // Format date from ISO format to dd/MM/yyyy
  const formatDateValue = (value: string | null | undefined): string => {
    if (!value) return '___/___/____';
    // Check if it's ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
    if (typeof value === 'string') {
      const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (isoMatch) {
        const [, year, month, day] = isoMatch;
        return `${day}/${month}/${year}`;
      }
      // If already formatted, return as is
      if (value.includes('/')) return value;
    }
    return value || '___/___/____';
  };

  const renderSignatureGroup = (block: SchemaBlock) => {
    const meta = block.meta || {};
    const sigValue = getFieldValue(meta.signatureKey || '');
    // Get date directly from formData - check both old and new field names
    const dateKey = meta.dateKey || '';
    let dateValue = formData?.[dateKey] || '';
    
    // Handle API field name mismatches:
    // API returns participantSignatureDate but schema expects participantDate
    // API returns providerSignatureDate but schema expects authorDate
    if (!dateValue && dateKey === 'participantDate') {
      dateValue = formData?.['participantSignatureDate'] || '';
    }
    if (!dateValue && dateKey === 'authorDate') {
      dateValue = formData?.['providerSignatureDate'] || formData?.['authorSignatureDate'] || '';
    }
    
    const formattedDate = formatDateValue(dateValue);
    return (
      <div key={meta.title || 'signature'} className="mb-4">
        {meta.title && (
          <div className="mb-2">
            <h4 className="font-bold text-sm">{meta.title}</h4>
          </div>
        )}
        <table className="w-full border border-black" style={{ fontSize: '13px' }}>
          <tbody>
            <tr>
              <td className="border border-black p-4 leading-loose">
                <div className="flex">
                  <div className="w-1/2">
                    <strong>{meta.signatureLabel || 'Signature'}:</strong><br />
                    {sigValue?.startsWith('data:image') ? (
                      <img src={sigValue} alt="Signature" className="h-10 mt-1" />
                    ) : (
                      '__________________'
                    )}
                  </div>
                  <div className="w-1/2">
                    <strong>Date:</strong><br />
                    {formattedDate}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderBlock = (block: SchemaBlock) => {
    switch (block.type) {
      case 'table_participant':
        return renderParticipantTable();
      case 'section_header': {
        // Filter out duplicate section headers that are rendered via custom renderers
        const label = (block.label || '').toLowerCase();
        const duplicateHeaders = ['preferred contact', 'core supports', 'capacity building', 'capital', 'mainstream supports & services', 'goals and funding required for next plan'];
        if (duplicateHeaders.some(h => label.includes(h.toLowerCase()))) {
          return null;
        }
        return (
          <div key={block.label} className="mb-3">
            <p className="font-bold underline text-sm">{block.label}</p>
          </div>
        );
      }
      case 'paragraph':
        return (
          <p key={block.content?.substring(0, 40) || crypto.randomUUID()} className="mb-2 text-sm leading-loose" style={{ fontSize: '14px' }}>
            {block.content || ''}
          </p>
        );
      case 'list':
        return (
          <ul key={(block.items || []).join('|').substring(0, 40)} className="list-disc list-inside space-y-2 text-sm leading-loose mb-4">
            {(block.items || []).map((item, idx) => (<li key={idx}>{item}</li>))}
          </ul>
        );
      case 'text': {
        const value = getFieldValue(block.key || '');
        const valueStr = value && String(value).trim() !== '' ? String(value) : '';
        return (
          <div key={block.key} className="mb-3">
            <div className="bg-gray-300 border border-black px-2 py-1">
              <span className="font-bold text-xs">{block.label}:</span>
            </div>
            <div className="border border-black border-t-0 p-2 bg-white text-xs">
              {valueStr || '__________________'}
            </div>
          </div>
        );
      }
      case 'date': {
        const value = getFieldValue(block.key || '');
        return (
          <div key={block.key} className="mb-3">
            <div className="bg-gray-300 border border-black px-2 py-1">
              <span className="font-bold text-xs">{block.label}:</span>
            </div>
            <div className="border border-black border-t-0 p-2 bg-white text-xs">{value || '___/___/____'}</div>
          </div>
        );
      }
      case 'signature_group':
        return renderSignatureGroup(block);
      default:
        return null;
    }
  };

  // Pagination similar to SADeliverySupportsDynamic
  // Layout/pagination tuning - optimized for better space utilization
  const BLOCK_SPACING = 3;                 // minimal spacing between blocks
  const TOP_SPACER = 20;                   // spacer below logo
  const BOTTOM_SPACER = 20;                // spacer above footer
  const SAFETY_BUFFER = 2;                 // minimal safety margin (allows tighter packing)
  const APPROX_CONTENT_HEIGHT = 1000;      // initial guess; replaced by measured budget (increased for better utilization)
  const [pageBudget, setPageBudget] = useState<number | null>(null);
  const PAGE_BUDGET = (pageBudget ?? APPROX_CONTENT_HEIGHT) - TOP_SPACER - BOTTOM_SPACER;

  // Count empty fields in support sections to estimate height more accurately
  const countEmptyFields = (keys: string[]): number => {
    return keys.filter(k => {
      const val = formData?.[k];
      return !val || String(val).trim() === '';
    }).length;
  };

  // Improved height estimation - more accurate to reduce wasted space
  const estimateHeight = (block: any) => {
    switch (block.type) {
      case 'table_participant': return 220;
      case 'preferred_contact': return 220;
      case 'goal': {
        // Individual goal row - compact height
        const goalValue = formData?.[block.goalKey];
        if (!hasValue(goalValue)) return 0;
        const goalText = String(goalValue);
        // Estimate: header (~20px) + text lines (~18px per line, max ~60px for long text)
        const estimatedLines = Math.min(Math.ceil(goalText.length / 50), 3);
        return 20 + (estimatedLines * 18);
      }
      case 'goals_section': {
        // Legacy: Goals can vary significantly - estimate based on actual goal count
        const goalKeys = ['goal1','goal2','goal3','goal4','goal5','goal6','goal7'];
        const filledGoals = goalKeys.filter(k => hasValue(formData?.[k])).length;
        // Base height + ~35px per filled goal (compact)
        return Math.max(80, 80 + filledGoals * 35);
      }
      case 'support_requirements_question': return 45;
      case 'support_core': {
        // More accurate estimation - subtract ~20px per empty field (tighter)
        const emptyCount = countEmptyFields(['coreSupportText', 'corePreferredProviders', 'corePreferredProviders2', 
          'coreAlternativeProviders', 'coreAlternativeProviders2', 'coreSupportsCommenced']);
        // Reduced minimum and tighter spacing
        return Math.max(150, 300 - (emptyCount * 20));
      }
      case 'support_capacity': {
        const emptyCount = countEmptyFields(['capacitySupportText', 'capacityPreferredProviders', 'capacityPreferredProviders2',
          'capacityAlternativeProviders', 'capacityAlternativeProviders2', 'capacitySupportsInPlace', 
          'capacityAssessmentRequired', 'capacityActions']);
        return Math.max(160, 340 - (emptyCount * 20));
      }
      case 'support_capital': {
        const emptyCount = countEmptyFields(['supportRequired1', 'preferredProviders1', 'preferredProvidersCapital2',
          'alternativeProviders1', 'alternativeProvidersCapital2', 'additionalAssessment1', 'assessmentActions1']);
        return Math.max(150, 300 - (emptyCount * 20));
      }
      case 'support_mainstream': {
        // Budget approval is now inside this section
        const emptyCount = countEmptyFields(['supportRequired2', 'preferredProviders2', 'preferredProvidersMainstream2',
          'alternativeProviders2', 'alternativeProvidersMainstream2', 'additionalAssessment2', 'assessmentActions2']);
        return Math.max(190, 320 - (emptyCount * 20));
      }
      case 'next_plan_goals': {
        const goalsText = formData?.goalsText;
        if (!goalsText || String(goalsText).trim() === '') return 0;
        const len = String(goalsText).length;
        const lines = Math.ceil(len / 85); // Slightly wider lines for better estimation
        return Math.max(50, 40 + lines * 17); // Tighter line height
      }
      case 'section_header': return 30;
      case 'paragraph': {
        const len = (block.content || '').length; 
        if (len === 0) return 0;
        const lines = Math.ceil(len / 85); 
        return 20 + lines * 17;
      }
      case 'list': {
        if (!block.items || block.items.length === 0) return 0;
        return 18 + (block.items || []).length * 16;
      }
      case 'text': return 50;
      case 'date': return 50;
      case 'signature_group': return 110;
      default: return 35;
    }
  };

  // Create schema with individual goal blocks for better pagination
  const goalKeys = ['goal1','goal2','goal3','goal4','goal5','goal6','goal7'];
  const goalBlocks = goalKeys.map((gk, idx) => ({ type: 'goal', goalKey: gk, goalIndex: idx }));
  
  const extendedSchema: any[] = useMemo(() => {
    const baseSchema = [
    { type: 'table_participant' },
    { type: 'preferred_contact' },
      // Insert individual goals instead of goals_section
      ...goalBlocks.filter((_, idx) => {
        const gk = goalKeys[idx];
        return hasValue(formData?.[gk]);
      }),
    { type: 'support_requirements_question' },
    { type: 'support_core' },
    { type: 'support_capacity' },
    { type: 'support_capital' },
      { type: 'support_mainstream' }, // Budget approval is now inside this section
    { type: 'next_plan_goals' },
    ...supportActionPlanSchema
    ];
    return baseSchema;
  }, [formData]);
  const units = useMemo(() => extendedSchema.map((_, i) => i), [extendedSchema]);
  const measureRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [measuredHeights, setMeasuredHeights] = useState<number[] | null>(null);

  const pages = useMemo(() => {
    const heights = measuredHeights ?? units.map((i) => estimateHeight(extendedSchema[i]));
    const out: number[][] = [];
    let current: number[] = [];
    let h = 0;
    
    heights.forEach((bh, idx) => {
      // Skip zero-height blocks (empty content)
      if (bh <= 0) return;
      
      const spacing = current.length > 0 ? BLOCK_SPACING : 0;
      const next = bh + spacing;
      const wouldExceed = h + next + SAFETY_BUFFER > PAGE_BUDGET;
      
      // Improved pagination logic: More aggressive about filling space (like PDF)
      // Only break if we truly cannot fit this block
      if (wouldExceed && current.length > 0) {
        // For small blocks (goals, questions), allow more overflow to fill space
        const overflowThreshold = bh <= 60 ? 20 : bh <= 100 ? 15 : 10;
        if (h + next <= PAGE_BUDGET + overflowThreshold) {
          // Can fit with small overflow - pack it in
          current.push(idx);
          h += next;
        } else {
          // Can't fit even with overflow, start new page
          out.push(current); 
          current = [idx]; 
          h = bh;
        }
      } else { 
        current.push(idx); 
        h += next; 
      }
    });
    
    if (current.length) out.push(current);
    return out;
  }, [measuredHeights, units, PAGE_BUDGET, formData]);

  useEffect(() => {
    const hs = units.map((i) => {
      const el = measureRefs.current[i];
      if (el) return Math.ceil(el.getBoundingClientRect().height);
      return estimateHeight(extendedSchema[i]);
    });
    if (hs.some((x) => x && x > 0)) setMeasuredHeights(hs);
  }, [units]);

  const budgetRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (budgetRef.current) {
      const h = Math.floor(budgetRef.current.getBoundingClientRect().height);
      if (h && h > 0) setPageBudget(h);
    }
  }, []);

  const A4Page = ({ children, pageNumber }: any) => (
    <div
      className="bg-white mx-auto shadow-md"
      style={{ 
        width: "794px", 
        minWidth: "794px", 
        maxWidth: "794px",
        height: "1123px", 
        minHeight: "1123px",
        maxHeight: "1123px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)", 
        pageBreakAfter: "always", 
        boxSizing: 'border-box', 
        padding: "30px", 
        marginBottom: "20px", 
        display: 'flex', 
        flexDirection: 'column',
        transform: 'scale(1)',
        transformOrigin: 'top center'
      }}
    >
      <div className="flex justify-center mb-0">
        <img alt="Infinity Logo" src={images?.infinityLogo || '/infinity_logo.png'} width={180} height={70} className="object-contain" />
      </div>
      <div style={{ height: `${TOP_SPACER}px` }} />
      {pageNumber === 1 && (
        <div className="text-center mb-4">
          <h1 className="text-lg font-bold underline">SUPPORT CO-ORDINATION ACTION PLAN</h1>
        </div>
      )}
      <div className="flex-1 overflow-hidden">{children}</div>
      <div style={{ height: `${BOTTOM_SPACER}px` }} />
      <div className="flex justify-between text-xs text-gray-600 mt-4 pt-2 border-t">
        <span>{settings?.company_website || settings?.from_email || ''}</span>
        <span>{settings?.support_action_plan_id || settings?.support_action_plan || ''}</span>
        <span>Review Date: {settings?.review_date || ''}</span>
      </div>
    </div>
  );

  return (
    <div 
      className="print:p-0"
      style={{ 
        width: '100%',
        maxWidth: '794px',
        margin: '0 auto',
        overflow: 'hidden'
      }}
    >
      {/* Hidden measuring container */}
      <div style={{ position: 'absolute', left: -10000, top: 0, width: '734px', visibility: 'hidden' }} aria-hidden>
        <div style={{ width: '794px', height: '1123px', boxSizing: 'border-box', padding: '30px', display: 'flex', flexDirection: 'column' }}>
          <div className="flex justify-center mb-0"><img alt="Infinity Logo" src={images?.infinityLogo || '/infinity_logo.png'} width={180} height={70} className="object-contain" /></div>
          <div style={{ height: `${TOP_SPACER}px` }} />
          <div ref={budgetRef} style={{ flex: 1 }} />
          <div style={{ height: `${BOTTOM_SPACER}px` }} />
          <div className="flex justify-between text-xs text-gray-600 mt-4 pt-2 border-t"><span>Website:</span><span>SAP001</span><span>Review Date:</span></div>
        </div>
        {extendedSchema.map((b, i) => {
          const isFirstGoal = b.type === 'goal' && (i === 0 || extendedSchema[i-1]?.type !== 'goal');
          return (
          <div key={`m-${i}`} ref={(el) => { measureRefs.current[i] = el; }} style={{ marginBottom: `${BLOCK_SPACING}px` }}>
            {b.type === 'preferred_contact' ? renderPreferredContact() 
                : b.type === 'goal' ? renderGoalRow(b.goalKey, b.goalIndex, isFirstGoal)
              : b.type === 'goals_section' ? renderGoalsSection() 
              : b.type === 'support_requirements_question' ? renderSupportRequirementsQuestion()
              : b.type === 'support_core' ? renderCoreSupports() 
              : b.type === 'support_capacity' ? renderCapacityBuilding() 
              : b.type === 'support_capital' ? renderCapitalSupports()
                : b.type === 'support_mainstream' ? renderMainstreamSupports() // Budget approval is inside this
              : b.type === 'next_plan_goals' ? renderNextPlanGoals()
              : renderBlock(b)}
          </div>
          );
        })}
      </div>

      {/* Render pages */}
      {pages.map((idxs, pageIndex) => (
        <A4Page key={pageIndex} pageNumber={pageIndex + 1}>
          {idxs.map((unitIdx, idxInPage) => {
            const b = extendedSchema[unitIdx];
            const prevUnitIdx = idxInPage > 0 ? idxs[idxInPage - 1] : undefined;
            const isFirstGoal = b.type === 'goal' && (idxInPage === 0 || (prevUnitIdx !== undefined && extendedSchema[prevUnitIdx]?.type !== 'goal'));
            return (
            <div key={`u-${unitIdx}`} style={{ marginBottom: `${BLOCK_SPACING}px` }}>
                {b.type === 'preferred_contact' ? renderPreferredContact() 
                  : b.type === 'goal' ? renderGoalRow(b.goalKey, b.goalIndex, isFirstGoal)
                  : b.type === 'goals_section' ? renderGoalsSection() 
                  : b.type === 'support_requirements_question' ? renderSupportRequirementsQuestion()
                  : b.type === 'support_core' ? renderCoreSupports() 
                  : b.type === 'support_capacity' ? renderCapacityBuilding() 
                  : b.type === 'support_capital' ? renderCapitalSupports()
                  : b.type === 'support_mainstream' ? renderMainstreamSupports() // Budget approval is inside this
                  : b.type === 'next_plan_goals' ? renderNextPlanGoals()
                  : renderBlock(b)}
            </div>
            );
          })}
        </A4Page>
      ))}
    </div>
  );
};

export default SupportActionPlanDynamic;


