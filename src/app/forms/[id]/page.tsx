import FormPageClient from './FormPageClient';

export default function FormPage({ params }: { params: { id: string } }) {
  return <FormPageClient params={params} />;
}
