"use client";

import PDFFormView from '../PDFFormView';
import { useParams } from 'next/navigation';

export default function StaffNdisWorkforceCapabilityView() {
  const { id } = useParams<{ id: string }>();

  return (
    <PDFFormView
      formType="ndis-workforce-capability"
      formTitle="NDIS Workforce Capability"
      apiEndpoint={`/api/staff/${id}/forms/ndis-workforce-capability`}
      pdfEndpoint={`/api/staff/${id}/forms/ndis-workforce/pdf`}
      downloadFilename={(data) => `${data?.staff?.firstName}_${data?.staff?.surname}_ndis_workforce_capability.pdf`}
    />
  );
}
