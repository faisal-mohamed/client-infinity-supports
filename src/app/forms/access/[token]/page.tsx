import FormAccessPageClient from './FormAccessPageClient';

export default async function FormAccessPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <FormAccessPageClient token={token} />;
}
