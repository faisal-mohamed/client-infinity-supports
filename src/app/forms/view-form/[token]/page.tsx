import FormViewClient from './FormViewClient';

export default async function FormViewPage({ params }: { params: Promise<{ token: string }> }) {

  const {token} = await params
  return <FormViewClient token={token} />;
}
