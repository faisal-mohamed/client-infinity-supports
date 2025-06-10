import AssignFormsClient from './AssignFormsClient';

export default function AssignFormsPage({ params }: { params: { id: string } }) {
  return <AssignFormsClient clientId={params.id} />;
}
