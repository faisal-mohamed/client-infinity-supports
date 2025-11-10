"use client";

import PDFFormView from '../PDFFormView';
import { useParams } from 'next/navigation';

export default function StaffSupportWorkerView() {
  const { id } = useParams<{ id: string }>();

  return (
    <PDFFormView
      formType="support-worker"
      formTitle="Support Worker"
      apiEndpoint={`/api/staff/${id}/forms/support-worker`}
      pdfEndpoint={`/api/staff/${id}/forms/support-worker/pdf`}
      downloadFilename={(data) => `${data?.staff?.firstName}_${data?.staff?.surname}_support_worker.pdf`}
    />
  );
}
