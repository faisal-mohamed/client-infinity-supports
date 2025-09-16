import StaffFormViewClient from './view-client';

export default async function StaffFormViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StaffFormViewClient formKey={id} />;
}


