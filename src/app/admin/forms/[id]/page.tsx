import ViewFormClient from "@/app/admin/forms/[id]/ViewForm";

export default async function ViewFormPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  return <ViewFormClient formId={id} />;
}