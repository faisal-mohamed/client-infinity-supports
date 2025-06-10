import FormAccessPageClient from './FormAccessPageClient';

export default function FormAccessPage({ params }: { params: { token: string } }) {
  return <FormAccessPageClient token={params.token} />;
}
