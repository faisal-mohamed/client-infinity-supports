// Helper function to fetch form titles for email notifications
import { prisma } from './prisma';

export interface FormWithTitle {
  id: number;
  formId: number;
  title: string;
}

/**
 * Fetch form titles for email notifications
 */
export async function getFormsWithTitles(
  formSubmissionIds: number[]
): Promise<FormWithTitle[]> {
  try {
    console.log(`🔍 Fetching form titles for submissions:`, formSubmissionIds);

    const formSubmissions = await prisma.formSubmission.findMany({
      where: {
        id: { in: formSubmissionIds }
      },
      include: {
        form: {
          select: {
            id: true,
            title: true,
            formKey: true
          }
        }
      }
    });

    const formsWithTitles = formSubmissions.map(submission => ({
      id: submission.id,
      formId: submission.formId,
      title: submission.form.title || `Form ${submission.formId}`
    }));

    console.log(`✅ Retrieved form titles:`, formsWithTitles);
    return formsWithTitles;

  } catch (error) {
    console.error('❌ Failed to fetch form titles:', error);
    
    // Fallback: return basic structure with generic titles
    return formSubmissionIds.map((id, index) => ({
      id,
      formId: 1, // Default form ID
      title: `Form ${index + 1}`
    }));
  }
}

/**
 * Get form title by form ID (fallback method)
 */
export async function getFormTitleById(formId: number): Promise<string> {
  try {
    const form = await prisma.masterForm.findUnique({
      where: { id: formId },
      select: { title: true }
    });

    return form?.title || `Form ${formId}`;
  } catch (error) {
    console.error(`❌ Failed to fetch form title for ID ${formId}:`, error);
    return `Form ${formId}`;
  }
}
