import { prisma } from './prisma';

/**
 * Get a form submission by ID with related data
 */
export async function getFormSubmissionById(formId : number, clientId: number, formVersion : number) {
  try {
    const submission = await prisma.formSubmission.findUnique({
      where: { clientId_formId_formVersion: {
          clientId,
          formId,
          formVersion
        }},
      include: {
        client: true,
        form: true,
      },
    });

    if (!submission) {
      throw new Error('Form submission not found');
    }

    return submission;
  } catch (error) {
    console.error('Error fetching form submission:', error);
    throw error;
  }
}

/**
 * Get form schema by ID
 */
export async function getFormSchemaById(formId: number) {
  try {
    const form = await prisma.masterForm.findUnique({
      where: { id: formId },
    });

    if (!form) {
      throw new Error('Form not found');
    }

    return form.schema;
  } catch (error) {
    console.error('Error fetching form schema:', error);
    throw error;
  }
}
