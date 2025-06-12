import { PrismaClient } from '@prisma/client';
import { notFound, redirect } from 'next/navigation';
import FormSubmissionDetails from './FormSubmissionDetails';

const prisma = new PrismaClient();
interface PageProps {
  params: {
    id: string;
    formId: string;
  };
}

export default async function FormSubmissionPage({ params }: PageProps) {
  const clientId = parseInt(params.id);
  const formId = parseInt(params.formId);

  if (isNaN(clientId) || isNaN(formId)) {
    notFound();
  }

  try {
    const formSubmission = await prisma.formSubmission.findUnique({
      where: {
        clientId_formId_formVersion: {
          clientId,
          formId,
          formVersion: 1,
        },
      },
      include: {
        client: true,
        form: true,
      },
    });

    if (!formSubmission || !formSubmission.isSubmitted) {
      return (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md mb-4">
            <h2 className="text-lg font-semibold mb-2">Form Not Submitted</h2>
            <p>This form has not been submitted by the client yet.</p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
          >
            Go Back
          </button>
        </div>
      );
    }

    return <FormSubmissionDetails formSubmission={formSubmission} />;
  } catch (error) {
    console.error('Error fetching form submission:', error);
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Error</h2>
        <p>Failed to load form submission details.</p>
      </div>
    );
  }
}
