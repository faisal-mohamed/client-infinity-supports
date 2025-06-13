import FormPageClient from './FormPageClient';

// export default function FormPage({ params }: { params: { id: string } }) {
//   return <FormPageClient params={params} />;
// }

export default async function FormPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <FormPageClient params={resolvedParams} />;
}
