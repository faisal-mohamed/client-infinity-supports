import CompletedFormsClient from './CompletedFormsClient';

export default async function CompletedFormsPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <CompletedFormsClient token={token} />;
}
