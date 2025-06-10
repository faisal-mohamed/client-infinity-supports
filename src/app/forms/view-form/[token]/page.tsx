import FormViewClient from './FormViewClient';

export default function FormViewPage({ params }: { params: { token: string } }) {
  return <FormViewClient token={params.token} />;
}
