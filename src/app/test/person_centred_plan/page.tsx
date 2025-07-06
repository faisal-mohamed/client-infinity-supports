"use client";

import React from "react";

// ✅ SHARED JSON SCHEMA & RESPONSE
const formSchema = {
  pages: {
    page2: {
      title: "Person Centred Plan - Page 2",
      logo: {
        src: "https://storage.googleapis.com/a1aa/image/9b33169b-dbac-464d-e842-f785cdee1cb4.jpg",
        alt: "Infinity Supports WA logo",
        width: 200,
        height: 70
      },
      fields: [
        { label: "Name", key: "name", type: "text" },
        { label: "Address", key: "address", type: "text" },
        { label: "Date of Birth", key: "dob", type: "text" },
        { label: "Parent/guardian", key: "parentGuardian", type: "text" },
        { label: "Address (guardian)", key: "guardianAddress", type: "text" },
        { label: "Contact Number", key: "contactNumber", type: "text" },
        { label: "Disability", key: "disability", type: "text" },
        { label: "NDIS Number", key: "ndisNumber", type: "text" },
        { label: "My Story", key: "myStory", type: "textarea", height: 120 },
        { label: "Strengths", key: "strengths", type: "textarea", height: 80 },
        { label: "Challenges", key: "challenges", type: "textarea", height: 80 },
        { label: "Allergies", key: "allergies", type: "textarea", height: 80 }
      ],
      footer: {
        left: "Website: infinitysupportswa.org",
        center: "CF014",
        right: "Review Date: 14/03/2026"
      }
    },

    page3: {
      title: "Person Centred Plan - Page 3",
      logo: {
        src: "https://storage.googleapis.com/a1aa/image/d38a87ef-f959-43fc-5207-72f3d2994ff2.jpg",
        alt: "Infinity Supports WA logo",
        width: 200,
        height: 80
      },
      fields: [
        { label: "History of Respiratory Depression", key: "respiratoryDepression", type: "textarea", height: 80 },
        { label: "Precautions", key: "precautions", type: "textarea", height: 80 },
        { label: "Health Conditions", key: "healthConditions", type: "textarea", height: 80 },
        { label: "Companion Card", key: "companionCard", type: "text" },
        { label: "Ambulance Cover", key: "ambulanceCover", type: "text" },
        {
          label: "Support required for regular medical & dental checkups",
          key: "medicalDentalSupport",
          type: "checkboxGroup",
          options: ["Yes", "No"],
          note: "(If yes, coordinator to set annual reminders to prompt and assist participant to organize annual health checks)"
        }
      ],
      footer: {
        left: "Website: infinitysupportzwa.org",
        center: "CF014",
        right: "Review Date: 14/03/2026"
      }
    },

    page4: {
      title: "My Goals",
      logo: {
        src: "https://storage.googleapis.com/a1aa/image/dc7369f1-4519-4cf6-27c5-b0ef9c946077.jpg",
        alt: "Infinity Supports WA My Goals",
        width: 150,
        height: 70
      },
      type: "table-view-only",
      key: "goals",
      rows: 6,
      columns: [
        { label: "GOAL", key: "goal" },
        { label: "OUTCOME RATING", key: "outcomeRating" },
        { label: "ACTIONS & RESOURCES", key: "actions" },
        { label: "By Whom", key: "byWhom" },
        { label: "By When", key: "byWhen" },
        { label: "Review Date", key: "reviewDate" }
      ],
      footer: {
        left: "Website: infinitysupportwa.org",
        center: "CF014",
        right: "Review Date: 14/03/2026"
      }
    },

    page5: {
      title: "PBS & Informal Supports",
      logo: {
        src: "https://storage.googleapis.com/a1aa/image/6667ac23-9d3a-4ace-d745-a713bc582bf9.jpg",
        alt: "Infinity Supports WA logo",
        width: 200,
        height: 80
      },
      fields: [
        { label: "PBS Support Plan included?", key: "pbsSupportIncluded", type: "text" },
        { label: "Any Restrictive Practices?", key: "restrictivePractices", type: "text" },
        { label: "Name of organization", key: "organizationName", type: "text" },
        { label: "Contact person", key: "contactPerson", type: "text" },
        { label: "Contact number", key: "contactNumber2", type: "text" }
      ],
      table: {
        key: "informalSupports",
        columns: [
          { label: "INFORMAL SUPPORT", key: "support" },
          { label: "ROLE", key: "role" },
          { label: "FREQUENCY", key: "frequency" }
        ],
        rows: 3
      },
      paragraph: {
        beforeLine: "This plan has been developed during the client intake meeting in conjunction with",
        afterLine: "and people in the family network, supporters and from information gathered on the client intake form.",
        key: "developedWith"
      },
      footer: {
        left: "Website: infinitysupportswa.org",
        center: "CF014",
        right: "Review Date: 14/03/2026"
      }
    }
  }
};

