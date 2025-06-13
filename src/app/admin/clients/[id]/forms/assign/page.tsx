import AssignFormsClient from './AssignFormsClient';

export default async function AssignFormsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  return <AssignFormsClient clientId={id} />;
}