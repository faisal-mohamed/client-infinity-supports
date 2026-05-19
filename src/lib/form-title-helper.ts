import { getSubmissionById, getFormById } from "./db/forms";

export interface FormWithTitle {
  id: string;
  formId: string;
  title: string;
}

export async function getFormsWithTitles(formSubmissionIds: string[]): Promise<FormWithTitle[]> {
  try {
    const results = await Promise.all(
      formSubmissionIds.map(async (id) => {
        const submission = await getSubmissionById(id);
        if (!submission) return { id, formId: "", title: `Form ${id}` };
        return { id: submission.id, formId: submission.formId, title: submission.formTitle || `Form ${submission.formId}` };
      })
    );
    return results;
  } catch (error) {
    console.error("Failed to fetch form titles:", error);
    return formSubmissionIds.map((id, index) => ({ id, formId: "", title: `Form ${index + 1}` }));
  }
}

export async function getFormTitleById(formId: string): Promise<string> {
  try {
    const form = await getFormById(formId);
    return form?.title || `Form ${formId}`;
  } catch (error) {
    return `Form ${formId}`;
  }
}
