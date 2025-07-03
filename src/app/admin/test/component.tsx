import React from 'react';

const RiskAssessmentForm = () => {
  // Schema definition - structure and configuration
  const riskAssessmentSchema = {
    "logo": {
      "src": "/infinity_logo.png",
      "alt": "Infinity Supports WA logo with red infinity symbol and text",
      "width": 150,
      "height": 60
    },
    "title": "Home and Visit Risk Assessment",
    "clientInfoFields": [
      {
        "label": "Name:",
        "key": "clientName",
        "type": "text",
        "width": "40%"
      },
      {
        "label": "NDIS Number:",
        "key": "ndisNumber",
        "type": "text",
        "width": "40%"
      },
      {
        "label": "DOB:",
        "key": "dateOfBirth",
        "type": "text",
        "width": "20%"
      },
      {
        "label": "Address:",
        "key": "address",
        "type": "text",
        "colSpan": 3
      },
      {
        "label": "Date of completion of risk assessment:",
        "key": "completionDate",
        "type": "text",
        "colSpan": 3
      }
    ],
    "assessmentSections": [
      {
        "title": "CLIENT AND FAMILY",
        "bgColor": "bg-gray-200",
        "questions": [
          {
            "id": "othersPresent",
            "text": "Will anyone else be present during the visit?",
            "type": "yesno",
            "key": "othersPresent",
            "commentKey": "othersPresentComment"
          },
          {
            "id": "aggressionHistory",
            "text": "Any history of verbal or physical aggression from the client or family?",
            "type": "yesno",
            "key": "aggressionHistory",
            "commentKey": "aggressionHistoryComment"
          },
          {
            "id": "substanceUse",
            "text": "Any history of alcohol or drug use?",
            "subtext": "(If yes, there can be no use of alcohol or use of drugs whilst the staff member is in home)",
            "type": "yesno",
            "key": "substanceUse",
            "commentKey": "substanceUseComment"
          },
          {
            "id": "careDirective",
            "text": "Is there an advanced care directive?",
            "subtext": "(If yes, please add this information to risk assessment and care plan)",
            "type": "yesno",
            "key": "careDirective",
            "commentKey": "careDirectiveComment"
          }
        ]
      },
      {
        "title": "ENVIRONMENT",
        "bgColor": "bg-gray-200",
        "questions": [
          {
            "id": "petRestraint",
            "text": "If there are any pets, has the client agreed to restrain them during the visit?",
            "type": "yesno",
            "key": "petRestraint",
            "commentKey": "petRestraintComment"
          },
          {
            "id": "weapons",
            "text": "Are there any weapons in the home?",
            "subtext": "(If yes, please make sure they are stored appropriately during the visit.)",
            "type": "yesno",
            "key": "weapons",
            "commentKey": "weaponsComment"
          }
        ]
      }
    ],
    "footer": {
      "documentNumber": "Document Number: CF012",
      "website": {
        "url": "http://www.infinitysupportswa.org",
        "text": "www.infinitysupportswa.org"
      },
      "dor": "DOR: 14/03/2026"
    }
  };

  // Values object - actual form data
  const riskAssessmentValues = {
    "clientName": "John Smith",
    "ndisNumber": "43000123456",
    "dateOfBirth": "15/06/1985",
    "address": "123 Main Street, Perth WA 6000",
    "completionDate": "01/07/2025",

    // Assessment answers
    "othersPresent": "yes",
    "othersPresentComment": "Wife will be present during visit",

    "aggressionHistory": "no",
    "aggressionHistoryComment": "",

    "substanceUse": "no",
    "substanceUseComment": "No history reported",

    "careDirective": "yes",
    "careDirectiveComment": "Advanced care directive on file - copy attached",

    "petRestraint": "yes",
    "petRestraintComment": "Two dogs - client agreed to keep in backyard",

    "weapons": "no",
    "weaponsComment": "No weapons present"
  };

  const renderCheckmark = (answer, type) => {
    if (answer === type) {
      return "✓";
    }
    return "";
  };

  const renderClientInfoField = (field, index) => {
    const value = riskAssessmentValues[field.key] || "";

    if (field.colSpan === 3) {
      return (
        <tr key={index}>
          <td className="px-1 py-0.5" colSpan="3" style={{ border: '1px solid black' }}>
            {field.label} <span className="font-medium">{value}</span>
          </td>
        </tr>
      );
    }

    return field;
  };

  const renderClientInfoRow = (fields) => {
    const rowFields = fields.filter(field => field.colSpan !== 3);
    return (
      <tr>
        {rowFields.map((field, index) => {
          const value = riskAssessmentValues[field.key] || "";
          return (
            <td key={index} className="px-1 py-0.5" style={{
              border: '1px solid black',
              width: field.width
            }}>
              {field.label} <span className="font-medium">{value}</span>
            </td>
          );
        })}
      </tr>
    );
  };

  return (
    <div className="bg-white text-black" style={{
      fontFamily: '"Open Sans", sans-serif',
      width: '210mm',
      minHeight: '297mm',
      padding: '20mm',
      margin: '0 auto',
      fontSize: '12px',
      lineHeight: '1.2'
    }}>
      <div className="max-w-none mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-2">
          <img
            alt={riskAssessmentSchema.logo.alt}
            className="object-contain"
            height={riskAssessmentSchema.logo.height}
            src={riskAssessmentSchema.logo.src}
            width={riskAssessmentSchema.logo.width}
          />
        </div>

        {/* Title */}
        <div className="text-center font-semibold mb-6" style={{ fontSize: '12px' }}>
          {riskAssessmentSchema.title}
        </div>

        {/* Client Information Table */}
        <table className="w-full border-collapse mb-6" style={{
          border: '1px solid black',
          fontSize: '10px'
        }}>
          <tbody>
            {/* First row - Name, NDIS Number, DOB */}
            {renderClientInfoRow(riskAssessmentSchema.clientInfoFields.slice(0, 3))}

            {/* Address row */}
            {renderClientInfoField(riskAssessmentSchema.clientInfoFields[3], 3)}

            {/* Completion date row */}
            {renderClientInfoField(riskAssessmentSchema.clientInfoFields[4], 4)}
          </tbody>
        </table>

        {/* Assessment Table */}
        <table className="w-full border-collapse mb-6" style={{
          border: '1px solid black',
          fontSize: '10px'
        }}>
          <thead>
            <tr>
              <th className="px-1 py-0.5 font-bold" style={{
                border: '1px solid black',
                width: '40%'
              }}>
              </th>
              <th className="px-1 py-0.5 text-center font-bold" style={{
                border: '1px solid black',
                width: '7%'
              }}>
                YES
              </th>
              <th className="px-1 py-0.5 text-center font-bold" style={{
                border: '1px solid black',
                width: '7%'
              }}>
                NO
              </th>
              <th className="px-1 py-0.5 font-bold" style={{
                border: '1px solid black',
                width: '46%'
              }}>
                COMMENTS
              </th>
            </tr>
          </thead>
          <tbody>
            {riskAssessmentSchema.assessmentSections.map((section, sectionIndex) => (
              <React.Fragment key={sectionIndex}>
                {/* Section Header */}
                <tr>
                  <td className={`px-1 py-0.5 font-bold uppercase ${section.bgColor}`} colSpan="4" style={{
                    border: '1px solid black',
                    fontSize: '9px'
                  }}>
                    {section.title}
                  </td>
                </tr>

                {/* Section Questions */}
                {section.questions.map((question, questionIndex) => {
                  const answer = riskAssessmentValues[question.key];
                  const comment = riskAssessmentValues[question.commentKey] || "";

                  return (
                    <tr key={questionIndex}>
                      <td className="px-1 py-0.5" style={{ border: '1px solid black' }}>
                        {question.text}
                        {question.subtext && (
                          <>
                            <br/>
                            <em style={{ fontSize: '9px' }}>
                              {question.subtext}
                            </em>
                          </>
                        )}
                      </td>
                      <td className="text-center font-bold" style={{ border: '1px solid black' }}>
                        {renderCheckmark(answer, "yes")}
                      </td>
                      <td className="text-center font-bold" style={{ border: '1px solid black' }}>
                        {renderCheckmark(answer, "no")}
                      </td>
                      <td className="px-1 py-0.5" style={{ border: '1px solid black' }}>
                        {comment}
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex justify-between" style={{ fontSize: '9px' }}>
          <div>{riskAssessmentSchema.footer.documentNumber}</div>
          <a
            className="underline"
            href={riskAssessmentSchema.footer.website.url}
            rel="noopener noreferrer"
            target="_blank"
            style={{ color: '#2563eb' }}
          >
            {riskAssessmentSchema.footer.website.text}
          </a>
          <div>{riskAssessmentSchema.footer.dor}</div>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessmentForm;