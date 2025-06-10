import ClientFormsPageClient from './ClientFormsPageClient';


export default async function ClientFormsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ClientFormsPageClient clientId={id} />;
}