const formResponse = {
  name: "",
  address: "",
  dob: "",
  parentGuardian: "",
  guardianAddress: "",
  contactNumber: "",
  disability: "",
  ndisNumber: "",
  myStory: "",
  strengths: "",
  challenges: "",
  allergies: "",
  respiratoryDepression: "",
  precautions: "",
  healthConditions: "",
  companionCard: "",
  ambulanceCover: "",
  medicalDentalSupport: [],
  goals: Array(6).fill({
    goal: "",
    outcomeRating: "",
    actions: "",
    byWhom: "",
    byWhen: "",
    reviewDate: ""
  }),
  pbsSupportIncluded: "",
  restrictivePractices: "",
  organizationName: "",
  contactPerson: "",
  contactNumber2: "",
  informalSupports: Array(3).fill({
    support: "",
    role: "",
    frequency: ""
  }),
  developedWith: ""
};

const RenderPage = ({ schema, data }) => {
  if (!schema) return null;

  return (
    <div className="bg-white text-black px-6 py-6 max-w-3xl mx-auto">
      <header className="flex justify-center mb-8">
        <img
          src={schema.logo.src}
          alt={schema.logo.alt}
          width={schema.logo.width}
          height={schema.logo.height}
          className="object-contain"
        />
      </header>

      {schema.fields && (
        <table className="w-full border border-black border-collapse mb-6">
          <tbody>
            {schema.fields.map((field) => (
              <tr key={field.key}>
                <td className="border border-black p-2 w-1/3 align-top text-sm">{field.label}</td>
                <td className="border border-black p-2 text-sm h-[80px]">
                  {data[field.key] || ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {schema.type === "table-view-only" && (
        <table className="w-full border border-black border-collapse text-[10px] mb-6">
          <thead>
            <tr className="bg-gray-200">
              {schema.columns.map((col) => (
                <th key={col.key} className="border border-black p-2 text-left font-semibold">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data[schema.key]?.map((row, idx) => (
              <tr key={idx}>
                {schema.columns.map((col) => (
                  <td key={col.key} className="border border-black p-2">
                    {row[col.key] || ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {schema.table && (
        <table className="w-full border border-black border-collapse text-[12px] mb-6">
          <thead>
            <tr className="bg-gray-200">
              {schema.table.columns.map((col) => (
                <th key={col.key} className="border border-black p-2">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data[schema.table.key]?.map((row, idx) => (
              <tr key={idx}>
                {schema.table.columns.map((col) => (
                  <td key={col.key} className="border border-black p-2">
                    {row[col.key] || ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {schema.paragraph && (
        <p className="text-sm mb-6">
          {schema.paragraph.beforeLine}{" "}
          <span className="underline font-semibold">
            {data[schema.paragraph.key] || ""}
          </span>{" "}
          {schema.paragraph.afterLine}
        </p>
      )}

      <footer className="flex justify-between text-xs font-semibold">
        <div>{schema.footer.left}</div>
        <div>{schema.footer.center}</div>
        <div>{schema.footer.right}</div>
      </footer>
    </div>
  );
};

const FullForm = () => {
  return (
    <>
      <RenderPage schema={formSchema.pages.page2} data={formResponse} />
      <RenderPage schema={formSchema.pages.page3} data={formResponse} />
      <RenderPage schema={formSchema.pages.page4} data={formResponse} />
      <RenderPage schema={formSchema.pages.page5} data={formResponse} />
    </>
  );
};

export default FullForm;
export { formSchema, formResponse };
