import { getSubmission, getSubmissionById, getFormById } from "./db/forms";
import { getClientById } from "./db/client";

export async function getFormSubmissionById(formId: string, clientId: string, formVersion: number, instanceNumber: number = 1) {
  const submission = await getSubmission(clientId, formId, formVersion, instanceNumber);
  if (!submission) throw new Error("Form submission not found");

  const client = await getClientById(clientId);
  const form = await getFormById(formId);

  return { ...submission, client, form };
}

export async function getFormSchemaById(formId: string) {
  const form = await getFormById(formId);
  if (!form) throw new Error("Form not found");
  return form;
}
