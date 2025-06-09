import ViewFormClient from "@/app/admin/forms/[id]/ViewForm";

export default function ViewFormPage({ params }: { params: { id: string } }) {
  return <ViewFormClient formId={params.id} />;
}