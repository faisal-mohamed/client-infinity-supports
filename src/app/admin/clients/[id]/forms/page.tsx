import ClientFormsPageClient from './ClientFormsPageClient';

export default function ClientFormsPage({ params }: { params: { id: string } }) {
  // Pass the id directly as a prop instead of the params object
   const clientId = parseInt(params.id);

  if (isNaN(clientId)) {
    // Handle error here, maybe redirect to an error page or show a validation message
    return <div>Error: Invalid client ID</div>;
  }
  return <ClientFormsPageClient clientId={params.id} />;
}
