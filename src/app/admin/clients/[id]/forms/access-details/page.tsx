
import AccessDetailsPageClient from './AccessDetailsPageClient';

// Option 1: Using async/await (recommended)
export default async function AccessDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  return <AccessDetailsPageClient clientId={id} />;
}
