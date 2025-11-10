"use client";

import PDFFormView from '../PDFFormView';
import { useParams } from 'next/navigation';

export default function StaffBullyingTrainingView() {
  const { id } = useParams<{ id: string }>();

  return (
    <PDFFormView
      formType="bullying-training"
      formTitle="Bullying Training"
      apiEndpoint={`/api/staff/${id}/forms/bullying-training`}
      pdfEndpoint={`/api/staff/${id}/forms/bullying-training/pdf`}
      downloadFilename={(data) => `${data?.staff?.firstName}_${data?.staff?.surname}_bullying_training.pdf`}
    />
  );
}

