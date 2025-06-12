import { getFormSubmissionById } from '@/lib/api-server';
import FormViewPage from './FormViewPage';

export default async function ViewFormSubmission({ params }: { params: Promise<{ id: string, formId: string }> }) {
  const { id, formId } = await params; // ✅ Await the Promise

  const clientId = parseInt(id);
  const formIdInt = parseInt(formId);
  const formVersion = parseInt(formId);

  console.log("formIdInt: ", formIdInt);

  const formSubmission = await getFormSubmissionById(formIdInt, clientId, formVersion);

  return <FormViewPage clientId={clientId} formSubmission={formSubmission} />;
}
