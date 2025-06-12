import AccessDetailsPageClient from './AccessDetailsPageClient';

export default function AccessDetailsPage({ params }: { params: { id: string } }) {
  return <AccessDetailsPageClient clientId={params.id} />;
}
