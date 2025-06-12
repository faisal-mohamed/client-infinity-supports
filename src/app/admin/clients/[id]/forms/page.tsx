import ClientFormsPageClient from './ClientFormsPageClient';
import Link from 'next/link';

export default async function ClientFormsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Client Forms</h1>
        <Link 
          href={`/admin/clients/${id}/forms/access-details`}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
        >
          View Access Details
        </Link>
      </div>
      <ClientFormsPageClient clientId={id} />
    </div>
  );
}

