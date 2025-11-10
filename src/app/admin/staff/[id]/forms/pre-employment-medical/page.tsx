"use client";

import PDFFormView from '../PDFFormView';
import { useParams } from 'next/navigation';

export default function StaffPreEmploymentMedicalView() {
  const { id } = useParams<{ id: string }>();

  return (
    <PDFFormView
      formType="pre-employment-medical"
      formTitle="Pre-Employment Medical"
      apiEndpoint={`/api/staff/${id}/forms/pre-employment-medical`}
      pdfEndpoint={`/api/staff/${id}/forms/pre-employment-medical/pdf`}
      downloadFilename={(data) => `${data?.staff?.firstName}_${data?.staff?.surname}_pre_employment_medical.pdf`}
    />
  );
}
