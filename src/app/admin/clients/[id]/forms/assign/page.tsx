// import AssignFormsClient from './AssignFormsClient';

export default async function AssignFormsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  return <div>
    <h1>Assign Forms to Client {id}</h1>
  </div>
}