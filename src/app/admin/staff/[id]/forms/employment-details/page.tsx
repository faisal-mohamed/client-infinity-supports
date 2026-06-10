"use client";

import PDFFormView from '../PDFFormView';
import { useParams } from 'next/navigation';

export default function StaffEmploymentDetailsView() {
  const { id } = useParams<{ id: string }>();

  return (
    <PDFFormView
      formType="employment-details"
      formTitle="Employment Details"
      apiEndpoint={`/api/staff/${id}/forms/employment-details`}
      pdfEndpoint={`/api/staff/${id}/forms/employee-details/pdf`}
      downloadFilename={(data) => `${data?.staff?.firstName}_${data?.staff?.surname}_employment_details.pdf`}
      showAdminSection={true}
    />
  );
}
