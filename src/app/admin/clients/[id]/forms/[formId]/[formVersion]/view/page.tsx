// import { getFormSubmissionById } from '@/lib/api-server';
// import FormViewPage from './FormViewPage';

// export default async function ViewFormSubmission({ params }: { params: Promise<{ id: string, formId: string, formVersion: string }> }) {
//   const { id, formId, formVersion } = await params; // ✅ Await the Promise

//   const clientId = parseInt(id);
//   const formIdInt = parseInt(formId);
//   const formVersionInt = parseInt(formId);

//   console.log("formIdInt: ", formIdInt);

//   const formSubmission = await getFormSubmissionById(formIdInt, clientId, formVersionInt);

//   return <FormViewPage clientId={clientId} formSubmission={formSubmission} />;
// }

import React from 'react';

export default function ViewFormPage() {
  return (
    <div>Form View Page</div>
  );
}