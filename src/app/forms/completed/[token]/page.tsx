import FormCompletionClient from './FormCompletionClient';

export default function FormCompletionPage({ params }: { params: { token: string } }) {
  return <FormCompletionClient token={params.token} />;
}
