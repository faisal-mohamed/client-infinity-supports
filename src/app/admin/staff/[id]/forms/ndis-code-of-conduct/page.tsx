"use client";

import PDFFormView from '../PDFFormView';
import { useParams } from 'next/navigation';

export default function StaffNdisCodeOfConductView() {
  const { id } = useParams<{ id: string }>();

  return (
    <PDFFormView
      formType="ndis-code-of-conduct"
      formTitle="NDIS Code of Conduct"
      apiEndpoint={`/api/staff/${id}/forms/ndis-code-of-conduct`}
      pdfEndpoint={`/api/staff/${id}/forms/ndis-code-of-conduct/pdf`}
      downloadFilename={(data) => `${data?.staff?.firstName}_${data?.staff?.surname}_ndis_code_of_conduct.pdf`}
    />
  );
}

