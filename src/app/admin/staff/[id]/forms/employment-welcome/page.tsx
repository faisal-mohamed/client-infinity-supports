"use client";

import PDFFormView from '../PDFFormView';
import { useParams } from 'next/navigation';

export default function StaffEmploymentWelcomeView() {
  const { id } = useParams<{ id: string }>();

  return (
    <PDFFormView
      formType="employment-welcome"
      formTitle="Employee Welcome"
      apiEndpoint={`/api/staff/${id}/forms/employment-welcome`}
      pdfEndpoint={`/api/staff/${id}/forms/employment-welcome/pdf`}
      downloadFilename={(data) => `${data?.staff?.firstName}_${data?.staff?.surname}_employment_welcome.pdf`}
    />
  );
}
