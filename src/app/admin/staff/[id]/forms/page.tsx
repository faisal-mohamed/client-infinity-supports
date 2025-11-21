import StaffFormsPageClient from './StaffFormsPageClient';

export default async function StaffFormsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  return <StaffFormsPageClient />;
}

